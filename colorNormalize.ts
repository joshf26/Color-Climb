import * as Collections from 'typescript-collections';
// tsc <filename.ts>
// node <filename.js>

export class Pixel {
    constructor(
        public r: number,
        public g: number,
        public b: number,
    ) {}
}

export class Hold {
    constructor(
        public positionX: number,
        public positionY: number,
        public radius: number,
        public routeId: number,
    ) {}
}

export type Image = Pixel[][];

export class HoldFinderService {
    constructor() {  }

    public findHolds(image: Image): Hold[] {
        const holds: Hold[] = [];
        // parse through the image
        // const pixelcounter: Pixel[] = [];
        // for(var i = 0; i < image.length; i++) {
        //     var pixel = image[i];

        //     for(var j = 0; j < pixel.length; j++) {
        //         console.log("cube[" + i + "][" + j + "] = " + pixel[j].r);
        //         pixelcounter.push(pixel[j])
        //     }
        // }
        // console.log(pixelcounter)

        var dict = new Collections.Dictionary<Pixel, number>();
        for(var i = 0; i < image.length; i++) {
            var pixel = image[i];

            for(var j = 0; j < pixel.length; j++) {
                console.log("cube[" + i + "][" + j + "] = " + pixel[j].r);
                if (dict.containsKey(pixel[j])) {
                    var inc = dict.getValue(pixel[j])
                    dict.setValue(pixel[j],inc+1)
                }
                else {
                    dict.setValue(pixel[j],1)
                }
                
            }
        }
        console.log(dict)

        return holds;
    }
}




function test() {
    const hfs:HoldFinderService = new HoldFinderService();
    const image = [
        [new Pixel(0, 0, 0), new Pixel(0, 0, 0), new Pixel(0, 0, 0)],
        [new Pixel(0, 0, 0), new Pixel(255, 0, 0), new Pixel(0, 0, 0)],
        [new Pixel(0, 0, 0), new Pixel(0, 0, 0), new Pixel(0, 0, 0)],
    ]

    const holds = hfs.findHolds(image);
    // r,g,b, 
    if (holds[0] == new Hold(1, 1, 1, 0)) {
        console.log('Good job guys');
    } else {
        console.log('WRONG');
    }
}


test();