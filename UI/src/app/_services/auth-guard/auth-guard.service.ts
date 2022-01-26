import { Injectable } from "@angular/core";
import {
	Router,
	CanActivate,
	ActivatedRouteSnapshot,
	RouterStateSnapshot,
} from "@angular/router";
import axios, { AxiosRequestConfig } from "axios";
import { from, Observable, of } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { TokenStorageService } from "../storage/token-storage.service";
@Injectable({
	providedIn: "root",
})
export class AuthGuardService implements CanActivate {
    private apiUrl: string = environment.authenticator;

	constructor(public router: Router, public tokenStorageService: TokenStorageService) {}
	canActivate(
		route: ActivatedRouteSnapshot,
		state: RouterStateSnapshot
	): Observable<boolean> {
        try {
            const options: AxiosRequestConfig = {
                method: "POST",
                url: `${this.apiUrl}/token`,
                headers: {
                    Authorization: `Bearer ${this.tokenStorageService.getToken()}`
                }
            };

            const reqPromise = axios(options);
            return from(reqPromise).pipe(
                map((response) => {
                    return response && response.status === 200 && response.data.Code === 200;
                }),
                catchError((e: Error) => {
                    console.error(e);
                    this.router.navigate(["/account/login"]);
                    return of(false);
                })
            );
        } catch (error) {
            const e = error as Error;
            console.error(e);
            this.router.navigate(["/account/login"]);
            return of(false);
        }
	}
}
