import {Component, Injector, Type} from "@angular/core";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Observable} from "rxjs/Observable";
import {Service} from "../../domain/eic-model";
import {NavigationService} from "../../services/navigation.service";
import {ResourceService} from "../../services/resource.service";
import {UserService} from "../../services/user.service";
import {URLValidator} from "../../shared/validators/generic.validator";
import {LifeCycleStatusValidator, TRLValidator} from "../../shared/validators/vocabulary.validator";
import {LanguagesComponent} from "./multivalue-components/languages.component";
import {PlacesComponent} from "./multivalue-components/places.component";
import {ProvidersComponent} from "./multivalue-components/providers.component";
import {RelatedServicesComponent} from "./multivalue-components/relatedServices.component";
import {RequiredServicesComponent} from "./multivalue-components/requiredServices.component";
import {TagsComponent} from "./multivalue-components/tags.component";
import {TermsOfUseComponent} from "./multivalue-components/termsOfUse.component";
import * as sd from "./services.description";
import {AuthenticationService} from "../../services/authentication.service";
import {categoriesAndSubcategories} from "../../domain/categories";

@Component({
    selector: "service-form",
    templateUrl: "./service-form.component.html",
    styleUrls: ["./service-form.component.css"]
})
export class ServiceFormComponent {
    editMode: boolean;
    serviceForm: FormGroup;
    service: Service;
    errorMessage: string = null;
    successMessage: string = null;
    submitted = false;
    readonly urlDesc: sd.Description = sd.urlDesc;
    readonly nameDesc: sd.Description = sd.nameDesc;
    readonly taglineDesc: sd.Description = sd.taglineDesc;
    readonly descriptionDesc: sd.Description = sd.descriptionDesc;
    readonly optionsDesc: sd.Description = sd.optionsDesc;
    readonly targetUsersDesc: sd.Description = sd.targetUsersDesc;
    readonly userValueDesc: sd.Description = sd.userValueDesc;
    readonly userBaseDesc: sd.Description = sd.userBaseDesc;
    readonly symbolDesc: sd.Description = sd.symbolDesc;
    readonly multimediaURLDesc: sd.Description = sd.multimediaURLDesc;
    readonly providersDesc: sd.Description = sd.providersDesc;
    readonly versionDesc: sd.Description = sd.versionDesc;
    readonly lastUpdateDesc: sd.Description = sd.lastUpdateDesc;
    readonly changeLogDesc: sd.Description = sd.changeLogDesc;
    //whereis validForDesc
    readonly lifeCycleStatusDesc: sd.Description = sd.lifeCycleStatusDesc;
    readonly trlDesc: sd.Description = sd.trlDesc;
    readonly categoryDesc: sd.Description = sd.categoryDesc;
    readonly subcategoryDesc: sd.Description = sd.subcategoryDesc;
    readonly placesDesc: sd.Description = sd.placesDesc;
    readonly languagesDesc: sd.Description = sd.languagesDesc;
    readonly tagsDesc: sd.Description = sd.tagsDesc;
    readonly requiredServicesDesc: sd.Description = sd.requiredServicesDesc;
    readonly relatedServicesDesc: sd.Description = sd.relatedServicesDesc;
    readonly requestDesc: sd.Description = sd.requestDesc;
    readonly helpdeskDesc: sd.Description = sd.helpdeskDesc;
    readonly userManualDesc: sd.Description = sd.userManualDesc;
    readonly trainingInformationDesc: sd.Description = sd.trainingInformationDesc;
    readonly feedbackDesc: sd.Description = sd.feedbackDesc;
    readonly priceDesc: sd.Description = sd.priceDesc;
    readonly serviceLevelAgreementDesc: sd.Description = sd.serviceLevelAgreementDesc;
    readonly termsOfUseDesc: sd.Description = sd.termsOfUseDesc;
    readonly fundingDesc: sd.Description = sd.fundingDesc;
    placesComponent: Type<PlacesComponent> = PlacesComponent;
    languagesComponent: Type<LanguagesComponent> = LanguagesComponent;
    providersComponent: Type<ProvidersComponent> = ProvidersComponent;
    tagsComponent: Type<TagsComponent> = TagsComponent;
    requiredServicesComponent: Type<RequiredServicesComponent> = RequiredServicesComponent;
    relatedServicesComponent: Type<RelatedServicesComponent> = RelatedServicesComponent;
    termsOfUseComponent: Type<TermsOfUseComponent> = TermsOfUseComponent;
    formGroupMeta = {
        "url": ["", Validators.compose([Validators.required, URLValidator])],
        "name": ["", Validators.required],
        "tagline": [""],
        "description": ["", Validators.required],
        "options": [""],
        "targetUsers": [""],
        "userValue": [""],
        "userBase": [""],
        "symbol": ["", URLValidator],
        "multimediaURL": ["", URLValidator],
        //providers is defined in component
        "version": [""],
        "lastUpdate": [""],
        "changeLog": [""],
        //"validFor": [""],
        "lifeCycleStatus": ["", Validators.compose([Validators.required, LifeCycleStatusValidator])],
        "trl": ["", Validators.compose([Validators.required, TRLValidator])],
        "category": ["", Validators.required],
        "subcategory": ["", Validators.required],
        //place is defined in component
        //lang is defined in component
        //tags is defined in component
        //requiredServices is defined in component
        //relatedServices is defined in component
        "request": ["", Validators.compose([Validators.required, URLValidator])],
        "helpdesk": ["", URLValidator],
        "userManual": ["", URLValidator],
        "trainingInformation": ["", URLValidator],
        "feedback": ["", URLValidator],
        "price": ["", Validators.compose([Validators.required, URLValidator])],
        "serviceLevelAgreement": ["", Validators.compose([Validators.required, URLValidator])],
        //TOS is defined in component
        "funding": [""]
    };
    providers: any = null;
    vocabularies: any = null;
    categories = categoriesAndSubcategories;
    // dp: any = {
    //     options: {
    //         dateFormat: "dd.mm.yyyy"
    //     },
    //     default: {
    //         date: {year: 2018, month: 10, day: 9}
    //     }
    // };
    resourceService: ResourceService = this.injector.get(ResourceService);
    fb: FormBuilder = this.injector.get(FormBuilder);
    router: NavigationService = this.injector.get(NavigationService);
    userService: UserService = this.injector.get(UserService);

