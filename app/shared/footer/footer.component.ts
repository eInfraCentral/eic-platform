/**
 * Created by stefania on 1/19/17.
 */
import {Component} from "@angular/core";
import {AuthenticationService} from "../../services/authentication.service";
import {NavigationService} from "../../services/navigation.service";

@Component({
    selector: "footer",
    templateUrl: "./footer.component.html",
    styleUrls: ["./footer.component.css"]
})
export class FooterComponent {

    constructor(public authenticationService: AuthenticationService, public navigationService: NavigationService) {
    }

    isProvider() {
        if (this.authenticationService.isLoggedIn()) {
            return this.authenticationService.getUserProperty('roles').some(x => x === "ROLE_PROVIDER");
        }
    }

    isAdmin() {
        if (this.authenticationService.isLoggedIn()) {
            return this.authenticationService.getUserProperty('roles').some(x => x === "ROLE_ADMIN");
        }
    }

    signUpAndRegisterAservice() {
        sessionStorage.setItem('forward_url', '/newServiceProvider');
        this.navigationService.router.navigateByUrl('/newServiceProvider');
    }
}