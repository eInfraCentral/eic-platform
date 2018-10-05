import { Component, OnInit } from '@angular/core';
import { Provider, Service } from '../../domain/eic-model';
import { ServiceProviderService } from '../../services/service-provider.service';

@Component({
    selector: 'my-service-providers',
    templateUrl: './my-service-providers.component.html'
})
export class MyServiceProvidersComponent implements OnInit {
    errorMessage: string;
    noProvidersMessage: string;
    tilesView: boolean;

    myProviders: Provider[];
    pendingFirstServicePerProvider: any[] = [];

    constructor(private serviceProviderService: ServiceProviderService) {}

    ngOnInit() {
        this.tilesView = true;
        this.getServiceProviders();
    }

    getServiceProviders() {
        setTimeout( () => {
            this.serviceProviderService.getMyServiceProviders().subscribe(
                res => this.myProviders = res,
                err => {
                    console.log(err);
                    this.errorMessage = 'An error occurred!';
                },
                () => {
                    this.myProviders.forEach (
                        p => {
                            if ( (p.status === 'pending service template approval') ||
                                 (p.status === 'rejected service template')) {
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
                    if (this.myProviders.length === 0) {
                        this.noProvidersMessage = 'You have not yet registered any service providers.';
                    }
                }
            );
        }, 1000);
    }

    hasCreatedFirstService(id: string) {
        return this.pendingFirstServicePerProvider.some(x => x.providerId === id);
    }

    getLinkToFirstService(id: string) {
        if (this.hasCreatedFirstService(id)) {
            return '/newServiceProvider/' + id + '/editFirstService/' + this.pendingFirstServicePerProvider.filter(x => x.providerId === id)[0].serviceId;
        } else {
            return '/newServiceProvider/' + id + '/addFirstService';
        }
    }

    toggleTiles(choseTilesMode: boolean) {
        this.tilesView = choseTilesMode;
    }

}
