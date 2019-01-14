/**
 * Created by stefania on 8/31/16.
 */

import {Component, OnDestroy, OnInit} from "@angular/core";
import {FormBuilder, FormGroup} from "@angular/forms";
import {ActivatedRoute} from "@angular/router";
import {Observable} from "rxjs/Observable";
import {Subscription} from "rxjs/Subscription";
import {Facet, FacetValue} from "../../domain/facet";
import {SearchQuery} from "../../domain/search-query";
import {SearchResults} from "../../domain/search-results";
import {AuthenticationService} from "../../services/authentication.service";
import {ComparisonService} from "../../services/comparison.service";
import {NavigationService} from "../../services/navigation.service";
import {ResourceService} from "../../services/resource.service";
import {UserService} from "../../services/user.service";
import {URLParameter} from "../../domain/url-parameter";
import { Event, RichService, Service } from '../../domain/eic-model';
import { IStarRatingOnClickEvent } from 'angular-star-rating';
import { isNullOrUndefined } from 'util';
import { timer } from 'rxjs/observable/timer';

declare var UIkit: any;

@Component({
    selector: "search",
    templateUrl: "./search.component.html",
    styleUrls: ["./search.component.css"]
})
export class SearchComponent implements OnInit, OnDestroy {

    searchForm: FormGroup;
    errorMessage: string;
    sub: Subscription;
    urlParameters: URLParameter[] = [];
    searchResults: SearchResults<RichService>;
    facetOrder = ["category", "trl", "lifeCycleStatus", "provider"];
    pageSize: number = 10;
    currentPage: number = 0;
    totalPages: number = 0;
    isPreviousPageDisabled: boolean = false;
    isFirstPageDisabled: boolean = false;
    isNextPageDisabled: boolean = false;
    isLastPageDisabled: boolean = false;
    foundResults = true;
    advanced: boolean = false;
    providers: any;
    // vocabularies: any;

    listViewActive: boolean = true;

    obsTimer = timer(1000);

    constructor(public fb: FormBuilder, public router: NavigationService, public route: ActivatedRoute,
                public userService: UserService, public resourceService: ResourceService,
                public authenticationService: AuthenticationService, public comparisonService: ComparisonService,
                public navigationService: NavigationService) {
        this.searchForm = fb.group({"query": [""]});
    }

    ngOnInit() {

        this.listViewActive = true;

        Observable.zip(
            this.resourceService.getProvidersNames(),
        ).subscribe(suc => {
            this.providers = suc[0];
            this.sub = this.route.params.subscribe(params => {
                this.urlParameters.splice(0, this.urlParameters.length);
                this.foundResults = true;
                for (let obj in params) {
                    if (params.hasOwnProperty(obj)) {
                        let urlParameter: URLParameter = {
                            key: obj,
                            values: params[obj].split(",")
                        };
                        this.urlParameters.push(urlParameter);
                        if (urlParameter.key === 'quantity') {
                            this.pageSize = +urlParameter.values;
                        }
                    }
                }

                this.navigationService.paramsObservable.next(this.urlParameters);

                //request results from the registry
                return this.resourceService.search(this.urlParameters).subscribe(
                    searchResults => this.updateSearchResults(searchResults)
                );

            });
        });
    }

    ngOnDestroy(): void {
        this.sub.unsubscribe();
        this.navigationService.paramsObservable.next(null);
    }

    toggleListGrid(show: string) {
        if(show == 'list') {
            this.listViewActive = true;
            this.pageSize = 10;
            this.updatePagingURLParametersQuantity(this.pageSize);
            this.updatePagingURLParameters(0);
            return this.navigateUsingParameters();
        }
        else if(show == 'grid') {
            this.listViewActive = false;
            this.pageSize = 9;
            this.updatePagingURLParametersQuantity(this.pageSize);
            this.updatePagingURLParameters(0);
            return this.navigateUsingParameters();
        }
        else {
            this.listViewActive = true;
            this.pageSize = 10;
            this.updatePagingURLParametersQuantity(this.pageSize);
            this.updatePagingURLParameters(0);
            return this.navigateUsingParameters();
        }
    }

