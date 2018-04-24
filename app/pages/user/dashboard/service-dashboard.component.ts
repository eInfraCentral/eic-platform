/**
 * Created by stefania on 1/9/18.
 */
import {Component, OnInit} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {Subscription} from "rxjs/Subscription";
import {Service} from "../../../domain/eic-model";
import {AuthenticationService} from "../../../services/authentication.service";
import {NavigationService} from "../../../services/navigation.service";
import {ResourceService} from "../../../services/resource.service";
import {UserService} from "../../../services/user.service";

@Component({
    selector: "service-dashboard",
    templateUrl: "./service-dashboard.component.html",
    styleUrls: ["./service-dashboard.component.css"]
})
export class ServiceDashboardComponent implements OnInit {

    public service: Service;
    public errorMessage: string;
    private sub: Subscription;

    public EU: string[];

    serviceVisitsOptions : any = null;
    serviceRatingsOptions: any = null;
    serviceFavouritesOptions: any = null;
    serviceMapOptions: any = null;

    constructor(private route: ActivatedRoute, private router: NavigationService, private resourceService: ResourceService,
                private authenticationService: AuthenticationService, private userService: UserService) {
    }

    ngOnInit() {
        this.sub = this.route.params.subscribe(params => {
            this.resourceService.getService(params["id"]).subscribe(
                service => {
                    this.service = service;
                    this.resourceService.getEU().subscribe(
                        data => {
                            this.EU = data;
                            return this.getDataForService(service);
                        }
                    );
                },
                error => this.handleError(<any>error));
        });
    }

    getDataForService(service) {

        this.setCountriesForService(this.service.places);

        this.resourceService.getVisitsForService(this.service.id).map(data => {

            console.log('Visits' , data);
            //THESE 3 weird lines should be deleted when pgl makes everything ok :)
            return Object.entries(data).map((d) => {
                return [new Date(d[0]).getTime(),d[1]];
            }).sort((l,r)=>{return l[0] - r[0]});
        }).subscribe(
            data => this.setVisitsForService(data),
            // error => this.handleError(<any>error)
        );

        this.resourceService.getFavouritesForService(this.service.id).map(data => {

            console.log('Favourites' , data);
            //THESE 3 weird lines should be deleted when pgl makes everything ok :)
            return Object.entries(data).map((d) => {
                return [new Date(d[0]).getTime(),d[1]];
            }).sort((l,r)=>{return l[0] - r[0]});
        }).subscribe(
            data => this.setFavouritesForService(data),
            // error => this.handleError(<any>error)
        );

        this.resourceService.getRatingsForService(this.service.id).map(data => {
            console.log('Ratings' , data);
            //THESE 3 weird lines should be deleted when pgl makes everything ok :)
            return Object.entries(data).map((d) => {
                return [new Date(d[0]).getTime(),d[1]];
            }).sort((l,r)=>{return l[0] - r[0]});
        }).subscribe(
            data => this.setRatingsForService(data),
            // error => this.handleError(<any>error)
        );
    }

    setVisitsForService(data : any) {

        this.serviceVisitsOptions = {
            title:{
                text:''
            },
            xAxis: {
                type: 'datetime',
                dateTimeLabelFormats: { // don't display the dummy year
                    month: '%e. %b',
                    year: '%b'
                },
                title: {
                    text: 'Date'
                }
            },
            yAxis: {
                title: {
                    text: 'Number of visits'
                }
            },
            series: [{
                name: 'Visits over time',
                color: '#036166',
                data: data
            }]
        };
    }

    setFavouritesForService(data : any) {

        this.serviceFavouritesOptions = {
            title:{
                text:''
            },
            xAxis: {
                type: 'datetime',
                dateTimeLabelFormats: { // don't display the dummy year
                    month: '%e. %b',
                    year: '%b'
                },
                title: {
                    text: 'Date'
                }
            },
            yAxis: {
                title: {
                    text: 'Number of favourites'
                }
            },
            series: [{
                name: 'Favourites over time',
                color: '#C36000',
                data: data
            }]
        };
    }

    setRatingsForService(data : any) {

        this.serviceRatingsOptions = {
            title:{
                text:''
            },
            xAxis: {
                type: 'datetime',
                dateTimeLabelFormats: { // don't display the dummy year
                    month: '%e. %b',
                    year: '%b'
                },
                title: {
                    text: 'Date'
                }
            },
            yAxis: {
                title: {
                    text: 'Average rating'
                }
            },
            series: [{
                name: 'Average rating over time',
                color: '#6B0035',
                data: data
            }]
        };
    }

    setCountriesForService(data : any) {

        let places = JSON.parse(JSON.stringify(data || []));
        let iEU = places.indexOf("EU");
        if (iEU > -1) {
            places.splice(iEU, 1);
            places.push(...this.EU);
        }

        this.serviceMapOptions = {
            chart: {
                map: 'custom/europe',
                // borderWidth: 1
            },
            title: {
                text: 'Countries serviced by ' + this.service.name
            },
            // subtitle: {
            //     text: 'Demo of drawing all areas in the map, only highlighting partial data'
            // },
            legend: {
                enabled: false
            },
            series: [{
                name: 'Country',
                data: places.map(e => e.toLowerCase()).map(e => [e, 1]),
                dataLabels: {
                    enabled: true,
                    color: '#FFFFFF',
                    formatter: function () {
                        if (this.point.value) {
                            return this.point.name;
                        }
                    }
                },
                tooltip: {
                    headerFormat: '',
                    pointFormat: '{point.name}'
                }
            }]
        };
    }

    ngOnDestroy(): void {
        this.sub.unsubscribe();
    }

    handleError(error) {
        this.errorMessage = "System error retrieving service (Server responded: " + error + ")";
    }
}