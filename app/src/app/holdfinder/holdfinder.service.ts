import {Injectable} from '@angular/core';
import {ImageAsset} from 'tns-core-modules/image-asset/image-asset';

const NEARBY_THRESHOLD = 80;
const DIRECTIONS = [
    [-1, -1],
    [-1, 1],
    [1, -1],
    [1, 1],
];

export class ImageInfo {
    constructor(
        public width: number,
        public height: number,
    ) {}

    public toString(): string {
        return `ImageInfo(${this.width}, ${this.height})`;
    }
}

export class Pixel {
    public visited = false;

    constructor(
        public r: number,
        public g: number,
        public b: number,
    ) {}

    public static fromString(stringPixel: string): Pixel {
        const split = stringPixel.substr(6, stringPixel.length - 7).split(',',3);
        const r = Number(split[0]);
        const g = Number(split[1]);
        const b = Number(split[2]);
        return new Pixel(r, g, b);
    }

    public toString(): string {
        return `Pixel(${this.r}, ${this.g}, ${this.b})`;
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

    public toString(): string {
        return `Hold(${this.positionX}, ${this.positionY}, ${this.radius}, ${this.routeId})`;
    }
}

@Injectable({
    providedIn: 'root',
})
export class HoldFinderService {
    public holds: Hold[] = [];
    public originalImage: ImageAsset;
    public originalImageInfo: ImageInfo;

    private mostCommonColor(image: Image): Pixel {
        const colors: {[key: string]: number} = {};

        for (const row of image) {
            for (const pixel of row) {
                let stringPixel = pixel.toString();
                if (stringPixel in colors) {
                    colors[stringPixel]++;
                } else {
                    colors[stringPixel] = 1;
                }
            }
        }

        return Pixel.fromString(Object.keys(colors).reduce((a, b) => colors[a] > colors[b] ? a : b));
    }

    private colorNearby(color1: Pixel, color2: Pixel): boolean {
        // console.log(`### Comparing ${color1} with ${color2}.`);
        return Math.abs(color1.r - color2.r) < NEARBY_THRESHOLD &&
               Math.abs(color1.g - color2.g) < NEARBY_THRESHOLD &&
               Math.abs(color1.b - color2.b) < NEARBY_THRESHOLD;
    }

    private colorsEqual(color1: Pixel, color2: Pixel): boolean {
        return color1.toString() == color2.toString();
    }

    private getRadius(image: Image, color: Pixel, row: number, col: number): number {
        image[row][col].visited = true;

        let radius = 1;
        for (const direction of DIRECTIONS) {
            let neighborRow = row + direction[0];
            let neighborCol = col + direction[1];
            if (neighborRow < 0 || neighborRow >= image.length || neighborCol < 0 || neighborCol >= image[0].length) continue;

            const neighbor = image[neighborRow][neighborCol];
            if (neighbor.visited || !this.colorNearby(neighbor, color)) continue;

            radius += this.getRadius(image, color, neighborRow, neighborCol);
        }

        return radius;
    }

    public findHolds(image: Image, originalImage: ImageAsset, originalImageInfo: ImageInfo) {
        const holds: Hold[] = [];
        // console.log('### Begin mostCommonColor');
        const background = this.mostCommonColor(image);
        console.log(`### mostCommonColor ${background}`);

        for (const row in image) {
            for (const col in image[row]) {
                // console.log(`### On pixel ${row}, ${col}`);
                const numRow = Number(row);
                const numCol = Number(col);
                const pixel = image[row][col];

                if (pixel.visited) continue;
                pixel.visited = true;

                if (this.colorNearby(pixel, background)) {
                    // console.log(`### Pixel is close to background`);
                    continue;
                }

                // console.log(`### Begin get radius`);
                const radius = this.getRadius(image, pixel, numRow, numCol);
                if (radius < 3 || radius > 100) continue;
                // console.log(`### Radius ${radius}`);


                let newHold = new Hold(
                    numRow,
                    numCol,
                    radius,
                    Math.floor(Math.random() * 5), // TODO
                );
                console.log(`Pushing new hold ${newHold}`);
                holds.push(newHold)
            }
        }

        this.originalImage = originalImage;
        this.originalImageInfo = originalImageInfo;
        this.holds = holds;
        console.log(`### Done`);
    }


