/**
 * Created by stefania on 15/11/2018.
 */
import {Component} from "@angular/core";
import {SearchQuery} from "../../domain/search-query";
import {NavigationService} from "../../services/navigation.service";

@Component({
    selector: "become-a-provider",
    templateUrl: "./become-a-provider.component.html",
    styleUrls: ["./become-a-provider.component.css"]
})
export class BecomeAProviderComponent {

    constructor(public router: NavigationService) {
    }

    onSubmit(searchValue: SearchQuery) {
        return this.router.search({query: searchValue.query});
    }

    signUpAndRegisterAservice() {
        sessionStorage.setItem('forward_url', '/newServiceProvider');
        this.router.router.navigateByUrl('/newServiceProvider');
    }
}

