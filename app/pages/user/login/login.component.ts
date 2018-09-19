/**
 * Created by stefania on 8/1/17.
 */
import {Component} from "@angular/core";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {User} from "../../../domain/eic-model";
import {AuthenticationService} from "../../../services/authentication.service";
import {UserService} from "../../../services/user.service";

@Component({
    selector: "login",
    templateUrl: "./login.component.html",
    styleUrls: ["./login.component.css"]
})
export class LoginComponent {
    public loginForm: FormGroup;
    public submitted: boolean;
    public errorMessage: string;

    constructor(public fb: FormBuilder, public authenticationService: AuthenticationService,
                public userService: UserService) {
        this.loginForm = fb.group({
            "email": ["", Validators.compose([Validators.required, Validators.email])],
            "password": ["", Validators.required]
        });
    }

    onSubmit(myUser: User, isValid: boolean) {
        /*if (isValid || ( (myUser.email !== '') && (myUser.password !== '') )) {
            this.userService.loginUser(myUser.email, myUser.password).subscribe(user => this.saveLoginStatus(user));
        } else {
            this.errorMessage = "Invalid";
        }*/
    }

    /*saveLoginStatus(user: AAIUser) {
        this.authenticationService.login(user);
        this.submitted = true;
    }*/
}
