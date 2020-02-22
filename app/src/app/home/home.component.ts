import {Component} from '@angular/core';
import * as camera from 'nativescript-camera';
import {alert} from 'tns-core-modules/ui/dialogs';
import {ImageAsset} from 'tns-core-modules/image-asset/image-asset'
import {Hold, HoldFinderService, Pixel, Image} from '~/app/holdfinder/holdfinder.service';
import {isAndroid} from 'tns-core-modules/platform';

@Component({
    selector: 'Home',
    templateUrl: './home.component.html'
})
export class HomeComponent {

    constructor(
        private holdFinderService: HoldFinderService,
    ) {
    }

    processImageAndroid(imageAsset: ImageAsset): Image {
        // Type checking is ignored since `android` is built-in.
        // @ts-ignore
        const bitmap = android.graphics.BitmapFactory.decodeFile(imageAsset.android, null);
        const width = bitmap.getWidth();
        const height = bitmap.getHeight();

        const image: Pixel[][] = [];
        for (let x = 0; x < width; ++x) {
            const row: Pixel[] = [];
            for (let y = 0; y < height; ++y) {
                row.push(bitmap.getColor(x, y));
            }
            image.push(row);
        }

        return image;
    }

    processImageIOS(imageAsset: ImageAsset): Image {
        // TODO
        return [];
    }

    findHolds(imageAsset: ImageAsset): Hold[] {
        let image: Image;

        if (isAndroid) {
            image = this.processImageAndroid(imageAsset);
        } else {
            image = this.processImageIOS(imageAsset);
        }

        return this.holdFinderService.findHolds(image);
    }

    public takePicture() {
        camera.requestCameraPermissions().then(() => {
            camera.takePicture().then(imageAsset => {
                // TODO: Do something with this value.
                this.findHolds(imageAsset);
            }).catch(error => {
                alert(error);
            })
        }).catch(error => {
            alert('Camera permission is required.');
        });
    }

}
