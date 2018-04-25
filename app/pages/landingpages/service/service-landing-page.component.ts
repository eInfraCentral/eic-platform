import {Component, OnDestroy, OnInit} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {Observable} from "rxjs/Observable";
import {Subscription} from "rxjs/Subscription";
import {Service} from "../../../domain/eic-model";
import {AuthenticationService} from "../../../services/authentication.service";
import {NavigationService} from "../../../services/navigation.service";
import {ResourceService} from "../../../services/resource.service";
import {UserService} from "../../../services/user.service";

@Component({
    selector: "service-landing-page",
    templateUrl: "./service-landing-page.component.html",
    styleUrls: ["../landing-page.component.css"]
})
export class ServiceLandingPageComponent implements OnInit, OnDestroy {

    services: Service[];
    public service: Service;
    public errorMessage: string;
    public EU: string[];
    private sub: Subscription;
    private providers: any = {};
    public stats: any = {visits: 0, favourites: 0, externals: 0};

    serviceMapOptions: any = null;

    constructor(public route: ActivatedRoute, public router: NavigationService, public resourceService: ResourceService,
                public authenticationService: AuthenticationService, public userService: UserService) {
    }

    ngOnInit() {
        this.sub = this.route.params.subscribe(params => {
            Observable.zip(
                this.resourceService.getEU(),
                this.resourceService.getService(params["id"]),
                this.resourceService.getProviders(),
                this.resourceService.getVisitsForService(params["id"]),
                this.resourceService.getFavouritesForService(params["id"]),
                this.resourceService.getExternalsForService(params["id"]),
                this.resourceService.recordHit(params["id"], "INTERNAL")
            ).subscribe(suc => {
                this.EU = suc[0];
                this.providers = suc[2];
                this.service = suc[1];
                this.stats.visits = Object.values(suc[3]).reduce((acc, v) => acc + v);
                this.stats.favourites = Object.values(suc[4]).reduce((acc, v) => acc + v);
                this.stats.externals = Object.values(suc[5]).reduce((acc, v) => acc + v);

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

    ngOnDestroy(): void {
        this.sub.unsubscribe();
    }

    setCountriesForService(data: any) {

        let places = JSON.parse(JSON.stringify(data || []));
        let iEU = places.indexOf("EU");
        if (iEU > -1) {
            places.splice(iEU, 1);
            places.push(...this.EU);
        }

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

    getShownRating() {
        //if user has rated, then show user rating
        //else show average rating
    }

    getPrettyService(id) {
        return (this.services || []).find(e => e.id == id) || {id, name: "Name not found!"};
    }

    visit() {
        this.resourceService.recordHit(this.service.id, "EXTERNAL").subscribe(console.log);
    }

    handleError(error) {
        this.errorMessage = "System error loading service (Server responded: " + error + ")";
    }
}