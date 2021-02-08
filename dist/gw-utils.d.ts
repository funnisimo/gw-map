import { color, types, effect, sprite, grid, utils, canvas, range, flag } from 'gw-utils';

declare enum Layer {
    ALL_LAYERS = -1,
    GROUND = 0,
    LIQUID = 1,
    SURFACE = 2,
    GAS = 3,
    ITEM = 4,
    ACTOR = 5,
    PLAYER = 6,
    FX = 7,
    UI = 8
}
declare enum Entity {
    L_SUPERPRIORITY,
    L_SECRETLY_PASSABLE,
    L_BLOCKS_MOVE,
    L_BLOCKS_VISION,
    L_BLOCKS_SURFACE,
    L_BLOCKS_LIQUID,
    L_BLOCKS_GAS,
    L_BLOCKS_ITEMS,
    L_BLOCKS_ACTORS,
    L_BLOCKS_EFFECTS,
    L_BLOCKS_DIAGONAL,
    L_INTERRUPT_WHEN_SEEN,
    L_LIST_IN_SIDEBAR,
    L_VISUALLY_DISTINCT,
    L_BRIGHT_MEMORY,
    L_INVERT_WHEN_HIGHLIGHTED,
    L_BLOCKED_BY_STAIRS,
    L_BLOCKS_SCENT,
    L_DIVIDES_LEVEL,
    L_WAYPOINT_BLOCKER,
    L_IS_WALL,
    L_BLOCKS_EVERYTHING
}
declare enum Tile {
    T_BRIDGE,
    T_AUTO_DESCENT,
    T_LAVA,
    T_DEEP_WATER,
    T_IS_FLAMMABLE,
    T_SPONTANEOUSLY_IGNITES,
    T_IS_FIRE,
    T_EXTINGUISHES_FIRE,
    T_IS_SECRET,
    T_IS_TRAP,
    T_SACRED,
    T_UP_STAIRS,
    T_DOWN_STAIRS,
    T_PORTAL,
    T_IS_DOOR,
    T_ALLOWS_SUBMERGING,
    T_ENTANGLES,
    T_REFLECTS,
    T_STAND_IN_TILE,
    T_CONNECTS_LEVEL,
    T_HAS_STAIRS,
    T_OBSTRUCTS_SCENT,
    T_PATHING_BLOCKER,
    T_DIVIDES_LEVEL,
    T_LAKE_PATHING_BLOCKER,
    T_WAYPOINT_BLOCKER,
    T_MOVES_ITEMS,
    T_CAN_BE_BRIDGED,
    T_IS_DEEP_LIQUID
}
declare enum TileMech {
    TM_IS_WIRED,
    TM_IS_CIRCUIT_BREAKER,
    TM_VANISHES_UPON_PROMOTION,
    TM_EXPLOSIVE_PROMOTE,
    TM_SWAP_ENCHANTS_ACTIVATION
}
declare enum Cell {
    VISIBLE,
    WAS_VISIBLE,
    CLAIRVOYANT_VISIBLE,
    WAS_CLAIRVOYANT_VISIBLE,
    TELEPATHIC_VISIBLE,
    WAS_TELEPATHIC_VISIBLE,
    ITEM_DETECTED,
    WAS_ITEM_DETECTED,
    MONSTER_DETECTED,
    WAS_MONSTER_DETECTED,
    REVEALED,
    MAGIC_MAPPED,
    IN_FOV,
    WAS_IN_FOV,
    NEEDS_REDRAW,
    CELL_CHANGED,
    HAS_SURFACE,
    HAS_LIQUID,
    HAS_GAS,
    HAS_PLAYER,
    HAS_ACTOR,
    HAS_DORMANT_MONSTER,
    HAS_ITEM,
    IS_IN_PATH,
    IS_CURSOR,
    STABLE_MEMORY,
    LIGHT_CHANGED,
    CELL_LIT,
    IS_IN_SHADOW,
    CELL_DARK,
    PERMANENT_CELL_FLAGS,
    ANY_KIND_OF_VISIBLE,
    HAS_ANY_ACTOR,
    IS_WAS_ANY_KIND_OF_VISIBLE,
    WAS_ANY_KIND_OF_VISIBLE,
    CELL_DEFAULT
}
declare enum CellMech {
    SEARCHED_FROM_HERE,
    PRESSURE_PLATE_DEPRESSED,
    KNOWN_TO_BE_TRAP_FREE,
    CAUGHT_FIRE_THIS_TURN,
    EVENT_FIRED_THIS_TURN,
    EVENT_PROTECTED,
    IS_IN_LOOP,
    IS_CHOKEPOINT,
    IS_GATE_SITE,
    IS_IN_ROOM_MACHINE,
    IS_IN_AREA_MACHINE,
    IS_POWERED,
    IMPREGNABLE,
    DARKENED,
    IS_IN_MACHINE,
    PERMANENT_MECH_FLAGS
}
declare enum Map {
    MAP_CHANGED,
    MAP_STABLE_GLOW_LIGHTS,
    MAP_STABLE_LIGHTS,
    MAP_ALWAYS_LIT,
    MAP_SAW_WELCOME,
    MAP_NO_LIQUID,
    MAP_NO_GAS,
    MAP_CALC_FOV,
    MAP_FOV_CHANGED,
    MAP_DEFAULT
}

