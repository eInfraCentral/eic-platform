import { Component, OnInit } from '@angular/core';
import { Provider } from '../../domain/eic-model';

@Component({
    selector: 'my-service-providers',
    templateUrl: './my-service-providers.component.html'
})
export class MyServiceProvidersComponent implements OnInit {
    errorMessage: string;

    myProviders: Provider[] = [];

    constructor() {}

    ngOnInit() {}

}
