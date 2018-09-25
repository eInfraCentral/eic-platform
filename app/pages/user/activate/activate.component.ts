
import {Component, OnInit} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {Subscription} from "rxjs/Subscription";
import {NavigationService} from "../../../services/navigation.service";
import {ResourceService} from "../../../services/resource.service";

@Component({
    selector: "activate",
    templateUrl: "./activate.component.html",
    styleUrls: ["./activate.component.css"]
})
export class ActivateComponent implements OnInit {
    errorMessage: string = null;
    successMessage: string = null;
    private sub: Subscription;

    constructor(public resourceService: ResourceService, public route: ActivatedRoute, public router: NavigationService) {
    }

    ngOnInit() {
        this.sub = this.route.params.subscribe(params => {
            this.resourceService.activateUserAccount(params["id"]).subscribe(/*this.router.login*/);
        });
    }

    ngOnDestroy(): void {
        this.sub.unsubscribe();
    }
}