interface NameConfig {
    article?: boolean | string;
    color?: boolean | string | color.ColorBase;
}
interface FullTileConfig extends EntityConfig {
    Extends: string | Tile$1;
    flags: number | string | any[];
    mechFlags: number | string | any[];
    priority: number;
    activates: any;
    flavor: string;
    desc: string;
    name: string;
    article: string;
    id: string;
    ground: string;
    dissipate: number;
}
declare type AtLeast<T, K extends keyof T> = Partial<T> & Pick<T, K>;
declare type TileConfig = AtLeast<FullTileConfig, 'id'>;
/** Tile Class */
declare class Tile$1 extends Entity$1 implements types.TileType {
    name: string;
    flags: types.TileFlags;
    activates: Record<string, effect.Effect | string>;
    flavor: string | null;
    desc: string | null;
    article: string | null;
    id: string;
    dissipate: number;
    defaultGround: string | null;
    /**
     * Creates a new Tile object.
     * @param {Object} [config={}] - The configuration of the Tile
     * @param {String|Number|String[]} [config.flags=0] - Flags and MechFlags for the tile
     * @param {String} [config.layer=GROUND] - Name of the layer for this tile
     * @param {String} [config.ch] - The sprite character
     * @param {String} [config.fg] - The sprite foreground color
     * @param {String} [config.bg] - The sprite background color
     */
    constructor(config: TileConfig);
    /**
     * Returns whether or not this tile as the given flag.
     * Will return true if any bit in the flag is true, so testing with
     * multiple flags will return true if any of them is set.
     * @param {number} flag - The flag to check
     * @returns {boolean} Whether or not the flag is set
     */
    hasAllFlags(flag: number): boolean;
    hasAllLayerFlags(flag: number): boolean;
    hasAllMechFlags(flag: number): boolean;
    blocksPathing(): number;
    activatesOn(name: string): boolean;
    getName(): string;
    getName(opts: NameConfig): string;
    getName(article: string): string;
    getName(article: boolean): string;
    getDescription(opts?: any): string;
}
declare function make(config: TileConfig): Tile$1;
declare const tiles: Record<string, Tile$1>;
/**
 * Adds a new Tile into the GW.tiles collection.
 * @param {String} [id] - The identifier for this Tile
 * @param {Tile|string} [base] - The base tile from which to extend (id or object)
 * @param {Object} config - The tile configuration
 * @returns {Tile} The newly created tile
 */
