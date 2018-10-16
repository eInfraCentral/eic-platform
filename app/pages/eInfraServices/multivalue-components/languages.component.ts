import {Component, Injector} from "@angular/core";
import {Validators} from "@angular/forms";
import {ResourceService} from "../../../services/resource.service";
import {MyGroup} from "../../multiforms/my-group.interface";
import * as sd from "../services.description";

@Component({
    selector: "languagesInfo-form",
    template: `
        <div [formGroup]="group">
            <select formControlName="entry" class="uk-select">
                <option *ngFor="let c of languages | keys | premiumsort:this.weights" [ngValue]="c">
                    {{languages[c]}}
                </option>
            </select>
        </div>
    `
})
export class LanguagesComponent extends MyGroup {
    languages: any = {"qq": "Error fetching languages"};
    readonly groupDefinition = {entry: ["", Validators.required]};
    readonly languagesDesc: sd.Description = sd.languagesDesc;
    weights: string[] = ["en"];

    constructor(public resourceService: ResourceService, protected injector: Injector) {
        super(injector);
    }

    ngOnInit() {
        super.ngOnInit();
        this.resourceService.getVocabularies("Language").subscribe(suc => this.languages = suc);
    }
}
