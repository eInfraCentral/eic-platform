import { Component, Injector, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthenticationService } from '../../services/authentication.service';
import { Service } from '../../domain/eic-model';
import { ServiceFormComponent } from '../eInfraServices/service-form.component';
import { ActivatedRoute } from '@angular/router';
import { ServiceProviderService } from '../../services/service-provider.service';

@Component({
    selector: 'add-first-service',
    templateUrl: '../eInfraServices/service-form.component.html'
})
export class AddFirstServiceComponent extends ServiceFormComponent implements OnInit {

    pendingServices: Service[] = [];

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
    }

    onSuccess(service) {
        this.successMessage = "Service uploaded successfully!";
    }

    onSubmit(service: Service, isValid: boolean) {
        super.onSubmit(service, isValid);
    }
}