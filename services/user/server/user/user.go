package user

import (
	"context"
	"encoding/json"
	"errors"
	"net/http"
	"services/user/log"
	"services/user/mainDB"
	"services/user/utils"
)

type User interface {
	Register(req RegisterReq) ([]byte, error, int)
	Activate(req ActivateReq) ([]byte, error, int)
	Get(req GetReq) ([]byte, error, int)
	ChangePassword(req ChangePasswordReq) ([]byte, error, int)
	ChangeName(req ChangeNameReq) ([]byte, error, int)
	ChangeMonthlyGoal(req ChangeMonthlyGoalReq) ([]byte, error, int)
	Delete(req DeleteReq) ([]byte, error, int)
	AddCategory(req AddCategoryReq) ([]byte, error, int)
	RemoveCategory(req RemoveCategoryReq) ([]byte, error, int)
}

type userStruct struct {
	ctx    context.Context
	mainDB mainDB.MainDB
	log    log.Log
}

func Initialize(ctx context.Context, mainDB mainDB.MainDB, log log.Log) User {
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

func (u *userStruct) ChangePassword(req ChangePasswordReq) ([]byte, error, int) {
	u.log.Info("CHANGE PASSWORD FUNCTION")

	// Validate Email, OldPassword and NewPassword
	err := CheckEmail(req.Email)
	if err != nil {
		return nil, err, http.StatusBadRequest
	}

	err = CheckPassword(req.OldPassword)
	if err != nil {
		return nil, err, http.StatusBadRequest
	}

	err = CheckPassword(req.NewPassword)
	if err != nil {
		return nil, err, http.StatusBadRequest
	}

	// Get the user from the database
	user, err := u.mainDB.Get(req.Email)
	if err != nil {
		return nil, err, http.StatusBadRequest
	}

	// Check OldPassword with CurrentPassword
	if req.OldPassword != user.Password {
		return nil, errors.New("The current password is invalid"), http.StatusBadRequest
	}

	// Update user Password
	user.Password = req.NewPassword
	err = u.mainDB.Update(user)
	if err != nil {
		return nil, err, http.StatusInternalServerError
	}

	return nil, nil, http.StatusOK
}

func (u *userStruct) ChangeName(req ChangeNameReq) ([]byte, error, int) {
	u.log.Info("CHANGE NAME FUNCTION")

	// Validate Email and Name
	err := CheckEmail(req.Email)
	if err != nil {
		return nil, err, http.StatusBadRequest
	}

	err = CheckName(req.Name)
	if err != nil {
		return nil, err, http.StatusBadRequest
	}

	// Get the user from the database
	user, err := u.mainDB.Get(req.Email)
	if err != nil {
		return nil, err, http.StatusBadRequest
	}

	// Update user Name
	user.Name = req.Name
	err = u.mainDB.Update(user)
	if err != nil {
		return nil, err, http.StatusInternalServerError
	}

	return nil, nil, http.StatusOK
}

func (u *userStruct) ChangeMonthlyGoal(req ChangeMonthlyGoalReq) ([]byte, error, int) {
	u.log.Info("CHANGE MONTHLY GOAL FUNCTION")

	// Validate Email and Name
	err := CheckEmail(req.Email)
	if err != nil {
		return nil, err, http.StatusBadRequest
	}

	err = CheckGoal(req.Goal)
	if err != nil {
		return nil, err, http.StatusBadRequest
	}

	// Get the user from the database
	user, err := u.mainDB.Get(req.Email)
	if err != nil {
		return nil, err, http.StatusBadRequest
	}

	// Update user Name
	user.Goal = req.Goal
	err = u.mainDB.Update(user)
	if err != nil {
		return nil, err, http.StatusInternalServerError
	}

	return nil, nil, http.StatusOK
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

func (u *userStruct) AddCategory(req AddCategoryReq) ([]byte, error, int) {
	u.log.Info("ADD CATEGORY FUNCTION")

	// Validate Email and Category
	err := CheckEmail(req.Email)
	if err != nil {
		return nil, err, http.StatusBadRequest
	}

	err = CheckCategory(req.Category)
	if err != nil {
		return nil, err, http.StatusBadRequest
	}

	// Get the user from the database
	user, err := u.mainDB.Get(req.Email)
	if err != nil {
		return nil, err, http.StatusBadRequest
	}

	// Add Category to user Categories
	user.Categories = append(user.Categories, req.Category)
	err = u.mainDB.Update(user)
	if err != nil {
		return nil, err, http.StatusInternalServerError
	}

	return nil, nil, http.StatusOK
}

func (u *userStruct) RemoveCategory(req RemoveCategoryReq) ([]byte, error, int) {
	u.log.Info("REMOVE CATEGORY FUNCTION")

	// Validate Email and Category
	err := CheckEmail(req.Email)
	if err != nil {
		return nil, err, http.StatusBadRequest
	}

	err = CheckCategory(req.Category)
	if err != nil {
		return nil, err, http.StatusBadRequest
	}

	// Get the user from the database
	user, err := u.mainDB.Get(req.Email)
	if err != nil {
		return nil, err, http.StatusBadRequest
	}

	// Remove Category from user Categories
	user.Categories = utils.Remove(user.Categories, req.Category)
	err = u.mainDB.Update(user)
	if err != nil {
		return nil, err, http.StatusInternalServerError
	}

	return nil, nil, http.StatusOK
}
