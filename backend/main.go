package main

import (
	"log"
	"net/http"

	"github.com/anthonyq98/lock-and-learn/server"
	"github.com/anthonyq98/lock-and-learn/utils"
)

var aesKey []byte

func main() {
	aesKey = utils.GenerateAESKey(32)

	router := server.NewRouter(aesKey)

	log.Printf("Listening on port 8080")
	log.Fatal(http.ListenAndServe(":8080", router))
}
