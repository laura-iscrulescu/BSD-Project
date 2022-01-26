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
	"strings"
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
	identityDB identityDB.IdentityDB,
	mainDB mainDB.MainDB,
	log log.Log,
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

	http.HandleFunc("/authenticator/password", func(writer http.ResponseWriter, req *http.Request) {
		errPrefix := "LOGIN WITH PASSWORD: "

		s.enableCors(&writer)
		if req.Method == "OPTIONS" {
			s.sendResponse(writer, errPrefix, nil, nil, http.StatusOK)
			return
		}

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

	http.HandleFunc("/authenticator/token", func(writer http.ResponseWriter, req *http.Request) {
		errPrefix := "CHECK TOKEN: "

		s.enableCors(&writer)
		if req.Method == "OPTIONS" {
			s.sendResponse(writer, errPrefix, nil, nil, http.StatusOK)
			return
		}

		fullToken := req.Header.Get("Authorization")
		if fullToken == "" {
			errMessage := "The token was not provided"
			s.log.Error(errPrefix + errMessage)
			s.sendResponse(writer, errPrefix, nil, errors.New(errMessage), http.StatusUnauthorized)
			return
		}

		reqBody := authenticator.CheckTokenReq{
			Token: strings.Split(fullToken, "Bearer ")[1],
		}
		resp, err, code := authenticatorCollection.CheckToken(reqBody)
		s.sendResponse(writer, errPrefix, resp, err, code)
	})

	http.HandleFunc("/authenticator/tokens", func(writer http.ResponseWriter, req *http.Request) {
		errPrefix := "GET TOKENS: "

		s.enableCors(&writer)
		if req.Method == "OPTIONS" {
			s.sendResponse(writer, errPrefix, nil, nil, http.StatusOK)
			return
		}

		resp, err, code := authenticatorCollection.GetTokens()
		s.sendResponse(writer, errPrefix, resp, err, code)
	})

	http.HandleFunc("/authenticator/single", func(writer http.ResponseWriter, req *http.Request) {
		errPrefix := "LOGOUT SINGLE DEVICE: "

		s.enableCors(&writer)
		if req.Method == "OPTIONS" {
			s.sendResponse(writer, errPrefix, nil, nil, http.StatusOK)
			return
		}

		fullToken := req.Header.Get("Authorization")
		if fullToken == "" {
			errMessage := "The token was not provided"
			s.log.Error(errPrefix + errMessage)
			s.sendResponse(writer, errPrefix, nil, errors.New(errMessage), http.StatusUnauthorized)
			return
		}

		reqBody := authenticator.LogoutSingleDeviceReq{
			Token: strings.Split(fullToken, "Bearer ")[1],
		}
		resp, err, code := authenticatorCollection.LogoutSingleDevice(reqBody)
		s.sendResponse(writer, errPrefix, resp, err, code)
	})

	http.HandleFunc("/authenticator/all", func(writer http.ResponseWriter, req *http.Request) {
		errPrefix := "LOGOUT ALL DEVICES: "

		s.enableCors(&writer)
		if req.Method == "OPTIONS" {
			s.sendResponse(writer, errPrefix, nil, nil, http.StatusOK)
			return
		}

		fullToken := req.Header.Get("Authorization")
		if fullToken == "" {
			errMessage := "The token was not provided"
			s.log.Error(errPrefix + errMessage)
			s.sendResponse(writer, errPrefix, nil, errors.New(errMessage), http.StatusUnauthorized)
			return
		}

		reqBody := authenticator.LogoutAllDevicesReq{
			Token: strings.Split(fullToken, "Bearer ")[1],
		}
		resp, err, code := authenticatorCollection.LogoutAllDevices(reqBody)
		s.sendResponse(writer, errPrefix, resp, err, code)
	})

	s.log.Info("Listen HTTP on " + s.addr + ":" + s.port)
	return srvr.ListenAndServe()
}

func (s *serverStruct) enableCors(writer *http.ResponseWriter) {
	(*writer).Header().Add("Access-Control-Allow-Origin", "*")
	(*writer).Header().Add("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
	(*writer).Header().Add("Access-Control-Allow-Headers", "Access-Control-Allow-Origin, Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, X-Requested-With")
	(*writer).Header().Add("Content-Type", "application/json")
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

	writer.WriteHeader(code)
	_, err = writer.Write(respBody)
	if err != nil {
		s.log.Error(errMessage)
		http.Error(writer, errMessage, http.StatusInternalServerError)
	}
}
