import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
    additionalInfoDesc,
    catalogueOfResourcesDesc,
    Description,
    emailDesc,
    firstNameDesc,
    lastNameDesc, logoUrlDesc,
    organizationIdDesc,
    organizationNameDesc,
    organizationWebsiteDesc,
    phoneNumberDesc,
    publicDescOfResourcesDesc
} from '../eInfraServices/services.description';
import { AuthenticationService } from '../../services/authentication.service';
import { ServiceProviderService } from '../../services/service-provider.service';
import { Router } from '@angular/router';
import { URLValidator } from '../../shared/validators/generic.validator';
import { Provider, Service } from '../../domain/eic-model';

declare var UIkit: any;

@Component({
    selector: 'new-service-provider',
    templateUrl: './new-service-provider.component.html'
})
export class NewServiceProviderComponent implements OnInit {
    errorMessage: string;
    userInfo = { family_name: '', given_name: '', email: '' };
    newProviderForm: FormGroup;
    logoUrl: string = '';

    /* TODO: add logo field to the form */
    readonly formDefinition = {
        id: ['', Validators.compose([Validators.required, Validators.pattern(/^[a-zA-z][a-zA-Z0-9-_]{1,}$/)])],
        // id: ['', Validators.required],
        name: ['', Validators.required],
        logo: ['', URLValidator],
        contactInformation: [''],
        website: ['', [Validators.required, URLValidator]],
        catalogueOfResources: ['', URLValidator],
        publicDescOfResources: ['', URLValidator],
        additionalInfo: ['', Validators.required]
    };
    organizationIdDesc: Description = organizationIdDesc;
    organizationNameDesc: Description = organizationNameDesc;
    firstNameDesc: Description = firstNameDesc;
    lastNameDesc: Description = lastNameDesc;
    emailDesc: Description = emailDesc;
    phoneNumberDesc: Description = phoneNumberDesc;
    organizationWebsiteDesc: Description = organizationWebsiteDesc;
    catalogueOfResourcesDesc: Description = catalogueOfResourcesDesc;
    publicDescOfResourcesDesc: Description = publicDescOfResourcesDesc;
    additionalInfoDesc: Description = additionalInfoDesc;
    logoUrlDesc: Description = logoUrlDesc;


    constructor(private fb: FormBuilder,
                private authService: AuthenticationService,
                private serviceProviderService: ServiceProviderService,
                private router: Router) {}

    ngOnInit() {
        this.newProviderForm = this.fb.group(this.formDefinition);
        this.userInfo.given_name = this.authService.getUserProperty('given_name');
        this.userInfo.family_name = this.authService.getUserProperty('family_name');
        this.userInfo.email = this.authService.getUserProperty('email');
    }

    registerProvider() {
        /*
        * {"id":"serviceProvider1","name":"Test Provider 1","logo":"https://brandmark.io/logo-rank/random/beats.png","contactInformation":"321654654","website":"https://testProvider1.gr","catalogueOfResources":"https://testProvider1.gr","publicDescOfResources":"https://testProvider1.gr","additionalInfo":"Test Service Provider other info"}
        * */

        // TODO: add the user id to post when it becomes available
        this.errorMessage = '';
        if (this.newProviderForm.valid) {
            console.log(JSON.stringify(this.newProviderForm.value));
            let newProvider = Object.assign(
                this.newProviderForm.value
                );
            console.log(JSON.stringify(newProvider));
            /*{ users: [{ email: this.userInfo.email,
                             id: null,
                           name: this.userInfo.given_name,
                        surname: this.userInfo.family_name
                     }]}*/
            this.serviceProviderService.createNewServiceProvider(newProvider).subscribe (
                res => console.log(res),
                err => {
                    console.log(err);
                    this.errorMessage = "Something went wrong.";
                },
                () => {
                    this.router.navigate(['/myServiceProviders']);
                }
            );
        } else {
            this.errorMessage = "Please fill in all required fields (marked with an asterisk), and fix the data format in fields underlined with a red colour.";
            this.newProviderForm.markAsDirty();
            this.newProviderForm.updateValueAndValidity();
            for (const i in this.newProviderForm.controls) {
                this.newProviderForm.controls[i].markAsDirty();
            }
            window.scrollTo(0, 0);
        }
    }

    showLogoUrlModal() {
        if (this.newProviderForm && this.newProviderForm.get('logo').value) {
            this.logoUrl = this.newProviderForm.get('logo').value;
        }
        UIkit.modal('#logoUrlModal').show();
    }

    addLogoUrl(logoUrl: string) {
        UIkit.modal('#logoUrlModal').hide();
        this.logoUrl = logoUrl;
        this.newProviderForm.get('logo').setValue(logoUrl);
        this.newProviderForm.get('logo').updateValueAndValidity();
    }
}
