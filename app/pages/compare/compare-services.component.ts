/**
 * Created by stefania on 8/1/17.
 */
import { Component, DoCheck, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {ActivatedRoute} from "@angular/router";
import {Observable} from "rxjs/Observable";
import {Subscription} from "rxjs/Subscription";
import { RichService } from '../../domain/eic-model';
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

    services: RichService[] = [];

    public errorMessage: string;
    ids: string[] = [];
    /*providers: any;*/
    nologo: URL = new URL("http://fvtelibrary.com/img/user/NoLogo.png");
    private sub: Subscription;

    constructor(public fb: FormBuilder, public route: ActivatedRoute, public router: NavigationService,
                public resourceService: ResourceService, public authenticationService: AuthenticationService,
                public userService: UserService, public comparisonService: ComparisonService) {
        this.searchForm = fb.group({"query": [""]});
    }

    ngOnInit() {

        this.sub = this.route.params.subscribe(params => {
            this.ids = (params.services || "").split(",");
            if (this.ids.length > 1) {
                this.resourceService.getSelectedServices(this.ids).subscribe (
                    services => this.services = services
                );
            } else {
                this.router.search({});
            }
        });
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }

    onSubmit(searchValue: SearchQuery) {
        return this.router.search({query: searchValue.query});
    }

    getShownRating() {
        //if user has rated, then show user rating
        //else show average rating
    }


    addToFavourites(i:number) {
        this.userService.addFavourite(this.services[i].id, !this.services[i].isFavourite)
            .flatMap( e => this.resourceService.getSelectedServices([e.service]))
            .subscribe(
                res => {
                    Object.assign(this.services[i], res[0]);
                    console.log(this.services[i].isFavourite);
                },
                err => console.log(err)
            );
    }

    rateService(i:number, rating: number) {
        this.userService.rateService(this.services[i].id, rating)
            .flatMap( e => this.resourceService.getSelectedServices([e.service]))
            .subscribe (
                res => {
                    Object.assign(this.services[i], res[0]);
                    console.log(this.services[i].hasRate);
                },
                err => console.log(err)
            );
    }

    getIsFavourite(i: number) {
        return this.services[i].isFavourite;
    }

    getHasRate(i: number) {
        return this.services[i].hasRate;
    }

    getRatings(i:number) {
        return this.services[i].ratings;
    }


}