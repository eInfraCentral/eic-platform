
import {Component, OnInit} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import * as util from "util";

@Component({
    selector: "developers",
    templateUrl: "./developers.component.html",
    styleUrls: ["./developers.component.css"]
})
export class DevelopersComponent implements OnInit {

    constructor(private route: ActivatedRoute) {
    }

    ngOnInit() {
        this.route.fragment.subscribe(fragment => this.scrollTo("#" + fragment));
    }

    scrollTo(selector: string) {
        let element = document.querySelector(selector);
        if (element) {
            element.scrollIntoView(element);
        }
    }

    getModifiedURL(p) {
        return util.format("%s//%s%s", window.location.protocol, window.location.hostname, p != null ? ":" + p : "");
    }
}