package user

import (
	"context"
	"encoding/json"
	"errors"
	"net/http"
	"services/user/identityDB"
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
	ctx        context.Context
	identityDB identityDB.IdentityDB
	mainDB     mainDB.MainDB
	log        log.Log
}

func Initialize(ctx context.Context, identityDB identityDB.IdentityDB, mainDB mainDB.MainDB, log log.Log) User {
	return &userStruct{
		ctx:        ctx,
		identityDB: identityDB,
		mainDB:     mainDB,
		log:        log,
	}
}

func (u *userStruct) Register(req RegisterReq) ([]byte, error, int) {
	u.log.Info("REGISTER FUNCTION")

	// Validate Email, Password and Name
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
		return nil, errors.New("User already exists with this E-mail"), http.StatusConflict
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

	// Validate Token
	err := CheckToken(req.Token)
	if err != nil {
		return nil, err, http.StatusBadRequest
	}

	// Get the email for the coresponding token
	email, err := u.identityDB.GetKey(req.Token)
	if err != nil {
		return nil, err, http.StatusUnauthorized
	}

	// Get the user from the database
	user, err := u.mainDB.Get(email)
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

	// Validate Token, OldPassword and NewPassword
	err := CheckToken(req.Token)
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

	// Get the email for the coresponding token
	email, err := u.identityDB.GetKey(req.Token)
	if err != nil {
		return nil, err, http.StatusUnauthorized
	}

	// Get the user from the database
	user, err := u.mainDB.GetWithPassword(email)
	if err != nil {
		return nil, err, http.StatusBadRequest
	}

	// Check OldPassword with CurrentPassword
	if req.OldPassword != user.Password {
		return nil, errors.New("The current password is invalid"), http.StatusBadRequest
	}

	// Update user Password
	user.Password = req.NewPassword
	err = u.mainDB.UpdateWithPassword(user)
	if err != nil {
		return nil, err, http.StatusInternalServerError
	}

	return nil, nil, http.StatusOK
}

func (u *userStruct) ChangeName(req ChangeNameReq) ([]byte, error, int) {
	u.log.Info("CHANGE NAME FUNCTION")

	// Validate Token and Name
	err := CheckToken(req.Token)
	if err != nil {
		return nil, err, http.StatusBadRequest
	}

	err = CheckName(req.Name)
	if err != nil {
		return nil, err, http.StatusBadRequest
	}

	// Get the email for the coresponding token
	email, err := u.identityDB.GetKey(req.Token)
	if err != nil {
		return nil, err, http.StatusUnauthorized
	}

	// Get the user from the database
	user, err := u.mainDB.Get(email)
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

	// Validate Token and Name
	err := CheckToken(req.Token)
	if err != nil {
		return nil, err, http.StatusBadRequest
	}

	err = CheckGoal(req.Goal)
	if err != nil {
		return nil, err, http.StatusBadRequest
	}

	// Get the email for the coresponding token
	email, err := u.identityDB.GetKey(req.Token)
	if err != nil {
		return nil, err, http.StatusUnauthorized
	}

	// Get the user from the database
	user, err := u.mainDB.Get(email)
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

	// Validate Token and Password
	err := CheckToken(req.Token)
	if err != nil {
		return nil, err, http.StatusBadRequest
	}

	err = CheckPassword(req.Password)
	if err != nil {
		return nil, err, http.StatusBadRequest
	}

	// Get the email for the coresponding token
	email, err := u.identityDB.GetKey(req.Token)
	if err != nil {
		return nil, err, http.StatusUnauthorized
	}

	// Check to see if the user exists
	user, err := u.mainDB.GetWithPassword(email)
	if err != nil {
		return nil, err, http.StatusBadRequest
	}

	// Check to see if password matches
	if req.Password != user.Password {
		return nil, errors.New("The password is incorrect"), http.StatusUnauthorized
	}

	// Remove the user from the database
	err = u.mainDB.Remove(email)
	if err != nil {
		return nil, err, http.StatusInternalServerError
	}

	return nil, nil, http.StatusOK
}

func (u *userStruct) AddCategory(req AddCategoryReq) ([]byte, error, int) {
	u.log.Info("ADD CATEGORY FUNCTION")

	// Validate Token and Category
	err := CheckToken(req.Token)
	if err != nil {
		return nil, err, http.StatusBadRequest
	}

	err = CheckCategory(req.Category)
	if err != nil {
		return nil, err, http.StatusBadRequest
	}

	// Get the email for the coresponding token
	email, err := u.identityDB.GetKey(req.Token)
	if err != nil {
		return nil, err, http.StatusUnauthorized
	}

	// Get the user from the database
	user, err := u.mainDB.Get(email)
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

	// Validate Token and Category
	err := CheckToken(req.Token)
	if err != nil {
		return nil, err, http.StatusBadRequest
	}

	err = CheckCategory(req.Category)
	if err != nil {
		return nil, err, http.StatusBadRequest
	}

	// Get the email for the coresponding token
	email, err := u.identityDB.GetKey(req.Token)
	if err != nil {
		return nil, err, http.StatusUnauthorized
	}

	// Get the user from the database
	user, err := u.mainDB.Get(email)
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