declare function install(id: string, base: string | Tile$1, config: Partial<TileConfig>): Tile$1;
declare function install(id: string, config: Partial<TileConfig>): Tile$1;
declare function install(config: TileConfig): Tile$1;
/**
 * Adds multiple tiles to the GW.tiles collection.
 * It extracts all the id:opts pairs from the config object and uses
 * them to call addTileKind.
 * @param {Object} config - The tiles to add in [id, config] pairs
 * @returns {void} Nothing
 * @see addTileKind
 */
declare function installAll(config: Record<string, Partial<TileConfig>>): void;

type tile_d_NameConfig = NameConfig;
type tile_d_FullTileConfig = FullTileConfig;
type tile_d_TileConfig = TileConfig;
declare const tile_d_make: typeof make;
declare const tile_d_tiles: typeof tiles;
declare const tile_d_install: typeof install;
declare const tile_d_installAll: typeof installAll;
declare namespace tile_d {
  export {
    Tile as Flags,
    TileMech as MechFlags,
    tile_d_NameConfig as NameConfig,
    tile_d_FullTileConfig as FullTileConfig,
    tile_d_TileConfig as TileConfig,
    Tile$1 as Tile,
    tile_d_make as make,
    tile_d_tiles as tiles,
    tile_d_install as install,
    tile_d_installAll as installAll,
  };
}

