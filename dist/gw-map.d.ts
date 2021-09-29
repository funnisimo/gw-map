import * as GWU from 'gw-utils';

declare enum Depth {
    ALL_LAYERS = -1,
    GROUND = 0,
    SURFACE = 1,
    ITEM = 2,
    ACTOR = 3,
    LIQUID = 4,
    GAS = 5,
    FX = 6,
    UI = 7
}
declare type DepthString = keyof typeof Depth;

declare enum Entity$1 {
    L_DESTROYED,
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
    L_ON_MAP,
    L_BLOCKED_BY_STAIRS,
    L_BLOCKS_SCENT,
    L_DIVIDES_LEVEL,
    L_WAYPOINT_BLOCKER,
    L_WALL_FLAGS,
    L_BLOCKS_EVERYTHING
}

declare enum Actor$1 {
    IS_PLAYER,
    HAS_MEMORY,
    USES_FOV
}

declare enum Item$1 {
}

declare enum Tile$1 {
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
    T_BLOCKS_OTHER_LAYERS,
    T_HAS_STAIRS,
    T_OBSTRUCTS_SCENT,
    T_PATHING_BLOCKER,
    T_LAKE_PATHING_BLOCKER,
    T_WAYPOINT_BLOCKER,
    T_DIVIDES_LEVEL,
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

declare enum Cell$1 {
    PRESSURE_PLATE_DEPRESSED,
    SEARCHED_FROM_HERE,
    KNOWN_TO_BE_SAFE,
    CAUGHT_FIRE_THIS_TURN,
    EVENT_FIRED_THIS_TURN,
    EVENT_PROTECTED,
    IS_IN_LOOP,
    IS_CHOKEPOINT,
    IS_GATE_SITE,
    IS_IN_ROOM_MACHINE,
    IS_IN_AREA_MACHINE,
    IMPREGNABLE,
    NEEDS_REDRAW,
    STABLE_MEMORY,
    STABLE_SNAPSHOT,
    HAS_PLAYER,
    HAS_ACTOR,
    HAS_DORMANT_MONSTER,
    HAS_ITEM,
    IS_IN_PATH,
    IS_CURSOR,
    HAS_TICK_EFFECT,
    IS_WIRED,
    IS_CIRCUIT_BREAKER,
    IS_POWERED,
    COLORS_DANCE,
    CHANGED,
    IS_IN_MACHINE,
    PERMANENT_CELL_FLAGS,
    HAS_ANY_ACTOR,
    HAS_ANY_OBJECT,
    CELL_DEFAULT
}

declare enum Map$1 {
    MAP_CHANGED,
    MAP_ALWAYS_LIT,
    MAP_SAW_WELCOME,
    MAP_NO_LIQUID,
    MAP_NO_GAS,
    MAP_CALC_FOV,
    MAP_FOV_CHANGED,
    MAP_DANCES,
    MAP_SIDEBAR_TILES_CHANGED,
    MAP_DEFAULT = 0
}

declare enum Effect {
    E_NEXT_ALWAYS,
    E_NEXT_EVERYWHERE,
    E_FIRED,
    E_NO_MARK_FIRED,
    E_PROTECTED,
    E_TREAT_AS_BLOCKING,
    E_PERMIT_BLOCKING,
    E_ABORT_IF_BLOCKS_MAP,
    E_BLOCKED_BY_ITEMS,
    E_BLOCKED_BY_ACTORS,
    E_BLOCKED_BY_OTHER_LAYERS,
    E_SUPERPRIORITY,
    E_SPREAD_CIRCLE,
    E_SPREAD_LINE,
    E_EVACUATE_CREATURES,
    E_EVACUATE_ITEMS,
    E_BUILD_IN_WALLS,
    E_MUST_TOUCH_WALLS,
    E_NO_TOUCH_WALLS,
    E_CLEAR_GROUND,
    E_CLEAR_SURFACE,
    E_CLEAR_LIQUID,
    E_CLEAR_GAS,
    E_CLEAR_TILE,
    E_CLEAR_CELL,
    E_ONLY_IF_EMPTY,
    E_ACTIVATE_DORMANT_MONSTER,
    E_AGGRAVATES_MONSTERS,
    E_RESURRECT_ALLY
}

declare enum Horde$1 {
    HORDE_DIES_ON_LEADER_DEATH,
    HORDE_IS_SUMMONED,
    HORDE_SUMMONED_AT_DISTANCE,
    HORDE_NO_PERIODIC_SPAWN,
    HORDE_ALLIED_WITH_PLAYER,
    HORDE_NEVER_OOD
}

type index_d$a_Depth = Depth;
declare const index_d$a_Depth: typeof Depth;
type index_d$a_DepthString = DepthString;
type index_d$a_TileMech = TileMech;
declare const index_d$a_TileMech: typeof TileMech;
type index_d$a_Effect = Effect;
declare const index_d$a_Effect: typeof Effect;
declare namespace index_d$a {
  export {
    index_d$a_Depth as Depth,
    index_d$a_DepthString as DepthString,
    Entity$1 as Entity,
    Actor$1 as Actor,
    Item$1 as Item,
    Tile$1 as Tile,
    index_d$a_TileMech as TileMech,
    Cell$1 as Cell,
    Map$1 as Map,
    index_d$a_Effect as Effect,
    Horde$1 as Horde,
  };
}

interface KeyInfoType {
    x: number;
    y: number;
    disposable: boolean;
    matches(x: number, y: number): boolean;
}
interface FlagType$1 {
    entity: number;
}
interface EntityType extends GWU.xy.XY {
    readonly sprite: GWU.sprite.Sprite;
    depth: number;
    light: GWU.light.LightType | null;
    flags: FlagType$1;
    next: EntityType | null;
}
interface StatusDrawer {
    readonly bounds: GWU.xy.Bounds;
    readonly buffer: GWU.canvas.DataBuffer;
    readonly mixer: GWU.sprite.Mixer;
    currentY: number;
    drawTitle(cell: GWU.sprite.Mixer, title: string, fg?: GWU.color.ColorBase): void;
    drawTextLine(text: string, fg?: GWU.color.ColorBase): void;
    drawProgressBar(val: number, max: number, text: string, color?: GWU.color.ColorBase, bg?: GWU.color.ColorBase, fg?: GWU.color.ColorBase): void;
}

declare class KeyInfo implements KeyInfoType {
    x: number;
    y: number;
    disposable: boolean;
    constructor(x: number, y: number, disposable: boolean);
    matches(x: number, y: number): boolean;
}
declare function makeKeyInfo(x: number, y: number, disposable: boolean): KeyInfo;

interface ActorFlags extends FlagType$1 {
    actor: number;
}

interface FlagType extends FlagType$1 {
    item: number;
}

interface KindOptions$2 extends KindOptions {
}
interface MakeOptions$2 extends MakeOptions {
    quantity: number;
}
declare class ItemKind extends EntityKind {
    constructor(config: KindOptions$2);
    make(options?: Partial<MakeOptions$2>): Item;
    init(item: Item, options?: Partial<MakeOptions$2>): void;
}

declare class Item extends Entity {
    flags: FlagType;
    quantity: number;
    kind: ItemKind;
    next: Item | null;
    constructor(kind: ItemKind);
    copy(other: Item): void;
    itemFlags(): number;
    hasItemFlag(flag: number): boolean;
    hasAllItemFlags(flags: number): boolean;
}

declare function make$4(id: string | ItemKind, makeOptions?: any): Item;
declare function makeRandom$1(opts: Partial<MatchOptions$2> | string, makeOptions?: any): Item;
declare function from$4(info: string | ItemKind | KindOptions$2, makeOptions?: any): Item;
declare const kinds$1: Record<string, ItemKind>;
declare function install$4(id: string, kind: ItemKind | KindOptions$2): ItemKind;
declare function get$3(id: string | ItemKind): ItemKind | null;
declare function makeKind$1(info: KindOptions$2): ItemKind;
interface MatchOptions$2 {
    tags: string | string[];
    forbidTags: string | string[];
    rng: GWU.rng.Random;
}
declare function randomKind$1(opts?: Partial<MatchOptions$2> | string): ItemKind | null;

type index_d$9_FlagType = FlagType;
type index_d$9_ItemKind = ItemKind;
declare const index_d$9_ItemKind: typeof ItemKind;
type index_d$9_Item = Item;
declare const index_d$9_Item: typeof Item;
declare namespace index_d$9 {
  export {
    index_d$9_FlagType as FlagType,
    KindOptions$2 as KindOptions,
    MakeOptions$2 as MakeOptions,
    index_d$9_ItemKind as ItemKind,
    index_d$9_Item as Item,
    make$4 as make,
    makeRandom$1 as makeRandom,
    from$4 as from,
    kinds$1 as kinds,
    install$4 as install,
    get$3 as get,
    makeKind$1 as makeKind,
    MatchOptions$2 as MatchOptions,
    randomKind$1 as randomKind,
  };
}

interface TileFlags extends FlagType$1 {
    tile: number;
    tileMech: number;
}

interface EffectInfo {
    flags: number;
    chance: number;
    next: EffectInfo | string | null;
    id: string;
    [id: string]: any;
}
interface EffectCtx {
    depth?: number;
    force?: boolean;
    grid: GWU.grid.NumGrid;
    [id: string]: any;
}
interface EffectConfig {
    flags: GWU.flag.FlagBase;
    chance: number;
    next: Partial<EffectConfig> | string | null;
    [id: string]: any;
}
declare type EffectBase = Partial<EffectConfig> | Function;

interface TextOptions$1 {
    article?: boolean | string;
    color?: boolean | string | GWU.color.ColorBase;
}
interface TileConfig extends GWU.sprite.SpriteConfig {
    id: string;
    flags: TileFlags;
    dissipate: number;
    effects: Record<string, EffectInfo | string>;
    priority: number;
    depth: number;
    light: GWU.light.LightType | null;
    groundTile: string | null;
    name: string;
    description: string;
    flavor: string;
    article: string | null;
    tags: string | string[] | null;
}
declare class Tile {
    id: string;
    index: number;
    flags: TileFlags;
    dissipate: number;
    effects: Record<string, string | EffectInfo>;
    sprite: GWU.sprite.Sprite;
    priority: number;
    depth: number;
    light: GWU.light.LightType | null;
    groundTile: string | null;
    tags: string[];
    name: string;
    description: string;
    flavor: string;
    article: string | null;
    constructor(config: Partial<TileConfig>);
    hasTag(tag: string): boolean;
    hasAnyTag(tags: string[]): boolean;
    hasAllTags(tags: string[]): boolean;
    hasEntityFlag(flag: number): boolean;
    hasTileFlag(flag: number): boolean;
    hasTileMechFlag(flag: number): boolean;
    hasAllEntityFlags(flag: number): boolean;
    hasAllTileFlags(flag: number): boolean;
    hasAllTileMechFlags(flag: number): boolean;
    blocksVision(): boolean;
    blocksMove(): boolean;
    blocksPathing(): boolean;
    blocksEffects(): boolean;
    hasEffect(name: string): boolean;
    getName(): string;
    getName(config?: TextOptions$1): string;
    getName(article: string): string;
    getName(article: boolean): string;
    getDescription(opts?: TextOptions$1): string;
    getFlavor(opts?: TextOptions$1): string;
}
interface TileOptions extends GWU.sprite.SpriteConfig {
    extends: string;
    id: string;
    name: string;
    description: string;
    flavor: string;
    article: string;
    flags: GWU.flag.FlagBase;
    priority: number | string;
    dissipate: number;
    depth: Depth | DepthString;
    effects: Record<string, Partial<EffectConfig> | string | null>;
    groundTile: string;
    light: GWU.light.LightBase | null;
    tags: string | string[];
}
declare function make$3(options: Partial<TileOptions>): Tile;
declare const tiles: Record<string, Tile>;
declare const all: Tile[];
declare function get$2(id: string | number | Tile): Tile;
declare function install$3(id: string, options: Partial<TileOptions>): Tile;
declare function install$3(id: string, base: string, options: Partial<TileOptions>): Tile;
declare function installAll$2(tiles: Record<string, Partial<TileOptions>>): void;

declare const flags: {
    Tile: typeof Tile$1;
    TileMech: typeof TileMech;
};

declare const index_d$8_flags: typeof flags;
type index_d$8_TileFlags = TileFlags;
type index_d$8_TileConfig = TileConfig;
type index_d$8_Tile = Tile;
declare const index_d$8_Tile: typeof Tile;
type index_d$8_TileOptions = TileOptions;
declare const index_d$8_tiles: typeof tiles;
declare const index_d$8_all: typeof all;
declare namespace index_d$8 {
  export {
    index_d$8_flags as flags,
    index_d$8_TileFlags as TileFlags,
    TextOptions$1 as TextOptions,
    index_d$8_TileConfig as TileConfig,
    index_d$8_Tile as Tile,
    index_d$8_TileOptions as TileOptions,
    make$3 as make,
    index_d$8_tiles as tiles,
    index_d$8_all as all,
    get$2 as get,
    install$3 as install,
    installAll$2 as installAll,
  };
}

declare class MapLayer {
    map: MapType;
    depth: number;
    properties: Record<string, any>;
    name: string;
    changed: boolean;
    constructor(map: MapType, name?: string);
    copy(_other: MapLayer): void;
    clear(): void;
    setTile(_x: number, _y: number, _tile: Tile, _opts?: SetTileOptions): boolean;
    clearTile(_x: number, _y: number): boolean;
    addActor(_x: number, _y: number, _actor: Actor): Promise<boolean> | boolean;
    forceActor(_x: number, _y: number, _actor: Actor): boolean;
    removeActor(_actor: Actor): Promise<boolean> | boolean;
    addItem(_x: number, _y: number, _item: Item): Promise<boolean> | boolean;
    forceItem(_x: number, _y: number, _item: Item): boolean;
    removeItem(_item: Item): Promise<boolean> | boolean;
    tick(_dt: number): Promise<boolean> | boolean;
}

declare class TileLayer extends MapLayer {
    constructor(map: MapType, name?: string);
    setTile(x: number, y: number, tile: Tile, opts?: SetTileOptions): boolean;
    clearTile(x: number, y: number): boolean;
    tick(_dt: number): Promise<boolean>;
}

declare class ActorLayer extends MapLayer {
    constructor(map: MapType, name?: string);
}

declare class ItemLayer extends MapLayer {
    constructor(map: MapType, name?: string);
}

declare class GasLayer extends TileLayer {
    volume: GWU.grid.NumGrid;
    constructor(map: MapType, name?: string);
    clear(): void;
    setTile(x: number, y: number, tile: Tile, opts?: SetTileOptions): boolean;
    clearTile(x: number, y: number): boolean;
    copy(other: GasLayer): void;
    tick(_dt: number): Promise<boolean>;
    dissipate(volume: GWU.grid.NumGrid): void;
    calcOpacity(volume: number): number;
    updateCellVolume(x: number, y: number, startingVolume: GWU.grid.NumGrid): void;
    spread(startingVolume: GWU.grid.NumGrid): void;
}

declare class FireLayer extends TileLayer {
    constructor(map: MapType, name?: string);
    tick(_dt: number): Promise<boolean>;
    exposeToFire(x: number, y: number, alwaysIgnite?: boolean): Promise<boolean>;
}

type index_d$7_MapLayer = MapLayer;
declare const index_d$7_MapLayer: typeof MapLayer;
type index_d$7_TileLayer = TileLayer;
declare const index_d$7_TileLayer: typeof TileLayer;
type index_d$7_ActorLayer = ActorLayer;
declare const index_d$7_ActorLayer: typeof ActorLayer;
type index_d$7_ItemLayer = ItemLayer;
declare const index_d$7_ItemLayer: typeof ItemLayer;
type index_d$7_GasLayer = GasLayer;
declare const index_d$7_GasLayer: typeof GasLayer;
type index_d$7_FireLayer = FireLayer;
declare const index_d$7_FireLayer: typeof FireLayer;
declare namespace index_d$7 {
  export {
    index_d$7_MapLayer as MapLayer,
    index_d$7_TileLayer as TileLayer,
    index_d$7_ActorLayer as ActorLayer,
    index_d$7_ItemLayer as ItemLayer,
    index_d$7_GasLayer as GasLayer,
    index_d$7_FireLayer as FireLayer,
  };
}

declare class Handler {
    make(src: Partial<EffectConfig>, dest: EffectInfo): boolean;
    fire(config: EffectInfo, map: MapType, x: number, y: number, ctx: EffectCtx): Promise<boolean> | boolean;
}
declare const handlers: Record<string, Handler>;
declare function installHandler(id: string, handler: Handler): void;

declare function make$2(opts: EffectBase): EffectInfo;
declare function from$3(opts: EffectBase | string): EffectInfo;
declare function reset(effect: EffectInfo): void;
declare function resetAll(): void;
declare const effects: Record<string, EffectInfo>;
declare function install$2(id: string, config: Partial<EffectConfig>): EffectInfo;
declare function installAll$1(effects: Record<string, Partial<EffectConfig>>): void;

declare function fire(effect: EffectInfo | string, map: MapType, x: number, y: number, ctx_?: Partial<EffectCtx>): Promise<boolean>;

declare class EmitEffect extends Handler {
    constructor();
    make(src: Partial<EffectConfig>, dest: EffectInfo): boolean;
    fire(config: any, _map: MapType, x: number, y: number, ctx: EffectCtx): Promise<boolean>;
}

declare class FnEffect extends Handler {
    constructor();
    make(src: Partial<EffectConfig>, dest: EffectInfo): boolean;
    fire(config: any, map: MapType, x: number, y: number, ctx: Partial<EffectCtx>): Promise<any>;
}

declare class MessageEffect extends Handler {
    constructor();
    make(src: Partial<EffectConfig>, dest: EffectInfo): boolean;
    fire(config: EffectInfo, _map: MapType, x: number, y: number, ctx: EffectCtx): Promise<boolean>;
}

declare class ActivateMachineEffect extends Handler {
    constructor();
    make(src: Partial<EffectConfig>, dest: EffectInfo): boolean;
    fire(config: any, map: MapType, x: number, y: number, ctx: Partial<EffectCtx>): Promise<boolean>;
}

declare class EffectEffect extends Handler {
    constructor();
    make(src: Partial<EffectConfig>, dest: EffectInfo): boolean;
    fire(config: any, map: MapType, x: number, y: number, ctx: EffectCtx): Promise<boolean>;
}

interface SpawnConfig {
    tile: string;
    grow: number;
    decrement: number;
    matchTile: string;
    flags: GWU.flag.FlagBase;
    volume: number;
    next: string;
}
interface SpawnInfo {
    tile: string;
    grow: number;
    decrement: number;
    matchTile: string;
    flags: number;
    volume: number;
    next: string | null;
}
declare class SpawnEffect extends Handler {
    constructor();
    make(src: Partial<EffectConfig>, dest: EffectInfo): boolean;
    fire(effect: EffectInfo, map: MapType, x: number, y: number, ctx: EffectCtx): boolean;
    mapDisruptedBy(map: MapType, blockingGrid: GWU.grid.NumGrid, blockingToMapX?: number, blockingToMapY?: number): boolean;
}
declare function spawnTiles(flags: number, spawnMap: GWU.grid.NumGrid, map: MapType, tile: Tile, volume?: number, machine?: number): boolean;
declare function computeSpawnMap(effect: EffectInfo, map: MapType, x: number, y: number, ctx: EffectCtx): boolean;
declare function clearCells(map: MapType, spawnMap: GWU.grid.NumGrid, flags?: number): boolean;
declare function evacuateCreatures(map: MapType, blockingMap: GWU.grid.NumGrid): boolean;
declare function evacuateItems(map: MapType, blockingMap: GWU.grid.NumGrid): boolean;

type index_d$6_EffectInfo = EffectInfo;
type index_d$6_EffectCtx = EffectCtx;
type index_d$6_EffectConfig = EffectConfig;
type index_d$6_EffectBase = EffectBase;
type index_d$6_Handler = Handler;
declare const index_d$6_Handler: typeof Handler;
declare const index_d$6_handlers: typeof handlers;
declare const index_d$6_installHandler: typeof installHandler;
declare const index_d$6_reset: typeof reset;
declare const index_d$6_resetAll: typeof resetAll;
declare const index_d$6_effects: typeof effects;
declare const index_d$6_fire: typeof fire;
type index_d$6_EmitEffect = EmitEffect;
declare const index_d$6_EmitEffect: typeof EmitEffect;
type index_d$6_FnEffect = FnEffect;
declare const index_d$6_FnEffect: typeof FnEffect;
type index_d$6_MessageEffect = MessageEffect;
declare const index_d$6_MessageEffect: typeof MessageEffect;
type index_d$6_ActivateMachineEffect = ActivateMachineEffect;
declare const index_d$6_ActivateMachineEffect: typeof ActivateMachineEffect;
type index_d$6_EffectEffect = EffectEffect;
declare const index_d$6_EffectEffect: typeof EffectEffect;
type index_d$6_SpawnConfig = SpawnConfig;
type index_d$6_SpawnInfo = SpawnInfo;
type index_d$6_SpawnEffect = SpawnEffect;
declare const index_d$6_SpawnEffect: typeof SpawnEffect;
declare const index_d$6_spawnTiles: typeof spawnTiles;
declare const index_d$6_computeSpawnMap: typeof computeSpawnMap;
declare const index_d$6_clearCells: typeof clearCells;
declare const index_d$6_evacuateCreatures: typeof evacuateCreatures;
declare const index_d$6_evacuateItems: typeof evacuateItems;
declare namespace index_d$6 {
  export {
    index_d$6_EffectInfo as EffectInfo,
    index_d$6_EffectCtx as EffectCtx,
    index_d$6_EffectConfig as EffectConfig,
    index_d$6_EffectBase as EffectBase,
    index_d$6_Handler as Handler,
    index_d$6_handlers as handlers,
    index_d$6_installHandler as installHandler,
    make$2 as make,
    from$3 as from,
    index_d$6_reset as reset,
    index_d$6_resetAll as resetAll,
    index_d$6_effects as effects,
    install$2 as install,
    installAll$1 as installAll,
    index_d$6_fire as fire,
    index_d$6_EmitEffect as EmitEffect,
    index_d$6_FnEffect as FnEffect,
    index_d$6_MessageEffect as MessageEffect,
    index_d$6_ActivateMachineEffect as ActivateMachineEffect,
    index_d$6_EffectEffect as EffectEffect,
    index_d$6_SpawnConfig as SpawnConfig,
    index_d$6_SpawnInfo as SpawnInfo,
    index_d$6_SpawnEffect as SpawnEffect,
    index_d$6_spawnTiles as spawnTiles,
    index_d$6_computeSpawnMap as computeSpawnMap,
    index_d$6_clearCells as clearCells,
    index_d$6_evacuateCreatures as evacuateCreatures,
    index_d$6_evacuateItems as evacuateItems,
  };
}

declare type CellDrawFn = (dest: GWU.sprite.Mixer, cell: CellType, fov?: GWU.fov.FovTracker) => boolean;
interface MapDrawOptions {
    offsetX: number;
    offsetY: number;
    fov?: GWU.fov.FovTracker;
}
interface BufferSource {
    buffer: GWU.canvas.DataBuffer;
}
interface CellDrawer {
    drawCell: CellDrawFn;
    drawInto(dest: BufferSource | GWU.canvas.DataBuffer, map: MapType, opts?: Partial<MapDrawOptions>): void;
}

interface MapOptions extends GWU.light.LightSystemOptions {
    tile: string | true;
    boundary: string | true;
    seed: number;
    id: string;
    drawer: CellDrawer;
}
declare type LayerType = TileLayer | ActorLayer | ItemLayer;
declare class Map implements GWU.light.LightSystemSite, MapType {
    width: number;
    height: number;
    cells: GWU.grid.Grid<Cell>;
    layers: LayerType[];
    flags: {
        map: 0;
    };
    light: GWU.light.LightSystemType;
    properties: Record<string, any>;
    machineCount: number;
    private _seed;
    rng: GWU.rng.Random;
    id: string;
    actors: Actor[];
    items: Item[];
    drawer: CellDrawer;
    constructor(width: number, height: number, opts?: Partial<MapOptions>);
    get seed(): number;
    set seed(v: number);
    initLayers(): void;
    addLayer(depth: number | keyof typeof Depth, layer: LayerType): void;
    removeLayer(depth: number | keyof typeof Depth): void;
    getLayer(depth: number | keyof typeof Depth): LayerType | null;
    hasXY(x: number, y: number): boolean;
    isBoundaryXY(x: number, y: number): boolean;
    cell(x: number, y: number): CellType;
    get(x: number, y: number): CellType | undefined;
    eachCell(cb: EachCellCb): void;
    hasItem(x: number, y: number): boolean;
    itemAt(x: number, y: number): Item | null;
    eachItem(cb: GWU.types.EachCb<Item>): void;
    addItem(x: number, y: number, item: Item, fireEffects: boolean): boolean | Promise<boolean>;
    addItem(x: number, y: number, item: Item): boolean;
    removeItem(item: Item, fireEffects: boolean): boolean | Promise<boolean>;
    removeItem(item: Item): boolean;
    hasPlayer(x: number, y: number): boolean;
    actorAt(x: number, y: number): Actor | null;
    eachActor(cb: GWU.types.EachCb<Actor>): void;
    addActor(x: number, y: number, actor: Actor, fireEffects: boolean): boolean | Promise<boolean>;
    addActor(x: number, y: number, actor: Actor): boolean;
    removeActor(actor: Actor, fireEffects: boolean): boolean | Promise<boolean>;
    removeActor(actor: Actor): boolean;
    hasKey(x: number, y: number): boolean;
    count(cb: MapTestFn): number;
    dump(fmt?: GWU.grid.GridFormat<Cell>, log?: {
        (...data: any[]): void;
        (message?: any, ...optionalParams: any[]): void;
    }): void;
    hasMapFlag(flag: number): boolean;
    setMapFlag(flag: number): void;
    clearMapFlag(flag: number): void;
    setCellFlag(x: number, y: number, flag: number): void;
    clearCellFlag(x: number, y: number, flag: number): void;
    clear(): void;
    clearCell(x: number, y: number, tile?: number | string | Tile): void;
    fill(tile: string | number | Tile, boundary?: string | number | Tile): void;
    hasTile(x: number, y: number, tile: string | number | Tile): boolean;
    forceTile(x: number, y: number, tile: string | number | Tile): boolean;
    setTile(x: number, y: number, tile: string | number | Tile, opts?: SetTileOptions): boolean;
    clearTiles(x: number, y: number, tile?: number | string | Tile): void;
    tick(dt: number): Promise<boolean>;
    copy(src: Map): void;
    clone(): Map;
    fire(event: string, x: number, y: number, ctx?: Partial<EffectCtx>): Promise<boolean>;
    fireAll(event: string, ctx?: Partial<EffectCtx>): Promise<boolean>;
    activateMachine(machineId: number, originX: number, originY: number, ctx?: Partial<EffectCtx>): Promise<boolean>;
    drawInto(dest: GWU.canvas.Canvas | GWU.canvas.DataBuffer, opts?: Partial<MapDrawOptions>): void;
    getAppearanceAt(x: number, y: number, dest: GWU.sprite.Mixer): boolean;
    hasActor(x: number, y: number): boolean;
    eachGlowLight(cb: GWU.light.LightCb): void;
    eachDynamicLight(_cb: GWU.light.LightCb): void;
    eachViewport(_cb: GWU.fov.ViewportCb): void;
    lightingChanged(): boolean;
    hasVisibleLight(x: number, y: number): boolean;
    blocksVision(x: number, y: number): boolean;
}
declare function make$1(w: number, h: number, floor?: string, boundary?: string): Map;
declare function make$1(w: number, h: number, floor: string): Map;
declare function make$1(w: number, h: number, opts: Partial<MapOptions>): Map;
declare function from$2(prefab: string | string[] | GWU.grid.NumGrid, charToTile: Record<string, string | null>, opts?: Partial<MapOptions>): Map;

interface ActorInfo {
    actor: Actor;
    readonly x: number;
    readonly y: number;
}
interface ItemInfo {
    item: Item;
    readonly x: number;
    readonly y: number;
}
declare class Memory extends Map {
    source: MapType;
    constructor(map: MapType);
    cell(x: number, y: number): CellType;
    memory(x: number, y: number): CellType;
    isMemory(x: number, y: number): boolean;
    setTile(): boolean;
    addItem(x: number, y: number, item: Item, fireEffects: boolean): boolean | Promise<boolean>;
    addItem(x: number, y: number, item: Item): boolean;
    removeItem(item: Item, fireEffects: boolean): boolean | Promise<boolean>;
    removeItem(item: Item): boolean;
    eachItem(cb: GWU.types.EachCb<Item>): void;
    addActor(x: number, y: number, actor: Actor, fireEffects: boolean): boolean | Promise<boolean>;
    addActor(x: number, y: number, actor: Actor): boolean;
    removeActor(actor: Actor, fireEffects: boolean): boolean | Promise<boolean>;
    removeActor(actor: Actor): boolean;
    eachActor(cb: GWU.types.EachCb<Actor>): void;
    storeMemory(x: number, y: number): void;
    forget(x: number, y: number): void;
    onFovChange(x: number, y: number, isVisible: boolean): void;
}

declare function store(actor: Actor, map: MapType, memory: Memory): void;
declare function get$1(actor: Actor, map: MapType): Memory;

type index_d$5_ActorInfo = ActorInfo;
type index_d$5_ItemInfo = ItemInfo;
type index_d$5_Memory = Memory;
declare const index_d$5_Memory: typeof Memory;
declare const index_d$5_store: typeof store;
declare namespace index_d$5 {
  export {
    index_d$5_ActorInfo as ActorInfo,
    index_d$5_ItemInfo as ItemInfo,
    index_d$5_Memory as Memory,
    index_d$5_store as store,
    get$1 as get,
  };
}

interface PickupOptions {
    admin: boolean;
}
interface DropOptions {
    admin: boolean;
}
declare class Actor extends Entity {
    flags: ActorFlags;
    kind: ActorKind;
    next: Actor | null;
    leader: Actor | null;
    items: Item | null;
    fov: GWU.fov.FovSystem | null;
    memory: Memory | null;
    constructor(kind: ActorKind);
    hasActorFlag(flag: number): boolean;
    hasAllActorFlags(flags: number): boolean;
    actorFlags(): number;
    isPlayer(): boolean;
    addToMap(map: MapType, x: number, y: number): boolean;
    removeFromMap(): void;
    canSee(x: number, y: number): boolean;
    canSee(entity: Entity): boolean;
    canSeeOrSense(x: number, y: number): boolean;
    canSeeOrSense(entity: Entity): boolean;
    isAbleToSee(entity: Entity): boolean;
    isAbleToSense(entity: Entity): boolean;
    pickupItem(item: Item, opts?: Partial<PickupOptions>): Promise<boolean>;
    dropItem(item: Item, opts?: Partial<DropOptions>): Promise<boolean>;
}

declare type EachCb<T> = (t: T) => any;
declare class Cell implements CellType {
    flags: CellFlags;
    chokeCount: number;
    tiles: TileArray;
    machineId: number;
    map: MapType;
    x: number;
    y: number;
    snapshot: GWU.sprite.Mixer;
    toFire: Partial<EffectCtx>[];
    constructor(map: MapType, x: number, y: number, groundTile?: number | string | Tile);
    getSnapshot(dest: GWU.sprite.Mixer): void;
    putSnapshot(src: GWU.sprite.Mixer): void;
    get hasStableSnapshot(): boolean;
    get hasStableMemory(): boolean;
    copy(other: CellInfoType): void;
    hasCellFlag(flag: number): boolean;
    setCellFlag(flag: number): void;
    clearCellFlag(flag: number): void;
    hasEntityFlag(flag: number, checkEntities?: boolean): boolean;
    hasAllEntityFlags(flags: number, checkEntities?: boolean): boolean;
    hasTileFlag(flag: number): boolean;
    hasAllTileFlags(flags: number): boolean;
    hasTileMechFlag(flag: number): boolean;
    hasAllTileMechFlags(flags: number): boolean;
    hasTileTag(tag: string): boolean;
    hasAllTileTags(tags: string[]): boolean;
    hasAnyTileTag(tags: string[]): boolean;
    cellFlags(): number;
    entityFlags(withEntities?: boolean): number;
    tileFlags(): number;
    tileMechFlags(): number;
    get needsRedraw(): boolean;
    set needsRedraw(v: boolean);
    get changed(): boolean;
    depthPriority(depth: number): number;
    highestPriority(): number;
    depthTile(depth: number): Tile | null;
    hasTile(tile?: string | number | Tile): boolean;
    hasDepthTile(depth: number): boolean;
    highestPriorityTile(): Tile;
    get tile(): Tile;
    eachTile(cb: EachCb<Tile>): void;
    tileWithObjectFlag(flag: number): Tile | null;
    tileWithFlag(flag: number): Tile | null;
    tileWithMechFlag(flag: number): Tile | null;
    blocksVision(): boolean;
    blocksPathing(): boolean;
    blocksMove(): boolean;
    blocksEffects(): boolean;
    blocksLayer(depth: number): boolean;
    isNull(): boolean;
    isPassable(): boolean;
    isWall(): boolean;
    isStairs(): boolean;
    isFloor(): boolean;
    isGateSite(): boolean;
    isSecretlyPassable(): boolean;
    setTile(tile: string | number | Tile, opts?: SetTileOptions): boolean;
    clearTiles(tile?: string | number | Tile): void;
    clear(tile?: number | string | Tile): void;
    clearDepth(depth: Depth): boolean;
    clearDepthsWithFlags(tileFlag: number, tileMechFlag?: number): void;
    eachGlowLight(cb: (light: GWU.light.LightType) => any): void;
    needsToFire(): boolean;
    willFire(event: string): boolean;
    clearEvents(): void;
    tileWithEffect(name: string): Tile | null;
    fireAll(): Promise<boolean>;
    fireEvent(event: string, ctx?: Partial<EffectCtx>): Promise<boolean>;
    _activate(effect: string | EffectInfo, ctx: Partial<EffectCtx>): Promise<boolean>;
    hasEffect(name: string): boolean;
    hasItem(): boolean;
    get item(): Item | null;
    addItem(item: Item, withEffects?: boolean): void;
    removeItem(item: Item, withEffects?: boolean): boolean;
    hasActor(): boolean;
    hasPlayer(): boolean;
    get actor(): Actor | null;
    addActor(actor: Actor, withEffects?: boolean): void;
    removeActor(actor: Actor, withEffects?: boolean): boolean;
    getDescription(): string;
    getFlavor(): string;
    getName(opts?: {}): string;
    dump(): string;
    drawStatus(sidebar: StatusDrawer): void;
    toString(): string;
}

declare function analyze(map: MapType, updateChokeCounts?: boolean): void;
declare function updateChokepoints(map: MapType, updateCounts: boolean): void;
declare function floodFillCount(map: MapType, results: GWU.grid.NumGrid, passMap: GWU.grid.NumGrid, startX: number, startY: number): number;
declare function updateLoopiness(map: MapType): void;
declare function resetLoopiness(cell: CellType, _x: number, _y: number, _map: MapType): void;
declare function checkLoopiness(map: MapType): void;
declare function fillInnerLoopGrid(map: MapType, grid: GWU.grid.NumGrid): void;
declare function cleanLoopiness(map: MapType): void;

declare class Snapshot {
    map: Map;
    version: number;
    constructor(map: Map);
}
declare class SnapshotManager {
    map: Map;
    version: number;
    cellVersion: GWU.grid.NumGrid;
    layerVersion: number[];
    lightVersion: number;
    free: Snapshot[];
    constructor(map: Map);
    takeNew(): Snapshot;
    revertMapTo(snap: Snapshot): void;
    release(snap: Snapshot): void;
}

declare function isHallway(map: Map, x: number, y: number): boolean;

type index_d$4_CellFlags = CellFlags;
type index_d$4_MapFlags = MapFlags;
type index_d$4_SetOptions = SetOptions;
type index_d$4_SetTileOptions = SetTileOptions;
type index_d$4_TileData = TileData;
type index_d$4_TileArray = TileArray;
type index_d$4_CellInfoType = CellInfoType;
type index_d$4_CellType = CellType;
type index_d$4_EachCellCb = EachCellCb;
type index_d$4_EachItemCb = EachItemCb;
type index_d$4_EachActorCb = EachActorCb;
type index_d$4_MapTestFn = MapTestFn;
type index_d$4_MapType = MapType;
type index_d$4_Cell = Cell;
declare const index_d$4_Cell: typeof Cell;
type index_d$4_MapOptions = MapOptions;
type index_d$4_LayerType = LayerType;
type index_d$4_Map = Map;
declare const index_d$4_Map: typeof Map;
declare const index_d$4_analyze: typeof analyze;
declare const index_d$4_updateChokepoints: typeof updateChokepoints;
declare const index_d$4_floodFillCount: typeof floodFillCount;
declare const index_d$4_updateLoopiness: typeof updateLoopiness;
declare const index_d$4_resetLoopiness: typeof resetLoopiness;
declare const index_d$4_checkLoopiness: typeof checkLoopiness;
declare const index_d$4_fillInnerLoopGrid: typeof fillInnerLoopGrid;
declare const index_d$4_cleanLoopiness: typeof cleanLoopiness;
type index_d$4_Snapshot = Snapshot;
declare const index_d$4_Snapshot: typeof Snapshot;
type index_d$4_SnapshotManager = SnapshotManager;
declare const index_d$4_SnapshotManager: typeof SnapshotManager;
declare const index_d$4_isHallway: typeof isHallway;
declare namespace index_d$4 {
  export {
    index_d$4_CellFlags as CellFlags,
    index_d$4_MapFlags as MapFlags,
    index_d$4_SetOptions as SetOptions,
    index_d$4_SetTileOptions as SetTileOptions,
    index_d$4_TileData as TileData,
    index_d$4_TileArray as TileArray,
    index_d$4_CellInfoType as CellInfoType,
    index_d$4_CellType as CellType,
    index_d$4_EachCellCb as EachCellCb,
    index_d$4_EachItemCb as EachItemCb,
    index_d$4_EachActorCb as EachActorCb,
    index_d$4_MapTestFn as MapTestFn,
    index_d$4_MapType as MapType,
    index_d$4_Cell as Cell,
    index_d$4_MapOptions as MapOptions,
    index_d$4_LayerType as LayerType,
    index_d$4_Map as Map,
    make$1 as make,
    from$2 as from,
    index_d$4_analyze as analyze,
    index_d$4_updateChokepoints as updateChokepoints,
    index_d$4_floodFillCount as floodFillCount,
    index_d$4_updateLoopiness as updateLoopiness,
    index_d$4_resetLoopiness as resetLoopiness,
    index_d$4_checkLoopiness as checkLoopiness,
    index_d$4_fillInnerLoopGrid as fillInnerLoopGrid,
    index_d$4_cleanLoopiness as cleanLoopiness,
    index_d$4_Snapshot as Snapshot,
    index_d$4_SnapshotManager as SnapshotManager,
    index_d$4_isHallway as isHallway,
  };
}

interface KindOptions$1 extends KindOptions {
    flags?: GWU.flag.FlagBase;
}
interface MakeOptions$1 extends MakeOptions {
    fov?: GWU.fov.FovSystem;
    memory?: Memory;
}
declare class ActorKind extends EntityKind {
    flags: {
        actor: number;
    };
    constructor(opts: KindOptions$1);
    make(options?: Partial<MakeOptions$1>): Actor;
    init(actor: Actor, options?: Partial<MakeOptions$1>): void;
    hasActorFlag(flag: number): boolean;
    canSeeEntity(_actor: Actor, _entity: Entity): boolean;
    isAbleToSee(_actor: Actor, _entity: Entity): boolean;
    isAbleToSense(_actor: Actor, _entity: Entity): boolean;
    forbidsCell(cell: CellType, actor?: Actor): boolean;
    avoidsCell(cell: CellType, actor?: Actor): boolean;
    getFlavor(actor: Actor, opts?: FlavorOptions): string;
    pickupItem(actor: Actor, item: Item, _opts?: Partial<PickupOptions>): Promise<boolean>;
    dropItem(actor: Actor, item: Item, _opts?: Partial<DropOptions>): Promise<boolean>;
}

declare function make(id: string | ActorKind, makeOptions?: any): Actor;
declare function makeRandom(opts: Partial<MatchOptions$1> | string, makeOptions?: any): Actor;
declare function from$1(info: string | ActorKind | KindOptions$1, makeOptions?: any): Actor;
declare const kinds: Record<string, ActorKind>;
declare function install$1(id: string, kind: ActorKind | KindOptions$1): ActorKind;
declare function get(id: string | ActorKind): ActorKind | null;
declare function makeKind(info: KindOptions$1): ActorKind;
interface MatchOptions$1 {
    tags: string | string[];
    forbidTags: string | string[];
    rng: GWU.rng.Random;
}
declare function randomKind(opts?: Partial<MatchOptions$1> | string): ActorKind | null;

type index_d$3_ActorFlags = ActorFlags;
type index_d$3_ActorKind = ActorKind;
declare const index_d$3_ActorKind: typeof ActorKind;
type index_d$3_PickupOptions = PickupOptions;
type index_d$3_DropOptions = DropOptions;
type index_d$3_Actor = Actor;
declare const index_d$3_Actor: typeof Actor;
declare const index_d$3_make: typeof make;
declare const index_d$3_makeRandom: typeof makeRandom;
declare const index_d$3_kinds: typeof kinds;
declare const index_d$3_get: typeof get;
declare const index_d$3_makeKind: typeof makeKind;
declare const index_d$3_randomKind: typeof randomKind;
declare namespace index_d$3 {
  export {
    index_d$3_ActorFlags as ActorFlags,
    KindOptions$1 as KindOptions,
    MakeOptions$1 as MakeOptions,
    index_d$3_ActorKind as ActorKind,
    index_d$3_PickupOptions as PickupOptions,
    index_d$3_DropOptions as DropOptions,
    index_d$3_Actor as Actor,
    index_d$3_make as make,
    index_d$3_makeRandom as makeRandom,
    from$1 as from,
    index_d$3_kinds as kinds,
    install$1 as install,
    index_d$3_get as get,
    index_d$3_makeKind as makeKind,
    MatchOptions$1 as MatchOptions,
    index_d$3_randomKind as randomKind,
  };
}

interface CellFlags {
    cell: number;
}
interface MapFlags {
    map: number;
}
interface SetOptions {
    superpriority: boolean;
    blockedByOtherLayers: boolean;
    blockedByActors: boolean;
    blockedByItems: boolean;
    volume: number;
    machine: number;
}
declare type SetTileOptions = Partial<SetOptions>;
declare type TileData = Tile | null;
declare type TileArray = [Tile, ...TileData[]];
interface CellInfoType {
    readonly flags: CellFlags;
    readonly chokeCount: number;
    readonly machineId: number;
    readonly needsRedraw: boolean;
    readonly x: number;
    readonly y: number;
    readonly map: MapType;
    readonly tiles: TileArray;
    readonly actor: Actor | null;
    readonly item: Item | null;
    hasCellFlag(flag: number): boolean;
    hasTileFlag(flag: number): boolean;
    hasAllTileFlags(flags: number): boolean;
    hasEntityFlag(flag: number, withEntities?: boolean): boolean;
    hasAllEntityFlags(flags: number, withEntities?: boolean): boolean;
    hasTileMechFlag(flag: number): boolean;
    cellFlags(): number;
    entityFlags(): number;
    tileFlags(): number;
    tileMechFlags(): number;
    blocksVision(): boolean;
    blocksPathing(): boolean;
    blocksMove(): boolean;
    blocksEffects(): boolean;
    isWall(): boolean;
    isStairs(): boolean;
    isFloor(): boolean;
    isPassable(): boolean;
    isSecretlyPassable(): boolean;
    isNull(): boolean;
    isGateSite(): boolean;
    depthPriority(depth: number): number;
    highestPriority(): number;
    blocksLayer(depth: number): boolean;
    depthTile(depth: number): Tile | null;
    hasTile(tile: string | number | Tile): boolean;
    eachTile(cb: GWU.types.EachCb<Tile>): void;
    hasDepthTile(depth: number): boolean;
    highestPriorityTile(): Tile;
    hasTileTag(tag: string): boolean;
    hasAllTileTags(tags: string[]): boolean;
    hasAnyTileTag(tags: string[]): boolean;
    hasItem(): boolean;
    hasActor(): boolean;
    hasPlayer(): boolean;
    eachGlowLight(cb: (light: GWU.light.LightType) => any): void;
    hasEffect(name: string): boolean;
    needsToFire(): boolean;
    willFire(name: string): boolean;
    readonly hasStableSnapshot: boolean;
    getSnapshot(mixer: GWU.sprite.Mixer): void;
    putSnapshot(mixer: GWU.sprite.Mixer): void;
    readonly hasStableMemory: boolean;
    drawStatus(sidebar: StatusDrawer): void;
    getDescription(): string;
    getFlavor(): string;
    getName(opts: any): string;
}
interface CellType extends CellInfoType {
    chokeCount: number;
    machineId: number;
    setCellFlag(flag: number): void;
    clearCellFlag(flag: number): void;
    setTile(tile: Tile, opts?: SetTileOptions): boolean;
    clear(tile?: number | string | Tile): void;
    clearDepth(depth: number): boolean;
    clearTiles(tile?: string | number | Tile): void;
    addItem(item: Item, withEffects?: boolean): void;
    removeItem(item: Item, withEffects?: boolean): boolean;
    addActor(actor: Actor, withEffects?: boolean): void;
    removeActor(actor: Actor, withEffects?: boolean): boolean;
    fireEvent(event: string, ctx?: Partial<EffectCtx>): Promise<boolean>;
    fireAll(): Promise<boolean>;
    clearEvents(): void;
    copy(other: CellInfoType): void;
    needsRedraw: boolean;
    readonly changed: boolean;
}
declare type EachCellCb = (cell: CellType, x: number, y: number, map: MapType) => any;
declare type EachItemCb = (item: Item) => any;
declare type EachActorCb = (actor: Actor) => any;
declare type MapTestFn = (cell: CellType, x: number, y: number, map: MapType) => boolean;
interface MapType extends GWU.fov.FovSite {
    readonly width: number;
    readonly height: number;
    readonly rng: GWU.rng.Random;
    readonly id: string;
    actors: Actor[];
    items: Item[];
    light: GWU.light.LightSystemType;
    properties: Record<string, any>;
    hasXY(x: number, y: number): boolean;
    isBoundaryXY(x: number, y: number): boolean;
    cell(x: number, y: number): CellType;
    get(x: number, y: number): CellType | undefined;
    eachCell(cb: EachCellCb): void;
    eachItem(cb: EachItemCb): void;
    addItem(x: number, y: number, item: Item, fireEffects: boolean): boolean | Promise<boolean>;
    addItem(x: number, y: number, item: Item): boolean;
    removeItem(item: Item, fireEffects: boolean): boolean | Promise<boolean>;
    removeItem(item: Item): boolean;
    itemAt(x: number, y: number): Item | null;
    eachActor(cb: EachActorCb): void;
    addActor(x: number, y: number, actor: Actor, fireEffects: boolean): boolean | Promise<boolean>;
    addActor(x: number, y: number, actor: Actor): boolean;
    removeActor(actor: Actor, fireEffects: boolean): boolean | Promise<boolean>;
    removeActor(actor: Actor): boolean;
    actorAt(x: number, y: number): Actor | null;
    hasKey(x: number, y: number): boolean;
    hasMapFlag(flag: number): boolean;
    setMapFlag(flag: number): void;
    clearMapFlag(flag: number): void;
    setCellFlag(x: number, y: number, flag: number): void;
    clearCellFlag(x: number, y: number, flag: number): void;
    fill(tile: string, boundary?: string): void;
    hasTile(x: number, y: number, tile: string | number | Tile): boolean;
    setTile(x: number, y: number, tile: string | number | Tile, opts?: SetTileOptions): boolean;
    tick(dt: number): Promise<boolean>;
    fire(event: string, x: number, y: number, ctx?: Partial<EffectCtx>): Promise<boolean>;
    fireAll(event: string, ctx?: Partial<EffectCtx>): Promise<boolean>;
    activateMachine(machineId: number, originX: number, originY: number, ctx?: Partial<EffectCtx>): Promise<boolean>;
    count(cb: MapTestFn): number;
    dump(fmt?: (cell: CellType) => string): void;
    getAppearanceAt(x: number, y: number, dest: GWU.sprite.Mixer): void;
}

declare class Entity implements EntityType {
    depth: number;
    light: GWU.light.LightType | null;
    flags: FlagType$1;
    next: Entity | null;
    x: number;
    y: number;
    _map: MapType | null;
    kind: EntityKind;
    key: KeyInfoType | null;
    machineHome: number;
    id: string;
    constructor(kind: EntityKind);
    get map(): MapType | null;
    addToMap(map: MapType, x: number, y: number): boolean;
    removeFromMap(): void;
    get sprite(): GWU.sprite.Sprite;
    get isDestroyed(): boolean;
    isAt(x: number, y: number): boolean;
    clone(): this;
    copy(other: Entity): void;
    canBeSeen(): boolean;
    destroy(): void;
    hasEntityFlag(flag: number): boolean;
    hasAllEntityFlags(flags: number): boolean;
    setEntityFlag(flag: number): void;
    clearEntityFlag(flag: number): void;
    hasTag(tag: string): boolean;
    blocksMove(): boolean;
    blocksVision(): boolean;
    blocksPathing(): boolean;
    blocksEffects(): boolean;
    isKey(x: number, y: number): boolean | null;
    forbidsCell(cell: CellType): boolean;
    avoidsCell(cell: CellType): boolean;
    getName(opts?: TextOptions): string;
    getDescription(opts?: TextOptions): string;
    getFlavor(opts?: FlavorOptions): string;
    getVerb(verb: string): string;
    drawStatus(sidebar: StatusDrawer): void;
    drawInto(dest: GWU.sprite.Mixer, _observer?: Entity): void;
    toString(): string;
}

interface TextOptions {
    article?: boolean;
    color?: boolean | GWU.color.ColorBase;
}
interface FlavorOptions extends TextOptions {
    action?: boolean;
}
interface KindOptions extends Partial<GWU.sprite.SpriteConfig> {
    id?: string;
    name: string;
    flavor?: string;
    description?: string;
    tags?: string | string[];
    requiredTileTags?: string | string[];
}
interface MakeOptions {
    machineHome: number;
}
declare class EntityKind {
    id: string;
    name: string;
    flavor: string;
    description: string;
    sprite: GWU.sprite.Sprite;
    tags: string[];
    requiredTileTags: string[];
    constructor(config: KindOptions);
    make(opts?: Partial<MakeOptions>): Entity;
    init(entity: Entity, opts?: Partial<MakeOptions>): void;
    canBeSeen(_entity: Entity): boolean;
    forbidsCell(cell: CellType, _entity?: Entity): boolean;
    avoidsCell(cell: CellType, _entity?: Entity): boolean;
    getName(_entity: Entity, _opts?: TextOptions): string;
    getDescription(_entity: Entity, _opts?: TextOptions): string;
    getFlavor(_entity: Entity, _opts?: FlavorOptions): string;
    getVerb(_entity: Entity, verb: string): string;
    drawStatus(entity: Entity, sidebar: StatusDrawer): void;
}

type index_d$2_KeyInfoType = KeyInfoType;
type index_d$2_EntityType = EntityType;
type index_d$2_StatusDrawer = StatusDrawer;
type index_d$2_KeyInfo = KeyInfo;
declare const index_d$2_KeyInfo: typeof KeyInfo;
declare const index_d$2_makeKeyInfo: typeof makeKeyInfo;
type index_d$2_TextOptions = TextOptions;
type index_d$2_FlavorOptions = FlavorOptions;
type index_d$2_KindOptions = KindOptions;
type index_d$2_MakeOptions = MakeOptions;
type index_d$2_EntityKind = EntityKind;
declare const index_d$2_EntityKind: typeof EntityKind;
type index_d$2_Entity = Entity;
declare const index_d$2_Entity: typeof Entity;
declare namespace index_d$2 {
  export {
    index_d$2_KeyInfoType as KeyInfoType,
    FlagType$1 as FlagType,
    index_d$2_EntityType as EntityType,
    index_d$2_StatusDrawer as StatusDrawer,
    index_d$2_KeyInfo as KeyInfo,
    index_d$2_makeKeyInfo as makeKeyInfo,
    index_d$2_TextOptions as TextOptions,
    index_d$2_FlavorOptions as FlavorOptions,
    index_d$2_KindOptions as KindOptions,
    index_d$2_MakeOptions as MakeOptions,
    index_d$2_EntityKind as EntityKind,
    index_d$2_Entity as Entity,
  };
}

declare function getCellPathCost(map: Map, x: number, y: number): number;
declare function fillCostMap(map: Map, costMap: GWU.grid.NumGrid): void;
interface PathOptions {
    eightWays: boolean;
}
declare function getPathBetween(map: Map, x0: number, y0: number, x1: number, y1: number, options?: Partial<PathOptions>): GWU.xy.Loc[] | null;

declare const path_d_getCellPathCost: typeof getCellPathCost;
declare const path_d_fillCostMap: typeof fillCostMap;
type path_d_PathOptions = PathOptions;
declare const path_d_getPathBetween: typeof getPathBetween;
declare namespace path_d {
  export {
    path_d_getCellPathCost as getCellPathCost,
    path_d_fillCostMap as fillCostMap,
    path_d_PathOptions as PathOptions,
    path_d_getPathBetween as getPathBetween,
  };
}

interface HordeConfig {
    leader: string;
    members?: Record<string, GWU.range.RangeBase>;
    tags?: string | string[];
    frequency?: GWU.frequency.FrequencyConfig;
    flags?: GWU.flag.FlagBase;
    requiredTile?: string;
}
interface HordeFlagsType {
    horde: number;
}
interface SpawnOptions {
    canSpawn: GWU.xy.XYMatchFunc;
    rng: GWU.rng.Random;
    machine: number;
}
declare class Horde {
    tags: string[];
    leader: string;
    members: Record<string, GWU.range.Range>;
    frequency: GWU.frequency.FrequencyFn;
    flags: HordeFlagsType;
    constructor(config: HordeConfig);
    spawn(map: Map, x?: number, y?: number, opts?: Partial<SpawnOptions>): Promise<Actor | null>;
    _spawnLeader(map: Map, x: number, y: number, opts: SpawnOptions): Promise<Actor | null>;
    _addLeader(leader: Actor, map: Map, x: number, y: number, _opts: SpawnOptions): Promise<boolean>;
    _addMember(member: Actor, map: Map, x: number, y: number, leader: Actor, _opts: SpawnOptions): Promise<boolean>;
    _spawnMembers(leader: Actor, map: Map, opts: SpawnOptions): Promise<number>;
    _spawnMember(kindId: string, map: Map, leader: Actor, opts: SpawnOptions): Promise<Actor | null>;
    _pickLeaderLoc(leader: Actor, map: Map, opts: SpawnOptions): GWU.xy.Loc | null;
    _pickMemberLoc(actor: Actor, map: Map, leader: Actor, opts: SpawnOptions): GWU.xy.Loc | null;
}

declare const hordes: Record<string, Horde>;
declare function install(id: string, horde: string | Horde | HordeConfig): Horde;
declare function installAll(hordes: Record<string, string | Horde | HordeConfig>): void;
declare function from(id: string | Horde | HordeConfig): Horde;
interface MatchOptions {
    tags: string | string[];
    forbidTags: string | string[];
    flags: GWU.flag.FlagBase;
    forbidFlags: GWU.flag.FlagBase;
    depth: number;
    oodChance: number;
    rng: GWU.rng.Random;
}
declare function random(opts?: Partial<MatchOptions> | string): Horde | null;

type index_d$1_HordeConfig = HordeConfig;
type index_d$1_HordeFlagsType = HordeFlagsType;
type index_d$1_SpawnOptions = SpawnOptions;
type index_d$1_Horde = Horde;
declare const index_d$1_Horde: typeof Horde;
declare const index_d$1_hordes: typeof hordes;
declare const index_d$1_install: typeof install;
declare const index_d$1_installAll: typeof installAll;
declare const index_d$1_from: typeof from;
type index_d$1_MatchOptions = MatchOptions;
declare const index_d$1_random: typeof random;
declare namespace index_d$1 {
  export {
    index_d$1_HordeConfig as HordeConfig,
    index_d$1_HordeFlagsType as HordeFlagsType,
    index_d$1_SpawnOptions as SpawnOptions,
    index_d$1_Horde as Horde,
    index_d$1_hordes as hordes,
    index_d$1_install as install,
    index_d$1_installAll as installAll,
    index_d$1_from as from,
    index_d$1_MatchOptions as MatchOptions,
    index_d$1_random as random,
  };
}

declare class BasicDrawer implements CellDrawer {
    isAnyKindOfVisible(_cell: CellType): boolean;
    drawInto(dest: BufferSource | GWU.canvas.DataBuffer, map: MapType, opts?: Partial<MapDrawOptions>): void;
    drawCell(dest: GWU.sprite.Mixer, cell: CellType, fov?: GWU.fov.FovTracker): boolean;
    getAppearance(dest: GWU.sprite.Mixer, cell: CellType): void;
    applyLight(dest: GWU.sprite.Mixer, cell: CellType, fov?: GWU.fov.FovTracker): void;
}

type index_d_CellDrawFn = CellDrawFn;
type index_d_MapDrawOptions = MapDrawOptions;
type index_d_BufferSource = BufferSource;
type index_d_CellDrawer = CellDrawer;
type index_d_BasicDrawer = BasicDrawer;
declare const index_d_BasicDrawer: typeof BasicDrawer;
declare namespace index_d {
  export {
    index_d_CellDrawFn as CellDrawFn,
    index_d_MapDrawOptions as MapDrawOptions,
    index_d_BufferSource as BufferSource,
    index_d_CellDrawer as CellDrawer,
    index_d_BasicDrawer as BasicDrawer,
  };
}

export { index_d$3 as actor, index_d as draw, index_d$6 as effect, index_d$2 as entity, index_d$a as flags, index_d$1 as horde, index_d$9 as item, index_d$7 as layer, index_d$4 as map, index_d$5 as memory, path_d as path, index_d$8 as tile };
