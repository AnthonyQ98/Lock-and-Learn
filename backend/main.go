package main

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/rs/cors"
)

type Request struct {
	Text string `json:"text"`
}

type Response struct {
	EncryptedText string `json:"encryptedText,omitempty"`
	DecryptedText string `json:"decryptedText,omitempty"`
}

func encryptHandler(w http.ResponseWriter, r *http.Request) {
	log.Printf("Received request to encryptHandler")
	var req Request
	_ = json.NewDecoder(r.Body).Decode(&req)
	encryptedText := encrypt(req.Text)
	res := Response{EncryptedText: encryptedText}
	json.NewEncoder(w).Encode(res)
}

func decryptHandler(w http.ResponseWriter, r *http.Request) {
	log.Printf("Received request to decryptHandler")
	var req Request
	_ = json.NewDecoder(r.Body).Decode(&req)
	decryptedText := decrypt(req.Text)
	res := Response{DecryptedText: decryptedText}
	json.NewEncoder(w).Encode(res)
}

func encrypt(text string) string {
	return "encrypted_" + text
}

func decrypt(text string) string {
	return text[len("encrypted_"):]
}

func corsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
		w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}
		next.ServeHTTP(w, r)
	})
}

func main() {
	r := mux.NewRouter()
	r.HandleFunc("/encrypt", encryptHandler).Methods("POST")
	r.HandleFunc("/decrypt", decryptHandler).Methods("POST")

	r.Use(corsMiddleware)

	http.Handle("/", r)

	log.Printf("Listening on port 8080")
	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:3000"},
		AllowCredentials: true,
	})

	handler := c.Handler(r)
	log.Fatal(http.ListenAndServe(":8080", handler))
}
