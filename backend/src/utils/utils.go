package utils

import (
	"crypto/rand"
	"log"
)

func GenerateAESKey() []byte {
	length := 32
	key := make([]byte, length) // we make a 32 byte key: 1 bit = 8 bytes.. 32 x 8 = 256 bit, which is what we want for AES-256!
	_, err := rand.Read(key)
	if err != nil {
		log.Fatal("Error generating AES key:", err)
	}
	return key
}
