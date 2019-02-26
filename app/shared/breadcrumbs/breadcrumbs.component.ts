/**
 * Created by stefania on 05/06/2018.
 */
import { AfterViewInit, Component, Input, OnInit } from "@angular/core";
import { AuthenticationService } from "../../services/authentication.service";
import { ActivatedRoute, NavigationEnd, Params, PRIMARY_OUTLET, Router } from "@angular/router";
import { NavigationService } from "../../services/navigation.service";
import {FormBuilder, FormGroup} from "@angular/forms";


interface IBreadcrumb {
    label: string;
    params: Params;
    url: string;
}

@Component({
    selector: "breadcrumbs",
    templateUrl: "./breadcrumbs.component.html",
    styleUrls: ["./breadcrumbs.component.css"],
})
export class BreadcrumbsComponent implements OnInit {

    public breadcrumbs: IBreadcrumb[];
    public goBack : boolean = false;
    readonly ROUTE_DATA_BREADCRUMB: string = "breadcrumb";

    public searchForm: FormGroup;

    /**
     * @class DetailComponent
     * @constructor
     */
    constructor(
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private navigation : NavigationService,
        public fb: FormBuilder
    ) {
        this.breadcrumbs = [];
        this.searchForm = fb.group({"query": [""]});
    }

    onSubmit(searchValue: string) {
        /*let params = Object.assign({},this.activatedRoute.children[0].snapshot.params);
        params['query'] = searchValue.query;*/
        searchValue = searchValue.replace(/[;=]/g, '');
        let url = window.location.href;
        let params:String[] = url.split(';');
        if (params.length > 1) {
            console.log(params.length);
            let query:String[] = params[1].split('=');
            query[1] = searchValue;
            params[1] = query.join('=');
            params = params.slice(1);
            url = params.join(';');
            // console.log(params);
            // console.log(url);
            return window.location.href= "/search;" + url;
        } else {
            return this.navigation.search({query: searchValue});
        }
    }

    /**
     * Let's go!
     *
     * @class DetailComponent
     * @method ngOnInit
     */
    ngOnInit() {
        //subscribe to the NavigationEnd event
        this.handleEvent({});
        this.router.events.filter(event => event instanceof NavigationEnd).subscribe(event => this.handleEvent(event));
        this.navigation.breadcrumbs.subscribe(service => {
            this.breadcrumbs[this.breadcrumbs.length-1].label=service;
        });

        this.navigation.paramsObservable.subscribe(params => {

            if(params!=null) {
                for (let urlParameter of params) {
                    if(urlParameter.key === 'query') {
                        this.searchForm.get('query').setValue(urlParameter.values[0]);
                    }
                }
            } else {
                this.searchForm.get('query').setValue('');
            }

        });
    }

    private handleEvent(event : any) {
        let root: ActivatedRoute = this.activatedRoute.root;
        let breadcrumbs = [];
        let breadcrumb: IBreadcrumb = {
            label: 'Home',
            params: {},
            url: "/home"
        };
        breadcrumbs.push(breadcrumb);
        this.breadcrumbs = this.getBreadcrumbs(root,"",breadcrumbs);
        this.goBack = !!this.breadcrumbs.find(v => v.label == 'Compare');
    }

    /**
     * Returns array of IBreadcrumb objects that represent the breadcrumb
     *
     * @class DetailComponent
     * @method getBreadcrumbs
     * @param {ActivateRoute} route
     * @param {string} url
     * @param {IBreadcrumb[]} breadcrumbs
     */
    private getBreadcrumbs(route: ActivatedRoute, url: string="", breadcrumbs: IBreadcrumb[]=[]): IBreadcrumb[] {
        const ROUTE_DATA_BREADCRUMB: string = "breadcrumb";

        //get the child routes
        let children: ActivatedRoute[] = route.children;
        // console.log(children,url,breadcrumbs);
        //return if there are no more children
        if (children.length === 0) {
            return breadcrumbs;
        }

        //iterate over each children
        for (let child of children) {
            // console.log("children",child);
            //verify primary route
            if (child.outlet !== PRIMARY_OUTLET) {
                continue;
            }

            //verify the custom data property "breadcrumb" is specified on the route
            if (!child.snapshot.data.hasOwnProperty(ROUTE_DATA_BREADCRUMB)) {
                return this.getBreadcrumbs(child, url, breadcrumbs);
            } else {
                // console.log("if",child.snapshot);
            }

            //get the route's URL segment
            // console.log(child.snapshot.url);
            let routeURL: string = child.snapshot.url.map(segment => segment.path).join("/");
            // let routeURL: string = child.snapshot.url[0].path;
            //append route URL to URL
            url += `/${routeURL}`;

            //add breadcrumb
            let breadcrumb: IBreadcrumb = {
                label: child.snapshot.data[ROUTE_DATA_BREADCRUMB],
                params: child.snapshot.params,
                url: url
            };
            // console.log(breadcrumb);
            breadcrumbs.push(breadcrumb);

            //recursive
            return this.getBreadcrumbs(child, url, breadcrumbs);
        }
    }
}
