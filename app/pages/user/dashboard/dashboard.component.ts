import { Component, OnInit } from "@angular/core";
import { Service } from "../../../domain/eic-model";
import { AuthenticationService } from "../../../services/authentication.service";
import { NavigationService } from "../../../services/navigation.service";
import { ResourceService } from "../../../services/resource.service";
import { UserService } from "../../../services/user.service";

declare var require: any;

@Component({
    selector: "dashboard",
    templateUrl: "./dashboard.component.html",
    styleUrls: ["./dashboard.component.css"]
})
export class DashboardComponent implements OnInit {
    provider: string;
    providerServices: Service[] = [];
    providerServicesGroupedByPlace: any;
    providerCoverage: string[];
    public errorMessage: string;

    public EU: string[];
    public WW: string[];

    providerVisitsOptions : any = null;
    providerRatingsOptions: any = null;
    providerFavouritesOptions: any = null;
    providerVisitationPercentageOptions: any = null;
    providerMapOptions: any = null;

    constructor(public authenticationService: AuthenticationService, public userService: UserService,
                public resourceService: ResourceService, public router: NavigationService) {
   }

    ngOnInit() {
        Observable.zip(
            this.resourceService.getEU(),
            this.resourceService.getWW(),
            this.resourceService.getProviders()
        ).subscribe(suc => {
            this.EU = suc[0];
            this.WW = suc[1];
            for (let provider in suc[2]) {
                if (this.authenticationService.user.email === provider + "@eic") {
                    //eventually manager/provider/aai should provide the relevant info,
                    // but for now, we just check if user's email=provider+eic
                    this.provider = provider;
                }
            }
            this.getDataForProvider(this.provider);
        });
    }

    getDataForProvider(provider) {

        this.resourceService.getServicesOfferedByProvider(provider)
        .subscribe(res => {
            this.providerServices = res;
            this.providerServicesGroupedByPlace = this.groupServicesOfProviderPerPlace(this.providerServices);
            this.providerCoverage = Object.keys(this.providerServicesGroupedByPlace);

            this.setCountriesForProvider(this.providerCoverage);
        });

        this.resourceService.getVisitsForProvider(this.provider).map(data => {
            //THESE 3 weird lines should be deleted when pgl makes everything ok :)
            return Object.entries(data).map((d) => {
                return [new Date(d[0]).getTime(),d[1]];
            }).sort((l,r)=>{return l[0] - r[0]});
        }).subscribe(
            data => this.setVisitsForProvider(data),
            // error => this.handleError(<any>error)
        );

        this.resourceService.getFavouritesForProvider(this.provider).map(data => {
            //THESE 3 weird lines should be deleted when pgl makes everything ok :)
            return Object.entries(data).map((d) => {
                return [new Date(d[0]).getTime(),d[1]];
            }).sort((l,r)=>{return l[0] - r[0]});
        }).subscribe(
            data => this.setFavouritesForProvider(data),
            // error => this.handleError(<any>error)
        );

        this.resourceService.getRatingsForProvider(this.provider).map(data => {
            //THESE 3 weird lines should be deleted when pgl makes everything ok :)
            return Object.entries(data).map((d) => {
                return [new Date(d[0]).getTime(),d[1]];
            }).sort((l,r)=>{return l[0] - r[0]});
        }).subscribe(
            data => this.setRatingsForProvider(data),
            // error => this.handleError(<any>error)
        );

        this.resourceService.getVisitationPercentageForProvider(this.provider).map(data => {
            //THESE 3 weird lines should be deleted when pgl makes everything ok :)
            return Object.entries(data).map((d) => {
                return {name : d[0], y : d[1]};
            });
        }).subscribe(
            data => this.setVisitationsForProvider(data),
            // error => this.handleError(<any>error)
        );

        // console.log('Places', this.resourceService.getPlacesForProvider(this.provider));

    }

    groupServicesOfProviderPerPlace(services: Service[]) {
        let ret = {};
        for (let service of services) {
            for (let place of service.places) {
                if (ret[place]) {
                    ret[place].push(this.providerServices);
                } else {
                    ret[place] = [];
                }
            }
        }
        return ret;
    }

    goToServiceDashboard(id: string) {
        return this.router.dashboard(id);
    }

    setVisitsForProvider(data : any) {

        this.providerVisitsOptions = {
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
                data: data
            }]
        };
    }

    setFavouritesForProvider(data : any) {

        this.providerFavouritesOptions = {
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
                color: '#C72B28',
                data: data
            }]
        };
    }

    setRatingsForProvider(data : any) {

        this.providerRatingsOptions = {
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
                name: 'Average ratings over time',
                color: '#013203',
                data: data
            }]
        };
    }

    setVisitationsForProvider(data : any) {

        this.providerVisitationPercentageOptions = {
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                type: 'pie'
            },
            title:{
                text:''
            },
            // xAxis: {
            //     type: 'datetime',
            //     dateTimeLabelFormats: { // don't display the dummy year
            //         month: '%e. %b',
            //         year: '%b'
            //     },
            //     title: {
            //         text: 'Date'
            //     }
            // },
            // yAxis: {
            //     title: {
            //         text: 'Number of visits'
            //     }
            // },
            series: [{
                name: "Services' visitation percentage",
                data: data
            }]
        };
    }

    setCountriesForProvider(data: any) {
        let places = this.resourceService.expandRegion(JSON.parse(JSON.stringify(data || [])), this.EU, this.WW);

        this.providerMapOptions = {
            chart: {
                map: 'custom/europe',
                // borderWidth: 1
            },
            title: {
                text: 'Countries serviced by ' + this.provider
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
}
