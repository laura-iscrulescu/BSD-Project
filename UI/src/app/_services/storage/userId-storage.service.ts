import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})


export class UserIDStorageService {
    private UserId = 'userId'

    constructor() { }

    public saveUserId(userId: string): void {
        window.localStorage.removeItem(this.UserId);
        window.localStorage.setItem(this.UserId, userId);
    }

    public getUserId(): string | null {
        return window.localStorage.getItem(this.UserId);
    }

    public clearAll(): void {
        window.localStorage.clear();
    }
}