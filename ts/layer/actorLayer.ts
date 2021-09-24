import * as GWU from 'gw-utils';

import { MapType, CellInfoType } from '../map/types';
import * as Flags from '../flags';
import { Actor } from '../actor';
import { MapLayer } from './mapLayer';

export class ActorLayer extends MapLayer {
    constructor(map: MapType, name = 'actor') {
        super(map, name);
    }

    clear() {
        for (let x = 0; x < this.map.width; ++x) {
            for (let y = 0; y < this.map.height; ++y) {
                const cell = this.map.cell(x, y);
                cell.clearCellFlag(
                    Flags.Cell.HAS_ACTOR | Flags.Cell.HAS_PLAYER
                );
            }
        }
        this.map.actors = [];
    }

    async addActor(
        x: number,
        y: number,
        obj: Actor,
        _opts?: any
    ): Promise<boolean> {
        const actor = obj as Actor;
        if (actor.isDestroyed) return false;

        const cell = this.map.cell(x, y);
        if (actor.forbidsCell(cell)) return false;

        cell.addActor(actor);

        if (obj.key && obj.key.matches(x, y) && cell.hasEffect('key')) {
            await cell.fire('key', this.map, x, y, { actor });
        }

        return true;
    }

    forceActor(x: number, y: number, actor: Actor, _opts?: any): boolean {
        if (actor.isDestroyed) return false;

        if (this.map.actors.includes(actor)) {
            const oldCell = this.map.cell(actor.x, actor.y);
            oldCell.removeActor(actor);
        }

        const cell = this.map.cell(x, y);
        cell.addActor(actor);
        actor.depth = this.depth;

        return true;
    }

    async removeActor(actor: Actor): Promise<boolean> {
        const x = actor.x;
        const y = actor.y;
        const cell = this.map.cell(x, y);
        if (!cell.removeActor(actor)) return false;

        if (actor.key && actor.key.matches(x, y) && cell.hasEffect('nokey')) {
            await cell.fire('nokey', this.map, x, y, { actor });
        }
        if (cell.hasEffect('removeActor')) {
            await cell.fire('removeActor', this.map, x, y, { actor });
        }

        return true;
    }

    putAppearance(dest: GWU.sprite.Mixer, cell: CellInfoType) {
        if (!cell.hasActor()) return;
        const actor = this.map.actorAt(cell.x, cell.y);
        if (actor) {
            dest.drawSprite(actor.sprite);
        }
    }
}
