import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})


export class UserIDStorageService {
    private UserId = 'userId'

    constructor() { }

    public saveToken(userId: string): void {
        window.localStorage.removeItem(this.UserId);
        window.localStorage.setItem(this.UserId, userId);
    }

    public getToken(): string | null {
        return window.localStorage.getItem(this.UserId);
    }

    public clearAllTokens(): void {
        window.localStorage.clear();
    }
}