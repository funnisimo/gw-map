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
import { MapEvents } from '.';

export interface MapOptions extends GWU.light.LightSystemOptions {
    // GWU.fov.FovSystemOptions {
    tile: string | true;
    boundary: string | true;
    seed: number;
    id: string;
    drawer: CellDrawer;
}

export type LayerType = Layer.TileLayer;

export class Map
    implements GWU.light.LightSystemSite, MapType, GWU.tween.Animator
{
    cells: GWU.grid.Grid<Cell>;
    layers: LayerType[];
    flags: { map: 0 };
    light: GWU.light.LightSystemType;
    // fov: GWU.fov.FovSystemType;
    properties: Record<string, any>;
    // _memory: GWU.grid.Grid<CellMemory>;
    // machineCount = 0;
    // _seed = 0;
    rng: GWU.rng.Random = GWU.rng.random;
    // id = 'MAP';
    actors: Actor[] = [];
    items: Item[] = [];
    drawer: CellDrawer;
    fx: Entity[] = [];

    _animations: GWU.tween.Animation[] = [];
    events: GWU.events.EventEmitter<MapEvents> =
        new GWU.events.EventEmitter<MapEvents>();

    constructor(width: number, height: number, opts: Partial<MapOptions> = {}) {
        this.flags = { map: 0 };
        this.layers = [];
        this.properties = { seed: 0, machineCount: 0 };

        if (opts.id) {
            this.properties.id = opts.id;
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
            this.properties.seed = opts.seed;
            this.rng = GWU.rng.make(opts.seed);
        }

        this.light = new GWU.light.LightSystem(this, opts);
        // this.fov = new GWU.fov.FovSystem(this, opts);

        this.initLayers();
    }

    get seed(): number {
        return this.properties.seed;
    }
    set seed(v: number) {
        this.properties.seed = v;
        this.rng = GWU.rng.make(v);
    }

    get width() {
        return this.cells.width;
    }
    get height() {
        return this.cells.height;
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
    _cell(x: number, y: number): Cell {
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

    addItem(x: number, y: number, item: Item, fireEffects = false): boolean {
        if (!this.hasXY(x, y)) return false;
        const cell = this._cell(x, y);
        // if (!cell.canAddItem(item)) return false;

        if (cell._addItem(item)) {
            const index = this.items.indexOf(item);
            if (index < 0) {
                this.items.push(item);
            }
            item.addToMap(this, x, y);

            if (fireEffects) {
                this._fireAddItemEffects(item, cell);
            }

            if (index < 0) {
                this.events.emit('item', this, item, true);
            }

            return true;
        }
        return false;
    }

    _fireAddItemEffects(item: Item, cell: Cell) {
        if (
            item.key &&
            item.key.matches(cell.x, cell.y) &&
            cell.hasEffect('key')
        ) {
            cell.fireEvent('key', {
                key: item,
                item,
            });
        } else if (cell.hasEffect('add_item')) {
            cell.fireEvent('add_item', {
                key: item,
                item,
            });
        }
    }

    addItemNear(
        x: number,
        y: number,
        item: Item,
        fireEffects = false
    ): boolean {
        const loc = this.rng.matchingLocNear(x, y, (i, j) => {
            if (!this.hasXY(i, j)) return false;
            const cell = this._cell(i, j);
            if (cell.hasItem()) return false;
            if (cell.blocksMove()) return false;
            if (item.avoidsCell(cell)) return false;
            return true;
        });

        if (!loc || loc[0] < 0) return false;
        return this.addItem(loc[0], loc[1], item, fireEffects);
    }
    removeItem(item: Item, fireEffects = false): boolean {
        const cell = this._cell(item.x, item.y);
        // if (!cell.canRemoveItem(item)) return false;

        if (cell._removeItem(item)) {
            if (fireEffects) {
                this._fireRemoveItemEffects(item, cell);
            }

            GWU.arrayDelete(this.items, item);
            item.removeFromMap();

            this.events.emit('item', this, item, false);
            return true;
        }
        return false;
    }

    _fireRemoveItemEffects(item: Item, cell: Cell) {
        if (item.isKey(cell.x, cell.y) && cell.hasEffect('no_key')) {
            cell.fireEvent('no_key', {
                key: item,
                item,
            });
        } else if (cell.hasEffect('remove_item')) {
            cell.fireEvent('remove_item', {
                key: item,
                item,
            });
        }
    }

    moveItem(item: Item, x: number, y: number, fireEffects = false) {
        if (item.map !== this) throw new Error('Actor not on this map!');

        const currentCell = this._cell(item.x, item.y);
        const newCell = this._cell(x, y);

        // if (!currentCell.canRemoveItem(item)) return false;
        // if (!newCell.canAddItem(item)) return false;

        currentCell._removeItem(item);
        if (newCell._addItem(item)) {
            if (fireEffects) {
                this._fireRemoveItemEffects(item, currentCell);
                this._fireAddItemEffects(item, newCell);
            }

            item.addToMap(this, x, y);
        }

        return true;
    }

    //  moveItem(item: Item, dir: GWU.xy.Loc | number): boolean {
    //     if (typeof dir === 'number') {
    //         dir = GWU.xy.DIRS[dir];
    //     }
    //     const oldX = item.x;
    //     const oldY = item.y;
    //     const x = oldX + dir[0];
    //     const y = oldY + dir[1];
    //     if (!this.hasXY(x, y)) return false;

    //     const layer = this.layers[item.depth] as Layer.ItemLayer;
    //     if (!( layer.removeItem(item))) return false;
    //     if (!( this.addItem(x, y, item))) {
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
    addActor(x: number, y: number, actor: Actor, fireEffects = false): boolean {
        if (!this.hasXY(x, y)) return false;
        const cell = this._cell(x, y);
        if (!cell.canAddActor(actor)) return false;

        if (cell._addActor(actor)) {
            const index = this.actors.indexOf(actor);
            if (index < 0) {
                this.actors.push(actor);
            }
            actor.addToMap(this, x, y);

            if (fireEffects) {
                this._fireAddActorEffects(actor, cell);
            }

            if (index < 0) {
                this.events.emit('actor', this, actor, true);
            }

            return true;
        }
        return false;
    }

    _fireAddActorEffects(actor: Actor, cell: Cell) {
        if (actor.isKey(cell.x, cell.y) && cell.hasEffect('key')) {
            cell.fireEvent('key', {
                key: actor,
                actor,
            });
        } else if (actor.isPlayer() && cell.hasEffect('add_player')) {
            cell.fireEvent('add_player', {
                player: actor,
                actor,
            });
        } else if (cell.hasEffect('add_actor')) {
            cell.fireEvent('add_actor', {
                actor,
            });
        }
    }

    addActorNear(
        x: number,
        y: number,
        actor: Actor,
        fireEffects = false
    ): boolean {
        const loc = this.rng.matchingLocNear(x, y, (i, j) => {
            if (!this.hasXY(i, j)) return false;
            const cell = this.cell(i, j);
            if (cell.hasActor()) return false;
            if (cell.blocksMove()) return false;
            if (actor.avoidsCell(cell)) return false;
            return true;
        });

        if (!loc || loc[0] < 0) return false;
        return this.addActor(loc[0], loc[1], actor, fireEffects);
    }

    removeActor(actor: Actor, fireEffects = false): boolean {
        const cell = this._cell(actor.x, actor.y);
        if (!cell.canRemoveActor(actor)) return false;

        if (cell._removeActor(actor)) {
            if (fireEffects) {
                this._fireRemoveActorEffects(actor, cell);
            }

            actor.removeFromMap();
            GWU.arrayDelete(this.actors, actor);

            this.events.emit('actor', this, actor, false);
            return true;
        }
        return false;
    }

    _fireRemoveActorEffects(actor: Actor, cell: Cell) {
        if (actor.isKey(actor.x, actor.y) && cell.hasEffect('no_key')) {
            cell.fireEvent('no_key', {
                key: actor,
                actor,
            });
        } else if (actor.isPlayer() && cell.hasEffect('remove_player')) {
            cell.fireEvent('remove_player', {
                actor,
                player: actor,
            });
        } else if (cell.hasEffect('remove_actor')) {
            cell.fireEvent('remove_actor', {
                actor,
            });
        }
    }

    moveActor(
        actor: Actor,
        x: number,
        y: number,
        fireEffects = false
    ): boolean {
        if (actor.map !== this) throw new Error('Actor not on this map!');

        const currentCell = this._cell(actor.x, actor.y);
        const newCell = this._cell(x, y);

        // if (!currentCell.canRemoveActor(actor)) return false;
        // if (!newCell.canAddActor(actor)) return false;

        currentCell._removeActor(actor);
        if (newCell._addActor(actor)) {
            actor.addToMap(this, x, y);
            if (fireEffects) {
                this._fireRemoveActorEffects(actor, currentCell);
                this._fireAddActorEffects(actor, newCell);
            }
        }

        return true;
    }

    //  moveActor(actor: Actor, dir: GWU.xy.Loc | number): boolean {
    //     if (typeof dir === 'number') {
    //         dir = GWU.xy.DIRS[dir];
    //     }
    //     const oldX = actor.x;
    //     const oldY = actor.y;
    //     const x = oldX + dir[0];
    //     const y = oldY + dir[1];

    //     if (!this.hasXY(x, y)) return false;

    //     const layer = this.layers[actor.depth] as Layer.ActorLayer;
    //     if (!( layer.removeActor(actor))) return false;
    //     if (!( layer.addActor(x, y, actor))) {
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
        this.events.emit('fx', this, fx, true);
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
        this.events.emit('fx', this, fx, false);
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

    hasTileFlag(x: number, y: number, flag: number) {
        return this.cell(x, y).hasTileFlag(flag);
    }

    highlightPath(path: GWU.xy.Loc[], markCursor = true) {
        this.clearPath();
        path.forEach((loc) => {
            this.setCellFlag(loc[0], loc[1], Flags.Cell.IS_HIGHLIGHTED);
        });
        if (markCursor && path[0]) {
            const loc = path[0];
            this.setCellFlag(loc[0], loc[1], Flags.Cell.IS_CURSOR);
        }
        this.needsRedraw = true;
    }

    clearPath() {
        this.cells.forEach((c) =>
            c.clearCellFlag(Flags.Cell.IS_CURSOR | Flags.Cell.IS_HIGHLIGHTED)
        );
        this.needsRedraw = true;
    }

    showCursor(x: number, y: number) {
        this.clearCursor();
        this.cell(x, y).setCellFlag(Flags.Cell.IS_CURSOR);
        this.needsRedraw = true;
    }

    clearCursor() {
        this.cells.forEach((c) => c.clearCellFlag(Flags.Cell.IS_CURSOR));
        this.needsRedraw = true;
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
        opts?: SetTileOptions | true
    ) {
        if (!(tile instanceof TILE.Tile)) {
            const name = tile;
            tile = TILE.get(name);
            if (!tile) throw new Error('Failed to find tile: ' + name);
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

    tick(dt: number): boolean {
        let didSomething = false;
        this._animations.forEach((a) => {
            didSomething = a.tick(dt) || didSomething;
        });
        this._animations = this._animations.filter((a) => a.isRunning());

        didSomething = this.fireAll('tick') || didSomething;
        for (let layer of this.layers) {
            if (layer && layer.tick(dt)) {
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
        this.properties = Object.assign({}, src.properties);
    }

    clone(): Map {
        // @ts-ignore
        const other: Map = new this.constructor(this.width, this.height);
        other.copy(this);
        return other;
    }

    fire(
        event: string,
        x: number,
        y: number,
        ctx: Effect.EffectCtx = {}
    ): boolean {
        const cell = this.cell(x, y);
        return cell.fireEvent(event, ctx);
    }

    fireAll(event: string, ctx: Effect.EffectCtx = {}): boolean {
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
                    cell.fireEvent(event, {
                        force: true,
                    });
                }
            }
        });

        GWU.grid.free(willFire);
        return didSomething;
    }

    activateMachine(
        machineId: number,
        originX: number,
        originY: number,
        ctx: Effect.EffectCtx = {}
    ): boolean {
        let didSomething = false;
        ctx.originX = originX;
        ctx.originY = originY;
        for (let x = 0; x < this.width; ++x) {
            for (let y = 0; y < this.height; ++y) {
                const cell = this.cell(x, y);
                if (cell.machineId !== machineId) continue;
                if (cell.hasEffect('machine')) {
                    didSomething =
                        cell.fireEvent('machine', ctx) || didSomething;
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
        return this.drawer.drawCell(dest, this, cell);
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
