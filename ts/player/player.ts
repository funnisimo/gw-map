// import * as GWM from 'gw-map';
import * as GWU from 'gw-utils';
import { Actor } from '../actor';
import { PlayerKind } from './kind';
import { MapType } from '../map';
import { Memory } from '../memory';

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

    interrupt() {
        this.clearGoal();
    }

    addToMap(map: MapType, x: number, y: number): boolean {
        if (!super.addToMap(map, x, y)) return false;

        this.memory = new Memory(map);
        this.fov = new GWU.fov.FovSystem(map, { callback: this.memory });
        this.fov.updateFor(this); // initial update
        return true;
    }

    removeFromMap() {
        // TODO - save/restore these
        this.fov = null;
        this.memory = null;

        super.removeFromMap();
    }

    endTurn(pct = 100): number {
        if (this.fov) this.fov.updateFor(this);
        this.lastSeen[0] = this.x;
        this.lastSeen[1] = this.y;
        return super.endTurn(pct);
    }
}
