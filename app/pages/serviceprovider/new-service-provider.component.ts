import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { additionalInfoDesc, catalogueOfResourcesDesc, Description, emailDesc, firstNameDesc, lastNameDesc,
         organizationNameDesc, organizationWebsiteDesc, phoneNumberDesc, publicDescOfResourcesDesc } from '../eInfraServices/services.description';
import { AuthenticationService } from '../../services/authentication.service';
import { ServiceProviderService } from '../../services/service-provider.service';
import { Router } from '@angular/router';

@Component({
    selector: 'new-service-provider',
    templateUrl: './new-service-provider.component.html'
})
export class NewServiceProviderComponent implements OnInit {
    errorMessage: string;
    userInfo = { family_name: '', given_name: '', email: '' };

/*
* {
  "additionalInfo": "string",
  "catalogueOfResources": "string",
  "contactInformation": "string",
  "id": "string",
  "name": "string",
  "publicDescOfResources": "string",
  "users": [
    {
      "email": "string",
      "id": "string",
      "name": "string",
      "surname": "string"
    }
  ],
  "website": "string"
}
* */


    newProviderForm: FormGroup;
    readonly formDefinition = {
        name: ['', Validators.required],
        contactInformation: [''],
        website: ['', Validators.required],
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
        // TODO: add the user id to post when it becomes available
        this.errorMessage = '';
        if (this.newProviderForm.valid) {
            console.log(JSON.stringify(this.newProviderForm.value));
            let newProvider = Object.assign(
                this.newProviderForm.value,
                {users: [{ email: this.userInfo.email,
                                 id: null,
                                 name: this.userInfo.given_name,
                                 surname: this.userInfo.family_name
                                }]
                });
            console.log(JSON.stringify(newProvider));

            this.serviceProviderService.createNewServiceProvider(newProvider).subscribe(
                res => console.log(res),
                err => {
                    console.log(err);
                    this.errorMessage = "Please fill in all required fields (marked with an asterisk), and fix the data format in fields underlined with a red colour.";
                },
                () => {
                    this.router.navigate(['/myServiceProviders']);
                }
            );
        }
    }

}
