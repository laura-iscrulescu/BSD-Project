package main

import (
	"context"
	"services/authenticator/identityDB"
	"services/authenticator/log"
	"services/authenticator/mainDB"
	"services/authenticator/server"
)

func main() {
	var err error
	ctx := context.Background()

	log := log.Initialize()

	identityDB, err := identityDB.Initialize(ctx, log)
	if err != nil {
		log.Fatal(err)
	}

	mainDB, err := mainDB.Initialize(ctx, log)
	if err != nil {
		log.Fatal(err)
	}

	server, err := server.Initialize(ctx, identityDB, mainDB, log)
	if err != nil {
		log.Fatal(err)
	}

	err = server.Listen()
	if err != nil {
		log.Fatal(err)
	}
}
