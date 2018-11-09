import {Component, OnInit} from "@angular/core";
import {ServiceProviderService} from "../../services/service-provider.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Provider} from "../../domain/eic-model";

declare var UIKit: any;

@Component({
    selector: 'service-provider-info',
    templateUrl: './service-provider-info.component.html'
})

export class ServiceProviderInfoComponent implements OnInit{
    errorMessage: string;
    provider: Provider;


    constructor(private serviceProviderService: ServiceProviderService,
                private route: ActivatedRoute,
                private router: Router) {}

    ngOnInit() {
        this.getProvider();
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
                // this.updateProviderForm.patchValue(this.provider);
                // // let users: User[] = [];
                // for (let i = 0; i < this.provider.users.length; i++) {
                //     this.users.push(this.user(this.provider.users[i].email, this.provider.users[i].id,
                //         this.provider.users[i].name, this.provider.users[i].surname));
                //     // console.log(this.provider.users[i]);
                //
                //     // this.user.patchValue(this.provider.users[i]);
                //     // console.log(this.user.value);
                //     // this.users.push(this.User);
                //     // console.log(this.users.value);
                // }
                // this.updateProviderForm.get('id').disable();
                // this.updateProviderForm.updateValueAndValidity();
                // console.log(this.updateProviderForm.value);
            }
        );
    }

}