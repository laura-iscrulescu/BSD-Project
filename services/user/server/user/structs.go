package user

type RegisterReq struct {
	Email    string `json:"email,required"`
	Password string `json:"password,required"`
	Name     string `json:"name,required"`
}

type ActivateReq struct {
}

type GetReq struct {
	Email string
}

type ChangePasswordReq struct {
	Email       string
	OldPassword string
	NewPassword string
}

type ChangeNameReq struct {
	Email string
	Name  string
}

type ChangeMonthlyGoalReq struct {
	Email string
	Goal  int
}

type DeleteReq struct {
	Email string
}

type AddCategoryReq struct {
	Email    string
	Category string
}

type RemoveCategoryReq struct {
	Email    string
	Category string
}

type Resp struct {
	Resp string
	Err  string
	Code int
}
