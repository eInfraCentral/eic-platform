import { Component, OnInit } from '@angular/core';
import { ResourceService } from '../../services/resource.service';
import { Provider } from '../../domain/eic-model';
import { statusList } from '../../domain/service-provider-status-list';
import { ServiceProviderService } from '../../services/service-provider.service';

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
    pendingFirstServicePerProvider: any[] = [];

    constructor(private resourceService: ResourceService, private serviceProviderService: ServiceProviderService) {}

    ngOnInit() {
        this.getProviders();
    }

    getProviders() {
        setTimeout( () => {
            this.resourceService.getProviders().subscribe(
                res => this.providers = res['results'],
                err => {
                    console.log(err);
                    this.errorMessage = 'The list could not be retrieved';
                },
                () => {
                    this.providers.forEach(
                        p => {
                            if (p.status === 'pending service template approval') {
                                this.serviceProviderService.getPendingServicesOfProvider(p.id).subscribe(
                                    res => {
                                        if (res && (res.length > 0) ) {
                                            this.pendingFirstServicePerProvider.push({ providerId: p.id, serviceId: res[0].id })
                                        }
                                    }
                                );
                            }
                        }
                    );
                }

            );
        }, 1000);
    }

    approveStatusChange(provider: Provider) {
        this.selectedProvider = provider;
        UIkit.modal('#approveModal').show();
    }

    updateSelectedProvider() {
        if ( this.selectedProvider && (this.selectedProvider.status !=='approved') ) {
            const i = this.statusList.indexOf(this.selectedProvider.status);
            let active = false;
            if (this.statusList[i+1] ==='approved') {
                active = true;
            }
            const updatedFields = Object.assign({ id: this.selectedProvider.id,
                                                        status: this.statusList[i+1],
                                                        active: active});

            this.serviceProviderService.updateServiceProvider(updatedFields).subscribe(
                res => console.log(res),
                err => {
                        console.log(err);
                    },
                () => {
                    UIkit.modal('#approveModal').hide();
                    this.providers = [];
                    this.getProviders();
                }
            );
        }

    }

    hasCreatedFirstService(id: string) {
        return this.pendingFirstServicePerProvider.some(x => x.providerId === id);
    }

    getLinkToFirstService(id: string) {
        if (this.hasCreatedFirstService(id)) {
            return '/service/' + this.pendingFirstServicePerProvider.filter(x => x.providerId === id)[0].serviceId;
        }
        return '';
    }

}