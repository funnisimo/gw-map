import * as GWU from 'gw-utils';

import * as Flags from '../flags';
import { CellType, CellInfoType, CellFlags, MapType, TileArray } from './types';
import { Item } from '../item/item';
import { Actor } from '../actor/actor';
import { StatusDrawer } from '../entity/types';

import * as TILE from '../tile';
import * as Effect from '../effect';

type EachCb<T> = (t: T) => any;

// class CellEntities {
//     cell: Cell;

//     constructor(cell: Cell) {
//         this.cell = cell;
//     }

//     eachItem(cb: EachCb<Item>): void {
//         let object: Item | null = this.cell._item;
//         while (object) {
//             cb(object);
//             object = object.next;
//         }
//     }

//     eachActor(cb: EachCb<Actor>): void {
//         let object: Actor | null = this.cell._actor;
//         while (object) {
//             cb(object);
//             object = object.next;
//         }
//     }

//     forEach(cb: EachCb<Entity>): void {
//         this.eachItem(cb);
//         this.eachActor(cb);
//     }

//     some(cb: MatchCb<Entity>): boolean {
//         let object: Entity | null = this.cell._item;
//         while (object) {
//             if (cb(object)) return true;
//             object = object.next;
//         }
//         object = this.cell._actor;
//         while (object) {
//             if (cb(object)) return true;
//             object = object.next;
//         }
//         return false;
//     }

//     reduce(cb: ReduceCb<Entity>, start?: any): any {
//         let object: Entity | null = this.cell._item;
//         while (object) {
//             if (start === undefined) {
//                 start = object;
//             } else {
//                 start = cb(start, object);
//             }
//             object = object.next;
//         }
//         object = this.cell._actor;
//         while (object) {
//             if (start === undefined) {
//                 start = object;
//             } else {
//                 start = cb(start, object);
//             }
//             object = object.next;
//         }
//         return start;
//     }
// }

export class Cell implements CellType {
    flags: CellFlags;
    chokeCount = 0;
    tiles: TileArray;
    machineId = 0;
    // _actor: Actor | null = null;
    // _item: Item | null = null;
    // _entities: CellEntities;
    map: MapType;
    x = -1;
    y = -1;
    snapshot: GWU.sprite.Mixer;

    constructor(
        map: MapType,
        x: number,
        y: number,
        groundTile?: number | string | TILE.Tile
    ) {
        // this._entities = new CellEntities(this);
        this.flags = { cell: Flags.Cell.NEEDS_REDRAW };
        this.tiles = [TILE.tiles.NULL];
        this.map = map;
        this.x = x;
        this.y = y;
        this.snapshot = GWU.sprite.makeMixer();

        if (groundTile) {
            const tile = TILE.get(groundTile);
            this.setTile(tile);
        }
    }

    getSnapshot(dest: GWU.sprite.Mixer) {
        dest.copy(this.snapshot);
    }
    putSnapshot(src: GWU.sprite.Mixer) {
        this.snapshot.copy(src);
    }

    get hasStableSnapshot() {
        return this.hasCellFlag(Flags.Cell.STABLE_SNAPSHOT);
    }
    get hasStableMemory() {
        return this.hasCellFlag(Flags.Cell.STABLE_MEMORY);
    }

    copy(other: CellInfoType) {
        Object.assign(this.flags, other.flags);
        this.chokeCount = other.chokeCount;
        this.tiles.length = other.tiles.length;
        for (let i = 0; i < this.tiles.length; ++i) {
            this.tiles[i] = other.tiles[i];
        }
        this.machineId = other.machineId;
        // this._actor = other.actor;
        // this._item = other.item;
        this.map = other.map;
        this.x = other.x;
        this.y = other.y;
        other.getSnapshot(this.snapshot);
    }

    hasCellFlag(flag: number): boolean {
        return !!(this.flags.cell & flag);
    }
    setCellFlag(flag: number) {
        this.flags.cell |= flag;
    }
    clearCellFlag(flag: number) {
        this.flags.cell &= ~flag;
    }

