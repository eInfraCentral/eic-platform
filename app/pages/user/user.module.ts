import {CommonModule} from "@angular/common";
/**
 * Created by stefania on 8/1/17.
 */
import {NgModule} from "@angular/core";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ReusableComponentsModule} from "../../shared/reusablecomponents/reusable-components.module";
import {SharedModule} from "../../shared/shared.module";
import {LoginComponent} from "./login/login.component";
import {SignUpComponent} from "./register/sign-up.component";
import {userRouting} from "./user.routing";

@NgModule({
    imports: [
        SharedModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        userRouting,
        ReusableComponentsModule
    ],
    declarations: [
        LoginComponent,
        SignUpComponent
    ]
})
export class UserModule {
}