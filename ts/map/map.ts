import * as GWU from 'gw-utils';

import * as Flags from '../flags';
import { Cell } from './cell';
import * as TILE from '../tile';
import { Tile } from '../tile';
import * as Layer from '../layer';
import { Item } from '../item';
import { Actor } from '../actor';
import { Entity } from '../entity';
import {
    MapType,
    EachCellCb,
    MapTestFn,
    SetTileOptions,
    CellType,
} from './types';
// import { CellMemory } from './cellMemory';
import * as Effect from '../effect';
import { CellDrawer, MapDrawOptions, BufferSource } from '../draw/types';
import { BasicDrawer } from '../draw/basic';

export interface MapOptions extends GWU.light.LightSystemOptions {
    // GWU.fov.FovSystemOptions {
    tile: string | true;
    boundary: string | true;
    seed: number;
    id: string;
    drawer: CellDrawer;
}

export type LayerType = Layer.TileLayer | Layer.ActorLayer | Layer.ItemLayer;

export class Map
    implements GWU.light.LightSystemSite, MapType, GWU.tween.Animator {
    width: number;
    height: number;
    cells: GWU.grid.Grid<Cell>;
    layers: LayerType[];
    flags: { map: 0 };
    light: GWU.light.LightSystemType;
    // fov: GWU.fov.FovSystemType;
    properties: Record<string, any>;
    // _memory: GWU.grid.Grid<CellMemory>;
    machineCount = 0;
    private _seed = 0;
    rng: GWU.rng.Random = GWU.rng.random;
    id = 'MAP';
    actors: Actor[] = [];
    items: Item[] = [];
    drawer: CellDrawer;
    fx: Entity[] = [];
    _animations: GWU.tween.Animation[] = [];

    constructor(width: number, height: number, opts: Partial<MapOptions> = {}) {
        this.width = width;
        this.height = height;
        this.flags = { map: 0 };
        this.layers = [];
        if (opts.id) {
            this.id = opts.id;
        }
        this.drawer = opts.drawer || new BasicDrawer();

        this.cells = GWU.grid.make(
            width,
            height,
            (x, y) => new Cell(this, x, y)
        );
        // this._memory = GWU.grid.make(
        //     width,
        //     height,
        //     (x, y) => new CellMemory(this, x, y)
        // );

        if (opts.seed) {
            this._seed = opts.seed;
            this.rng = GWU.rng.make(opts.seed);
        }

        this.light = new GWU.light.LightSystem(this, opts);
        // this.fov = new GWU.fov.FovSystem(this, opts);
        this.properties = {};

        this.initLayers();
    }

    get seed(): number {
        return this._seed;
    }
    set seed(v: number) {
        this._seed = v;
        this.rng = GWU.rng.make(v);
    }

    // memory(x: number, y: number): CellMemory {
    //     return this._memory[x][y];
    // }

    // knowledge(x: number, y: number): CellInfoType {
    //     if (this.fov.isAnyKindOfVisible(x, y)) return this.cell(x,y);
    //     return this._memory[x][y];
    // }

    // LAYERS

    initLayers() {
        this.addLayer(Flags.Depth.GROUND, new Layer.TileLayer(this, 'ground'));
        this.addLayer(
            Flags.Depth.SURFACE,
            new Layer.FireLayer(this, 'surface')
        );
        this.addLayer(Flags.Depth.GAS, new Layer.GasLayer(this, 'gas'));
        this.addLayer(Flags.Depth.ITEM, new Layer.ItemLayer(this, 'item'));
        this.addLayer(Flags.Depth.ACTOR, new Layer.ActorLayer(this, 'actor'));
    }

    addLayer(depth: number | keyof typeof Flags.Depth, layer: LayerType) {
        if (typeof depth !== 'number') {
            depth = Flags.Depth[depth as keyof typeof Flags.Depth];
        }

        layer.depth = depth;
        this.layers[depth] = layer;
    }

    removeLayer(depth: number | keyof typeof Flags.Depth) {
        if (typeof depth !== 'number') {
            depth = Flags.Depth[depth as keyof typeof Flags.Depth];
        }
        if (!depth) throw new Error('Cannot remove layer with depth=0.');
        delete this.layers[depth];
    }

    getLayer(depth: number | keyof typeof Flags.Depth): LayerType | null {
        if (typeof depth !== 'number') {
            depth = Flags.Depth[depth as keyof typeof Flags.Depth];
        }
        return this.layers[depth] || null;
    }

    hasXY(x: number, y: number): boolean {
        return this.cells.hasXY(x, y);
    }
    isBoundaryXY(x: number, y: number): boolean {
        return x == 0 || y == 0 || x == this.width - 1 || y == this.height - 1;
    }

    cell(x: number, y: number): CellType {
        return this.cells[x][y];
    }
    get(x: number, y: number): Cell | undefined {
        return this.cells.get(x, y);
    }
    eachCell(cb: EachCellCb) {
        this.cells.forEach((cell, x, y) => cb(cell, x, y, this));
    }

    // items

    hasItem(x: number, y: number): boolean {
        return this.cell(x, y).hasItem();
    }
    itemAt(x: number, y: number): Item | null {
        return this.items.find((i) => i.isAt(x, y)) || null;
    }
    eachItem(cb: GWU.types.EachCb<Item>): void {
        this.items.forEach(cb);
    }

    addItem(
        x: number,
        y: number,
        item: Item,
        fireEffects: boolean
    ): boolean | Promise<boolean>;
    addItem(x: number, y: number, item: Item): boolean;
    addItem(
        x: number,
        y: number,
        item: Item,
        fireEffects = false
    ): boolean | Promise<boolean> {
        if (!this.hasXY(x, y)) return false;
        const cell = this.cell(x, y);
        cell.addItem(item, fireEffects);
        if (!fireEffects) return true;
        return cell.fireAll().then(() => true);
    }

    removeItem(item: Item, fireEffects: boolean): boolean | Promise<boolean>;
    removeItem(item: Item): boolean;
    removeItem(item: Item, fireEffects = false): boolean | Promise<boolean> {
        const cell = this.cell(item.x, item.y);
        if (!cell.removeItem(item, fireEffects)) return false;
        if (!fireEffects) return true;
        return cell.fireAll().then(() => true);
    }
    // async moveItem(item: Item, dir: GWU.xy.Loc | number): Promise<boolean> {
    //     if (typeof dir === 'number') {
    //         dir = GWU.xy.DIRS[dir];
    //     }
    //     const oldX = item.x;
    //     const oldY = item.y;
    //     const x = oldX + dir[0];
    //     const y = oldY + dir[1];
    //     if (!this.hasXY(x, y)) return false;

    //     const layer = this.layers[item.depth] as Layer.ItemLayer;
    //     if (!(await layer.removeItem(item))) return false;
    //     if (!(await this.addItem(x, y, item))) {
    //         layer.forceItem(item.x, item.y, item);
    //         return false;
    //     }

    //     // const wasVisible = this.fov.isAnyKindOfVisible(oldX, oldY);
    //     // const isVisible = this.fov.isAnyKindOfVisible(x, y);
    //     // if (isVisible && !wasVisible) {
    //     //     if (item.lastSeen) {
    //     //         this._memory[item.lastSeen.x][item.lastSeen.y].removeItem(item);
    //     //         this.clearCellFlag(
    //     //             item.lastSeen.x,
    //     //             item.lastSeen.y,
    //     //             Flags.Cell.STABLE_SNAPSHOT
    //     //         );
    //     //         item.lastSeen = null;
    //     //     }
    //     // } else if (wasVisible && !isVisible) {
    //     //     const mem = this._memory[x][y];
    //     //     mem.item = item;
    //     //     this.clearCellFlag(x, y, Flags.Cell.STABLE_SNAPSHOT);
    //     //     item.lastSeen = this.cell(x, y);
    //     // }

    //     return true;
    // }

    // Actors

    hasPlayer(x: number, y: number): boolean {
        return this.cell(x, y).hasPlayer();
    }
    actorAt(x: number, y: number): Actor | null {
        return this.actors.find((a) => a.isAt(x, y)) || null;
    }
    eachActor(cb: GWU.types.EachCb<Actor>): void {
        this.actors.forEach(cb);
    }
    addActor(
        x: number,
        y: number,
        actor: Actor,
        fireEffects: boolean
    ): boolean | Promise<boolean>;
    addActor(x: number, y: number, actor: Actor): boolean;
    addActor(
        x: number,
        y: number,
        actor: Actor,
        fireEffects = false
    ): boolean | Promise<boolean> {
        if (!this.hasXY(x, y)) return false;
        const cell = this.cell(x, y);
        cell.addActor(actor, fireEffects);
        if (!fireEffects) return true;

        return cell.fireAll().then(() => true);
    }

    removeActor(actor: Actor, fireEffects: boolean): boolean | Promise<boolean>;
    removeActor(actor: Actor): boolean;
    removeActor(actor: Actor, fireEffects = false): boolean | Promise<boolean> {
        const cell = this.cell(actor.x, actor.y);
        if (!cell.removeActor(actor, fireEffects)) return false;
        if (!fireEffects) return true;

        return cell.fireAll().then(() => true);
    }
    // async moveActor(actor: Actor, dir: GWU.xy.Loc | number): Promise<boolean> {
    //     if (typeof dir === 'number') {
    //         dir = GWU.xy.DIRS[dir];
    //     }
    //     const oldX = actor.x;
    //     const oldY = actor.y;
    //     const x = oldX + dir[0];
    //     const y = oldY + dir[1];

    //     if (!this.hasXY(x, y)) return false;

    //     const layer = this.layers[actor.depth] as Layer.ActorLayer;
    //     if (!(await layer.removeActor(actor))) return false;
    //     if (!(await layer.addActor(x, y, actor))) {
    //         layer.forceActor(actor.x, actor.y, actor);
    //         return false;
    //     }

    //     // const wasVisible = this.fov.isAnyKindOfVisible(oldX, oldY);
    //     // const isVisible = this.fov.isAnyKindOfVisible(x, y);
    //     // if (isVisible && !wasVisible) {
    //     //     if (actor.lastSeen) {
    //     //         this._memory[actor.lastSeen.x][actor.lastSeen.y].removeActor(
    //     //             actor
    //     //         );
    //     //         this.clearCellFlag(
    //     //             actor.lastSeen.x,
    //     //             actor.lastSeen.y,
    //     //             Flags.Cell.STABLE_SNAPSHOT
    //     //         );
    //     //         actor.lastSeen = null;
    //     //     }
    //     // } else if (wasVisible && !isVisible) {
    //     //     const mem = this._memory[x][y];
    //     //     mem.actor = actor;
    //     //     this.clearCellFlag(x, y, Flags.Cell.STABLE_SNAPSHOT);
    //     //     actor.lastSeen = this.cell(x, y);
    //     // }

    //     return true;
    // }

    fxAt(x: number, y: number): Entity | null {
        return this.fx.find((i) => i.isAt(x, y)) || null;
    }
    eachFx(cb: GWU.types.EachCb<Entity>): void {
        this.fx.forEach(cb);
    }

    addFx(x: number, y: number, fx: Entity): boolean {
        const cell = this.get(x, y);
        if (!cell) return false;

        fx.x = x;
        fx.y = y;
        cell._addFx(fx);
        this.fx.push(fx);
        return true;
    }
    moveFx(fx: Entity, x: number, y: number): boolean {
        const current = this.get(fx.x, fx.y)!;
        const updated = this.get(x, y);
        if (!updated) return false;
        current._removeFx(fx);
        fx.x = x;
        fx.y = y;
        updated._addFx(fx);
        return true;
    }

    removeFx(fx: Entity): boolean {
        const cell = this.get(fx.x, fx.y);
        GWU.arrayDelete(this.fx, fx);
        if (cell) {
            cell._removeFx(fx);
        }
        return true;
    }

    // Information

    // isVisible(x: number, y: number): boolean {
    //     return this.fov.isAnyKindOfVisible(x, y);
    // }
    hasKey(x: number, y: number): boolean {
        const actor = this.actorAt(x, y);
        if (actor && actor.isKey(x, y)) return true;
        const item = this.itemAt(x, y);
        if (item && item.isKey(x, y)) return true;
        return false;
    }

    count(cb: MapTestFn): number {
        return this.cells.count((cell, x, y) => cb(cell, x, y, this));
    }
    dump(fmt?: GWU.grid.GridFormat<Cell>, log = console.log) {
        const getCh = (cell: Cell) => {
            return cell.dump();
        };
        this.cells.dump(fmt || getCh, log);
    }

    // flags

    hasMapFlag(flag: number): boolean {
        return !!(this.flags.map & flag);
    }
    setMapFlag(flag: number): void {
        this.flags.map |= flag;
    }
    clearMapFlag(flag: number): void {
        this.flags.map &= ~flag;
    }

    get needsRedraw(): boolean {
        return this.hasMapFlag(Flags.Map.MAP_NEEDS_REDRAW);
    }
    set needsRedraw(v: boolean) {
        if (v) this.setMapFlag(Flags.Map.MAP_NEEDS_REDRAW);
        else this.clearMapFlag(Flags.Map.MAP_NEEDS_REDRAW);
    }

    hasCellFlag(x: number, y: number, flag: number) {
        return this.cell(x, y).hasCellFlag(flag);
    }
    setCellFlag(x: number, y: number, flag: number) {
        this.cell(x, y).setCellFlag(flag);
    }
    clearCellFlag(x: number, y: number, flag: number) {
        this.cell(x, y).clearCellFlag(flag);
    }

    hasEntityFlag(x: number, y: number, flag: number) {
        return this.cell(x, y).hasEntityFlag(flag);
    }

    clear() {
        this.light.glowLightChanged = true;
        // this.fov.needsUpdate = true;
        this.layers.forEach((l) => l.clear());
    }

    clearCell(x: number, y: number, tile?: number | string | Tile) {
        const cell = this.cell(x, y);
        cell.clear(tile);
    }

    // Skips all the logic checks and just forces a clean cell with the given tile
    fill(tile: string | number | Tile, boundary?: string | number | Tile) {
        tile = TILE.get(tile);
        boundary = TILE.get(boundary || tile);

        let i, j;
        for (i = 0; i < this.width; ++i) {
            for (j = 0; j < this.height; ++j) {
                const cell = this.cells[i][j];
                cell.clear(this.isBoundaryXY(i, j) ? boundary : tile);
            }
        }
    }

    hasTile(
        x: number,
        y: number,
        tile: string | number | Tile
        // useMemory = false
    ): boolean {
        return this.cell(x, y).hasTile(tile);
        // if (!useMemory) return this.cell(x, y).hasTile(tile);
        // return this.memory(x, y).hasTile(tile);
    }

    forceTile(x: number, y: number, tile: string | number | Tile) {
        return this.setTile(x, y, tile, { superpriority: true });
    }

    setTile(
        x: number,
        y: number,
        tile: string | number | Tile,
        opts?: SetTileOptions
    ) {
        if (!(tile instanceof TILE.Tile)) {
            tile = TILE.get(tile);
            if (!tile) return false;
        }
        if (opts === true) {
            opts = { superpriority: true };
        }

        const depth = tile.depth || 0;
        const layer = this.layers[depth] || this.layers[0];
        if (!(layer instanceof Layer.TileLayer)) return false;
        return layer.setTile(x, y, tile, opts);
    }

    clearTiles(x: number, y: number, tile?: number | string | Tile) {
        const cell = this.cell(x, y);
        cell.clearTiles(tile);
    }

    async tick(dt: number): Promise<boolean> {
        let didSomething = false;
        this._animations.forEach((a) => {
            didSomething = a.tick(dt) || didSomething;
        });
        this._animations = this._animations.filter((a) => a.isRunning());

        didSomething = (await this.fireAll('tick')) || didSomething;
        for (let layer of this.layers) {
            if (layer && (await layer.tick(dt))) {
                didSomething = true;
            }
        }

        return didSomething;
    }

    copy(src: Map): void {
        if (this.constructor !== src.constructor)
            throw new Error('Maps must be same type to copy.');
        if (this.width !== src.width || this.height !== src.height)
            throw new Error('Maps must be same size to copy');

        this.cells.forEach((c, x, y) => {
            c.copy(src.cell(x, y));
        });

        this.layers.forEach((l, depth) => {
            l.copy(src.layers[depth]);
        });

        this.actors = src.actors.slice();
        this.items = src.items.slice();

        this.flags.map = src.flags.map;
        // this.fov.needsUpdate = true;
        this.light.copy(src.light);
        this.rng = src.rng;
        this.machineCount = src.machineCount;
        this._seed = src._seed;
        this.properties = Object.assign({}, src.properties);
    }

    clone(): Map {
        // @ts-ignore
        const other: Map = new this.constructor(this.width, this.height);
        other.copy(this);
        return other;
    }

    async fire(
        event: string,
        x: number,
        y: number,
        ctx: Partial<Effect.EffectCtx> = {}
    ): Promise<boolean> {
        const cell = this.cell(x, y);
        return cell.fireEvent(event, ctx);
    }

    async fireAll(
        event: string,
        ctx: Partial<Effect.EffectCtx> = {}
    ): Promise<boolean> {
        let didSomething = false;
        const willFire = GWU.grid.alloc(this.width, this.height);

        // Figure out which tiles will fire - before we change everything...
        this.cells.forEach((cell, x, y) => {
            cell.clearCellFlag(
                Flags.Cell.EVENT_FIRED_THIS_TURN | Flags.Cell.EVENT_PROTECTED
            );
            cell.eachTile((tile) => {
                const ev = tile.effects[event];
                if (!ev) return;

                const effect = Effect.from(ev);
                if (!effect) return;

                let promoteChance = 0;

                // < 0 means try to fire my neighbors...
                if (effect.chance < 0) {
                    promoteChance = 0;
                    GWU.xy.eachNeighbor(
                        x,
                        y,
                        (i, j) => {
                            const n = this.cell(i, j);
                            if (
                                !n.hasEntityFlag(
                                    Flags.Entity.L_BLOCKS_EFFECTS
                                ) &&
                                n.depthTile(tile.depth) !=
                                    cell.depthTile(tile.depth) &&
                                !n.hasCellFlag(Flags.Cell.CAUGHT_FIRE_THIS_TURN)
                            ) {
                                // TODO - Should this break from the loop after doing this once or keep going?
                                promoteChance += -1 * effect.chance;
                            }
                        },
                        true
                    );
                } else {
                    promoteChance = effect.chance || 100 * 100; // 100%
                }
                if (
                    !cell.hasCellFlag(Flags.Cell.CAUGHT_FIRE_THIS_TURN) &&
                    this.rng.chance(promoteChance, 10000)
                ) {
                    willFire[x][y] |= GWU.flag.fl(tile.depth);
                    // cell.flags.cellMech |= Cell.MechFlags.EVENT_FIRED_THIS_TURN;
                }
            });
        });

        // Then activate them - so that we don't activate the next generation as part of the forEach
        ctx.force = true;
        await willFire.forEachAsync(async (w, x, y) => {
            if (!w) return;
            const cell = this.cell(x, y);
            if (cell.hasCellFlag(Flags.Cell.EVENT_FIRED_THIS_TURN)) return;
            for (let depth = 0; depth <= Flags.Depth.GAS; ++depth) {
                if (w & GWU.flag.fl(depth)) {
                    await cell.fireEvent(event, {
                        force: true,
                        depth,
                    });
                }
            }
        });

        GWU.grid.free(willFire);
        return didSomething;
    }

    async activateMachine(
        machineId: number,
        originX: number,
        originY: number,
        ctx: Partial<Effect.EffectCtx> = {}
    ): Promise<boolean> {
        let didSomething = false;
        ctx.originX = originX;
        ctx.originY = originY;
        for (let x = 0; x < this.width; ++x) {
            for (let y = 0; y < this.height; ++y) {
                const cell = this.cell(x, y);
                if (cell.machineId !== machineId) continue;
                if (cell.hasEffect('machine')) {
                    didSomething =
                        (await cell.fireEvent('machine', ctx)) || didSomething;
                }
            }
        }
        return didSomething;
    }

    // DRAW

    drawInto(
        dest: BufferSource | GWU.buffer.Buffer,
        opts?: Partial<MapDrawOptions>
    ) {
        this.drawer.drawInto(dest, this, opts);
    }

    getAppearanceAt(x: number, y: number, dest: GWU.sprite.Mixer) {
        const cell = this.cell(x, y);
        return this.drawer.drawCell(dest, cell);
    }

    // // LightSystemSite

    hasActor(x: number, y: number): boolean {
        return this.cell(x, y).hasActor();
    }
    eachGlowLight(cb: GWU.light.LightCb): void {
        this.cells.forEach((cell, x, y) => {
            cell.eachGlowLight((light) => cb(x, y, light));
            // cell.clearCellFlag(Flags.Cell.LIGHT_CHANGED);
        });
    }
    eachDynamicLight(_cb: GWU.light.LightCb): void {}

    // FOV System Site

    eachViewport(_cb: GWU.fov.ViewportCb): void {
        // TODO !!
    }
    lightingChanged(): boolean {
        return this.light.changed;
    }
    hasVisibleLight(x: number, y: number): boolean {
        return !this.light.isDark(x, y);
    }
    blocksVision(x: number, y: number): boolean {
        return this.cell(x, y).blocksVision();
    }
    // redrawCell(x: number, y: number): void {
    //     // if (clearMemory) {
    //     //     this.clearMemory(x, y);
    //     // }
    //     this.cell(x, y).needsRedraw = true;
    // }

    // Animator

    addAnimation(a: GWU.tween.Animation): void {
        this._animations.push(a);
    }
    removeAnimation(a: GWU.tween.Animation): void {
        GWU.arrayDelete(this._animations, a);
    }
}

