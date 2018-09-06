/**
 * Created by stefania on 10/3/16.
 */

import {Component, OnInit} from "@angular/core";
import {NavigationEnd, Router} from "@angular/router";
import {Angulartics2Piwik} from "angulartics2/dist/providers";
import {AuthenticationService} from "./services/authentication.service";
@Component({
    selector: "einfracentral-platform",
    templateUrl: "./app.component.html"
})
export class AppComponent implements OnInit {

    isLoginOrRegister: boolean = false;

    breadcrumbs : string[] = [];

    constructor(public router: Router, public oauthService: AuthenticationService, private angulartics2Piwik: Angulartics2Piwik) {
        // // URL of the SPA to redirect the user to after login
        // this.oauthService.redirectUri = window.location.origin + "/home";
        //
        // // The SPA's id. The SPA is registerd with this id at the auth-server
        // this.oauthService.clientId = "dfd9f71e-2d7e-41a7-a9c5-bc27cc815868";
        //
        // // set the scope for the permissions the client should request
        // // The first three are defined by OIDC. The 4th is a usecase-specific one
        // this.oauthService.scope = "openid";
        //
        // // The name of the auth-server that has to be mentioned within the token
        // this.oauthService.loginUrl = "https://aai.openminted.eu/oidc/authorize";
        //
        // this.oauthService.tryLogin();
    }

    ngOnInit() {
        this.oauthService.getUserInfo();
        this.router.events.subscribe((evt: any) => {

            this.breadcrumbs = evt.url.split(/\//);
            this.breadcrumbs[0] = 'Home';

            // this.isLoginOrRegister = ["/signUp", "/signIn"].indexOf(evt.url) >= 0;
        });
        this.router.events.subscribe((evt) => {
            if (!(evt instanceof NavigationEnd)) {
                return;
            }
            window.scrollTo(0, 0);
        });
    }
}
