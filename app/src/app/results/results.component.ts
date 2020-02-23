import {Component} from '@angular/core';
import {Hold, HoldFinderService} from "~/app/holdfinder/holdfinder.service";
import {ImageAsset} from 'tns-core-modules/image-asset/image-asset';

@Component({
    selector: "Results",
    templateUrl: "./results.component.html",
})
export class ResultsComponent {
    public holds: Hold[] = [];
    public originalImage: ImageAsset;

    constructor(
        private holdFinderService: HoldFinderService,
    ) {
        for (const hold of this.holdFinderService.holds) {
            this.holds.push(hold);
        }

        this.originalImage = this.holdFinderService.originalImage;
    }
}
