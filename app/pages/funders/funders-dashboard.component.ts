import {Component, OnInit} from "@angular/core";
import {FundersPage} from "../../domain/funders-page";
import {FunderService} from "../../services/funder.service";
import {Funder} from "../../domain/eic-model";


@Component({
    selector: 'funders-dashboard',
    templateUrl: './funders-dashboard.component.html',
    styleUrls: ['./funders-dashboard.component.css']
})

export class FundersDashboardComponent implements OnInit {

    errorMessage: string;
    selected: boolean = false;
    funder: FundersPage;
    selectedFunder: Funder;
    selection: boolean = false;

    chartStats: any[] = [];

    constructor(private funderService: FunderService) {
    }

    ngOnInit(): void {
        this.getAllFunders();
        this.getChartData('all');
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

    getFunder(selection?: Funder) {
        // console.log(selection);
        this.chartStats = [];
        if (selection) {
            // this.selected = true;
            // this.selectedFunder = selection;
            this.getChartData(selection.id);
            // console.log('its a funder!')
            // this.selected = false;
            // this.selectedFunder = null;
        } else {
            // console.log('General stats');
            this.getChartData('all');
            // this.getChartData(this.selectedFunder.id, 2);
        }
        // console.log(this.selectedFunder);
    }

    marcSelection(name: string): boolean {
        if (this.selectedFunder)
            return this.selectedFunder.name == name;
        else return false;
    }

    getChartData(funderId: string) {
        this.funderService.getFunderStats(funderId).map(data => {
            return Object.entries(data).map((key) => {
                Object.entries(key).map((innerKey) => {
                    if (innerKey[1] !== 'NaN') {
                        return {name: innerKey[0], y: innerKey[1]};
                    }
                });
                return key;
            });
        }).subscribe(
            data => {
                for (let i = 0; i < data.length; i++) {
                    let pieChartData: any[] = [];
                    Object.entries(data[i][1]).forEach(entry => {
                        pieChartData.push({name: entry[0], y: entry[1]});
                    });
                    // console.log(pieChartData);
                    // if (data.length > 1)
                    //     this.setChartStats(pieChartData, i + 1, data[i][0]);
                    // else
                        this.setChartStats(pieChartData, i, data[i][0]);
                }
            }
        );
    }

    setChartStats(data: any, position: number, title: string) {
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
                        size: '75%'
                    }
                },
                title: {
                    text: title
                },
                series: [{
                    name: 'Number of funded services',
                    data: data
                }]
            };
        }
    }

}