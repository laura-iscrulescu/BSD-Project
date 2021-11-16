package server

import (
	"context"
	"errors"
	"net/http"
	"os"
	"services/authenticator/identityDB"
	"services/authenticator/log"
	"services/authenticator/mainDB"
	"services/authenticator/server/test"
)

type IServer interface {
	Listen() error
}

type serverStruct struct {
	addr string
	port string

	ctx        context.Context
	log        log.Log
	identityDB identityDB.IdentityDB
	mainDB     mainDB.MainDB
}

func Initialize(
	ctx context.Context,
	log log.Log,
	identityDB identityDB.IdentityDB,
	mainDB mainDB.MainDB,
) (IServer, error) {
	addr, ok := os.LookupEnv("SERVER_ADDR")
	if !ok {
		return nil, errors.New("Server address not provided in environment")
	}

	port, ok := os.LookupEnv("SERVER_PORT")
	if !ok {
		return nil, errors.New("Server port not provided in environment")
	}

	return &serverStruct{
		addr: addr,
		port: port,

		ctx:        ctx,
		log:        log,
		identityDB: identityDB,
		mainDB:     mainDB,
	}, nil
}

func (s *serverStruct) Listen() error {
	srvr := &http.Server{
		Addr: ":" + s.port,
	}

	http.HandleFunc("/test", func(writer http.ResponseWriter, req *http.Request) {
		test.Test(s.log, s.identityDB, writer, req)
	})

	s.log.Info("Listen HTTP on " + s.addr + ":" + s.port)
	return srvr.ListenAndServe()
}
