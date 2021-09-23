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
                cell.actor = null;
            }
        }
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
        obj.map = this.map;

        if (obj.key && obj.key.matches(x, y) && cell.hasEffect('key')) {
            await cell.fire('key', this.map, x, y);
        }

        cell.needsRedraw = true;
        // if (this.map.fov.isAnyKindOfVisible(x, y)) {
        //     cell.clearCellFlag(
        //         Flags.Cell.STABLE_MEMORY | Flags.Cell.STABLE_SNAPSHOT
        //     );
        // }

        return true;
    }

    forceActor(x: number, y: number, actor: Actor, _opts?: any): boolean {
        if (actor.isDestroyed) return false;

        if (this.map.hasXY(actor.x, actor.y)) {
            const oldCell = this.map.cell(actor.x, actor.y);
            oldCell.removeActor(actor);
        }

        const cell = this.map.cell(x, y);
        if (!GWU.list.push(cell, 'actor', actor)) return false;

        if (actor.isPlayer()) {
            cell.setCellFlag(Flags.Cell.HAS_PLAYER);
        }
        actor.x = x;
        actor.y = y;
        actor.map = this.map;

        cell.needsRedraw = true;
        // if (this.map.fov.isAnyKindOfVisible(x, y)) {
        //     cell.clearCellFlag(
        //         Flags.Cell.STABLE_MEMORY | Flags.Cell.STABLE_SNAPSHOT
        //     );
        // }

        return true;
    }

    async removeActor(actor: Actor): Promise<boolean> {
        const x = actor.x;
        const y = actor.y;
        const cell = this.map.cell(x, y);

        if (!GWU.list.remove(cell, 'actor', actor)) return false;

        if (actor.isPlayer()) {
            cell.clearCellFlag(Flags.Cell.HAS_PLAYER);
        }

        if (actor.key && actor.key.matches(x, y) && cell.hasEffect('nokey')) {
            await cell.fire('nokey', this.map, x, y);
        }

        cell.needsRedraw = true;
        // if (this.map.fov.isAnyKindOfVisible(x, y)) {
        //     cell.clearCellFlag(
        //         Flags.Cell.STABLE_MEMORY | Flags.Cell.STABLE_SNAPSHOT
        //     );
        // }

        return true;
    }

    putAppearance(dest: GWU.sprite.Mixer, cell: CellInfoType) {
        if (!cell.actor) return;
        dest.drawSprite(cell.actor.sprite);
    }
}
