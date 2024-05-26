package utils

import (
	"crypto/rand"
	"log"
)

func GenerateAESKey() []byte {
	length := 32
	key := make([]byte, length)
	_, err := rand.Read(key)
	if err != nil {
		log.Fatal("Error generating AES key:", err)
	}
	return key
}
