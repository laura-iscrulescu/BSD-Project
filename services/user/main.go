package main

import (
	"context"
	"services/user/identityDB"
	"services/user/log"
	"services/user/mainDB"
	"services/user/server"
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
