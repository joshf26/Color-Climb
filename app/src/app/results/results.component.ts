import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import {Hold, HoldFinderService, ImageInfo} from "~/app/holdfinder/holdfinder.service";
import {ImageAsset} from 'tns-core-modules/image-asset/image-asset';

@Component({
    selector: "Results",
    templateUrl: "./results.component.html",
})
export class ResultsComponent implements AfterViewInit {
    @ViewChild('layout', {static: false}) public layout: ElementRef;

    public holds: {[key: number]: Hold[]} = {};
    public holdsKeys: string[] = [];
    public originalImage: ImageAsset;
    public originalImageInfo: ImageInfo;
    public routeId: string;
    // public layoutWidth: number;
    // public layoutHeight: number;

    constructor(
        private holdFinderService: HoldFinderService,
    ) {
        console.log(`Here and list has len ${this.holdFinderService.holds.length}`);
        for (const hold of this.holdFinderService.holds) {
            console.log(`##### ${hold}`);
            if (hold.routeId in this.holds) {
                this.holds[hold.routeId].push(hold);
            } else {
                this.holds[hold.routeId] = [hold];
            }
        }

        this.holdsKeys = Object.keys(this.holds);
        this.routeId = this.holdsKeys[0];

        this.originalImage = this.holdFinderService.originalImage;
        this.originalImageInfo = this.holdFinderService.originalImageInfo;
    }

    ngAfterViewInit() {
        // this.layoutHeight = this.layout.nativeElement.getActualSize().height;
        // this.layoutWidth = this.layout.nativeElement.getActualSize().width;
    }
}
