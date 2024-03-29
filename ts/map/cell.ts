import * as GWU from 'gw-utils';

import * as Flags from '../flags';
import {
    CellType,
    CellInfoType,
    CellFlags,
    MapType,
    TileArray,
    SetTileOptions,
} from './types';
import { Item } from '../item/item';
import { Actor } from '../actor/actor';

import * as TILE from '../tile';
import * as Effect from '../effect';

type EachCb<T> = (t: T) => any;

GWU.color.install('cellStatusName', 'light_blue');

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
    toFire: Partial<Effect.EffectCtx>[] = [];

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

    hasEntityFlag(flag: number, checkEntities = false): boolean {
        if (this.tiles.some((t) => t && t.flags.entity & flag)) return true;
        if (!checkEntities) return false;
        if (this.hasItem()) {
            if (this.item?.hasEntityFlag(flag)) return true;
        }
        if (this.hasActor()) {
            if (this.actor?.hasEntityFlag(flag)) return true;
        }
        return false;
    }
    hasAllEntityFlags(flags: number, checkEntities = false): boolean {
        return (this.entityFlags(checkEntities) & flags) == flags;
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
    entityFlags(withEntities = false): number {
        let flag = this.tiles.reduce(
            (out, t) => out | (t ? t.flags.entity : 0),
            0
        );
        if (withEntities) {
            if (this.hasItem()) {
                flag |= this.item?.flags.entity || 0;
            }
            if (this.hasActor()) {
                flag |= this.actor?.flags.entity || 0;
            }
        }
        return flag;
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
    setTile(
        tile: string | number | TILE.Tile,
        opts: SetTileOptions = {}
    ): boolean {
        if (!(tile instanceof TILE.Tile)) {
            tile = TILE.get(tile);
            if (!tile) return false;
        }

        const current = this.tiles[tile.depth] || TILE.tiles.NULL;
        if (current === tile) return false;

        if (!opts.superpriority) {
            // if (current !== tile) {
            //     this.gasVolume = 0;
            //     this.liquidVolume = 0;
            // }

            // Check priority, etc...
            if (current.priority > tile.priority) {
                return false;
            }
        }
        if (this.blocksLayer(tile.depth)) return false;
        if (opts.blockedByItems && this.hasItem()) return false;
        if (opts.blockedByActors && this.hasActor()) return false;
        if (opts.blockedByOtherLayers && this.highestPriority() > tile.priority)
            return false;

        // TODO - Are we blocked by other layer (L_BLOCKS_SURFACE on an already present tile)?

        if (tile.depth > Flags.Depth.GROUND && tile.groundTile) {
            const ground = this.depthTile(Flags.Depth.GROUND);
            if (!ground || ground === TILE.tiles.NULL) {
                this.tiles[0] = TILE.get(tile.groundTile);
            }
        }

        this.tiles[tile.depth] = tile;
        this.needsRedraw = true;

        if (tile.hasEntityFlag(Flags.Entity.L_BLOCKS_SURFACE)) {
            this.clearDepth(Flags.Depth.SURFACE);
        }

        if (opts.machine) {
            this.machineId = opts.machine;
        }

        if (current.light !== tile.light) {
            this.map.light.glowLightChanged = true;
        }

        if (
            current.hasEntityFlag(Flags.Entity.L_LIST_IN_SIDEBAR) !==
            tile.hasEntityFlag(Flags.Entity.L_LIST_IN_SIDEBAR)
        ) {
            this.map.setMapFlag(Flags.Map.MAP_SIDEBAR_TILES_CHANGED);
        }

        if (tile.hasTileFlag(Flags.Tile.T_IS_FIRE)) {
            this.setCellFlag(Flags.Cell.CAUGHT_FIRE_THIS_TURN);
        }

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

    needsToFire(): boolean {
        return this.toFire.length > 0;
    }
    willFire(event: string): boolean {
        return !!this.toFire.find((ctx) => ctx.event === event);
    }
    clearEvents(): void {
        this.toFire.length = 0;
    }
    tileWithEffect(name: string): TILE.Tile | null {
        return this.tiles.find((t) => t?.hasEffect(name)) || null;
    }

    async fireAll(): Promise<boolean> {
        let ctx: Partial<Effect.EffectCtx>;
        let didSomething = false;

        for (ctx of this.toFire) {
            didSomething =
                (await this.fireEvent(ctx.event, ctx)) || didSomething;
        }
        this.toFire.length = 0; // clear

        return didSomething;
    }

    async fireEvent(
        event: string,
        ctx: Partial<Effect.EffectCtx> = {}
    ): Promise<boolean> {
        ctx.cell = this;
        let didSomething = false;

        // console.log('fire event - %s', event);
        for (ctx.tile of this.tiles) {
            if (!ctx.tile || !ctx.tile.effects) continue;
            const ev = ctx.tile.effects[event];
            if (ev && (await this._activate(ev, ctx))) {
                didSomething = true;
            }
        }
        return didSomething;
    }

    async _activate(
        effect: string | Effect.EffectInfo,
        ctx: Partial<Effect.EffectCtx>
    ) {
        if (typeof effect === 'string') {
            effect = Effect.effects[effect];
        }
        let didSomething = false;
        if (effect) {
            // console.log(' - spawn event @%d,%d - %s', x, y, name);
            didSomething = await Effect.fire(
                effect,
                this.map,
                this.x,
                this.y,
                ctx
            );
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
    get item(): Item | null {
        return this.map.itemAt(this.x, this.y);
    }

    addItem(item: Item, withEffects = false): void {
        this.setCellFlag(Flags.Cell.HAS_ITEM);
        item.addToMap(this.map, this.x, this.y);
        this.map.items.push(item);
        this.needsRedraw = true;
        // this.clearCellFlag(Flags.Cell.STABLE_SNAPSHOT);

        if (withEffects) {
            if (
                item.key &&
                item.key.matches(this.x, this.y) &&
                this.hasEffect('key')
            ) {
                const tile = this.tileWithEffect('key');
                this.toFire.push({
                    event: 'key',
                    key: item,
                    item,
                    tile,
                    cell: this,
                });
            } else if (this.hasEffect('add_item')) {
                const tile = this.tileWithEffect('add_item');
                this.toFire.push({ event: 'add_item', item, tile, cell: this });
            }
        }
    }
    removeItem(item: Item, withEffects = false): boolean {
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
        item.removeFromMap();
        this.needsRedraw = true;
        // this.clearCellFlag(Flags.Cell.STABLE_SNAPSHOT);

        if (withEffects) {
            if (item.isKey(this.x, this.y) && this.hasEffect('no_key')) {
                const tile = this.tileWithEffect('no_key');
                this.toFire.push({
                    event: 'no_key',
                    key: item,
                    item,
                    tile,
                    cell: this,
                });
            } else if (this.hasEffect('remove_item')) {
                const tile = this.tileWithEffect('remove_item');
                this.toFire.push({
                    event: 'remove_item',
                    item,
                    tile,
                    cell: this,
                });
            }
        }
        return true;
    }

    // // Actors

    hasActor(): boolean {
        return this.hasCellFlag(Flags.Cell.HAS_ACTOR);
    }
    hasPlayer(): boolean {
        return this.hasCellFlag(Flags.Cell.HAS_PLAYER);
    }
    get actor(): Actor | null {
        return this.map.actorAt(this.x, this.y);
    }

    addActor(actor: Actor, withEffects = false): void {
        this.setCellFlag(Flags.Cell.HAS_ACTOR);
        if (actor.isPlayer()) {
            this.setCellFlag(Flags.Cell.HAS_PLAYER);
        }
        actor.addToMap(this.map, this.x, this.y);
        this.map.actors.push(actor);
        this.needsRedraw = true;
        // this.clearCellFlag(Flags.Cell.STABLE_SNAPSHOT);

        if (withEffects) {
            if (actor.isKey(this.x, this.y) && this.hasEffect('key')) {
                const tile = this.tileWithEffect('key');
                this.toFire.push({
                    event: 'key',
                    key: actor,
                    actor,
                    tile,
                    cell: this,
                });
            } else if (actor.isPlayer() && this.hasEffect('add_player')) {
                const tile = this.tileWithEffect('add_player');
                this.toFire.push({
                    event: 'add_player',
                    actor,
                    player: actor,
                    tile,
                    cell: this,
                });
            } else if (this.hasEffect('add_actor')) {
                const tile = this.tileWithEffect('add_actor');
                this.toFire.push({
                    event: 'add_actor',
                    actor,
                    tile,
                    cell: this,
                });
            }
        }
    }
    removeActor(actor: Actor, withEffects = false): boolean {
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
        actor.removeFromMap();
        this.map.actors.splice(foundIndex, 1); // delete the actor
        this.needsRedraw = true;
        // this.clearCellFlag(Flags.Cell.STABLE_SNAPSHOT);

        if (withEffects) {
            if (actor.isKey(this.x, this.y) && this.hasEffect('no_key')) {
                const tile = this.tileWithEffect('no_key');
                this.toFire.push({
                    event: 'no_key',
                    key: actor,
                    actor,
                    tile,
                    cell: this,
                });
            } else if (actor.isPlayer() && this.hasEffect('remove_player')) {
                const tile = this.tileWithEffect('remove_player');
                this.toFire.push({
                    event: 'remove_player',
                    actor,
                    player: actor,
                    tile,
                    cell: this,
                });
            } else if (this.hasEffect('remove_actor')) {
                const tile = this.tileWithEffect('remove_actor');
                this.toFire.push({
                    event: 'remove_actor',
                    actor,
                    tile,
                    cell: this,
                });
            }
        }

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
        if (this.hasActor()) {
            const actor = this.map.actorAt(this.x, this.y);
            if (actor && actor.sprite.ch) return actor.sprite.ch;
        }
        if (this.hasItem()) {
            const item = this.map.itemAt(this.x, this.y);
            if (item && item.sprite.ch) return item.sprite.ch;
        }
        return this.highestPriorityTile().sprite.ch || ' ';
    }

    drawStatus(buffer: GWU.buffer.Buffer, bounds: GWU.xy.Bounds): number {
        const lines = buffer.wrapText(
            bounds.x + 1,
            bounds.y,
            bounds.width - 1,
            this.getName(),
            'cellStatusName'
        );
        return lines;
    }

    toString() {
        return `Cell @ ${this.x},${this.y}`;
    }
}
