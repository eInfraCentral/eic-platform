
import {Pipe, PipeTransform} from "@angular/core";

@Pipe({name: "lookup"})
export class LookUpPipe implements PipeTransform {
    transform(keys: any[], dictionary: any): any {
        return (keys || []).map(e => dictionary[e] || e);
    }
}
