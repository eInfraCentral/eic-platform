import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Observable} from "rxjs/Observable";
import {Subscription} from "rxjs/Subscription";
import {Provider, RichService, Vocabulary} from '../../../domain/eic-model';
import {AuthenticationService} from "../../../services/authentication.service";
import {NavigationService} from "../../../services/navigation.service";
import {ResourceService} from "../../../services/resource.service";
import {UserService} from "../../../services/user.service";
import {ServiceProviderService} from '../../../services/service-provider.service';
import {IndicatorsPage, MeasurementsPage} from "../../../domain/indicators";
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {SearchResults} from "../../../domain/search-results";

declare var UIkit: any;

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
    public idArray: string[] = [];
    private sub: Subscription;

    weights: string[] = ["EU", "WW"];
    serviceMapOptions: any = null;
    myProviders: Provider[] = [];

    formError: string = '';
    showForm: boolean = false;
    canEditService: boolean = false;
    placesVocabulary: Vocabulary = null;
    places: SearchResults<Vocabulary> = null;
    newMeasurementForm: FormGroup;

    measurementForm = {
        indicatorId: ['', Validators.required],
        serviceId: ['', Validators.required],
        time: ['', Validators.required],
        locations: this.fb.array([
            this.fb.control('')
        ], Validators.required),
        value: ['', Validators.required]
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

        if (this.authenticationService.isLoggedIn()) {
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
                    this.setCountriesForService(this.service.places);
                    this.newMeasurementForm = this.fb.group(this.measurementForm);
                    this.newMeasurementForm.get('locations').disable();
                    this.newMeasurementForm.get('time').disable();
                    this.newMeasurementForm.get('serviceId').setValue(params["id"]);

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
                    this.getIndicatorIds();
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

            let map = 'custom/europe';
            data.forEach(function (element) {
                if (element == 'WW')
                    map = 'custom/world-highres2';
            });

            this.serviceMapOptions = {
                chart: {
                    map: map,
                    // map: 'custom/europe',
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
            .flatMap(e => this.resourceService.getSelectedServices([e.service]))
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
            .flatMap(e => this.resourceService.getSelectedServices([e.service]))
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

    get locations() {
        return this.newMeasurementForm.get('locations') as FormArray;
    }

    pushToLocations() {
        this.locations.push(this.fb.control(''));
    }

    removeFromLocations(i: number) {
        this.locations.removeAt(i);
    }

    showFormFields() {
        this.showForm = !this.showForm;
    }

    onIndicatorSelect(event) {
        this.newMeasurementForm.get('locations').disable();
        this.newMeasurementForm.get('time').disable();
        if (event.target.value != null) {
            for (let i = 0; i < this.indicators.results.length; i++) {
                if (this.indicators.results[i].id == event.target.value) {
                    // console.log(this.indicators.results[i].dimensions);
                    for (let j = 0; j < this.indicators.results[i].dimensions.length; j++) {
                        // console.log(this.indicators.results[i].dimensions[j]);
                        this.newMeasurementForm.get(this.indicators.results[i].dimensions[j]).enable();
                    }
                    break;
                }
            }
        }
    }

    getIndicatorName(id: string) :string {
        for (let i = 0; i < this.indicators.results.length; i++) {
            if (this.indicators.results[i].id == id)
                return this.indicators.results[i].name;
        }
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
                // console.log(this.indicators);
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

    submitMeasurement() {
        this.formError = '';
        this.newMeasurementForm.updateValueAndValidity();
        if (this.newMeasurementForm.valid) {
            if (this.locations.length == 0)
                this.newMeasurementForm.get('locations').disable();
            else
                this.newMeasurementForm.get('locations').enable();
            // console.log(this.newMeasurementForm.value);
            this.resourceService.postMeasurement(this.newMeasurementForm.value)
                .subscribe(
                    res => {
                    },
                    err => this.errorMessage = 'Something went wrong',
                    () => {
                        this.resourceService.getLatestServiceMeasurement(this.newMeasurementForm.get('serviceId').value).subscribe(
                            res => this.measurements = res
                        );
                        this.newMeasurementForm.get('indicatorId').setValue('');
                        this.newMeasurementForm.get('indicatorId').markAsUntouched();
                        this.newMeasurementForm.get('indicatorId').markAsPristine();
                        this.newMeasurementForm.get('locations').disable();
                        this.newMeasurementForm.get('time').disable();
                        this.newMeasurementForm.get('value').setValue('');
                        this.newMeasurementForm.get('value').reset();
                        while (this.locations.length > 0) {
                            this.removeFromLocations(0);
                        }
                        this.pushToLocations();
                        this.showFormFields();
                        UIkit.modal('#add-measurement').hide();
                    }
                );
            // console.log(this.newMeasurementForm.value);
        } else {
            for (const i in this.newMeasurementForm.controls) {
                this.newMeasurementForm.controls[i].markAsDirty();
                this.newMeasurementForm.controls[i].updateValueAndValidity();
                // console.log(this.newMeasurementForm.controls[i].status);
            }
            this.formError = 'Please fill the required fields.';
        }
    }
}