import {Component, OnInit} from "@angular/core";
import {FundersPage} from "../../domain/funders-page";
import {FunderService} from "../../services/funder.service";
import {Funder} from "../../domain/eic-model";


@Component({
    selector: 'funders-dashboard',
    templateUrl: './funders-dashboard.component.html',
    styleUrls: ['./funders-dashboard.component.css']
})

export class FundersDashboardComponent implements OnInit{

    errorMessage: string;
    selected: boolean = false;
    funder: FundersPage;
    selectedFunder: Funder;
    selection: boolean = false;

    chartStats: any[] = [];
    generalFunderServiceStats: any = null;
    funderCategoryChart: any = null;
    funderTrlChart: any = null;
    providerChart3: any = null;
    providerChart4: any = null;
    providerChart5: any = null;
    providerChart6: any = null;

    constructor(private funderService: FunderService) {}

    ngOnInit(): void {
        this.getAllFunders();
        this.getChartData('all', 'services', 0);
    }

    getAllFunders() {
        let quantity = '10000';
        this.funderService.getAllFunders(quantity).subscribe(
            res => this.funder = res,
            err => {
                this.errorMessage = 'Something went wrong';
                console.log(err);
            }
        );
    }

    getFunder(selection: Funder) {
        // console.log(selection);
        if (selection == this.selectedFunder) {
            this.selected = false;
            this.selectedFunder = null;
        } else {
            this.selected = true;
            this.selectedFunder = selection;
            this.getChartData(this.selectedFunder.id, 'category', 1);
            this.getChartData(this.selectedFunder.id, 'trl', 2);
        }
        // console.log(this.selectedFunder);
    }

    marcSelection(name: string) :boolean {
        if (this.selectedFunder)
            return this.selectedFunder.name == name;
        else return false;
    }

    // getServiceChartData(funderId: string, field: string) {
    //     this.funderService.getFunderStats(funderId, field).map(data => {
    //         return Object.entries(data).map((d) => {
    //             if (d[1] !== 'NaN') {
    //                 return {name: d[0], y: d[1]};
    //             }
    //         });
    //     }).subscribe(
    //         data => {
    //             console.log(data);
    //             this.setGeneralStatsForProvider(data);
    //         }
    //     );
    // }

    getChartData(funderId: string, field: string, arrayPosition: number) {
        this.funderService.getFunderStats(funderId, field).map(data => {
            return Object.entries(data).map((d) => {
                if (d[1] !== 'NaN') {
                    return {name: d[0], y: d[1]};
                }
            });
        }).subscribe(
            data => {
                console.log(data);
                this.setChartStats(data, arrayPosition);
            }
        );
    }

    getDataForProvider() {

    }

    // setGeneralStatsForProvider(data : any) {
    //     if (data) {
    //         this.generalFunderServiceStats = {
    //             chart: {
    //                 plotBackgroundColor: null,
    //                 plotBorderWidth: null,
    //                 plotShadow: false,
    //                 type: 'pie'
    //             },
    //             title:{
    //                 text:''
    //             },
    //             series: [{
    //                 name: "Number of funded services",
    //                 data: data
    //             }]
    //         };
    //     }
    // }

    setChartStats(data: any, position: number) {
        if (data) {
            this.chartStats[position] = {
                chart: {
                    plotBackgroundColor: null,
                    plotBorderWidth: null,
                    plotShadow: false,
                    type: 'pie'
                },
                plotOptions: {
                    pie: {
                        size: '80%'
                    }
                },
                title:{
                    text:''
                },
                series: [{
                    name: "Services' visitation percentage",
                    data: data
                }]
            };
        }
    }

}