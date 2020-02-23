import {Injectable} from '@angular/core';
import {ImageAsset} from 'tns-core-modules/image-asset/image-asset';

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
    public originalImageInfo: ImageInfo;

    public findHolds(image: Image, originalImage: ImageAsset, originalImageInfo: ImageInfo) {
        const holds: Hold[] = [
            new Hold(1, 2, 3, 4),
            new Hold(2, 3, 4, 5),
        ];

        this.holds = holds;
        this.originalImage = originalImage;
        this.originalImageInfo = originalImageInfo;
    }

}
