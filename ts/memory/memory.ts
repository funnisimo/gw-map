import { Actor } from '../actor/actor';
import { Item } from '../item/item';
import { Map } from '../map/map';
import { CellType } from '../map/types';
import * as Flags from '../flags';

export interface ActorInfo {
    actor: Actor;
    readonly x: number;
    readonly y: number;
}

export interface ItemInfo {
    item: Item;
    readonly x: number;
    readonly y: number;
}

export class Memory extends Map {
    // actor: Actor;
    source: Map;

    constructor(map: Map) {
        super(map.width, map.height);
        // this.actor = actor;
        this.source = map;
        this.cells.forEach((c) => c.setCellFlag(Flags.Cell.STABLE_MEMORY));
    }

    cell(x: number, y: number): CellType {
        let cell: CellType = this.cells[x][y];
        if (!cell.hasCellFlag(Flags.Cell.STABLE_MEMORY)) {
            cell = this.source.cell(x, y);
        }
        return cell;
    }

    memory(x: number, y: number): CellType {
        return this.cells[x][y];
    }

    storeMemory(x: number, y: number) {
        const mem = this.memory(x, y);
        const cell = this.source.cell(x, y);
        mem.copy(cell);

        // we do not track actors -- too hard to figure out
        if (cell.actor) {
            mem.actor = null;
            mem.clearCellFlag(Flags.Cell.STABLE_SNAPSHOT);
        }
        mem.setCellFlag(Flags.Cell.STABLE_MEMORY);
    }

    forget(x: number, y: number) {
        const mem = this.memory(x, y);
        mem.clear();
    }

    onFovChange(x: number, y: number, isVisible: boolean) {
        if (!isVisible) {
            this.storeMemory(x, y);
        } else {
            this.memory(x, y).clearCellFlag(Flags.Cell.STABLE_MEMORY);
        }
    }
}
