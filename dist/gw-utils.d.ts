import { types, canvas, color, range, grid, utils } from 'gw-utils';

declare enum Layer {
    GROUND = 0,
    SURFACE = 1,
    LIQUID = 2,
    GAS = 3,
    ITEM = 4,
    ACTOR = 5,
    PLAYER = 6,
    FX = 7,
    UI = 8
}
declare enum Tile {
    T_OBSTRUCTS_PASSABILITY,
    T_OBSTRUCTS_VISION,
    T_OBSTRUCTS_ITEMS,
    T_OBSTRUCTS_SURFACE,
    T_OBSTRUCTS_GAS,
    T_OBSTRUCTS_LIQUID,
    T_OBSTRUCTS_TILE_EFFECTS,
    T_OBSTRUCTS_DIAGONAL_MOVEMENT,
    T_GAS,
    T_BRIDGE,
    T_AUTO_DESCENT,
    T_LAVA,
    T_DEEP_WATER,
    T_SPONTANEOUSLY_IGNITES,
    T_IS_FLAMMABLE,
    T_IS_FIRE,
    T_ENTANGLES,
    T_CAUSES_POISON,
    T_CAUSES_DAMAGE,
    T_CAUSES_NAUSEA,
    T_CAUSES_PARALYSIS,
    T_CAUSES_CONFUSION,
    T_CAUSES_HEALING,
    T_IS_TRAP,
    T_CAUSES_EXPLOSIVE_DAMAGE,
    T_SACRED,
    T_UP_STAIRS,
    T_DOWN_STAIRS,
    T_PORTAL,
    T_IS_DOOR,
    T_HAS_STAIRS,
    T_OBSTRUCTS_SCENT,
    T_PATHING_BLOCKER,
    T_DIVIDES_LEVEL,
    T_LAKE_PATHING_BLOCKER,
    T_WAYPOINT_BLOCKER,
    T_MOVES_ITEMS,
    T_CAN_BE_BRIDGED,
    T_OBSTRUCTS_EVERYTHING,
    T_HARMFUL_TERRAIN,
    T_RESPIRATION_IMMUNITIES,
    T_IS_LIQUID,
    T_STAIR_BLOCKERS
}
declare enum TileMech {
    TM_IS_SECRET,
    TM_PROMOTES_WITH_KEY,
    TM_PROMOTES_WITHOUT_KEY,
    TM_PROMOTES_ON_STEP,
    TM_PROMOTES_ON_ITEM_REMOVE,
    TM_PROMOTES_ON_PLAYER_ENTRY,
    TM_PROMOTES_ON_SACRIFICE_ENTRY,
    TM_PROMOTES_ON_ELECTRICITY,
    TM_ALLOWS_SUBMERGING,
    TM_IS_WIRED,
    TM_IS_CIRCUIT_BREAKER,
    TM_EXTINGUISHES_FIRE,
    TM_VANISHES_UPON_PROMOTION,
    TM_REFLECTS_BOLTS,
    TM_STAND_IN_TILE,
    TM_LIST_IN_SIDEBAR,
    TM_VISUALLY_DISTINCT,
    TM_BRIGHT_MEMORY,
    TM_EXPLOSIVE_PROMOTE,
    TM_CONNECTS_LEVEL,
    TM_INTERRUPT_EXPLORATION_WHEN_SEEN,
    TM_INVERT_WHEN_HIGHLIGHTED,
    TM_SWAP_ENCHANTS_ACTIVATION,
    TM_PROMOTES
}

