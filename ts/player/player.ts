import * as GWU from 'gw-utils';
import { Actor } from '../actor';
import { Map } from '../map/map';
import { PlayerKind } from './kind';
import { Scent } from './scent';
import * as Flags from '../flags';

export class Player extends Actor {
    static default = {
        ch: '@',
        fg: 'white',
        name: 'You',
        swim: true,
        sidebarFg: 'purple',
    };

    kind!: PlayerKind;
    scent: Scent;

    constructor(kind: PlayerKind) {
        super(kind);
        this.scent = new Scent(this);
    }

    interrupt(other: Actor) {
        if (this.hasGoal()) {
            this.clearGoal();
            GWU.message.addAt(
                this.x,
                this.y,
                '{{you}} {{verb see~}} {{a other}}.',
                {
                    actor: this,
                    verb: 'see',
                    other,
                }
            );
        }
    }

    endTurn(pct = 100): void {
        if (this.map) {
            if (this.map.fov.update()) {
                this.clearActorFlag(Flags.Actor.STABLE_COST_MAP);
            }
            this.scent.update();
        }
        super.endTurn(pct);
    }

    addToMap(map: Map, x: number, y: number): boolean {
        if (!super.addToMap(map, x, y)) return false;
        this.scent.clear();
        return true;
    }

    setGoal(x: number, y: number): GWU.grid.NumGrid {
        const map = this._map;
        if (!map) throw new Error('No map to set goal with!');

        if (!this._goalMap) {
            this._goalMap = GWU.grid.alloc(map.width, map.height);
        }

        const goalMap = this._goalMap;

        const mapToPlayer = this.mapToMe();

        if (
            mapToPlayer[x][y] < 0 ||
            mapToPlayer[x][y] >= GWU.path.NO_PATH ||
            !map.fov.isRevealed(x, y)
        ) {
            let loc = GWU.path.getClosestValidLocation(
                mapToPlayer,
                x,
                y,
                (x, y) => !map.fov.isRevealed(x, y)
            );
            loc = loc || [this.x, this.y];
            x = loc[0];
            y = loc[1];
        }

        GWU.path.calculateDistances(goalMap, x, y, this.costMap());
        return this._goalMap;
    }

    nextGoalStep(): GWU.xy.Loc | null {
        const map = this.map;
        if (!map) return null;

        const goalMap = this.goalMap!;
        const step = GWU.path.nextStep(
            goalMap,
            this.x,
            this.y,
            (x, y) => map.hasActor(x, y) && map.actorAt(x, y) !== this
        );
        return step;
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

        const map = this.map;
        if (!map) return null;

        const mapToPlayer = this.mapToMe();

        if (
            mapToPlayer[x][y] < 0 ||
            mapToPlayer[x][y] >= GWU.path.NO_PATH ||
            !map.fov.isRevealed(x, y)
        ) {
            const loc = GWU.path.getClosestValidLocation(
                mapToPlayer,
                x,
                y,
                (x, y) => !map.fov.isRevealed(x, y)
            );
            if (!loc) return null;
            x = loc[0];
            y = loc[1];
        }

        const path = GWU.path.getPath(
            mapToPlayer,
            x,
            y,
            (x, y) => !map.fov.isRevealed(x, y),
            true
        );

        return path;
    }
}