    hasEntityFlag(flag: number): boolean {
        return this.tiles.some((t) => t && t.flags.entity & flag);
    }
    hasAllEntityFlags(flags: number): boolean {
        return (this.entityFlags() & flags) == flags;
    }
    hasTileFlag(flag: number): boolean {
        return this.tiles.some((t) => t && t.flags.tile & flag);
    }
    hasAllTileFlags(flags: number): boolean {
        return (this.tileFlags() & flags) == flags;
    }
    hasTileMechFlag(flag: number): boolean {
        return this.tiles.some((t) => t && t.flags.tileMech & flag);
    }
    hasAllTileMechFlags(flags: number): boolean {
        return (this.tileMechFlags() & flags) == flags;
    }

    hasTileTag(tag: string): boolean {
        return this.tiles.some((tile) => tile && tile.hasTag(tag));
    }
    hasAllTileTags(tags: string[]): boolean {
        return this.tiles.some((tile) => {
            return tile && tile.hasAllTags(tags);
        });
    }
    hasAnyTileTag(tags: string[]): boolean {
        return this.tiles.some((tile) => {
            return tile && tile.hasAnyTag(tags);
        });
    }

    cellFlags(): number {
        return this.flags.cell;
    }
    entityFlags(): number {
        return this.tiles.reduce((out, t) => out | (t ? t.flags.entity : 0), 0);
    }
    tileFlags(): number {
        return this.tiles.reduce((out, t) => out | (t ? t.flags.tile : 0), 0);
    }
    tileMechFlags(): number {
        return this.tiles.reduce(
            (out, t) => out | (t ? t.flags.tileMech : 0),
            0
        );
    }

    get needsRedraw() {
        return !!(this.flags.cell & Flags.Cell.NEEDS_REDRAW);
    }
    set needsRedraw(v: boolean) {
        if (v) {
            this.flags.cell |= Flags.Cell.NEEDS_REDRAW;
        } else {
            this.flags.cell &= ~Flags.Cell.NEEDS_REDRAW;
        }
    }

    get changed() {
        return !!(this.flags.cell & Flags.Cell.CHANGED);
    }

    depthPriority(depth: number): number {
        const tile = this.tiles[depth];
        return tile ? tile.priority : TILE.tiles.NULL.priority;
    }
    highestPriority(): number {
        return this.tiles.reduce(
            (out, t) => Math.max(out, t ? t.priority : 0),
            TILE.tiles.NULL.priority
        );
    }
    depthTile(depth: number): TILE.Tile | null {
        return this.tiles[depth] || null;
    }

    hasTile(tile?: string | number | TILE.Tile): boolean {
        if (!tile) return this.tiles.some((t) => t);
        if (!(tile instanceof TILE.Tile)) {
            tile = TILE.get(tile);
        }
        return this.tiles.includes(tile);
    }
    hasDepthTile(depth: number): boolean {
        const t = this.tiles[depth];
        return !!t && t !== TILE.tiles.NULL;
    }
    highestPriorityTile(): TILE.Tile {
        return this.tiles.reduce((out: TILE.Tile, tile: TILE.Tile | null) => {
            if (!tile) return out;
            if (tile.priority >= out.priority) return tile; // higher depth will get picked with >=
            return out;
        }, TILE.tiles.NULL)!;
    }
    get tile(): TILE.Tile {
        return this.highestPriorityTile();
    }
    eachTile(cb: EachCb<TILE.Tile>): void {
        this.tiles.forEach((t) => t && cb(t));
    }

    tileWithObjectFlag(flag: number) {
        return this.tiles.find((t) => t && t.flags.entity & flag) || null;
    }

    tileWithFlag(flag: number) {
        return this.tiles.find((t) => t && t.flags.tile & flag) || null;
    }

    tileWithMechFlag(flag: number) {
        return this.tiles.find((t) => t && t.flags.tileMech & flag) || null;
    }

    blocksVision(): boolean {
        return this.tiles.some((t) => t && t.blocksVision());
    }
    blocksPathing(): boolean {
        return this.tiles.some((t) => t && t.blocksPathing());
    }
    blocksMove(): boolean {
        return this.tiles.some((t) => t && t.blocksMove());
    }
    blocksEffects(): boolean {
        return this.tiles.some((t) => t && t.blocksEffects());
    }
    blocksLayer(depth: number): boolean {
        return this.tiles.some(
            (t) =>
                t &&
                !!(t.flags.tile & TILE.flags.Tile.T_BLOCKS_OTHER_LAYERS) &&
                t.depth != depth
        );
    }

