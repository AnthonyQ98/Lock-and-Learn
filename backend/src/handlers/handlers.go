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

	"github.com/anthonyq98/lock-and-learn/src/config"
	"github.com/anthonyq98/lock-and-learn/src/sqlcustom"
	"github.com/anthonyq98/lock-and-learn/src/utils"
	"github.com/google/generative-ai-go/genai"
	"google.golang.org/api/option"
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

type OneTimeEncryptRequest struct {
	Plaintext string `json:"plaintext"`
	Key       string `json:"key"`
}

type OneTimeEncryptResponse struct {
	CiphertextBase64 string `json:"ciphertext_base64"`
}

func OneTimeEncryptHandler() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var req OneTimeEncryptRequest
		log.Printf("received request to one time encrypt handler")
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			http.Error(w, "Invalid request", http.StatusBadRequest)
			return
		}
		log.Printf("decoded the request successfully")

		key, err := base64.StdEncoding.DecodeString(req.Key)
		if err != nil {
			http.Error(w, "Invalid key encoding", http.StatusBadRequest)
			return
		}
		log.Printf("decoded the key successfully")

		ciphertextBase64, err := encrypt(req.Plaintext, key)
		if err != nil {
			http.Error(w, "Encryption failed", http.StatusInternalServerError)
			return
		}
		log.Printf("encrypted the plaintext data successfully!")

		res := OneTimeEncryptResponse{
			CiphertextBase64: ciphertextBase64,
		}

		w.Header().Set("Content-Type", "application/json")
		if err := json.NewEncoder(w).Encode(res); err != nil {
			http.Error(w, "Failed to encode response", http.StatusInternalServerError)
		}
	}
}

type OneTimeDecryptRequest struct {
	Ciphertext string `json:"ciphertext"`
	Key        string `json:"key"`
}

type OneTimeDecryptResponse struct {
	CiphertextBase64 string `json:"plaintext"`
}

func OneTimeDecryptHandler() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var req OneTimeDecryptRequest
		log.Printf("received request to one time decrypt handler")
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			http.Error(w, "Invalid request", http.StatusBadRequest)
			return
		}
		log.Printf("decoded the request successfully: %v", req)

		decodedCipherText, err := base64.StdEncoding.DecodeString(req.Ciphertext)
		if err != nil {
			log.Printf("Invalid ciphertext encoding: %v", err)
			http.Error(w, "Invalid ciphertext encoding", http.StatusBadRequest)
			return
		}
		log.Printf("received decoded cipher text: %s", decodedCipherText)
		key, err := base64.StdEncoding.DecodeString(req.Key)
		if err != nil {
			log.Printf("Invalid key encoding: %v", err)
			http.Error(w, "Invalid key encoding", http.StatusBadRequest)
			return
		}
		log.Printf("received decoded key: %s", key)

		plaintext, err := decrypt(decodedCipherText, key)
		if err != nil {
			log.Printf("Decryption failed: %v", err)
			res := OneTimeDecryptResponse{
				CiphertextBase64: "You broke me! I need a matching key for this cipher text.",
			}
			if err := json.NewEncoder(w).Encode(res); err != nil {
				http.Error(w, "Failed to encode response", http.StatusInternalServerError)
			}
			return
		}
		log.Printf("Decrypted ciphertext successfully: %s", plaintext)
		res := OneTimeDecryptResponse{
			CiphertextBase64: plaintext,
		}

		w.Header().Set("Content-Type", "application/json")
		if err := json.NewEncoder(w).Encode(res); err != nil {
			http.Error(w, "Failed to encode response", http.StatusInternalServerError)
		}
	}
}

type GeminiRequest struct {
	SectionContent string `json:"sectionContent,omitempty"`
}

func GeminiPromptHandler() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var req GeminiRequest
		log.Printf("received request to gpt prompt handler")
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			http.Error(w, "Invalid request", http.StatusBadRequest)
			return
		}
		log.Printf("decoded the request successfully")

		ctx := context.Background()
		client, err := genai.NewClient(ctx, option.WithAPIKey(config.GeminiConfig()))
		if err != nil {
			log.Fatal(err)
		}
		defer client.Close()
		model := client.GenerativeModel("gemini-1.5-flash")
		resp, err := model.GenerateContent(ctx, genai.Text("I am giving you some content.. I want you to elaborate and expand on it as if I'm a new learner to cryptography:"+req.SectionContent))
		if err != nil {
			log.Fatal(err)
		}
		content := resp.Candidates[0].Content.Parts[0]
		log.Printf("Response: %v", resp.Candidates[0].Content.Parts[0])

		response := map[string]interface{}{
			"content": content.(genai.Text),
		}
		w.Header().Set("Content-Type", "application/json")
		if err := json.NewEncoder(w).Encode(response); err != nil {
			http.Error(w, "Failed to encode response", http.StatusInternalServerError)
			return
		}
	}
}

// EncryptHandler returns an http.HandlerFunc that handles encryption
func EncryptHandler(aesKey []byte) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		log.Printf("Received request to encryptHandler")
		var req Request
		_ = json.NewDecoder(r.Body).Decode(&req)
		encryptedText, err := encrypt(req.Text, aesKey) // temporarily not doing anything with the binary value, will change in the future when i get to that page
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		res := Response{EncryptedText: encryptedText}
		json.NewEncoder(w).Encode(res)
	}
}

/*
// DecryptHandler returns an http.HandlerFunc that handles decryption
//func DecryptHandler(aesKey []byte) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		log.Printf("Received request to decryptHandler")
		var req Request
		_ = json.NewDecoder(r.Body).Decode(&req)
		ciphertext, err := base64.RawStdEncoding.DecodeString(req.Text)
		decryptedText, err := decrypt(ciphertext, aesKey)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		res := Response{DecryptedText: base64.RawStdEncoding.EncodeToString(decryptedText)}
		json.NewEncoder(w).Encode(res)
	}
}*/

func encrypt(text string, key []byte) (string, error) {
	block, err := aes.NewCipher(key)
	if err != nil {
		return "", err
	}

	plaintext := []byte(text)
	ciphertext := make([]byte, aes.BlockSize+len(plaintext))
	iv := ciphertext[:aes.BlockSize]
	log.Printf("iv during encryption is: %v", iv)

	if _, err := io.ReadFull(rand.Reader, iv); err != nil {
		return "", err
	}

	stream := cipher.NewCFBEncrypter(block, iv)
	stream.XORKeyStream(ciphertext[aes.BlockSize:], plaintext)

	return base64.StdEncoding.EncodeToString(ciphertext), nil
}

func decrypt(cryptoText []byte, key []byte) (string, error) {
	block, err := aes.NewCipher(key)
	if err != nil {
		return "", err
	}

	if len(cryptoText) < aes.BlockSize {
		log.Printf("cryptotext not greater than block size")
		return "", nil
	}

	iv := cryptoText[:aes.BlockSize]
	cryptoText = cryptoText[aes.BlockSize:]

	stream := cipher.NewCFBDecrypter(block, iv)
	stream.XORKeyStream(cryptoText, cryptoText)

	return string(cryptoText), nil
}