declare class CellMemory {
    mixer: sprite.Mixer;
    item: types.ItemType | null;
    itemQuantity: number;
    actor: types.ActorType | null;
    tile: Tile$1 | null;
    cellFlags: number;
    cellMechFlags: number;
    layerFlags: number;
    tileFlags: number;
    tileMechFlags: number;
    constructor();
    clear(): void;
    copy(other: CellMemory): void;
}
declare type TileBase = Tile$1 | string;
interface LayerItem {
    layer: types.EntityType;
    next: LayerItem | null;
}
declare type LayerTile = Tile$1 | null;
declare class Cell$1 implements types.CellType {
    _tiles: LayerTile[];
    layers: LayerItem | null;
    protected _actor: types.ActorType | null;
    protected _item: types.ItemType | null;
    data: any;
    flags: Cell;
    mechFlags: CellMech;
    gasVolume: number;
    liquidVolume: number;
    machineNumber: number;
    memory: CellMemory;
    light: [number, number, number];
    oldLight: [number, number, number];
    glowLight: [number, number, number];
    constructor();
    copy(other: Cell$1): void;
    nullify(): void;
    clear(floorTile?: string | Tile$1): void;
    get ground(): string | null;
    get liquid(): string | null;
    get surface(): string | null;
    get gas(): string | null;
    get groundTile(): Tile$1;
    get liquidTile(): Tile$1;
    get surfaceTile(): Tile$1;
    get gasTile(): Tile$1;
    dump(): string;
    get changed(): boolean;
    set changed(v: boolean);
    isVisible(): boolean;
    isAnyKindOfVisible(): number;
    isOrWasAnyKindOfVisible(): number;
    isRevealed(orMapped?: boolean): boolean;
    listInSidebar(): boolean;
    get needsRedraw(): boolean;
    set needsRedraw(v: boolean);
    hasVisibleLight(): boolean;
    isDark(darkColor?: color.Color | [number, number, number]): boolean;
    get lightChanged(): boolean;
    set lightChanged(v: boolean);
    tile(layer?: Layer): Tile$1;
    tileId(layer?: Layer): string | null;
    volume(layer?: Layer): number;
    setVolume(layer: Layer, volume?: number): void;
    tiles(): Generator<Tile$1>;
    layerFlags(limitToPlayerKnowledge?: boolean): number;
    tileFlags(limitToPlayerKnowledge?: boolean): number;
    tileMechFlags(limitToPlayerKnowledge?: boolean): number;
    hasLayerFlag(flag: Entity, limitToPlayerKnowledge?: boolean): boolean;
    hasAllLayerFlags(flag: Entity, limitToPlayerKnowledge?: boolean): boolean;
    hasTileFlag(flagMask: Tile, limitToPlayerKnowledge?: boolean): boolean;
    hasAllTileFlags(flags: Tile, limitToPlayerKnowledge?: boolean): boolean;
    hasTileMechFlag(flagMask: TileMech, limitToPlayerKnowledge?: boolean): boolean;
    hasAllTileMechFlags(flags: TileMech, limitToPlayerKnowledge?: boolean): boolean;
    setFlags(cellFlag?: Cell, cellMechFlag?: CellMech): void;
    clearFlags(cellFlag?: Cell, cellMechFlag?: CellMech): void;
    hasFlag(flag: Cell, limitToPlayerKnowledge?: boolean): boolean;
    hasMechFlag(flag: CellMech, limitToPlayerKnowledge?: boolean): boolean;
    hasTile(tile: string | types.TileType): boolean;
    topmostTile(skipGas?: boolean): Tile$1;
    tileWithLayerFlag(layerFlag: number): Tile$1 | null;
    tileWithFlag(tileFlag: number): Tile$1 | null;
    tileWithMechFlag(mechFlag: number): Tile$1 | null;
    tileDesc(): string | null;
    tileFlavor(): string | null;
    getName(opts?: {}): string;
    isNull(): boolean;
    isClear(): boolean;
    isEmpty(): boolean;
    isMoveableNow(limitToPlayerKnowledge?: boolean): boolean;
    isWalkableNow(limitToPlayerKnowledge?: boolean): boolean;
    canBeWalked(limitToPlayerKnowledge?: boolean): boolean;
    isWall(limitToPlayerKnowledge?: boolean): boolean;
    isObstruction(limitToPlayerKnowledge?: boolean): boolean;
    isDoorway(limitToPlayerKnowledge?: boolean): boolean;
    isSecretDoorway(limitToPlayerKnowledge?: boolean): boolean;
    blocksPathing(limitToPlayerKnowledge?: boolean): boolean;
    blocksVision(): boolean;
    blocksEffects(): boolean;
    isLiquid(limitToPlayerKnowledge?: boolean): boolean;
    hasGas(limitToPlayerKnowledge?: boolean): boolean;
    hasKey(): boolean;
    markRevealed(): boolean;
    obstructsLayer(depth: Layer): boolean;
    setTile(tileId?: TileBase | null, volume?: number, map?: Map$1): true | void;
    clearLayer(depth: Layer): void;
    clearLayersExcept(except?: Layer, ground?: string | null): void;
    clearLayersWithFlags(tileFlags: number, tileMechFlags?: number): void;
    activate(name: string, map: Map$1, x: number, y: number, ctx?: any): Promise<boolean>;
    activatesOn(name: string): boolean;
    get item(): types.ItemType | null;
    set item(item: types.ItemType | null);
    get actor(): types.ActorType | null;
    set actor(actor: types.ActorType | null);
    addLayer(layer: types.EntityType): void;
    removeLayer(layer: types.EntityType): boolean;
    storeMemory(): void;
}
declare function make$1(tile?: string): Cell$1;
declare function getAppearance(cell: Cell$1, dest: sprite.Mixer): boolean;

type cell_d_CellMemory = CellMemory;
declare const cell_d_CellMemory: typeof CellMemory;
type cell_d_TileBase = TileBase;
declare const cell_d_getAppearance: typeof getAppearance;
declare namespace cell_d {
  export {
    Cell as Flags,
    CellMech as MechFlags,
    cell_d_CellMemory as CellMemory,
    cell_d_TileBase as TileBase,
    Cell$1 as Cell,
    make$1 as make,
    cell_d_getAppearance as getAppearance,
  };
}

