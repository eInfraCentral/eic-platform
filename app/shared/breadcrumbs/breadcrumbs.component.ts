/**
 * Created by stefania on 05/06/2018.
 */
import { Component, Input, OnInit } from "@angular/core";
import { AuthenticationService } from "../../services/authentication.service";
import { ActivatedRoute, Router } from "@angular/router";
import { NavigationService } from "../../services/navigation.service";

@Component({
    selector: "breadcrumbs",
    templateUrl: "./breadcrumbs.component.html",
    styleUrls: ["./breadcrumbs.component.css"],
})
export class BreadcrumbsComponent implements OnInit {

    @Input('breadcrumbs') breadcrumbs: string[];

    constructor(public authenticationService: AuthenticationService,
                public router: Router, public navigationService: NavigationService,
                private activatedRoute: ActivatedRoute) {
    }

    ngOnInit(): void {
    }
}