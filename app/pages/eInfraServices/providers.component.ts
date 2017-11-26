/**
 * Created by pgl on 15/11/17.
 */
import {Component, Injector} from "@angular/core";
import {Validators} from "@angular/forms";
import {AuthenticationService} from "../../services/authentication.service";
import {ResourceService} from "../../services/resource.service";
import {MyGroup} from "../multiforms/my-group.interface";
import * as sd from "./services.description";

@Component({
    selector: "providersInfo-form",
    template: `
        <div [formGroup]="group">
            <select formControlName="entry">
                <option *ngFor="let c of providers | keys | premiumsort:this.weights" [ngValue]="c">
                    {{providers[c]}}
                </option>
            </select>
        </div>
    `
})
export class ProvidersComponent extends MyGroup {
    providers: any = {"qq": "Error fetching providers"};
    readonly groupDefinition = {entry: ["", Validators.required]};
    readonly providersDesc: sd.Description = sd.providersDesc;
    weights:string[] = [];

    constructor(private resourceService: ResourceService, private authenticationService: AuthenticationService,
                injector: Injector) {
        super(injector);
        this.weights[0] = this.authenticationService.user.email.split("@")[0];
    }

    ngOnInit() {
        super.ngOnInit();
        this.resourceService.getProviders().subscribe(suc => this.providers = suc);
    }
}