import * as GWU from 'gw-utils';

import { MapType, CellInfoType } from '../map/types';
import { Item } from '../item';
import { MapLayer } from './mapLayer';
import * as Flags from '../flags';

export class ItemLayer extends MapLayer {
    constructor(map: MapType, name = 'item') {
        super(map, name);
    }

    clear() {
        for (let x = 0; x < this.map.width; ++x) {
            for (let y = 0; y < this.map.height; ++y) {
                const cell = this.map.cell(x, y);
                cell.clearCellFlag(Flags.Cell.HAS_ITEM);
            }
        }
        this.map.items = [];
    }

    async addItem(
        x: number,
        y: number,
        item: Item,
        _opts?: any
    ): Promise<boolean> {
        if (item.isDestroyed) return false;

        const cell = this.map.cell(x, y);
        if (item.forbidsCell(cell)) return false;

        cell.addItem(item);
        item.depth = this.depth;

        if (item.key && item.key.matches(x, y) && cell.hasEffect('key')) {
            await cell.fire('key', this.map, x, y, { item });
            if (item.key.disposable) {
                cell.removeItem(item);
                item.destroy();
                return true; // TODO - ??? Is this correct!?!?
            }
        }

        if (cell.hasEffect('addItem')) {
            await cell.fire('addItem', this.map, x, y, { item });
        }

        return true;
    }

    forceItem(x: number, y: number, item: Item, _opts?: any): boolean {
        if (!this.map.hasXY(x, y)) return false;

        // If item is already in map.items, then this is a move
        if (this.map.items.includes(item)) {
            const oldCell = this.map.cell(item.x, item.y);
            oldCell.removeItem(item);
        }

        const cell = this.map.cell(x, y);
        cell.addItem(item);
        item.depth = this.depth;

        return true;
    }

    async removeItem(item: Item): Promise<boolean> {
        const x = item.x;
        const y = item.y;
        const cell = this.map.cell(x, y);
        if (!cell.removeItem(item)) return false;

        if (item.key && item.key.matches(x, y) && cell.hasEffect('nokey')) {
            await cell.fire('nokey', this.map, x, y, { item });
        }
        if (cell.hasEffect('removeItem')) {
            await cell.fire('removeItem', this.map, x, y, { item });
        }

        return true;
    }

    putAppearance(dest: GWU.sprite.Mixer, cell: CellInfoType) {
        if (!cell.hasItem()) return;
        const item = this.map.itemAt(cell.x, cell.y);
        if (item) {
            dest.drawSprite(item.sprite);
        }
    }
}
