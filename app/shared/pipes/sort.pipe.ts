/**
 * Created by spyroukostas on 27/6/18.
 */

import {Pipe, PipeTransform} from "@angular/core";


@Pipe({
    name: "sort"
})
export class StringArraySortPipe implements PipeTransform {
    transform(array: Array<String>, args: string): Array<String> {
        array.sort((a: any, b: any) => {
            if (a < b) {
                return -1;
            } else if (a > b) {
                return 1;
            } else {
                return 0;
            }
        });
        return array;
    }
}
