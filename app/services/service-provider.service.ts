/**
 * Created by myrto on 9/19/18.
 */
import { Injectable } from '@angular/core';
import { HTTPWrapper } from './http-wrapper.service';
import { AuthenticationService } from './authentication.service';
import { Observable } from 'rxjs';
import { Provider, Service } from '../domain/eic-model';
import { URLSearchParams } from '@angular/http';

@Injectable()
export class ServiceProviderService {
    constructor(public http: HTTPWrapper, public authenticationService: AuthenticationService) {}

    createNewServiceProvider(newProvider: any) {
        return this.http.post('/provider', newProvider);
    }

    updateServiceProvider(updatedFields: any) {
        return this.http.put('/provider', updatedFields);
    }

    verifyServiceProvider(id: string, active: boolean, status: string) {
        return this.http.patch(`/provider/verifyProvider/${id}?active=${active}&status=${status}`, {});
    }

    getMyServiceProviders() {
        return this.http.get('/provider/getMyServiceProviders');
    }

    // getMyServiceProviders() {
    //     return this.http.get(`/provider/getMyServiceProviders?email=${this.authenticationService.getUserProperty('email')}`);
    // }

    getServiceProviderById(id: string) {
        return this.http.get(`/provider/${id}`);
    }

    getServicesOfProvider(id: string) {
        return this.http.get(`/provider/services/${id}`);
    }

    getPendingServicesOfProvider(id: string) {
        return this.http.get(`/provider/services/pending/${id}`);
    }

    checkUrl(url: string) {
        if (url !== '') {
            if (!url.match(/^(https?:\/\/.+){0,1}$/)) {
                url = 'http://' + url;
            }
        }
        return url;
    }

}