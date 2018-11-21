import {Component, Injector} from "@angular/core";
import {Validators} from "@angular/forms";
import {ResourceService} from "../../../services/resource.service";
import {MyGroup} from "../../multiforms/my-group.interface";
import * as sd from "../services.description";
import {SearchResults} from "../../../domain/search-results";
import {Vocabulary} from "../../../domain/eic-model";

@Component({
    selector: "languagesInfo-form",
    template: `
        <div [formGroup]="group">
            <select formControlName="entry" class="uk-select">
                <ng-container *ngIf="languagesVocabulary">
                    <option *ngFor="let languageEntry of languagesVocabulary.entries | values | premiumsort:weights" value="{{languageEntry}}">
                        {{languagesVocabulary.entries[languageEntry].name}}
                    </option>
                </ng-container>
            </select>
        </div>
    `
})
export class LanguagesComponent extends MyGroup {
    languages: SearchResults<Vocabulary> = null;
    languagesVocabulary: Vocabulary = null;
    readonly groupDefinition = {entry: ["", Validators.required]};
    readonly languagesDesc: sd.Description = sd.languagesDesc;
    weights: string[] = ["english"];

    constructor(public resourceService: ResourceService, protected injector: Injector) {
        super(injector);
    }

    ngOnInit() {
        super.ngOnInit();
        this.resourceService.getVocabulariesByType("LANGUAGES").subscribe(
            suc => {
                this.languages = suc;
                this.languagesVocabulary = this.languages.results[0];
            }
        );
    }
}
