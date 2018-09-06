import { Component, OnInit } from '@angular/core';
import { ResourceService } from '../../services/resource.service';
import { Provider } from '../../domain/eic-model';

@Component({
    selector: 'service-providers-list',
    templateUrl: './service-providers-list.component.html'
})
export class ServiceProvidersListComponent implements OnInit {
    errorMessage: string;

    providers: Provider[] = [];

    constructor(private resourceService: ResourceService) {}

    ngOnInit() {
        this.getProviders();
    }

    getProviders() {
        this.resourceService.getProviders().subscribe(
            res => this.providers = res['results'],
            err => {
                console.log(err);
                this.errorMessage = 'The list could not be retrieved';
            }
        );
    }

}