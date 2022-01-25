package authenticator

type LoginWithPasswordReq struct {
	Email    string
	Password string
}

type CheckTokenReq struct {
	Token string
}

type LogoutSingleDeviceReq struct {
	Token string
}

type LogoutAllDevicesReq struct {
	Token string
}

type Resp struct {
	Resp string
	Err  string
	Code int
}
