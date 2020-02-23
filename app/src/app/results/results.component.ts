import {Component} from '@angular/core';
import {Hold, HoldFinderService} from "~/app/holdfinder/holdfinder.service";

@Component({
    selector: "Results",
    templateUrl: "./results.component.html",
})
export class ResultsComponent {
    public holds: Hold[] = [];

    constructor(
        private holdFinderService: HoldFinderService,
    ) {
        console.log('########### Constructing');
        for (const hold of this.holdFinderService.holds) {
            console.log('########### Pushing');
            this.holds.push(hold);
        }
    }
}
