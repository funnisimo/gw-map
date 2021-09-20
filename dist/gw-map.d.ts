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
    L_BLOCKED_BY_STAIRS,
    L_BLOCKS_SCENT,
    L_DIVIDES_LEVEL,
    L_WAYPOINT_BLOCKER,
    L_WALL_FLAGS,
    L_BLOCKS_EVERYTHING
}

declare enum Actor$1 {
    IS_PLAYER
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
    IMPREGNABLE,
    NEEDS_REDRAW,
    LIGHT_CHANGED,
    FOV_CHANGED,
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

type index_d$8_Depth = Depth;
declare const index_d$8_Depth: typeof Depth;
type index_d$8_DepthString = DepthString;
type index_d$8_TileMech = TileMech;
declare const index_d$8_TileMech: typeof TileMech;
type index_d$8_Effect = Effect;
declare const index_d$8_Effect: typeof Effect;
declare namespace index_d$8 {
  export {
    index_d$8_Depth as Depth,
    index_d$8_DepthString as DepthString,
    Entity$1 as Entity,
    Actor$1 as Actor,
    Item$1 as Item,
    Tile$1 as Tile,
    index_d$8_TileMech as TileMech,
    Cell$1 as Cell,
    Map$1 as Map,
    index_d$8_Effect as Effect,
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

interface TileFlags extends FlagType$1 {
    tile: number;
    tileMech: number;
}
interface NameConfig {
    article?: boolean | string;
    color?: boolean | string | GWU.color.ColorBase;
}
interface TileType {
    readonly id: string;
    readonly index: number;
    readonly flags: TileFlags;
    readonly dissipate: number;
    readonly effects: Record<string, string | EffectInfo>;
    readonly groundTile: string | null;
    hasEntityFlag(flag: number): boolean;
    hasTileFlag(flag: number): boolean;
    hasTileMechFlag(flag: number): boolean;
    hasAllEntityFlags(flag: number): boolean;
    hasAllTileFlags(flag: number): boolean;
    hasAllTileMechFlags(flag: number): boolean;
    hasEffect(name: string): boolean;
    getName(): string;
    getName(config: NameConfig): string;
    getName(article: string): string;
    getName(article: boolean): string;
    getDescription(): string;
    getFlavor(): string;
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
declare class Tile implements TileType {
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
    getName(config: NameConfig): string;
    getName(article: string): string;
    getName(article: boolean): string;
    getDescription(): string;
    getFlavor(): string;
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
declare function make$4(options: Partial<TileOptions>): Tile;
declare const tiles: Record<string, Tile>;
declare const all: Tile[];
declare function get$2(id: string | number | Tile): Tile;
declare function install$4(id: string, options: Partial<TileOptions>): Tile;
declare function install$4(id: string, base: string, options: Partial<TileOptions>): Tile;
declare function installAll$2(tiles: Record<string, Partial<TileOptions>>): void;

declare const flags: {
    Tile: typeof Tile$1;
    TileMech: typeof TileMech;
};

declare const index_d$7_flags: typeof flags;
type index_d$7_TileFlags = TileFlags;
type index_d$7_NameConfig = NameConfig;
type index_d$7_TileType = TileType;
type index_d$7_TileConfig = TileConfig;
type index_d$7_Tile = Tile;
declare const index_d$7_Tile: typeof Tile;
type index_d$7_TileOptions = TileOptions;
declare const index_d$7_tiles: typeof tiles;
declare const index_d$7_all: typeof all;
declare namespace index_d$7 {
  export {
    index_d$7_flags as flags,
    index_d$7_TileFlags as TileFlags,
    index_d$7_NameConfig as NameConfig,
    index_d$7_TileType as TileType,
    index_d$7_TileConfig as TileConfig,
    index_d$7_Tile as Tile,
    index_d$7_TileOptions as TileOptions,
    make$4 as make,
    index_d$7_tiles as tiles,
    index_d$7_all as all,
    get$2 as get,
    install$4 as install,
    installAll$2 as installAll,
  };
}

interface FlagType extends FlagType$1 {
    item: number;
}

declare class Item extends Entity {
    flags: FlagType;
    quantity: number;
    kind: ItemKind;
    next: Item | null;
    constructor(kind: ItemKind);
    itemFlags(): number;
    hasItemFlag(flag: number): boolean;
    hasAllItemFlags(flags: number): boolean;
}

interface KindOptions$2 extends KindOptions {
}
interface MakeOptions$2 extends MakeOptions {
}
declare class ItemKind extends EntityKind {
    constructor(config: KindOptions$2);
    make(options?: Partial<MakeOptions$2>): Item;
    init(item: Item, options?: Partial<MakeOptions$2>): void;
}

declare function make$3(id: string | ItemKind, makeOptions?: any): Item;
declare function makeRandom$1(opts: Partial<MatchOptions$2> | string, makeOptions?: any): Item;
declare function from$4(info: string | ItemKind | KindOptions$2, makeOptions?: any): Item;
declare const kinds$1: Record<string, ItemKind>;
declare function install$3(id: string, kind: ItemKind | KindOptions$2): ItemKind;
declare function get$1(id: string | ItemKind): ItemKind | null;
declare function makeKind$1(info: KindOptions$2): ItemKind;
interface MatchOptions$2 {
    tags: string | string[];
    forbidTags: string | string[];
    rng: GWU.rng.Random;
}
declare function randomKind$1(opts?: Partial<MatchOptions$2> | string): ItemKind | null;

type index_d$6_FlagType = FlagType;
type index_d$6_ItemKind = ItemKind;
declare const index_d$6_ItemKind: typeof ItemKind;
type index_d$6_Item = Item;
declare const index_d$6_Item: typeof Item;
declare namespace index_d$6 {
  export {
    index_d$6_FlagType as FlagType,
    KindOptions$2 as KindOptions,
    MakeOptions$2 as MakeOptions,
    index_d$6_ItemKind as ItemKind,
    index_d$6_Item as Item,
    make$3 as make,
    makeRandom$1 as makeRandom,
    from$4 as from,
    kinds$1 as kinds,
    install$3 as install,
    get$1 as get,
    makeKind$1 as makeKind,
    MatchOptions$2 as MatchOptions,
    randomKind$1 as randomKind,
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
    fire(config: EffectInfo, map: MapType, x: number, y: number, ctx: EffectCtx): Promise<boolean>;
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

type index_d$5_EffectInfo = EffectInfo;
type index_d$5_EffectCtx = EffectCtx;
type index_d$5_EffectConfig = EffectConfig;
type index_d$5_EffectBase = EffectBase;
type index_d$5_Handler = Handler;
declare const index_d$5_Handler: typeof Handler;
declare const index_d$5_handlers: typeof handlers;
declare const index_d$5_installHandler: typeof installHandler;
declare const index_d$5_reset: typeof reset;
declare const index_d$5_resetAll: typeof resetAll;
declare const index_d$5_effects: typeof effects;
declare const index_d$5_fire: typeof fire;
type index_d$5_EmitEffect = EmitEffect;
declare const index_d$5_EmitEffect: typeof EmitEffect;
type index_d$5_FnEffect = FnEffect;
declare const index_d$5_FnEffect: typeof FnEffect;
type index_d$5_MessageEffect = MessageEffect;
declare const index_d$5_MessageEffect: typeof MessageEffect;
type index_d$5_ActivateMachineEffect = ActivateMachineEffect;
declare const index_d$5_ActivateMachineEffect: typeof ActivateMachineEffect;
type index_d$5_EffectEffect = EffectEffect;
declare const index_d$5_EffectEffect: typeof EffectEffect;
type index_d$5_SpawnConfig = SpawnConfig;
type index_d$5_SpawnInfo = SpawnInfo;
type index_d$5_SpawnEffect = SpawnEffect;
declare const index_d$5_SpawnEffect: typeof SpawnEffect;
declare const index_d$5_spawnTiles: typeof spawnTiles;
declare const index_d$5_computeSpawnMap: typeof computeSpawnMap;
declare const index_d$5_clearCells: typeof clearCells;
declare const index_d$5_evacuateCreatures: typeof evacuateCreatures;
declare const index_d$5_evacuateItems: typeof evacuateItems;
declare namespace index_d$5 {
  export {
    index_d$5_EffectInfo as EffectInfo,
    index_d$5_EffectCtx as EffectCtx,
    index_d$5_EffectConfig as EffectConfig,
    index_d$5_EffectBase as EffectBase,
    index_d$5_Handler as Handler,
    index_d$5_handlers as handlers,
    index_d$5_installHandler as installHandler,
    make$2 as make,
    from$3 as from,
    index_d$5_reset as reset,
    index_d$5_resetAll as resetAll,
    index_d$5_effects as effects,
    install$2 as install,
    installAll$1 as installAll,
    index_d$5_fire as fire,
    index_d$5_EmitEffect as EmitEffect,
    index_d$5_FnEffect as FnEffect,
    index_d$5_MessageEffect as MessageEffect,
    index_d$5_ActivateMachineEffect as ActivateMachineEffect,
    index_d$5_EffectEffect as EffectEffect,
    index_d$5_SpawnConfig as SpawnConfig,
    index_d$5_SpawnInfo as SpawnInfo,
    index_d$5_SpawnEffect as SpawnEffect,
    index_d$5_spawnTiles as spawnTiles,
    index_d$5_computeSpawnMap as computeSpawnMap,
    index_d$5_clearCells as clearCells,
    index_d$5_evacuateCreatures as evacuateCreatures,
    index_d$5_evacuateItems as evacuateItems,
  };
}

declare type TileData = Tile | null;
declare type TileArray = [Tile, ...TileData[]];
declare type EachCb<T> = (t: T) => any;
declare type MatchCb<T> = (t: T) => boolean;
declare type ReduceCb<T> = (out: any, t: T) => any;
declare class CellObjects {
    cell: Cell;
    constructor(cell: Cell);
    eachItem(cb: EachCb<Item>): void;
    eachActor(cb: EachCb<Actor>): void;
    forEach(cb: EachCb<Entity>): void;
    some(cb: MatchCb<Entity>): boolean;
    reduce(cb: ReduceCb<Entity>, start?: any): any;
}
declare class Cell implements CellType {
    flags: CellFlags;
    chokeCount: number;
    tiles: TileArray;
    machineId: number;
    _actor: Actor | null;
    _item: Item | null;
    _objects: CellObjects;
    map: MapType;
    x: number;
    y: number;
    constructor(map: MapType, x: number, y: number, groundTile?: number | string | Tile);
    copy(other: Cell): void;
    hasCellFlag(flag: number): boolean;
    setCellFlag(flag: number): void;
    clearCellFlag(flag: number): void;
    hasEntityFlag(flag: number): boolean;
    hasAllEntityFlags(flags: number): boolean;
    hasTileFlag(flag: number): boolean;
    hasAllTileFlags(flags: number): boolean;
    hasTileMechFlag(flag: number): boolean;
    hasAllTileMechFlags(flags: number): boolean;
    hasTileTag(tag: string): boolean;
    hasAllTileTags(tags: string[]): boolean;
    hasAnyTileTag(tags: string[]): boolean;
    cellFlags(): number;
    entityFlags(): number;
    tileFlags(): number;
    tileMechFlags(): number;
    itemFlags(): number;
    actorFlags(): number;
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
    isEmpty(): boolean;
    isPassable(): boolean;
    isWall(): boolean;
    isStairs(): boolean;
    isFloor(): boolean;
    isGateSite(): boolean;
    isSecretlyPassable(): boolean;
    setTile(tile: string | number | Tile): boolean;
    clearTiles(tile: string | number | Tile): void;
    clear(tile?: number | string | Tile): void;
    clearDepth(depth: Depth): boolean;
    clearDepthsWithFlags(tileFlag: number, tileMechFlag?: number): void;
    eachGlowLight(cb: (light: GWU.light.LightType) => any): void;
    fire(event: string, map: MapType, x: number, y: number, ctx?: Partial<EffectCtx>): Promise<boolean>;
    _activate(effect: string | EffectInfo, map: MapType, x: number, y: number, ctx: Partial<EffectCtx>): Promise<boolean>;
    hasEffect(name: string): boolean;
    hasItem(): boolean;
    get item(): Item | null;
    set item(val: Item | null);
    hasActor(): boolean;
    hasPlayer(): boolean;
    get actor(): Actor | null;
    set actor(val: Actor | null);
    getDescription(): string;
    getFlavor(): string;
    getName(opts?: {}): string;
    dump(): string;
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
    setTile(_x: number, _y: number, _tile: Tile): boolean;
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
    putAppearance(dest: GWU.sprite.Mixer, x: number, y: number): void;
}

declare class ActorLayer extends MapLayer {
    constructor(map: MapType, name?: string);
    addActor(x: number, y: number, obj: Actor, _opts?: any): Promise<boolean>;
    forceActor(x: number, y: number, actor: Actor, _opts?: any): boolean;
    removeActor(actor: Actor): Promise<boolean>;
    putAppearance(dest: GWU.sprite.Mixer, x: number, y: number): void;
}

declare class ItemLayer extends MapLayer {
    constructor(map: MapType, name?: string);
    addItem(x: number, y: number, obj: Item, _opts?: any): Promise<boolean>;
    forceItem(x: number, y: number, obj: Item, _opts?: any): boolean;
    removeItem(obj: Item): Promise<boolean>;
    putAppearance(dest: GWU.sprite.Mixer, x: number, y: number): void;
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
    putAppearance(dest: GWU.sprite.Mixer, x: number, y: number): void;
}

declare class FireLayer extends TileLayer {
    constructor(map: MapType, name?: string);
    tick(_dt: number): Promise<boolean>;
    exposeToFire(x: number, y: number, alwaysIgnite?: boolean): Promise<boolean>;
}

type index_d$4_MapLayer = MapLayer;
declare const index_d$4_MapLayer: typeof MapLayer;
type index_d$4_TileLayer = TileLayer;
declare const index_d$4_TileLayer: typeof TileLayer;
type index_d$4_ActorLayer = ActorLayer;
declare const index_d$4_ActorLayer: typeof ActorLayer;
type index_d$4_ItemLayer = ItemLayer;
declare const index_d$4_ItemLayer: typeof ItemLayer;
type index_d$4_GasLayer = GasLayer;
declare const index_d$4_GasLayer: typeof GasLayer;
type index_d$4_FireLayer = FireLayer;
declare const index_d$4_FireLayer: typeof FireLayer;
declare namespace index_d$4 {
  export {
    index_d$4_MapLayer as MapLayer,
    index_d$4_TileLayer as TileLayer,
    index_d$4_ActorLayer as ActorLayer,
    index_d$4_ItemLayer as ItemLayer,
    index_d$4_GasLayer as GasLayer,
    index_d$4_FireLayer as FireLayer,
  };
}

declare class CellMemory implements CellInfoType {
    chokeCount: number;
    machineId: number;
    keyId: number;
    flags: {
        cell: number;
        item: number;
        actor: number;
        tile: number;
        tileMech: number;
        object: number;
    };
    blocks: {
        vision: boolean;
        effects: boolean;
        move: boolean;
        pathing: boolean;
    };
    _tile: Tile;
    _item: Item | null;
    _actor: Actor | null;
    _hasKey: boolean;
    snapshot: GWU.sprite.Mixer;
    constructor();
    clear(): void;
    store(cell: CellInfoType): void;
    getSnapshot(dest: GWU.sprite.Mixer): void;
    putSnapshot(src: GWU.sprite.Mixer): void;
    get needsRedraw(): boolean;
    hasCellFlag(flag: number): boolean;
    hasTileFlag(flag: number): boolean;
    hasAllTileFlags(flags: number): boolean;
    hasEntityFlag(flag: number): boolean;
    hasAllEntityFlags(flags: number): boolean;
    hasTileMechFlag(flag: number): boolean;
    cellFlags(): number;
    entityFlags(): number;
    tileFlags(): number;
    tileMechFlags(): number;
    itemFlags(): number;
    actorFlags(): number;
    blocksVision(): boolean;
    blocksPathing(): boolean;
    blocksMove(): boolean;
    blocksEffects(): boolean;
    isWall(): boolean;
    isStairs(): boolean;
    isFloor(): boolean;
    isPassable(): boolean;
    isSecretlyPassable(): boolean;
    get tile(): Tile;
    hasTile(tile: string | number | Tile): boolean;
    hasItem(): boolean;
    get item(): Item | null;
    hasActor(): boolean;
    hasPlayer(): boolean;
    get actor(): Actor | null;
    getDescription(): string;
    getFlavor(): string;
    getName(_opts: any): string;
}

interface MapOptions extends GWU.light.LightSystemOptions, GWU.fov.FovSystemOptions {
    tile: string | true;
    boundary: string | true;
    seed: number;
}
declare type LayerType = TileLayer | ActorLayer | ItemLayer;
interface MapDrawOptions {
    x: number;
    y: number;
    width: number;
    height: number;
    mapOffsetX: number;
    mapOffsetY: number;
    force: boolean;
}
declare class Map implements GWU.light.LightSystemSite, GWU.fov.FovSite, MapType {
    width: number;
    height: number;
    cells: GWU.grid.Grid<Cell>;
    layers: LayerType[];
    flags: {
        map: 0;
    };
    light: GWU.light.LightSystemType;
    fov: GWU.fov.FovSystemType;
    properties: Record<string, any>;
    memory: GWU.grid.Grid<CellMemory>;
    machineCount: number;
    private _seed;
    rng: GWU.rng.Random;
    constructor(width: number, height: number, opts?: Partial<MapOptions>);
    get seed(): number;
    set seed(v: number);
    cellInfo(x: number, y: number, useMemory?: boolean): CellInfoType;
    initLayers(): void;
    addLayer(depth: number | keyof typeof Depth, layer: LayerType): void;
    removeLayer(depth: number | keyof typeof Depth): void;
    getLayer(depth: number | keyof typeof Depth): LayerType | null;
    hasXY(x: number, y: number): boolean;
    isBoundaryXY(x: number, y: number): boolean;
    cell(x: number, y: number): CellType;
    get(x: number, y: number): Cell | undefined;
    eachCell(cb: EachCellCb): void;
    drawInto(dest: GWU.canvas.Canvas | GWU.canvas.DataBuffer, opts?: Partial<MapDrawOptions> | boolean): void;
    hasItem(x: number, y: number): boolean;
    itemAt(x: number, y: number): Item | null;
    eachItem(cb: GWU.types.EachCb<Item>): void;
    addItem(x: number, y: number, item: Item): Promise<boolean>;
    forceItem(x: number, y: number, item: Item): boolean;
    removeItem(item: Item): Promise<boolean>;
    moveItem(x: number, y: number, item: Item): Promise<boolean>;
    hasPlayer(x: number, y: number): boolean;
    actorAt(x: number, y: number): Actor | null;
    eachActor(cb: GWU.types.EachCb<Actor>): void;
    addActor(x: number, y: number, actor: Actor): Promise<boolean>;
    forceActor(x: number, y: number, actor: Actor): boolean;
    removeActor(actor: Actor): Promise<boolean>;
    moveActor(x: number, y: number, actor: Actor): Promise<boolean>;
    isVisible(x: number, y: number): boolean;
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
    hasTile(x: number, y: number, tile: string | number | Tile, useMemory?: boolean): boolean;
    forceTile(x: number, y: number, tile: string | number | Tile): boolean;
    setTile(x: number, y: number, tile: string | number | Tile, opts?: SetTileOptions): boolean;
    clearTiles(x: number, y: number, tile?: number | string | Tile): void;
    tick(dt: number): Promise<boolean>;
    copy(src: Map): void;
    clone(): Map;
    fire(event: string, x: number, y: number, ctx?: Partial<EffectCtx>): Promise<boolean>;
    fireAll(event: string, ctx?: Partial<EffectCtx>): Promise<boolean>;
    activateMachine(machineId: number, originX: number, originY: number, ctx?: Partial<EffectCtx>): Promise<boolean>;
    getAppearanceAt(x: number, y: number, dest: GWU.sprite.Mixer): void;
    hasActor(x: number, y: number): boolean;
    eachGlowLight(cb: GWU.light.LightCb): void;
    eachDynamicLight(_cb: GWU.light.LightCb): void;
    eachViewport(_cb: GWU.fov.ViewportCb): void;
    lightingChanged(): boolean;
    hasVisibleLight(x: number, y: number): boolean;
    blocksVision(x: number, y: number): boolean;
    onCellRevealed(_x: number, _y: number): void;
    redrawCell(x: number, y: number, clearMemory?: boolean): void;
    clearMemory(x: number, y: number): void;
    storeMemory(x: number, y: number): void;
}
declare function make$1(w: number, h: number, floor?: string, boundary?: string): Map;
declare function make$1(w: number, h: number, floor: string): Map;
declare function make$1(w: number, h: number, opts: Partial<MapOptions>): Map;
declare function from$2(prefab: string | string[] | GWU.grid.NumGrid, charToTile: Record<string, string | null>, opts?: Partial<MapOptions>): Map;

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
    fovVersion: number;
    free: Snapshot[];
    constructor(map: Map);
    takeNew(): Snapshot;
    revertMapTo(snap: Snapshot): void;
    release(snap: Snapshot): void;
}

declare function isHallway(map: Map, x: number, y: number): boolean;

type index_d$3_CellFlags = CellFlags;
type index_d$3_MapFlags = MapFlags;
type index_d$3_SetOptions = SetOptions;
type index_d$3_SetTileOptions = SetTileOptions;
type index_d$3_CellInfoType = CellInfoType;
type index_d$3_CellType = CellType;
type index_d$3_EachCellCb = EachCellCb;
type index_d$3_EachItemCb = EachItemCb;
type index_d$3_EachActorCb = EachActorCb;
type index_d$3_MapTestFn = MapTestFn;
type index_d$3_MapType = MapType;
type index_d$3_Cell = Cell;
declare const index_d$3_Cell: typeof Cell;
type index_d$3_MapOptions = MapOptions;
type index_d$3_LayerType = LayerType;
type index_d$3_MapDrawOptions = MapDrawOptions;
type index_d$3_Map = Map;
declare const index_d$3_Map: typeof Map;
declare const index_d$3_analyze: typeof analyze;
declare const index_d$3_updateChokepoints: typeof updateChokepoints;
declare const index_d$3_floodFillCount: typeof floodFillCount;
declare const index_d$3_updateLoopiness: typeof updateLoopiness;
declare const index_d$3_resetLoopiness: typeof resetLoopiness;
declare const index_d$3_checkLoopiness: typeof checkLoopiness;
declare const index_d$3_fillInnerLoopGrid: typeof fillInnerLoopGrid;
declare const index_d$3_cleanLoopiness: typeof cleanLoopiness;
type index_d$3_CellMemory = CellMemory;
declare const index_d$3_CellMemory: typeof CellMemory;
type index_d$3_Snapshot = Snapshot;
declare const index_d$3_Snapshot: typeof Snapshot;
type index_d$3_SnapshotManager = SnapshotManager;
declare const index_d$3_SnapshotManager: typeof SnapshotManager;
declare const index_d$3_isHallway: typeof isHallway;
declare namespace index_d$3 {
  export {
    index_d$3_CellFlags as CellFlags,
    index_d$3_MapFlags as MapFlags,
    index_d$3_SetOptions as SetOptions,
    index_d$3_SetTileOptions as SetTileOptions,
    index_d$3_CellInfoType as CellInfoType,
    index_d$3_CellType as CellType,
    index_d$3_EachCellCb as EachCellCb,
    index_d$3_EachItemCb as EachItemCb,
    index_d$3_EachActorCb as EachActorCb,
    index_d$3_MapTestFn as MapTestFn,
    index_d$3_MapType as MapType,
    index_d$3_Cell as Cell,
    index_d$3_MapOptions as MapOptions,
    index_d$3_LayerType as LayerType,
    index_d$3_MapDrawOptions as MapDrawOptions,
    index_d$3_Map as Map,
    make$1 as make,
    from$2 as from,
    index_d$3_analyze as analyze,
    index_d$3_updateChokepoints as updateChokepoints,
    index_d$3_floodFillCount as floodFillCount,
    index_d$3_updateLoopiness as updateLoopiness,
    index_d$3_resetLoopiness as resetLoopiness,
    index_d$3_checkLoopiness as checkLoopiness,
    index_d$3_fillInnerLoopGrid as fillInnerLoopGrid,
    index_d$3_cleanLoopiness as cleanLoopiness,
    index_d$3_CellMemory as CellMemory,
    index_d$3_Snapshot as Snapshot,
    index_d$3_SnapshotManager as SnapshotManager,
    index_d$3_isHallway as isHallway,
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
    constructor(kind: ActorKind);
    hasActorFlag(flag: number): boolean;
    hasAllActorFlags(flags: number): boolean;
    actorFlags(): number;
    isPlayer(): boolean;
    pickupItem(item: Item, opts?: Partial<PickupOptions>): Promise<boolean>;
    dropItem(item: Item, opts?: Partial<DropOptions>): Promise<boolean>;
}

interface KindOptions$1 extends KindOptions {
}
interface MakeOptions$1 extends MakeOptions {
}
declare class ActorKind extends EntityKind {
    constructor(opts: KindOptions$1);
    make(options?: Partial<MakeOptions$1>): Actor;
    init(actor: Actor, options?: Partial<MakeOptions$1>): void;
    forbidsCell(cell: CellType, actor?: Actor): boolean;
    avoidsCell(cell: CellType, actor?: Actor): boolean;
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

type index_d$2_ActorFlags = ActorFlags;
type index_d$2_ActorKind = ActorKind;
declare const index_d$2_ActorKind: typeof ActorKind;
type index_d$2_PickupOptions = PickupOptions;
type index_d$2_DropOptions = DropOptions;
type index_d$2_Actor = Actor;
declare const index_d$2_Actor: typeof Actor;
declare const index_d$2_make: typeof make;
declare const index_d$2_makeRandom: typeof makeRandom;
declare const index_d$2_kinds: typeof kinds;
declare const index_d$2_get: typeof get;
declare const index_d$2_makeKind: typeof makeKind;
declare const index_d$2_randomKind: typeof randomKind;
declare namespace index_d$2 {
  export {
    index_d$2_ActorFlags as ActorFlags,
    KindOptions$1 as KindOptions,
    MakeOptions$1 as MakeOptions,
    index_d$2_ActorKind as ActorKind,
    index_d$2_PickupOptions as PickupOptions,
    index_d$2_DropOptions as DropOptions,
    index_d$2_Actor as Actor,
    index_d$2_make as make,
    index_d$2_makeRandom as makeRandom,
    from$1 as from,
    index_d$2_kinds as kinds,
    install$1 as install,
    index_d$2_get as get,
    index_d$2_makeKind as makeKind,
    MatchOptions$1 as MatchOptions,
    index_d$2_randomKind as randomKind,
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
interface CellInfoType {
    chokeCount: number;
    machineId: number;
    readonly needsRedraw: boolean;
    hasCellFlag(flag: number): boolean;
    hasTileFlag(flag: number): boolean;
    hasAllTileFlags(flags: number): boolean;
    hasEntityFlag(flag: number): boolean;
    hasAllEntityFlags(flags: number): boolean;
    hasTileMechFlag(flag: number): boolean;
    cellFlags(): number;
    entityFlags(): number;
    tileFlags(): number;
    tileMechFlags(): number;
    itemFlags(): number;
    actorFlags(): number;
    blocksVision(): boolean;
    blocksPathing(): boolean;
    blocksMove(): boolean;
    blocksEffects(): boolean;
    isWall(): boolean;
    isStairs(): boolean;
    isFloor(): boolean;
    isPassable(): boolean;
    isSecretlyPassable(): boolean;
    readonly tile: Tile;
    hasTile(tile: string | number | Tile): boolean;
    hasItem(): boolean;
    readonly item: Item | null;
    hasActor(): boolean;
    hasPlayer(): boolean;
    readonly actor: Actor | null;
    getDescription(): string;
    getFlavor(): string;
    getName(opts: any): string;
}
interface CellType extends CellInfoType {
    flags: CellFlags;
    actor: Actor | null;
    item: Item | null;
    setCellFlag(flag: number): void;
    clearCellFlag(flag: number): void;
    depthPriority(depth: number): number;
    highestPriority(): number;
    depthTile(depth: number): Tile | null;
    blocksLayer(depth: number): boolean;
    eachTile(cb: GWU.types.EachCb<Tile>): void;
    setTile(tile: Tile): boolean;
    clear(tile?: number | string | Tile): void;
    clearDepth(depth: number): boolean;
    hasDepthTile(depth: number): boolean;
    highestPriorityTile(): Tile;
    hasTileTag(tag: string): boolean;
    hasAllTileTags(tags: string[]): boolean;
    hasAnyTileTag(tags: string[]): boolean;
    clearTiles(tile?: string | number | Tile): void;
    isEmpty(): boolean;
    isGateSite(): boolean;
    eachGlowLight(cb: (light: GWU.light.LightType) => any): void;
    fire(event: string, map: MapType, x: number, y: number, ctx?: Partial<EffectCtx>): Promise<boolean> | boolean;
    hasEffect(name: string): boolean;
    copy(other: CellType): void;
    needsRedraw: boolean;
    readonly changed: boolean;
}
declare type EachCellCb = (cell: CellType, x: number, y: number, map: MapType) => any;
declare type EachItemCb = (item: Item) => any;
declare type EachActorCb = (actor: Actor) => any;
declare type MapTestFn = (cell: CellType, x: number, y: number, map: MapType) => boolean;
interface MapType {
    readonly width: number;
    readonly height: number;
    readonly rng: GWU.rng.Random;
    light: GWU.light.LightSystemType;
    fov: GWU.fov.FovSystemType;
    properties: Record<string, any>;
    hasXY(x: number, y: number): boolean;
    isBoundaryXY(x: number, y: number): boolean;
    cellInfo(x: number, y: number, useMemory?: boolean): CellInfoType;
    cell(x: number, y: number): CellType;
    get(x: number, y: number): CellType | undefined;
    eachCell(cb: EachCellCb): void;
    eachItem(cb: EachItemCb): void;
    addItem(x: number, y: number, actor: Item): Promise<boolean>;
    forceItem(x: number, y: number, actor: Item): boolean;
    removeItem(actor: Item): Promise<boolean>;
    moveItem(x: number, y: number, item: Item): Promise<boolean>;
    eachActor(cb: EachActorCb): void;
    addActor(x: number, y: number, actor: Actor): Promise<boolean>;
    removeActor(actor: Actor): Promise<boolean>;
    moveActor(x: number, y: number, actor: Actor): Promise<boolean>;
    isVisible(x: number, y: number): boolean;
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
    map: MapType | null;
    kind: EntityKind;
    key: KeyInfoType | null;
    machineHome: number;
    constructor(kind: EntityKind);
    get sprite(): GWU.sprite.Sprite;
    get isDestroyed(): boolean;
    destroy(): void;
    hasEntityFlag(flag: number): boolean;
    hasAllEntityFlags(flags: number): boolean;
    hasTag(tag: string): boolean;
    blocksMove(): boolean;
    blocksVision(): boolean;
    blocksPathing(): boolean;
    blocksEffects(): boolean;
    forbidsCell(cell: CellType): boolean;
    avoidsCell(cell: CellType): boolean;
    getName(): string;
    getDescription(): string;
    getFlavor(): string;
    getVerb(verb: string): string;
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
    forbidsCell(cell: CellType, _entity?: Entity): boolean;
    avoidsCell(cell: CellType, _entity?: Entity): boolean;
    getName(_entity: Entity): string;
    getDescription(_entity: Entity): string;
    getFlavor(_entity: Entity): string;
    getVerb(_entity: Entity, verb: string): string;
}

type index_d$1_KeyInfoType = KeyInfoType;
type index_d$1_EntityType = EntityType;
type index_d$1_KeyInfo = KeyInfo;
declare const index_d$1_KeyInfo: typeof KeyInfo;
declare const index_d$1_makeKeyInfo: typeof makeKeyInfo;
type index_d$1_KindOptions = KindOptions;
type index_d$1_MakeOptions = MakeOptions;
type index_d$1_EntityKind = EntityKind;
declare const index_d$1_EntityKind: typeof EntityKind;
type index_d$1_Entity = Entity;
declare const index_d$1_Entity: typeof Entity;
declare namespace index_d$1 {
  export {
    index_d$1_KeyInfoType as KeyInfoType,
    FlagType$1 as FlagType,
    index_d$1_EntityType as EntityType,
    index_d$1_KeyInfo as KeyInfo,
    index_d$1_makeKeyInfo as makeKeyInfo,
    index_d$1_KindOptions as KindOptions,
    index_d$1_MakeOptions as MakeOptions,
    index_d$1_EntityKind as EntityKind,
    index_d$1_Entity as Entity,
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
    canBeVisible: boolean;
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
    spawn(map: Map, x?: number, y?: number, opts?: Partial<SpawnOptions> | boolean): Promise<Actor | null>;
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

type index_d_HordeConfig = HordeConfig;
type index_d_HordeFlagsType = HordeFlagsType;
type index_d_SpawnOptions = SpawnOptions;
type index_d_Horde = Horde;
declare const index_d_Horde: typeof Horde;
declare const index_d_hordes: typeof hordes;
declare const index_d_install: typeof install;
declare const index_d_installAll: typeof installAll;
declare const index_d_from: typeof from;
type index_d_MatchOptions = MatchOptions;
declare const index_d_random: typeof random;
declare namespace index_d {
  export {
    index_d_HordeConfig as HordeConfig,
    index_d_HordeFlagsType as HordeFlagsType,
    index_d_SpawnOptions as SpawnOptions,
    index_d_Horde as Horde,
    index_d_hordes as hordes,
    index_d_install as install,
    index_d_installAll as installAll,
    index_d_from as from,
    index_d_MatchOptions as MatchOptions,
    index_d_random as random,
  };
}

export { index_d$2 as actor, index_d$5 as effect, index_d$1 as entity, index_d$8 as flags, index_d as horde, index_d$6 as item, index_d$4 as layer, index_d$3 as map, path_d as path, index_d$7 as tile };
