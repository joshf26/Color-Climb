import { Component } from "@angular/core";
import * as camera from "nativescript-camera";
import { alert } from "tns-core-modules/ui/dialogs";

@Component({
    selector: "Home",
    templateUrl: "./home.component.html"
})
export class HomeComponent {

    public takePicture() {
        camera.requestCameraPermissions().then(() => {
            camera.takePicture().then(imageAsset => {
                alert('Picutre taken successfully.');
            }).catch(error => {
                alert('Error taking picture.');
            })
        }).catch(error => {
            alert('Camera permission is required.');
        });
    }

}
