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
    DEFAULT_ACTOR,
    DEFAULT_ITEM,
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
    USES_FOV,
    DEFAULT = 0
}

declare enum Item$1 {
    DEFAULT = 0
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
    HAS_FX,
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
    MAP_NEEDS_REDRAW,
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

declare enum Effect$1 {
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
    E_IGNORE_FOV,
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
    Effect$1 as Effect,
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
    flags?: GWU.flag.FlagBase;
}
interface MakeOptions$2 extends MakeOptions {
    quantity: number;
}
declare class ItemKind extends EntityKind {
    flags: FlagType;
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

declare function make$5(id: string | ItemKind, makeOptions?: any): Item;
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
    make$5 as make,
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

interface EffectCtx {
    actor?: Actor | null;
    item?: Item | null;
    key?: Item | Actor | null;
    player?: Actor | null;
    aware?: boolean;
    identified?: boolean;
    machine?: number;
    force?: boolean;
    good?: boolean;
    seen?: boolean;
    originX?: number;
    originY?: number;
    rng?: GWU.rng.Random;
}
interface MapXY {
    map: MapType;
    x: number;
    y: number;
}
declare type EffectFn = (xy: MapXY, ctx?: EffectCtx) => boolean;
declare type HandlerFn = (config: string | string[] | Record<string, any>) => EffectFn;
declare const handlers: Record<string, HandlerFn>;
declare function installHandler(id: string, handler: HandlerFn): void;
declare type MakeEffectFn = (config: any) => Effect;
declare const effectTypes: Record<string, MakeEffectFn>;
declare function installType(id: string, type: MakeEffectFn): void;
interface Effect {
    chance: number;
    seen: boolean;
    effects: EffectFn[];
    next: Effect | null;
    trigger(loc: MapXY, ctx?: EffectCtx): boolean;
    clone(): this;
}
interface EffectConfig {
    chance?: number | string;
    type?: string;
    effects: string | EffectFn | (string | EffectFn)[] | Record<string, any>;
    good?: boolean;
    flags?: GWU.flag.FlagBase;
    next?: EffectBase;
    [key: string]: any;
}
declare type EffectBase = string | EffectFn | (string | EffectFn)[] | EffectConfig | Record<string, any>;
declare function make$4(opts: EffectBase): Effect;
declare function from$3(opts: EffectBase): Effect;
declare const installedEffects: Record<string, Effect>;
declare function install$3(id: string, config: EffectBase): Effect;
declare function installAll$2(effects: Record<string, EffectBase>): void;
declare function resetAll(): void;

interface TextOptions$1 {
    article?: boolean | string;
    color?: boolean | string | GWU.color.ColorBase;
}
interface TileConfig extends GWU.sprite.SpriteConfig {
    id: string;
    flags: TileFlags;
    dissipate: number;
    effects: Record<string, EffectBase | Effect>;
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
    effects: Record<string, string | Effect>;
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
    effects: Record<string, EffectBase | null>;
    groundTile: string;
    light: GWU.light.LightBase | null;
    tags: string | string[];
}
declare function make$3(options: Partial<TileOptions>): Tile;
declare const tiles: Record<string, Tile>;
declare const all: Tile[];
declare function get$2(id: string | number | Tile): Tile;
declare function install$2(id: string, options: Partial<TileOptions>): Tile;
declare function install$2(id: string, base: string, options: Partial<TileOptions>): Tile;
declare function installAll$1(tiles: Record<string, Partial<TileOptions>>): void;

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
    install$2 as install,
    installAll$1 as installAll,
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
    addActor(_x: number, _y: number, _actor: Actor): boolean;
    forceActor(_x: number, _y: number, _actor: Actor): boolean;
    removeActor(_actor: Actor): boolean;
    addItem(_x: number, _y: number, _item: Item): boolean;
    forceItem(_x: number, _y: number, _item: Item): boolean;
    removeItem(_item: Item): boolean;
    tick(_dt: number): boolean;
}

declare class TileLayer extends MapLayer {
    constructor(map: MapType, name?: string);
    setTile(x: number, y: number, tile: Tile, opts?: SetTileOptions): boolean;
    clearTile(x: number, y: number): boolean;
    tick(_dt: number): boolean;
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
    tick(_dt: number): boolean;
    dissipate(volume: GWU.grid.NumGrid): void;
    calcOpacity(volume: number): number;
    updateCellVolume(x: number, y: number, startingVolume: GWU.grid.NumGrid): void;
    spread(startingVolume: GWU.grid.NumGrid): void;
}

declare class FireLayer extends TileLayer {
    constructor(map: MapType, name?: string);
    tick(_dt: number): boolean;
    exposeToFire(x: number, y: number, alwaysIgnite?: boolean): boolean;
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

declare class BasicEffect implements Effect {
    effects: EffectFn[];
    chance: number;
    seen: boolean;
    flags: number;
    next: Effect | null;
    constructor(config?: string | string[] | Record<string, any>);
    clone(): this;
    trigger(loc: MapXY, ctx?: EffectCtx): boolean;
}
declare function makeBasicEffect(config: any): BasicEffect;

declare function makeSpreadEffect(config: string | string[] | Record<string, any>): SpreadEffect;
declare class SpreadEffect extends BasicEffect {
    grow: number;
    decrement: number;
    matchTile: string;
    constructor(config?: string | string[] | Record<string, any>);
    clone(): this;
    trigger(xy: MapXY, ctx?: EffectCtx): boolean;
}
declare function mapDisruptedBy(map: MapType, blockingGrid: GWU.grid.NumGrid, blockingToMapX?: number, blockingToMapY?: number): boolean;
declare function computeSpawnMap(effect: SpreadEffect, loc: MapXY, spawnMap: GWU.grid.NumGrid): boolean;
declare function clearCells(map: MapType, spawnMap: GWU.grid.NumGrid, flags?: number): boolean;
declare function evacuateCreatures(map: MapType, blockingMap: GWU.grid.NumGrid): boolean;
declare function evacuateItems(map: MapType, blockingMap: GWU.grid.NumGrid): boolean;

declare function makeEmitHandler(config: any): EffectFn;
declare function emitEffect(id: string, loc: MapXY, ctx: EffectCtx): boolean;

declare function makeMessageHandler(src: any): EffectFn;
declare function messageEffect(info: {
    msg: string;
}, loc: MapXY, ctx: EffectCtx): boolean;

declare function makeActivateMachine(): EffectFn;
declare function activateMachine(loc: MapXY, ctx: EffectCtx): boolean;

interface TileEffectOptions extends SetTileOptions {
    id: string;
}
declare function makeTileHandler(src: any): EffectFn;
declare function tileEffect(this: TileEffectOptions, loc: MapXY, ctx: EffectCtx): boolean;

declare function makeClearHandler(config: any): EffectFn;
declare function clearEffect(layers: number, loc: MapXY, _ctx: EffectCtx): boolean;

declare function makeFeatureHandler(id: any): EffectFn;
declare function featureEffect(id: string, loc: MapXY, ctx?: EffectCtx): boolean;

type index_d$6_EffectCtx = EffectCtx;
type index_d$6_MapXY = MapXY;
type index_d$6_EffectFn = EffectFn;
type index_d$6_HandlerFn = HandlerFn;
declare const index_d$6_handlers: typeof handlers;
declare const index_d$6_installHandler: typeof installHandler;
type index_d$6_MakeEffectFn = MakeEffectFn;
declare const index_d$6_effectTypes: typeof effectTypes;
declare const index_d$6_installType: typeof installType;
type index_d$6_Effect = Effect;
type index_d$6_EffectConfig = EffectConfig;
type index_d$6_EffectBase = EffectBase;
declare const index_d$6_installedEffects: typeof installedEffects;
declare const index_d$6_resetAll: typeof resetAll;
type index_d$6_BasicEffect = BasicEffect;
declare const index_d$6_BasicEffect: typeof BasicEffect;
declare const index_d$6_makeBasicEffect: typeof makeBasicEffect;
declare const index_d$6_makeSpreadEffect: typeof makeSpreadEffect;
type index_d$6_SpreadEffect = SpreadEffect;
declare const index_d$6_SpreadEffect: typeof SpreadEffect;
declare const index_d$6_mapDisruptedBy: typeof mapDisruptedBy;
declare const index_d$6_computeSpawnMap: typeof computeSpawnMap;
declare const index_d$6_clearCells: typeof clearCells;
declare const index_d$6_evacuateCreatures: typeof evacuateCreatures;
declare const index_d$6_evacuateItems: typeof evacuateItems;
declare const index_d$6_makeEmitHandler: typeof makeEmitHandler;
declare const index_d$6_emitEffect: typeof emitEffect;
declare const index_d$6_makeMessageHandler: typeof makeMessageHandler;
declare const index_d$6_messageEffect: typeof messageEffect;
declare const index_d$6_makeActivateMachine: typeof makeActivateMachine;
declare const index_d$6_activateMachine: typeof activateMachine;
type index_d$6_TileEffectOptions = TileEffectOptions;
declare const index_d$6_makeTileHandler: typeof makeTileHandler;
declare const index_d$6_tileEffect: typeof tileEffect;
declare const index_d$6_makeClearHandler: typeof makeClearHandler;
declare const index_d$6_clearEffect: typeof clearEffect;
declare const index_d$6_makeFeatureHandler: typeof makeFeatureHandler;
declare const index_d$6_featureEffect: typeof featureEffect;
declare namespace index_d$6 {
  export {
    index_d$6_EffectCtx as EffectCtx,
    index_d$6_MapXY as MapXY,
    index_d$6_EffectFn as EffectFn,
    index_d$6_HandlerFn as HandlerFn,
    index_d$6_handlers as handlers,
    index_d$6_installHandler as installHandler,
    index_d$6_MakeEffectFn as MakeEffectFn,
    index_d$6_effectTypes as effectTypes,
    index_d$6_installType as installType,
    index_d$6_Effect as Effect,
    index_d$6_EffectConfig as EffectConfig,
    index_d$6_EffectBase as EffectBase,
    make$4 as make,
    from$3 as from,
    index_d$6_installedEffects as installedEffects,
    install$3 as install,
    installAll$2 as installAll,
    index_d$6_resetAll as resetAll,
    index_d$6_BasicEffect as BasicEffect,
    index_d$6_makeBasicEffect as makeBasicEffect,
    index_d$6_makeSpreadEffect as makeSpreadEffect,
    index_d$6_SpreadEffect as SpreadEffect,
    index_d$6_mapDisruptedBy as mapDisruptedBy,
    index_d$6_computeSpawnMap as computeSpawnMap,
    index_d$6_clearCells as clearCells,
    index_d$6_evacuateCreatures as evacuateCreatures,
    index_d$6_evacuateItems as evacuateItems,
    index_d$6_makeEmitHandler as makeEmitHandler,
    index_d$6_emitEffect as emitEffect,
    index_d$6_makeMessageHandler as makeMessageHandler,
    index_d$6_messageEffect as messageEffect,
    index_d$6_makeActivateMachine as makeActivateMachine,
    index_d$6_activateMachine as activateMachine,
    index_d$6_TileEffectOptions as TileEffectOptions,
    index_d$6_makeTileHandler as makeTileHandler,
    index_d$6_tileEffect as tileEffect,
    index_d$6_makeClearHandler as makeClearHandler,
    index_d$6_clearEffect as clearEffect,
    index_d$6_makeFeatureHandler as makeFeatureHandler,
    index_d$6_featureEffect as featureEffect,
  };
}

declare type CellDrawFn = (dest: GWU.sprite.Mixer, cell: CellType, fov?: GWU.fov.FovTracker) => boolean;
interface MapDrawOptions {
    offsetX: number;
    offsetY: number;
    fov?: GWU.fov.FovTracker;
}
interface BufferSource {
    buffer: GWU.buffer.Buffer;
}
interface CellDrawer {
    drawCell: CellDrawFn;
    drawInto(dest: BufferSource | GWU.buffer.Buffer, map: MapType, opts?: Partial<MapDrawOptions>): void;
}

interface MapOptions extends GWU.light.LightSystemOptions {
    tile: string | true;
    boundary: string | true;
    seed: number;
    id: string;
    drawer: CellDrawer;
}
declare type LayerType = TileLayer | ActorLayer | ItemLayer;
interface QueuedEvent {
    event: string;
    ctx: EffectCtx;
    x: number;
    y: number;
}
declare class Map implements GWU.light.LightSystemSite, MapType, GWU.tween.Animator {
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
    fx: Entity[];
    _animations: GWU.tween.Animation[];
    _queuedEvents: QueuedEvent[];
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
    get(x: number, y: number): Cell | undefined;
    eachCell(cb: EachCellCb): void;
    hasItem(x: number, y: number): boolean;
    itemAt(x: number, y: number): Item | null;
    eachItem(cb: GWU.types.EachCb<Item>): void;
    addItem(x: number, y: number, item: Item, fireEffects?: boolean): boolean;
    addItemNear(x: number, y: number, item: Item, fireEffects?: boolean): boolean;
    removeItem(item: Item, fireEffects?: boolean): boolean;
    hasPlayer(x: number, y: number): boolean;
    actorAt(x: number, y: number): Actor | null;
    eachActor(cb: GWU.types.EachCb<Actor>): void;
    addActor(x: number, y: number, actor: Actor, fireEffects?: boolean): boolean;
    addActorNear(x: number, y: number, actor: Actor, fireEffects?: boolean): boolean;
    removeActor(actor: Actor, fireEffects?: boolean): boolean;
    fxAt(x: number, y: number): Entity | null;
    eachFx(cb: GWU.types.EachCb<Entity>): void;
    addFx(x: number, y: number, fx: Entity): boolean;
    moveFx(fx: Entity, x: number, y: number): boolean;
    removeFx(fx: Entity): boolean;
    hasKey(x: number, y: number): boolean;
    count(cb: MapTestFn): number;
    dump(fmt?: GWU.grid.GridFormat<Cell>, log?: {
        (...data: any[]): void;
        (message?: any, ...optionalParams: any[]): void;
    }): void;
    hasMapFlag(flag: number): boolean;
    setMapFlag(flag: number): void;
    clearMapFlag(flag: number): void;
    get needsRedraw(): boolean;
    set needsRedraw(v: boolean);
    hasCellFlag(x: number, y: number, flag: number): boolean;
    setCellFlag(x: number, y: number, flag: number): void;
    clearCellFlag(x: number, y: number, flag: number): void;
    hasEntityFlag(x: number, y: number, flag: number): boolean;
    clear(): void;
    clearCell(x: number, y: number, tile?: number | string | Tile): void;
    fill(tile: string | number | Tile, boundary?: string | number | Tile): void;
    hasTile(x: number, y: number, tile: string | number | Tile): boolean;
    forceTile(x: number, y: number, tile: string | number | Tile): boolean;
    setTile(x: number, y: number, tile: string | number | Tile, opts?: SetTileOptions | true): boolean;
    clearTiles(x: number, y: number, tile?: number | string | Tile): void;
    tick(dt: number): boolean;
    copy(src: Map): void;
    clone(): Map;
    queueEvent(x: number, y: number, event: string, ctx: EffectCtx): void;
    fireQueuedEvents(): void;
    fire(event: string, x: number, y: number, ctx?: EffectCtx): boolean;
    fireAll(event: string, ctx?: EffectCtx): boolean;
    activateMachine(machineId: number, originX: number, originY: number, ctx?: EffectCtx): boolean;
    drawInto(dest: BufferSource | GWU.buffer.Buffer, opts?: Partial<MapDrawOptions>): void;
    getAppearanceAt(x: number, y: number, dest: GWU.sprite.Mixer): boolean;
    hasActor(x: number, y: number): boolean;
    eachGlowLight(cb: GWU.light.LightCb): void;
    eachDynamicLight(_cb: GWU.light.LightCb): void;
    eachViewport(_cb: GWU.fov.ViewportCb): void;
    lightingChanged(): boolean;
    hasVisibleLight(x: number, y: number): boolean;
    blocksVision(x: number, y: number): boolean;
    addAnimation(a: GWU.tween.Animation): void;
    removeAnimation(a: GWU.tween.Animation): void;
}
declare function make$2(w: number, h: number, floor?: string, boundary?: string): Map;
declare function make$2(w: number, h: number, floor: string): Map;
declare function make$2(w: number, h: number, opts: Partial<MapOptions>): Map;
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
    memory(x: number, y: number): Cell;
    isMemory(x: number, y: number): boolean;
    setTile(): boolean;
    addItem(x: number, y: number, item: Item, fireEffects: boolean): boolean;
    addItem(x: number, y: number, item: Item): boolean;
    removeItem(item: Item, fireEffects: boolean): boolean;
    removeItem(item: Item): boolean;
    eachItem(cb: GWU.types.EachCb<Item>): void;
    addActor(x: number, y: number, actor: Actor, fireEffects: boolean): boolean;
    addActor(x: number, y: number, actor: Actor): boolean;
    removeActor(actor: Actor, fireEffects: boolean): boolean;
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
    visionDistance: number;
    constructor(kind: ActorKind);
    copy(other: Actor): void;
    hasActorFlag(flag: number): boolean;
    hasAllActorFlags(flags: number): boolean;
    actorFlags(): number;
    isPlayer(): boolean;
    canSee(x: number, y: number): boolean;
    canSee(entity: Entity): boolean;
    canSeeOrSense(x: number, y: number): boolean;
    canSeeOrSense(entity: Entity): boolean;
    isAbleToSee(entity: Entity): boolean;
    isAbleToSense(entity: Entity): boolean;
    pickupItem(item: Item, opts?: Partial<PickupOptions>): boolean;
    dropItem(item: Item, opts?: Partial<DropOptions>): boolean;
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
    constructor(map: Map, x: number, y: number, groundTile?: number | string | Tile);
    getSnapshot(dest: GWU.sprite.Mixer): void;
    putSnapshot(src: GWU.sprite.Mixer): void;
    get hasStableSnapshot(): boolean;
    get hasStableMemory(): boolean;
    copy(other: CellType): void;
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
    tileWithEffect(name: string): Tile | null;
    fireEvent(event: string, ctx?: EffectCtx): boolean;
    _activate(effect: string | Effect, ctx: EffectCtx): boolean;
    hasEffect(name: string): boolean;
    hasItem(): boolean;
    get item(): Item | null;
    addItem(item: Item, withEffects?: boolean): boolean;
    removeItem(item: Item, withEffects?: boolean): boolean;
    hasActor(): boolean;
    hasPlayer(): boolean;
    get actor(): Actor | null;
    addActor(actor: Actor, withEffects?: boolean): boolean;
    removeActor(actor: Actor, withEffects?: boolean): boolean;
    hasFx(): boolean;
    get fx(): Entity | null;
    _addFx(_fx: Entity): void;
    _removeFx(_fx: Entity): void;
    getDescription(): string;
    getFlavor(): string;
    getName(opts?: {}): string;
    dump(): string;
    drawStatus(buffer: GWU.buffer.Buffer, bounds: GWU.xy.Bounds): number;
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
    make$2 as make,
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
    vision?: number;
}
interface MakeOptions$1 extends MakeOptions {
    fov?: GWU.fov.FovSystem;
    memory?: Memory;
}
declare class ActorKind extends EntityKind {
    flags: ActorFlags;
    vision: Record<string, number>;
    constructor(opts: KindOptions$1);
    make(options?: Partial<MakeOptions$1>): Actor;
    init(actor: Actor, options?: Partial<MakeOptions$1>): void;
    addToMap(actor: Actor, map: MapType): void;
    removeFromMap(actor: Actor): void;
    hasActorFlag(flag: number): boolean;
    canSeeEntity(_actor: Actor, _entity: Entity): boolean;
    isAbleToSee(_actor: Actor, _entity: Entity): boolean;
    isAbleToSense(_actor: Actor, _entity: Entity): boolean;
    forbidsCell(cell: CellType, actor?: Actor): boolean;
    avoidsCell(cell: CellType, actor?: Actor): boolean;
    getFlavor(actor: Actor, opts?: FlavorOptions): string;
    pickupItem(actor: Actor, item: Item, _opts?: Partial<PickupOptions>): boolean;
    dropItem(actor: Actor, item: Item, _opts?: Partial<DropOptions>): boolean;
}

declare function make$1(id: string | ActorKind, makeOptions?: any): Actor;
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
    make$1 as make,
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
    hasFx(): boolean;
    eachGlowLight(cb: (light: GWU.light.LightType) => any): void;
    hasEffect(name: string): boolean;
    readonly hasStableSnapshot: boolean;
    getSnapshot(mixer: GWU.sprite.Mixer): void;
    putSnapshot(mixer: GWU.sprite.Mixer): void;
    readonly hasStableMemory: boolean;
    drawStatus(buffer: GWU.buffer.Buffer, bounds: GWU.xy.Bounds): number;
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
    addItem(item: Item, withEffects?: boolean): boolean;
    removeItem(item: Item, withEffects?: boolean): boolean;
    addActor(actor: Actor, withEffects?: boolean): boolean;
    removeActor(actor: Actor, withEffects?: boolean): boolean;
    fireEvent(event: string, ctx?: Partial<EffectCtx>): boolean;
    copy(other: CellInfoType): void;
    needsRedraw: boolean;
    readonly changed: boolean;
}
declare type EachCellCb = (cell: CellType, x: number, y: number, map: MapType) => any;
declare type EachItemCb = (item: Item) => any;
declare type EachActorCb = (actor: Actor) => any;
declare type MapTestFn = (cell: CellType, x: number, y: number, map: MapType) => boolean;
interface MapType extends GWU.fov.FovSite, GWU.tween.Animator {
    readonly width: number;
    readonly height: number;
    readonly rng: GWU.rng.Random;
    readonly id: string;
    needsRedraw: boolean;
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
    addItem(x: number, y: number, item: Item, fireEffects: boolean): boolean;
    addItem(x: number, y: number, item: Item): boolean;
    removeItem(item: Item, fireEffects: boolean): boolean;
    removeItem(item: Item): boolean;
    itemAt(x: number, y: number): Item | null;
    hasItem(x: number, y: number): boolean;
    eachActor(cb: EachActorCb): void;
    addActor(x: number, y: number, actor: Actor, fireEffects: boolean): boolean;
    addActor(x: number, y: number, actor: Actor): boolean;
    removeActor(actor: Actor, fireEffects: boolean): boolean;
    removeActor(actor: Actor): boolean;
    actorAt(x: number, y: number): Actor | null;
    hasActor(x: number, y: number): boolean;
    fxAt(x: number, y: number): Entity | null;
    addFx(x: number, y: number, fx: Entity): boolean;
    removeFx(fx: Entity): boolean;
    moveFx(fx: Entity, x: number, y: number): boolean;
    hasKey(x: number, y: number): boolean;
    hasMapFlag(flag: number): boolean;
    setMapFlag(flag: number): void;
    clearMapFlag(flag: number): void;
    setCellFlag(x: number, y: number, flag: number): void;
    clearCellFlag(x: number, y: number, flag: number): void;
    hasEntityFlag(x: number, y: number, flag: number): boolean;
    fill(tile: string, boundary?: string): void;
    hasTile(x: number, y: number, tile: string | number | Tile): boolean;
    setTile(x: number, y: number, tile: string | number | Tile, opts?: SetTileOptions): boolean;
    tick(dt: number): boolean;
    fire(event: string, x: number, y: number, ctx?: Partial<EffectCtx>): boolean;
    fireAll(event: string, ctx?: Partial<EffectCtx>): boolean;
    queueEvent(x: number, y: number, event: string, ctx: EffectCtx): void;
    fireQueuedEvents(): void;
    activateMachine(machineId: number, originX: number, originY: number, ctx?: Partial<EffectCtx>): boolean;
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
    drawStatus(buffer: GWU.buffer.Buffer, bounds: GWU.xy.Bounds): number;
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
interface KindOptions extends GWU.sprite.SpriteConfig {
    id?: string;
    name: string;
    flavor?: string;
    description?: string;
    sprite?: GWU.sprite.SpriteConfig;
    tags?: string | string[];
    requiredTileTags?: string | string[];
}
interface MakeOptions {
    machineHome?: number;
    x?: number;
    y?: number;
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
    make(opts?: MakeOptions): Entity;
    init(entity: Entity, opts?: MakeOptions): void;
    addToMap(_entity: Entity, _map: MapType): void;
    removeFromMap(_entity: Entity): void;
    canBeSeen(_entity: Entity): boolean;
    forbidsCell(cell: CellType, _entity?: Entity): boolean;
    avoidsCell(cell: CellType, _entity?: Entity): boolean;
    getName(_entity: Entity, _opts?: TextOptions): string;
    getDescription(_entity: Entity, _opts?: TextOptions): string;
    getFlavor(_entity: Entity, _opts?: FlavorOptions): string;
    getVerb(_entity: Entity, verb: string): string;
    drawStatus(entity: Entity, buffer: GWU.buffer.Buffer, bounds: GWU.xy.Bounds): number;
}
declare function make(opts: KindOptions, makeOpts?: MakeOptions): Entity;

type index_d$2_KeyInfoType = KeyInfoType;
type index_d$2_EntityType = EntityType;
type index_d$2_KeyInfo = KeyInfo;
declare const index_d$2_KeyInfo: typeof KeyInfo;
declare const index_d$2_makeKeyInfo: typeof makeKeyInfo;
type index_d$2_TextOptions = TextOptions;
type index_d$2_FlavorOptions = FlavorOptions;
type index_d$2_KindOptions = KindOptions;
type index_d$2_MakeOptions = MakeOptions;
type index_d$2_EntityKind = EntityKind;
declare const index_d$2_EntityKind: typeof EntityKind;
declare const index_d$2_make: typeof make;
type index_d$2_Entity = Entity;
declare const index_d$2_Entity: typeof Entity;
declare namespace index_d$2 {
  export {
    index_d$2_KeyInfoType as KeyInfoType,
    FlagType$1 as FlagType,
    index_d$2_EntityType as EntityType,
    index_d$2_KeyInfo as KeyInfo,
    index_d$2_makeKeyInfo as makeKeyInfo,
    index_d$2_TextOptions as TextOptions,
    index_d$2_FlavorOptions as FlavorOptions,
    index_d$2_KindOptions as KindOptions,
    index_d$2_MakeOptions as MakeOptions,
    index_d$2_EntityKind as EntityKind,
    index_d$2_make as make,
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
    spawn(map: Map, x?: number, y?: number, opts?: Partial<SpawnOptions>): Actor | null;
    _spawnLeader(map: Map, x: number, y: number, opts: SpawnOptions): Actor | null;
    _addLeader(leader: Actor, map: Map, x: number, y: number, _opts: SpawnOptions): boolean;
    _addMember(member: Actor, map: Map, x: number, y: number, leader: Actor, _opts: SpawnOptions): boolean;
    _spawnMembers(leader: Actor, map: Map, opts: SpawnOptions): number;
    _spawnMember(kindId: string, map: Map, leader: Actor, opts: SpawnOptions): Actor | null;
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
    drawInto(dest: BufferSource | GWU.buffer.Buffer, map: MapType, opts?: Partial<MapDrawOptions>): void;
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

declare type FxCallback = (result?: any) => any;
declare type FxStepFn = (x: number, y: number) => boolean;
interface FxOptions {
    speed?: number;
    duration?: number;
    isRealTime?: boolean;
}
interface SpriteFxOptions extends FxOptions {
    blink?: number;
}
declare function flashSprite(map: MapType, x: number, y: number, sprite: string | GWU.sprite.SpriteConfig, duration?: number, count?: number, animator?: GWU.tween.Animator): Promise<any>;
declare function hit(map: MapType, target: GWU.xy.XY, sprite?: string | GWU.sprite.SpriteConfig, duration?: number, animator?: GWU.tween.Animator): Promise<void>;
declare function miss(map: MapType, target: GWU.xy.XY, sprite?: string | GWU.sprite.SpriteConfig, duration?: number, animator?: GWU.tween.Animator): Promise<void>;
declare function fadeInOut(map: MapType, x: number, y: number, sprite: string | GWU.sprite.SpriteConfig, duration?: number, animator?: GWU.tween.Animator): Promise<any>;
interface MoveOptions {
    speed?: number;
    duration?: number;
    stopBeforeWalls?: boolean;
    stepFn?: FxStepFn;
    animator?: GWU.tween.Animator;
}
declare function moveSprite(map: MapType, source: GWU.xy.XY | GWU.xy.Loc, target: GWU.xy.XY | GWU.xy.Loc, sprite: string | GWU.sprite.SpriteConfig, opts?: MoveOptions): Promise<GWU.xy.XY>;
declare function bolt(map: MapType, source: GWU.xy.XY | GWU.xy.Loc, target: GWU.xy.XY | GWU.xy.Loc, sprite: string | GWU.sprite.SpriteConfig, opts?: MoveOptions): Promise<GWU.xy.XY>;
interface ProjectileOptions extends MoveOptions {
}
declare function projectile(map: MapType, source: Actor, target: Actor, sprite: string | GWU.sprite.SpriteConfig, opts?: ProjectileOptions): Promise<GWU.xy.XY>;
interface BeamOptions {
    fade?: number;
    speed?: number;
    duration?: number;
    stopAtWalls?: boolean;
    stopBeforeWalls?: boolean;
    stepFn?: FxStepFn;
    animator?: GWU.tween.Animator;
}
declare function beam(map: MapType, from: GWU.xy.XY | GWU.xy.Loc, to: GWU.xy.XY | GWU.xy.Loc, sprite: string | GWU.sprite.SpriteConfig, opts?: BeamOptions): Promise<GWU.xy.XY>;
declare type ExplosionShape = 'o' | 'x' | 'X' | '+' | '*';
interface ExplosionOptions {
    speed?: number;
    duration?: number;
    fade?: number;
    shape?: ExplosionShape;
    center?: boolean;
    stepFn?: FxStepFn;
    animator?: GWU.tween.Animator;
}
declare function explosion(map: MapType, x: number, y: number, radius: number, sprite: string | GWU.sprite.SpriteConfig, opts?: ExplosionOptions): Promise<any>;

type fx_d_FxCallback = FxCallback;
type fx_d_FxStepFn = FxStepFn;
type fx_d_FxOptions = FxOptions;
type fx_d_SpriteFxOptions = SpriteFxOptions;
declare const fx_d_flashSprite: typeof flashSprite;
declare const fx_d_hit: typeof hit;
declare const fx_d_miss: typeof miss;
declare const fx_d_fadeInOut: typeof fadeInOut;
type fx_d_MoveOptions = MoveOptions;
declare const fx_d_moveSprite: typeof moveSprite;
declare const fx_d_bolt: typeof bolt;
type fx_d_ProjectileOptions = ProjectileOptions;
declare const fx_d_projectile: typeof projectile;
type fx_d_BeamOptions = BeamOptions;
declare const fx_d_beam: typeof beam;
type fx_d_ExplosionShape = ExplosionShape;
type fx_d_ExplosionOptions = ExplosionOptions;
declare const fx_d_explosion: typeof explosion;
declare namespace fx_d {
  export {
    fx_d_FxCallback as FxCallback,
    fx_d_FxStepFn as FxStepFn,
    fx_d_FxOptions as FxOptions,
    fx_d_SpriteFxOptions as SpriteFxOptions,
    fx_d_flashSprite as flashSprite,
    fx_d_hit as hit,
    fx_d_miss as miss,
    fx_d_fadeInOut as fadeInOut,
    fx_d_MoveOptions as MoveOptions,
    fx_d_moveSprite as moveSprite,
    fx_d_bolt as bolt,
    fx_d_ProjectileOptions as ProjectileOptions,
    fx_d_projectile as projectile,
    fx_d_BeamOptions as BeamOptions,
    fx_d_beam as beam,
    fx_d_ExplosionShape as ExplosionShape,
    fx_d_ExplosionOptions as ExplosionOptions,
    fx_d_explosion as explosion,
  };
}

export { index_d$3 as actor, index_d as draw, index_d$6 as effect, index_d$2 as entity, index_d$a as flags, fx_d as fx, index_d$1 as horde, index_d$9 as item, index_d$7 as layer, index_d$4 as map, index_d$5 as memory, path_d as path, index_d$8 as tile };
