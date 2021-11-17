import * as GWU from 'gw-utils';
import { Actor } from '../actor/actor';
import { Item } from '../item/item';
import { Map } from '../map/map';
import { CellType, MapType } from '../map/types';
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
    source: MapType;

    constructor(map: MapType) {
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

    isMemory(x: number, y: number): boolean {
        return this.cells[x][y].hasCellFlag(Flags.Cell.STABLE_MEMORY);
    }

    setTile(): boolean {
        throw new Error('Cannot set tiles on memory.');
    }

    addItem(
        x: number,
        y: number,
        item: Item,
        fireEffects: boolean
    ): boolean | Promise<boolean>;
    addItem(x: number, y: number, item: Item): boolean;
    addItem(): boolean | Promise<boolean> {
        throw new Error('Cannot add Items to memory!');
    }

    removeItem(item: Item, fireEffects: boolean): boolean | Promise<boolean>;
    removeItem(item: Item): boolean;
    removeItem(): boolean | Promise<boolean> {
        throw new Error('Cannot remove Items from memory!');
    }

    // async moveItem(): Promise<boolean> {
    //     throw new Error('Cannot move Items on memory!');
    // }
    eachItem(cb: GWU.types.EachCb<Item>): void {
        this.source.eachItem((i) => {
            if (!this.isMemory(i.x, i.y)) {
                cb(i);
                const i2 = this.items.find((other) => other.id == i.id);
                if (i2) {
                    const mem = this.cell(i2.x, i2.y);
                    mem.clearCellFlag(
                        Flags.Cell.HAS_ITEM | Flags.Cell.STABLE_SNAPSHOT
                    );
                    GWU.arrayDelete(this.items, i2);
                }
            }
        });
        this.items.forEach(cb);
    }

    addActor(
        x: number,
        y: number,
        actor: Actor,
        fireEffects: boolean
    ): boolean | Promise<boolean>;
    addActor(x: number, y: number, actor: Actor): boolean;
    addActor(): boolean | Promise<boolean> {
        throw new Error('Cannot add Actors to memory!');
    }

    removeActor(actor: Actor, fireEffects: boolean): boolean | Promise<boolean>;
    removeActor(actor: Actor): boolean;
    removeActor(): boolean | Promise<boolean> {
        throw new Error('Cannot remove Actors from memory!');
    }

    // async moveActor(): Promise<boolean> {
    //     throw new Error('Cannot move Actors on memory!');
    // }
    eachActor(cb: GWU.types.EachCb<Actor>): void {
        this.source.eachActor((a) => {
            if (!this.isMemory(a.x, a.y)) {
                cb(a);
                const a2 = this.actors.find((other) => other.id == a.id);
                if (a2) {
                    const mem = this.cell(a2.x, a2.y);
                    mem.clearCellFlag(
                        Flags.Cell.HAS_ACTOR | Flags.Cell.STABLE_SNAPSHOT
                    );
                    GWU.arrayDelete(this.actors, a2);
                }
            }
        });
        this.actors.forEach(cb);
    }

    storeMemory(x: number, y: number) {
        const mem = this.cells[x][y];

        const currentList = mem.hasEntityFlag(
            Flags.Entity.L_LIST_IN_SIDEBAR,
            true
        );

        // cleanup any old items+actors
        if (mem.hasItem()) {
            this.items = this.items.filter((i) => i.x !== x || i.y !== y);
        }
        if (mem.hasActor()) {
            this.actors = this.actors.filter((a) => a.x !== x || a.y !== y);
        }

        const cell = this.source.cell(x, y);
        mem.copy(cell);
        mem.setCellFlag(Flags.Cell.STABLE_MEMORY);
        mem.map = this; // so that drawing this cell results in using the right map

        let newList = mem.hasEntityFlag(Flags.Entity.L_LIST_IN_SIDEBAR);

        // add any current items+actors
        if (cell.hasItem()) {
            const item = this.source.itemAt(x, y);
            if (item) {
                const copy = item.clone();
                copy._map = this; // memory is map
                this.items.push(copy);
                if (copy.hasEntityFlag(Flags.Entity.L_LIST_IN_SIDEBAR)) {
                    newList = true;
                }
            }
        }
        if (cell.hasActor()) {
            const actor = this.source.actorAt(x, y);
            if (actor) {
                const copy = actor.clone();
                copy._map = this; // memory is map
                this.actors.push(copy);
                if (copy.hasEntityFlag(Flags.Entity.L_LIST_IN_SIDEBAR)) {
                    newList = true;
                }
            }
        }

        if (currentList != newList) {
            this.setMapFlag(Flags.Map.MAP_SIDEBAR_TILES_CHANGED);
        }

        this.light.setLight(x, y, this.source.light.getLight(x, y));
    }

    forget(x: number, y: number) {
        const mem = this.memory(x, y);
        const currentList = mem.hasEntityFlag(
            Flags.Entity.L_LIST_IN_SIDEBAR,
            true
        );

        // cleanup any old items+actors
        if (mem.hasItem()) {
            this.items = this.items.filter((i) => i.x !== x || i.y !== y);
        }
        if (mem.hasActor()) {
            this.actors = this.actors.filter((a) => a.x !== x || a.y !== y);
        }

        mem.clearCellFlag(Flags.Cell.STABLE_MEMORY);

        let newList = this.source
            .cell(x, y)
            .hasEntityFlag(Flags.Entity.L_LIST_IN_SIDEBAR, true);

        if (currentList != newList) {
            this.setMapFlag(Flags.Map.MAP_SIDEBAR_TILES_CHANGED);
        }
    }

    onFovChange(x: number, y: number, isVisible: boolean) {
        if (!isVisible) {
            this.storeMemory(x, y);
        } else {
            this.forget(x, y);
        }
    }
}