    // Tests

    isNull(): boolean {
        return this.tiles.every((t) => !t || t === TILE.tiles.NULL);
    }
    isPassable() {
        return !this.blocksMove();
    }
    isWall(): boolean {
        return this.hasAllEntityFlags(Flags.Entity.L_WALL_FLAGS);
    }
    isStairs(): boolean {
        return this.hasTileFlag(Flags.Tile.T_HAS_STAIRS);
    }
    isFloor(): boolean {
        // Floor tiles do not block anything...
        return (
            !this.hasEntityFlag(Flags.Entity.L_BLOCKS_EVERYTHING) &&
            !this.hasTileFlag(Flags.Tile.T_PATHING_BLOCKER)
        );
    }
    isGateSite(): boolean {
        return this.hasCellFlag(Flags.Cell.IS_GATE_SITE);
    }
    isSecretlyPassable(): boolean {
        return this.hasEntityFlag(Flags.Entity.L_SECRETLY_PASSABLE);
    }
    // hasKey(): boolean {
    //     return this._entities.some(
    //         (e) => !!e.key && e.key.matches(this.x, this.y)
    //     );
    // }

    // @returns - whether or not the change results in a change to the cell tiles.
    //          - If there is a change to cell lighting, the cell will have the
    //          - LIGHT_CHANGED flag set.
    setTile(tile: string | number | TILE.Tile): boolean {
        if (!(tile instanceof TILE.Tile)) {
            tile = TILE.get(tile);
            if (!tile) return false;
        }

        const current = this.tiles[tile.depth] || TILE.tiles.NULL;
        if (current === tile) return false;

        this.tiles[tile.depth] = tile;
        this.needsRedraw = true;

        // if (current.light !== tile.light) {
        //     this.setCellFlag(Flags.Cell.LIGHT_CHANGED);
        // }
        // if (current.blocksVision() !== tile.blocksVision()) {
        //     this.setCellFlag(Flags.Cell.FOV_CHANGED);
        // }

        // if (volume) {
        //     if (tile.depth === Depth.GAS) {
        //         this.gasVolume = volume;
        //     }
        //     if (tile.depth === Depth.LIQUID) {
        //         this.liquidVolume = volume;
        //     }
        // }

        return true;
    }
    clearTiles(tile?: string | number | TILE.Tile) {
        this.tiles[0] = TILE.tiles.NULL;
        for (let i = 1; i < this.tiles.length; ++i) {
            this.tiles[i] = null;
        }
        if (tile) {
            this.setTile(tile);
        }
        this.needsRedraw = true;
    }

    clear(tile?: number | string | TILE.Tile) {
        this.tiles = [TILE.tiles.NULL];
        this.flags.cell = 0;
        this.needsRedraw = true;
        this.chokeCount = 0;
        this.machineId = 0;
        if (tile) {
            this.setTile(tile);
        }
        this.snapshot.blackOut();
    }
    clearDepth(depth: Flags.Depth): boolean {
        if (depth == 0) {
            this.tiles[0] = TILE.tiles.NULL;
            this.needsRedraw = true;
            return true;
        } else if (this.tiles[depth] !== null) {
            this.tiles[depth] = null;
            this.needsRedraw = true;
            return true;
        }
        return false;
    }
    clearDepthsWithFlags(tileFlag: number, tileMechFlag = 0): void {
        for (let i = 0; i < this.tiles.length; ++i) {
            const tile = this.tiles[i];
            if (!tile) continue;
            if (!tile.hasTileFlag(tileFlag)) continue;
            if (tileMechFlag && !tile.hasTileMechFlag(tileMechFlag)) continue;
            this.clearDepth(i);
        }
    }

    // Lights

    eachGlowLight(cb: (light: GWU.light.LightType) => any) {
        this.tiles.forEach((tile) => {
            if (tile && tile.light) cb(tile.light);
        });
    }

    // Effects

