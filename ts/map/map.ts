import * as GWU from 'gw-utils';

import * as Flags from '../flags';
import { Cell } from './cell';
import * as TILE from '../tile';
import { Tile } from '../tile';
import * as Layer from '../layer';
import { Item } from '../item';
import { Actor } from '../actor';
import {
    MapType,
    EachCellCb,
    MapTestFn,
    CellType,
    SetTileOptions,
    CellInfoType,
} from './types';
import { CellMemory } from './cellMemory';
import * as Effect from '../effect';

export interface MapOptions
    extends GWU.light.LightSystemOptions,
        GWU.fov.FovSystemOptions {
    tile: string | true;
    boundary: string | true;
    seed: number;
}

export type LayerType = Layer.TileLayer | Layer.ActorLayer | Layer.ItemLayer;

export interface MapDrawOptions {
    x: number;
    y: number;
    width: number;
    height: number;
    mapOffsetX: number;
    mapOffsetY: number;
    force: boolean;
}

export class Map
    implements GWU.light.LightSystemSite, GWU.fov.FovSite, MapType {
    width: number;
    height: number;
    cells: GWU.grid.Grid<Cell>;
    layers: LayerType[];
    flags: { map: 0 };
    light: GWU.light.LightSystemType;
    fov: GWU.fov.FovSystemType;
    properties: Record<string, any>;
    memory: GWU.grid.Grid<CellMemory>;
    _seed = 0;
    rng: GWU.rng.Random = GWU.rng.random;

    constructor(width: number, height: number, opts: Partial<MapOptions> = {}) {
        this.width = width;
        this.height = height;
        this.flags = { map: 0 };
        this.layers = [];

        this.cells = GWU.grid.make(width, height, () => new Cell());
        this.memory = GWU.grid.make(width, height, () => new CellMemory());

        if (opts.seed) {
            this._seed = opts.seed;
            this.rng = GWU.rng.make(opts.seed);
        }

        this.light = new GWU.light.LightSystem(this, opts);
        this.fov = new GWU.fov.FovSystem(this, opts);
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

    cellInfo(x: number, y: number, useMemory = false): CellInfoType {
        if (useMemory) return this.memory[x][y];
        return this.cell(x, y);
    }

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

    // DRAW

    drawInto(
        dest: GWU.canvas.Canvas | GWU.canvas.DataBuffer,
        opts: Partial<MapDrawOptions> | boolean = {}
    ) {
        const buffer: GWU.canvas.DataBuffer =
            dest instanceof GWU.canvas.Canvas ? dest.buffer : dest;

        if (typeof opts === 'boolean') opts = { force: opts };
        const mixer = new GWU.sprite.Mixer();
        for (let x = 0; x < buffer.width; ++x) {
            for (let y = 0; y < buffer.height; ++y) {
                // const cell = this.cell(x, y);
                // if (
                //     cell.needsRedraw ||
                //     this.light.lightChanged(x, y) ||
                //     this.fov.fovChanged(x, y)
                // ) {
                this.getAppearanceAt(x, y, mixer);
                buffer.drawSprite(x, y, mixer);
                // }
            }
        }
    }

    // items

    itemAt(x: number, y: number): Item | null {
        return this.cell(x, y).item;
    }
    eachItem(cb: GWU.types.EachCb<Item>): void {
        this.cells.forEach((cell) => {
            GWU.list.forEach(cell.item, cb);
        });
    }
    async addItem(x: number, y: number, item: Item): Promise<boolean> {
        if (!this.hasXY(x, y)) return false;
        for (let layer of this.layers) {
            if (layer && (await layer.addItem(x, y, item))) {
                return true;
            }
        }
        return false;
    }
    forceItem(x: number, y: number, item: Item): boolean {
        if (!this.hasXY(x, y)) return false;
        for (let layer of this.layers) {
            if (layer && layer.forceItem(x, y, item)) {
                return true;
            }
        }
        return false;
    }

    async removeItem(item: Item): Promise<boolean> {
        const layer = this.layers[item.depth] as Layer.ItemLayer;
        return layer.removeItem(item);
    }
    async moveItem(x: number, y: number, item: Item): Promise<boolean> {
        if (!this.hasXY(x, y)) return false;
        const layer = this.layers[item.depth] as Layer.ItemLayer;
        if (!(await layer.removeItem(item))) return false;
        return this.addItem(x, y, item);
    }

    // Actors

    hasPlayer(x: number, y: number): boolean {
        return this.cell(x, y).hasPlayer();
    }
    actorAt(x: number, y: number): Actor | null {
        return this.cell(x, y).actor;
    }
    eachActor(cb: GWU.types.EachCb<Actor>): void {
        this.cells.forEach((cell) => {
            GWU.list.forEach(cell.actor, cb);
        });
    }
    async addActor(x: number, y: number, actor: Actor): Promise<boolean> {
        if (!this.hasXY(x, y)) return false;
        for (let layer of this.layers) {
            if (layer && (await layer.addActor(x, y, actor))) {
                return true;
            }
        }
        return false;
    }
    forceActor(x: number, y: number, actor: Actor): boolean {
        if (!this.hasXY(x, y)) return false;
        for (let layer of this.layers) {
            if (layer && layer.forceActor(x, y, actor)) {
                return true;
            }
        }
        return false;
    }
    async removeActor(actor: Actor): Promise<boolean> {
        const layer = this.layers[actor.depth] as Layer.ActorLayer;
        return layer.removeActor(actor);
    }
    async moveActor(x: number, y: number, actor: Actor): Promise<boolean> {
        if (!this.hasXY(x, y)) return false;
        const layer = this.layers[actor.depth] as Layer.ActorLayer;
        if (!(await layer.removeActor(actor))) return false;
        return this.addActor(x, y, actor);
    }

    // Information

    isVisible(x: number, y: number): boolean {
        return this.fov.isAnyKindOfVisible(x, y);
    }
    hasKey(x: number, y: number): boolean {
        if (!this.hasXY(x, y)) return false;
        const cell = this.cells[x][y];
        return cell._objects.some((e) => !!e.key && e.key.matches(x, y));
    }

    count(cb: MapTestFn): number {
        return this.cells.count((cell, x, y) => cb(cell, x, y, this));
    }
    dump(fmt?: (cell: CellType) => string, log = console.log) {
        this.cells.dump(fmt || ((c: Cell) => c.dump()), log);
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

    setCellFlag(x: number, y: number, flag: number) {
        this.cell(x, y).setCellFlag(flag);
    }
    clearCellFlag(x: number, y: number, flag: number) {
        this.cell(x, y).clearCellFlag(flag);
    }

    clear() {
        this.light.glowLightChanged = true;
        this.fov.needsUpdate = true;
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
                const cell = this.cell(i, j);
                cell.clear(this.isBoundaryXY(i, j) ? boundary : tile);
            }
        }
    }

    hasTile(
        x: number,
        y: number,
        tile: string | number | Tile,
        useMemory = false
    ): boolean {
        return this.cellInfo(x, y, useMemory).hasTile(tile);
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

    async tick(dt: number): Promise<boolean> {
        let didSomething = await this.fireAll('tick');
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
            c.copy(src.cells[x][y]);
        });

        this.layers.forEach((l, depth) => {
            l.copy(src.layers[depth]);
        });

        this.flags.map = src.flags.map;
        this.fov.needsUpdate = true;
        this.light.copy(src.light);
        this.rng = src.rng;
        Object.assign(this.properties, src.properties);
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
        return cell.activate(event, this, x, y, ctx);
    }

    fireSync(
        event: string,
        x: number,
        y: number,
        ctx: Partial<Effect.EffectCtx> = {}
    ): boolean {
        const cell = this.cell(x, y);
        return cell.build(event, this, x, y, ctx);
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
                    await cell.activate(event, this, x, y, {
                        force: true,
                        depth,
                    });
                }
            }
        });

        GWU.grid.free(willFire);
        return didSomething;
    }

    fireAllSync(event: string, ctx: Partial<Effect.EffectCtx> = {}): boolean {
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
        willFire.forEach((w, x, y) => {
            if (!w) return;
            const cell = this.cell(x, y);
            if (cell.hasCellFlag(Flags.Cell.EVENT_FIRED_THIS_TURN)) return;
            for (let depth = 0; depth <= Flags.Depth.GAS; ++depth) {
                if (w & GWU.flag.fl(depth)) {
                    cell.activate(event, this, x, y, {
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
                const cell = this.cells[x][y];
                if (cell.machineId !== machineId) continue;
                if (cell.hasEffect('machine')) {
                    didSomething =
                        (await cell.activate('machine', this, x, y, ctx)) ||
                        didSomething;
                }
            }
        }
        return didSomething;
    }

    activateMachineSync(
        machineId: number,
        originX: number,
        originY: number,
        ctx: Partial<Effect.EffectCtx> = {}
    ): boolean {
        let didSomething = false;
        ctx.originX = originX;
        ctx.originY = originY;
        for (let x = 0; x < this.width; ++x) {
            for (let y = 0; y < this.height; ++y) {
                const cell = this.cells[x][y];
                if (cell.machineId !== machineId) continue;
                if (cell.hasEffect('machine')) {
                    didSomething =
                        cell.build('machine', this, x, y, ctx) || didSomething;
                }
            }
        }
        return didSomething;
    }

    getAppearanceAt(x: number, y: number, dest: GWU.sprite.Mixer) {
        dest.blackOut();
        const cell = this.cell(x, y);
        const isVisible = this.fov.isAnyKindOfVisible(x, y);

        if (cell.needsRedraw && isVisible) {
            this.layers.forEach((layer) => layer.putAppearance(dest, x, y));

            if (dest.dances) {
                cell.setCellFlag(Flags.Cell.COLORS_DANCE);
            } else {
                cell.clearCellFlag(Flags.Cell.COLORS_DANCE);
            }

            dest.bake();
            this.memory[x][y].putSnapshot(dest);
            cell.needsRedraw = false;
        } else {
            this.memory[x][y].getSnapshot(dest);
        }

        if (isVisible) {
            const light = this.light.getLight(x, y);
            dest.multiply(light);
        } else if (this.fov.isRevealed(x, y)) {
            dest.scale(50);
        } else {
            dest.blackOut();
        }

        if (cell.hasEntityFlag(Flags.Entity.L_VISUALLY_DISTINCT)) {
            GWU.color.separate(dest.fg, dest.bg);
        }
    }

    // // LightSystemSite

    hasActor(x: number, y: number): boolean {
        return this.cell(x, y).hasActor();
    }
    eachGlowLight(cb: GWU.light.LightCb): void {
        this.cells.forEach((cell, x, y) => {
            cell.eachGlowLight((light) => cb(x, y, light));
            cell.clearCellFlag(Flags.Cell.LIGHT_CHANGED);
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
    onCellRevealed(_x: number, _y: number): void {
        // if (DATA.automationActive) {
        // if (cell.item) {
        //     const theItem: GW.types.ItemType = cell.item;
        //     if (
        //         theItem.hasObjectFlag(ObjectFlags.L_INTERRUPT_WHEN_SEEN)
        //     ) {
        //         GW.message.add(
        //             '§you§ §see§ ΩitemMessageColorΩ§item§∆.',
        //             {
        //                 item: theItem,
        //                 actor: DATA.player,
        //             }
        //         );
        //     }
        // }
        // if (
        //     !(this.fov.isMagicMapped(x, y)) &&
        //     this.site.hasObjectFlag(
        //         x,
        //         y,
        //         ObjectFlags.L_INTERRUPT_WHEN_SEEN
        //     )
        // ) {
        //     const tile = cell.tileWithLayerFlag(
        //         ObjectFlags.L_INTERRUPT_WHEN_SEEN
        //     );
        //     if (tile) {
        //         GW.message.add(
        //             '§you§ §see§ ΩbackgroundMessageColorΩ§item§∆.',
        //             {
        //                 actor: DATA.player,
        //                 item: tile.name,
        //             }
        //         );
        //     }
        // }
    }
    redrawCell(x: number, y: number, clearMemory?: boolean): void {
        if (clearMemory) {
            this.clearMemory(x, y);
        }
        this.cells[x][y].needsRedraw = true;
    }
    clearMemory(x: number, y: number): void {
        this.memory[x][y].clear();
    }
    storeMemory(x: number, y: number): void {
        const cell = this.cell(x, y);
        this.memory[x][y].store(cell);
    }

    // // DigSite

    // isWall(x: number, y: number, useMemory = false): boolean {
    //     const info = this.cellInfo(x, y, useMemory);
    //     return info.blocksMove() && info.blocksVision();
    // }
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
    }

    map.light.update();

    // if (!DATA.map) {
    //     DATA.map = map;
    // }
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
