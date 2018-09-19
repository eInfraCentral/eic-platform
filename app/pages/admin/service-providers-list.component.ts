import { Component, OnInit } from '@angular/core';
import { ResourceService } from '../../services/resource.service';
import { Provider } from '../../domain/eic-model';
import { statusList } from '../../domain/service-provider-status-list';

declare var UIkit: any;

@Component({
    selector: 'service-providers-list',
    templateUrl: './service-providers-list.component.html'
})
export class ServiceProvidersListComponent implements OnInit {
    errorMessage: string;

    providers: Provider[] = [];
    selectedProvider: Provider;
    statusList = statusList;

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

    approveStatusChange(provider: Provider) {
        this.selectedProvider = provider;
        UIkit.modal('#approveModal').show();
    }

    updateSelectedProvider() {
        if ( this.selectedProvider && (this.selectedProvider.status !=='approved') ) {
            const i = this.statusList.indexOf(this.selectedProvider.status);
            console.log('i is', i);
            this.selectedProvider.status = this.statusList[i+1];
            console.log(JSON.stringify(this.selectedProvider));
        }
        UIkit.modal('#approveModal').hide();
    }
}