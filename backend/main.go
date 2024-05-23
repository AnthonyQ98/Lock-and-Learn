package main

import (
	"encoding/json"
	"net/http"

	"github.com/gorilla/mux"
)

type Request struct {
	Text string `json:"text"`
}

type Response struct {
	EncryptedText string `json:"encryptedText,omitempty"`
	DecryptedText string `json:"decryptedText,omitempty"`
}

func encryptHandler(w http.ResponseWriter, r *http.Request) {
	var req Request
	_ = json.NewDecoder(r.Body).Decode(&req)
	encryptedText := encrypt(req.Text)
	res := Response{EncryptedText: encryptedText}
	json.NewEncoder(w).Encode(res)
}

func decryptHandler(w http.ResponseWriter, r *http.Request) {
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

func main() {
	r := mux.NewRouter()
	r.HandleFunc("/encrypt", encryptHandler).Methods("POST")
	r.HandleFunc("/decrypt", decryptHandler).Methods("POST")

	http.Handle("/", r)
	http.ListenAndServe(":8080", nil)
}