declare class CellMemory {
    mixer: canvas.Mixer;
    item: types.ItemType | null;
    itemQuantity: number;
    actor: types.ActorType | null;
    tile: Tile$1 | null;
    cellFlags: number;
    cellMechFlags: number;
    tileFlags: number;
    tileMechFlags: number;
    constructor();
    nullify(): void;
    copy(other: CellMemory): void;
}
interface SpriteData {
    layer: Layer;
    priority: number;
    sprite: canvas.SpriteType;
    next: SpriteData | null;
}
declare class Cell implements types.CellType {
    layers: (string | null)[];
    sprites: SpriteData | null;
    actor: types.ActorType | null;
    item: types.ItemType | null;
    data: any;
    flags: number;
    mechFlags: number;
    gasVolume: number;
    liquidVolume: number;
    machineNumber: number;
    memory: CellMemory;
    light: [number, number, number];
    oldLight: [number, number, number];
    glowLight: [number, number, number];
    constructor();
    copy(other: Cell): void;
    nullify(): void;
    nullifyLayers(nullLiquid?: boolean, nullSurface?: boolean, nullGas?: boolean): void;
    get ground(): string | null;
    get liquid(): string | null;
    get surface(): string | null;
    get gas(): string | null;
    get groundTile(): Tile$1;
    get liquidTile(): Tile$1;
    get surfaceTile(): Tile$1;
    get gasTile(): Tile$1;
    dump(): string;
    changed(): number;
    isVisible(): number;
    isAnyKindOfVisible(): number;
    isOrWasAnyKindOfVisible(): number;
    isRevealed(orMapped?: boolean): number;
    listInSidebar(): boolean;
    _needsRedraw(): void;
    hasVisibleLight(): boolean;
    isDark(): boolean;
    lightChanged(): number;
    tile(layer?: number): Tile$1;
    tiles(): Generator<Tile$1, void, unknown>;
    tileFlags(limitToPlayerKnowledge?: boolean): number;
    tileMechFlags(limitToPlayerKnowledge?: boolean): number;
    hasTileFlag(flagMask?: number, limitToPlayerKnowledge?: boolean): boolean;
    hasAllTileFlags(flags?: number): boolean;
    hasTileMechFlag(flagMask?: number, limitToPlayerKnowledge?: boolean): boolean;
    hasAllTileMechFlags(flags?: number): boolean;
    setFlags(cellFlag?: number, cellMechFlag?: number): void;
    clearFlags(cellFlag?: number, cellMechFlag?: number): void;
    hasFlag(flag?: number, limitToPlayerKnowledge?: boolean): boolean;
    hasMechFlag(flag?: number, limitToPlayerKnowledge?: boolean): boolean;
    hasTile(tile: string | Tile$1): boolean;
    successorTileFlags(id: string): number;
    promotedTileFlags(): number;
    discoveredTileFlags(): number;
    hasDiscoveredTileFlag(flag: number): number;
    highestPriorityTile(skipGas?: boolean): Tile$1;
    tileWithFlag(tileFlag: number): Tile$1 | null;
    tileWithMechFlag(mechFlag: number): Tile$1 | null;
    tileDesc(): string | null;
    tileFlavor(): string | null;
    getName(opts?: {}): string;
    isNull(): boolean;
    isEmpty(): boolean;
    isPassableNow(limitToPlayerKnowledge?: boolean): boolean;
    canBePassed(limitToPlayerKnowledge?: boolean): boolean;
    isWall(limitToPlayerKnowledge?: boolean): boolean;
    isObstruction(limitToPlayerKnowledge?: boolean): boolean;
    isDoor(limitToPlayerKnowledge?: boolean): boolean;
    isSecretDoor(limitToPlayerKnowledge?: boolean): boolean;
    blocksPathing(limitToPlayerKnowledge?: boolean): boolean;
    blocksVision(): boolean;
    isLiquid(limitToPlayerKnowledge?: boolean): boolean;
    hasGas(limitToPlayerKnowledge?: boolean): boolean;
    markRevealed(): boolean;
    obstructsLayer(layer: Layer): boolean;
    _setTile(tileId?: Tile$1 | string | null, volume?: number, map?: Map): boolean;
    clearLayer(layer: Layer): void;
    clearLayers(except: Layer, floorTile?: string | null): void;
    nullifyTileWithFlags(tileFlags: number, tileMechFlags?: number): void;
    fireEvent(name: string, ctx?: any): Promise<boolean>;
    hasTileWithEvent(name: string): boolean;
    addSprite(layer: Layer, sprite: canvas.SpriteType, priority?: number): void;
    removeSprite(sprite: canvas.SpriteType): boolean;
    storeMemory(): void;
}

