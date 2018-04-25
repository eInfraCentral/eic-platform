
import {NgModule} from "@angular/core";
import {JoinPipe} from "./pipes/join.pipe";
import {KeysPipe} from "./pipes/keys.pipe";
import {LookUpPipe} from "./pipes/lookup.pipe";
import {PremiumSortPipe} from "./pipes/premium-sort.pipe";
import {SafePipe} from "./pipes/safe.pipe";

@NgModule({
    imports: [],
    declarations: [
        JoinPipe,
        KeysPipe,
        LookUpPipe,
        PremiumSortPipe,
        SafePipe
    ],
    exports: [
        JoinPipe,
        KeysPipe,
        LookUpPipe,
        PremiumSortPipe,
        SafePipe
    ]
})
export class SharedModule {
}
