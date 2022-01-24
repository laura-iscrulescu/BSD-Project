package main

import (
	"context"
	"services/user/log"
	"services/user/mainDB"
	"services/user/server"
)

func main() {
	var err error
	ctx := context.Background()

	log := log.Initialize()

	db, err := mainDB.Initialize(ctx, log)
	if err != nil {
		log.Fatal(err)
	}

	server, err := server.Initialize(ctx, db, log)
	if err != nil {
		log.Fatal(err)
	}

	// mdb, err := mainDB.Initialize(ctx, log)
	// if err != nil {
	// 	log.Fatal(errors.New("1"))
	// }

	// err = mdb.Add("test-email", "test-password", "test-name")
	// if err != nil {
	// 	log.Fatal(errors.New("2"))
	// }

	// resp, err := mdb.Get("test-email")
	// if err != nil {
	// 	log.Fatal(errors.New("3"))
	// }
	// if resp == nil {
	// 	log.Fatal(errors.New("4"))
	// }
	// log.Info(resp.Name)

	// _, err = mdb.Get("test-email-2")
	// if err == nil {
	// 	log.Fatal(errors.New("5"))
	// }
	// log.Error(err.Error())

	// err = mdb.Remove("test-email")
	// if err != nil {
	// 	log.Fatal(errors.New("6"))
	// }

	err = server.Listen()
	if err != nil {
		log.Fatal(err)
	}
}
