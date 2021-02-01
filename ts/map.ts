import {
    utils as Utils,
    random,
    grid as Grid,
    fov as Fov,
    flag as Flag,
    path as Path,
    color as Color,
    colors as COLORS,
    canvas as Canvas,
    config as CONFIG,
    data as DATA,
    types as Types,
    make as Make,
    sprite as Sprite,
} from 'gw-utils';

import * as Cell from './cell';
import * as Tile from './tile';
import {
    Map as Flags,
    Cell as CellFlags,
    Tile as TileFlags,
    CellMech as CellMechFlags,
    TileMech as TileMechFlags,
    Depth as TileLayer,
    Layer as LayerFlags,
} from './flags';
import * as Light from './light';
import * as Layer from './entity';
import * as Visibility from './visibility';

export { Flags };

export interface MapDrawOptions {
    x: number;
    y: number;
    width: number;
    height: number;
    mapOffsetX: number;
    mapOffsetY: number;
    force: boolean;
}

Utils.setDefaults(CONFIG, {
    'map.deepestLevel': 99,
});

export type MapEachFn = (
    cell: Cell.Cell,
    x: number,
    y: number,
    map: Map
) => void;

export type MapMatchFn = (
    cell: Cell.Cell,
    x: number,
    y: number,
    map: Map
) => boolean;

export type MapCostFn = (
    cell: Cell.Cell,
    x: number,
    y: number,
    map: Map
) => number;

export interface MapMatchOptions {
    hallways: boolean;
    blockingMap: Grid.NumGrid;
    liquids: boolean;
    match: MapMatchFn;
    forbidCellFlags: number;
    forbidTileFlags: number;
    forbidTileMechFlags: number;
    tile: Tile.Tile;
    deterministic: boolean;
}

interface LightInfo extends Utils.Chainable {
    light: Types.LightType;
    x: number;
    y: number;
    next: LightInfo | null;
}

export type MapLightFn = (light: Types.LightType, x: number, y: number) => void;

export interface DisruptsOptions {
    gridOffsetX: number;
    gridOffsetY: number;
    bounds: Types.Bounds | null;
}

export interface MapFovInfo extends Utils.XY {
    lastRadius: number;
}

export class Map implements Types.MapType {
    protected _width: number;
    protected _height: number;
    public cells: Grid.Grid<Cell.Cell>;
    public locations: any = {};
    public config: any = {};
    protected _actors: any | null = null;
    protected _items: any | null = null;
    public flags = 0;
    public ambientLight: Color.Color;
    public lights: LightInfo | null = null;
    public id: string;
    public fov: Utils.XY | null = null;

    constructor(w: number, h: number, opts: any = {}) {
        this._width = w;
        this._height = h;
        this.cells = Grid.make<Cell.Cell>(
            w,
            h,
            () => new Cell.Cell()
        ) as Grid.Grid<Cell.Cell>;
        this.locations = opts.locations || {};
        this.config = Object.assign({}, opts);
        this.config.tick = this.config.tick || 100;
        this._actors = null;
        this._items = null;
        this.flags = Flag.from(Flags, Flags.MAP_DEFAULT, opts.flags);
        const ambient =
            opts.ambient || opts.ambientLight || opts.light || 'white';
        this.ambientLight = Color.make(ambient);
        if (opts.ambient || opts.ambientLight || opts.light) {
            this.ambientLightChanged = true;
        }
        this.lights = null;
        this.id = opts.id;
        if (this.config.fov) {
            this.flags |= Flags.MAP_CALC_FOV;
            this.fov = { x: -1, y: -1 };
        }
        if (opts.updateLiquid && typeof opts.updateLiquid === 'function') {
            this.updateLiquid = opts.updateLiquid.bind(this);
        }
        if (opts.updateGas && typeof opts.updateGas === 'function') {
            this.updateGas = opts.updateGas.bind(this);
        }

        Light.updateLighting(this); // to set the ambient light
        Visibility.initMap(this);
    }

    get width() {
        return this._width;
    }
    get height() {
        return this._height;
    }

    async start() {}

    clear() {
        this.cells.forEach((c) => c.clear());
        this.changed = true;
    }
    dump(fmt?: (cell: Cell.Cell) => string) {
        this.cells.dump(fmt || ((c: Cell.Cell) => c.dump()));
    }
    cell(x: number, y: number) {
        return this.cells[x][y];
    }

    eachCell(fn: MapEachFn) {
        this.cells.forEach((c, i, j) => fn(c, i, j, this));
    }
    forEach(fn: MapEachFn) {
        this.cells.forEach((c, i, j) => fn(c, i, j, this));
    }
    forRect(x: number, y: number, w: number, h: number, fn: MapEachFn) {
        this.cells.forRect(x, y, w, h, (c, i, j) => fn(c, i, j, this));
    }
    eachNeighbor(x: number, y: number, fn: MapEachFn, only4dirs = false) {
        this.cells.eachNeighbor(
            x,
            y,
            (c, i, j) => fn(c, i, j, this),
            only4dirs
        );
    }
    randomEach(fn: MapEachFn) {
        this.cells.randomEach((c, i, j) => fn(c, i, j, this));
    }

    count(fn: MapMatchFn) {
        let count = 0;
        this.forEach((c, x, y, g) => {
            if (fn(c, x, y, g)) {
                ++count;
            }
        });
        return count;
    }

    hasXY(x: number, y: number) {
        return this.cells.hasXY(x, y);
    }
    isBoundaryXY(x: number, y: number) {
        return this.cells.isBoundaryXY(x, y);
    }

    get changed() {
        return (this.flags & Flags.MAP_CHANGED) > 0;
    }

    set changed(v: boolean) {
        if (v === true) {
            this.flags |= Flags.MAP_CHANGED;
        } else if (v === false) {
            this.flags &= ~Flags.MAP_CHANGED;
        }
    }

