// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  registerURL: "http://localhost:8080/user/register",
  loginURL: "http://localhost:8080/authenticator/password",
  authenticator: "http://localhost:8080/authenticator",
  allTransactions: "http://localhost:8080/api/v1/transactions",
  allCategories: "http://localhost:8080/api/v1/categories",
  addTransaction: "http://localhost:8080/api/v1/transactions/add",
  addCategory: "http://localhost:8080/api/v1/categories/add"
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
