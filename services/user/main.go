package main

import (
	"context"
	"services/user/log"
	"services/user/server"
)

func main() {
	var err error
	ctx := context.Background()

	log := log.Initialize()

	server, err := server.Initialize(ctx, log)
	if err != nil {
		log.Fatal(err)
	}

	err = server.Listen()
	if err != nil {
		log.Fatal(err)
	}
}
