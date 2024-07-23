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

type QuizSummary struct {
	FirstQuizResult       float64 `json:"firstQuizResult"`
	EndQuizResult         float64 `json:"endQuizResult"`
	Difference            float64 `json:"difference"`
	ImprovementPercentage float64 `json:"improvementPercentage"`
	FirstQuizStartTime    string  `json:"firstQuizStartTime`
	EndQuizStartTime      string  `json:"endQuizStartTime`
}

func GetSummaryHandler() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		log.Printf("Received request to GetSummaryHandler")

		oauthid := r.URL.Query().Get("oauthid")
		if oauthid == "" {
			log.Printf("Received a request for summary, but did not receive an oauth id")
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

		var firstQuizResult, endQuizResult float64
		var isFirstQuizResultDone, isEndQuizResultDone bool
		var firstQuizTime, endQuizTime string
		for _, res := range rows {
			if isEndQuizResultDone && isFirstQuizResultDone {
				break
			}
			score, err := strconv.ParseFloat(res.Result, 64)
			if err != nil {
				log.Printf("Error converting score to float: %v", err)
				continue
			}
			if res.QuizType == "start" {
				firstQuizTime = res.ResultStartTime
				firstQuizResult = score
				isFirstQuizResultDone = true
			} else if res.QuizType == "end" {
				endQuizTime = res.ResultStartTime
				endQuizResult = score
				isEndQuizResultDone = true
			}
		}

		difference := endQuizResult - firstQuizResult
		improvementPercentage := 0.0
		if firstQuizResult != 0 {
			improvementPercentage = (difference / firstQuizResult) * 100
		}

		status := QuizSummary{
			FirstQuizResult:       firstQuizResult,
			EndQuizResult:         endQuizResult,
			Difference:            difference,
			ImprovementPercentage: improvementPercentage,
			FirstQuizStartTime:    firstQuizTime,
			EndQuizStartTime:      endQuizTime,
		}

		log.Printf("%v", status)

		w.Header().Set("Content-Type", "application/json")
		if err := json.NewEncoder(w).Encode(status); err != nil {
			http.Error(w, "Failed to encode response", http.StatusInternalServerError)
			log.Printf("Error encoding response: %v", err)
		}
	}
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

type EncryptRequest struct {
	Plaintext string `json:"plaintext"`
	Key       string `json:"key"`
}

type EncryptRequestId struct {
	Plaintext string `json:"plaintext"`
	Id        string `json:"user"`
}

type EncryptResponse struct {
	CiphertextBase64 string `json:"ciphertext_base64"`
}

func OneTimeEncryptHandler() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var req EncryptRequest
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

		res := EncryptResponse{
			CiphertextBase64: ciphertextBase64,
		}

		w.Header().Set("Content-Type", "application/json")
		if err := json.NewEncoder(w).Encode(res); err != nil {
			http.Error(w, "Failed to encode response", http.StatusInternalServerError)
		}
	}
}

type DecryptRequest struct {
	Ciphertext string `json:"ciphertext"`
	Key        string `json:"key"`
}

type DecryptRequestId struct {
	Ciphertext string `json:"ciphertext"`
	Id         string `json:"user"`
}

type DecryptResponse struct {
	CiphertextBase64 string `json:"plaintext"`
}