interface MapDrawOptions {
    x: number;
    y: number;
    width: number;
    height: number;
    mapOffsetX: number;
    mapOffsetY: number;
    force: boolean;
}
declare type MapEachFn = (cell: Cell$1, x: number, y: number, map: Map$1) => any;
declare type AsyncMapEachFn = (cell: Cell$1, x: number, y: number, map: Map$1) => Promise<any>;
declare type MapMatchFn = (cell: Cell$1, x: number, y: number, map: Map$1) => boolean;
declare type MapCostFn = (cell: Cell$1, x: number, y: number, map: Map$1) => number;
interface MapMatchOptions {
    hallways: boolean;
    blockingMap: grid.NumGrid;
    liquids: boolean;
    match: MapMatchFn;
    forbidCellFlags: number;
    forbidTileFlags: number;
    forbidTileMechFlags: number;
    tile: Tile$1;
    deterministic: boolean;
}
interface LightInfo extends utils.Chainable {
    light: types.LightType;
    x: number;
    y: number;
    next: LightInfo | null;
}
declare type MapLightFn = (light: types.LightType, x: number, y: number) => void;
interface DisruptsOptions {
    gridOffsetX: number;
    gridOffsetY: number;
    bounds: types.Bounds | null;
}
interface MapFovInfo extends utils.XY {
    lastRadius: number;
}
declare class Map$1 implements types.MapType {
    protected _width: number;
    protected _height: number;
    cells: grid.Grid<Cell$1>;
    locations: any;
    config: any;
    protected _actors: any | null;
    protected _items: any | null;
    flags: number;
    ambientLight: color.Color;
    lights: LightInfo | null;
    id: string;
    fov: utils.XY | null;
    constructor(w: number, h: number, opts?: any);
    get width(): number;
    get height(): number;
    start(): Promise<void>;
    clear(floorTile?: string | Tile$1): void;
    dump(fmt?: (cell: Cell$1) => string): void;
    cell(x: number, y: number): Cell$1;
    eachCell(fn: MapEachFn): void;
    forEach(fn: MapEachFn): void;
    forEachAsync(fn: AsyncMapEachFn): Promise<void>;
    forRect(x: number, y: number, w: number, h: number, fn: MapEachFn): void;
    eachNeighbor(x: number, y: number, fn: MapEachFn, only4dirs?: boolean): void;
    eachNeighborAsync(x: number, y: number, fn: AsyncMapEachFn, only4dirs?: boolean): Promise<void>;
    randomEach(fn: MapEachFn): void;
    count(fn: MapMatchFn): number;
    hasXY(x: number, y: number): boolean;
    isBoundaryXY(x: number, y: number): boolean;
    get changed(): boolean;
    set changed(v: boolean);
    hasCellFlag(x: number, y: number, flag: Cell): number;
    hasCellMechFlag(x: number, y: number, flag: CellMech): number;
    hasLayerFlag(x: number, y: number, flag: Entity): boolean;
    hasTileFlag(x: number, y: number, flag: Tile): boolean;
    hasTileMechFlag(x: number, y: number, flag: TileMech): boolean;
    redrawCell(cell: Cell$1): void;
    redrawXY(x: number, y: number): void;
    redrawAll(): void;
    drawInto(canvas: canvas.Canvas | canvas.DataBuffer, opts?: Partial<MapDrawOptions> | boolean): void;
    revealAll(): void;
    markRevealed(x: number, y: number): void;
    makeVisible(v?: boolean): void;
    isVisible(x: number, y: number): boolean;
    isAnyKindOfVisible(x: number, y: number): number;
    isOrWasAnyKindOfVisible(x: number, y: number): number;
    isRevealed(x: number, y: number): boolean;
    get anyLightChanged(): boolean;
    set anyLightChanged(v: boolean);
    get ambientLightChanged(): boolean;
    set ambientLightChanged(v: boolean);
    get staticLightChanged(): boolean;
    set staticLightChanged(v: boolean);
    setFlag(flag: number): void;
    setFlags(mapFlag?: number, cellFlag?: number, cellMechFlag?: number): void;
    clearFlag(flag: number): void;
    clearFlags(mapFlag?: number, cellFlag?: number, cellMechFlag?: number): void;
    setCellFlags(x: number, y: number, cellFlag?: number, cellMechFlag?: number): void;
    clearCellFlags(x: number, y: number, cellFlags?: number, cellMechFlags?: number): void;
    hasTile(x: number, y: number, tile: string): boolean;
    layerFlags(x: number, y: number, limitToPlayerKnowledge?: boolean): number;
    tileFlags(x: number, y: number, limitToPlayerKnowledge?: boolean): number;
    tileMechFlags(x: number, y: number, limitToPlayerKnowledge?: boolean): number;
    tileWithLayerFlag(x: number, y: number, mechFlag?: number): Tile$1 | null;
    tileWithFlag(x: number, y: number, flag?: number): Tile$1 | null;
    tileWithMechFlag(x: number, y: number, mechFlag?: number): Tile$1 | null;
    hasKnownTileFlag(x: number, y: number, flagMask?: number): number;
    isClear(x: number, y: number): boolean;
    isEmpty(x: number, y: number): boolean;
    isObstruction(x: number, y: number, limitToPlayerKnowledge?: boolean): boolean;
    isDoorway(x: number, y: number, limitToPlayerKnowledge?: boolean): boolean;
    isSecretDoorway(x: number, y: number, limitToPlayerKnowledge?: boolean): boolean;
    isLiquid(x: number, y: number, limitToPlayerKnowledge?: boolean): boolean;
    hasGas(x: number, y: number, limitToPlayerKnowledge?: boolean): boolean;
    blocksPathing(x: number, y: number, limitToPlayerKnowledge?: boolean): boolean;
    blocksVision(x: number, y: number): boolean;
    isMoveableNow(x: number, y: number, limitToPlayerKnowledge?: boolean): boolean;
    isWalkableNow(x: number, y: number, limitToPlayerKnowledge?: boolean): boolean;
    canBeWalked(x: number, y: number, limitToPlayerKnowledge?: boolean): boolean;
    topmostTile(x: number, y: number, skipGas?: boolean): Tile$1;
    tileFlavor(x: number, y: number): string | null;
    setTile(x: number, y: number, tileId: TileBase | null, volume?: number): true | void;
    nullifyCell(x: number, y: number): void;
    clearCell(x: number, y: number): void;
    clearCellLayersWithFlags(x: number, y: number, tileFlags: Tile, tileMechFlags?: TileMech): void;
    fill(tileId: string | null, boundaryTile?: string | null): void;
    neighborCount(x: number, y: number, matchFn: MapMatchFn, only4dirs?: boolean): number;
    walkableArcCount(x: number, y: number): number;
    diagonalBlocked(x1: number, y1: number, x2: number, y2: number, limitToPlayerKnowledge?: boolean): boolean;
    fillCostGrid(costGrid: grid.NumGrid, costFn?: MapCostFn): void;
    matchingNeighbor(x: number, y: number, matcher: MapMatchFn, only4dirs?: boolean): utils.Loc;
    matchingLocNear(x: number, y: number, opts: Partial<MapMatchOptions>): utils.Loc;
    matchingLocNear(x: number, y: number, matcher: MapMatchFn, opts?: Partial<MapMatchOptions>): utils.Loc;
    randomMatchingLoc(opts: Partial<MapMatchOptions>): utils.Loc;
    randomMatchingLoc(match: MapMatchFn): utils.Loc;
    hasVisibleLight(x: number, y: number): boolean;
    addStaticLight(x: number, y: number, light: Light): LightInfo;
    removeStaticLight(x: number, y: number, light?: Light): void;
    eachStaticLight(fn: MapLightFn): void;
    eachDynamicLight(fn: MapLightFn): void;
    addFx(x: number, y: number, anim: types.FxType): boolean;
    moveFx(x: number, y: number, anim: types.FxType): boolean;
    removeFx(anim: types.FxType): boolean;
    actorAt(x: number, y: number): types.ActorType | null;
    addActor(x: number, y: number, theActor: types.ActorType): boolean;
    addActorNear(x: number, y: number, theActor: types.ActorType): boolean;
    moveActor(x: number, y: number, actor: types.ActorType): boolean;
    removeActor(actor: types.ActorType): boolean;
    deleteActorAt(x: number, y: number): boolean;
    itemAt(x: number, y: number): types.ItemType | null;
    addItem(x: number, y: number, theItem: types.ItemType): boolean;
    addItemNear(x: number, y: number, theItem: types.ItemType): boolean;
    removeItem(theItem: types.ItemType): boolean;
    gridDisruptsWalkability(blockingGrid: grid.NumGrid, opts?: Partial<DisruptsOptions>): boolean;
    calcFov(grid: grid.NumGrid, x: number, y: number, maxRadius: number, forbiddenCellFlags?: number, forbiddenLayerFlags?: Entity): void;
    losFromTo(a: utils.XY, b: utils.XY): boolean;
    storeMemory(x: number, y: number): void;
    storeMemories(): void;
    activateCell(x: number, y: number, event: string): Promise<boolean>;
    tick(): Promise<void>;
    exposeToFire(x: number, y: number, alwaysIgnite?: boolean): Promise<boolean>;
    updateLiquid(newVolume: grid.NumGrid): void;
    updateGas(newVolume: grid.NumGrid): void;
    resetCellEvents(): void;
}
declare function make$2(w: number, h: number, floor: string, wall: string): Map$1;
declare function make$2(w: number, h: number, floor: string): Map$1;
declare function make$2(w: number, h: number, opts?: any): Map$1;
declare function from(prefab: string | string[], charToTile: Record<string, TileBase | null>, opts?: any): Map$1;
declare function getCellAppearance(map: Map$1, x: number, y: number, dest: sprite.Mixer): void;
declare function addText(map: Map$1, x: number, y: number, text: string, fg: color.ColorBase | null, bg: color.ColorBase | null, layer?: Layer): void;

