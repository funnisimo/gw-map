import * as GWU from 'gw-utils';

import * as Flags from '../flags';
import { Tile } from '../tile/tile';
import { Item } from '../item/item';
import { Actor } from '../actor/actor';
import { Entity } from '../entity';
import { Map } from './map';

import * as TILE from '../tile';
import * as Effect from '../effect';

export interface CellFlags {
    cell: number;
}

export interface SetOptions {
    superpriority: boolean;
    blockedByOtherLayers: boolean;
    blockedByActors: boolean;
    blockedByItems: boolean;
    volume: number;
    machine: number;
}

export type SetTileOptions = Partial<SetOptions>;

type EachCb<T> = (t: T) => any;

export type TileData = Tile | null;
export type TileArray = [Tile, ...TileData[]];

GWU.color.install('cellStatusName', 'light_blue');

export interface CellMemoryFlags extends CellFlags {
    entity: number;
    tile: number;
    tileMech: number;
}

export interface CellMemory {
    tiles: TileArray;
    item: Item | null;
    actor: Actor | null;
    flags: CellMemoryFlags;
}

export const NEVER_SEEN: CellMemory = {
    tiles: [TILE.NULL],
    item: null,
    actor: null,
    flags: {
        cell: 0,
        entity: TILE.NULL.flags.entity,
        tile: TILE.NULL.flags.tile,
        tileMech: TILE.NULL.flags.tileMech,
    },
};

export class Cell {
    flags: CellFlags;
    chokeCount = 0;
    tiles: TileArray;
    machineId = 0;
    // _actor: Actor | null = null;
    // _item: Item | null = null;
    // _entities: CellEntities;
    map: Map;
    x = -1;
    y = -1;
    snapshot: GWU.sprite.Mixer;
    // toFire: Partial<Effect.EffectCtx>[] = [];
    memory: CellMemory | null = null;

