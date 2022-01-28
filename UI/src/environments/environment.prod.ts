export const environment = {
  production: true,
  registerURL: 'http://localhost:8080/user/register',
  loginURL: 'http://localhost:8080/authenticator/password',
  authenticator: 'http://localhost:8080/authenticator',
  allTransactions: 'http://localhost:8080/api/v1/transactions',
  allCategories: 'http://localhost:8080/api/v1/categories',
  addTransaction: 'http://localhost:8080/api/v1/transactions/add',
  changeUser: 'http://localhost:8080/user/change/name',
  deleteTransaction: 'http://localhost:8080/api/v1/transactions/delete',
  addCategory: 'http://localhost:8080/api/v1/categories/add',
  changePasswd: 'http://localhost:8080/user/change/password',
  changeGoal: 'http://localhost:8080/user/change/goal',
  getGoal: 'http://localhost:8080/user/get'
};
