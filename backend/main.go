package main

import (
	"github.com/anthonyq98/lock-and-learn/src/config"
	"github.com/anthonyq98/lock-and-learn/src/server"
	"github.com/anthonyq98/lock-and-learn/src/utils"
)

var aesKey []byte

func main() {
	aesKey = utils.GenerateAESKey()

	cfg := new(config.Config)
	cfg.GoogleLoginConfig = config.GoogleConfig()
	cfg.GeminiSecretKey = config.GeminiConfig()
	server.StartServer(aesKey)
}
