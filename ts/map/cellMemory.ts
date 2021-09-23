import * as GWU from 'gw-utils';

import { Cell } from './cell';
import { Map } from './map';
import * as Tile from '../tile';

export class CellMemory extends Cell {
    snapshot: GWU.sprite.Mixer;

    constructor(map: Map, x: number, y: number) {
        super(map, x, y);
        this.snapshot = new GWU.sprite.Mixer();
        this.snapshot.copy(Tile.tiles.NULL.sprite);
    }

    clear() {
        super.clear();
        this.snapshot.blackOut();
    }

    store(cell: Cell) {
        this.copy(cell);
        if (cell.actor) {
            cell.actor.lastSeen = cell;
        }
        if (cell.item) {
            cell.item.lastSeen = cell;
        }
    }

    getSnapshot(dest: GWU.sprite.Mixer) {
        dest.copy(this.snapshot);
    }
    putSnapshot(src: GWU.sprite.Mixer) {
        this.snapshot.copy(src);
    }
}
