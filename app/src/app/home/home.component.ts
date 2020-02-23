import {Component} from '@angular/core';
import * as camera from 'nativescript-camera';
import {alert} from 'tns-core-modules/ui/dialogs';
import {ImageAsset} from 'tns-core-modules/image-asset/image-asset'
import {Hold, HoldFinderService, Pixel, Image} from '~/app/holdfinder/holdfinder.service';
import {isAndroid} from 'tns-core-modules/platform';
import {Router} from "@angular/router";
import {ResultsComponent} from "~/app/results/results.component"

declare var android: any;
declare var PHImageManager: any;
declare var PHImageRequestOptions: any;
declare var PHImageRequestOptionsResizeMode: any;
declare var PHImageRequestOptionsDeliveryModeHighQualityFormat: any;
declare var PHImageContentModeAspectFill: any;
declare var CGDataProviderCopyData: any;
declare var CGImageGetDataProvider: any;
declare var CFDataGetBytePtr: any;

type UIImage = any;

const SCALE_DOWN_FACTOR = 50;

@Component({
    selector: 'Home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css'],
})
export class HomeComponent {
    titleTop: string = 'Color';
    titleBottom: string = 'Climb';
    waitTitle: string = 'Calculating';
    waitTitleBottom: string = 'Results'
    isVisible: boolean = false;

    constructor(
        private holdFinderService: HoldFinderService,
        private router: Router,
        private resultsComponent: ResultsComponent,
    ) {
        this.processImageIOS = this.processImageIOS.bind(this);
        this.getUIImagePixel = this.getUIImagePixel.bind(this);
    }

    private iOSImageData: any = null;

    private getUIImagePixel(image: UIImage, x: number, y: number): Pixel {
        if (this.iOSImageData == null) {
            this.iOSImageData = CFDataGetBytePtr(CGDataProviderCopyData(CGImageGetDataProvider(image.CGImage)));
        }

        const pixelInfo = ((image.size.width * x) + y) * 4;

        return new Pixel(
            this.iOSImageData[pixelInfo],
            this.iOSImageData[pixelInfo + 1],
            this.iOSImageData[pixelInfo + 2],
        );
    }

    private async processImageAndroid(imageAsset: ImageAsset): Promise<Image> {
        const bitmap = android.graphics.BitmapFactory.decodeFile(imageAsset.android, null);
        const width = bitmap.getWidth();
        const height = bitmap.getHeight();

        const image: Pixel[][] = [];
        for (let x = 0; x < width; x += SCALE_DOWN_FACTOR) {
            const row: Pixel[] = [];
            for (let y = 0; y < height; y += SCALE_DOWN_FACTOR) {
                row.push(bitmap.getColor(x, y));
            }
            image.push(row);
        }

        return image;
    }

    private async processImageIOS(imageAsset: ImageAsset): Promise<Image> {
        return new Promise<Image>((success, error) => {
            let manager = PHImageManager.defaultManager();
            let options = new PHImageRequestOptions();
            options.resizeMode = PHImageRequestOptionsResizeMode.Exact;
            options.deliveryMode = PHImageRequestOptionsDeliveryModeHighQualityFormat;

            manager.requestImageForAssetTargetSizeContentModeOptionsResultHandler(
                imageAsset.ios,
                {width: 2048, height: 1536},
                PHImageContentModeAspectFill,
                options,
                (result: UIImage, info) => {
                    const image: Pixel[][] = [];
                    for (let x = 0; x < result.size.width; x += SCALE_DOWN_FACTOR) {
                        const row: Pixel[] = [];
                        for (let y = 0; y < result.size.height; y += SCALE_DOWN_FACTOR) {
                            row.push(this.getUIImagePixel(result, x, y));
                        }
                        image.push(row);
                    }

                    success(image);
                },
            );
        });
    }

    async findHolds(imageAsset: ImageAsset): Promise<Hold[]> {
        let image: Image;

        image = await (isAndroid ? this.processImageAndroid : this.processImageIOS)(imageAsset);

        return this.holdFinderService.findHolds(image);
    }

    public takePicture() {
        camera.requestCameraPermissions().then(() => {
            camera.takePicture().then(imageAsset => {
                // this.router.navigate(['/loading']);
                this.isVisible = true;

                this.findHolds(imageAsset).then(holds => {
                    this.resultsComponent.setResults(holds);

                    setTimeout((() => this.router.navigate(['/results'])).bind(this), 500);
                });
            }).catch(error => {
                alert(error);
            })
        }).catch(error => {
            alert('Camera permission is required.');
        });
    }
}