    constructor(protected injector: Injector, protected authenticationService: AuthenticationService) {
        this.resourceService = this.injector.get(ResourceService);
        this.fb = this.injector.get(FormBuilder);
        this.router = this.injector.get(NavigationService);
        this.userService = this.injector.get(UserService);
        this.serviceForm = this.fb.group(this.formGroupMeta);
    }

    transformVocabularies(vocabularies) {
        let ret = {};
        Object.entries(vocabularies).forEach(([key, value]) => {
            ret[value.type] = ret[value.type] || {};
            ret[value.type][key] = value.name;
        });
        return ret;
    }

    toServer(service: Service): Service {
        let ret = {};
        Object.entries(service).forEach(([name, values]) => {
            let newValues = values;
            if (Array.isArray(values)) {
                newValues = [];
                values.forEach(e => {
                    if (e.entry !== "") {
                        newValues.push(e.entry);
                    }
                });
            }
            ret[name] = newValues;
        });
        return <Service>ret;
    }

    onSubmit(service: Service, isValid: boolean) {
        //TODO: check if model is valid
        if (isValid) {
            service.providerName = this.authenticationService.getUserProperty("id");
            this.resourceService.uploadService(this.toServer(service), this.editMode)
            .subscribe(service => {
                setTimeout(() => this.router.service(service.id), 1000);
            });
        } else {
            window.scrollTo(0, 0);
            this.serviceForm.markAsDirty();
            this.serviceForm.updateValueAndValidity();
            this.errorMessage = "Please fill in all required fields (marked with an asterisk), and fix the data format in fields underlined with a red colour.";
        }
    }

    ngOnInit() {
        Observable.zip(
            this.resourceService.getProvidersNames(),
            this.resourceService.getVocabularies()
        ).subscribe(suc => {
            this.providers = suc[0];
            this.vocabularies = this.transformVocabularies(suc[1]);
        });
        this.serviceForm.get('subcategory').disable();
        let subscription = this.serviceForm.get('category').valueChanges.subscribe(() => {
            this.serviceForm.get('subcategory').enable();
            subscription.unsubscribe();
        });

    }
}
