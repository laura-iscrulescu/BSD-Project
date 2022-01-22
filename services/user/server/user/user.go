package user

import (
	"context"
	"encoding/json"
	"errors"
	"net/http"
	"services/user/log"
	"services/user/mainDB"
)

type User interface {
	Register(req RegisterReq) ([]byte, error, int)
	ChangePassword(req ChangePasswordReq) ([]byte, error, int)
	Activate(req ActivateReq) ([]byte, error, int)
	Get(req GetReq) ([]byte, error, int)
	Update(req UpdateReq) ([]byte, error, int)
	MonthlyGoal(req MonthlyGoalReq) ([]byte, error, int)
	Delete(req DeleteReq) ([]byte, error, int)
	CreateCategory(req CreateCategoryReq) ([]byte, error, int)
	DeleteCategory(req DeleteCategoryReq) ([]byte, error, int)
}

type userStruct struct {
	ctx    context.Context
	mainDB mainDB.MainDB
	log    log.ILog
}

func Initialize(ctx context.Context, mainDB mainDB.MainDB, log log.ILog) User {
	return &userStruct{
		ctx:    ctx,
		mainDB: mainDB,
		log:    log,
	}
}

func (u *userStruct) Register(req RegisterReq) ([]byte, error, int) {
	u.log.Info("REGISTER FUNCTION")

	// Validate Email, password and name
	err := CheckEmail(req.Email)
	if err != nil {
		return nil, err, http.StatusBadRequest
	}

	err = CheckPassword(req.Password)
	if err != nil {
		return nil, err, http.StatusBadRequest
	}

	err = CheckName(req.Name)
	if err != nil {
		return nil, err, http.StatusBadRequest
	}

	// Check to see if the user already exists
	_, err = u.mainDB.Get(req.Email)
	if err == nil {
		return nil, errors.New("User already exists with this E-mail"), http.StatusBadRequest
	}

	// Add the new user to the database
	err = u.mainDB.Add(req.Email, req.Password, req.Name)
	if err != nil {
		return nil, err, http.StatusInternalServerError
	}

	return nil, nil, http.StatusOK
}

func (u *userStruct) ChangePassword(req ChangePasswordReq) ([]byte, error, int) {
	return nil, nil, 0
}

func (u *userStruct) Activate(req ActivateReq) ([]byte, error, int) {
	return nil, nil, 0
}

func (u *userStruct) Get(req GetReq) ([]byte, error, int) {
	u.log.Info("GET FUNCTION")

	// Validate Email, password and name
	err := CheckEmail(req.Email)
	if err != nil {
		return nil, err, http.StatusBadRequest
	}

	// Get the user from the database
	user, err := u.mainDB.Get(req.Email)
	if err != nil {
		return nil, err, http.StatusBadRequest
	}

	// Transform user data into a string
	userMarshaled, err := json.Marshal(user)
	if err != nil {
		return nil, err, http.StatusInternalServerError
	}

	return userMarshaled, nil, http.StatusOK
}

func (u *userStruct) Update(req UpdateReq) ([]byte, error, int) {
	return nil, nil, 0
}

func (u *userStruct) MonthlyGoal(req MonthlyGoalReq) ([]byte, error, int) {
	return nil, nil, 0
}

func (u *userStruct) Delete(req DeleteReq) ([]byte, error, int) {
	u.log.Info("DELETE FUNCTION")

	// Validate Email, password and name
	err := CheckEmail(req.Email)
	if err != nil {
		return nil, err, http.StatusBadRequest
	}

	// Check to see if the user exists
	_, err = u.mainDB.Get(req.Email)
	if err != nil {
		return nil, err, http.StatusBadRequest
	}

	// Remove the user from the database
	err = u.mainDB.Remove(req.Email)
	if err != nil {
		return nil, err, http.StatusInternalServerError
	}

	return nil, nil, http.StatusOK
}

func (u *userStruct) CreateCategory(req CreateCategoryReq) ([]byte, error, int) {
	return nil, nil, 0
}

func (u *userStruct) DeleteCategory(req DeleteCategoryReq) ([]byte, error, int) {
	return nil, nil, 0
}
