import {Injectable} from "@angular/core";
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot} from "@angular/router";
import {AuthenticationService} from "./authentication.service";

@Injectable()
export class CanActivateEditGuard implements CanActivate {
    constructor(public userService: AuthenticationService) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return true;
        //return this.userService.canEditService(TODO: Find a smart way of doing this);
    }
}
