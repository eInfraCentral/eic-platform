/**
 * Created by stefania on 8/1/17.
 */
import {Component, OnDestroy, OnInit} from "@angular/core";
import {FormBuilder, FormGroup} from "@angular/forms";
import {ActivatedRoute} from "@angular/router";
import {Observable} from "rxjs/Observable";
import {Subscription} from "rxjs/Subscription";
import { Event, Service } from '../../domain/eic-model';
import {SearchQuery} from "../../domain/search-query";
import {AuthenticationService} from "../../services/authentication.service";
import {ComparisonService} from "../../services/comparison.service";
import {NavigationService} from "../../services/navigation.service";
import {ResourceService} from "../../services/resource.service";
import {UserService} from "../../services/user.service";

@Component({
    selector: "compare-services",
    templateUrl: "./compare-services.component.html",
    styleUrls: ["./compare-services.component.css"]
})
export class CompareServicesComponent implements OnInit, OnDestroy {
    searchForm: FormGroup;
    public services: Service[] = [];
    public errorMessage: string;
    providers: any;
    nologo: URL = new URL("http://fvtelibrary.com/img/user/NoLogo.png");
    vocabularies: any;
    private sub: Subscription;

    userFavourites: Event[] = [];
    userRatings: Event[] = [];

    constructor(public fb: FormBuilder, public route: ActivatedRoute, public router: NavigationService,
                public resourceService: ResourceService, public authenticationService: AuthenticationService,
                public userService: UserService, public comparisonService: ComparisonService) {
        this.searchForm = fb.group({"query": [""]});
    }

    ngOnInit() {
        Observable.zip(
            this.resourceService.getProvidersNames(),
            this.resourceService.getVocabularies(),
        ).subscribe(suc => {
            this.providers = suc[0];
            this.vocabularies = this.transformVocabularies(suc[1]);
            this.sub = this.route.params.subscribe(params => {
                let ids = (params.services || "").split(",");
                if (ids.length > 1) {
                    this.resourceService.getSelectedServices(ids).subscribe(
                        services => this.services = services
                    );
                } else {
                    this.router.search({});
                }
            });
        },
            err => console.log(err),
            () => {
                if (this.authenticationService.isLoggedIn()) {
                    this.userService.getRatingsOfUser().subscribe(
                        ratings => this.userRatings = ratings.sort(
                            function(a,b){
                                if (a['instant'] > b['instant']) {
                                    return -1;
                                } else if (a['instant'] < b['instant']) {
                                    return 1;
                                } else {
                                    return 0;
                                }
                            } )
                    );
                    this.userService.getFavouritesOfUser().subscribe(
                        favs => this.userFavourites = favs.sort(
                            function(a,b){
                                if (a['instant'] > b['instant']) {
                                    return -1;
                                } else if (a['instant'] < b['instant']) {
                                    return 1;
                                } else {
                                    return 0;
                                }
                            } )
                    );
                }
            });
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }

    transformVocabularies(vocabularies) {
        let ret = {};
        Object.entries(vocabularies).forEach(([key, value]) => {
            let item = {};
            item[key] = String(value.name);
            let prefix = value.type;
            ret[prefix] = ret[prefix] || {};
            Object.assign(ret[prefix], item);
        });
        return ret;
    }

    onSubmit(searchValue: SearchQuery) {
        return this.router.search({query: searchValue.query});
    }

    getShownRating() {
        //if user has rated, then show user rating
        //else show average rating
    }


    getUserRating(serviceID: string) {
        if (this.userRatings &&
            this.userRatings.some(x => x.service === serviceID)) {

            let i = this.userRatings.findIndex(x => x.service === serviceID);
            return +this.userRatings[i].value;
        }
        return 0;
    }

    getIfUserFavourite(serviceID: string) {
        if (this.userFavourites &&
            this.userFavourites.some(x => x.service === serviceID)) {

            let i = this.userFavourites.findIndex(x => x.service === serviceID);
            return (this.userFavourites[i].value === '1');
        } else {
            return false;
        }
    }

    addToFavourites(serviceID: string) {
        this.userService.addFavourite(serviceID).subscribe(
            res => {
                // console.log(res['value']);
                if (this.userFavourites &&
                    this.userFavourites.some(x => x.service === serviceID)) {
                    let i = this.userFavourites.findIndex(x => x.service === serviceID);
                    this.userFavourites[i].value = res['value'];
                } else {
                    this.userFavourites.push(res);
                }
            },
            err => console.log(err),
            () => this.getIfUserFavourite(serviceID)
        );

    }

    rateService(serviceID: string, rating: number) {
        this.userService.rateService(serviceID, rating).subscribe(
            res => {
                    // console.log(res['value']);
                    if (this.userRatings &&
                        this.userRatings.some(x => x.service === serviceID)) {
                        let i = this.userRatings.findIndex(x => x.service === serviceID);
                        this.userRatings[i].value = res['value'];
                    } else {
                        this.userRatings.push(res);
                    }
                },
            err => console.log(err),
            () => this.getUserRating(serviceID)
        );
    }
}