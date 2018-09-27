import { Component, OnDestroy, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Observable} from "rxjs/Observable";
import {Subscription} from "rxjs/Subscription";
import { Provider, RichService } from '../../../domain/eic-model';
import {AuthenticationService} from "../../../services/authentication.service";
import {NavigationService} from "../../../services/navigation.service";
import {ResourceService} from "../../../services/resource.service";
import {UserService} from "../../../services/user.service";
import { ServiceProviderService } from '../../../services/service-provider.service';

@Component({
    selector: "service-landing-page",
    templateUrl: "./service-landing-page.component.html",
    styleUrls: ["../landing-page.component.css"]
})
export class ServiceLandingPageComponent implements OnInit, OnDestroy {

    services: RichService[];
    public service: RichService;
    public errorMessage: string;
    public EU: string[];
    public WW: string[];
    private sub: Subscription;
    private vocabularies: any = [];

    serviceMapOptions: any = null;
    myProviders: Provider[] = [];
    canEditService: boolean = false;

    constructor(public route: ActivatedRoute, public router: NavigationService, public resourceService: ResourceService,
                public authenticationService: AuthenticationService, public userService: UserService,
                private providerService: ServiceProviderService) {
    }

    ngOnInit() {
        this.sub = this.route.params.subscribe(params => {
            Observable.zip(
                this.resourceService.getEU(),
                this.resourceService.getWW(),
                this.resourceService.getSelectedServices([params["id"]]),
                this.resourceService.getVocabularies(),
                this.providerService.getMyServiceProviders(),
                this.resourceService.recordEvent(params["id"], "INTERNAL")
            ).subscribe(suc => {
                this.EU = suc[0];
                this.WW = suc[1];
                this.service = suc[2][0];
                this.vocabularies = suc[3];
                this.myProviders = suc[4];
                this.router.breadcrumbs = this.service.name;
                this.setCountriesForService(this.service.places);

                /* check if the current user can edit the service */
                this.canEditService = this.myProviders.some( p => this.service.providers.some(x => x === p.id) );

                let serviceIDs = (this.service.requiredServices || []).concat(this.service.relatedServices || [])
                .filter((e, i, a) => a.indexOf(e) === i);
                if (serviceIDs.length > 0) {
                    this.resourceService.getSelectedServices(serviceIDs)
                    .subscribe(services => this.services = services);
                }
            });
        });
    }

    ngOnDestroy(): void {
        this.sub.unsubscribe();
    }

    setCountriesForService(data: any) {
        if (this.service) {
            let places = this.resourceService.expandRegion(JSON.parse(JSON.stringify(data || [])), this.EU, this.WW);

            this.serviceMapOptions = {
                chart: {
                    map: 'custom/europe',
                    // borderWidth: 1
                },
                title: {
                    text: 'Countries serviced by ' + this.service.name
                },
                // subtitle: {
                //     text: 'Demo of drawing all areas in the map, only highlighting partial data'
                // },
                legend: {
                    enabled: false
                },
                series: [{
                    name: 'Country',
                    data: places.map(e => e.toLowerCase()).map(e => [e, 1]),
                    dataLabels: {
                        enabled: true,
                        color: '#FFFFFF',
                        formatter: function () {
                            if (this.point.value) {
                                return this.point.name;
                            }
                        }
                    },
                    tooltip: {
                        headerFormat: '',
                        pointFormat: '{point.name}'
                    }
                }]
            };
        }
    }

    addToFavourites() {
        this.userService.addFavourite(this.service.id, !this.service.isFavourite).subscribe(
            res => console.log(res),
            err => console.log(err),
            () => {
                /*console.log('going to', window.location.pathname);
                window.location.href = window.location.pathname;*/
                setTimeout(() => {
                    this.resourceService.getSelectedServices([this.service.id]).subscribe (
                        res => {
                            this.service = res[0];
                            console.log(this.service.isFavourite);
                        }
                    );
                }, 1000);
            }
        );

    }

    rateService(rating: number) {
        this.userService.rateService(this.service.id, rating).subscribe(
            res => console.log(res),
            err => console.log(err),
            () => {
                /*console.log('going to', window.location.pathname);
                window.location.href = window.location.pathname;*/
                setTimeout(() => {
                    this.resourceService.getSelectedServices([this.service.id]).subscribe (
                        res => {
                            this.service = res[0];
                            console.log(this.service.hasRate);
                        }
                    );
                }, 1000);
            }
        );
    }

    getPrettyService(id) {
        return (this.services || []).find(e => e.id == id) || {id, name: "Name not found!"};
    }

    getPrettyList(list) {
        return list.map(e => this.vocabularies[e].name).join();
    }

    visit() {
        this.resourceService.recordEvent(this.service.id, "EXTERNAL").subscribe(suc => this.router.goOffsite(this.service.url.toString()));
    }

    handleError(error) {
        this.errorMessage = "System error loading service (Server responded: " + error + ")";
    }
}