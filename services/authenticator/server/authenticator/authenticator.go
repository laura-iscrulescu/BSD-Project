package authenticator

import (
	"context"
	"encoding/json"
	"errors"
	"net/http"
	"services/authenticator/identityDB"
	"services/authenticator/log"
	"services/authenticator/mainDB"

	uuid "github.com/satori/go.uuid"
)

type Authenticator interface {
	LoginWithPassword(req LoginWithPasswordReq) ([]byte, error, int)
	CheckToken(req CheckTokenReq) ([]byte, error, int)
	GetTokens() ([]byte, error, int)
	LogoutSingleDevice(req LogoutSingleDeviceReq) ([]byte, error, int)
	LogoutAllDevices(req LogoutAllDevicesReq) ([]byte, error, int)
}

type authenticatorStruct struct {
	ctx        context.Context
	identityDB identityDB.IdentityDB
	mainDB     mainDB.MainDB
	log        log.Log
}

func Initialize(ctx context.Context, identityDB identityDB.IdentityDB, mainDB mainDB.MainDB, log log.Log) Authenticator {
	return &authenticatorStruct{
		ctx:        ctx,
		identityDB: identityDB,
		mainDB:     mainDB,
		log:        log,
	}
}

func (a *authenticatorStruct) LoginWithPassword(req LoginWithPasswordReq) ([]byte, error, int) {
	a.log.Info("LOGIN WITH PASSWORD FUNCTION")

	// Validate Email and Password
	err := CheckEmail(req.Email)
	if err != nil {
		return nil, err, http.StatusBadRequest
	}

	err = CheckPassword(req.Password)
	if err != nil {
		return nil, err, http.StatusBadRequest
	}

	// Check to see if the user exists
	user, err := a.mainDB.Get(req.Email)
	if err != nil {
		return nil, errors.New("The pair email-password is incorrect"), http.StatusForbidden
	}

	// Check to see if password matches
	if req.Password != user.Password {
		return nil, errors.New("The pair email-password is incorrect"), http.StatusForbidden
	}

	// Create and save the token
	sessionToken := uuid.NewV4().String()
	err = a.identityDB.Add(req.Email, sessionToken)
	if err != nil {
		return nil, err, http.StatusInternalServerError
	}

	// Transform token data into a string
	tokenMarshaled, err := json.Marshal(map[string]string{
		"token": sessionToken,
	})
	if err != nil {
		return nil, err, http.StatusInternalServerError
	}

	return tokenMarshaled, nil, http.StatusOK
}

func (a *authenticatorStruct) CheckToken(req CheckTokenReq) ([]byte, error, int) {
	a.log.Info("CHECK TOKEN FUNCTION")

	// Validate Token
	err := CheckToken(req.Token)
	if err != nil {
		return nil, err, http.StatusBadRequest
	}

	// Check to see if the token exists
	_, err = a.identityDB.GetKey(req.Token)
	if err != nil {
		return nil, err, http.StatusForbidden
	}

	return nil, nil, http.StatusOK
}

func (a *authenticatorStruct) GetTokens() ([]byte, error, int) {
	a.log.Info("GET TOKENS FUNCTION")

	tokens, err := a.identityDB.GetAll()
	if err != nil {
		return nil, err, http.StatusInternalServerError
	}

	tokensMarshaled, err := json.Marshal(tokens)
	if err != nil {
		return nil, err, http.StatusInternalServerError
	}

	return tokensMarshaled, nil, http.StatusOK
}

func (a *authenticatorStruct) LogoutSingleDevice(req LogoutSingleDeviceReq) ([]byte, error, int) {
	a.log.Info("LOGOUT SINGLE DEVICE FUNCTION")

	// Validate Token
	err := CheckToken(req.Token)
	if err != nil {
		return nil, err, http.StatusBadRequest
	}

	// Check to see if the token exists
	email, err := a.identityDB.GetKey(req.Token)
	if err != nil {
		return nil, err, http.StatusBadRequest
	}

	// Remove the given token
	err = a.identityDB.Remove(email, req.Token)
	if err != nil {
		return nil, err, http.StatusInternalServerError
	}

	return nil, nil, http.StatusOK
}

func (a *authenticatorStruct) LogoutAllDevices(req LogoutAllDevicesReq) ([]byte, error, int) {
	a.log.Info("LOGOUT ALL DEVICES FUNCTION")

	// Validate Email
	err := CheckToken(req.Token)
	if err != nil {
		return nil, err, http.StatusBadRequest
	}

	// Get the email for the coresponding token
	email, err := a.identityDB.GetKey(req.Token)
	if err != nil {
		return nil, nil, http.StatusOK
	}

	// Clear the tokens for the given Email
	err = a.identityDB.Clear(email)
	if err != nil {
		return nil, err, http.StatusInternalServerError
	}

	return nil, nil, http.StatusOK
}
