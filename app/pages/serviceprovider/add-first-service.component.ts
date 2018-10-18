import { Component, Injector, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthenticationService } from '../../services/authentication.service';
import { Service } from '../../domain/eic-model';
import { ServiceFormComponent } from '../eInfraServices/service-form.component';
import { ActivatedRoute } from '@angular/router';
import { ServiceProviderService } from '../../services/service-provider.service';
import { ResourceService } from '../../services/resource.service';

@Component({
    selector: 'add-first-service',
    templateUrl: '../eInfraServices/service-form.component.html'
})
export class AddFirstServiceComponent extends ServiceFormComponent implements OnInit {

    pendingServices: Service[] = [];
    serviceId: string;

    constructor(protected injector: Injector,
                protected authenticationService: AuthenticationService,
                private route: ActivatedRoute) {
        super(injector, authenticationService);
        this.editMode = false;
    }

    ngOnInit() {
        super.ngOnInit();
        this.firstServiceForm = true;
        this.providerId = this.route.snapshot.paramMap.get('id');
        console.log(this.route.snapshot.paramMap.get('id'));
        this.serviceId = this.route.snapshot.paramMap.get('serviceId');
        if (this.serviceId) {
            this.editMode = true;
            this.resourceService.getService(this.serviceId).subscribe(service => {

                /*if (this.userService.canEditService(service)) {*/
                ResourceService.removeNulls(service);
                this.serviceForm.patchValue(this.toForms(service));
                /*} else {
                    this.location.back();
                }*/
            });
        }
    }

    onSuccess(service) {
        this.successMessage = "Service uploaded successfully!";
    }

    onSubmit(service: Service, isValid: boolean) {
        if (this.serviceId) {
            service.id = this.serviceId;
        }
        super.onSubmit(service, isValid);
    }

    toForms(service: Service) {
        let ret = {};
        Object.entries(service).forEach(([name, values]) => {
            let newValues = [];
            if (Array.isArray(values)) {
                values.forEach(entry => {
                    newValues.push({entry});
                });
            } else {
                newValues = values;
            }
            ret[name] = newValues;
        });
        return <Service>ret;
    }
}