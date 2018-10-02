/**
 * Created by stefania on 9/6/16.
 */
import {Injectable} from "@angular/core";
import {RequestOptions, URLSearchParams} from "@angular/http";
import {Observable} from "rxjs/Observable";
import {BrowseResults} from "../domain/browse-results";
import { RichService, Service, ServiceHistory, Vocabulary } from '../domain/eic-model';
import {SearchResults} from "../domain/search-results";
import {URLParameter} from "../domain/url-parameter";
import {AuthenticationService} from "./authentication.service";
import {HTTPWrapper} from "./http-wrapper.service";
import {stringify} from "querystring";
import {shareReplay} from "rxjs/operators";
@Injectable()
export class ResourceService {
    constructor(public http: HTTPWrapper, public authenticationService: AuthenticationService) {
    }

    getAll(resourceType: string) {
        let params : RequestOptions = new RequestOptions();
        params.params = new URLSearchParams();
        params.params.append("from","0");
        params.params.append("quantity","10000");
        return this.http.get(`/${resourceType}/all`,params);
    }

    getBy(resourceType: string, resourceField: string) {
        return this.http.get(`/${resourceType}/by/${resourceField}/`);
    }

    getSome(resourceType: string, ids: string[]) {
        return this.http.get(`/${resourceType}/byID/${ids.toString()}/`);
    }

    get(resourceType: string, id: string) {
        return this.http.get(`/${resourceType}/${id}/`);
    }

    static removeNulls(obj) {
        var isArray = obj instanceof Array;
        for (var k in obj) {
            if (obj[k] === null || obj[k] === "") {
                isArray ? obj.splice(k, 1) : delete obj[k];
            } else if (typeof obj[k] == "object") {
                if (typeof obj[k].value != "undefined" && typeof obj[k].lang != "undefined") {
                    if (obj[k].value == "" && obj[k].lang == "en") {
                        obj[k].lang = "";
                    }
                }
                ResourceService.removeNulls(obj[k]);
            }
            if (obj[k] instanceof Array && obj[k].length == 0) {
                delete obj[k];
            }
        }
    }

    search(urlParameters: URLParameter[]) {
        let searchQuery = new URLSearchParams();
        for (let urlParameter of urlParameters) {
            for (let value of urlParameter.values) {
                searchQuery.append(urlParameter.key, value);
            }
        }
        searchQuery.delete("to");
        let questionMark = urlParameters.length > 0 ? "?" : "";
        /*return this.http.get(`/service/all${questionMark}${searchQuery.toString()}`).map(res => <SearchResults<Service>> <any> res);*/
        return this.http.get(`/service/rich/all${questionMark}${searchQuery.toString()}`).map(res => <SearchResults<RichService>> <any> res);
    }

    getVocabularies(type?: string) {
        /*return this.getVocabulariesRaw(type).map(e => e.results.reduce(type ? this.idToName : this.idToObject, {})).pipe(shareReplay(1));*/
        return this.getVocabulariesRaw(type).map(e => e.results.reduce(type ? this.idToName : this.idToObject, {}));
    }


    getVocabulariesRaw(type?: string): Observable<SearchResults<Vocabulary>> {
        return this.http.get(`/vocabulary/all?from=0&quantity=1000${type ? "&type=" + type : ""}`);
    }

    getVocabulariesUsingGroupBy(type?: string) {
        return this.http.get(`/vocabulary/by/type`).filter(e => type ? e && e.type && e.type === type : true);
    }

    idToName(acc : any, v : any) {
        acc[v.id] = v.name;
        return acc;
    }

    idToObject(acc, v) {
        acc[v.id] = {"type": v.type, "name": v.name};
        return acc;
    }

    getServices() {
        return this.getBy("service", "id");
    }

    getService(id: string, version? : string) {
        return this.get("service", [id,version].join('/'));
    }

    getRichService(id: string, version? : string) {
        return this.get("service/rich", [id,version].join('/'));
    }

    getSelectedServices(ids: string[]) {
        /*return this.getSome("service", ids).map(res => <Service[]> <any> res);*/
        return this.getSome("service/rich", ids).map(res => <RichService[]> <any> res);
    }

