/**
 * Created by stefania on 8/30/16.
 */

import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Rx";
import {Service, User} from "../domain/eic-model";
import {AuthenticationService} from "./authentication.service";
import {HTTPWrapper} from "./http-wrapper.service";
import {NavigationService} from "./navigation.service";
import {ResourceService} from "./resource.service";

@Injectable()
export class UserService {
    constructor(public http: HTTPWrapper, public router: NavigationService, public authenticationService: AuthenticationService,
                public resourceService: ResourceService) {
    }

    addFavourite(serviceID: string) {
        if (this.authenticationService.isLoggedIn()) {
            return this.http.put(`/event/favourite/service/${serviceID}/user/${this.authenticationService.getUserId()}`,{});
            // return this.resourceService.recordEvent(serviceID, "FAVOURITE", 1).subscribe(console.log);
        } else {
            this.router.login();
        }
    }

    public getFavouritesOfUser() {
        if (this.authenticationService.isLoggedIn()) {
            return this.http.get(`/event/favourite/all/user/${this.authenticationService.getUserId()}`);
        } else {
            this.router.login();
        }
    }

    getIfFavouriteOfUser(service: string) {
        if (this.authenticationService.isLoggedIn()) {
            return this.http.get(`/event/favourite/service/${service}/user/${this.authenticationService.getUserId()}`);
        } else {
            this.router.login();
        }
    }

    loginUser(email: string, password: string): Observable<any> {
        return this.http.post("/user/login", {email, password});
    }

    registerUser(user: User): Observable<any> {
        return this.http.post("/user/register", user);
    }

    public canEditService(service: Service) {
        return this.authenticationService.isLoggedIn() && service.provider && service.provider.length > 0 &&
            service.provider.indexOf(this.authenticationService.user.email.split("@")[0]) > -1;
    }

    public rateService(serviceID: string, rating: any) {
        if (this.authenticationService.isLoggedIn()) {
            return this.http.put(`/event/rating/service/${serviceID}/user/${this.authenticationService.getUserId()}?rating=${rating}`,{});
            // return this.resourceService.recordEvent(serviceID, "RATING", value).subscribe(console.log);
        } else {
            this.router.login();
        }
    }

    public getRatingsOfUser() {
        if (this.authenticationService.isLoggedIn()) {
            return this.http.get(`/event/rating/all/user/${this.authenticationService.getUserId()}`);
        } else {
            this.router.login();
        }
    }

    getUserRating(service: string) {
        if (this.authenticationService.isLoggedIn()) {
            return this.http.get(`/event/rating/service/${service}/user/${this.authenticationService.getUserId()}`);
        } else {
            this.router.login();
        }
    }

    isDev() {
        return localStorage.getItem("dev") === "aye";
    }
}