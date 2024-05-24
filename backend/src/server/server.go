package server

import (
	"net/http"

	"github.com/anthonyq98/lock-and-learn/src/handlers"
	"github.com/anthonyq98/lock-and-learn/src/middlewares"
	"github.com/gorilla/mux"
	"github.com/rs/cors"
)

func NewRouter(aesKey []byte) http.Handler {
	r := mux.NewRouter()

	r.HandleFunc("/encrypt", handlers.EncryptHandler(aesKey)).Methods("POST")
	r.HandleFunc("/decrypt", handlers.DecryptHandler(aesKey)).Methods("POST")

	r.Use(middlewares.CORS)

	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:3000"},
		AllowCredentials: true,
	})

	return c.Handler(r)
}