    hasCellFlag(x: number, y: number, flag: CellFlags) {
        return this.cell(x, y).flags & flag;
    }
    hasCellMechFlag(x: number, y: number, flag: CellMechFlags) {
        return this.cell(x, y).mechFlags & flag;
    }
    hasLayerFlag(x: number, y: number, flag: LayerFlags) {
        return this.cell(x, y).hasLayerFlag(flag);
    }
    hasTileFlag(x: number, y: number, flag: TileFlags) {
        return this.cell(x, y).hasTileFlag(flag);
    }
    hasTileMechFlag(x: number, y: number, flag: TileMechFlags) {
        return this.cell(x, y).hasTileMechFlag(flag);
    }

    redrawCell(cell: Cell.Cell) {
        // if (cell.isAnyKindOfVisible()) {
        cell.needsRedraw = true;
        this.flags |= Flags.MAP_CHANGED;
        // }
    }

    redrawXY(x: number, y: number) {
        const cell = this.cell(x, y);
        this.redrawCell(cell);
    }

    redrawAll() {
        this.forEach((c) => {
            // if (c.isAnyKindOfVisible()) {
            c.needsRedraw = true;
            // }
        });
        this.changed = true;
    }

    drawInto(
        canvas: Canvas.Canvas | Canvas.DataBuffer,
        opts: Partial<MapDrawOptions> | boolean = {}
    ) {
        Light.updateLighting(this);

        if (typeof opts === 'boolean') opts = { force: opts };
        const mixer = new Sprite.Mixer();
        for (let x = 0; x < canvas.width; ++x) {
            for (let y = 0; y < canvas.height; ++y) {
                const cell = this.cell(x, y);
                if (cell.needsRedraw || opts.force) {
                    getCellAppearance(this, x, y, mixer);
                    const glyph =
                        typeof mixer.ch === 'number'
                            ? mixer.ch
                            : canvas.toGlyph(mixer.ch);
                    canvas.draw(
                        x,
                        y,
                        glyph,
                        mixer.fg.toInt(),
                        mixer.bg.toInt()
                    );
                    cell.needsRedraw = false;
                }
            }
        }
    }

    revealAll() {
        this.forEach((c) => {
            c.markRevealed();
            c.storeMemory();
        });
        if (DATA.player) {
            DATA.player.invalidateCostMap();
        }
    }

    markRevealed(x: number, y: number) {
        if (!this.cell(x, y).markRevealed()) return;
        if (DATA.player) {
            DATA.player.invalidateCostMap();
        }
    }

    makeVisible(v = true) {
        if (v) {
            this.setFlags(0, Cell.Flags.VISIBLE);
        } else {
            this.clearFlags(0, Cell.Flags.ANY_KIND_OF_VISIBLE);
        }
    }

    isVisible(x: number, y: number) {
        return this.cell(x, y).isVisible();
    }
    isAnyKindOfVisible(x: number, y: number) {
        return this.cell(x, y).isAnyKindOfVisible();
    }
    isOrWasAnyKindOfVisible(x: number, y: number) {
        return this.cell(x, y).isOrWasAnyKindOfVisible();
    }
    isRevealed(x: number, y: number) {
        return this.cell(x, y).isRevealed();
    }

    get anyLightChanged() {
        return (this.flags & Flags.MAP_STABLE_LIGHTS) == 0;
    }
    set anyLightChanged(v: boolean) {
        if (v) {
            this.flags &= ~Flags.MAP_STABLE_LIGHTS;
        } else {
            this.flags |= Flags.MAP_STABLE_LIGHTS;
        }
    }

    get ambientLightChanged() {
        return this.staticLightChanged;
    }
    set ambientLightChanged(v: boolean) {
        this.staticLightChanged = v;
    }

    get staticLightChanged() {
        return (this.flags & Flags.MAP_STABLE_GLOW_LIGHTS) == 0;
    }
    set staticLightChanged(v: boolean) {
        if (v) {
            this.flags &= ~(
                Flags.MAP_STABLE_GLOW_LIGHTS | Flags.MAP_STABLE_LIGHTS
            );
        } else {
            this.flags |= Flags.MAP_STABLE_GLOW_LIGHTS;
        }
    }

    setFlag(flag: number) {
        this.flags |= flag;
        this.changed = true;
    }

    setFlags(mapFlag = 0, cellFlag = 0, cellMechFlag = 0) {
        if (mapFlag) {
            this.flags |= mapFlag;
        }
        if (cellFlag || cellMechFlag) {
            this.forEach((c) => c.setFlags(cellFlag, cellMechFlag));
        }
        this.changed = true;
    }

    clearFlag(flag: number) {
        this.flags &= ~flag;
        this.changed = true;
    }

    clearFlags(mapFlag = 0, cellFlag = 0, cellMechFlag = 0) {
        if (mapFlag) {
            this.flags &= ~mapFlag;
        }
        if (cellFlag || cellMechFlag) {
            this.forEach((cell) => cell.clearFlags(cellFlag, cellMechFlag));
        }
        this.changed = true;
    }

    // setCellFlag(x: number, y: number, flag: number) {
    //   this.cell(x, y).flags |= flag;
    // }

    setCellFlags(x: number, y: number, cellFlag = 0, cellMechFlag = 0) {
        this.cell(x, y).setFlags(cellFlag, cellMechFlag);
        this.flags |= Flags.MAP_CHANGED;
    }

    clearCellFlags(x: number, y: number, cellFlags = 0, cellMechFlags = 0) {
        this.cell(x, y).clearFlags(cellFlags, cellMechFlags);
        this.changed = true;
    }

    hasTile(x: number, y: number, tile: string) {
        return this.cells[x][y].hasTile(tile);
    }

