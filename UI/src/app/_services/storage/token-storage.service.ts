import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})


export class TokenStorageService {
    private TOKEN = 'userToken'

    constructor() { }

    public saveToken(token: string): void {
        window.localStorage.removeItem(this.TOKEN);
        window.localStorage.setItem(this.TOKEN, token);
    }

    public getToken(): string | null {
        return window.localStorage.getItem(this.TOKEN);
    }

    public clearAllTokens(): void {
        window.localStorage.clear();
    }
}