import {Injectable} from '@angular/core';

export class Pixel {
    constructor(
        public r: number,
        public g: number,
        public b: number,
    ) {}

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

    constructor() { }

    public findHolds(image: Image): Hold[] {
        const holds: Hold[] = [
            new Hold(1, 2, 3, 4),
        ];

        return holds;
    }

}
