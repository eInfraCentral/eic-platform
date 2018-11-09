import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {Component, OnInit} from '@angular/core';
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
import {AuthenticationService} from '../../services/authentication.service';
import {ServiceProviderService} from '../../services/service-provider.service';
import {URLValidator} from '../../shared/validators/generic.validator';
import {Provider, User} from "../../domain/eic-model";

declare var UIkit: any;

@Component({
    selector: 'update-service-provider',
    templateUrl: './update-service-provider.component.html'
})
export class UpdateServiceProviderComponent implements OnInit {
    errorMessage: string;
    userInfo = {family_name: '', given_name: '', email: ''};
    updateProviderForm: FormGroup;
    newUserForm: FormGroup;
    logoUrl: string = '';
    provider: Provider;


    user(email:string, id: string, name: string, surname: string): FormGroup {
        return this.fb.group({
            email: [email],
            id: [id],
            name: [name],
            surname: [surname]
        });
    }


    userFormDefinition = {
        email: ['', [Validators.required, Validators.email]],
        id: [null],
        name: ['',Validators.required],
        surname: ['',Validators.required]
    };


    /* TODO: add logo field to the form */
    formDefinition = {
        id: ['', Validators.required],
        name: ['', Validators.required],
        logo: ['', URLValidator],
        contactInformation: [''],
        users: this.fb.array([
            //this.user()
        ]),
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
                private route: ActivatedRoute,
                private router: Router) {
    }

    ngOnInit() {
        this.updateProviderForm = this.fb.group(this.formDefinition);
        this.getProvider();
        this.newUserForm = this.fb.group(this.userFormDefinition);
        this.userInfo.given_name = this.authService.getUserProperty('given_name');
        this.userInfo.family_name = this.authService.getUserProperty('family_name');
        this.userInfo.email = this.authService.getUserProperty('email');
    }

    updateProvider() {
        // TODO: add the user id to post when it becomes available
        this.errorMessage = '';
        if (!this.updateProviderForm.get('logo').value) {
            this.updateProviderForm.get('logo').setValue('');
        }
        if (!this.updateProviderForm.get('contactInformation').value) {
            this.updateProviderForm.get('contactInformation').setValue('');
        }
        if (!this.updateProviderForm.get('publicDescOfResources').value) {
            this.updateProviderForm.get('publicDescOfResources').setValue('');
        }
        if (!this.updateProviderForm.get('catalogueOfResources').value) {
            this.updateProviderForm.get('catalogueOfResources').setValue('');
        }
        if (this.updateProviderForm.valid) {
            console.log(JSON.stringify(this.updateProviderForm.value));
            let updatedProvider = Object.assign(
                this.updateProviderForm.value
            );
            console.log(JSON.stringify(updatedProvider));

            this.serviceProviderService.updateServiceProvider(updatedProvider).subscribe(
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
            this.updateProviderForm.markAsDirty();
            this.updateProviderForm.updateValueAndValidity();
            for (const i in this.updateProviderForm.controls) {
                this.updateProviderForm.controls[i].markAsDirty();
            }
            window.scrollTo(0, 0);
        }
    }

    get users() { // return form resource types as array
        return this.updateProviderForm.get('users') as FormArray;
    }

    getProvider() {
        const id = this.route.snapshot.paramMap.get('id');
        this.errorMessage = '';
        this.serviceProviderService.getServiceProviderById(id).subscribe(
            provider => {
                this.provider = provider;
            },
            err => {
                console.log(err);
                this.errorMessage = "Something went wrong.";
            },
            () => {
                this.updateProviderForm.patchValue(this.provider);
                // let users: User[] = [];
                for (let i = 0; i < this.provider.users.length; i++) {
                    this.users.push(this.user(this.provider.users[i].email, this.provider.users[i].id,
                    this.provider.users[i].name, this.provider.users[i].surname));
                    // console.log(this.provider.users[i]);

                    // this.user.patchValue(this.provider.users[i]);
                    // console.log(this.user.value);
                    // this.users.push(this.User);
                    // console.log(this.users.value);
                }
                this.updateProviderForm.get('id').disable();
                this.updateProviderForm.updateValueAndValidity();
                console.log(this.updateProviderForm.value);
            }
        );
    }

    addUser() {
        if (this.newUserForm.valid){
            this.users.push(this.user(this.newUserForm.get('email').value, this.newUserForm.get('id').value,
                                    this.newUserForm.get('name').value, this.newUserForm.get('surname').value));
            this.newUserForm.reset();
        } else {
            this.errorMessage = "Please fill in all fields, and fix the data format in fields underlined with a red colour.";
            this.newUserForm.markAsDirty();
            this.newUserForm.updateValueAndValidity();
            for (const i in this.newUserForm.controls) {
                this.newUserForm.controls[i].markAsDirty();
            }
            //window.scrollTo(0, 0);
        }
    }

    deleteUser(index) {
        if (this.users.length === 1) {
            this.errorMessage = 'There must be at least one user!';
            return;
        }
        let i = 0;
        console.log(index.value);
        while ( i < this.users.length) {
            if (this.users.value[i] === index.value) {
                this.users.removeAt(i);
                break;
            }
            i++;
        }
    }

    showLogoUrlModal() {
        if (this.updateProviderForm && this.updateProviderForm.get('logo').value) {
            this.logoUrl = this.updateProviderForm.get('logo').value;
        }
        UIkit.modal('#logoUrlModal').show();
    }

    addLogoUrl(logoUrl: string) {
        UIkit.modal('#logoUrlModal').hide();
        this.logoUrl = logoUrl;
        this.updateProviderForm.get('logo').setValue(logoUrl);
        this.updateProviderForm.get('logo').updateValueAndValidity();
    }
}
