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
        for (const hold of this.holdFinderService.holds) {
            this.holds.push(hold);
        }
    }
}
