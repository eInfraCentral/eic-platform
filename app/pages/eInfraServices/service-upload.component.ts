import {Component, Injector, OnInit} from "@angular/core";
import {Subscription} from "rxjs/Subscription";
import {Service} from "../../domain/eic-model";
import {ServiceFormComponent} from "./service-form.component";
import {AuthenticationService} from "../../services/authentication.service";

@Component({
    selector: "service-upload",
    templateUrl: "./service-form.component.html",
    styleUrls: ["./service-upload.component.css"]
})
export class ServiceUploadComponent extends ServiceFormComponent implements OnInit {
    private sub: Subscription;

    constructor(protected injector: Injector, protected authenticationService: AuthenticationService) {
        super(injector, authenticationService);
        this.editMode = false;
    }

    ngOnInit() {
        super.ngOnInit();
    }

    onSuccess(service) {
        this.successMessage = "Service uploaded successfully!";
    }

    onSubmit(service: Service, isValid: boolean) {
        super.onSubmit(service, isValid);
    }

}