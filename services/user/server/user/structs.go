package user

type RegisterReq struct {
	Email    string `json:"email,required"`
	Password string `json:"password,required"`
	Name     string `json:"name,required"`
}

type ChangePasswordReq struct {
}

type ActivateReq struct {
}

type GetReq struct {
	Email string
}

type UpdateReq struct {
}

type MonthlyGoalReq struct {
}

type DeleteReq struct {
	Email string
}

type CreateCategoryReq struct {
}

type DeleteCategoryReq struct {
}

type Resp struct {
	Resp string
	Err  string
	Code int
}
