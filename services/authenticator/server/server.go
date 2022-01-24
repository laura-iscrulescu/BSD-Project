package server

import (
	"context"
	"encoding/json"
	"errors"
	"net/http"
	"os"
	"services/authenticator/identityDB"
	"services/authenticator/log"
	"services/authenticator/mainDB"
	"services/authenticator/server/authenticator"
)

type IServer interface {
	Listen() error
}

type serverStruct struct {
	addr string
	port string

	ctx context.Context
	idb identityDB.IdentityDB
	db  mainDB.MainDB
	log log.Log
}

func Initialize(
	ctx context.Context,
	log log.Log,
	identityDB identityDB.IdentityDB,
	mainDB mainDB.MainDB,
) (IServer, error) {
	log.Info("Initialize server...")

	addr, ok := os.LookupEnv("SERVER_ADDR")
	if !ok {
		return nil, errors.New("Server address not provided in environment")
	}

	port, ok := os.LookupEnv("SERVER_PORT")
	if !ok {
		return nil, errors.New("Server port not provided in environment")
	}

	log.Info("Server initialized")

	return &serverStruct{
		addr: addr,
		port: port,

		ctx: ctx,
		idb: identityDB,
		db:  mainDB,
		log: log,
	}, nil
}

func (s *serverStruct) Listen() error {
	srvr := &http.Server{
		Addr: ":" + s.port,
	}

	authenticatorCollection := authenticator.Initialize(s.ctx, s.idb, s.db, s.log)

	http.HandleFunc("/password", func(writer http.ResponseWriter, req *http.Request) {
		errPrefix := "LOGIN WITH PASSWORD: "

		var reqBody authenticator.LoginWithPasswordReq
		err := json.NewDecoder(req.Body).Decode(&reqBody)
		if err != nil {
			s.log.Error(errPrefix + err.Error())
			s.sendResponse(writer, errPrefix, nil, err, http.StatusBadRequest)
			return
		}
		resp, err, code := authenticatorCollection.LoginWithPassword(reqBody)
		s.sendResponse(writer, errPrefix, resp, err, code)
	})

	http.HandleFunc("/token", func(writer http.ResponseWriter, req *http.Request) {
		errPrefix := "CHECK TOKEN: "

		var reqBody authenticator.CheckTokenReq
		err := json.NewDecoder(req.Body).Decode(&reqBody)
		if err != nil {
			s.log.Error(errPrefix + err.Error())
			s.sendResponse(writer, errPrefix, nil, err, http.StatusBadRequest)
			return
		}
		resp, err, code := authenticatorCollection.CheckToken(reqBody)
		s.sendResponse(writer, errPrefix, resp, err, code)
	})

	http.HandleFunc("/tokens", func(writer http.ResponseWriter, req *http.Request) {
		errPrefix := "GET TOKENS: "

		resp, err, code := authenticatorCollection.GetTokens()
		s.sendResponse(writer, errPrefix, resp, err, code)
	})

	http.HandleFunc("/single", func(writer http.ResponseWriter, req *http.Request) {
		errPrefix := "LOGOUT SINGLE DEVICE: "

		var reqBody authenticator.LogoutSingleDeviceReq
		err := json.NewDecoder(req.Body).Decode(&reqBody)
		if err != nil {
			s.log.Error(errPrefix + err.Error())
			s.sendResponse(writer, errPrefix, nil, err, http.StatusBadRequest)
			return
		}
		resp, err, code := authenticatorCollection.LogoutSingleDevice(reqBody)
		s.sendResponse(writer, errPrefix, resp, err, code)
	})

	http.HandleFunc("/all", func(writer http.ResponseWriter, req *http.Request) {
		errPrefix := "LOGOUT ALL DEVICES: "

		var reqBody authenticator.LogoutAllDevicesReq
		err := json.NewDecoder(req.Body).Decode(&reqBody)
		if err != nil {
			s.log.Error(errPrefix + err.Error())
			s.sendResponse(writer, errPrefix, nil, err, http.StatusBadRequest)
			return
		}
		resp, err, code := authenticatorCollection.LogoutAllDevices(reqBody)
		s.sendResponse(writer, errPrefix, resp, err, code)
	})

	s.log.Info("Listen HTTP on " + s.addr + ":" + s.port)
	return srvr.ListenAndServe()
}

func (s *serverStruct) sendResponse(writer http.ResponseWriter, errPrefix string, resp []byte, err error, code int) {
	errMessage := ""
	if err != nil {
		s.log.Error(errPrefix + err.Error())
		errMessage = errPrefix + err.Error()
	}

	respBody, err := json.Marshal(authenticator.Resp{
		Resp: string(resp),
		Err:  errMessage,
		Code: code,
	})
	if err != nil {
		s.log.Error(err.Error())
		http.Error(writer, errMessage, http.StatusInternalServerError)
		return
	}

	_, err = writer.Write(respBody)
	if err != nil {
		s.log.Error(errMessage)
		http.Error(writer, errMessage, http.StatusInternalServerError)
	}
}
