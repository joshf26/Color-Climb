import {Injectable} from '@angular/core';
import { ImageAsset } from 'tns-core-modules/image-asset/image-asset';

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
    public holds: Hold[] = [];
    public originalImage: ImageAsset;

    public findHolds(image: Image, originalImage: ImageAsset) {
        const holds: Hold[] = [
            new Hold(1, 2, 3, 4),
            new Hold(2, 3, 4, 5),
        ];

        this.originalImage = originalImage;
        this.holds = holds;
    }

}
