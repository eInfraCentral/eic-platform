
import {Injectable} from "@angular/core";
import {NavigationService} from "./navigation.service";

declare var UIkit;

@Injectable()
export class ComparisonService {

    public servicesToCompare: string[] = [];

    constructor(public router: NavigationService) {
        this.servicesToCompare = JSON.parse(sessionStorage.getItem("compareServices") || "[]");
    }

    addOrRemove(id: string, go: boolean) {
        let idx = this.servicesToCompare.indexOf(id);
        if (idx > -1) {
            this.servicesToCompare.splice(idx, 1);
            sessionStorage.setItem("compareServices", JSON.stringify(this.servicesToCompare));
        } else {
            if (this.servicesToCompare.length == 3) {
                UIkit.notification({
                                       message: "You have reached the maximum number of items you can compare",
                                       status: "primary",
                                       pos: "top-center",
                                       timeout: 5000
                                   });
            } else {
                this.servicesToCompare.push(id);
                sessionStorage.setItem("compareServices", JSON.stringify(this.servicesToCompare));
            }
        }
        if (go) {
            return this.go();
        }
    }

    go() {
        if (this.servicesToCompare.length > 1) {
            return this.router.compare({services: this.servicesToCompare.toString()});
        } else {
            this.router.search({});
        }
    }
}
