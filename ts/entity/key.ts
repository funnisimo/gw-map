import { KeyInfoType } from './types';

// TODO - Do we need the machine?
export class KeyInfo implements KeyInfoType {
    constructor(
        public x: number,
        public y: number,
        public disposable: boolean
    ) {}

    matches(x: number, y: number) {
        return this.x === x && this.y === y;
    }
}

export function makeKeyInfo(x: number, y: number, disposable: boolean) {
    return new KeyInfo(x, y, disposable);
}
