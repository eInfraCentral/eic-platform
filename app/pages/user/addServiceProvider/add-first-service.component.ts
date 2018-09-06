import { Component, Injector, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthenticationService } from '../../../services/authentication.service';
import { Service } from '../../../domain/eic-model';
import { ServiceFormComponent } from '../../eInfraServices/service-form.component';

@Component({
    selector: 'add-first-service',
    templateUrl: '../../eInfraServices/service-form.component.html'
})
export class AddFirstServiceComponent extends ServiceFormComponent implements OnInit {

    private sub: Subscription;

    constructor(protected injector: Injector, protected authenticationService: AuthenticationService) {
        super(injector, authenticationService);
        this.editMode = false;
    }

    ngOnInit() {
        super.ngOnInit();
    }

    onSuccess(service) {
        this.successMessage = "Service uploaded successfully!";
    }

    onSubmit(service: Service, isValid: boolean) {
        super.onSubmit(service, isValid);
    }
}