declare class Light implements types.LightType {
    color: color.Color;
    radius: range.Range;
    fadeTo: number;
    passThroughActors: boolean;
    id: string | null;
    constructor(color: color.ColorBase, range: string | range.Range, fadeTo: number, pass?: boolean);
    copy(other: Light): void;
    get intensity(): number;
    paint(map: Map, x: number, y: number, maintainShadows?: boolean, isMinersLight?: boolean): false | undefined;
}

declare type MapEachFn = (cell: Cell, x: number, y: number, map: Map) => void;
declare type MapMatchFn = (cell: Cell, x: number, y: number, map: Map) => boolean;
declare type MapCostFn = (cell: Cell, x: number, y: number, map: Map) => number;
interface MapMatchOptions {
    hallways: boolean;
    blockingMap: grid.NumGrid;
    liquids: boolean;
    match: MapMatchFn;
    forbidCellFlags: number;
    forbidTileFlags: number;
    forbidTileMechFlags: number;
    tile: Tile$1;
    tries: number;
    deterministic: boolean;
}
interface LightInfo extends utils.Chainable {
    light: Light;
    x: number;
    y: number;
    next: LightInfo | null;
}
declare type MapLightFn = (light: Light, x: number, y: number) => void;
interface DisruptsOptions {
    gridOffsetX: number;
    gridOffsetY: number;
    bounds: types.Bounds | null;
}
declare class Map implements types.MapType {
    protected _width: number;
    protected _height: number;
    cells: grid.Grid<Cell>;
    locations: any;
    config: any;
    protected _actors: any | null;
    protected _items: any | null;
    flags: number;
    ambientLight: color.Color | null;
    lights: LightInfo | null;
    id: string;
    events: any;
    constructor(w: number, h: number, opts?: any);
    get width(): number;
    get height(): number;
    start(): Promise<void>;
    nullify(): void;
    dump(fmt?: (cell: Cell) => string): void;
    cell(x: number, y: number): Cell;
    eachCell(fn: MapEachFn): void;
    forEach(fn: MapEachFn): void;
    forRect(x: number, y: number, w: number, h: number, fn: MapEachFn): void;
    eachNeighbor(x: number, y: number, fn: MapEachFn, only4dirs?: boolean): void;
    hasXY(x: number, y: number): boolean;
    isBoundaryXY(x: number, y: number): boolean;
    changed(v?: boolean): number;
    hasCellFlag(x: number, y: number, flag: number): number;
    hasCellMechFlag(x: number, y: number, flag: number): number;
    hasTileFlag(x: number, y: number, flag: number): boolean;
    hasTileMechFlag(x: number, y: number, flag: number): boolean;
    setCellFlag(x: number, y: number, flag: number): void;
    redrawCell(cell: Cell): void;
    redrawXY(x: number, y: number): void;
    redrawAll(): void;
    revealAll(): void;
    markRevealed(x: number, y: number): void;
    isVisible(x: number, y: number): number;
    isAnyKindOfVisible(x: number, y: number): number;
    isOrWasAnyKindOfVisible(x: number, y: number): number;
    hasVisibleLight(x: number, y: number): boolean;
    setFlag(flag: number): void;
    setFlags(mapFlag?: number, cellFlag?: number, cellMechFlag?: number): void;
    clearFlag(flag: number): void;
    clearFlags(mapFlag?: number, cellFlag?: number, cellMechFlag?: number): void;
    setCellFlags(x: number, y: number, cellFlag?: number, cellMechFlag?: number): void;
    clearCellFlags(x: number, y: number, cellFlags?: number, cellMechFlags?: number): void;
    hasTile(x: number, y: number, tile: string): boolean;
    tileFlags(x: number, y: number, limitToPlayerKnowledge?: boolean): number;
    tileMechFlags(x: number, y: number, limitToPlayerKnowledge?: boolean): number;
    tileWithFlag(x: number, y: number, flag?: number): Tile$1 | null;
    tileWithMechFlag(x: number, y: number, mechFlag?: number): Tile$1 | null;
    hasKnownTileFlag(x: number, y: number, flagMask?: number): number;
    discoveredTileFlags(x: number, y: number): number;
    hasDiscoveredTileFlag(x: number, y: number, flag?: number): number;
    canBePassed(x: number, y: number, limitToPlayerKnowledge?: boolean): boolean;
    isPassableNow(x: number, y: number, limitToPlayerKnowledge?: boolean): boolean;
    isNull(x: number, y: number): boolean;
    isEmpty(x: number, y: number): boolean;
    isObstruction(x: number, y: number, limitToPlayerKnowledge?: boolean): boolean;
    isDoor(x: number, y: number, limitToPlayerKnowledge?: boolean): boolean;
    isLiquid(x: number, y: number, limitToPlayerKnowledge?: boolean): boolean;
    hasGas(x: number, y: number, limitToPlayerKnowledge?: boolean): boolean;
    blocksPathing(x: number, y: number, limitToPlayerKnowledge?: boolean): boolean;
    blocksVision(x: number, y: number): boolean;
    highestPriorityTile(x: number, y: number, skipGas?: boolean): Tile$1;
    tileFlavor(x: number, y: number): string | null;
    setTile(x: number, y: number, tileId: string | null, volume?: number): boolean;
    nullifyTileWithFlags(x: number, y: number, tileFlags: number, tileMechFlags?: number): void;
    nullifyCellLayers(x: number, y: number, nullLiquid?: boolean, nullSurface?: boolean, nullGas?: boolean): void;
    fill(tileId: string | null, boundaryTile?: string | null): void;
    neighborCount(x: number, y: number, matchFn: MapMatchFn, only4dirs?: boolean): number;
    passableArcCount(x: number, y: number): number;
    diagonalBlocked(x1: number, y1: number, x2: number, y2: number, limitToPlayerKnowledge?: boolean): boolean;
    fillCostGrid(costGrid: grid.NumGrid, costFn: MapCostFn): void;
    matchingNeighbor(x: number, y: number, matcher: MapMatchFn, only4dirs?: boolean): number[] | null;
    matchingLocNear(x: number, y: number, opts: Partial<MapMatchOptions>): utils.Loc;
    matchingLocNear(x: number, y: number, matcher: MapMatchFn, opts?: Partial<MapMatchOptions>): utils.Loc;
    randomMatchingLoc(opts?: Partial<MapMatchOptions>): false | (number | undefined)[];
    addLight(x: number, y: number, light: Light): LightInfo;
    removeLight(info: LightInfo): void;
    eachGlowLight(fn: MapLightFn): void;
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
    gridDisruptsPassability(blockingGrid: grid.NumGrid, opts?: Partial<DisruptsOptions>): boolean;
    calcFov(grid: grid.NumGrid, x: number, y: number, maxRadius: number, forbiddenCellFlags?: number, forbiddenTileFlags?: Tile): void;
    losFromTo(a: utils.XY, b: utils.XY): boolean;
    storeMemory(x: number, y: number): void;
    storeMemories(): void;
    tick(): Promise<void>;
    resetEvents(): void;
}

