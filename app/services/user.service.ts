/**
 * Created by stefania on 8/30/16.
 */

import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Rx";
import {Service, User} from "../domain/eic-model";
import {AuthenticationService} from "./authentication.service";
import {HTTPWrapper} from "./http-wrapper.service";
import {NavigationService} from "./navigation.service";

@Injectable()
export class UserService {
    constructor(private http: HTTPWrapper, private router: NavigationService, private authenticationService: AuthenticationService) {
    }

    addFavourite(serviceID: string): Observable<any> {
        if (this.authenticationService.isLoggedIn()) {
            let userID = this.authenticationService.user.id;
            return this.http.post("/user/addFavourite", {userID, serviceID});
        } else {
            this.router.login();
            return Observable.throw("Not logged in");
        }

    }

    loginUser(email: string, password: string): Observable<any> {
        return this.http.post("/user/login", {email, password});
    }

    registerUser(user: User): Observable<any> {
        return this.http.post("/user/register", user);
    }

    public canEditService(service: Service) {
        return this.authenticationService.isLoggedIn() && service.providers && service.providers.length > 0 &&
            service.providers.indexOf(this.authenticationService.user.email.split("@")[0]) > -1;
    }

    public rateService(id: string) {
        if (this.authenticationService.isLoggedIn()) {
            console.log(`Gon rate ${id} when this is implemented!`);
        } else {
            this.router.login();
        }
    }
}