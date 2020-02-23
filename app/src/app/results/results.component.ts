import {Component} from '@angular/core';
import {Hold} from "~/app/holdfinder/holdfinder.service";

@Component({
    selector: "Results",
    templateUrl: "./results.component.html",
})
export class ResultsComponent {
    private holds: Hold[] = [];

    public setResults(holds: Hold[]) {
        console.log('############## Holds set.');
        this.holds = holds;
        console.log(`############# ${holds}`);
    }

}