    layerFlags(x: number, y: number, limitToPlayerKnowledge = false) {
        return this.cells[x][y].layerFlags(limitToPlayerKnowledge);
    }
    tileFlags(x: number, y: number, limitToPlayerKnowledge = false) {
        return this.cells[x][y].tileFlags(limitToPlayerKnowledge);
    }
    tileMechFlags(x: number, y: number, limitToPlayerKnowledge = false) {
        return this.cells[x][y].tileMechFlags(limitToPlayerKnowledge);
    }

    tileWithLayerFlag(x: number, y: number, mechFlag = 0) {
        return this.cells[x][y].tileWithLayerFlag(mechFlag);
    }
    tileWithFlag(x: number, y: number, flag = 0) {
        return this.cells[x][y].tileWithFlag(flag);
    }
    tileWithMechFlag(x: number, y: number, mechFlag = 0) {
        return this.cells[x][y].tileWithMechFlag(mechFlag);
    }

    hasKnownTileFlag(x: number, y: number, flagMask = 0) {
        return this.cells[x][y].memory.tileFlags & flagMask;
    }

    // hasTileInGroup(x, y, ...groups) { return this.cells[x][y].hasTileInGroup(...groups); }

    // discoveredTileFlags(x: number, y: number) {
    //   return this.cells[x][y].discoveredTileFlags();
    // }
    // hasDiscoveredTileFlag(x: number, y: number, flag = 0) {
    //   return this.cells[x][y].hasDiscoveredTileFlag(flag);
    // }

    isClear(x: number, y: number) {
        return this.cells[x][y].isClear();
    }
    isEmpty(x: number, y: number) {
        return this.cells[x][y].isEmpty();
    }
    isObstruction(x: number, y: number, limitToPlayerKnowledge = false) {
        return this.cells[x][y].isObstruction(limitToPlayerKnowledge);
    }
    isDoorway(x: number, y: number, limitToPlayerKnowledge = false) {
        return this.cells[x][y].isDoorway(limitToPlayerKnowledge);
    }
    isSecretDoorway(x: number, y: number, limitToPlayerKnowledge = false) {
        return this.cells[x][y].isSecretDoorway(limitToPlayerKnowledge);
    }
    isLiquid(x: number, y: number, limitToPlayerKnowledge = false) {
        return this.cells[x][y].isLiquid(limitToPlayerKnowledge);
    }
    hasGas(x: number, y: number, limitToPlayerKnowledge = false) {
        return this.cells[x][y].hasGas(limitToPlayerKnowledge);
    }

    blocksPathing(x: number, y: number, limitToPlayerKnowledge = false) {
        return this.cells[x][y].blocksPathing(limitToPlayerKnowledge);
    }
    blocksVision(x: number, y: number) {
        return this.cells[x][y].blocksVision();
    }

    isMoveableNow(x: number, y: number, limitToPlayerKnowledge = false) {
        return this.cells[x][y].isMoveableNow(limitToPlayerKnowledge);
    }
    isWalkableNow(x: number, y: number, limitToPlayerKnowledge = false) {
        return this.cells[x][y].isWalkableNow(limitToPlayerKnowledge);
    }
    canBeWalked(x: number, y: number, limitToPlayerKnowledge = false) {
        return this.cells[x][y].canBeWalked(limitToPlayerKnowledge);
    }

    topmostTile(x: number, y: number, skipGas = false) {
        return this.cells[x][y].topmostTile(skipGas);
    }

    tileFlavor(x: number, y: number) {
        return this.cells[x][y].tileFlavor();
    }

    setTile(x: number, y: number, tileId: Cell.TileBase | null, volume = 0) {
        return this.cell(x, y).setTile(tileId, volume, this);
    }

    clearCell(x: number, y: number) {
        this.cell(x, y).clear();
    }

    clearCellLayersWithFlags(
        x: number,
        y: number,
        tileFlags: TileFlags,
        tileMechFlags: TileMechFlags = 0
    ) {
        const cell = this.cell(x, y);
        cell.clearLayersWithFlags(tileFlags, tileMechFlags);
    }

    clearCellLayers(
        x: number,
        y: number,
        nullLiquid = true,
        nullSurface = true,
        nullGas = true
    ) {
        this.changed = true;
        return this.cell(x, y).clearLayers(nullLiquid, nullSurface, nullGas);
    }

    fill(tileId: string | null, boundaryTile?: string | null) {
        let i, j;
        if (boundaryTile === undefined) {
            boundaryTile = tileId;
        }
        for (i = 0; i < this.width; ++i) {
            for (j = 0; j < this.height; ++j) {
                if (this.isBoundaryXY(i, j)) {
                    this.setTile(i, j, boundaryTile);
                } else {
                    this.setTile(i, j, tileId);
                }
            }
        }
    }

    neighborCount(
        x: number,
        y: number,
        matchFn: MapMatchFn,
        only4dirs = false
    ) {
        let count = 0;
        this.eachNeighbor(
            x,
            y,
            (...args) => {
                if (matchFn(...args)) ++count;
            },
            only4dirs
        );
        return count;
    }

    walkableArcCount(x: number, y: number) {
        if (!this.hasXY(x, y)) return -1;
        return this.cells.arcCount(x, y, (c) => c.isWalkableNow());
    }

    diagonalBlocked(
        x1: number,
        y1: number,
        x2: number,
        y2: number,
        limitToPlayerKnowledge = false
    ) {
        if (x1 == x2 || y1 == y2) {
            return false; // If it's not a diagonal, it's not diagonally blocked.
        }
        if (this.isObstruction(x1, y2, limitToPlayerKnowledge)) {
            return true;
        }
        if (this.isObstruction(x2, y1, limitToPlayerKnowledge)) {
            return true;
        }
        return false;
    }

