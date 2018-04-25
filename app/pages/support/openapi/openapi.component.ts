
import {Component} from "@angular/core";

@Component({
    selector: "openapi",
    templateUrl: "./openapi.component.html",
    styleUrls: ["./openapi.component.css"]
})
export class OpenAPIComponent {

    //use this for now
    getUI() {
        return `${process.env.API_ENDPOINT}/swagger-ui.html`;
    }

    //this needs consuming code/libraries; too much effort, not agile enough
    getJSON() {
        return `${process.env.API_ENDPOINT}/v2/api-docs`;
    }
}
