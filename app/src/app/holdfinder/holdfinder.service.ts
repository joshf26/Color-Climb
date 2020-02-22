import {Injectable} from '@angular/core';

export class Pixel {
    constructor(
        public r: number,
        public g: number,
        public b: number,
    ) {}
}

export type Image = Pixel[][];

export class Hold {
    constructor(
        public positionX: number,
        public positionY: number,
        public radius: number,
        public routeId: number,
    ) {}
}

@Injectable({
    providedIn: 'root',
})
export class HoldFinderService {

    constructor() { }

    public findHolds(image: Image): Hold[] {
        const holds: Hold[] = [];

        return holds;
    }

}
