import {Component, Injector} from "@angular/core";
import {Validators} from "@angular/forms";
import {ResourceService} from "../../../services/resource.service";
import {MyGroup} from "../../multiforms/my-group.interface";
import * as sd from "../services.description";

@Component({
    selector: "placesInfo-form",
    template: `
        <div [formGroup]="group">
            <select formControlName="entry" class="uk-select">
                <option *ngFor="let c of places | keys | premiumsort:this.weights" [ngValue]="c">{{places[c]}}</option>
            </select>
        </div>
    `
})
export class PlacesComponent extends MyGroup {
    places: any = {"QQ": "Error fetching places"};
    readonly groupDefinition = {entry: ["", Validators.required]};
    readonly placesDesc: sd.Description = sd.placesDesc;
    weights: string[] = ["Place-EU", "Place-WW"];

    constructor(public resourceService: ResourceService, protected injector: Injector) {
        super(injector);
    }

    ngOnInit() {
        super.ngOnInit();
        this.resourceService.getVocabularies("Place").subscribe(suc => this.places = suc);
    }
}
