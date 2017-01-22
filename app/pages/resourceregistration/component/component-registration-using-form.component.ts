/**
 * Created by stefania on 1/22/17.
 */
import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms'
import { OMTDComponent } from "../../../domain/openminted-model";
import { ResourceService } from "../../../services/resource.service";

@Component({
    selector: 'component-registration-using-form',
    templateUrl: 'app/pages/resourceregistration/component/component-registration-using-form.component.html'
})

export class ComponentRegistrationUsingFormComponent implements OnInit {

    componentForm: FormGroup;
    componentValue : OMTDComponent;
    componentFormErrorMessage: string = null;

    errorMessage: string = null;
    successfulMessage: string = null;

    constructor(private resourceService: ResourceService) {
    }

    ngOnInit() {

    }

    handleComponent(component : any) {
        this.componentForm = component;
    }

    onSubmit() {

        this.successfulMessage = null;
        this.errorMessage = null;

        if(this.componentForm.valid)
            this.componentFormErrorMessage = null;
        else
            this.componentFormErrorMessage = 'There are invalid or missing fields in the metadata you have submitted. You ' +
                'can see the ones invalid or missing marked as red.';

        if(this.componentForm.valid) {
            this.resourceService.uploadComponent(this.componentForm.value).subscribe(
                res => {
                    this.successfulMessage = 'Component registered successfully';
                    window.scrollTo(0,0);
                }, error => this.handleError(error)
            );
        } else {
            window.scrollTo(0,0);
        }
    }

    handleError(error) {
        this.errorMessage = 'Component registration failed (Server responded: ' + error + ')';
        window.scrollTo(0,0);
    }

}