    // turn string back to Pixel
    // public pixelfy(key: string): Pixel {
    //     var splitted = key.split(',',3);
    //     var r = Number(splitted[0]);
    //     var g = Number(splitted[1]);
    //     var b = Number(splitted[2]);
    //     return new Pixel(r,g,b);
    // }
    //
    // public findHolds(image: Image, originalImage: ImageAsset, originalImageInfo: ImageInfo) {
    //     const holds: Hold[] = [];
    //
    //     const flatImage: Image = image;
    //
    //     // parse to get a counter for each unique rgb
    //     // normalize rgb values so that similar colors are grouped together
    //     // store the normalized pixel values into a new image array
    //     var dict = new Collections.Dictionary<string, number>();
    //     for (var i = 0; i < image.length; i++) {
    //         var pixel = image[i];
    //         for (var j = 0; j < pixel.length; j++) {
    //             var hsvVal = coloration.rgb.hsv(pixel[j].r,pixel[j].g,pixel[j].b);
    //             // bounds for grouping hues of certain saturation & value together
    //             if (hsvVal[1] > 18 && hsvVal[2] > 18){
    //                 // the first hue is grouped in a range
    //                 var rgbVal = coloration.hsv.rgb(this.group(hsvVal[0]),100,100);
    //                 flatImage[i][j] = new Pixel(rgbVal[0],rgbVal[1], rgbVal[2]);
    //             }
    //             // white
    //             else if (hsvVal[1] <= 8 && hsvVal[2] > 70){
    //                 var rgbVal = coloration.hsv.rgb(0,100,100);
    //                 flatImage[i][j] = new Pixel(rgbVal[0],rgbVal[1], rgbVal[2]);
    //             }
    //             // gray
    //             else if (hsvVal[1] <= 8 && (hsvVal[2] > 18 && hsvVal[2] <= 70)){
    //                 var rgbVal = coloration.hsv.rgb(0,0,50);
    //                 flatImage[i][j] = new Pixel(rgbVal[0],rgbVal[1], rgbVal[2]);
    //             }
    //             // black
    //             else if (hsvVal[2] <= 18){
    //                 var rgbVal = coloration.hsv.rgb(0,0,0);
    //                 flatImage[i][j] = new Pixel(rgbVal[0],rgbVal[1], rgbVal[2]);
    //             }
    //             // increment if in dict, otherwise add
    //             if (dict.containsKey(flatImage[i][j].toString())) {
    //                 var inc = dict.getValue(flatImage[i][j].toString());
    //                 dict.setValue(flatImage[i][j].toString(),inc+1);
    //             }
    //             else {
    //                 dict.setValue(flatImage[i][j].toString(),1);
    //             }
    //
    //         }
    //     }
    //     // find the common background
    //     var max = 0
    //     var background = new Pixel(0, 0, 0)
    //     dict.forEach((key,count) => {
    //         if (count > max){
    //             max = count;
    //             background = this.pixelfy(key);
    //         }
    //     })
    //
    //     // container to match normalized colors with assigned routeIDS
    //     var routes = new Collections.Dictionary<string, number>();
    //     // unused...keep track of positions and routes for finding radius
    //     var blobs = new Collections.Dictionary<number, string>();
    //     var routeId = 0;
    //     // loop through image again, this time ignoring common bg
    //     for(var i = 0; i < flatImage.length; i++) {
    //         var pixel = flatImage[i];
    //         for(var j = 0; j < pixel.length; j++) {
    //             if (pixel[j].toString() != background.toString()){
    //                 // radius currently set to 1 pixel
    //                 // currently every pixel in a hold is added, maybe use this to write over the image
    //                 var radius = 1;
    //                 // if the color already has a route assigned
    //                 if (routes.containsKey(flatImage[i][j].toString())) {
    //                     holds.push(new Hold(i,j,radius,routes.getValue(flatImage[i][j].toString())));
    //                 }
    //                 else {
    //                     routes.setValue(flatImage[i][j].toString(),routeId);
    //                     holds.push(new Hold(i,j,radius,routeId));
    //                     routeId++;
    //                 }
    //             }
    //
    //         }
    //     }
    //
    //     this.originalImage = originalImage;
    //     this.originalImageInfo = originalImageInfo;
    //     this.holds = holds;
    // }
    //
    // // ranges for the Hue values to group together
    // private group(num: number) {
    //     // red
    //     if ((num > 0 && num <= 15) || (num > 345 && num <= 360)){
    //         return 0;
    //     }
    //     // orange
    //     if (num > 15 && num <= 45){
    //         return 30;
    //     }
    //     // yellow
    //     if (num > 45 && num <= 75){
    //         return 60;
    //     }
    //     // green
    //     if (num > 76 && num <= 165){
    //         return 120;
    //     }
    //     // blue
    //     if (num > 165 && num <= 240){
    //         return 225;
    //     }
    //     // purple
    //     if (num > 240 && num <= 290){
    //         return 270;
    //     }
    //     // pink
    //     return 315;
    // }

}
