import {Injectable} from '@angular/core';
// npm install typescript-collections --save
import Collections = require('typescript-collections');
// npm install coloration@1.0.5
import coloration = require('coloration');

export class Pixel {
    constructor(
        public r: number,
        public g: number,
        public b: number,
    ) {}
    // turn Pixel into string for key comparison
    public stringify(): string {
        let res = this.r + ',' + this.g + ',' + this.b;
        return res;
    }
}

export type Image = Pixel[][];

export class Hold {
    constructor(
        public positionX: number,
        public positionY: number,
        public radius: number,
        public routeId: number,
    ) {}

    public stringify(): string {
        let res = this.positionX + ',' + this.positionY + ',' + this.radius + ',' + this.routeId;
        return res;
    }
}

@Injectable({
    providedIn: 'root',
})
export class HoldFinderService {

    constructor() { }

    // turn string back to Pixel
    public pixelfy(key: string): Pixel {
        var splitted = key.split(',',3);
        var r = Number(splitted[0]);
        var g = Number(splitted[1]);
        var b = Number(splitted[2]);
        return new Pixel(r,g,b);
    }

    public findHolds(image: Image): Hold[] {
        const holds: Hold[] = [];

        const flatImage: Image = image;

        // parse to get a counter for each unique rgb
        // normalize rgb values so that similar colors are grouped together
        // store the normalized pixel values into a new image array
        var dict = new Collections.Dictionary<string, number>();
        for (var i = 0; i < image.length; i++) {
            var pixel = image[i];
            for (var j = 0; j < pixel.length; j++) {
                var hsvVal = coloration.rgb.hsv(pixel[j].r,pixel[j].g,pixel[j].b);
                // bounds for grouping hues of certain saturation & value together
                if (hsvVal[1] > 18 && hsvVal[2] > 18){
                    // the first hue is grouped in a range
                    var rgbVal = coloration.hsv.rgb(this.group(hsvVal[0]),100,100);
                    flatImage[i][j] = new Pixel(rgbVal[0],rgbVal[1], rgbVal[2]);
                }
                // increment if in dict, otherwise add
                if (dict.containsKey(flatImage[i][j].stringify())) {
                    var inc = dict.getValue(flatImage[i][j].stringify());
                    dict.setValue(flatImage[i][j].stringify(),inc+1);
                }
                else {
                    dict.setValue(flatImage[i][j].stringify(),1);
                }
                
            }
        }
        // find the common background
        var max = 0
        var background = new Pixel(0, 0, 0)
        dict.forEach((key,count) => {
            if (count > max){
                max = count;
                background = this.pixelfy(key);
            }
        })
        
        // container to match normalized colors with assigned routeIDS
        var routes = new Collections.Dictionary<string, number>();
        // unused...keep track of positions and routes for finding radius
        var blobs = new Collections.Dictionary<number, string>();
        var routeId = 0;
        // loop through image again, this time ignoring common bg
        for(var i = 0; i < flatImage.length; i++) {
            var pixel = flatImage[i];
            for(var j = 0; j < pixel.length; j++) {
                if (pixel[j].stringify() != background.stringify()){
                    // radius currently set to 1 pixel
                    // currently every pixel in a hold is added, maybe use this to write over the image
                    var radius = 1;
                    // if the color already has a route assigned
                    if (routes.containsKey(flatImage[i][j].stringify())) {
                        holds.push(new Hold(i,j,radius,routes.getValue(flatImage[i][j].stringify())));
                    }
                    else {
                        routes.setValue(flatImage[i][j].stringify(),routeId);
                        holds.push(new Hold(i,j,radius,routeId));
                        routeId++;
                    }
                }
                
            }
        }

        return holds;
    }

    // ranges for the Hue values to group together
    private group(num: number) {
        // red
        if ((num > 0 && num <= 15) || (num > 345 && num <= 360)){
            return 0;
        }
        // orange
        if (num > 15 && num <= 45){
            return 30;
        }
        // yellow
        if (num > 45 && num <= 75){
            return 60;
        }
        // green
        if (num > 76 && num <= 165){
            return 120;
        }
        // blue
        if (num > 165 && num <= 240){
            return 225;
        }
        // purple
        if (num > 240 && num <= 290){
            return 270;
        }
        // pink
        return 315;
    }

}