    updateSearchResults(searchResults: SearchResults<RichService>) {

        //INITIALISATIONS
        this.errorMessage = null;
        this.searchResults = searchResults;
        this.isFirstPageDisabled = false;
        this.isPreviousPageDisabled = false;
        this.isLastPageDisabled = false;
        this.isNextPageDisabled = false;
        if (this.searchResults.results.length == 0) {
            this.foundResults = false;
        }
        this.orderFacets();
        //update form values using URLParameters
        for (let urlParameter of this.urlParameters) {
            if (urlParameter.key === "query") {
                this.searchForm.get("query").setValue(urlParameter.values[0]);
            } else if (urlParameter.key === "advanced") {
                this.advanced = urlParameter.values[0] == "true";
            } else {
                for (let facet of this.searchResults.facets) {
                    if (facet.field === urlParameter.key) {
                        //
                        for (let parameterValue of urlParameter.values) {
                            for (let facetValue of facet.values) {
                                if (parameterValue === facetValue.value) {
                                    facetValue.isChecked = true;
                                }
                            }
                        }
                    }
                }
            }
        }
        // this.pageSize = 10;
        this.updatePagingURLParametersQuantity(this.pageSize);
        this.currentPage = (searchResults.from / this.pageSize) + 1;
        this.totalPages = Math.ceil(searchResults.total / this.pageSize);
        if (this.currentPage == 1) {
            this.isFirstPageDisabled = true;
            this.isPreviousPageDisabled = true;
        }
        if (this.currentPage == this.totalPages) {
            this.isLastPageDisabled = true;
            this.isNextPageDisabled = true;
        }
    }

    orderFacets() {
        let facetValues = {};
        this.facetOrder.forEach((e, i) => {
            facetValues[e] = i;
        });
        this.searchResults.facets.sort((a, b): number => {
            return facetValues[a.field] - facetValues[b.field];
        });
    }

    // getFacetLabel(facet: Facet, facetValue: FacetValue) {
    //     return facet.label === "Provider" ? this.providers[facetValue.value] || "N/A" : (this.vocabularies[facetValue.value] || {name:"N/A"}).name || "N/A";
    // }

    onSubmit(searchValue: SearchQuery) {
        var foundQuery = false;
        var queryParameterIndex = 0;
        for (let urlParameter of this.urlParameters) {
            if (urlParameter.key === "query") {
                foundQuery = true;
                if (searchValue.query === "") {
                    this.urlParameters.splice(queryParameterIndex, 1);
                } else {
                    urlParameter.values.splice(0, urlParameter.values.length);
                    urlParameter.values.push(searchValue.query);
                }
            }
            queryParameterIndex++;
        }
        if (!foundQuery && searchValue.query != "") {
            var searchQuery: URLParameter = {
                key: "query",
                values: [searchValue.query]
            };
            this.urlParameters.push(searchQuery);
        }
        return this.navigateUsingParameters();
    }

    deselectFacet(category: string, value: string) {
        var categoryIndex = 0;
        for (let urlParameter of this.urlParameters) {
            if (urlParameter.key === category) {
                var valueIndex = urlParameter.values.indexOf(value, 0);
                if (valueIndex > -1) {
                    urlParameter.values.splice(valueIndex, 1);
                    if (urlParameter.values.length == 0) {
                        this.urlParameters.splice(categoryIndex, 1);
                    }
                }
            }
            categoryIndex++;
            if (category === "query") {
                this.searchForm.get("query").setValue("");
                this.navigationService.paramsObservable.next(null);
            }
        }
        return this.navigateUsingParameters();
    }

    isSelected(service : Service) : boolean {
        return (this.comparisonService.servicesToCompare.map(e => e.id).indexOf(service.id)) > -1;
    }

    selectFacet(category: string, value: string) {
        var foundCategory = false;
        for (let urlParameter of this.urlParameters) {
            if (urlParameter.key === category) {
                foundCategory = true;
                urlParameter.values.push(value);
            }
        }
        if (!foundCategory) {
            var newParameter: URLParameter = {
                key: category,
                values: [value]
            };
            this.urlParameters.push(newParameter);
        }
        return this.navigateUsingParameters();
    }

