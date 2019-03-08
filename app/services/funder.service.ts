import {Injectable} from "@angular/core";
import {HTTPWrapper} from "./http-wrapper.service";


@Injectable()
export class FunderService {

    constructor(public http: HTTPWrapper) {}

    getAllFunders(quantity :string) {
        return this.http.get(`/funder/all?quantity=${quantity}`)
    }

    getFunder(id: string) {
        return this.http.get(`/funder/${id}`);
    }

    getFunderStats(funderId: string, field: string) {
        return this.http.get(`/funder/funderServices/${funderId}/${field}`);
    }
}