package user

type RegisterReq struct {
	Email    string `json:"email,required"`
	Password string `json:"password,required"`
	Name     string `json:"name,required"`
}

type ActivateReq struct {
}

type GetReq struct {
	Token string
}

type ChangePasswordReq struct {
	Token       string
	OldPassword string
	NewPassword string
}

type ChangeNameReq struct {
	Token string
	Name  string
}

type ChangeMonthlyGoalReq struct {
	Token string
	Goal  int
}

type DeleteReq struct {
	Token    string
	Password string
}

type AddCategoryReq struct {
	Token    string
	Category string
}

type RemoveCategoryReq struct {
	Token    string
	Category string
}

type Resp struct {
	Resp string
	Err  string
	Code int
}
