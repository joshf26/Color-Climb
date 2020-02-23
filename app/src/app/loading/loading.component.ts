import {Component} from '@angular/core';
import { ActivityIndicator } from "tns-core-modules/ui/activity-indicator";
import { EventData } from "tns-core-modules/data/observable";


@Component({
    selector: "Loading",
    templateUrl: "./loading.component.html",
})
export class LoadingComponent {
    isBusy: boolean = true;

    // onBusyChanged(args: EventData) {
    //     let indicator: ActivityIndicator = <ActivityIndicator>args.object;
    //     console.log("indicator.busy changed to: " + indicator.busy);
    // }
}
