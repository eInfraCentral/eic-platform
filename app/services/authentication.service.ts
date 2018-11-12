/**
 * Created by stefania on 8/30/16.
 */

import {Injectable} from "@angular/core";
import {deleteCookie, getCookie, setCookie} from "../domain/utils";
import {NavigationService} from "./navigation.service";
import {isNullOrUndefined} from "util";
import {Router} from "@angular/router";

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
            // console.log(this.b64DecodeUnicode(getCookie(this.cookieName)));/

            this.user = JSON.parse(this.b64DecodeUnicode(getCookie(this.cookieName)));
            this.user.id = this.user.eduperson_unique_id;

            sessionStorage.setItem('userInfo', JSON.stringify(this.user));

            let url = sessionStorage.getItem('redirect_url');
            sessionStorage.removeItem('redirect_url');
            // console.log(sessionStorage.getItem('forward_url'));
            if (!(sessionStorage.getItem('forward_url') === null)) {
                console.log('boomShakalaka');
                url = sessionStorage.getItem('forward_url');
                console.log('first print ' + url);
                sessionStorage.removeItem('forward_url');
            }
            console.log(url);
            this.router.router.navigateByUrl(url);
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
            sessionStorage.setItem('redirect_url', window.location.pathname)
            window.location.href = process.env.API_ENDPOINT + "/openid_connect_login";
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
