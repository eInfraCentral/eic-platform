import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { additionalInfoDesc, catalogueOfResourcesDesc, Description, emailDesc, firstNameDesc, lastNameDesc,
         organizationNameDesc, organizationWebsiteDesc, phoneNumberDesc, publicDescOfResourcesDesc } from '../../eInfraServices/services.description';

@Component({
    selector: 'new-service-provider',
    templateUrl: './new-service-provider.component.html'
})
export class NewServiceProviderComponent implements OnInit {
    errorMessage: string;

    newProviderForm: FormGroup;
    readonly formDefinition = {
        organizationName: ['', Validators.required],
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
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


    constructor(private fb: FormBuilder) {}

    ngOnInit() {
        this.newProviderForm = this.fb.group(this.formDefinition);
    }

    registerProvider() {
        if (this.newProviderForm.valid) {
            console.log(JSON.stringify(this.newProviderForm));
        }
    }

}
