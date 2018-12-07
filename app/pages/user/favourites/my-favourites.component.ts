import {Component, OnInit} from "@angular/core";
import {UserService} from "../../../services/user.service";
import {BrowseResults} from "../../../domain/browse-results";

@Component({
    selector: "user-favorites",
    templateUrl: "./my-favourites.component.html"
})

export class MyFavouritesComponent implements OnInit {

    public favorites: BrowseResults;

    constructor(
        private userServices: UserService
    ) {}

    ngOnInit(): void {

    }

    getFavorites() {
        this.userServices.getFavouritesOfUser().subscribe(

        );
    }
}