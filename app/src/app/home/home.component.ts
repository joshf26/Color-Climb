import {Component} from '@angular/core';
import * as camera from 'nativescript-camera';
import {alert} from 'tns-core-modules/ui/dialogs';
import {ImageAsset} from 'tns-core-modules/image-asset/image-asset'
import {HoldFinderService, Pixel, Image, ImageInfo} from '~/app/holdfinder/holdfinder.service';
import {isAndroid} from 'tns-core-modules/platform';
import {Router} from "@angular/router";

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

interface ImageWithInfo {
    image: Image,
    info: ImageInfo,
}

@Component({
    selector: 'Home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css'],
})
export class HomeComponent {
    titleTop: string = 'Color';
    titleBottom: string = 'Climb';
    waitTitle: string = 'Calculating';
    waitTitleBottom: string = 'Results';
    loading: boolean = false;

    constructor(
        private holdFinderService: HoldFinderService,
        private router: Router,
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

    private async processImageAndroid(imageAsset: ImageAsset): Promise<ImageWithInfo> {
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

        return {
            image: image,
            info: new ImageInfo(width, height),
        };
    }

    private async processImageIOS(imageAsset: ImageAsset): Promise<ImageWithInfo> {
        return new Promise<ImageWithInfo>((success, error) => {
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

                    success({
                        image: image,
                        info: new ImageInfo(result.size.width, result.size.height),
                    });
                },
            );
        });
    }

    async findHolds(imageAsset: ImageAsset): Promise<void> {
        let imageWithInfo: ImageWithInfo;

        imageWithInfo = await (isAndroid ? this.processImageAndroid : this.processImageIOS)(imageAsset);

        this.holdFinderService.findHolds(imageWithInfo.image, imageAsset, imageWithInfo.info);
    }

    public takePicture() {
        camera.requestCameraPermissions().then(() => {
            camera.takePicture().then(imageAsset => {
                this.loading = true;

                this.findHolds(imageAsset).then(() => {
                    this.router.navigate(['/results']);
                });
            }).catch(error => {
                alert(error);
            })
        }).catch(error => {
            alert('Camera permission is required.');
        });
    }
}
