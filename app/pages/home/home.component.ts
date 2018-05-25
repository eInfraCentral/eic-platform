/**
 * Created by stefania on 7/5/16.
 */
import {Component, OnInit} from "@angular/core";
import {FormBuilder, FormGroup} from "@angular/forms";
import {Vocabulary} from "../../domain/eic-model";
import {SearchQuery} from "../../domain/search-query";
import {NavigationService} from "../../services/navigation.service";
import {ResourceService} from "../../services/resource.service";

@Component({
    selector: "home",
    templateUrl: "./home.component.html",
    styleUrls: ["./home.component.css"]
})
export class HomeComponent implements OnInit {
    public searchForm: FormGroup;
    public categories: Vocabulary[];
    public baseIconURI = "./imgs/Icons/";

    constructor(public fb: FormBuilder, public router: NavigationService, public resourceService: ResourceService) {
        this.searchForm = fb.group({"query": [""]});
    }

    ngOnInit() {
        this.resourceService.getVocabulariesRaw("Category").subscribe(suc => {
            this.categories = suc.results
            .map(e => Object.assign(e, {extras: e.extras || ["no_icon.svg", "no_icon.svg"]}))
            .filter(e => e.id !== "Category-Other" && e.extras && e.extras.length && e.extras.length === 2);
        });
    }

    onSubmit(searchValue: SearchQuery) {
        return this.router.search({query: searchValue.query});
    }
}

