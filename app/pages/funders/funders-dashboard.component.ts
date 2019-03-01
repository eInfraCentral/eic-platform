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

    constructor(private funderService: FunderService) {}

    ngOnInit(): void {
        this.getAllFunders();
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
        }
        // console.log(this.selectedFunder);
    }

    marckSelection(name: string) :boolean {
        if (this.selectedFunder)
            return this.selectedFunder.name == name;
        else return false;
    }

}