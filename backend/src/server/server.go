package server

import (
	"log"
	"net/http"

	"github.com/anthonyq98/lock-and-learn/src/auth"
	"github.com/anthonyq98/lock-and-learn/src/handlers"
	"github.com/gorilla/mux"
	"github.com/rs/cors"
)

func NewRouter(aesKey []byte) http.Handler {
	r := mux.NewRouter()

	// Quiz endpoints
	r.HandleFunc("/quiz-result", handlers.ResultHandler()).Methods("POST")
	r.HandleFunc("/quiz-status", handlers.GetResultsHandler()).Methods("GET")

	// Summary endpoints
	r.HandleFunc("/get-summary", handlers.GetSummaryHandler()).Methods("GET")

	// encryption/decryption endpoints
	r.HandleFunc("/encrypt", handlers.EncryptHandler(aesKey)).Methods("POST")
	r.HandleFunc("/decrypt", handlers.DecryptHandler(aesKey)).Methods("POST")

	// learning platform endpoints
	r.HandleFunc("/onetime-secret-key", handlers.OnetimeKeyHandler(aesKey)).Methods("GET")
	r.HandleFunc("/onetime-encryption", handlers.OneTimeEncryptHandler()).Methods("POST")
	r.HandleFunc("/onetime-decryption", handlers.OneTimeDecryptHandler()).Methods("POST")
	r.HandleFunc("/gemini-prompt", handlers.GeminiPromptHandler()).Methods("POST")

	// auth endpoints
	r.HandleFunc("/google_login", auth.GoogleLogin).Methods("GET")
	r.HandleFunc("/google_callback", auth.GoogleCallback).Methods("GET")

	// get aes key endpoint
	r.HandleFunc("/key", handlers.KeyHandler()).Methods("POST")

	// Create a new CORS handler with custom options
	corsHandler := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:3000"}, // Allow requests from frontend domain
		AllowedMethods:   []string{"GET", "POST", "OPTIONS"},
		AllowedHeaders:   []string{"Content-Type", "Authorization"},
		AllowCredentials: true,
	})

	// Wrap the router with the CORS handler
	handler := corsHandler.Handler(r)

	// Return the CORS-wrapped router
	return handler
}

func StartServer(aesKey []byte) {
	log.Printf("Starting server on port 8080")
	// Create a new router
	router := NewRouter(aesKey)

	// Start the server
	if err := http.ListenAndServe(":8080", router); err != nil {
		log.Fatalf("failed to start server: %v", err)
	}
}