type map_d_MapDrawOptions = MapDrawOptions;
type map_d_MapEachFn = MapEachFn;
type map_d_AsyncMapEachFn = AsyncMapEachFn;
type map_d_MapMatchFn = MapMatchFn;
type map_d_MapCostFn = MapCostFn;
type map_d_MapMatchOptions = MapMatchOptions;
type map_d_MapLightFn = MapLightFn;
type map_d_DisruptsOptions = DisruptsOptions;
type map_d_MapFovInfo = MapFovInfo;
declare const map_d_from: typeof from;
declare const map_d_getCellAppearance: typeof getCellAppearance;
declare const map_d_addText: typeof addText;
declare namespace map_d {
  export {
    Map as Flags,
    map_d_MapDrawOptions as MapDrawOptions,
    map_d_MapEachFn as MapEachFn,
    map_d_AsyncMapEachFn as AsyncMapEachFn,
    map_d_MapMatchFn as MapMatchFn,
    map_d_MapCostFn as MapCostFn,
    map_d_MapMatchOptions as MapMatchOptions,
    map_d_MapLightFn as MapLightFn,
    map_d_DisruptsOptions as DisruptsOptions,
    map_d_MapFovInfo as MapFovInfo,
    Map$1 as Map,
    make$2 as make,
    map_d_from as from,
    map_d_getCellAppearance as getCellAppearance,
    map_d_addText as addText,
  };
}

