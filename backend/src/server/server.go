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

	r.HandleFunc("/encrypt", handlers.EncryptHandler(aesKey)).Methods("POST")
	r.HandleFunc("/decrypt", handlers.DecryptHandler(aesKey)).Methods("POST")
	r.HandleFunc("/google_login", auth.GoogleLogin).Methods("GET")
	r.HandleFunc("/google_callback", auth.GoogleCallback).Methods("GET")

	// Create a new CORS handler with custom options
	corsHandler := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:3000"}, // Allow requests from frontend domain
		AllowedMethods:   []string{"GET", "POST"},
		AllowedHeaders:   []string{"Content-Type", "Authorization"},
		AllowCredentials: true,
	})

	// Use the CORS handler with the router
	r.Use(corsHandler.Handler)

	// Return the CORS-wrapped router
	return r
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