    constructor(
        map: Map,
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

        this.memory = NEVER_SEEN;
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

    storeMemory() {
        this.setCellFlag(Flags.Cell.STABLE_MEMORY);

        // store memory
        this.memory = {
            flags: {
                cell: this.flags.cell,
                entity: this.tiles.reduce(
                    (out, tile) => out | (tile?.flags.entity || 0),
                    0
                ),
                tile: this.tiles.reduce(
                    (out, tile) => out | (tile?.flags.tile || 0),
                    0
                ),
                tileMech: this.tiles.reduce(
                    (out, tile) => out | (tile?.flags.tileMech || 0),
                    0
                ),
            },
            tiles: this.tiles.slice() as TileArray,
            item: this.item?.clone() || null,
            actor: null,
        };

        if (this.hasItem()) {
            const item = this.item;
            if (item) {
                this.memory.flags.entity |= item.flags.entity;
            }
        }
        if (this.hasActor()) {
            const actor = this.actor;
            if (actor) {
                this.memory.flags.entity |= actor.flags.entity;
            }
            this.clearCellFlag(Flags.Cell.STABLE_SNAPSHOT);
        }
    }

    clearMemory() {
        this.clearCellFlag(
            Flags.Cell.STABLE_SNAPSHOT | Flags.Cell.STABLE_MEMORY
        );
        this.memory = null;
        this.needsRedraw = true;
    }

    copy(other: Cell) {
        Object.assign(this.flags, other.flags);
        this.chokeCount = other.chokeCount;
        this.tiles.length = other.tiles.length;
        for (let i = 0; i < this.tiles.length; ++i) {
            this.tiles[i] = other.tiles[i];
        }
        this.machineId = other.machineId;
        // this._actor = other.actor;
        // this._item = other.item;
        this.memory = other.memory;
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
            if (!this.memory) {
                this.flags.cell |= Flags.Cell.NEEDS_REDRAW;
                this.flags.cell &= ~Flags.Cell.STABLE_SNAPSHOT;

                this.map.needsRedraw = true;
            }
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
        return (
            this.tiles.some((t) => t && t.blocksPathing()) &&
            !this.tiles.some((t) => t && t.hasTileFlag(Flags.Tile.T_BRIDGE))
        );
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
    isDoor(): boolean {
        return this.hasTileFlag(Flags.Tile.T_IS_DOOR);
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

    hasLiquid(): boolean {
        return this.hasTileFlag(Flags.Tile.T_ANY_LIQUID);
    }

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
            const currentGround = this.depthTile(Flags.Depth.GROUND);
            const wantGround = TILE.get(tile.groundTile);
            if (currentGround !== wantGround) {
                if (!this.setTile(wantGround, opts)) {
                    return false;
                }
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
            current.hasTileFlag(Flags.Tile.T_LIST_IN_SIDEBAR) !==
            tile.hasTileFlag(Flags.Tile.T_LIST_IN_SIDEBAR)
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

    tileWithEffect(name: string): TILE.Tile | null {
        return this.tiles.find((t) => t?.hasEffect(name)) || null;
    }

    fireEvent(event: string, ctx: Effect.EffectCtx = {}): boolean {
        // ctx.cell = this;
        let didSomething = false;

        // console.log('fire event - %s', event);
        for (const tile of this.tiles) {
            if (!tile || !tile.effects) continue;
            const ev = tile.effects[event];
            if (ev) {
                const r = this._activate(ev, ctx);
                if (r) {
                    didSomething = true;
                }
            }
        }
        return didSomething;
    }

    _activate(effect: string | Effect.Effect, ctx: Effect.EffectCtx): boolean {
        if (typeof effect === 'string') {
            effect = Effect.installedEffects[effect];
        }
        let didSomething = false;
        if (effect) {
            // console.log(' - spawn event @%d,%d - %s', x, y, name);
            didSomething = effect.trigger(this, ctx);
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

    canAddItem(_item: Item): boolean {
        return true;
    }

    canRemoveItem(_item: Item): boolean {
        return true;
    }

    _addItem(_item: Item): boolean {
        this.setCellFlag(Flags.Cell.HAS_ITEM);
        this.needsRedraw = true;
        // this.clearCellFlag(Flags.Cell.STABLE_SNAPSHOT);
        return true;
    }
    _removeItem(item: Item): boolean {
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
        this.needsRedraw = true;
        // this.clearCellFlag(Flags.Cell.STABLE_SNAPSHOT);
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

    canAddActor(_actor: Actor): boolean {
        return !this.hasActor();
    }

    canRemoveActor(_actor: Actor): boolean {
        return true;
    }

    _addActor(actor: Actor): boolean {
        this.setCellFlag(Flags.Cell.HAS_ACTOR);
        if (actor.isPlayer()) {
            this.setCellFlag(Flags.Cell.HAS_PLAYER);
        }
        this.needsRedraw = true;
        // this.clearCellFlag(Flags.Cell.STABLE_SNAPSHOT);

        return true;
    }
    _removeActor(actor: Actor): boolean {
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
        this.needsRedraw = true;
        // this.clearCellFlag(Flags.Cell.STABLE_SNAPSHOT);

        return true;
    }

    hasFx(): boolean {
        return !!(this.flags.cell & Flags.Cell.HAS_FX);
    }
    get fx(): Entity | null {
        return this.map.fxAt(this.x, this.y);
    }
    _addFx(_fx: Entity) {
        this.setCellFlag(Flags.Cell.HAS_FX);
        this.needsRedraw = true;
    }
    _removeFx(_fx: Entity) {
        if (!this.fx) {
            this.clearCellFlag(Flags.Cell.HAS_FX);
        }
        this.needsRedraw = true;
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
        if (this.hasTileFlag(Flags.Tile.T_BRIDGE)) {
            return '=';
        }
        return this.highestPriorityTile().sprite.ch || ' ';
    }

    drawSidebar(buffer: GWU.buffer.Buffer, bounds: GWU.xy.Bounds): number {
        const mixer = new GWU.sprite.Mixer();

        this.map.getAppearanceAt(this.x, this.y, mixer);

        buffer.drawSprite(bounds.x + 1, bounds.y, mixer);
        buffer.wrapText(
            bounds.x + 3,
            bounds.y,
            bounds.width - 3,
            this.getName(),
            'cellStatusName'
        );

        return 1;
    }

    toString() {
        return `Cell @ ${this.x},${this.y}`;
    }
}
