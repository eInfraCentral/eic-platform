import {Component, Injector} from "@angular/core";
import {Validators} from "@angular/forms";
import {ResourceService} from "../../../services/resource.service";
import {MyGroup} from "../../multiforms/my-group.interface";
import * as sd from "../services.description";
import {SearchResults} from "../../../domain/search-results";
import {Vocabulary} from "../../../domain/eic-model";

@Component({
    selector: "placesInfo-form",
    template: `
        <div [formGroup]="group">
            <select formControlName="entry" class="uk-select">
                <ng-container *ngIf="placesVocabulary">
                    <option *ngFor="let placeEntry of placesVocabulary.entries | values | premiumsort:weights" value="{{placeEntry}}">
                        {{placesVocabulary.entries[placeEntry].name}}
                    </option>
                </ng-container>
            </select>
        </div>
    `
})
export class PlacesComponent extends MyGroup {
    places: SearchResults<Vocabulary> = null;
    placesVocabulary: Vocabulary = null;
    readonly groupDefinition = {entry: ["", Validators.required]};
    readonly placesDesc: sd.Description = sd.placesDesc;
    weights: string[] = ["EU", "WW"];

    constructor(public resourceService: ResourceService, protected injector: Injector) {
        super(injector);
    }

    ngOnInit() {
        super.ngOnInit();
        this.resourceService.getVocabulariesByType("PLACES").subscribe(
            suc => {
                this.places = suc;
                this.placesVocabulary = this.places.results[0];
            }
        );
    }
}
