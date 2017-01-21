/**
 * Created by stefania on 10/3/16.
 */
import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Component({
    selector: 'openminted-platform',
    templateUrl: 'app/app.component.html',
})

export class AppComponent implements OnInit {

    constructor(private router: Router) { }

    ngOnInit() {
        this.router.events.subscribe((evt) => {
            if (!(evt instanceof NavigationEnd)) {
                return;
            }
            window.scrollTo(0,0);
        });
    }
}