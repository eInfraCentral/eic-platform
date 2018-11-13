/**
 * Created by stefania on 7/5/16.
 */
import {Component, OnInit} from "@angular/core";
import {FormBuilder, FormGroup} from "@angular/forms";
import { Service, Vocabulary } from "../../domain/eic-model";
import {SearchQuery} from "../../domain/search-query";
import {NavigationService} from "../../services/navigation.service";
import {ResourceService} from "../../services/resource.service";
import {SearchResults} from "../../domain/search-results";

@Component({
    selector: "home",
    templateUrl: "./home.component.html",
    styleUrls: ["./home.component.css"]
})
export class HomeComponent implements OnInit {

    public searchForm: FormGroup;
    public categoriesResults: SearchResults<Vocabulary> = null;
    public categories: Vocabulary = null;
    public baseIconURI = "./assets/images/icons/";

    public featuredServices: Service[];

    slides = [
        {img: "http://placehold.it/350x150/000000"},
        {img: "http://placehold.it/350x150/111111"},
        {img: "http://placehold.it/350x150/333333"},
        {img: "http://placehold.it/350x150/666666"}
    ];
    slideConfig = {"slidesToShow": 3, "slidesToScroll": 3};

    constructor(public fb: FormBuilder, public router: NavigationService, public resourceService: ResourceService) {
        this.searchForm = fb.group({"query": [""]});
    }

    ngOnInit() {

        this.resourceService.getVocabulariesByType("CATEGORIES").subscribe(
            suc => {
                this.categoriesResults = suc;
                this.categories = this.categoriesResults.results[0];
            }
        );

        // this.resourceService.getVocabulariesRaw("Category").subscribe(suc => {
        //     this.categories = suc.results
        //     .map(e => Object.assign(e, {extras: e.extras || ["no_icon.svg", "no_icon.svg"]}))
        //     .filter(e => e.id !== "Category-Other" && e.extras && e.extras.length && e.extras.length === 2);
        // });

        this.resourceService.getFeaturedServices().subscribe(
            res => {this.featuredServices = res})
    }

    onSubmit(searchValue: SearchQuery) {
        return this.router.search({query: searchValue.query});
    }

    addSlide() {
        this.slides.push({img: "http://placehold.it/350x150/777777"})
    }

    removeSlide() {
        this.slides.length = this.slides.length - 1;
    }

    afterChange(e) {
        console.log('afterChange');
    }

    signUpAndRegisterAservice() {
        sessionStorage.setItem('forward_url', '/newServiceProvider');
        this.router.router.navigateByUrl('/newServiceProvider');
    }
}

