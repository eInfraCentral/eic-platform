import {Component, Injector, Type, ViewChild} from "@angular/core";
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Observable} from "rxjs/Observable";
import {Service, Vocabulary} from "../../domain/eic-model";
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
import { ActivatedRoute } from '@angular/router';
import {priceDesc} from "./services.description";
import {SearchResults} from "../../domain/search-results";
import {MyArrayInline} from "../multiforms/my-array";
import {error} from "util";

@Component({
    selector: "service-form",
    templateUrl: "./service-form.component.html",
    styleUrls: ["./service-form.component.css"]
})
export class ServiceFormComponent {
    firstServiceForm: boolean = false;
    providerId: string;
    editMode: boolean;
    serviceForm: FormGroup;
    service: Service;
    errorMessage: string = '';
    logoError: boolean = false;
    logoUrlWorks: boolean = false;
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
    readonly validForDesc: sd.Description = sd.validForDesc;
    readonly lifeCycleStatusDesc: sd.Description = sd.lifeCycleStatusDesc;
    readonly trlDesc: sd.Description = sd.trlDesc;
    readonly categoryDesc: sd.Description = sd.categoryDesc;
    readonly subcategoryDesc: sd.Description = sd.subcategoryDesc;
    readonly placesDesc: sd.Description = sd.placesDesc;
    readonly languagesDesc: sd.Description = sd.languagesDesc;
    readonly tagsDesc: sd.Description = sd.tagsDesc;
    readonly requiredServicesDesc: sd.Description = sd.requiredServicesDesc;
    readonly relatedServicesDesc: sd.Description = sd.relatedServicesDesc;
    readonly orderDesc: sd.Description = sd.orderDesc;
    readonly helpdeskDesc: sd.Description = sd.helpdeskDesc;
    readonly userManualDesc: sd.Description = sd.userManualDesc;
    readonly trainingInformationDesc: sd.Description = sd.trainingInformationDesc;
    readonly feedbackDesc: sd.Description = sd.feedbackDesc;
    readonly priceDesc: sd.Description = Object.assign({ mandatory : false }, sd.priceDesc);
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
        "url": ["", Validators.compose([Validators.required, ])],
        "name": ["", Validators.required],
        "tagline": [""],
        "description": ["", Validators.required],
        "options": [""],
        "targetUsers": [""],
        "userValue": [""],
        "userBase": [""],
        "symbol": ["", Validators.compose([Validators.required, ])],
        "multimediaURL": ["", ],
        //providers is defined in component
        "version": ["", Validators.required],
        "lastUpdate": ["", Validators.required],
        "changeLog": [""],
        "validFor": [""],
        "lifeCycleStatus": ["", Validators.compose([Validators.required])],
        // "lifeCycleStatus": ["", Validators.compose([Validators.required, LifeCycleStatusValidator])],
        "trl": ["", Validators.compose([Validators.required])],
        // "trl": ["", Validators.compose([Validators.required, TRLValidator])],
        "category": ["", Validators.required],
        "subcategory": ["", Validators.required],
        //place is defined in component
        //lang is defined in component
        //tags is defined in component
        //requiredServices is defined in component
        //relatedServices is defined in component
        "order": ["", Validators.compose([Validators.required, ])],
        "helpdesk": ["", ],
        "userManual": ["", ],
        "trainingInformation": ["", ],
        "feedback": ["", ],
        "price": [""],
        "serviceLevelAgreement": ["", Validators.compose([Validators.required, ])],
        //TOS is defined in component
        "funding": [""]
    };
    providers: any = null;
    vocabularies: SearchResults<Vocabulary> = null;
    resourceService: ResourceService = this.injector.get(ResourceService);
    fb: FormBuilder = this.injector.get(FormBuilder);
    router: NavigationService = this.injector.get(NavigationService);
    userService: UserService = this.injector.get(UserService);

    public lifeCycleStatusVocabulary: Vocabulary = null;
    public trlVocabulary: Vocabulary = null;
    public categoriesVocabulary: Vocabulary = null;
    public placesVocabulary: Vocabulary = null;
    public languagesVocabulary: Vocabulary = null;

    constructor(protected injector: Injector,
                protected authenticationService: AuthenticationService) {
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
                        newValues.push(e.entry.trim().replace(/\s\s+/g, ' '));
                    }
                });
            } else {
                newValues = newValues.trim().replace(/\s\s+/g, ' ');
            }
            ret[name] = newValues;
        });
        if ( (this.firstServiceForm === true) && this.providerId) {
            ret['providers'] = [];
            ret['providers'].push(this.providerId);
        }
        return <Service>ret;
    }

    onSubmit(service: Service, isValid: boolean) {
        this.errorMessage = '';

        /** Pre submit check and clean **/
        service.url = ServiceFormComponent.checkUrl(this.serviceForm.get('url').value);
        // service.symbol = ServiceFormComponent.checkUrl(this.serviceForm.get('symbol').value);
        service.symbol = this.logoCheckUrl(this.serviceForm.get('symbol').value);
        this.serviceForm.get('symbol').setValue(service.symbol); // update field in order for logo to display properly
        service.multimediaURL = ServiceFormComponent.checkUrl(this.serviceForm.get('multimediaURL').value);
        service.order = ServiceFormComponent.checkUrl(this.serviceForm.get('order').value);
        service.helpdesk = ServiceFormComponent.checkUrl(this.serviceForm.get('helpdesk').value);
        service.userManual = ServiceFormComponent.checkUrl(this.serviceForm.get('userManual').value);
        service.trainingInformation = ServiceFormComponent.checkUrl(this.serviceForm.get('trainingInformation').value);
        service.feedback = ServiceFormComponent.checkUrl(this.serviceForm.get('feedback').value);
        service.serviceLevelAgreement = ServiceFormComponent.checkUrl(this.serviceForm.get('serviceLevelAgreement').value);
        service.price = ServiceFormComponent.checkUrl(this.serviceForm.get('price').value);
        for (let i = 0; i < service['termsOfUse'].length; i++) {
            service['termsOfUse'][i]['entry'] = ServiceFormComponent.checkUrl(service['termsOfUse'][i]['entry']);
        }
        this.logoUrlWorks = this.imageExists(service.symbol);

        this.setAsTouched();



        /** if valid submit **/
        if (isValid && !this.logoError && this.logoUrlWorks) {
            console.log(service);
            this.resourceService.uploadService(this.toServer(service), this.editMode)
            .subscribe(service => {
                setTimeout(() => this.router.service(service.id), 1000);
            });
        } else {
            window.scrollTo(0, 0);
            this.serviceForm.markAsDirty();
            this.serviceForm.updateValueAndValidity();
            if (!isValid)
                this.errorMessage = "Please fill in all required fields (marked with an asterisk), and fix the data format in fields underlined with a red colour.";
            if (this.logoError) {
                this.logoError = false;
                this.serviceForm.controls['symbol'].setErrors({'incorrect': true});
                this.errorMessage += " Logo url must have https:// prefix."
            }
            if (!this.logoUrlWorks) {
                this.serviceForm.controls['symbol'].setErrors({'incorrect': true});
                this.errorMessage += " Logo url doesn't point to a valid image."
            }
        }
    }

    ngOnInit() {
        Observable.zip(
            this.resourceService.getProvidersNames(),
            this.resourceService.getVocabularies()
        ).subscribe(suc => {
            // console.log(priceDesc);
            this.providers = suc[0];
            this.vocabularies = suc[1];

            this.lifeCycleStatusVocabulary = this.vocabularies.results.filter(x => x.id == 'lifecyclestatus')[0];
            this.trlVocabulary = this.vocabularies.results.filter(x => x.id == 'trl')[0];
            this.categoriesVocabulary = this.vocabularies.results.filter(x => x.id == 'categories')[0];
            this.placesVocabulary = this.vocabularies.results.filter(x => x.id == 'places')[0];
            this.languagesVocabulary = this.vocabularies.results.filter(x => x.id == 'languages')[0];
        });

        this.serviceForm.get('subcategory').disable();
        let subscription = this.serviceForm.get('category').valueChanges.subscribe(() => {
            this.serviceForm.get('subcategory').enable();
            subscription.unsubscribe();
        });

    }

    public setAsTouched() {
        let ret = {};
        console.log(this.serviceForm);
        this.setAsTouched_(this.serviceForm, ret);
        console.log(ret);
    }

    private setAsTouched_(form : FormGroup, ret : any) {
        Object.keys(form.controls).forEach(control =>{
            let control_ = form.controls[control];
            console.log(control,control_);
            if( !control_.valid) {
                ret[control] = {};
                if (control_.hasOwnProperty('controls')) {
                    this.setAsTouched_(control_ as FormGroup, ret[control]);
                } else {
                    if (control_.enabled && !control_.valid) {
                        console.log(control);
                        ret[control] = control_.valid;
                        (control_ as FormGroup).markAsDirty();
                        (control_ as FormGroup).markAsTouched();
                        console.log(control, form.controls[control].valid);
                    }
                }
            }
        });
    }

    static checkUrl(url: string) {
        if (url !== '') {
            if (!url.match(/^(https?:\/\/.+)?$/)) {
                url = 'http://' + url;
            }
        }
        return url;
    }

    imageExists(url) {
        let image = new Image();
        image.src = url;
        if (!image.complete) {
            return false;
        }
        else if (image.height === 0) {
            return false;
        }

        return true;
    }

    logoCheckUrl(url: string) {
        if (url !== '') {
            if (url.match(/^(http:\/\/.+)?$/)) {
                this.serviceForm.controls['symbol'].setErrors({'incorrect': true});
                this.logoError = true;
            } else if (!url.match(/^(https:\/\/.+)?$/)) {
                url = 'https://' + url;
            }
        }
        console.log(url);
        return url;
    }
}
