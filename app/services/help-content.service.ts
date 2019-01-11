/**
 * Created by stefania on 7/17/17.
 */

import {Injectable} from "@angular/core";
import {Http, Response} from "@angular/http";
import {Observable} from "rxjs/Rx";
import {PageContent} from "../domain/page-content";

@Injectable()
export class HelpContentService {
    //private _helpServiceUrl = "http://83.212.101.85:5555/api/";
    private _helpServiceUrl = process.env.FAQ_ENDPOINT;

    constructor(public http: Http) {
    }

    getActivePageContent(route: string) {
        // console.log(this._helpServiceUrl + "/page/route?q=" + route);
        return this.http.get(this._helpServiceUrl + "/page/route?q=" + route)
        .map(res => <PageContent> res.json())
        .catch(this.handleError);
    }

    private extractData(res: Response) {
        let body = res.json();
        return body.data || {};
    }

    private handleError(error: Response | any) {
        // In a real world app, we might use a remote logging infrastructure
        // We'd also dig deeper into the error to get a better message
        let errMsg = "";
        if (error instanceof Response) {
            const body = error.text() || "";
            //const err = body.error || JSON.stringify(body);
            errMsg = `${error.status} - ${error.statusText || ""} ${body}`;
        } else {
            errMsg = (error.message) ? error.message :
                error.status ? `${error.status} - ${error.statusText}` : "Server error";
            console.error(errMsg); // log to console instead
        }
        return Observable.throw(errMsg);
    }
}
