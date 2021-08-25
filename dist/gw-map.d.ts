import * as GWU from 'gw-utils';

declare enum GameObject$1 {
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
    L_WALL_FLAGS,
    L_BLOCKS_EVERYTHING
}
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

type flags_d$1_Depth = Depth;
declare const flags_d$1_Depth: typeof Depth;
type flags_d$1_DepthString = DepthString;
declare namespace flags_d$1 {
  export {
    GameObject$1 as GameObject,
    flags_d$1_Depth as Depth,
    flags_d$1_DepthString as DepthString,
  };
}

interface ObjectFlags {
    object: number;
}
interface ObjectType extends GWU.utils.Chainable<ObjectType>, GWU.utils.XY {
    sprite: GWU.sprite.Sprite;
    depth: number;
    light: GWU.light.LightType | null;
    flags: ObjectFlags;
}

declare class GameObject implements ObjectType {
    sprite: GWU.sprite.Sprite;
    depth: number;
    light: GWU.light.LightType | null;
    flags: ObjectFlags;
    next: GameObject | null;
    x: number;
    y: number;
    constructor();
    hasObjectFlag(flag: number): boolean;
    hasAllObjectFlags(flags: number): boolean;
    blocksMove(): boolean;
    blocksVision(): boolean;
    blocksPathing(): boolean;
    blocksEffects(): boolean;
    itemFlags(): number;
    actorFlags(): number;
}

type index_d$5_ObjectFlags = ObjectFlags;
type index_d$5_ObjectType = ObjectType;
type index_d$5_GameObject = GameObject;
declare const index_d$5_GameObject: typeof GameObject;
declare namespace index_d$5 {
  export {
    flags_d$1 as flags,
    index_d$5_ObjectFlags as ObjectFlags,
    index_d$5_ObjectType as ObjectType,
    index_d$5_GameObject as GameObject,
  };
}

interface ActorFlags extends ObjectFlags {
    actor: number;
}

interface ItemFlags extends ObjectFlags {
    item: number;
}

declare class Item extends GameObject {
    flags: ItemFlags;
    quantity: number;
    next: Item | null;
    constructor();
    itemFlags(): number;
    hasItemFlag(flag: number): boolean;
    hasAllItemFlags(flags: number): boolean;
    forbidsCell(_cell: CellType): boolean;
}

