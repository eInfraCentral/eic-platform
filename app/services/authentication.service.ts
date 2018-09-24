/**
 * Created by stefania on 8/30/16.
 */

import {Injectable} from "@angular/core";
import {deleteCookie, getCookie, setCookie} from "../domain/utils";
import {NavigationService} from "./navigation.service";
import {isNullOrUndefined} from "util";

@Injectable()
export class AuthenticationService {
    redirectURL: string = "/myServiceProviders";
    cookieName: string = "info";
    user = null;

    constructor(public router: NavigationService) {
        // this.user = JSON.parse(getCookie(this.cookieName));
    }

    /*public loginOLD(user: AAIUser) {
        if (!this.isLoggedIn()) {
            setCookie(this.cookieName, JSON.stringify(user), 1);
            this.user = user;
            this.router.go(this.redirectURL);
        }
    }*/

    public b64DecodeUnicode(str: string) {
        return decodeURIComponent(Array.prototype.map.call(atob(str), function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
        }).join(''))
    }

    public getUserInfo() {
        // retrieve user information from cookie
        if (!this.isLoggedIn() && getCookie(this.cookieName) !== null) {
            console.log(this.b64DecodeUnicode(getCookie(this.cookieName)));
            this.b64DecodeUnicode(getCookie(this.cookieName));

            this.user = JSON.parse(this.b64DecodeUnicode(getCookie(this.cookieName)));
            this.user.id = this.user.eduperson_unique_id;

            // TODO: comment before push
            this.user.roles.push('ROLE_ADMIN');
            // this.user.roles.push('ROLE_PROVIDER');

            sessionStorage.setItem('userInfo', JSON.stringify(this.user));
            // console.log(this.user);
            // this.user = user;
            // this.router.go(this.redirectURL);
        }
    }

    getUser() {
        const user = JSON.parse(sessionStorage.getItem('userInfo'));
        if (!isNullOrUndefined(user)) {
            return user;
        }
        return null;
    }

    getUserProperty(property: string) {
        const user = JSON.parse(sessionStorage.getItem('userInfo'));
        if ( !isNullOrUndefined(user) && !isNullOrUndefined(user[property]) && (user[property] !== 'null') ) {
            return user[property];
        }
        return null;
    }

    public login() {
        if (getCookie(this.cookieName) !== null) {
            console.log('found cookie');
            this.getUserInfo();
        } else {

            // TODO: comment before push!!!
            setCookie(this.cookieName, 'eyJzdWIiOiIxMTY0MTIwNjkzMzUwMTc0NDUyNzVAZ29vZ2xlLmNvbSIsIm5hbWUiOiLOms+Jzr3Pg8+EzrHOvc+Ezq/Ovc6/z4IgzqPPgM+Nz4HOv8+FIiwiZ2l2ZW5fbmFtZSI6Is6az4nOvc+Dz4TOsc69z4TOr869zr/PgiIsImZhbWlseV9uYW1lIjoizqPPgM+Nz4HOv8+FIiwiZW1haWwiOiJzcHlyb3Vrb25AZ21haWwuY29tIiwiZWR1cGVyc29uX3VuaXF1ZV9pZCI6IjExNjQxMjA2OTMzNTAxNzQ0NTI3NUBnb29nbGUuY29tIiwicm9sZXMiOlsiUk9MRV9QUk9WSURFUiIsIlJPTEVfVVNFUiJdfQ==',1)
            window.location.href = 'http://0.0.0.0:3000/home';

            // TODO: restore before push!!!
            //window.location.href = process.env.API_ENDPOINT + "/openid_connect_login";

        }
    }

    public logout() {
        if (this.isLoggedIn()) {
            deleteCookie(this.cookieName);
            this.user = null;
            sessionStorage.clear();
            window.location.href = process.env.API_ENDPOINT + "/openid_logout";
            // this.router.home();
        }
    }

    public isLoggedIn(): boolean {
        return getCookie(this.cookieName) != null && this.user != null;
    }

    public getUserId(): string {
        return this.user.id == null ? "null" : this.user.id;
    }

    public getUserRoles(): string[] {
        return this.user.roles !== undefined ? this.user.roles : null;
    }
}
