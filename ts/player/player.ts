import * as GWU from 'gw-utils';
import { Actor } from '../actor';
import { MapType } from '../map';
import { PlayerKind } from './kind';
import { Scent } from './scent';
// import { Memory } from '../memory';

export class Player extends Actor {
    static default = {
        ch: '@',
        fg: 'white',
        name: 'You',
        swim: true,
    };

    kind!: PlayerKind;
    scent: Scent;

    constructor(kind: PlayerKind) {
        super(kind);
        this.scent = new Scent(this);
    }

    interrupt() {
        this.clearGoal();
    }

    endTurn(pct = 100): number {
        if (this.map) {
            this.map.fov.update();
            this.scent.update();
        }
        return super.endTurn(pct);
    }

    addToMap(map: MapType, x: number, y: number): boolean {
        if (!super.addToMap(map, x, y)) return false;
        this.scent.clear();
        return true;
    }

    pathTo(other: Actor): GWU.xy.Loc[] | null;
    pathTo(x: number, y: number): GWU.xy.Loc[] | null;
    pathTo(...args: any[]): GWU.xy.Loc[] | null {
        let x: number = args[0];
        let y: number = args[1];
        if (args.length === 1) {
            x = args[0].x;
            y = args[0].y;
        }

        if (!this.map) return null;

        const mapToPlayer = this.mapToMe();
        const path = GWU.path.getPath(
            mapToPlayer,
            x,
            y,
            (x, y) => !this.map!.fov.isRevealed(x, y)
        );

        return path;
    }
}