type index_d$4_Item = Item;
declare const index_d$4_Item: typeof Item;
type index_d$4_ItemFlags = ItemFlags;
declare namespace index_d$4 {
  export {
    index_d$4_Item as Item,
    index_d$4_ItemFlags as ItemFlags,
  };
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

interface TileFlags extends ObjectFlags {
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
    hasObjectFlag(flag: number): boolean;
    hasTileFlag(flag: number): boolean;
    hasTileMechFlag(flag: number): boolean;
    hasAllObjectFlags(flag: number): boolean;
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

interface EffectHandler {
    make: (src: Partial<EffectConfig>, dest: EffectInfo) => boolean;
    fire: (config: EffectInfo, map: MapType, x: number, y: number, ctx: EffectCtx) => boolean | Promise<boolean>;
    fireSync: (config: EffectInfo, map: MapType, x: number, y: number, ctx: EffectCtx) => boolean;
}

declare function reset(effect: EffectInfo): void;
declare function resetAll(): void;
declare const effects: Record<string, EffectInfo>;
declare function install$1(id: string, config: Partial<EffectConfig>): EffectInfo;
declare function installAll$1(effects: Record<string, Partial<EffectConfig>>): void;
declare const handlers: Record<string, EffectHandler>;
declare function installHandler(id: string, handler: EffectHandler): void;

declare function make$2(opts: EffectBase): EffectInfo;
declare function from$1(opts: EffectBase | string): EffectInfo;

declare function fire(effect: EffectInfo | string, map: MapType, x: number, y: number, ctx_?: Partial<EffectCtx>): Promise<boolean>;
declare function fireSync(effect: EffectInfo | string, map: MapType, x: number, y: number, ctx_?: Partial<EffectCtx>): boolean;

declare class MessageEffect implements EffectHandler {
    make(src: Partial<EffectConfig>, dest: EffectInfo): boolean;
    fire(config: EffectInfo, map: MapType, x: number, y: number, ctx: EffectCtx): Promise<boolean>;
    fireSync(config: EffectInfo, _map: MapType, _x: number, _y: number, _ctx: EffectCtx): boolean;
}

declare class EmitEffect implements EffectHandler {
    make(src: Partial<EffectConfig>, dest: EffectInfo): boolean;
    fire(config: any, _map: MapType, x: number, y: number, ctx: EffectCtx): Promise<boolean>;
    fireSync(config: EffectInfo, _map: MapType, _x: number, _y: number, _ctx: EffectCtx): boolean;
}

declare class FnEffect implements EffectHandler {
    make(src: Partial<EffectConfig>, dest: EffectInfo): boolean;
    fire(config: any, map: MapType, x: number, y: number, ctx: Partial<EffectCtx>): Promise<any>;
    fireSync(config: any, map: MapType, x: number, y: number, ctx: Partial<EffectCtx>): any;
}

declare class ActivateMachineEffect implements EffectHandler {
    make(src: Partial<EffectConfig>, dest: EffectInfo): boolean;
    fire(config: any, map: MapType, x: number, y: number, ctx: Partial<EffectCtx>): Promise<boolean>;
    fireSync(config: any, map: MapType, x: number, y: number, ctx: Partial<EffectCtx>): boolean;
}

type index_d$3_EffectInfo = EffectInfo;
type index_d$3_EffectCtx = EffectCtx;
type index_d$3_EffectConfig = EffectConfig;
type index_d$3_EffectBase = EffectBase;
type index_d$3_EffectHandler = EffectHandler;
declare const index_d$3_reset: typeof reset;
declare const index_d$3_resetAll: typeof resetAll;
declare const index_d$3_effects: typeof effects;
declare const index_d$3_handlers: typeof handlers;
declare const index_d$3_installHandler: typeof installHandler;
declare const index_d$3_fire: typeof fire;
declare const index_d$3_fireSync: typeof fireSync;
type index_d$3_MessageEffect = MessageEffect;
declare const index_d$3_MessageEffect: typeof MessageEffect;
type index_d$3_EmitEffect = EmitEffect;
declare const index_d$3_EmitEffect: typeof EmitEffect;
type index_d$3_FnEffect = FnEffect;
declare const index_d$3_FnEffect: typeof FnEffect;
type index_d$3_ActivateMachineEffect = ActivateMachineEffect;
declare const index_d$3_ActivateMachineEffect: typeof ActivateMachineEffect;
declare namespace index_d$3 {
  export {
    Effect as Flags,
    index_d$3_EffectInfo as EffectInfo,
    index_d$3_EffectCtx as EffectCtx,
    index_d$3_EffectConfig as EffectConfig,
    index_d$3_EffectBase as EffectBase,
    index_d$3_EffectHandler as EffectHandler,
    index_d$3_reset as reset,
    index_d$3_resetAll as resetAll,
    index_d$3_effects as effects,
    install$1 as install,
    installAll$1 as installAll,
    index_d$3_handlers as handlers,
    index_d$3_installHandler as installHandler,
    make$2 as make,
    from$1 as from,
    index_d$3_fire as fire,
    index_d$3_fireSync as fireSync,
    index_d$3_MessageEffect as MessageEffect,
    index_d$3_EmitEffect as EmitEffect,
    index_d$3_FnEffect as FnEffect,
    index_d$3_ActivateMachineEffect as ActivateMachineEffect,
  };
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
    name: string;
    description: string;
    flavor: string;
    article: string | null;
    constructor(config: Partial<TileConfig>);
    hasObjectFlag(flag: number): boolean;
    hasTileFlag(flag: number): boolean;
    hasTileMechFlag(flag: number): boolean;
    hasAllObjectFlags(flag: number): boolean;
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
}
declare function make$1(options: Partial<TileOptions>): Tile;
declare const tiles: Record<string, Tile>;
declare const all: Tile[];
declare function get(id: string | number | Tile): Tile;
declare function install(id: string, options: Partial<TileOptions>): Tile;
declare function install(id: string, base: string, options: Partial<TileOptions>): Tile;
declare function installAll(tiles: Record<string, Partial<TileOptions>>): void;

declare const flags$1: {
    Tile: typeof Tile$1;
    TileMech: typeof TileMech;
};

type index_d$2_TileFlags = TileFlags;
type index_d$2_NameConfig = NameConfig;
type index_d$2_TileType = TileType;
type index_d$2_TileConfig = TileConfig;
type index_d$2_Tile = Tile;
declare const index_d$2_Tile: typeof Tile;
type index_d$2_TileOptions = TileOptions;
declare const index_d$2_tiles: typeof tiles;
declare const index_d$2_all: typeof all;
declare const index_d$2_get: typeof get;
declare const index_d$2_install: typeof install;
declare const index_d$2_installAll: typeof installAll;
declare namespace index_d$2 {
  export {
    flags$1 as flags,
    index_d$2_TileFlags as TileFlags,
    index_d$2_NameConfig as NameConfig,
    index_d$2_TileType as TileType,
    index_d$2_TileConfig as TileConfig,
    index_d$2_Tile as Tile,
    index_d$2_TileOptions as TileOptions,
    make$1 as make,
    index_d$2_tiles as tiles,
    index_d$2_all as all,
    index_d$2_get as get,
    index_d$2_install as install,
    index_d$2_installAll as installAll,
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
    hasCellFlag(flag: number): boolean;
    hasTileFlag(flag: number): boolean;
    hasAllTileFlags(flags: number): boolean;
    hasObjectFlag(flag: number): boolean;
    hasAllObjectFlags(flags: number): boolean;
    hasTileMechFlag(flag: number): boolean;
    cellFlags(): number;
    objectFlags(): number;
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
    hasKey(): boolean;
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
    setCellFlag(flag: number): void;
    clearCellFlag(flag: number): void;
    depthPriority(depth: number): number;
    highestPriority(): number;
    depthTile(depth: number): Tile | null;
    blocksLayer(depth: number): boolean;
    eachTile(cb: GWU.types.EachCb<Tile>): void;
    isPassable(): boolean;
    setTile(tile: Tile): boolean;
    clear(): void;
    clearDepth(depth: number): boolean;
    hasTile(tile?: string | number | Tile): boolean;
    hasDepthTile(depth: number): boolean;
    highestPriorityTile(): Tile;
    isEmpty(): boolean;
    isWall(): boolean;
    eachGlowLight(cb: (light: GWU.light.LightType) => any): void;
    activate(event: string, map: MapType, x: number, y: number, ctx?: Partial<EffectCtx>): Promise<boolean> | boolean;
    activateSync(event: string, map: MapType, x: number, y: number, ctx?: Partial<EffectCtx>): boolean;
    hasEffect(name: string): boolean;
    needsRedraw: boolean;
}
declare type EachCellCb = (cell: CellType, x: number, y: number, map: MapType) => any;
declare type EachItemCb = (item: Item) => any;
declare type EachActorCb = (actor: Actor) => any;
declare type MapTestFn = (cell: CellType, x: number, y: number, map: MapType) => boolean;
interface MapType {
    readonly width: number;
    readonly height: number;
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
    addItem(x: number, y: number, actor: Item): boolean;
    removeItem(actor: Item): boolean;
    moveItem(item: Item, x: number, y: number): boolean;
    eachActor(cb: EachActorCb): void;
    addActor(x: number, y: number, actor: Actor): boolean;
    removeActor(actor: Actor): boolean;
    moveActor(actor: Actor, x: number, y: number): boolean;
    isVisible(x: number, y: number): boolean;
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
    fireSync(event: string, x: number, y: number, ctx?: Partial<EffectCtx>): boolean;
    fireAll(event: string, ctx?: Partial<EffectCtx>): Promise<boolean>;
    fireAllSync(event: string, ctx?: Partial<EffectCtx>): boolean;
    activateMachine(machineId: number, originX: number, originY: number, ctx?: Partial<EffectCtx>): Promise<boolean>;
    activateMachineSync(machineId: number, originX: number, originY: number, ctx?: Partial<EffectCtx>): boolean;
    count(cb: MapTestFn): number;
    dump(fmt?: (cell: CellType) => string): void;
    getAppearanceAt(x: number, y: number, dest: GWU.sprite.Mixer): void;
}

declare enum Actor$1 {
    IS_PLAYER
}

type flags_d_Depth = Depth;
declare const flags_d_Depth: typeof Depth;
declare namespace flags_d {
  export {
    Actor$1 as Actor,
    GameObject$1 as GameObject,
    flags_d_Depth as Depth,
  };
}

declare class Actor extends GameObject {
    flags: ActorFlags;
    next: Actor | null;
    constructor();
    hasActorFlag(flag: number): boolean;
    hasAllActorFlags(flags: number): boolean;
    actorFlags(): number;
    isPlayer(): boolean;
    isVisible(): boolean;
    forbidsCell(_cell: CellType): boolean;
}

type index_d$1_Actor = Actor;
declare const index_d$1_Actor: typeof Actor;
type index_d$1_ActorFlags = ActorFlags;
declare namespace index_d$1 {
  export {
    index_d$1_Actor as Actor,
    flags_d as flags,
    index_d$1_ActorFlags as ActorFlags,
  };
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
    IS_POWERED,
    IMPREGNABLE,
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
    IS_WIRED,
    IS_CIRCUIT_BREAKER,
    COLORS_DANCE,
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

declare type TileData = Tile | null;
declare type TileArray = [Tile, ...TileData[]];
declare type EachCb<T> = (t: T) => any;
declare type MatchCb<T> = (t: T) => boolean;
declare type ReduceCb<T> = (out: any, t: T) => any;
declare class CellObjects {
    cell: Cell;
    constructor(cell: Cell);
    forEach(cb: EachCb<GameObject>): void;
    some(cb: MatchCb<GameObject>): boolean;
    reduce(cb: ReduceCb<GameObject>, start?: any): any;
}
declare class Cell implements CellType {
    flags: CellFlags;
    chokeCount: number;
    tiles: TileArray;
    machineId: number;
    _actor: Actor | null;
    _item: Item | null;
    _objects: CellObjects;
    constructor(groundTile?: number | string | Tile);
    copy(other: Cell): void;
    hasCellFlag(flag: number): boolean;
    setCellFlag(flag: number): void;
    clearCellFlag(flag: number): void;
    hasObjectFlag(flag: number): boolean;
    hasAllObjectFlags(flags: number): boolean;
    hasTileFlag(flag: number): boolean;
    hasAllTileFlags(flags: number): boolean;
    hasTileMechFlag(flag: number): boolean;
    hasAllTileMechFlags(flags: number): boolean;
    cellFlags(): number;
    objectFlags(): number;
    tileFlags(): number;
    tileMechFlags(): number;
    itemFlags(): number;
    actorFlags(): number;
    get needsRedraw(): boolean;
    set needsRedraw(v: boolean);
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
    hasKey(): boolean;
    setTile(tile: string | number | Tile): boolean;
    clear(): void;
    clearDepth(depth: Depth): boolean;
    clearDepthsWithFlags(tileFlag: number, tileMechFlag?: number): void;
    eachGlowLight(cb: (light: GWU.light.LightType) => any): void;
    activate(event: string, map: MapType, x: number, y: number, ctx?: Partial<EffectCtx>): Promise<boolean>;
    activateSync(event: string, map: MapType, x: number, y: number, ctx?: Partial<EffectCtx>): boolean;
    _fire(effect: string | EffectInfo, map: MapType, x: number, y: number, ctx: Partial<EffectCtx>): Promise<boolean>;
    _fireSync(effect: string | EffectInfo, map: MapType, x: number, y: number, ctx: Partial<EffectCtx>): boolean;
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
    constructor(map: MapType, name?: string);
    copy(_other: MapLayer): void;
    tick(_dt: number): Promise<boolean>;
}
declare class ActorLayer extends MapLayer {
    constructor(map: MapType, name?: string);
    add(x: number, y: number, obj: Actor, _opts?: any): boolean;
    remove(obj: Actor): boolean;
    putAppearance(dest: GWU.sprite.Mixer, x: number, y: number): void;
}
declare class ItemLayer extends MapLayer {
    constructor(map: MapType, name?: string);
    add(x: number, y: number, obj: Item, _opts?: any): boolean;
    remove(obj: Item): boolean;
    putAppearance(dest: GWU.sprite.Mixer, x: number, y: number): void;
}
declare class TileLayer extends MapLayer {
    constructor(map: MapType, name?: string);
    set(x: number, y: number, tile: Tile, opts?: SetTileOptions): boolean;
    clear(x: number, y: number): boolean;
    tick(_dt: number): Promise<boolean>;
    putAppearance(dest: GWU.sprite.Mixer, x: number, y: number): void;
}

declare class CellMemory implements CellInfoType {
    chokeCount: number;
    machineId: number;
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
    hasCellFlag(flag: number): boolean;
    hasTileFlag(flag: number): boolean;
    hasAllTileFlags(flags: number): boolean;
    hasObjectFlag(flag: number): boolean;
    hasAllObjectFlags(flags: number): boolean;
    hasTileMechFlag(flag: number): boolean;
    cellFlags(): number;
    objectFlags(): number;
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
    hasKey(): boolean;
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
    constructor(width: number, height: number, opts?: Partial<MapOptions>);
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
    itemAt(x: number, y: number): Item | null;
    eachItem(cb: GWU.types.EachCb<Item>): void;
    addItem(x: number, y: number, item: Item): boolean;
    removeItem(item: Item): boolean;
    moveItem(item: Item, x: number, y: number): boolean;
    hasPlayer(x: number, y: number): boolean;
    actorAt(x: number, y: number): Actor | null;
    eachActor(cb: GWU.types.EachCb<Actor>): void;
    addActor(x: number, y: number, item: Actor): boolean;
    removeActor(item: Actor): boolean;
    moveActor(item: Actor, x: number, y: number): boolean;
    isVisible(x: number, y: number): boolean;
    count(cb: MapTestFn): number;
    dump(fmt?: (cell: CellType) => string, log?: {
        (...data: any[]): void;
        (message?: any, ...optionalParams: any[]): void;
    }): void;
    hasMapFlag(flag: number): boolean;
    setMapFlag(flag: number): void;
    clearMapFlag(flag: number): void;
    setCellFlag(x: number, y: number, flag: number): void;
    clearCellFlag(x: number, y: number, flag: number): void;
    fill(tile: string | number | Tile, boundary?: string | number | Tile): void;
    hasTile(x: number, y: number, tile: string | number | Tile, useMemory?: boolean): boolean;
    setTile(x: number, y: number, tile: string | number | Tile, opts?: SetTileOptions): boolean;
    tick(dt: number): Promise<boolean>;
    copy(src: Map): void;
    clone(): Map;
    fire(event: string, x: number, y: number, ctx?: Partial<EffectCtx>): Promise<boolean>;
    fireSync(event: string, x: number, y: number, ctx?: Partial<EffectCtx>): boolean;
    fireAll(event: string, ctx?: Partial<EffectCtx>): Promise<boolean>;
    fireAllSync(event: string, ctx?: Partial<EffectCtx>): boolean;
    activateMachine(machineId: number, originX: number, originY: number, ctx?: Partial<EffectCtx>): Promise<boolean>;
    activateMachineSync(machineId: number, originX: number, originY: number, ctx?: Partial<EffectCtx>): boolean;
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
declare function make(w: number, h: number, floor?: string, boundary?: string): Map;
declare function make(w: number, h: number, floor: string): Map;
declare function make(w: number, h: number, opts: Partial<MapOptions>): Map;
declare function from(prefab: string | string[] | GWU.grid.NumGrid, charToTile: Record<string, string | null>, opts?: Partial<MapOptions>): Map;

declare function analyze(map: MapType, updateChokeCounts?: boolean): void;
declare function updateChokepoints(map: MapType, updateCounts: boolean): void;
declare function floodFillCount(map: MapType, results: GWU.grid.NumGrid, passMap: GWU.grid.NumGrid, startX: number, startY: number): number;
declare function updateLoopiness(map: MapType): void;
declare function resetLoopiness(cell: CellType, _x: number, _y: number, _map: MapType): void;
declare function checkLoopiness(cell: CellType, x: number, y: number, map: MapType): boolean;
declare function fillInnerLoopGrid(map: MapType, grid: GWU.grid.NumGrid): void;
declare function cleanLoopiness(map: MapType): void;

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
declare class SpawnEffect implements EffectHandler {
    make(src: Partial<EffectConfig>, dest: EffectInfo): boolean;
    fire(effect: EffectInfo, map: MapType, x: number, y: number, ctx: EffectCtx): Promise<boolean>;
    fireSync(effect: EffectInfo, map: MapType, x: number, y: number, ctx: EffectCtx): boolean;
    mapDisruptedBy(map: MapType, blockingGrid: GWU.grid.NumGrid, blockingToMapX?: number, blockingToMapY?: number): boolean;
}
declare function spawnTiles(flags: number, spawnMap: GWU.grid.NumGrid, map: MapType, tile: Tile, volume?: number, machine?: number): boolean;
declare function computeSpawnMap(effect: EffectInfo, map: MapType, x: number, y: number, ctx: EffectCtx): boolean;
declare function clearCells(map: MapType, spawnMap: GWU.grid.NumGrid, flags?: number): boolean;
declare function evacuateCreatures(map: MapType, blockingMap: GWU.grid.NumGrid): boolean;
declare function evacuateItems(map: MapType, blockingMap: GWU.grid.NumGrid): boolean;

declare class GasLayer extends TileLayer {
    volume: GWU.grid.NumGrid;
    needsUpdate: boolean;
    constructor(map: MapType, name?: string);
    set(x: number, y: number, tile: Tile, opts?: SetTileOptions): boolean;
    clear(x: number, y: number): boolean;
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

declare const flags: {
    Cell: typeof Cell$1;
    Map: typeof Map$1;
    GameObject: typeof GameObject$1;
    Depth: typeof Depth;
    Tile: typeof Tile$1;
};

declare const index_d_flags: typeof flags;
type index_d_CellFlags = CellFlags;
type index_d_MapFlags = MapFlags;
type index_d_SetOptions = SetOptions;
type index_d_SetTileOptions = SetTileOptions;
type index_d_CellInfoType = CellInfoType;
type index_d_CellType = CellType;
type index_d_EachCellCb = EachCellCb;
type index_d_EachItemCb = EachItemCb;
type index_d_EachActorCb = EachActorCb;
type index_d_MapTestFn = MapTestFn;
type index_d_MapType = MapType;
type index_d_Cell = Cell;
declare const index_d_Cell: typeof Cell;
type index_d_MapOptions = MapOptions;
type index_d_LayerType = LayerType;
type index_d_MapDrawOptions = MapDrawOptions;
type index_d_Map = Map;
declare const index_d_Map: typeof Map;
declare const index_d_make: typeof make;
declare const index_d_from: typeof from;
declare const index_d_analyze: typeof analyze;
declare const index_d_updateChokepoints: typeof updateChokepoints;
declare const index_d_floodFillCount: typeof floodFillCount;
declare const index_d_updateLoopiness: typeof updateLoopiness;
declare const index_d_resetLoopiness: typeof resetLoopiness;
declare const index_d_checkLoopiness: typeof checkLoopiness;
declare const index_d_fillInnerLoopGrid: typeof fillInnerLoopGrid;
declare const index_d_cleanLoopiness: typeof cleanLoopiness;
type index_d_SpawnConfig = SpawnConfig;
type index_d_SpawnInfo = SpawnInfo;
type index_d_SpawnEffect = SpawnEffect;
declare const index_d_SpawnEffect: typeof SpawnEffect;
declare const index_d_spawnTiles: typeof spawnTiles;
declare const index_d_computeSpawnMap: typeof computeSpawnMap;
declare const index_d_clearCells: typeof clearCells;
declare const index_d_evacuateCreatures: typeof evacuateCreatures;
declare const index_d_evacuateItems: typeof evacuateItems;
type index_d_CellMemory = CellMemory;
declare const index_d_CellMemory: typeof CellMemory;
type index_d_MapLayer = MapLayer;
declare const index_d_MapLayer: typeof MapLayer;
type index_d_ActorLayer = ActorLayer;
declare const index_d_ActorLayer: typeof ActorLayer;
type index_d_ItemLayer = ItemLayer;
declare const index_d_ItemLayer: typeof ItemLayer;
type index_d_TileLayer = TileLayer;
declare const index_d_TileLayer: typeof TileLayer;
type index_d_GasLayer = GasLayer;
declare const index_d_GasLayer: typeof GasLayer;
type index_d_FireLayer = FireLayer;
declare const index_d_FireLayer: typeof FireLayer;
declare namespace index_d {
  export {
    index_d_flags as flags,
    index_d_CellFlags as CellFlags,
    index_d_MapFlags as MapFlags,
    index_d_SetOptions as SetOptions,
    index_d_SetTileOptions as SetTileOptions,
    index_d_CellInfoType as CellInfoType,
    index_d_CellType as CellType,
    index_d_EachCellCb as EachCellCb,
    index_d_EachItemCb as EachItemCb,
    index_d_EachActorCb as EachActorCb,
    index_d_MapTestFn as MapTestFn,
    index_d_MapType as MapType,
    index_d_Cell as Cell,
    index_d_MapOptions as MapOptions,
    index_d_LayerType as LayerType,
    index_d_MapDrawOptions as MapDrawOptions,
    index_d_Map as Map,
    index_d_make as make,
    index_d_from as from,
    index_d_analyze as analyze,
    index_d_updateChokepoints as updateChokepoints,
    index_d_floodFillCount as floodFillCount,
    index_d_updateLoopiness as updateLoopiness,
    index_d_resetLoopiness as resetLoopiness,
    index_d_checkLoopiness as checkLoopiness,
    index_d_fillInnerLoopGrid as fillInnerLoopGrid,
    index_d_cleanLoopiness as cleanLoopiness,
    index_d_SpawnConfig as SpawnConfig,
    index_d_SpawnInfo as SpawnInfo,
    index_d_SpawnEffect as SpawnEffect,
    index_d_spawnTiles as spawnTiles,
    index_d_computeSpawnMap as computeSpawnMap,
    index_d_clearCells as clearCells,
    index_d_evacuateCreatures as evacuateCreatures,
    index_d_evacuateItems as evacuateItems,
    index_d_CellMemory as CellMemory,
    index_d_MapLayer as MapLayer,
    index_d_ActorLayer as ActorLayer,
    index_d_ItemLayer as ItemLayer,
    index_d_TileLayer as TileLayer,
    index_d_GasLayer as GasLayer,
    index_d_FireLayer as FireLayer,
  };
}

export { index_d$1 as actor, index_d$3 as effect, index_d$5 as gameObject, index_d$4 as item, index_d as map, index_d$2 as tile };
