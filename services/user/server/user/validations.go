package user

import "errors"

func CheckEmail(email string) error {
	if email == "" {
		return errors.New("The email field must be specified")
	}

	return nil
}

func CheckPassword(password string) error {
	if password == "" {
		return errors.New("The password field must be specified")
	}

	return nil
}

func CheckName(name string) error {
	if name == "" {
		return errors.New("The name field must be specified")
	}

	return nil
}

func CheckGoal(goal int) error {
	if goal < 0 {
		return errors.New("The goal should be positive")
	}

	return nil
}

func CheckCategory(category string) error {
	if category == "" {
		return errors.New("The category field must be specified")
	}

	return nil
}
