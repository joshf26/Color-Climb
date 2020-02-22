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

export function findHolds(image: Pixel[][]): Hold[] {
    const holds: Hold[] = [];

    return holds;
}

function test() {
    const image = [
        [new Pixel(0, 0, 0), new Pixel(0, 0, 0), new Pixel(0, 0, 0)],
        [new Pixel(0, 0, 0), new Pixel(255, 0, 0), new Pixel(0, 0, 0)],
        [new Pixel(0, 0, 0), new Pixel(0, 0, 0), new Pixel(0, 0, 0)],
    ]

    const holds = findHolds(image);

    if (holds == [new Hold(1, 1, 1, 0)]) {
        console.log('Test Passed');
    } else {
        console.log('Test Failed');
    }
}

test();
