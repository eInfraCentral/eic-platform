import {Component, Injector} from "@angular/core";
import {ResourceService} from "../../../services/resource.service";
import {MyGroup} from "../../multiforms/my-group.interface";
import * as sd from "../services.description";

@Component({
    selector: "requiredServicesInfo-form",
    template: `
        <div [formGroup]="group">
            <select formControlName="entry">
                <option *ngFor="let c of requiredServices | keys" [ngValue]="c">{{requiredServices[c]}}</option>
            </select>
        </div>
    `
})
export class RequiredServicesComponent extends MyGroup {
    requiredServices: any = {"00.00": "Failed to fetch services"};
    readonly groupDefinition = {entry: [""]};
    readonly requiredServicesDesc: sd.Description = sd.requiredServicesDesc;

    constructor(public resourceService: ResourceService, protected injector: Injector) {
        super(injector);
    }

    ngOnInit() {
        super.ngOnInit();
        this.resourceService.getServices().subscribe(suc => this.requiredServices = this.transformInput(suc));
    }

    transformInput(input) {
        return Object.keys(input).reduce((accumulator, value) => {
            accumulator[value] = input[value][0].providers[0] + " - " + input[value][0].name;
            return accumulator;
        }, {});
    }
}
