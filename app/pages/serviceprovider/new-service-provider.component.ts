import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { additionalInfoDesc, catalogueOfResourcesDesc, Description, emailDesc, firstNameDesc, lastNameDesc,
         organizationNameDesc, organizationWebsiteDesc, phoneNumberDesc, publicDescOfResourcesDesc } from '../eInfraServices/services.description';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
    selector: 'new-service-provider',
    templateUrl: './new-service-provider.component.html'
})
export class NewServiceProviderComponent implements OnInit {
    errorMessage: string;
    userInfo = { family_name: '', given_name: '', email: '' };

    newProviderForm: FormGroup;
    readonly formDefinition = {
        organizationName: ['', Validators.required],
        phoneNumber: [''],
        organizationWebsite: ['', Validators.required],
        catalogueOfResources: [''],
        publicDescOfResources: [''],
        additionalInfo: ['', Validators.required]
    };
    organizationNameDesc: Description = organizationNameDesc;
    firstNameDesc: Description = firstNameDesc;
    lastNameDesc: Description = lastNameDesc;
    emailDesc: Description = emailDesc;
    phoneNumberDesc: Description = phoneNumberDesc;
    organizationWebsiteDesc: Description = organizationWebsiteDesc;
    catalogueOfResourcesDesc: Description = catalogueOfResourcesDesc;
    publicDescOfResourcesDesc: Description = publicDescOfResourcesDesc;
    additionalInfoDesc: Description = additionalInfoDesc;


    constructor(private fb: FormBuilder,
                private authService: AuthenticationService) {}

    ngOnInit() {
        this.newProviderForm = this.fb.group(this.formDefinition);
        this.userInfo.given_name = this.authService.getUserProperty('given_name');
        this.userInfo.family_name = this.authService.getUserProperty('family_name');
        this.userInfo.email = this.authService.getUserProperty('email');
    }

    registerProvider() {
        if (this.newProviderForm.valid) {
            console.log(JSON.stringify(this.newProviderForm));
        }
    }

}
