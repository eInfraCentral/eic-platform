import { Component, OnInit } from '@angular/core';
import { Provider } from '../../domain/eic-model';
import { ServiceProviderService } from '../../services/service-provider.service';

@Component({
    selector: 'my-service-providers',
    templateUrl: './my-service-providers.component.html'
})
export class MyServiceProvidersComponent implements OnInit {
    errorMessage: string;

    myProviders: Provider[];

    constructor(private serviceProviderService: ServiceProviderService) {}

    ngOnInit() {
        this.getServiceProviders();
    }

    getServiceProviders() {
        this.serviceProviderService.getMyServiceProviders().subscribe(
            res => this.myProviders = res,
            err => {
                console.log(err);
                this.errorMessage = 'An error occurred!';
            }
        );
    }
}
