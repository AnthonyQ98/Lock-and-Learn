package main

import (
	"github.com/anthonyq98/lock-and-learn/src/config"
	"github.com/anthonyq98/lock-and-learn/src/server"
	"github.com/anthonyq98/lock-and-learn/src/utils"
)

var aesKey []byte

func main() {
	aesKey = utils.GenerateAESKey(32)

	config.GoogleConfig()
	server.StartServer(aesKey)
}
