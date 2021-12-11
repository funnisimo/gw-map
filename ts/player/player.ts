// import * as GWM from 'gw-map';
import { Actor } from '../actor';
import { PlayerKind, KindOptions } from './kind';

export class Player extends Actor {
    static default = {
        ch: '@',
        fg: 'white',
        name: 'You',
    };

    kind!: PlayerKind;

    constructor(kind: PlayerKind) {
        super(kind);
    }
}

export function make(options: Partial<KindOptions> = {}): Player {
    const kind = new PlayerKind(options);
    return new Player(kind);
}