    fillCostGrid(costGrid: Grid.NumGrid, costFn?: MapCostFn) {
        costFn =
            costFn ||
            ((c: Cell.Cell) => (c.isWalkableNow() ? 1 : Path.OBSTRUCTION));
        this.cells.forEach((cell, i, j) => {
            if (cell.isClear()) {
                costGrid[i][j] = Path.OBSTRUCTION;
            } else {
                costGrid[i][j] = costFn!(cell, i, j, this);
            }
        });
    }

    matchingNeighbor(
        x: number,
        y: number,
        matcher: MapMatchFn,
        only4dirs = false
    ): Utils.Loc {
        const maxIndex = only4dirs ? 4 : 8;
        for (let d = 0; d < maxIndex; ++d) {
            const dir = Utils.DIRS[d];
            const i = x + dir[0];
            const j = y + dir[1];
            if (this.hasXY(i, j)) {
                if (matcher(this.cells[i][j], i, j, this)) return [i, j];
            }
        }
        return [-1, -1];
    }

    // blockingMap is optional
    matchingLocNear(
        x: number,
        y: number,
        opts: Partial<MapMatchOptions>
    ): Utils.Loc;
    matchingLocNear(
        x: number,
        y: number,
        matcher: MapMatchFn,
        opts?: Partial<MapMatchOptions>
    ): Utils.Loc;
    matchingLocNear(x: number, y: number, ...args: any[]) {
        let i, j, k;

        let matcher: MapMatchFn = args[0];
        let opts: Partial<MapMatchOptions> = args[1] || {};

        const arg = args[0];
        if (typeof arg !== 'function') {
            opts = arg || args[1];
            matcher = opts.match || Utils.TRUE;
        }

        const hallwaysAllowed = opts.hallways || false;
        const blockingMap = opts.blockingMap || null;
        const forbidLiquid = opts.liquids === false;
        const deterministic = opts.deterministic || false;

        const candidateLocs = [];

        // count up the number of candidate locations
        for (
            k = 0;
            k < Math.max(this.width, this.height) && !candidateLocs.length;
            k++
        ) {
            for (i = x - k; i <= x + k; i++) {
                for (j = y - k; j <= y + k; j++) {
                    if (!this.hasXY(i, j)) continue;
                    const cell = this.cell(i, j);
                    // if ((i == x-k || i == x+k || j == y-k || j == y+k)
                    if (
                        Math.ceil(Utils.distanceBetween(x, y, i, j)) == k &&
                        (!blockingMap || !blockingMap[i][j]) &&
                        matcher(cell, i, j, this) &&
                        (!forbidLiquid || !cell.liquid) &&
                        (hallwaysAllowed || this.walkableArcCount(i, j) < 2)
                    ) {
                        candidateLocs.push([i, j]);
                    }
                }
            }
        }

        if (candidateLocs.length == 0) {
            return [-1, -1];
        }

        // and pick one
        let randIndex = 0;
        if (deterministic) {
            randIndex = Math.floor(candidateLocs.length / 2);
        } else {
            randIndex = random.number(candidateLocs.length);
        }
        return candidateLocs[randIndex];
    }

    // fills (*x, *y) with the coordinates of a random cell with
    // no creatures, items or stairs and with either a matching liquid and dungeon type
    // or at least one layer of type terrainType.
    // A dungeon, liquid type of -1 will match anything.
    randomMatchingLoc(opts: Partial<MapMatchOptions>): Utils.Loc;
    randomMatchingLoc(match: MapMatchFn): Utils.Loc;
    randomMatchingLoc(opts: MapMatchFn | Partial<MapMatchOptions> = {}) {
        let x;
        let y;
        let cell;

        if (typeof opts === 'function') {
            opts = { match: opts };
        }

        const sequence = random.sequence(this.width * this.height);

        const hallwaysAllowed = opts.hallways || false;
        const blockingMap = opts.blockingMap || null;
        const forbidLiquid = opts.liquids === false;
        const matcher = opts.match || Utils.TRUE;
        const forbidCellFlags = opts.forbidCellFlags || 0;
        const forbidTileFlags = opts.forbidTileFlags || 0;
        const forbidTileMechFlags = opts.forbidTileMechFlags || 0;
        const tile = opts.tile || null;

        let success = false;
        let index = 0;
        while (!success && index < sequence.length) {
            const v = sequence[index];
            x = v % this.width;
            y = Math.floor(v / this.width);
            cell = this.cell(x, y);

            if (
                (!blockingMap || !blockingMap[x][y]) &&
                (!tile || cell.hasTile(tile)) &&
                (!forbidLiquid || !cell.liquid) &&
                (!forbidCellFlags || !(cell.flags & forbidCellFlags)) &&
                (!forbidTileFlags || !cell.hasTileFlag(forbidTileFlags)) &&
                (!forbidTileMechFlags ||
                    !cell.hasTileMechFlag(forbidTileMechFlags)) &&
                (hallwaysAllowed || this.walkableArcCount(x, y) < 2) &&
                matcher(cell, x, y, this)
            ) {
                success = true;
            }
            ++index;
        }

        if (!success) {
            // map.debug('randomMatchingLocation', dungeonType, liquidType, terrainType, ' => FAIL');
            return [-1, -1];
        }

        // map.debug('randomMatchingLocation', dungeonType, liquidType, terrainType, ' => ', x, y);
        return [x, y];
    }

    // LIGHT

    hasVisibleLight(x: number, y: number) {
        return this.cell(x, y).hasVisibleLight();
    }

    addStaticLight(x: number, y: number, light: Light.Light) {
        const info: LightInfo = { x, y, light, next: this.lights };
        this.lights = info;
        this.staticLightChanged = true;
        return info;
    }