    async fire(
        event: string,
        map: MapType,
        x: number,
        y: number,
        ctx: Partial<Effect.EffectCtx> = {}
    ): Promise<boolean> {
        ctx.cell = this;
        let didSomething = false;

        if (ctx.depth !== undefined) {
            const tile = (ctx.tile = this.depthTile(ctx.depth));
            if (tile && tile.effects) {
                const ev = tile.effects[event];
                didSomething = await this._activate(ev, map, x, y, ctx);
            }
        } else {
            // console.log('fire event - %s', event);
            for (ctx.tile of this.tiles) {
                if (!ctx.tile || !ctx.tile.effects) continue;
                const ev = ctx.tile.effects[event];
                // console.log(' - ', ev);

                if (await this._activate(ev, map, x, y, ctx)) {
                    didSomething = true;
                    break;
                }
                // }
            }
        }
        return didSomething;
    }

    async _activate(
        effect: string | Effect.EffectInfo,
        map: MapType,
        x: number,
        y: number,
        ctx: Partial<Effect.EffectCtx>
    ) {
        if (typeof effect === 'string') {
            effect = Effect.effects[effect];
        }
        let didSomething = false;
        if (effect) {
            // console.log(' - spawn event @%d,%d - %s', x, y, name);
            didSomething = await Effect.fire(effect, map, x, y, ctx);
            // cell.debug(" - spawned");
        }
        return didSomething;
    }

    hasEffect(name: string) {
        for (let tile of this.tiles) {
            if (tile && tile.hasEffect(name)) return true;
        }
        return false;
    }

    // // Items

    hasItem(): boolean {
        return this.hasCellFlag(Flags.Cell.HAS_ITEM);
    }
    addItem(item: Item): void {
        this.setCellFlag(Flags.Cell.HAS_ITEM);
        item.x = this.x;
        item.y = this.y;
        item.map = this.map;

        this.map.items.push(item);
        this.needsRedraw = true;
    }
    removeItem(item: Item): boolean {
        let hasItems = false;
        let foundIndex = -1;
        this.map.items.forEach((obj, index) => {
            if (obj === item) {
                foundIndex = index;
            } else if (obj.x === this.x && obj.y === this.y) {
                hasItems = true;
            }
        });
        if (!hasItems) {
            this.clearCellFlag(Flags.Cell.HAS_ITEM);
        }
        if (foundIndex < 0) return false;
        this.map.items.splice(foundIndex, 1); // delete the item
        this.needsRedraw = true;
        return true;
    }

    // // Actors

    hasActor(): boolean {
        return this.hasCellFlag(Flags.Cell.HAS_ACTOR);
    }
    hasPlayer(): boolean {
        return this.hasCellFlag(Flags.Cell.HAS_PLAYER);
    }
    addActor(actor: Actor): void {
        this.setCellFlag(Flags.Cell.HAS_ACTOR);
        if (actor.isPlayer()) {
            this.setCellFlag(Flags.Cell.HAS_PLAYER);
        }
        actor.x = this.x;
        actor.y = this.y;
        actor.map = this.map;

        this.map.actors.push(actor);
        this.needsRedraw = true;
    }
    removeActor(actor: Actor): boolean {
        let hasActor = false;
        let foundIndex = -1;
        this.map.actors.forEach((obj, index) => {
            if (obj === actor) {
                foundIndex = index;
            } else if (obj.x === this.x && obj.y === this.y) {
                hasActor = true;
            }
        });
        if (!hasActor) {
            this.clearCellFlag(Flags.Cell.HAS_ACTOR | Flags.Cell.HAS_PLAYER);
        }
        if (foundIndex < 0) return false;
        this.map.actors.splice(foundIndex, 1); // delete the actor
        this.needsRedraw = true;
        return true;
    }

    getDescription() {
        return this.highestPriorityTile().description;
    }

    getFlavor() {
        return this.highestPriorityTile().flavor;
    }

    getName(opts = {}) {
        return this.highestPriorityTile().getName(opts);
    }

    dump(): string {
        return this.highestPriorityTile().sprite.ch || ' ';
    }

    drawStatus(sidebar: StatusDrawer): void {
        if (!this.map) return;

        this.map.getAppearanceAt(this.x, this.y, sidebar.mixer);
        sidebar.drawTitle(sidebar.mixer, this.getName());
    }

    toString() {
        return `Cell @ ${this.x},${this.y}`;
    }
}
