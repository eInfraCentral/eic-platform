/**
 * Created by stefania on 8/30/16.
 */

import {Injectable} from "@angular/core";
import {User} from "../domain/eic-model";
import {deleteCookie, getCookie, setCookie} from "../domain/utils";
import {NavigationService} from "./navigation.service";

@Injectable()
export class AuthenticationService {
    redirectURL: string = "/dashboard";
    cookieName: string = "jwt";
    user: User = null;

    constructor(public router: NavigationService) {
        this.user = JSON.parse(getCookie(this.cookieName));
    }

    public login(user: User) {
        if (!this.isLoggedIn()) {
            setCookie(this.cookieName, JSON.stringify(user), 1);
            this.user = user;
            this.router.go(this.redirectURL);
        }
    }

    public logout() {
        if (this.isLoggedIn()) {
            deleteCookie(this.cookieName);
            this.user = null;
            this.router.home();
        }
    }

    public isLoggedIn(): boolean {
        return getCookie(this.cookieName) != null && this.user != null;
    }

    public getUserId(): string {
        return this.user.id == null ? "null" : this.user.id;
    }
}