    removeStaticLight(x: number, y: number, light?: Light.Light) {
        let prev = this.lights;
        if (!prev) return;

        function matches(info: LightInfo) {
            if (info.x != x || info.y != y) return false;
            return !light || light === info.light;
        }

        this.staticLightChanged = true;

        while (prev && matches(prev)) {
            prev = this.lights = prev.next;
        }

        if (!prev) return;

        let current = prev.next;
        while (current) {
            if (matches(current)) {
                prev.next = current.next;
            } else {
                prev = current;
            }
            current = current.next;
        }
    }

    eachStaticLight(fn: MapLightFn) {
        Utils.eachChain(this.lights, (info: LightInfo) =>
            fn(info.light, info.x, info.y)
        );
        this.eachCell((cell, x, y) => {
            for (let tile of cell.tiles()) {
                if (tile.light) {
                    fn(tile.light, x, y);
                }
            }
        });
    }

    eachDynamicLight(fn: MapLightFn) {
        Utils.eachChain(this._actors, (actor: Types.ActorType) => {
            if (actor.light) fn(actor.light, actor.x, actor.y);
        });
    }

    // Layers

    addFx(x: number, y: number, anim: Types.FxType) {
        if (!this.hasXY(x, y)) return false;
        const cell = this.cell(x, y);
        cell.addLayer(anim);
        anim.x = x;
        anim.y = y;
        this.redrawCell(cell);
        return true;
    }

    moveFx(x: number, y: number, anim: Types.FxType) {
        if (!this.hasXY(x, y)) return false;
        const cell = this.cell(x, y);
        const oldCell = this.cell(anim.x, anim.y);
        oldCell.removeLayer(anim);
        this.redrawCell(oldCell);
        cell.addLayer(anim);
        this.redrawCell(cell);
        anim.x = x;
        anim.y = y;
        return true;
    }

    removeFx(anim: Types.FxType) {
        const oldCell = this.cell(anim.x, anim.y);
        oldCell.removeLayer(anim);
        this.redrawCell(oldCell);
        this.flags |= Flags.MAP_CHANGED;
        return true;
    }

    // ACTORS

    // will return the PLAYER if the PLAYER is at (x, y).
    actorAt(x: number, y: number): Types.ActorType | null {
        // creature *
        if (!this.hasXY(x, y)) return null;
        const cell = this.cell(x, y);
        return cell.actor;
    }

    addActor(x: number, y: number, theActor: Types.ActorType) {
        if (!this.hasXY(x, y)) return false;
        const cell = this.cell(x, y);
        if (cell.actor) {
            return false;
        }

        cell.actor = theActor; // adjusts the layer
        theActor.next = this._actors;
        this._actors = theActor;

        const flag =
            theActor === DATA.player
                ? CellFlags.HAS_PLAYER
                : CellFlags.HAS_ANY_ACTOR;
        cell.flags |= flag;
        // if (theActor.flags & Flags.Actor.MK_DETECTED)
        // {
        // 	cell.flags |= CellFlags.MONSTER_DETECTED;
        // }

        if (theActor.light) {
            this.anyLightChanged = true;
        }

        // If the player moves or an actor that blocks vision and the cell is visible...
        // -- we need to update the FOV
        if (
            theActor.isPlayer() ||
            (cell.isAnyKindOfVisible() && theActor.blocksVision())
        ) {
            this.flags |= Flags.MAP_FOV_CHANGED;
        }

        theActor.x = x;
        theActor.y = y;
        this.redrawCell(cell);

        return true;
    }

    addActorNear(x: number, y: number, theActor: Types.ActorType) {
        const loc = this.matchingLocNear(x, y, (cell) => {
            return !theActor.avoidsCell(cell);
        });
        if (!loc || loc[0] < 0) {
            // GW.ui.message(colors.badMessageColor, 'There is no place to put the actor.');
            return false;
        }

        return this.addActor(loc[0], loc[1], theActor);
    }

    moveActor(x: number, y: number, actor: Types.ActorType) {
        if (!this.hasXY(x, y)) return false;
        this.removeActor(actor);

        if (!this.addActor(x, y, actor)) {
            this.addActor(actor.x, actor.y, actor);
            return false;
        }
        if (actor.light) {
            this.anyLightChanged = true;
        }

        return true;
    }

    removeActor(actor: Types.ActorType) {
        if (!this.hasXY(actor.x, actor.y)) return false;
        const cell = this.cell(actor.x, actor.y);
        if (cell.actor === actor) {
            cell.actor = null;
            Utils.removeFromChain(this, 'actors', actor);

            if (actor.light) {
                this.anyLightChanged = true;
            }
            // If the player moves or an actor that blocks vision and the cell is visible...
            // -- we need to update the FOV
            if (
                actor.isPlayer() ||
                (cell.isAnyKindOfVisible() && actor.blocksVision())
            ) {
                this.flags |= Flags.MAP_FOV_CHANGED;
            }

            this.redrawCell(cell);
            return true;
        }
        return false;
    }

    deleteActorAt(x: number, y: number) {
        const actor = this.actorAt(x, y);
        if (!actor) return false;
        this.removeActor(actor);
        actor.delete();
        return true;
    }

    // dormantAt(x: number, y: number) {  // creature *
    // 	if (!(this.cell(x, y).flags & CellFlags.HAS_DORMANT_MONSTER)) {
    // 		return null;
    // 	}
    // 	return this.dormantActors.find( (m) => m.x == x && m.y == y );
    // }
    //
    // addDormant(x, y, actor) {
    // 	theActor.x = x;
    // 	theActor.y = y;
    // 	this.dormant.add(theActor);
    // 	cell.flags |= (CellFlags.HAS_DORMANT_MONSTER);
    // 	this.flags |= Flags.MAP_CHANGED;
    // 	return true;
    // }
    //
    // removeDormant(actor) {
    // 	const cell = this.cell(actor.x, actor.y);
    // 	cell.flags &= ~(CellFlags.HAS_DORMANT_MONSTER);
    // 	cell.flags |= CellFlags.NEEDS_REDRAW;
    // 	this.flags |= Flags.MAP_CHANGED;
    // 	this.dormant.remove(actor);
    // }