declare const config: {
    INTENSITY_DARK: number;
};
declare class Light implements types.LightType {
    color: color.Color;
    radius: range.Range;
    fadeTo: number;
    passThroughActors: boolean;
    id: string | null;
    constructor(color: color.ColorBase, range: string | range.Range, fadeTo: number, pass?: boolean);
    copy(other: Light): void;
    get intensity(): number;
    paint(map: Map$1, x: number, y: number, maintainShadows?: boolean, isMinersLight?: boolean): boolean;
}
declare function intensity(color: color.Color | [number, number, number]): number;
interface LightConfig {
    color: color.ColorBase;
    radius: number;
    fadeTo?: number;
    pass?: boolean;
}
declare type LightBase = LightConfig | string | any[];
declare function make$3(color: color.ColorBase, radius: range.RangeBase, fadeTo?: number, pass?: boolean): Light;
declare function make$3(light: LightBase): Light;
declare const lights: Record<string, Light>;
declare function from$1(light: LightBase): Light;
declare function install$1(id: string, color: color.ColorBase, radius: range.RangeBase, fadeTo?: number, pass?: boolean): Light;
declare function install$1(id: string, base: LightBase): Light;
declare function install$1(id: string, config: LightConfig): Light;
declare function installAll$1(config?: Record<string, LightConfig | LightBase>): void;
declare type LightData = [number, number, number];
declare type LightDataGrid = grid.Grid<LightData>;
declare function recordOldLights(map: Map$1): void;
declare function zeroOutLights(map: Map$1): void;
declare function recordGlowLights(map: Map$1): void;
declare function restoreGlowLights(map: Map$1): void;
declare function updateLighting(map: Map$1): boolean;
declare function playerInDarkness(map: Map$1, PLAYER: utils.XY, darkColor?: color.Color): boolean;

