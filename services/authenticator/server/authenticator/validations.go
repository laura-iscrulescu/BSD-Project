package authenticator

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

func CheckToken(token string) error {
	if token == "" {
		return errors.New("The token field must be specified")
	}

	return nil
}