    // ITEMS

    itemAt(x: number, y: number): Types.ItemType | null {
        const cell = this.cell(x, y);
        return cell.item;
    }

    addItem(x: number, y: number, theItem: Types.ItemType) {
        if (!this.hasXY(x, y)) return false;
        const cell = this.cell(x, y);
        if (cell.item) {
            // GW.ui.message(colors.badMessageColor, 'There is already an item there.');
            return false;
        }
        theItem.x = x;
        theItem.y = y;

        cell.item = theItem; // adjusts the layers
        theItem.next = this._items;
        this._items = theItem;

        if (theItem.light) {
            this.anyLightChanged = true;
        }

        this.redrawCell(cell);

        if (theItem.isDetected() || CONFIG.D_ITEM_OMNISCIENCE) {
            cell.flags |= CellFlags.ITEM_DETECTED;
        }

        return true;
    }

    addItemNear(x: number, y: number, theItem: Types.ItemType) {
        const loc = this.matchingLocNear(x, y, (cell) => {
            return !theItem.forbidsCell(cell);
        });
        if (!loc || loc[0] < 0) {
            // GW.ui.message(colors.badMessageColor, 'There is no place to put the item.');
            return false;
        }

        return this.addItem(loc[0], loc[1], theItem);
    }

    removeItem(theItem: Types.ItemType) {
        const x = theItem.x;
        const y = theItem.y;
        if (!this.hasXY(x, y)) return false;
        const cell = this.cell(x, y);
        if (cell.item !== theItem) return false;

        cell.item = null;
        Utils.removeFromChain(this, 'items', theItem);

        if (theItem.light) {
            this.anyLightChanged = true;
        }

        cell.flags &= ~(CellFlags.HAS_ITEM | CellFlags.ITEM_DETECTED);
        this.redrawCell(cell);
        return true;
    }

    // // PROMOTE
    //
    // async promote(x, y, mechFlag) {
    // 	if (this.hasTileMechFlag(x, y, mechFlag)) {
    // 		const cell = this.cell(x, y);
    // 		for (let tile of cell.tiles()) {
    // 			if (tile.mechFlags & mechFlag) {
    // 				await tile.promote(this, x, y, false);
    // 			}
    // 		}
    // 	}
    // }

    gridDisruptsWalkability(
        blockingGrid: Grid.NumGrid,
        opts: Partial<DisruptsOptions> = {}
    ) {
        const walkableGrid = Grid.alloc(this.width, this.height);
        let disrupts = false;

        const gridOffsetX = opts.gridOffsetX || 0;
        const gridOffsetY = opts.gridOffsetY || 0;
        const bounds = opts.bounds || null; // TODO - Where is this used ???

        // Get all walkable locations after lake added
        this.cells.forEach((cell, i, j) => {
            if (bounds && !bounds.contains(i, j)) return; // outside bounds
            const blockingX = i + gridOffsetX;
            const blockingY = j + gridOffsetY;
            if (cell.isClear()) {
                return; // not walkable
            } else if (cell.hasTileFlag(TileFlags.T_HAS_STAIRS)) {
                if (blockingGrid.get(blockingX, blockingY)) {
                    disrupts = true;
                } else {
                    walkableGrid[i][j] = 1;
                }
            } else if (cell.canBeWalked()) {
                if (blockingGrid.get(blockingX, blockingY)) return;
                walkableGrid[i][j] = 1;
            }
        });

        let first = true;
        for (let i = 0; i < walkableGrid.width && !disrupts; ++i) {
            for (let j = 0; j < walkableGrid.height && !disrupts; ++j) {
                if (walkableGrid[i][j] == 1) {
                    if (first) {
                        walkableGrid.floodFill(i, j, 1, 2);
                        first = false;
                    } else {
                        disrupts = true;
                    }
                }
            }
        }

        Grid.free(walkableGrid);
        return disrupts;
    }

    // FOV

    // Returns a boolean grid indicating whether each square is in the field of view of (xLoc, yLoc).
    // forbiddenTileFlags is the set of terrain flags that will block vision (but the blocking cell itself is
    // illuminated); forbiddenCellFlags is the set of map flags that will block vision.
    // If cautiousOnWalls is set, we will not illuminate blocking tiles unless the tile one space closer to the origin
    // is visible to the player; this is to prevent lights from illuminating a wall when the player is on the other
    // side of the wall.
    calcFov(
        grid: Grid.NumGrid,
        x: number,
        y: number,
        maxRadius: number,
        forbiddenCellFlags = 0,
        forbiddenLayerFlags = LayerFlags.L_BLOCKS_VISION
    ) {
        maxRadius = maxRadius || this.width + this.height;
        grid.fill(0);
        const map = this;
        const FOV = new Fov.FOV({
            isBlocked(i, j) {
                return !!(
                    !grid.hasXY(i, j) ||
                    map.hasCellFlag(i, j, forbiddenCellFlags) ||
                    map.hasLayerFlag(i, j, forbiddenLayerFlags)
                );
            },
            calcRadius(x: number, y: number) {
                return Math.sqrt(x ** 2 + y ** 2);
            },
            setVisible(x, y) {
                grid[x][y] = 1;
            },
            hasXY(x: number, y: number) {
                return grid.hasXY(x, y);
            },
        });
        return FOV.calculate(x, y, maxRadius);
    }

