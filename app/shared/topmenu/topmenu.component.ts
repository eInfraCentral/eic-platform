/**
 * Created by stefania on 7/5/16.
 */
import {
    Component, DoCheck, ElementRef, OnChanges, OnDestroy, OnInit, Renderer2, SimpleChanges, ViewChild,
    ViewEncapsulation
} from "@angular/core";
import {AuthenticationService} from "../../services/authentication.service";
import { ActivatedRoute, Router } from "@angular/router";
import { FormBuilder, FormGroup } from "@angular/forms";
import { SearchQuery } from "../../domain/search-query";
import { NavigationService } from "../../services/navigation.service";
import { Subscription } from "rxjs/Subscription";
import { URLParameter } from "../../domain/url-parameter";
import {equal} from "assert";

@Component({
    selector: "top-menu",
    templateUrl: "./topmenu.component.html",
    styleUrls: ["./topmenu.component.css"],
    encapsulation: ViewEncapsulation.None
})
export class TopMenuComponent implements OnInit, OnDestroy {

    private sub: Subscription;
    public searchForm: FormGroup;

    urlParameters: URLParameter[] = [];
    //
    @ViewChild('categoriesDropdown') categoriesDropdown: ElementRef;
    // @ViewChild('supportDropdown') supportDropdown: ElementRef;

    categoriesOpen: boolean = false;
    supportOpen: boolean = false;

    constructor(public authenticationService: AuthenticationService, private renderer: Renderer2,
                public router: Router, public fb: FormBuilder, public navigationService: NavigationService,
                private activatedRoute: ActivatedRoute) {
        this.searchForm = fb.group({"query": [""]});
    }

    onSubmit(searchValue: string) {
        /*let params = Object.assign({},this.activatedRoute.children[0].snapshot.params);
        params['query'] = searchValue.query;*/
        return this.navigationService.search({query: searchValue});
    }

    ngOnInit(): void {
        this.isLoggedIn();
        this.getUsername();
        this.getUsersurname();

        this.navigationService.paramsObservable.subscribe(params => {

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

    ngOnDestroy(): void {
        if (this.authenticationService.isLoggedIn()) {
            this.sub.unsubscribe();
        }
    }

    goToLoginAAI(): void {
        this.authenticationService.login();
    }

    isLoggedIn() {
        return this.authenticationService.isLoggedIn();
    }

    getUsername() {
        if (this.authenticationService.isLoggedIn()) {
            return this.authenticationService.getUserProperty('given_name');
        }
    }

    getUsersurname() {
        if (this.authenticationService.isLoggedIn()) {
            return this.authenticationService.getUserProperty('family_name');
        }
    }

    isProvider() {
        return this.authenticationService.getUserProperty('roles').some(x => x === "ROLE_PROVIDER");
    }

    isAdmin() {
        return this.authenticationService.getUserProperty('roles').some(x => x === "ROLE_ADMIN");
    }

    // ngDoCheck(): void {
    //     if (this.categoriesDropdown.nativeElement.classList.contains("uk-open")) {
    //         console.log("it is open");
    //     } else {
    //         console.log("it is closed");
    //     }
    // }

    // ngOnInit() {
    //     console.log(this.router.url);
    //     //using selectRootElement instead of depreaced invokeElementMethod
    //     //this.categoriesDropdown.nativeElement.subscribe(console.log("aaaa"))
    //     //this.renderer.selectRootElement(this.categoriesDropdown["nativeElement"]).
    //     //this.renderer.selectRootElement(this.categoriesDropdown["nativeElement"]).onHover.subscribe(console.log("hover"));
    //     // this.renderer.selectRootElement(this.categoriesDropdown["nativeElement"]).focus();
    // }

    // onChangeOpen(event: any) {
    //     console.log(event);
    // }

    // openDropdown(id: string) {
    //     if(id=='categories')
    //         this.categoriesOpen = true;
    //     if(id=='support')
    //         this.supportOpen = true;
    // }
    //
    // closeDropdown(id: string) {
    //     if(id=='categories')
    //         this.categoriesOpen = false;
    //     if(id=='support')
    //         this.supportOpen = false;
    // }

    onClick(id: string) {
        var el: HTMLElement = document.getElementById(id);
        el.classList.remove("uk-open");
    }
}