declare const light_d_config: typeof config;
type light_d_Light = Light;
declare const light_d_Light: typeof Light;
declare const light_d_intensity: typeof intensity;
type light_d_LightConfig = LightConfig;
type light_d_LightBase = LightBase;
declare const light_d_lights: typeof lights;
type light_d_LightData = LightData;
type light_d_LightDataGrid = LightDataGrid;
declare const light_d_recordOldLights: typeof recordOldLights;
declare const light_d_zeroOutLights: typeof zeroOutLights;
declare const light_d_recordGlowLights: typeof recordGlowLights;
declare const light_d_restoreGlowLights: typeof restoreGlowLights;
declare const light_d_updateLighting: typeof updateLighting;
declare const light_d_playerInDarkness: typeof playerInDarkness;
declare namespace light_d {
  export {
    light_d_config as config,
    light_d_Light as Light,
    light_d_intensity as intensity,
    light_d_LightConfig as LightConfig,
    light_d_LightBase as LightBase,
    make$3 as make,
    light_d_lights as lights,
    from$1 as from,
    install$1 as install,
    installAll$1 as installAll,
    light_d_LightData as LightData,
    light_d_LightDataGrid as LightDataGrid,
    light_d_recordOldLights as recordOldLights,
    light_d_zeroOutLights as zeroOutLights,
    light_d_recordGlowLights as recordGlowLights,
    light_d_restoreGlowLights as restoreGlowLights,
    light_d_updateLighting as updateLighting,
    light_d_playerInDarkness as playerInDarkness,
  };
}

interface EntityConfig extends sprite.SpriteConfig {
    priority: number;
    layer: Layer | keyof typeof Layer;
    light: LightBase | null;
    layerFlags?: flag.FlagBase;
    flags?: flag.FlagBase;
    sprite?: sprite.SpriteConfig;
}
declare class Entity$1 implements types.EntityType {
    sprite: types.SpriteType;
    priority: number;
    layer: number;
    light: Light | null;
    flags: types.LayerFlags;
    constructor(config: Partial<EntityConfig>);
    hasLayerFlag(flag: number): boolean;
}
declare function make$4(config: Partial<EntityConfig>): Entity$1;

type entity_d_Layer = Layer;
declare const entity_d_Layer: typeof Layer;
type entity_d_EntityConfig = EntityConfig;
declare namespace entity_d {
  export {
    Entity as Flags,
    entity_d_Layer as Layer,
    entity_d_EntityConfig as EntityConfig,
    Entity$1 as Entity,
    make$4 as make,
  };
}

declare function initMap(map: Map$1): void;
declare function update(map: Map$1, x: number, y: number, maxRadius: number): boolean;

declare const visibility_d_initMap: typeof initMap;
declare const visibility_d_update: typeof update;
declare namespace visibility_d {
  export {
    visibility_d_initMap as initMap,
    visibility_d_update as update,
  };
}

export { cell_d as cell, entity_d as entity, light_d as light, lights, map_d as map, tile_d as tile, tiles, visibility_d as visibility };