    losFromTo(a: Utils.XY, b: Utils.XY) {
        if (Utils.equalsXY(a, b)) return true;
        const line = Utils.getLine(a.x, a.y, b.x, b.y);
        if (!line.length) return false;

        return !line.some((loc) => {
            return this.blocksVision(loc[0], loc[1]);
        });
    }

    // MEMORIES

    storeMemory(x: number, y: number) {
        const cell = this.cell(x, y);
        cell.storeMemory();
    }

    storeMemories() {
        let x, y;
        for (x = 0; x < this.width; ++x) {
            for (y = 0; y < this.height; ++y) {
                const cell = this.cell(x, y);
                if (cell.flags & CellFlags.ANY_KIND_OF_VISIBLE) {
                    cell.storeMemory();
                }
                // cell.flags &= CellFlags.PERMANENT_CELL_FLAGS;
                // cell.mechFlags &= CellMechFlags.PERMANENT_MECH_FLAGS;
            }
        }
    }

    // TICK

    async activateCell(x: number, y: number, event: string) {
        const cell = this.cell(x, y);
        return await cell.activate(event, { map: this, x, y, cell });
    }

    async tick() {
        // map.debug("tick");
        this.resetCellEvents();
        for (let x = 0; x < this.width; ++x) {
            for (let y = 0; y < this.height; ++y) {
                const cell = this.cells[x][y];
                await cell.activate('tick', {
                    map: this,
                    x,
                    y,
                    cell,
                    safe: true,
                });
            }
        }

        if (!(this.flags & Flags.MAP_NO_LIQUID)) {
            const newVolume = Grid.alloc(this.width, this.height);
            const calc = calcBaseVolume(this, TileLayer.LIQUID, newVolume);

            if (calc === CalcType.CALC) {
                this.updateLiquid(newVolume);
            }

            if (calc != CalcType.NONE) {
                updateVolume(this, TileLayer.LIQUID, newVolume);
                this.flags &= ~Flags.MAP_NO_LIQUID;
            } else {
                this.flags |= Flags.MAP_NO_LIQUID;
            }
            this.changed = true;
            Grid.free(newVolume);
        }

        if (!(this.flags & Flags.MAP_NO_GAS)) {
            const newVolume = Grid.alloc(this.width, this.height);
            const calc = calcBaseVolume(this, TileLayer.GAS, newVolume);

            if (calc === CalcType.CALC) {
                this.updateGas(newVolume);
            }

            if (calc != CalcType.NONE) {
                updateVolume(this, TileLayer.GAS, newVolume);
                this.flags &= ~Flags.MAP_NO_GAS;
            } else {
                this.flags |= Flags.MAP_NO_GAS;
            }
            this.changed = true;
            Grid.free(newVolume);
        }
    }

    updateLiquid(newVolume: Grid.NumGrid) {
        this.randomEach((c: Cell.Cell, x: number, y: number) => {
            if (c.hasLayerFlag(Layer.Flags.L_BLOCKS_LIQUID)) return;
            let highVol = 0;
            let highX = -1;
            let highY = -1;
            let highTile = c.liquidTile;

            let myVol = newVolume[x][y];

            newVolume.eachNeighbor(x, y, (v, i, j) => {
                if (v <= myVol) return;
                if (v <= highVol) return;
                highVol = v;
                highX = i;
                highY = j;
                highTile = this.cell(i, j).liquidTile;
            });

            if (highVol > 1) {
                // guaranteed => myVol < highVol
                this.setTile(x, y, highTile, 0); // place tile with 0 volume - will force liquid to be same as highest volume liquid neighbor
                const amt = Math.floor((highVol - myVol) / 9) + 1;
                newVolume[x][y] += amt;
                newVolume[highX][highY] -= amt;
            }
        });
        // }
    }

    updateGas(newVolume: Grid.NumGrid) {
        const dirs = random.sequence(4).map((i) => Utils.DIRS[i]);
        const grid = Grid.alloc(this.width, this.height);

        // push out from my square
        newVolume.forEach((v, x, y) => {
            if (!v) return;
            let adj = v;
            if (v > 1) {
                let count = 1;
                newVolume.eachNeighbor(
                    x,
                    y,
                    () => {
                        ++count;
                    },
                    true
                ); // only 4 dirs

                let avg = Math.floor(v / count);
                let rem = v - avg * count;

                grid[x][y] += avg;

                if (rem > 0) {
                    grid[x][y] += 1;
                    rem -= 1;
                }

                for (let i = 0; i < dirs.length; ++i) {
                    const dir = dirs[i];
                    const x2 = x + dir[0];
                    const y2 = y + dir[1];

                    if (grid.hasXY(x2, y2)) {
                        adj = avg;
                        if (rem > 0) {
                            --rem;
                            ++adj;
                        }
                        grid[x2][y2] += adj;
                    }
                }
            } else {
                grid[x][y] += v;
            }
        });

        newVolume.copy(grid);
        Grid.free(grid);
        // newVolume.dump();
    }

    resetCellEvents() {
        this.forEach(
            (c) =>
                (c.mechFlags &= ~(
                    CellMechFlags.EVENT_FIRED_THIS_TURN |
                    CellMechFlags.EVENT_PROTECTED
                ))
        );
    }
}

export function make(w: number, h: number, floor: string, wall: string): Map;
export function make(w: number, h: number, floor: string): Map;
export function make(w: number, h: number, opts?: any): Map;
export function make(w: number, h: number, opts: any = {}, wall?: string) {
    if (typeof opts === 'string') {
        opts = { tile: opts };
        if (wall) {
            opts.wall = wall;
        }
    }
    const map = new Map(w, h, opts);
    let floor = opts.tile || opts.floor || opts.floorTile;
    if (floor === true) {
        floor = 'FLOOR';
    }
    let boundary = opts.boundary || opts.wall || opts.wallTile;
    if (boundary === true) {
        boundary = 'WALL';
    }
    if (floor) {
        map.fill(floor, boundary);
    }

    if (opts.visible || opts.revealed) {
        map.makeVisible();
        map.revealAll();
    }
    if (opts.revealed && !opts.visible) {
        map.makeVisible(false);
    }

    if (!DATA.map) {
        DATA.map = map;
    }
    return map;
}

