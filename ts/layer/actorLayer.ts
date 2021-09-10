import * as GWU from 'gw-utils';

import { MapType } from '../map/types';
import * as Flags from '../flags';
import { Actor } from '../actor';
import { MapLayer } from './mapLayer';

export class ActorLayer extends MapLayer {
    constructor(map: MapType, name = 'actor') {
        super(map, name);
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

        if (!GWU.list.push(cell, 'actor', obj)) return false;

        if (obj.isPlayer()) {
            cell.setCellFlag(Flags.Cell.HAS_PLAYER);
        }
        obj.x = x;
        obj.y = y;

        if (obj.key && obj.key.matches(x, y) && cell.hasEffect('key')) {
            await cell.fire('key', this.map, x, y);
        }

        return true;
    }

    forceActor(x: number, y: number, actor: Actor, _opts?: any): boolean {
        if (actor.isDestroyed) return false;
        const cell = this.map.cell(x, y);
        if (!GWU.list.push(cell, 'actor', actor)) return false;

        if (actor.isPlayer()) {
            cell.setCellFlag(Flags.Cell.HAS_PLAYER);
        }
        actor.x = x;
        actor.y = y;
        return true;
    }

    async removeActor(obj: Actor): Promise<boolean> {
        const x = obj.x;
        const y = obj.y;
        const cell = this.map.cell(x, y);

        if (!GWU.list.remove(cell, 'actor', obj)) return false;

        if (obj.isPlayer()) {
            cell.clearCellFlag(Flags.Cell.HAS_PLAYER);
        }

        if (obj.key && obj.key.matches(x, y) && cell.hasEffect('nokey')) {
            await cell.fire('key', this.map, x, y);
        }

        return true;
    }

    putAppearance(dest: GWU.sprite.Mixer, x: number, y: number) {
        const cell = this.map.cell(x, y);
        if (!cell.actor) return;
        dest.drawSprite(cell.actor.sprite);
    }
}