    onSelection(e, category: string, value: string) {
        if (e.target.checked) {
            var foundCategory = false;
            for (let urlParameter of this.urlParameters) {
                if (urlParameter.key === category) {
                    foundCategory = true;
                    urlParameter.values.push(value);
                }
            }
            if (!foundCategory) {
                var newParameter: URLParameter = {
                    key: category,
                    values: [value]
                };
                this.urlParameters.push(newParameter);
            }
        } else {
            var categoryIndex = 0;
            for (let urlParameter of this.urlParameters) {
                if (urlParameter.key === category) {
                    var valueIndex = urlParameter.values.indexOf(value, 0);
                    if (valueIndex > -1) {
                        urlParameter.values.splice(valueIndex, 1);
                        if (urlParameter.values.length == 0) {
                            this.urlParameters.splice(categoryIndex, 1);
                        }
                    }
                }
                categoryIndex++;
            }
        }
        return this.navigateUsingParameters();
    }

    navigateUsingParameters() {
        var map: { [name: string]: string; } = {};
        for (let urlParameter of this.urlParameters) {
            var concatValue = "";
            var counter = 0;
            for (let value of urlParameter.values) {
                if (counter != 0) {
                    concatValue += ",";
                }
                concatValue += value;
                counter++;
            }
            map[urlParameter.key] = concatValue;
        }
        return this.router.search(map);
    }

    goToFirstPage() {
        var from: number = 0;
        var to: number = 9;
        this.updatePagingURLParameters(from);
        return this.navigateUsingParameters();
    }

    goToPreviousPage() {
        var from: number = this.searchResults.from;
        var to: number = this.searchResults.to;
        from -= this.pageSize;
        to -= this.pageSize;
        this.updatePagingURLParameters(from);
        return this.navigateUsingParameters();
    }

    goToNextPage() {
        var from: number = this.searchResults.from;
        var to: number = this.searchResults.to;
        from += this.pageSize;
        to += this.pageSize;
        this.updatePagingURLParameters(from);
        return this.navigateUsingParameters();
    }

    goToLastPage() {
        var from: number = Math.floor(this.searchResults.total / this.pageSize) * this.pageSize;
        var to: number = this.searchResults.total - 1;
        this.updatePagingURLParameters(from);
        return this.navigateUsingParameters();
    }

    onPageSizeChange(event) {
        this.pageSize = event.target.value;
        this.updatePagingURLParametersQuantity(this.pageSize);
        this.updatePagingURLParameters(0);
        return this.navigateUsingParameters();
    }

    updatePagingURLParameters(from: number) {
        var foundFromCategory = false;
        for (let urlParameter of this.urlParameters) {
            if (urlParameter.key === "from") {
                foundFromCategory = true;
                urlParameter.values = [];
                urlParameter.values.push(from + "");
            }
        }
        if (!foundFromCategory) {
            var newFromParameter: URLParameter = {
                key: "from",
                values: [from + ""]
            };
            this.urlParameters.push(newFromParameter);
        }
    }

    updatePagingURLParametersQuantity(quantity: number) {
        var foundQuantityCategory = false;
        for (let urlParameter of this.urlParameters) {
            if (urlParameter.key === "quantity") {
                foundQuantityCategory = true;
                urlParameter.values = [];
                urlParameter.values.push(quantity + "");
            }
        }
        if (!foundQuantityCategory) {
            var newQuantityParameter: URLParameter = {
                key: "quantity",
                values: [quantity + ""]
            };
            this.urlParameters.push(newQuantityParameter);
        }
    }

    addToFavourites(i: number) {
        const service = this.searchResults.results[i];
        this.userService.addFavourite(service.id, !service.isFavourite)
            .flatMap( e => this.resourceService.getSelectedServices([e.service]))
            .subscribe(
                s => Object.assign(this.searchResults.results[i],s[0]),
                err => console.log(err)
            );

    }

    rateService(i: number, rating: number) {
        const service = this.searchResults.results[i];
        this.userService.rateService(service.id, rating)
            .flatMap(e => this.resourceService.getSelectedServices([e.service]))
            .subscribe(
                s => Object.assign(this.searchResults.results[i],s[0]),
                err => console.log(err)
            );
    }

    getIsFavourite(i:number) { return this.searchResults.results[i].isFavourite; }

}