Make.map = make;

export function from(
    prefab: string | string[],
    charToTile: Record<string, Cell.TileBase | null>,
    opts: any = {}
) {
    if (!Array.isArray(prefab)) {
        prefab = prefab.split('\n');
    }
    const height = prefab.length;
    const width = prefab.reduce((len, line) => Math.max(len, line.length), 0);
    const map = make(width, height, opts);

    prefab.forEach((line, y) => {
        for (let x = 0; x < width; ++x) {
            const ch = line[x] || '.';
            const tile = charToTile[ch] || 'FLOOR';
            map.setTile(x, y, tile);
        }
    });

    // redo this because we changed the tiles
    if (opts.visible || opts.revealed) {
        map.makeVisible();
        map.revealAll();
    }
    if (opts.revealed && !opts.visible) {
        map.makeVisible(false);
    }
    return map;
}

if (!COLORS.cursor) {
    Color.install('cursor', COLORS.yellow);
}
if (!COLORS.path) {
    Color.install('path', COLORS.gold);
}

export function getCellAppearance(
    map: Map,
    x: number,
    y: number,
    dest: Sprite.Mixer
) {
    dest.blackOut();
    if (!map.hasXY(x, y)) return;
    const cell = map.cell(x, y);

    if (
        cell.isAnyKindOfVisible() &&
        cell.flags & (CellFlags.CELL_CHANGED | CellFlags.NEEDS_REDRAW)
    ) {
        Cell.getAppearance(cell, dest);
    } else {
        // if (cell.isRevealed()) {
        dest.drawSprite(cell.memory.mixer);
    }

    if (cell.isVisible()) {
        // keep here to allow for games that do not use fov to work
    } else if (!cell.isRevealed()) {
        if (!cell.isAnyKindOfVisible()) dest.blackOut();
    } else if (!cell.isAnyKindOfVisible()) {
        dest.bg.mix(COLORS.black, 30);
        dest.fg.mix(COLORS.black, 30);
    }

    let needDistinctness = false;
    if (cell.flags & (CellFlags.IS_CURSOR | CellFlags.IS_IN_PATH)) {
        const highlight =
            cell.flags & CellFlags.IS_CURSOR ? COLORS.cursor : COLORS.path;
        if (cell.hasLayerFlag(LayerFlags.L_INVERT_WHEN_HIGHLIGHTED)) {
            Color.swap(dest.fg, dest.bg);
        } else {
            // if (!GAME.trueColorMode || !dest.needDistinctness) {
            // dest.fg.mix(highlight, CONFIG.cursorPathIntensity || 20);
            // }
            dest.bg.mix(highlight, CONFIG.cursorPathIntensity || 20);
        }
        needDistinctness = true;
    }

    if (needDistinctness) {
        Color.separate(dest.fg, dest.bg);
    }

    // dest.bake();
}

export function addText(
    map: Map,
    x: number,
    y: number,
    text: string,
    fg: Color.ColorBase | null,
    bg: Color.ColorBase | null,
    layer?: TileLayer
) {
    for (let ch of text) {
        const sprite = Layer.make({
            ch,
            fg,
            bg,
            layer: layer || TileLayer.GROUND,
            priority: 200,
        }); // on top of ground tiles
        const cell = map.cell(x++, y);
        cell.addLayer(sprite);
    }
}

enum CalcType {
    NONE = 0,
    UPDATE = 1,
    CALC = 2,
}

function calcBaseVolume(
    map: Map,
    depth: TileLayer,
    newVolume: Grid.NumGrid
): CalcType {
    let hasVolume = false;
    let needsAjustment = false;

    map.forEach((c, x, y) => {
        let volume = c.volume(depth);
        const tile = c.tile(depth);
        if (volume && tile.dissipate) {
            if (tile.dissipate > 10000) {
                volume -= Math.floor(tile.dissipate / 10000);
                if (random.chance(tile.dissipate % 10000, 10000)) {
                    volume -= 1;
                }
            } else if (random.chance(tile.dissipate, 10000)) {
                volume -= 1;
            }
        }
        if (volume > 0) {
            newVolume[x][y] = volume;
            hasVolume = true;
            if (volume > 1) {
                needsAjustment = true;
            }
        } else if (tile !== Tile.tiles.NULL) {
            c.clearLayer(depth);
            map.redrawCell(c);
        }
    });

    if (needsAjustment) return CalcType.CALC;
    if (hasVolume) return CalcType.UPDATE;
    return CalcType.NONE;
}

function updateVolume(map: Map, depth: TileLayer, newVolume: Grid.NumGrid) {
    newVolume.forEach((v, i, j) => {
        const cell = map.cell(i, j);
        const current = cell.volume(depth);
        const tile = cell.tile(depth);
        if (v > 0) {
            // hasLiquid = true;
            if (current !== v || !tile) {
                let highVol = current;
                let highTile = tile;

                map.eachNeighbor(i, j, (n) => {
                    if (n.volume(depth) > highVol) {
                        highVol = n.volume(depth);
                        highTile = n.tile(depth);
                    }
                });

                if (highTile !== tile) {
                    cell.setTile(highTile, 0, map);
                }

                cell.setVolume(depth, v);
                map.redrawCell(cell);
            }
        } else if (current || tile !== Tile.tiles.NULL) {
            cell.clearLayer(depth);
            map.redrawCell(cell);
        }
    });
}
