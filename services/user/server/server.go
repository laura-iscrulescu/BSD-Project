package server

import (
	"context"
	"encoding/json"
	"errors"
	"net/http"
	"os"
	"services/user/log"
	"services/user/mainDB"
	"services/user/server/user"
)

type IServer interface {
	Listen() error
}

type serverStruct struct {
	addr string
	port string

	ctx context.Context
	db  mainDB.MainDB
	log log.Log
}

func Initialize(
	ctx context.Context,
	db mainDB.MainDB,
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
		db:  db,
		log: log,
	}, nil
}

func (s *serverStruct) Listen() error {
	server := &http.Server{
		Addr: ":" + s.port,
	}

	userCollection := user.Initialize(s.ctx, s.db, s.log)

	http.HandleFunc("/register", func(writer http.ResponseWriter, req *http.Request) {
		errPrefix := "REGISTER: "

		var reqBody user.RegisterReq
		err := json.NewDecoder(req.Body).Decode(&reqBody)
		if err != nil {
			s.log.Error(errPrefix + err.Error())
			s.sendResponse(writer, errPrefix, nil, err, http.StatusBadRequest)
			return
		}

		resp, err, code := userCollection.Register(reqBody)
		s.sendResponse(writer, errPrefix, resp, err, code)
	})

	http.HandleFunc("/activate", func(writer http.ResponseWriter, req *http.Request) {
		errPrefix := "ACTIVATE: "
		var reqBody user.ActivateReq
		err := json.NewDecoder(req.Body).Decode(&reqBody)
		if err != nil {
			s.log.Error(errPrefix + err.Error())
			s.sendResponse(writer, errPrefix, nil, err, http.StatusBadRequest)
			return
		}

		resp, err, code := userCollection.Activate(reqBody)
		s.sendResponse(writer, errPrefix, resp, err, code)
	})

	http.HandleFunc("/get", func(writer http.ResponseWriter, req *http.Request) {
		errPrefix := "GET: "
		var reqBody user.GetReq
		err := json.NewDecoder(req.Body).Decode(&reqBody)
		if err != nil {
			s.log.Error(errPrefix + err.Error())
			s.sendResponse(writer, errPrefix, nil, err, http.StatusBadRequest)
			return
		}

		resp, err, code := userCollection.Get(reqBody)
		s.sendResponse(writer, errPrefix, resp, err, code)
	})

	http.HandleFunc("/change/password", func(writer http.ResponseWriter, req *http.Request) {
		errPrefix := "CHANGE PASSWORD: "

		var reqBody user.ChangePasswordReq
		err := json.NewDecoder(req.Body).Decode(&reqBody)
		if err != nil {
			s.log.Error(errPrefix + err.Error())
			s.sendResponse(writer, errPrefix, nil, err, http.StatusBadRequest)
			return
		}

		resp, err, code := userCollection.ChangePassword(reqBody)
		s.sendResponse(writer, errPrefix, resp, err, code)
	})

	http.HandleFunc("/change/name", func(writer http.ResponseWriter, req *http.Request) {
		errPrefix := "CHANGE NAME: "
		var reqBody user.ChangeNameReq
		err := json.NewDecoder(req.Body).Decode(&reqBody)
		if err != nil {
			s.log.Error(errPrefix + err.Error())
			s.sendResponse(writer, errPrefix, nil, err, http.StatusBadRequest)
			return
		}

		resp, err, code := userCollection.ChangeName(reqBody)
		s.sendResponse(writer, errPrefix, resp, err, code)
	})

	http.HandleFunc("/change/goal", func(writer http.ResponseWriter, req *http.Request) {
		errPrefix := "CHANGE MONTHLY GOAL: "
		var reqBody user.ChangeMonthlyGoalReq
		err := json.NewDecoder(req.Body).Decode(&reqBody)
		if err != nil {
			s.log.Error(errPrefix + err.Error())
			s.sendResponse(writer, errPrefix, nil, err, http.StatusBadRequest)
			return
		}

		resp, err, code := userCollection.ChangeMonthlyGoal(reqBody)
		s.sendResponse(writer, errPrefix, resp, err, code)
	})

	http.HandleFunc("/delete", func(writer http.ResponseWriter, req *http.Request) {
		errPrefix := "DELETE: "
		var reqBody user.DeleteReq
		err := json.NewDecoder(req.Body).Decode(&reqBody)
		if err != nil {
			s.log.Error(errPrefix + err.Error())
			s.sendResponse(writer, errPrefix, nil, err, http.StatusBadRequest)
			return
		}

		resp, err, code := userCollection.Delete(reqBody)
		s.sendResponse(writer, errPrefix, resp, err, code)
	})

	http.HandleFunc("/category/add", func(writer http.ResponseWriter, req *http.Request) {
		errPrefix := "CREATE CATEGORY: "
		var reqBody user.AddCategoryReq
		err := json.NewDecoder(req.Body).Decode(&reqBody)
		if err != nil {
			s.log.Error(errPrefix + err.Error())
			s.sendResponse(writer, errPrefix, nil, err, http.StatusBadRequest)
			return
		}

		resp, err, code := userCollection.AddCategory(reqBody)
		s.sendResponse(writer, errPrefix, resp, err, code)
	})

	http.HandleFunc("/category/remove", func(writer http.ResponseWriter, req *http.Request) {
		errPrefix := "DELETE CATEGORY: "
		var reqBody user.RemoveCategoryReq
		err := json.NewDecoder(req.Body).Decode(&reqBody)
		if err != nil {
			s.log.Error(errPrefix + err.Error())
			s.sendResponse(writer, errPrefix, nil, err, http.StatusBadRequest)
			return
		}

		resp, err, code := userCollection.RemoveCategory(reqBody)
		s.sendResponse(writer, errPrefix, resp, err, code)
	})

	s.log.Info("Listen HTTP on " + s.addr + ":" + s.port)
	return server.ListenAndServe()
}

func (s *serverStruct) sendResponse(writer http.ResponseWriter, errPrefix string, resp []byte, err error, code int) {
	errMessage := ""
	if err != nil {
		s.log.Error(errPrefix + err.Error())
		errMessage = errPrefix + err.Error()
	}

	respBody, err := json.Marshal(user.Resp{
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
