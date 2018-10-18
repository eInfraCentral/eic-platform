/**
 * Created by stefania on 7/12/17.
 */
import {Injectable} from "@angular/core";
import {Http, Response} from "@angular/http";
import {Observable} from "rxjs/Rx";
import {ActiveTopicQuestions} from "../domain/faq-active-topic-questions";

@Injectable()
export class FAQService {
    //private _faqUrl = "http://83.212.101.85:5555/api/";
    /*private _faqUrl = "http://beta.einfracentral.eu/faq/";*/
    private _faqUrl = process.env.FAQ_ENDPOINT;

    constructor(public http: Http) {
    }

    getActiveTopicQuestions() {
        console.log(this._faqUrl + "/topic/active");
        return this.http.get(this._faqUrl + "/topic/active")
        .map(res => <ActiveTopicQuestions[]> res.json())
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