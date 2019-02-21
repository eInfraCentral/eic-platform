import { Component, OnDestroy, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Observable} from "rxjs/Observable";
import {Subscription} from "rxjs/Subscription";
import {Provider, RichService, Vocabulary} from '../../../domain/eic-model';
import {AuthenticationService} from "../../../services/authentication.service";
import {NavigationService} from "../../../services/navigation.service";
import {ResourceService} from "../../../services/resource.service";
import {UserService} from "../../../services/user.service";
import { ServiceProviderService } from '../../../services/service-provider.service';
import {IndicatorsPage, MeasurementsPage} from "../../../domain/indicators";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {SearchResults} from "../../../domain/search-results";

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
    public measurements: MeasurementsPage;
    public indicators: IndicatorsPage;
    public idArray :string[] = [];
    private sub: Subscription;

    weights: string[] = ["EU", "WW"];
    places: SearchResults<Vocabulary> = null;
    placesVocabulary: Vocabulary = null;
    serviceMapOptions: any = null;
    myProviders: Provider[] = [];
    canEditService: boolean = false;
    newMeasurementForm: FormGroup;

    measurementForm = {
        indicatorId: ['', Validators.required],
        serviceId: ['', Validators.required],
        time: [''],
        locations: this.fb.array([]),
        value: ['']
    };

    constructor(public route: ActivatedRoute,
                public router: NavigationService,
                public resourceService: ResourceService,
                public authenticationService: AuthenticationService,
                public userService: UserService,
                private fb: FormBuilder,
                private providerService: ServiceProviderService) {
    }

    ngOnInit() {
        this.canEditService = false;

        if(this.authenticationService.isLoggedIn()) {
            this.sub = this.route.params.subscribe(params => {
                Observable.zip(
                    this.resourceService.getEU(),
                    this.resourceService.getWW(),
                    // this.resourceService.getSelectedServices([params["id"]]),
                    this.resourceService.getRichService(params["id"]),
                    this.providerService.getMyServiceProviders(),
                    this.resourceService.recordEvent(params["id"], "INTERNAL"),
                    this.resourceService.getLatestServiceMeasurement(params["id"])
                ).subscribe(suc => {
                    this.EU = suc[0];
                    this.WW = suc[1];
                    this.service = suc[2];
                    this.myProviders = suc[3];
                    this.measurements = suc[5];
                    this.indicators = suc[6];
                    this.getIndicatorIds();
                    this.getLocations();
                    this.router.breadcrumbs = this.service.name;
                    this.router.breadcrumbs = this.service.name;
                    this.setCountriesForService(this.service.places);
                    this.newMeasurementForm = this.fb.group(this.measurementForm);

                    /* check if the current user can edit the service */
                    this.canEditService = this.myProviders.some(p => this.service.providers.some(x => x === p.id));

                    let serviceIDs = (this.service.requiredServices || []).concat(this.service.relatedServices || [])
                        .filter((e, i, a) => a.indexOf(e) === i);
                    if (serviceIDs.length > 0) {
                        this.resourceService.getSelectedServices(serviceIDs)
                            .subscribe(services => this.services = services);
                    }
                });
            });
        } else {
            this.sub = this.route.params.subscribe(params => {
                Observable.zip(
                    this.resourceService.getEU(),
                    this.resourceService.getWW(),
                    this.resourceService.getRichService(params["id"]),
                    this.resourceService.recordEvent(params["id"], "INTERNAL"),
                    this.resourceService.getLatestServiceMeasurement(params["id"])
                ).subscribe(suc => {
                    this.EU = suc[0];
                    this.WW = suc[1];
                    this.service = suc[2];
                    this.measurements = suc[4];
                    this.router.breadcrumbs = this.service.name;
                    this.setCountriesForService(this.service.places);

                    let serviceIDs = (this.service.requiredServices || []).concat(this.service.relatedServices || [])
                        .filter((e, i, a) => a.indexOf(e) === i);
                    if (serviceIDs.length > 0) {
                        this.resourceService.getSelectedServices(serviceIDs)
                            .subscribe(services => this.services = services);
                    }
                });
            });
        }
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
        this.userService.addFavourite(this.service.id, !this.service.isFavourite)
            .flatMap( e => this.resourceService.getSelectedServices([e.service]) )
            .subscribe(
            res => {
                    Object.assign(this.service, res[0]);
                    console.log(this.service.isFavourite);
                },
                err => console.log(err)
            );
    }

    rateService(rating: number) {
        this.userService.rateService(this.service.id, rating)
            .flatMap( e => this.resourceService.getSelectedServices([e.service]) )
            .subscribe(
                res => {
                    Object.assign(this.service, res[0]);
                    console.log(this.service.isFavourite);
                },
                err => console.log(err)
            );
    }

    getPrettyService(id) {
        return (this.services || []).find(e => e.id == id) || {id, name: "Name not found!"};
    }

    visit() {
        this.resourceService.recordEvent(this.service.id, "EXTERNAL").subscribe(suc => this.router.goOffsite(this.service.url.toString()));
    }

    handleError(error) {
        this.errorMessage = "System error loading service (Server responded: " + error + ")";
    }

    canEdit() {
        return this.authenticationService.getUserProperty('roles').some(x => x === "ROLE_PROVIDER" || x === "ROLE_ADMIN");
    }

    getIndicatorIds() {
        this.resourceService.getIndicators("all").subscribe(
          indicatorPage => this.indicators = indicatorPage,
          error => this.errorMessage = error,
            () => {
                this.idArray = [];
                for (let i = 0; i < this.indicators.results.length; i++) {
                    this.idArray.push(this.indicators.results[i].id);
                }
                this.idArray.sort((a, b) => 0 - (a > b ? -1 : 1));
            }
        );
    }

    getLocations() {
        this.resourceService.getVocabulariesByType("PLACES").subscribe(
            suc => {
                this.places = suc;
                this.placesVocabulary = this.places.results[0];
            }
        );
    }
}