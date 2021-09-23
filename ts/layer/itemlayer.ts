import * as GWU from 'gw-utils';

import { MapType } from '../map/types';
import { Item } from '../item';
import { MapLayer } from './mapLayer';
import * as Flags from '../flags';

export class ItemLayer extends MapLayer {
    constructor(map: MapType, name = 'item') {
        super(map, name);
    }

    async addItem(
        x: number,
        y: number,
        obj: Item,
        _opts?: any
    ): Promise<boolean> {
        const item = obj as Item;
        if (item.isDestroyed) return false;

        const cell = this.map.cell(x, y);
        if (item.forbidsCell(cell)) return false;

        if (obj.key && obj.key.matches(x, y) && cell.hasEffect('key')) {
            await cell.fire('key', this.map, x, y);
            if (obj.key.disposable) {
                obj.destroy();
                return true; // ??? didSomething?
            }
        }

        if (!GWU.list.push(cell, 'item', obj)) return false;
        obj.x = x;
        obj.y = y;
        obj.depth = this.depth;
        obj.map = this.map;

        if (cell.hasEffect('addItem')) {
            await cell.fire('addItem', this.map, x, y, { item });
        }

        cell.needsRedraw = true;
        if (this.map.fov.isAnyKindOfVisible(x, y)) {
            cell.clearCellFlag(
                Flags.Cell.STABLE_MEMORY | Flags.Cell.STABLE_SNAPSHOT
            );
        }

        return true;
    }

    forceItem(x: number, y: number, obj: Item, _opts?: any): boolean {
        if (!this.map.hasXY(x, y)) return false;

        if (this.map.hasXY(obj.x, obj.y)) {
            const oldCell = this.map.cell(obj.x, obj.y);
            GWU.list.remove(oldCell, 'item', obj);
            obj.x = -1;
            obj.y = -1;
        }

        const cell = this.map.cell(x, y);
        if (!GWU.list.push(cell, 'item', obj)) return false;
        obj.x = x;
        obj.y = y;
        obj.depth = this.depth;
        obj.map = this.map;

        cell.needsRedraw = true;
        if (this.map.fov.isAnyKindOfVisible(x, y)) {
            cell.clearCellFlag(
                Flags.Cell.STABLE_MEMORY | Flags.Cell.STABLE_SNAPSHOT
            );
        }

        return true;
    }

    async removeItem(obj: Item): Promise<boolean> {
        const x = obj.x;
        const y = obj.y;
        const cell = this.map.cell(x, y);
        if (!GWU.list.remove(cell, 'item', obj)) return false;

        if (obj.key && obj.key.matches(x, y) && cell.hasEffect('nokey')) {
            await cell.fire('nokey', this.map, x, y);
        } else if (cell.hasEffect('removeItem')) {
            await cell.fire('removeItem', this.map, x, y);
        }

        cell.needsRedraw = true;
        if (this.map.fov.isAnyKindOfVisible(x, y)) {
            cell.clearCellFlag(
                Flags.Cell.STABLE_MEMORY | Flags.Cell.STABLE_SNAPSHOT
            );
        }

        return true;
    }

    putAppearance(dest: GWU.sprite.Mixer, x: number, y: number) {
        const cell = this.map.cell(x, y);
        if (!cell.item) return;
        dest.drawSprite(cell.item.sprite);
    }
}