func OneTimeDecryptHandler() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var req DecryptRequest
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
			res := DecryptResponse{
				CiphertextBase64: "You broke me! I need a matching key for this cipher text.",
			}
			if err := json.NewEncoder(w).Encode(res); err != nil {
				http.Error(w, "Failed to encode response", http.StatusInternalServerError)
			}
			return
		}
		log.Printf("Decrypted ciphertext successfully: %s", plaintext)
		res := DecryptResponse{
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
		resp, err := model.GenerateContent(ctx, genai.Text("I am giving you some content.. I want you to elaborate and expand on it as if I'm a new learner to cryptography. You MUST return the format in HTML text tags (using p tags, h1 tags, h2 tags, inline css, etc - EXCLUDE the base tags such as html, doctype, etc):"+req.SectionContent))
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

type KeyRequest struct {
	Id string `json:"id"`
}

type KeyResponse struct {
	Key string `json:"key"`
}

// KeyHandler returns an http.HandlerFunc that handles key retrieval
func KeyHandler() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		log.Printf("Received request to keyHandler")

		var req KeyRequest
		err := json.NewDecoder(r.Body).Decode(&req)
		if err != nil {
			log.Printf("Error decoding request: %v", err)
			http.Error(w, "Invalid request payload", http.StatusBadRequest)
			return
		}

		log.Printf("request to keyHandler: %v", req)

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

		user, err := queries.GetUser(ctx, req.Id)
		if err != nil {
			log.Printf("error found when fetching user %s: %v", req.Id, err)
			http.Error(w, "User not found", http.StatusNotFound)
			return
		}

		log.Printf("User key: %v", user.Key)

		res := KeyResponse{Key: string(user.Key)}

		w.Header().Set("Content-Type", "application/json")
		if err := json.NewEncoder(w).Encode(res); err != nil {
			log.Printf("Error encoding response: %v", err)
			http.Error(w, "Error encoding response", http.StatusInternalServerError)
			return
		}
	}
}

// EncryptHandler returns an http.HandlerFunc that handles encryption
func EncryptHandler(aesKey []byte) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		log.Printf("Received request to encryptHandler")

		var req EncryptRequestId
		err := json.NewDecoder(r.Body).Decode(&req)
		if err != nil {
			log.Printf("Error decoding request: %v", err)
			http.Error(w, "Invalid request payload", http.StatusBadRequest)
			return
		}

		log.Printf("request to encrypthandler: %v", req)

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

		user, err := queries.GetUser(ctx, req.Id)
		if err != nil {
			log.Printf("error found when fetching user %s: %v", req.Id, err)
		}

		log.Printf("Request payload: %v", req)

		encryptedText, err := encrypt(req.Plaintext, user.Key)
		if err != nil {
			log.Printf("Error encrypting text: %v", err)
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		log.Printf("Encrypted text (base64): %v", encryptedText)

		res := EncryptResponse{CiphertextBase64: encryptedText}
		w.Header().Set("Content-Type", "application/json")
		if err := json.NewEncoder(w).Encode(res); err != nil {
			log.Printf("Error encoding response: %v", err)
			http.Error(w, "Error encoding response", http.StatusInternalServerError)
			return
		}
	}
}

// DecryptHandler returns an http.HandlerFunc that handles decryption
func DecryptHandler(aesKey []byte) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		log.Printf("Received request to decryptHandler")
		var req DecryptRequestId
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			log.Printf("Invalid request payload: %v", http.StatusBadRequest)
			return
		}

		log.Printf("Decoded request: %v", req)

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

		user, err := queries.GetUser(ctx, req.Id)
		if err != nil {
			log.Printf("error found when fetching user %s: %v", req.Id, err)
		}

		ciphertext, err := base64.RawStdEncoding.DecodeString(req.Ciphertext)
		if err != nil {
			log.Printf("Invalid base64 string: %v", http.StatusBadRequest)
			return
		}

		log.Printf("Ciphertext decoded: %v", ciphertext)

		decryptedText, err := decrypt(ciphertext, user.Key)
		if err != nil {
			log.Printf(err.Error(), http.StatusInternalServerError)
			return
		}

		log.Printf("Decrypted text: %v", decryptedText)

		res := DecryptResponse{CiphertextBase64: base64.StdEncoding.EncodeToString([]byte(decryptedText))}
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
	log.Printf("iv during encryption is: %v", iv)

	if _, err := io.ReadFull(rand.Reader, iv); err != nil {
		return "", err
	}

	stream := cipher.NewCFBEncrypter(block, iv)
	stream.XORKeyStream(ciphertext[aes.BlockSize:], plaintext)

	log.Printf("encrypted text: %v", string(ciphertext))
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
