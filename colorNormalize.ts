import Collections = require('typescript-collections');
// tsc <filename.ts>
// node <filename.js>

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

    // turn string back to Pixel
    public pixelfy(key: string): Pixel {
        var splitted = key.split(',',3);
        var r = Number(splitted[0]);
        var g = Number(splitted[1]);
        var b = Number(splitted[2]);
        return new Pixel(r,g,b);
    }
    // current expects an array of rbg values (0-255)
    public findHolds(image: Image): Hold[] {
        const holds: Hold[] = [];

        // parse to get a counter for each unique rgb
        // TODO: normalize rgb values so that similar colors are grouped together
        // store the normalized pixel values into a new image array
        var dict = new Collections.Dictionary<string, number>();
        for(var i = 0; i < image.length; i++) {
            var pixel = image[i];
            for(var j = 0; j < pixel.length; j++) {
                // console.log("[" + i + "][" + j + "] = " + pixel[j].r);
                if (dict.containsKey(pixel[j].stringify())) {
                    var inc = dict.getValue(pixel[j].stringify())
                    dict.setValue(pixel[j].stringify(),inc+1)
                }
                else {
                    dict.setValue(pixel[j].stringify(),1)
                }
                
            }
        }
        // find the common background
        var max = 0
        var background = new Pixel(0, 0, 0)
        dict.forEach((key,count) => {
            if (count > max){
                max = count
                background = this.pixelfy(key)
            }
        })
        
        // TODO: make some sort of container to match normalized colors with assigned routeIDS
        // this may need another parsing loop
        var routeId = 0
        // loop through image again, this time ignoring common bg
        for(var i = 0; i < image.length; i++) {
            var pixel = image[i];
            for(var j = 0; j < pixel.length; j++) {
                if (pixel[j].stringify() != background.stringify()){
                    // TODO: calculate radius
                    var radius = 1
                    holds.push(new Hold(i,j,radius,routeId))
                    routeId++;
                }
                
            }
        }

        return holds;
    }


}




function test() {
    const hfs:HoldFinderService = new HoldFinderService();
    const image = [
        [new Pixel(1,1,1), new Pixel(1,1,1), new Pixel(1,1,1)],
        [new Pixel(1,1,1), new Pixel(255, 0, 0), new Pixel(1,1,1)],
        [new Pixel(1,1,1), new Pixel(1,1,1), new Pixel(1,1,1)],
    ]

    const holds = hfs.findHolds(image);
    console.log(holds)
    // r,g,b, 
    if (holds[0] == new Hold(1, 1, 1, 0)) {
        console.log('Good job guys');
    } else {
        console.log('WRONG');
    }
}


test();