export function make(
    w: number,
    h: number,
    floor?: string,
    boundary?: string
): Map;
export function make(w: number, h: number, floor: string): Map;
export function make(w: number, h: number, opts: Partial<MapOptions>): Map;
export function make(
    w: number,
    h: number,
    opts: Partial<MapOptions> | string = {},
    boundary?: string
): Map {
    if (typeof opts === 'string') {
        opts = { tile: opts };
    }
    if (boundary) {
        opts.boundary = boundary;
    }
    if (opts.tile === true) {
        opts.tile = 'FLOOR';
    }
    if (opts.boundary === true) {
        opts.boundary = 'WALL';
    }
    const map = new Map(w, h, opts);
    if (opts.tile) {
        map.fill(opts.tile, opts.boundary);
        map.light.update();
    }

    // if (!DATA.map) {
    //     DATA.map = map;
    // }

    // // In case we reveal the map or make it all visible we need our memory set correctly
    // map.cells.forEach((_c, x, y) => {
    //     if (map.fov.isRevealed(x, y)) {
    //         map.storeMemory(x, y, true); // with snapshot
    //     }
    // });

    return map;
}

function isString(value: any): value is string {
    return typeof value === 'string';
}

function isStringArray(value: any): value is string[] {
    return Array.isArray(value) && typeof value[0] === 'string';
}

export function from(
    prefab: string | string[] | GWU.grid.NumGrid,
    charToTile: Record<string, string | null>,
    opts: Partial<MapOptions> = {}
) {
    let height = 0;
    let width = 0;
    let map: Map;

    if (isString(prefab)) {
        prefab = prefab.split('\n');
    }

    if (isStringArray(prefab)) {
        height = prefab.length;
        width = prefab.reduce((len, line) => Math.max(len, line.length), 0);
        map = make(width, height, opts);

        prefab.forEach((line, y) => {
            for (let x = 0; x < width; ++x) {
                const ch = line[x] || '.';
                const tile = charToTile[ch] || 'FLOOR';
                map.setTile(x, y, tile);
            }
        });
    } else {
        height = prefab.height;
        width = prefab.width;
        map = make(width, height, opts);

        prefab.forEach((v, x, y) => {
            const tile = charToTile[v] || 'FLOOR';
            map.setTile(x, y, tile);
        });
    }

    map.light.update();
    return map;
}
