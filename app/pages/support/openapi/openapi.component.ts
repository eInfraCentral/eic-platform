
import {Component} from "@angular/core";
import {API_ENDPOINT} from "../../../shared/environments";

@Component({
    selector: "openapi",
    templateUrl: "./openapi.component.html",
    styleUrls: ["./openapi.component.css"]
})
export class OpenAPIComponent {

    //use this for now
    getUI() {
        return `${API_ENDPOINT}/swagger-ui.html`;
    }

    //this needs consuming code/libraries; too much effort, not agile enough
    getJSON() {
        return `${API_ENDPOINT}/v2/api-docs`;
    }
}
