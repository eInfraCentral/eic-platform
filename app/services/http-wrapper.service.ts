import {Injectable} from "@angular/core";
import {Headers, Http, RequestOptions, RequestOptionsArgs, Response, XHRBackend} from "@angular/http";
import {Observable} from "rxjs/Rx";
declare var UIkit: any;
@Injectable()
export class HTTPWrapper extends Http {
    private base = process.env.API_ENDPOINT;
    private static jsonHeaders = {"Content-Type": "application/json;charset=UTF-8", "Accept": "application/json;charset=UTF-8"};

    constructor(public backend: XHRBackend) {
        super(backend, new RequestOptions({headers: new Headers(HTTPWrapper.jsonHeaders)}));
    }

    public post(url: string, body: any, options?: RequestOptionsArgs): Observable<any> {
        // console.log(`calling ${url}`);
        options = options || {withCredentials: true};
        return super.post(this.base + url, this.parse(body), options).map(this.getJSON).catch(this.handleError);
    }

    public put(url: string, body: any, options?: RequestOptionsArgs): Observable<any> {
        // console.log(`calling ${url}`);
        options = options || {withCredentials: true};
        return super.put(this.base + url, this.parse(body), options).map(this.getJSON).catch(this.handleError);
    }

    public getAny(url: string, options?: RequestOptionsArgs): Observable<any> {
        console.log(`calling ${url}`);
        options = options || {withCredentials: true};
        return super.get(url, options).map(this.getJSON).catch(this.handleError);
    }

    public get(url: string, options?: RequestOptionsArgs): Observable<any> {
        options = options || {withCredentials: true};
        return this.getAny(this.base + url, options);
    }

    public handleError(error: Response) {
        let message = "Server error";
        try {
            message = JSON.parse(error.text()).error;
        } catch (e) {
            console.error("HTTPWrapper", e);
        }
        UIkit.notification.closeAll();
        UIkit.notification({message: message, status: "danger", pos: "top-center", timeout: 5000});
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