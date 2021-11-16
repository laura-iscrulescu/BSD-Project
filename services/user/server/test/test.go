package test

import (
	"net/http"
	"services/user/log"
)

func Test(log log.ILog, writer http.ResponseWriter, req *http.Request) {
	log.Info("hello from test route in user-docker")
}