    getServicesByCategories() {
        return this.getBy("service", "category").map(res => <BrowseResults> <any> res);
    }

    getServicesOfferedByProvider(id: string): Observable<Service[]> {
        return this.search([{key: "quantity", values: ["100"]}, {key: "provider", values: [id]}]).map(res => Object.values(res.results));
    }

    getVisitsForProvider(provider: string, type?: string) {
        return this.get(`stats/provider/${type || "visits"}`, provider);
    }

    getFavouritesForProvider(provider: string) {
        return this.get("stats/provider/favourites", provider);
    }

    getRatingsForProvider(provider: string) {
        return this.get("stats/provider/ratings", provider);
    }

    getVisitationPercentageForProvider(provider: string) {
        return this.get("stats/provider/visitation", provider);
    }

    getPlacesForProvider(provider: string) {
        return this.getServicesOfferedByProvider(provider);
    }

    getVisitsForService(service: string, type?: string) {
        return this.get(`stats/service/${type || "visits"}`, service);
    }

    getFavouritesForService(service: string) {
        return this.get("stats/service/favourites", service);
    }

    getRatingsForService(service: string) {
        return this.get("stats/service/ratings", service);
    }

    groupServicesOfProviderPerPlace(id: string) {
        return this.getServicesOfferedByProvider(id).map(res => {
            let servicesGroupedByPlace = {};
            for (let service of res) {
                for (let place of service.places) {
                    if (servicesGroupedByPlace[place]) {
                        servicesGroupedByPlace[place].push(res);
                    } else {
                        servicesGroupedByPlace[place] = [];
                    }
                }
            }
            return servicesGroupedByPlace;
        });
    }

    getProvidersNames() {
        return this.getAll("provider").map(e => e.results.reduce(this.idToName, {}));
    }

    getProviders() {
        return this.getAll("provider");
    }

    getEU() {
        return this.http.get("/vocabulary/getEU");
    }

    getWW() {
        return this.http.get("/vocabulary/getWW");
    }

    //this should be somewhere else, I think
    expandRegion(places, eu, ww) {
        let iEU = places.indexOf("Place-EU");
        if (iEU > -1) {
            places.splice(iEU, 1);
            places.push(...eu);
        }
        let iWW = places.indexOf("Place-WW");
        if (iWW > -1) {
            places.splice(iWW, 1);
            places.push(...ww);
        }
        return places;
    }

    getExternalsForProvider(provider: string) {
        return this.getVisitsForProvider(provider, "externals");
    }

    getExternalsForService(service: string, type?: string) {
        return this.getVisitsForService(service, "externals");
    }

    getInternalsForService(service: string, type?: string) {
        return this.getVisitsForService(service, "internals");
    }

    getInternalsForProvider(provider: string) {
        return this.getVisitsForProvider(provider, "internals");
    }

    activateUserAccount(id: any) {
        return this.http.get(`/user/activate/${id}`);
    }

    uploadService(service: Service, shouldPut: boolean) {
        return this.http[shouldPut ? "put" : "post"]("/service", service).map(res => <Service> <any> res);
    }

    recordEvent(service: any, type: any, value?: any) {
        let event = Object.assign({
            instant: Date.now(),
            user: (this.authenticationService.user || {id: ""}).id
        }, {service, type, value});
        let isVisit = ["INTERNAL", "EXTERNAL"].indexOf(event.type) > 0;
        if (( isVisit && sessionStorage.getItem(type + "-" + service) !== "aye") || !isVisit) {
            sessionStorage.setItem(type + "-" + service, "aye");
            return this.http.post("/event", event);
        } else {
            return Observable.from(["k"]);
        }
    }

    getFeaturedServices() {
        return this.http.get(`/service/featured/all`).map(res => <Service[]> <any> res);
    }

    getServiceHistory(serviceId: string) {
        return this.http.get(`/service/history/${serviceId}`).map(res => <SearchResults<ServiceHistory>> <any> res);
    }
}