declare class Activation {
    tile: string | null;
    fn: Function | null;
    item: string | null;
    chance: number;
    volume: number;
    spread: number;
    radius: number;
    decrement: number;
    flags: number;
    matchTile: string | null;
    next: string | null;
    message: string | null;
    lightFlare: string | null;
    flashColor: color.Color | null;
    messageDisplayed: boolean;
    emit: string | null;
    id: string | null;
    constructor(opts?: any);
}

interface NameConfig {
    article?: boolean | string;
    color?: boolean | string | color.ColorBase;
}
declare type TileBase = TileConfig | string;
interface FullTileConfig {
    Extends: string | Tile$1;
    flags: number | string | any[];
    mechFlags: number | string | any[];
    layer: Layer | keyof typeof Layer;
    priority: number;
    sprite: canvas.SpriteConfig;
    activates: any;
    light: Light | string | null;
    flavor: string;
    desc: string;
    name: string;
    article: string;
    id: string;
    ch: string | null;
    fg: color.ColorBase | null;
    bg: color.ColorBase | null;
    opacity: number;
    dissipate: number;
}
declare type AtLeast<T, K extends keyof T> = Partial<T> & Pick<T, K>;
declare type TileConfig = AtLeast<FullTileConfig, "id">;
/** Tile Class */
declare class Tile$1 implements types.TileType {
    flags: number;
    mechFlags: number;
    layer: Layer;
    priority: number;
    sprite: canvas.Sprite;
    activates: Record<string, Activation>;
    light: any;
    flavor: string | null;
    desc: string | null;
    name: string;
    article: string | null;
    id: string;
    dissipate: number;
    /**
     * Creates a new Tile object.
     * @param {Object} [config={}] - The configuration of the Tile
     * @param {String|Number|String[]} [config.flags=0] - Flags and MechFlags for the tile
     * @param {String} [config.layer=GROUND] - Name of the layer for this tile
     * @param {String} [config.ch] - The sprite character
     * @param {String} [config.fg] - The sprite foreground color
     * @param {String} [config.bg] - The sprite background color
     */
    constructor(config: TileConfig, base?: Tile$1);
    /**
     * Returns the flags for the tile after the given event is fired.
     * @param {string} id - Name of the event to fire.
     * @returns {number} The flags from the Tile after the event.
     */
    successorFlags(id: string): number;
    /**
     * Returns whether or not this tile as the given flag.
     * Will return true if any bit in the flag is true, so testing with
     * multiple flags will return true if any of them is set.
     * @param {number} flag - The flag to check
     * @returns {boolean} Whether or not the flag is set
     */
    hasFlag(flag: number): boolean;
    hasFlags(flags: number, mechFlags: number): number | true;
    hasMechFlag(flag: number): boolean;
    hasEvent(name: string): boolean;
    getName(): string;
    getName(opts: NameConfig): string;
    getName(article: string): string;
    getName(article: boolean): string;
    getDescription(opts?: any): string;
}
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
declare function install(config: Partial<TileConfig>): Tile$1;
/**
 * Adds multiple tiles to the GW.tiles collection.
 * It extracts all the id:opts pairs from the config object and uses
 * them to call addTileKind.
 * @param {Object} config - The tiles to add in [id, config] pairs
 * @returns {void} Nothing
 * @see addTileKind
 */
declare function installAll(config: Record<string, Partial<TileConfig>>): void;

type tile_d_Layer = Layer;
declare const tile_d_Layer: typeof Layer;
type tile_d_NameConfig = NameConfig;
type tile_d_TileBase = TileBase;
type tile_d_FullTileConfig = FullTileConfig;
type tile_d_TileConfig = TileConfig;
declare const tile_d_tiles: typeof tiles;
declare const tile_d_install: typeof install;
declare const tile_d_installAll: typeof installAll;
declare namespace tile_d {
  export {
    Tile as Flags,
    TileMech as MechFlags,
    tile_d_Layer as Layer,
    tile_d_NameConfig as NameConfig,
    tile_d_TileBase as TileBase,
    tile_d_FullTileConfig as FullTileConfig,
    tile_d_TileConfig as TileConfig,
    Tile$1 as Tile,
    tile_d_tiles as tiles,
    tile_d_install as install,
    tile_d_installAll as installAll,
  };
}

export { tile_d as tile };
