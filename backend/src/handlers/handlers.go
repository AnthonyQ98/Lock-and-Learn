package handlers

import (
	"context"
	"crypto/aes"
	"crypto/cipher"
	"crypto/rand"
	"database/sql"
	"encoding/base64"
	"encoding/json"
	"io"
	"log"
	"net/http"
	"strconv"
	"time"

	"github.com/anthonyq98/lock-and-learn/src/sqlcustom"
	"github.com/anthonyq98/lock-and-learn/src/utils"
)

type Request struct {
	Text string `json:"text"`
}

type Response struct {
	EncryptedText string `json:"encryptedText,omitempty"`
	DecryptedText string `json:"decryptedText,omitempty"`
}

type QuizResult struct {
	// Define the fields based on the expected JSON structure
	UserID   string  `json:"user_id"`
	QuizType string  `json:"quiz_type"`
	Result   float64 `json:"result"`
}

type QuizStatus struct {
	QuizCompleted    bool `json:"quizCompleted"`
	EndQuizCompleted bool `json:"endQuizCompleted"`
}

func GetResultsHandler() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		log.Printf("Received request to GetResultsHandler")

		oauthid := r.URL.Query().Get("oauthid")
		if oauthid == "" {
			log.Printf("Received a request for quiz results, but did not receive an oauth id")
			return
		}

		log.Printf("oauthid: %s", oauthid)

		db, err := sql.Open("sqlite3", "my.db")
		if err != nil {
			log.Fatal(err)
		}
		defer db.Close()
		log.Printf("db file successfully found & read.")

		queries := sqlcustom.New(db)

		// Create a context with a timeout for database operations
		ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
		defer cancel()

		rows, err := queries.GetResult(ctx, oauthid)
		if err != nil {
			log.Printf("error found when fetching quiz results for user %s: %v", oauthid, err)
		}

		log.Printf("got results from db: %v", rows)

		var status QuizStatus
		for _, res := range rows {
			if res.QuizType == "start" {
				status.QuizCompleted = true
			} else if res.QuizType == "end" {
				status.EndQuizCompleted = true
			}
		}

		log.Printf("%v", status)

		w.Header().Set("Content-Type", "application/json")
		if err := json.NewEncoder(w).Encode(status); err != nil {
			http.Error(w, "Failed to encode response", http.StatusInternalServerError)
			log.Printf("Error encoding response: %v", err)
		}
	}
}

func ResultHandler() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		log.Printf("Received request to ResultHandler")

		var req QuizResult
		err := json.NewDecoder(r.Body).Decode(&req)
		if err != nil {
			http.Error(w, "Bad request", http.StatusBadRequest)
			log.Printf("Error decoding JSON: %v", err)
			return
		}
		log.Printf("Received quiz result: %+v", req)

		log.Printf("attempting to read db file.")
		db, err := sql.Open("sqlite3", "my.db")
		if err != nil {
			log.Fatal(err)
		}
		defer db.Close()
		log.Printf("db file successfully found & read.")

		queries := sqlcustom.New(db)
		// Respond with a success message
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("Result received successfully"))

		// Create a context with a timeout for database operations
		ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
		defer cancel()

		// Convert float64 to string
		resultStr := strconv.FormatFloat(req.Result, 'f', -1, 64)

		res := sqlcustom.CreateResultParams{OauthID: req.UserID, Result: resultStr, QuizType: req.QuizType, ResultStartTime: time.Now().String()}
		_, err = queries.CreateResult(ctx, res)
		if err != nil {
			http.Error(w, "Failed to save quiz result", http.StatusInternalServerError)
			log.Printf("Error saving quiz result: %v", err)
			return
		}
		log.Printf("result %v added to database", res)

	}
}

type OneTimeKeyResponse struct {
	Key string `json:"key,omitempty"`
}

func OnetimeKeyHandler(aesKey []byte) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		log.Printf("Received request to onetimekeyhandler")
		tempKey := utils.GenerateAESKey()
		base64Key := base64.StdEncoding.EncodeToString(tempKey)
		res := OneTimeKeyResponse{Key: base64Key}

		w.Header().Set("Content-Type", "application/json")
		if err := json.NewEncoder(w).Encode(res); err != nil {
			http.Error(w, "Failed to encode response", http.StatusInternalServerError)
		}
	}
}

// EncryptHandler returns an http.HandlerFunc that handles encryption
func EncryptHandler(aesKey []byte) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		log.Printf("Received request to encryptHandler")
		var req Request
		_ = json.NewDecoder(r.Body).Decode(&req)
		encryptedText, err := encrypt(req.Text, aesKey)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		res := Response{EncryptedText: encryptedText}
		json.NewEncoder(w).Encode(res)
	}
}

// DecryptHandler returns an http.HandlerFunc that handles decryption
func DecryptHandler(aesKey []byte) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		log.Printf("Received request to decryptHandler")
		var req Request
		_ = json.NewDecoder(r.Body).Decode(&req)
		decryptedText, err := decrypt(req.Text, aesKey)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		res := Response{DecryptedText: decryptedText}
		json.NewEncoder(w).Encode(res)
	}
}

func encrypt(text string, key []byte) (string, error) {
	block, err := aes.NewCipher(key)
	if err != nil {
		return "", err
	}

	plaintext := []byte(text)
	ciphertext := make([]byte, aes.BlockSize+len(plaintext))
	iv := ciphertext[:aes.BlockSize]

	if _, err := io.ReadFull(rand.Reader, iv); err != nil {
		return "", err
	}

	stream := cipher.NewCFBEncrypter(block, iv)
	stream.XORKeyStream(ciphertext[aes.BlockSize:], plaintext)

	return base64.URLEncoding.EncodeToString(ciphertext), nil
}

func decrypt(cryptoText string, key []byte) (string, error) {
	ciphertext, _ := base64.URLEncoding.DecodeString(cryptoText)
	block, err := aes.NewCipher(key)
	if err != nil {
		return "", err
	}

	if len(ciphertext) < aes.BlockSize {
		return "", err
	}

	iv := ciphertext[:aes.BlockSize]
	ciphertext = ciphertext[aes.BlockSize:]

	stream := cipher.NewCFBDecrypter(block, iv)
	stream.XORKeyStream(ciphertext, ciphertext)

	return string(ciphertext), nil
}
