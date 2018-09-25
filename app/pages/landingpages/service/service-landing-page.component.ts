import {Component, OnDestroy, OnInit} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {Observable} from "rxjs/Observable";
import {Subscription} from "rxjs/Subscription";
import { Provider, Service } from '../../../domain/eic-model';
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

    services: Service[];
    public service: Service;
    public errorMessage: string;
    public EU: string[];
    public WW: string[];
    private sub: Subscription;
    private vocabularies: any = [];
    public stats: any = {visits: 0, favourites: 0, externals: 0};

    serviceMapOptions: any = null;
    isUserFavourite: boolean;
    userRating = 0;
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
                this.resourceService.getService(params["id"], params['version']),
                this.resourceService.getVocabularies(),
                this.resourceService.getVisitsForService(params["id"]),
                this.resourceService.getFavouritesForService(params["id"]),
                this.resourceService.getExternalsForService(params["id"]),
                this.providerService.getMyServiceProviders(),
                this.resourceService.recordEvent(params["id"], "INTERNAL")
            ).subscribe(suc => {
                this.EU = suc[0];
                this.WW = suc[1];
                this.service = suc[2];
                this.vocabularies = suc[3];
                this.stats.visits = Object.values(suc[4]).reduce((acc, v) => acc + v, 0);
                this.stats.favourites = Object.values(suc[5]).reduce((acc, v) => acc + v, 0);
                this.stats.externals = Object.values(suc[6]).reduce((acc, v) => acc + v, 0);
                this.myProviders = suc[7];
                this.router.breadcrumbs = this.service.name;
                this.setCountriesForService(this.service.place);

                /* check if the current user can edit the service */
                this.canEditService = this.myProviders.some( p => this.service.providers.some(x => x === p.id) );

                let serviceIDs = (this.service.requiredService || []).concat(this.service.relatedService || [])
                .filter((e, i, a) => a.indexOf(e) === i);
                if (serviceIDs.length > 0) {
                    this.resourceService.getSelectedServices(serviceIDs)
                    .subscribe(services => this.services = services);
                }

                if (this.authenticationService.isLoggedIn()) {
                    this.getIfFavourite();
                    this.getShownRating();
                }
            });
        });
    }

    ngOnDestroy(): void {
        this.sub.unsubscribe();
    }

    setCountriesForService(data: any) {
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

    getIfFavourite() {
        this.userService.getIfFavouriteOfUser(this.service.id).subscribe(
            res => this.isUserFavourite = res
        );
    }

    addToFavourites() {
        let favourite = 0;
        if (this.isUserFavourite === true) { favourite = 1; }
        this.userService.addFavourite(this.service.id, favourite).subscribe(
            res => {
                this.isUserFavourite = ( res['value'] === '1' );
                console.log('res is', JSON.stringify(res));
            },
            err => console.log(err),
            () => {
                setTimeout( () => {
                    this.resourceService.getFavouritesForService(this.service.id).subscribe(
                        favs => {
                            console.log('favs is', JSON.stringify(favs));
                            this.stats.favourites = Object.values(favs).reduce((acc, v) => acc + v, 0);
                        },
                        err => console.log(err),
                        () => console.log('stats.favourites became', this.stats.favourites)
                    );
                }, 1000);
            }
        );
    }

    rateService(rating: number) {
        this.userService.rateService(this.service.id, rating).subscribe(
            res => console.log,
            err => console.log(err),
            () => this.getShownRating()
        );
    }

    getShownRating() {
        this.userService.getUserRating(this.service.id).subscribe(
            res => this.userRating = res,
            error => console.log(error),
            () => {
                if (!this.userRating) {
                    this.userRating = 0;
                }
            }
        );
        //if user has rated, then show user rating
        //else show average rating
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