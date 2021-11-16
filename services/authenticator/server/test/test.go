package test

import (
	"net/http"
	"services/authenticator/identityDB"
	"services/authenticator/log"
)

func Test(log log.Log, identityDB identityDB.IdentityDB, writer http.ResponseWriter, req *http.Request) {
	log.Info("hello from test route in authenticator-docker")
}
