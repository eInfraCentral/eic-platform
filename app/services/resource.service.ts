/**
 * Created by stefania on 9/6/16.
 */

import {Injectable} from "@angular/core";
import {Headers, RequestOptions, URLSearchParams} from "@angular/http";
import {Observable} from "rxjs/Observable";
import {BrowseResults} from "../domain/browse-results";
import {Access, Service, ServiceAddenda} from "../domain/eic-model";
import {SearchResults} from "../domain/search-results";
import {URLParameter} from "../domain/url-parameter";
import {AuthenticationService} from "./authentication.service";
import {HTTPWrapper} from "./http-wrapper.service";

@Injectable()
export class ResourceService {
    constructor(private http: HTTPWrapper, private authenticationService: AuthenticationService) {
    }

    getAll(resourceType: string) {
        return this.http.get(`/${resourceType}/all`);
    }

    getBy(resourceType: string, resourceField: string) {
        return this.http.get(`/${resourceType}/by/${resourceField}/`);
    }

    getSome(resourceType: string, ids: string[]) {
        return this.http.get(`/${resourceType}/some/${ids.toString()}/`);
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
        return this.http.get(`/service/all${questionMark}${searchQuery.toString()}`).map(
            res => <SearchResults> <any> res);
    }

    getVocabularies(type?: string) {
        return this.http.get(`/vocabulary/all?from=0&quantity=10000${type ? "&type=" + type : ""}`).map(
            e => (<any>e).results.reduce(type ? this.idToName : this.idToObject, {}));
    }

    idToName(acc, v) {
        acc[v.resource.id] = v.resource.name;
        return acc;
    }

    idToObject(acc, v) {
        acc[v.resource.id] = {"type": v.resource.type, "name": v.resource.name};
        return acc;
    }

    uniq(acc, v) {
        if (!acc.includes(v)) {
            acc.push(v);
        }
        return acc;
    }

    getServices() {
        return this.getBy("service", "service_id");
    }

    getService(id: string) {
        return this.get("service", id);
    }

    getSelectedServices(ids: string[]) {
        return this.getSome("service", ids).map(res => <Service[]> <any> res);
    }

    getServicesByCategories() {
        return this.getBy("service", "category").map(res => <BrowseResults> <any> res);
    }

    getServicesOfferedByProvider(id: string): Observable<Service[]> {
        return this.search([{key: "provider", values: [id]}]).map(res => Object.values(res.results)
        .map(e => e.resource));
    }

    getServiceAnalytics(id: string): Observable<ServiceAddenda> {
        return Observable.from([{
            id, internalHits: 31337, externalHits: 1337, favouriteCount: 70, averageRating: 3, ratings: 12
        }]);
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

    getProviders() {
        return this.getAll("provider").map(e => e.results.reduce(this.idToName, {}));
    }

    getEU() {
        return this.http.getAny(
            "https://restcountries.eu/rest/v2/regionalbloc/EU?fields=alpha2Code",
            new RequestOptions({headers: new Headers({"Accept": "*"})})
        ).map(suc => suc.map(e => e.alpha2Code.toLowerCase()));
    }

    activateUserAccount(id: any) {
        return this.http.get(`/user/activate/${id}`);
    }

    uploadService(service: Service, shouldPut: boolean) {
        return this.http[shouldPut ? "put" : "post"]("/service", service).map(res => <Service> <any> res);
    }

    recordHit(id: any, type: any) {
        if (sessionStorage.getItem(type + "-" + id) !== "aye") {
            let hit = new Access();
            hit.serviceID = id;
            hit.instant = Date.now();
            hit.userID = (this.authenticationService.user || {id: ""}).id;
            hit.type = type;
            sessionStorage.setItem(type + "-" + id, "aye");
            return this.http.post("/access", hit);
        } else {
            return Observable.from(["k"]);
        }
    }
}
