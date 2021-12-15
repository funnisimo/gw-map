// import * as GWM from 'gw-map';
import { Actor } from '../actor';
import { PlayerKind } from './kind';

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
