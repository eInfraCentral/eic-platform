/**
 * Created by pgl on 27/10/17.
 */
import {Injectable} from "@angular/core";
import {Headers, Http, RequestOptions, RequestOptionsArgs, Response, XHRBackend} from "@angular/http";
import {Observable} from "rxjs/Rx";

declare var UIkit: any;

@Injectable()
export class HTTPWrapper extends Http {
    private base = process.env.API_ENDPOINT;

    constructor(backend: XHRBackend) {
        super(backend, new RequestOptions({headers: new Headers({"Content-Type": "application/json;charset=UTF-8"})}));
    }

    public post(url: string, body: any, options?: RequestOptionsArgs): Observable<any> {
        return super.post(this.base + url, this.parse(body), options).map(this.getJSON).catch(this.handleError);
    }

    public put(url: string, body: any, options?: RequestOptionsArgs): Observable<any> {
        return super.put(this.base + url, this.parse(body), options).map(this.getJSON).catch(this.handleError);
    }

    public get(url: string, options?: RequestOptionsArgs): Observable<any> {
        return super.get(this.base + url, options).map(this.getJSON).catch(this.handleError);
    }

    public handleError(error: Response) {
        let message = "Severe server error";
        try {
            JSON.parse(error.text()).error
        } catch (e) {
            console.error("HTTPWrapper", e);
        }
        UIkit.notification.closeAll();
        UIkit.notification({
            message,
            status: "danger",
            pos: "top-center",
            timeout: 5000
        });
        return Observable.throw(error);
    }

    private getJSON(response: Response): any {
        let ret = response.toString();
        try {
            ret = response.json();
        } catch (e) {
            console.error(e);
        }
        return ret;
    }

    private parse(request: any): any {
        try {
            return JSON.parse(request);
        } catch (e) {
            return request;
        }
    }
}