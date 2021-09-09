import * as GWU from 'gw-utils';

import { MapType } from '../map/types';
import { Item } from '../item';
import { MapLayer } from './mapLayer';

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
            await cell.activate('key', this.map, x, y);
            if (obj.key.disposable) {
                obj.destroy();
                return true; // ??? didSomething?
            }
        }

        if (!GWU.list.push(cell, 'item', obj)) return false;
        obj.x = x;
        obj.y = y;
        obj.depth = this.depth;

        return true;
    }

    forceItem(x: number, y: number, obj: Item, _opts?: any): boolean {
        const cell = this.map.cell(x, y);
        if (!GWU.list.push(cell, 'item', obj)) return false;
        obj.x = x;
        obj.y = y;
        obj.depth = this.depth;
        return true;
    }

    async removeItem(obj: Item): Promise<boolean> {
        const x = obj.x;
        const y = obj.y;
        const cell = this.map.cell(x, y);
        if (!GWU.list.remove(cell, 'item', obj)) return false;

        if (obj.key && obj.key.matches(x, y) && cell.hasEffect('nokey')) {
            await cell.activate('nokey', this.map, x, y);
        }

        return true;
    }

    putAppearance(dest: GWU.sprite.Mixer, x: number, y: number) {
        const cell = this.map.cell(x, y);
        if (!cell.item) return;
        dest.drawSprite(cell.item.sprite);
    }
}
