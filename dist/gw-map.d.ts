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
    L_NO_SIDEBAR,
    L_VISUALLY_DISTINCT,
    L_BRIGHT_MEMORY,
    L_INVERT_WHEN_HIGHLIGHTED,
    L_ON_MAP,
    L_IN_SIDEBAR,
    L_FORMAL_NAME,
    L_ALWAYS_PLURAL,
    DEFAULT_ACTOR = 0,
    DEFAULT_ITEM = 0,
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
    STABLE_COST_MAP,
    IS_VISIBLE,
    WAS_VISIBLE,
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
    T_SHALLOW_WATER,
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
    T_LIST_IN_SIDEBAR,
    T_HAS_STAIRS,
    T_OBSTRUCTS_SCENT,
    T_PATHING_BLOCKER,
    T_LAKE_PATHING_BLOCKER,
    T_WAYPOINT_BLOCKER,
    T_DIVIDES_LEVEL,
    T_MOVES_ITEMS,
    T_CAN_BE_BRIDGED,
    T_IS_DEEP_LIQUID,
    T_ANY_LIQUID
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
    IS_CURSOR,
    IS_HIGHLIGHTED,
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
    MAP_HAS_LIQUID,
    MAP_HAS_GAS,
    MAP_HAS_FIRE,
    MAP_CALC_FOV,
    MAP_FOV_CHANGED,
    MAP_DANCES,
    MAP_SIDEBAR_TILES_CHANGED,
    MAP_SIDEBAR_CHANGED,
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

type index_d$g_Depth = Depth;
declare const index_d$g_Depth: typeof Depth;
type index_d$g_DepthString = DepthString;
type index_d$g_TileMech = TileMech;
declare const index_d$g_TileMech: typeof TileMech;
type index_d$g_Effect = Effect;
declare const index_d$g_Effect: typeof Effect;
declare namespace index_d$g {
  export {
    index_d$g_Depth as Depth,
    index_d$g_DepthString as DepthString,
    Entity$1 as Entity,
    Actor$1 as Actor,
    Item$1 as Item,
    Tile$1 as Tile,
    index_d$g_TileMech as TileMech,
    Cell$1 as Cell,
    Map$1 as Map,
    index_d$g_Effect as Effect,
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

interface TileFlags extends FlagType$1 {
    tile: number;
    tileMech: number;
}

declare const flags: {
    Tile: typeof Tile$1;
    TileMech: typeof TileMech;
};

declare const index_d$f_flags: typeof flags;
type index_d$f_TileFlags = TileFlags;
type index_d$f_TileBase = TileBase;
type index_d$f_TileConfig = TileConfig;
type index_d$f_Tile = Tile;
declare const index_d$f_Tile: typeof Tile;
type index_d$f_TileOptions = TileOptions;
declare const index_d$f_tiles: typeof tiles;
declare const index_d$f_all: typeof all;
declare const index_d$f_NULL: typeof NULL;
declare namespace index_d$f {
  export {
    index_d$f_flags as flags,
    index_d$f_TileFlags as TileFlags,
    TextOptions$1 as TextOptions,
    index_d$f_TileBase as TileBase,
    index_d$f_TileConfig as TileConfig,
    index_d$f_Tile as Tile,
    index_d$f_TileOptions as TileOptions,
    make$3 as make,
    index_d$f_tiles as tiles,
    index_d$f_all as all,
    get$1 as get,
    install$2 as install,
    installAll$1 as installAll,
    index_d$f_NULL as NULL,
  };
}

interface FlagType extends FlagType$1 {
    item: number;
}

declare class Item extends Entity {
    static default: {
        sidebarFg: string;
    };
    flags: FlagType;
    quantity: number;
    kind: ItemKind;
    next: Item | null;
    constructor(kind: ItemKind);
    isPlural(): boolean;
    copy(other: Item): void;
    itemFlags(): number;
    hasItemFlag(flag: number): boolean;
    hasAllItemFlags(flags: number): boolean;
    getBumpActions(): (ActionFn | string)[];
}

interface KindOptions$3 extends KindOptions {
    flags?: GWU.flag.FlagBase;
    actions?: Record<string, boolean | ActionFn>;
    bump?: string | ActionFn | (string | ActionFn)[];
}
interface MakeOptions$2 extends MakeOptions {
    quantity: number;
}
declare class ItemKind extends EntityKind {
    flags: FlagType;
    bump: (string | ActionFn)[];
    constructor(config: KindOptions$3);
    make(options?: Partial<MakeOptions$2>): Item;
    init(item: Item, options?: Partial<MakeOptions$2>): void;
    avoidsCell(cell: Cell, item: Item): boolean;
}

declare function make$7(info: string | ItemKind | KindOptions$3, makeOptions?: any): Item;
declare function makeRandom$1(opts: Partial<MatchOptions$2> | string, makeOptions?: any): Item;
declare const kinds$1: Record<string, ItemKind>;
declare function install$7(id: string, kind: ItemKind | KindOptions$3): ItemKind;
declare function get$3(id: string | ItemKind): ItemKind | null;
declare function makeKind$2(info: KindOptions$3): ItemKind;
interface MatchOptions$2 {
    tags: string | string[];
    forbidTags: string | string[];
    rng: GWU.rng.Random;
}
declare function randomKind$1(opts?: Partial<MatchOptions$2> | string): ItemKind | null;

type index_d$e_FlagType = FlagType;
type index_d$e_ItemKind = ItemKind;
declare const index_d$e_ItemKind: typeof ItemKind;
type index_d$e_Item = Item;
declare const index_d$e_Item: typeof Item;
declare namespace index_d$e {
  export {
    index_d$e_FlagType as FlagType,
    KindOptions$3 as KindOptions,
    MakeOptions$2 as MakeOptions,
    index_d$e_ItemKind as ItemKind,
    index_d$e_Item as Item,
    make$7 as make,
    makeRandom$1 as makeRandom,
    kinds$1 as kinds,
    install$7 as install,
    get$3 as get,
    makeKind$2 as makeKind,
    MatchOptions$2 as MatchOptions,
    randomKind$1 as randomKind,
  };
}

declare class PainMessages {
    _msgs: string[];
    constructor(msgs?: string[]);
    add(msg: string): this;
    get(pct: number, singular?: boolean): string;
    _format(msg: string, singular?: boolean): string;
}
declare const painMessages: Record<string, PainMessages>;
declare function installPain(id: string, pain: PainMessages | string[]): void;
declare function getPain(id: string): PainMessages;

declare type AdjustType = 'inc' | 'set' | 'dec' | 'min' | 'max';
interface StatOptions {
    value?: number;
    max?: number;
    rate?: number;
}
interface StatAdjustment {
    over?: number;
    bonus?: number;
    value?: GWU.range.RangeBase | boolean;
    max?: number | boolean;
    rate?: number;
    reset?: boolean;
    name?: string;
    stat?: string;
}
interface RegenInfo {
    turns: number;
    count: number;
    elapsed: number;
}
declare class Stats {
    _max: Record<string, number>;
    _rate: Record<string, RegenInfo>;
    _value: Record<string, number>;
    constructor(opts?: Record<string, GWU.range.RangeBase>);
    get(name: string): number;
    getPct(name: string): number;
    max(name: string): number;
    regen(name: string): RegenInfo | null;
    init(opts: Record<string, GWU.range.RangeBase>): void;
    set(name: string, v: GWU.range.RangeBase, max?: number): void;
    gain(name: string, amount: GWU.range.RangeBase, allowOver?: boolean): void;
    drain(name: string, amount: GWU.range.RangeBase): void;
    raiseMax(name: string, amount: GWU.range.RangeBase, raiseValue?: boolean): void;
    reduceMax(name: string, amount: GWU.range.RangeBase, lowerValue?: boolean): void;
    setRegen(name: string, turns: number, count?: number): void;
    regenAll(): void;
    restore(name: string, value?: number): void;
    adjust(name: string, type: AdjustType, amount: GWU.range.RangeBase): boolean;
}

declare type StatusCallback = (status: Status, name: string) => any;
declare class Status {
    _set: Record<string, boolean>;
    _time: Record<string, number>;
    _count: Record<string, number>;
    _done: Record<string, StatusCallback | null>;
    _value: Record<string, boolean>;
    changed: StatusCallback | null;
    clear(name: string): boolean;
    get(name: string): boolean;
    has(name: string): boolean;
    _addDone(name: string, done?: StatusCallback): void;
    /**
     * Sets the count for a status variable.
     * If setting the count turns on the status (it was off),
     * then this function returns true.  Otherwise, false.
     * The done variable is only set if there is no other done function
     * already for this status.
     * @param {string} name The name of the status to set.
     * @param {number} count The count to set.
     * @param {function} [done] The function to call whenever the count goes to 0.
     * @returns {boolean} Whether or not setting the count turned the status on.
     */
    setCount(name: string, count: number, done: StatusCallback): boolean;
    /**
     * Increments the count for the status by the given amount (1=default)
     * If incrementing the count turns on the status (it was off),
     * then this function returns true.  Otherwise, false.
     * The done variable is only set if there is no other done function
     * already for this status.
     * @param {string} name The name of the status to set.
     * @param {number} [count=1] The count to incrmeent.
     * @param {function} [done] The function to call whenever the count goes to 0.
     * @returns {boolean} Whether or not incrementing the count turned the status on.
     */
    increment(name: string, count?: number, done?: StatusCallback): boolean;
    /**
     * Decrements the count for the status by the given amount (1=default)
     * If decrementing the count turns off the status (it was on),
     * then this function returns true.  Otherwise, false.
     * Also, if the status is turned off, and a done function was set, then it
     * is called.
     * @param {string} name The name of the status to adjust.
     * @param {number} [count=1] The count to decrement.
     * @returns {boolean} Whether or not decrementing the count turned the status off.
     */
    decrement(name: string, count?: number): boolean;
    /**
     * Clears all counts from the given status.
     * If clearing the count turns off the status (it was on),
     * then this function returns true.  Otherwise, false.
     * Also, if the status is turned off, and a done function was set, then it
     * is called.
     * @param {string} name The name of the status to adjust.
     * @returns {boolean} Whether or not decrementing the count turned the status off.
     */
    clearCount(name: string): boolean;
    /**
     * Turns on the given status.
     * @param {string} name The status to adjust.
     * @param {function} [done] The function to call when the status is turned off.
     * @returns {boolean} True if this turns on the status. (It could be on because of a time or count).
     */
    setOn(name: string, done?: StatusCallback): boolean;
    /**
     * Turns off the given status.
     *
     * @param {string} name The status to adjust.
     * @returns {boolean} True if this turns off the status. (It could be on because of a time or count).
     */
    setOff(name: string): boolean;
    /**
     * Sets the time for a status variable.
     * If setting the time turns on the status (it was off),
     * then this function returns true.  Otherwise, false.
     * The done variable is only set if there is no other done function
     * already for this status.
     * @param {string} name The name of the status to set.
     * @param {GWU.range.RangeBase} time The time value to set.
     * @param {function} [done] The function to call whenever the status goes false.
     * @returns {boolean} Whether or not setting the time turned the status on.
     */
    setTime(name: string, value: GWU.range.RangeBase, done?: StatusCallback): boolean;
    /**
     * Adds to the time for a status variable.
     * If adding to the time turns on the status (it was off),
     * then this function returns true.  Otherwise, false.
     * The done variable is only set if there is no other done function
     * already for this status.
     * @param {string} name The name of the status to set.
     * @param {GWU.range.RangeBase} time The time value to add.
     * @param {function} [done] The function to call whenever the status goes false.
     * @returns {boolean} Whether or not adding the time turned the status on.
     */
    addTime(name: string, value?: GWU.range.RangeBase, done?: StatusCallback): boolean;
    /**
     * Removes time for a status variable.
     * If removing to the time turns off the status (it was on),
     * then this function returns true.  Otherwise, false.
     * @param {string} name The name of the status to set.
     * @param {GWU.range.RangeBase} time The time value to remove.
     * @returns {boolean} Whether or not removing the time turned the status off.
     */
    removeTime(name: string, value?: GWU.range.RangeBase): boolean;
    /**
     * Removes all time for a status variable.
     * If removing to the time turns off the status (it was on),
     * then this function returns true.  Otherwise, false.
     * @param {string} name The name of the status to set.
     * @returns {boolean} Whether or not removing the time turned the status off.
     */
    clearTime(name: string): boolean;
    /**
     * Removes time for all status variables that have time.
     * If removing the time turns off any status (it was on),
     * then this function returns an object with all of those statuses as keys and false as the values.  Otherwise, false.
     * @param {Status|object} source The object to set the status on.  If object.status is set then that is where the values are updated.
     * @param {string} name The name of the status to set.
     * @returns {boolean|object} false or an object with the names of the statuses that were cleared as keys and false as the values.
     */
    decayAllTimes(delta?: number): false | Record<string, boolean>;
    /**
     * Updates the value of the status and returns whether or not this change
     * turned the status on or off (true = change, false = no change)
     * @param {string} name The name of the status to update
     * @returns {boolean} True if the value was turned on or off, False otherwise.
     */
    _update(name: string): boolean;
}

interface ActorFlags extends FlagType$1 {
    actor: number;
}

declare function fillSafetyMap(safetyMap: GWU.grid.NumGrid, actor: Actor, target: Actor): void;

interface AIOptions {
    fn?: ActionFn | string;
    [field: string]: any;
}
interface AIConfig {
    fn?: ActionFn;
    [field: string]: any;
}
declare const ais: Record<string, ActionFn>;
declare function install$6(name: string, fn: ActionFn): void;
declare function make$6(opts: AIOptions | string | ActionFn): AIConfig;

declare function typical(action: Action): void;
declare function canMoveToward(action: Action): boolean;
declare function moveToward(action: Action): void;
declare function canMoveAwayFrom(_action: Action): boolean;
declare function moveAwayFrom(action: Action): void;
declare function canRunAwayFrom(_action: Action): boolean;
declare function runAwayFrom(action: Action): void;
declare function canAttack(action: Action): boolean;
declare function attack(action: Action): void;
declare function tooFarFrom(action: Action): boolean;
declare function tooCloseTo(action: Action): boolean;
declare function moveTowardGoal(action: Action): void;

declare function wander(action: Action): void;

declare const index_d$d_fillSafetyMap: typeof fillSafetyMap;
type index_d$d_AIOptions = AIOptions;
type index_d$d_AIConfig = AIConfig;
declare const index_d$d_ais: typeof ais;
declare const index_d$d_typical: typeof typical;
declare const index_d$d_canMoveToward: typeof canMoveToward;
declare const index_d$d_moveToward: typeof moveToward;
declare const index_d$d_canMoveAwayFrom: typeof canMoveAwayFrom;
declare const index_d$d_moveAwayFrom: typeof moveAwayFrom;
declare const index_d$d_canRunAwayFrom: typeof canRunAwayFrom;
declare const index_d$d_runAwayFrom: typeof runAwayFrom;
declare const index_d$d_canAttack: typeof canAttack;
declare const index_d$d_attack: typeof attack;
declare const index_d$d_tooFarFrom: typeof tooFarFrom;
declare const index_d$d_tooCloseTo: typeof tooCloseTo;
declare const index_d$d_moveTowardGoal: typeof moveTowardGoal;
declare const index_d$d_wander: typeof wander;
declare namespace index_d$d {
  export {
    index_d$d_fillSafetyMap as fillSafetyMap,
    index_d$d_AIOptions as AIOptions,
    index_d$d_AIConfig as AIConfig,
    index_d$d_ais as ais,
    install$6 as install,
    make$6 as make,
    index_d$d_typical as typical,
    index_d$d_canMoveToward as canMoveToward,
    index_d$d_moveToward as moveToward,
    index_d$d_canMoveAwayFrom as canMoveAwayFrom,
    index_d$d_moveAwayFrom as moveAwayFrom,
    index_d$d_canRunAwayFrom as canRunAwayFrom,
    index_d$d_runAwayFrom as runAwayFrom,
    index_d$d_canAttack as canAttack,
    index_d$d_attack as attack,
    index_d$d_tooFarFrom as tooFarFrom,
    index_d$d_tooCloseTo as tooCloseTo,
    index_d$d_moveTowardGoal as moveTowardGoal,
    index_d$d_wander as wander,
  };
}

interface KindOptions$2 extends KindOptions {
    flags?: GWU.flag.FlagBase;
    vision?: number;
    stats?: Record<string, GWU.range.RangeBase>;
    moveSpeed?: number;
    ai?: string | ActionFn | AIOptions;
    bump?: ActionFn | string | (ActionFn | string)[];
    swim?: boolean;
    fly?: boolean;
    waterOnly?: boolean;
    lavaOnly?: boolean;
}
interface MakeOptions$1 extends MakeOptions {
}
declare class ActorKind extends EntityKind {
    flags: ActorFlags;
    vision: Record<string, number>;
    stats: Record<string, GWU.range.RangeBase>;
    bump: (ActionFn | string)[];
    moveSpeed: number;
    ai: AIConfig;
    constructor(opts: KindOptions$2);
    make(options?: Partial<MakeOptions$1>): Actor;
    init(actor: Actor, options?: Partial<MakeOptions$1>): void;
    addToMap(actor: Actor, map: Map): void;
    removeFromMap(actor: Actor): void;
    hasActorFlag(flag: number): boolean;
    canSeeEntity(_actor: Actor, _entity: Entity): boolean;
    isAbleToSee(_actor: Actor, _entity: Entity): boolean;
    isAbleToSense(_actor: Actor, _entity: Entity): boolean;
    forbidsCell(cell: Cell, actor?: Actor): boolean;
    avoidsCell(cell: Cell, actor?: Actor): boolean;
    getFlavor(actor: Actor, opts?: FlavorOptions): string;
    pickupItem(actor: Actor, item: Item, _opts?: Partial<PickupOptions>): boolean;
    dropItem(actor: Actor, item: Item, _opts?: Partial<DropOptions>): boolean;
    cellCost(cell: Cell, actor: Actor): number;
    drawSidebar(actor: Actor, buffer: GWU.buffer.Buffer, bounds: GWU.xy.Bounds): number;
}

declare function make$5(info: string | ActorKind | KindOptions$2, makeOptions?: any): Actor;
declare function makeRandom(opts: Partial<MatchOptions$1> | string, makeOptions?: any): Actor;
declare const kinds: Record<string, ActorKind>;
declare function install$5(id: string, kind: ActorKind | KindOptions$2): ActorKind;
declare function get$2(id: string | ActorKind): ActorKind | null;
declare function makeKind$1(info: KindOptions$2): ActorKind;
interface MatchOptions$1 {
    tags: string | string[];
    forbidTags: string | string[];
    rng: GWU.rng.Random;
}
declare function randomKind(opts?: Partial<MatchOptions$1> | string): ActorKind | null;

type index_d$c_PainMessages = PainMessages;
declare const index_d$c_PainMessages: typeof PainMessages;
declare const index_d$c_painMessages: typeof painMessages;
declare const index_d$c_installPain: typeof installPain;
declare const index_d$c_getPain: typeof getPain;
type index_d$c_AdjustType = AdjustType;
type index_d$c_StatOptions = StatOptions;
type index_d$c_StatAdjustment = StatAdjustment;
type index_d$c_RegenInfo = RegenInfo;
type index_d$c_Stats = Stats;
declare const index_d$c_Stats: typeof Stats;
type index_d$c_StatusCallback = StatusCallback;
type index_d$c_Status = Status;
declare const index_d$c_Status: typeof Status;
type index_d$c_ActorFlags = ActorFlags;
type index_d$c_ActorKind = ActorKind;
declare const index_d$c_ActorKind: typeof ActorKind;
type index_d$c_PickupOptions = PickupOptions;
type index_d$c_DropOptions = DropOptions;
type index_d$c_Actor = Actor;
declare const index_d$c_Actor: typeof Actor;
declare const index_d$c_makeRandom: typeof makeRandom;
declare const index_d$c_kinds: typeof kinds;
declare const index_d$c_randomKind: typeof randomKind;
declare namespace index_d$c {
  export {
    index_d$c_PainMessages as PainMessages,
    index_d$c_painMessages as painMessages,
    index_d$c_installPain as installPain,
    index_d$c_getPain as getPain,
    index_d$c_AdjustType as AdjustType,
    index_d$c_StatOptions as StatOptions,
    index_d$c_StatAdjustment as StatAdjustment,
    index_d$c_RegenInfo as RegenInfo,
    index_d$c_Stats as Stats,
    index_d$c_StatusCallback as StatusCallback,
    index_d$c_Status as Status,
    index_d$c_ActorFlags as ActorFlags,
    KindOptions$2 as KindOptions,
    MakeOptions$1 as MakeOptions,
    index_d$c_ActorKind as ActorKind,
    index_d$c_PickupOptions as PickupOptions,
    index_d$c_DropOptions as DropOptions,
    index_d$c_Actor as Actor,
    make$5 as make,
    index_d$c_makeRandom as makeRandom,
    index_d$c_kinds as kinds,
    install$5 as install,
    get$2 as get,
    makeKind$1 as makeKind,
    MatchOptions$1 as MatchOptions,
    index_d$c_randomKind as randomKind,
  };
}

declare type CellDrawFn = (dest: GWU.sprite.Mixer, map: Map, cell: Cell, fov?: GWU.fov.FovTracker) => boolean;
interface MapDrawOptions {
    offsetX: number;
    offsetY: number;
    fov?: GWU.fov.FovTracker | null;
}
interface DrawDest {
    readonly width: number;
    readonly height: number;
    draw(x: number, y: number, ch: string, fg: GWU.color.ColorBase, bg: GWU.color.ColorBase): void;
}
interface CellDrawer {
    scent: boolean;
    drawCell: CellDrawFn;
    drawInto(dest: DrawDest, map: Map, opts?: Partial<MapDrawOptions>): void;
}

interface SkillInfo {
    has: boolean;
    level: number;
    disadvantage?: boolean;
    advantage?: boolean;
    fixed?: number;
    bonus?: number;
    succeed?: boolean;
    fail?: boolean;
}
declare class Skill implements Readonly<SkillInfo> {
    name: string;
    _has?: boolean;
    _level?: number;
    _disadvantage?: boolean;
    _advantage?: boolean;
    _fixed?: number;
    _bonus?: number;
    _succeed?: boolean;
    _fail?: boolean;
    _parent?: Skill;
    constructor(name: string);
    get has(): boolean;
    get level(): number;
    get disadvantage(): boolean;
    get advantage(): boolean;
    get fixed(): number;
    get bonus(): number;
    get succeed(): boolean;
    get fail(): boolean;
    set(value: boolean | number): void;
    _value(name: keyof this): number | boolean | undefined;
    _bool(name: keyof this): boolean;
    _int(name: keyof this): number;
    adjust(adj: Partial<SkillInfo>): void;
    clear(adj: Partial<SkillInfo>): void;
}
declare class Skills {
    _skills: Record<string, Skill>;
    constructor(vals?: Record<string, number | boolean>);
    set(name: string, value: boolean | number): Skill;
    get(name: string): Skill;
    adjust(name: string, adj: Partial<SkillInfo> | number): Skill;
}

interface Modifier {
    bonus?: number;
}
interface Adjustment extends Modifier {
    fixed?: number;
    min?: number;
    max?: number;
    sustain?: boolean;
    base?: number;
    restore?: boolean;
}
declare type ChangeCallback = (attributes: Attributes, name: string) => any;
declare class Attributes {
    _base: Record<string, number>;
    _max: Record<string, number>;
    _bonus: Record<string, Modifier[]>;
    _sustain: Record<string, boolean>;
    _value: Record<string, number>;
    changed: ChangeCallback | null;
    constructor(baseValues: Record<string, number> | number);
    init(baseValues: Record<string, number> | number): void;
    forEach(fn: (v: number) => any): void;
    get(name: string): number;
    set(name: string, value?: number): number;
    base(name: string): number;
    max(name: string): number;
    sustain(name: string): boolean;
    gain(name: string, delta: number, raiseMax?: boolean): number;
    drain(name: string, loss: number, lowerMax?: boolean): number;
    restore(name: string): number;
    addBonus(name: string, bonus: number): number;
    _addBonus(name: string, bonus: Adjustment): number;
    clearBonus(name: string, bonus: number): number;
    _clearBonus(name: string, bonus: number | Adjustment): number;
    _calcValue(name: string): number;
    adjust(name: string, adj: Adjustment | number): number | undefined;
    clearAdjustment(name: string, adj: Adjustment | number): number | undefined;
    _applyAdjustment(total: Adjustment, opts: Adjustment): void;
}
declare const attributes: Record<string, number>;
declare function installAttribute(attr: string | Record<string, number>): void;
declare function makeAttributes(defaults: Record<string, number>): Attributes;

interface KindOptions$1 extends KindOptions$2 {
    attributes?: Record<string, number>;
    skills?: Record<string, number | boolean>;
    stats?: Record<string, number>;
}
declare class PlayerKind extends ActorKind {
    attributes: Attributes;
    skills: Skills;
    constructor(opts?: Partial<KindOptions$1>);
    make(options?: MakeOptions$1): Player;
    cellCost(cell: Cell, player: Player): number;
}

declare class Scent {
    _player: Player;
    _data: GWU.grid.NumGrid;
    constructor(player: Player);
    get(x: number, y: number): number;
    clear(): void;
    update(): void;
    nextDir(x: number, y: number): GWU.xy.Loc | null;
}

declare class Player extends Actor {
    static default: {
        ch: string;
        fg: string;
        name: string;
        swim: boolean;
        sidebarFg: string;
    };
    kind: PlayerKind;
    scent: Scent;
    constructor(kind: PlayerKind);
    interrupt(other: Actor): void;
    endTurn(pct?: number): void;
    addToMap(map: Map, x: number, y: number): boolean;
    setGoal(x: number, y: number): GWU.grid.NumGrid;
    nextGoalStep(): GWU.xy.Loc | null;
    pathTo(other: Actor): GWU.xy.Loc[] | null;
    pathTo(x: number, y: number): GWU.xy.Loc[] | null;
}

interface UISubject {
    readonly map: Map | null;
    readonly x: number;
    readonly y: number;
}
declare type ViewFilterFn = (mixer: GWU.sprite.Mixer, x: number, y: number, map: Map) => void;
interface ViewportOptions extends GWU.widget.WidgetOpts {
    snap?: boolean;
    filter?: ViewFilterFn;
    lockX?: boolean;
    lockY?: boolean;
    lock?: boolean;
    center?: boolean;
    scent?: boolean;
}
declare class Viewport extends GWU.widget.Widget {
    filter: ViewFilterFn | null;
    scent: boolean;
    bg: GWU.color.Color;
    offsetX: number;
    offsetY: number;
    _subject: UISubject | null;
    player: Player | null;
    constructor(opts: ViewportOptions);
    get subject(): Player | UISubject | null;
    set subject(subject: Player | UISubject | null);
    set lock(v: boolean);
    get lockX(): boolean;
    set lockX(v: boolean);
    get lockY(): boolean;
    set lockY(v: boolean);
    toMapX(x: number): number;
    toMapY(y: number): number;
    toInnerX(x: number): number;
    toInnerY(y: number): number;
    halfWidth(): number;
    halfHeight(): number;
    centerOn(map: Map, x: number, y: number): void;
    showMap(map: Map, x?: number, y?: number): void;
    updateOffset(): void;
    _draw(buffer: GWU.buffer.Buffer): void;
    update(dt: number): void;
    _mousemove(ev: GWU.app.Event): void;
    _click(ev: GWU.app.Event): void;
    clearPath(): void;
    showPath(x: number, y: number): boolean;
}

interface MessageOptions extends GWU.widget.WidgetOpts {
    archive?: number;
}
declare class Messages extends GWU.widget.Widget {
    cache: GWU.message.MessageCache;
    constructor(opts: MessageOptions);
    clear(): void;
    confirmAll(): void;
    draw(buffer: GWU.buffer.Buffer): boolean;
    showArchive(): void;
}
declare type ArchiveMode = 'forward' | 'ack' | 'reverse';
declare const ArchiveScene: {
    create(this: GWU.app.Scene): void;
    start(this: GWU.app.Scene, source: Messages): void;
    stop(this: GWU.app.Scene): void;
    destroy(this: GWU.app.Scene): void;
};
interface ArchiveOpts extends GWU.widget.WidgetOpts {
    source: Messages;
}
declare class ArchiveWidget extends GWU.widget.Widget {
    source: Messages;
    totalCount: number;
    isOnTop: boolean;
    mode: ArchiveMode;
    shown: number;
    _timeout: GWU.app.TimerFn | null;
    _needsDraw: boolean;
    constructor(opts: ArchiveOpts);
    set needsDraw(v: boolean);
    contains(): boolean;
    finish(): void;
    _next(): void;
    _forward(): void;
    _reverse(): void;
    _draw(buffer: GWU.buffer.Buffer): void;
}

interface FlavorOptions$1 extends GWU.widget.TextOptions {
    overflow?: boolean;
}
declare class Flavor extends GWU.widget.Text {
    overflow: boolean;
    _needsDraw: boolean;
    constructor(opts: FlavorOptions$1);
    showText(text: string): this;
    clear(): this;
    showPrompt(text: string): this;
    getFlavorText(map: Map, x: number, y: number, fov?: GWU.fov.FovSystem): string;
    _draw(buffer: GWU.buffer.Buffer): void;
}

declare abstract class EntryBase {
    dist: number;
    priority: number;
    sidebarY: number;
    abstract get x(): number;
    abstract get y(): number;
    abstract get changed(): boolean;
    draw(_buffer: GWU.buffer.Buffer, _bounds: GWU.xy.Bounds): number;
}
declare class ActorEntry extends EntryBase {
    actor: Actor;
    constructor(actor: Actor);
    get x(): number;
    get y(): number;
    get changed(): boolean;
    draw(buffer: GWU.buffer.Buffer, bounds: GWU.xy.Bounds): number;
}
declare class ItemEntry extends EntryBase {
    item: Item;
    constructor(item: Item);
    get x(): number;
    get y(): number;
    get changed(): boolean;
    draw(buffer: GWU.buffer.Buffer, bounds: GWU.xy.Bounds): number;
}
declare class CellEntry extends EntryBase {
    cell: Cell;
    changed: boolean;
    constructor(cell: Cell);
    get x(): number;
    get y(): number;
    draw(buffer: GWU.buffer.Buffer, bounds: GWU.xy.Bounds): number;
}
declare type SidebarEntry = ActorEntry | ItemEntry | CellEntry;
interface SidebarOptions extends GWU.widget.WidgetOpts {
    bg?: GWU.color.ColorBase;
    width?: number;
}
declare class Sidebar extends GWU.widget.Widget {
    cellCache: Cell[];
    lastX: number;
    lastY: number;
    lastMap: Map | null;
    entries: SidebarEntry[];
    subject: Player | null;
    highlight: EntryBase | null;
    _needsDraw: boolean;
    constructor(opts: SidebarOptions);
    set needsDraw(v: boolean);
    reset(): void;
    entryAt(e: GWU.app.Event): EntryBase | null;
    click(ev: GWU.app.Event): boolean;
    mousemove(e: GWU.app.Event): boolean;
    highlightAt(x: number, y: number): boolean;
    _highlightRow(y: number): boolean;
    clearHighlight(): boolean;
    _updateCellCache(map: Map): boolean;
    _makeActorEntry(actor: Actor): ActorEntry;
    _makeItemEntry(item: Item): ItemEntry;
    _makeCellEntry(cell: Cell): CellEntry;
    _getPriority(map: Map, x: number, y: number, fov?: GWU.fov.FovTracker): number;
    _isDim(entry: EntryBase): boolean;
    _addActorEntry(actor: Actor, map: Map, x: number, y: number, fov?: GWU.fov.FovTracker): boolean;
    _addItemEntry(item: Item, map: Map, x: number, y: number, fov?: GWU.fov.FovTracker): boolean;
    _addCellEntry(cell: Cell, map: Map, x: number, y: number, fov?: GWU.fov.FovTracker): boolean;
    _updateEntryCache(map: Map, cx: number, cy: number, fov?: GWU.fov.FovTracker): boolean;
    update(): boolean;
    updateFor(subject: Player): boolean;
    updateAt(map: Map, cx: number, cy: number, fov?: GWU.fov.FovTracker): boolean;
    draw(buffer: GWU.buffer.Buffer): boolean;
}

declare type MakeMapFn = (this: Game, opts: MakeMapOpts) => Map;
declare type MakePlayerFn = (this: Game) => Player;
declare type StartMapFn = (this: Game, map: Map, player: Player, opts: StartMapOpts) => void;
interface GameOptions extends GWU.app.CreateOpts {
    makeMap: MakeMapFn;
    makePlayer: MakePlayerFn;
    startMap?: StartMapFn;
    keymap: Record<string, string>;
    mouse?: boolean;
    viewport?: true | ViewportOptions;
    messages?: boolean | number | MessageOptions;
    flavor?: boolean | FlavorOptions$1;
    sidebar?: boolean | number | SidebarOptions;
}
interface StartOpts {
    map?: number;
    player?: Player;
}
interface MakeMapOpts {
    id?: number;
}
interface StartMapOpts {
    id?: number;
    up?: boolean;
    down?: boolean;
    location?: string;
}
declare class Game extends GWU.app.Scene {
    viewport: Viewport;
    messages?: Messages;
    flavor?: Flavor;
    sidebar?: Sidebar;
    scheduler: GWU.scheduler.Scheduler;
    player: Player;
    map: Map;
    _makeMap: MakeMapFn;
    _makePlayer: MakePlayerFn;
    _startMap: StartMapFn;
    result: any;
    mouse: boolean;
    fov: boolean;
    scent: boolean;
    running: boolean;
    keymap: Record<string, string>;
    constructor(id: string, app: GWU.app.App);
    get viewWidth(): number;
    get viewHeight(): number;
    _initMenu(_opts: GameOptions): void;
    _initSidebar(opts: GameOptions): void;
    _initMessages(opts: GameOptions): void;
    _initFlavor(opts: GameOptions): void;
    _initViewport(opts: GameOptions): void;
    create(opts: GameOptions): void;
    start(opts?: StartOpts): void;
    startNewMap(opts?: StartMapOpts): void;
    update(dt: number): void;
    input(ev: GWU.app.Event): void;
    mousemove(ev: GWU.app.Event): void;
    click(_ev: GWU.app.Event): void;
    keypress(ev: GWU.app.Event): void;
    _actionFor(keymap: Record<string, string>, ev: GWU.app.Event): string | null;
}

type index_d$b_UISubject = UISubject;
type index_d$b_ViewFilterFn = ViewFilterFn;
type index_d$b_ViewportOptions = ViewportOptions;
type index_d$b_Viewport = Viewport;
declare const index_d$b_Viewport: typeof Viewport;
type index_d$b_MessageOptions = MessageOptions;
type index_d$b_Messages = Messages;
declare const index_d$b_Messages: typeof Messages;
type index_d$b_ArchiveMode = ArchiveMode;
declare const index_d$b_ArchiveScene: typeof ArchiveScene;
type index_d$b_ArchiveOpts = ArchiveOpts;
type index_d$b_ArchiveWidget = ArchiveWidget;
declare const index_d$b_ArchiveWidget: typeof ArchiveWidget;
type index_d$b_Flavor = Flavor;
declare const index_d$b_Flavor: typeof Flavor;
type index_d$b_EntryBase = EntryBase;
declare const index_d$b_EntryBase: typeof EntryBase;
type index_d$b_ActorEntry = ActorEntry;
declare const index_d$b_ActorEntry: typeof ActorEntry;
type index_d$b_ItemEntry = ItemEntry;
declare const index_d$b_ItemEntry: typeof ItemEntry;
type index_d$b_CellEntry = CellEntry;
declare const index_d$b_CellEntry: typeof CellEntry;
type index_d$b_SidebarEntry = SidebarEntry;
type index_d$b_SidebarOptions = SidebarOptions;
type index_d$b_Sidebar = Sidebar;
declare const index_d$b_Sidebar: typeof Sidebar;
type index_d$b_MakeMapFn = MakeMapFn;
type index_d$b_MakePlayerFn = MakePlayerFn;
type index_d$b_StartMapFn = StartMapFn;
type index_d$b_GameOptions = GameOptions;
type index_d$b_StartOpts = StartOpts;
type index_d$b_MakeMapOpts = MakeMapOpts;
type index_d$b_StartMapOpts = StartMapOpts;
type index_d$b_Game = Game;
declare const index_d$b_Game: typeof Game;
declare namespace index_d$b {
  export {
    index_d$b_UISubject as UISubject,
    index_d$b_ViewFilterFn as ViewFilterFn,
    index_d$b_ViewportOptions as ViewportOptions,
    index_d$b_Viewport as Viewport,
    index_d$b_MessageOptions as MessageOptions,
    index_d$b_Messages as Messages,
    index_d$b_ArchiveMode as ArchiveMode,
    index_d$b_ArchiveScene as ArchiveScene,
    index_d$b_ArchiveOpts as ArchiveOpts,
    index_d$b_ArchiveWidget as ArchiveWidget,
    FlavorOptions$1 as FlavorOptions,
    index_d$b_Flavor as Flavor,
    index_d$b_EntryBase as EntryBase,
    index_d$b_ActorEntry as ActorEntry,
    index_d$b_ItemEntry as ItemEntry,
    index_d$b_CellEntry as CellEntry,
    index_d$b_SidebarEntry as SidebarEntry,
    index_d$b_SidebarOptions as SidebarOptions,
    index_d$b_Sidebar as Sidebar,
    index_d$b_MakeMapFn as MakeMapFn,
    index_d$b_MakePlayerFn as MakePlayerFn,
    index_d$b_StartMapFn as StartMapFn,
    index_d$b_GameOptions as GameOptions,
    index_d$b_StartOpts as StartOpts,
    index_d$b_MakeMapOpts as MakeMapOpts,
    index_d$b_StartMapOpts as StartMapOpts,
    index_d$b_Game as Game,
  };
}

interface MapOptions extends GWU.light.LightSystemOptions, GWU.fov.FovSystemOptions {
    tile?: string | true;
    boundary?: string | true;
    seed?: number;
    id?: number;
    drawer?: CellDrawer;
    player?: Player;
    fov?: boolean;
    actions?: Record<string, ActionFn>;
}
interface MapFlags {
    map: number;
}
declare type EachCellCb = (cell: Cell, x: number, y: number, map: Map) => any;
declare type EachItemCb = (item: Item) => any;
declare type EachActorCb = (actor: Actor) => any;
declare type MapTestFn = (cell: Cell, x: number, y: number, map: Map) => boolean;
declare class Map implements GWU.light.LightSystemSite {
    cells: GWU.grid.Grid<Cell>;
    flags: {
        map: 0;
    };
    light: GWU.light.LightSystemType;
    fov: GWU.fov.FovSystem;
    data: Record<string, any>;
    locations: Record<string, GWU.xy.Loc>;
    rng: GWU.rng.Random;
    id: number;
    actors: Actor[];
    items: Item[];
    drawer: CellDrawer;
    fx: Entity[];
    player: Player | null;
    game: Game;
    _tweens: GWU.app.Tweens;
    events: GWU.app.Events;
    constructor(width: number, height: number, opts?: MapOptions);
    get seed(): number;
    set seed(v: number);
    get width(): number;
    get height(): number;
    hasXY(x: number, y: number): boolean;
    isBoundaryXY(x: number, y: number): boolean;
    cell(x: number, y: number): Cell;
    get(x: number, y: number): Cell | undefined;
    eachCell(cb: EachCellCb): void;
    someCell(cb: MapTestFn): boolean;
    hasItem(x: number, y: number): boolean;
    itemAt(x: number, y: number): Item | null;
    eachItem(cb: GWU.types.EachCb<Item>): void;
    addItem(x: number, y: number, item: Item, fireEffects?: boolean): boolean;
    _fireAddItemEffects(item: Item, cell: Cell): void;
    addItemNear(x: number, y: number, item: Item, fireEffects?: boolean): boolean;
    removeItem(item: Item, fireEffects?: boolean): boolean;
    _fireRemoveItemEffects(item: Item, cell: Cell): void;
    moveItem(item: Item, x: number, y: number, fireEffects?: boolean): boolean;
    hasPlayer(x: number, y: number): boolean;
    setPlayer(player: Player): void;
    actorAt(x: number, y: number): Actor | null;
    eachActor(cb: GWU.types.EachCb<Actor>): void;
    addActor(x: number, y: number, actor: Actor, fireEffects?: boolean): boolean;
    _fireAddActorEffects(actor: Actor, cell: Cell): void;
    addActorNear(x: number, y: number, actor: Actor, fireEffects?: boolean): boolean;
    removeActor(actor: Actor, fireEffects?: boolean): boolean;
    _fireRemoveActorEffects(actor: Actor, cell: Cell): void;
    moveActor(actor: Actor, x: number, y: number, fireEffects?: boolean): boolean;
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
    hasTileFlag(x: number, y: number, flag: number): boolean;
    highlightPath(path: GWU.xy.Loc[], markCursor?: boolean): void;
    highlightCell(x: number, y: number, markCursor?: boolean): void;
    clearPath(): void;
    showCursor(x: number, y: number): void;
    clearCursor(): void;
    clear(): void;
    clearCell(x: number, y: number, tile?: TileBase): void;
    fill(tile: TileBase, boundary?: TileBase): void;
    hasTile(x: number, y: number, tile: TileBase): boolean;
    forceTile(x: number, y: number, tile: TileBase): boolean;
    setTile(x: number, y: number, tile: TileBase, opts?: SetTileOptions | true): boolean;
    tick(dt: number): boolean;
    copy(src: Map): void;
    clone(): Map;
    hasAction(action: string): boolean;
    on(action: string | string[], fn: ActionFn | GWU.app.CallbackFn): GWU.app.CancelFn;
    once(action: string | string[], fn: ActionFn | GWU.app.CallbackFn): GWU.app.CancelFn;
    off(action: string | string[], fn?: ActionFn | GWU.app.CallbackFn): void;
    trigger(ev: string, action?: Action | ActionOpts): void;
    triggerAll(name: string, action?: ActionOpts | Action): boolean;
    drawInto(dest: GWU.canvas.Canvas | GWU.buffer.Buffer, opts?: Partial<MapDrawOptions>): void;
    getAppearanceAt(x: number, y: number, dest: GWU.sprite.Mixer): boolean;
    hasActor(x: number, y: number): boolean;
    eachGlowLight(cb: GWU.light.LightCb): void;
    eachDynamicLight(_cb: GWU.light.LightCb): void;
    eachViewport(cb: GWU.fov.ViewportCb): void;
    lightingChanged(): boolean;
    hasVisibleLight(x: number, y: number): boolean;
    blocksVision(x: number, y: number): boolean;
    storeMemory(x: number, y: number): void;
    makeVisible(x: number, y: number): void;
    onFovChange(x: number, y: number, isVisible: boolean): void;
    addAnimation(a: GWU.tween.Tween): void;
    removeAnimation(a: GWU.tween.Tween): void;
}

declare type ActorActionResult = false | ActionFn;
declare class Entity implements EntityType {
    static default: {
        sidebarFg: string;
    };
    depth: number;
    light: GWU.light.LightType | null;
    flags: FlagType$1;
    next: Entity | null;
    x: number;
    y: number;
    _map: Map | null;
    kind: EntityKind;
    key: KeyInfoType | null;
    machineHome: number;
    id: string;
    changed: boolean;
    actions: Actions;
    _actions: Record<string, boolean>;
    constructor(kind: EntityKind);
    get map(): Map | null;
    isPlural(): boolean;
    isOnMap(): boolean;
    addToMap(map: Map, x: number, y: number): boolean;
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
    forbidsCell(cell: Cell): boolean;
    avoidsCell(cell: Cell): boolean;
    getName(opts?: TextOptions): string;
    getDescription(opts?: TextOptions): string;
    getFlavor(opts?: FlavorOptions): string;
    getVerb(verb: string): string;
    drawSidebar(buffer: GWU.buffer.Buffer, bounds: GWU.xy.Bounds): number;
    drawInto(dest: GWU.sprite.Mixer, _observer?: Entity): void;
    canDoAction(action: string): boolean;
    hasAction(action: string): boolean;
    on(action: string | string[], fn: ActionFn): void;
    once(action: string | string[], fn: ActionFn): void;
    off(action: string | string[], fn?: ActionFn): void;
    trigger(name: string, action?: Action | ActionObj): void;
    toString(): string;
}

interface PickupOptions {
    admin: boolean;
}
interface DropOptions {
    admin: boolean;
}
declare class Actor extends Entity {
    static default: {
        sidebarFg: string;
    };
    flags: ActorFlags;
    kind: ActorKind;
    ai: AIConfig;
    _action: string;
    _turnTime: number;
    leader: Actor | null;
    items: Item | null;
    visionDistance: number;
    stats: Stats;
    status: Status;
    data: Record<string, any>;
    _costMap: GWU.grid.NumGrid | null;
    _goalMap: GWU.grid.NumGrid | null;
    _mapToMe: GWU.grid.NumGrid | null;
    next: Actor | null;
    constructor(kind: ActorKind);
    setData(key: string, value: any): void;
    copy(other: Actor): void;
    destroy(): void;
    hasActorFlag(flag: number): boolean;
    hasAllActorFlags(flags: number): boolean;
    actorFlags(): number;
    setActorFlag(flag: number): void;
    clearActorFlag(flag: number): void;
    isPlayer(): boolean;
    isDead(): boolean;
    getBumpActions(): (ActionFn | string)[];
    becameVisible(): boolean;
    canSee(x: number, y: number): boolean;
    canSee(entity: Entity): boolean;
    canSeeOrSense(x: number, y: number): boolean;
    canSeeOrSense(entity: Entity): boolean;
    isAbleToSee(entity: Entity): boolean;
    isAbleToSense(entity: Entity): boolean;
    setAction(name: string): void;
    clearAction(): void;
    act(game: Game): number;
    moveSpeed(): number;
    startTurn(): void;
    endTurn(pct?: number): void;
    willAttack(_other: Actor): boolean;
    canPass(_other: Actor): boolean;
    avoidsItem(_item: Item): boolean;
    canAddItem(_item: Item): boolean;
    addItem(_item: Item): void;
    pickupItem(item: Item, opts?: Partial<PickupOptions>): boolean;
    dropItem(item: Item, opts?: Partial<DropOptions>): boolean;
    addToMap(map: Map, x: number, y: number): boolean;
    removeFromMap(): void;
    costMap(): GWU.grid.NumGrid;
    get goalMap(): GWU.grid.NumGrid | null;
    hasGoal(): boolean;
    setGoal(x: number, y: number): GWU.grid.NumGrid;
    clearGoal(): void;
    mapToMe(): GWU.grid.NumGrid;
}

interface ActionOpts {
    game?: Game;
    map?: Map;
    item?: Item;
    actor?: Actor;
    target?: Actor;
    x?: number;
    y?: number;
    key?: boolean;
    force?: boolean;
    aware?: boolean;
    machine?: number;
}
declare class Action {
    game: Game;
    map: Map;
    actor: Actor | null;
    item: Item | null;
    x: number;
    y: number;
    key: boolean;
    target: Actor | null;
    dir: GWU.xy.Loc | null;
    aware: boolean;
    identified: boolean;
    machine: number;
    try: boolean;
    force: boolean;
    good: boolean;
    seen: boolean;
    quiet: boolean;
    originX: number;
    originY: number;
    ok: boolean;
    failed: boolean;
    done: boolean;
    logged: boolean;
    visible: boolean;
    data: Record<string, any>;
    constructor(opts: ActionOpts);
    isSuccess(): boolean;
    isFailed(): boolean;
    didSomething(): void;
    didNothing(): void;
    fail(): void;
    isDone(): boolean;
    stop(): void;
    reset(): void;
}

declare type CancelFn = () => void;
declare type NextFn = () => number;
interface ActionFn {
    (action: Action): void;
    seen?: boolean;
}
interface ActionInfo {
    fn: ActionFn;
    ctx?: any;
    once?: boolean;
}
declare type UnhandledFn = (ev: string, action: Action) => void;
interface ActionObj {
    [key: string]: ActionFn | ActionFn[];
}
declare class Actions {
    _handlers: Record<string, (null | ActionInfo)[]>;
    _ctx: any;
    onUnhandled: UnhandledFn | null;
    constructor(ctx?: any);
    copy(other: Actions): void;
    has(ev: string): boolean;
    on(ev: string | string[], fn: ActionFn | ActionFn[]): CancelFn;
    load(obj: ActionObj): void;
    once(ev: string | string[], fn: ActionFn | ActionFn[]): CancelFn;
    off(ev: string | string[], cb?: ActionFn): void;
    trigger(ev: string | string[], action: Action): boolean;
    _unhandled(ev: string, action: Action): boolean;
    clear(): void;
    restart(): void;
}
declare function install$4(ev: string, fn: ActionFn): void;
declare function doAction(ev: string, action?: Action | ActionOpts): void;
declare function defaultAction(ev: string, _action: Action): void;

type index_d$a_ActionOpts = ActionOpts;
type index_d$a_Action = Action;
declare const index_d$a_Action: typeof Action;
type index_d$a_CancelFn = CancelFn;
type index_d$a_NextFn = NextFn;
type index_d$a_ActionFn = ActionFn;
type index_d$a_UnhandledFn = UnhandledFn;
type index_d$a_ActionObj = ActionObj;
type index_d$a_Actions = Actions;
declare const index_d$a_Actions: typeof Actions;
declare const index_d$a_doAction: typeof doAction;
declare const index_d$a_defaultAction: typeof defaultAction;
declare namespace index_d$a {
  export {
    index_d$a_ActionOpts as ActionOpts,
    index_d$a_Action as Action,
    index_d$a_CancelFn as CancelFn,
    index_d$a_NextFn as NextFn,
    index_d$a_ActionFn as ActionFn,
    index_d$a_UnhandledFn as UnhandledFn,
    index_d$a_ActionObj as ActionObj,
    index_d$a_Actions as Actions,
    install$4 as install,
    index_d$a_doAction as doAction,
    index_d$a_defaultAction as defaultAction,
  };
}

declare type EffectConfig = any;
interface EffectObj {
    [key: string]: EffectConfig;
}
declare type HandlerFn = (config: EffectConfig) => ActionFn;
declare const handlers: Record<string, HandlerFn>;
declare function installHandler(id: string, handler: HandlerFn): void;
declare function make$4(cfg: string): ActionFn | null;
declare function make$4(obj: EffectObj): ActionFn | null;
declare function make$4(id: string, config: EffectConfig): ActionFn | null;
declare function makeArray(cfg: string): ActionFn[];
declare function makeArray(obj: EffectObj): ActionFn[];
declare function makeArray(arr: EffectConfig[]): ActionFn[];
declare function trigger(effect: string, map: Map, x: number, y: number, opts: Record<string, any>): void;
declare const installed: Record<string, ActionFn>;
declare function install$3(id: string, config: EffectConfig): ActionFn;
declare function installAll$2(effects: Record<string, EffectConfig>): void;
declare function resetAll(): void;

type index_d$9_EffectConfig = EffectConfig;
type index_d$9_EffectObj = EffectObj;
type index_d$9_HandlerFn = HandlerFn;
declare const index_d$9_handlers: typeof handlers;
declare const index_d$9_installHandler: typeof installHandler;
declare const index_d$9_makeArray: typeof makeArray;
declare const index_d$9_trigger: typeof trigger;
declare const index_d$9_installed: typeof installed;
declare const index_d$9_resetAll: typeof resetAll;
declare namespace index_d$9 {
  export {
    index_d$9_EffectConfig as EffectConfig,
    index_d$9_EffectObj as EffectObj,
    index_d$9_HandlerFn as HandlerFn,
    index_d$9_handlers as handlers,
    index_d$9_installHandler as installHandler,
    make$4 as make,
    index_d$9_makeArray as makeArray,
    index_d$9_trigger as trigger,
    index_d$9_installed as installed,
    install$3 as install,
    installAll$2 as installAll,
    index_d$9_resetAll as resetAll,
  };
}

interface TextOptions$1 {
    article?: boolean | string;
    color?: boolean | string | GWU.color.ColorBase;
}
declare type TileBase = string | number | Tile;
interface TileConfig extends GWU.sprite.SpriteConfig {
    id: string;
    flags: TileFlags;
    dissipate: number;
    actions: ActionObj;
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
    actions: Actions;
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
    hasAction(name: string): boolean;
    on(name: string, fn: ActionFn | string | EffectObj): void;
    trigger(name: string, action?: Action | ActionOpts): void;
    isNull(): boolean;
    isPassable(): boolean;
    isWall(): boolean;
    isDoor(): boolean;
    isStairs(): boolean;
    isFloor(): boolean;
    isDiggable(): boolean;
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
    actions?: Record<string, EffectConfig>;
    groundTile: string;
    light: GWU.light.LightBase | null;
    tags: string | string[];
}
declare function make$3(options: Partial<TileOptions>): Tile;
declare const tiles: Record<string, Tile>;
declare const all: Tile[];
declare function get$1(id: string | number | Tile): Tile;
declare function install$2(id: string, options: Partial<TileOptions>): Tile;
declare function install$2(id: string, base: string, options: Partial<TileOptions>): Tile;
declare function installAll$1(tiles: Record<string, Partial<TileOptions>>): void;
declare const NULL: Tile;

interface CellFlags {
    cell: number;
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
declare type EachCb<T> = (t: T) => any;
declare type TileData = Tile | null;
declare type TileArray = [Tile, ...TileData[]];
interface CellMemoryFlags extends CellFlags {
    entity: number;
    tile: number;
    tileMech: number;
}
interface CellMemory {
    tiles: TileArray;
    item: Item | null;
    actor: Actor | null;
    flags: CellMemoryFlags;
}
declare const NEVER_SEEN: CellMemory;
declare class Cell {
    flags: CellFlags;
    chokeCount: number;
    tiles: TileArray;
    machineId: number;
    map: Map;
    x: number;
    y: number;
    snapshot: GWU.sprite.Mixer;
    memory: CellMemory | null;
    volume: number;
    constructor(map: Map, x: number, y: number, groundTile?: number | string | Tile);
    getSnapshot(dest: GWU.sprite.Mixer): void;
    putSnapshot(src: GWU.sprite.Mixer): void;
    get hasStableSnapshot(): boolean;
    get hasStableMemory(): boolean;
    storeMemory(): void;
    clearMemory(): void;
    copy(other: Cell): void;
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
    isDoor(): boolean;
    isStairs(): boolean;
    isFloor(): boolean;
    isGateSite(): boolean;
    isSecretlyPassable(): boolean;
    hasLiquid(): boolean;
    setTile(tile: string | number | Tile, opts?: SetTileOptions): boolean;
    clearTiles(tile?: string | number | Tile): void;
    clear(tile?: number | string | Tile): void;
    clearDepth(depth: Depth): boolean;
    clearDepthsWithFlags(tileFlag: number, tileMechFlag?: number): void;
    eachGlowLight(cb: (light: GWU.light.LightType) => any): void;
    tileWithAction(name: string): Tile | null;
    trigger(action: string, ctx?: ActionOpts | Action): void;
    hasAction(name: string): boolean;
    hasItem(): boolean;
    get item(): Item | null;
    canAddItem(_item: Item): boolean;
    canRemoveItem(_item: Item): boolean;
    _addItem(_item: Item): boolean;
    _removeItem(item: Item): boolean;
    hasActor(): boolean;
    hasPlayer(): boolean;
    get actor(): Actor | null;
    canAddActor(_actor: Actor): boolean;
    canRemoveActor(_actor: Actor): boolean;
    _addActor(actor: Actor): boolean;
    _removeActor(actor: Actor): boolean;
    hasFx(): boolean;
    get fx(): Entity | null;
    _addFx(_fx: Entity): void;
    _removeFx(_fx: Entity): void;
    getDescription(): string;
    getFlavor(): string;
    getName(opts?: {}): string;
    dump(): string;
    drawSidebar(buffer: GWU.buffer.Buffer, bounds: GWU.xy.Bounds): number;
    toString(): string;
}

declare function analyze(map: Map, updateChokeCounts?: boolean): void;
declare function updateChokepoints(map: Map, updateCounts: boolean): void;
declare function floodFillCount(map: Map, results: GWU.grid.NumGrid, passMap: GWU.grid.NumGrid, startX: number, startY: number): number;
declare function updateLoopiness(map: Map): void;
declare function resetLoopiness(cell: Cell, _x: number, _y: number, _map: Map): void;
declare function checkLoopiness(map: Map): void;
declare function fillInnerLoopGrid(map: Map, grid: GWU.grid.NumGrid): void;
declare function cleanLoopiness(map: Map): void;

declare class Snapshot {
    map: Map;
    version: number;
    constructor(map: Map);
}
declare class SnapshotManager {
    map: Map;
    version: number;
    cellVersion: GWU.grid.NumGrid;
    lightVersion: number;
    free: Snapshot[];
    constructor(map: Map);
    takeNew(): Snapshot;
    revertMapTo(snap: Snapshot): void;
    release(snap: Snapshot): void;
}

declare function isHallway(map: Map, x: number, y: number): boolean;
declare function replaceTile(map: Map, find: TileBase, replace: TileBase): number;
declare function getCellPathCost(map: Map, x: number, y: number): number;
declare function fillCostMap(map: Map, costMap: GWU.grid.NumGrid): void;
interface PathOptions {
    eightWays: boolean;
}
declare function getPathBetween(map: Map, x0: number, y0: number, x1: number, y1: number, options?: Partial<PathOptions>): GWU.xy.Loc[] | null;

declare function make$2(w: number, h: number, floor?: string, boundary?: string): Map;
declare function make$2(w: number, h: number, floor: string): Map;
declare function make$2(w: number, h: number, opts: Partial<MapOptions>): Map;
declare function from$1(prefab: string | string[] | GWU.grid.NumGrid, charToTile: Record<string, string | null>, opts?: Partial<MapOptions>): Map;

type index_d$8_CellFlags = CellFlags;
type index_d$8_SetOptions = SetOptions;
type index_d$8_SetTileOptions = SetTileOptions;
type index_d$8_TileData = TileData;
type index_d$8_TileArray = TileArray;
type index_d$8_CellMemoryFlags = CellMemoryFlags;
type index_d$8_CellMemory = CellMemory;
declare const index_d$8_NEVER_SEEN: typeof NEVER_SEEN;
type index_d$8_Cell = Cell;
declare const index_d$8_Cell: typeof Cell;
type index_d$8_MapOptions = MapOptions;
type index_d$8_MapFlags = MapFlags;
type index_d$8_EachCellCb = EachCellCb;
type index_d$8_EachItemCb = EachItemCb;
type index_d$8_EachActorCb = EachActorCb;
type index_d$8_MapTestFn = MapTestFn;
type index_d$8_Map = Map;
declare const index_d$8_Map: typeof Map;
declare const index_d$8_analyze: typeof analyze;
declare const index_d$8_updateChokepoints: typeof updateChokepoints;
declare const index_d$8_floodFillCount: typeof floodFillCount;
declare const index_d$8_updateLoopiness: typeof updateLoopiness;
declare const index_d$8_resetLoopiness: typeof resetLoopiness;
declare const index_d$8_checkLoopiness: typeof checkLoopiness;
declare const index_d$8_fillInnerLoopGrid: typeof fillInnerLoopGrid;
declare const index_d$8_cleanLoopiness: typeof cleanLoopiness;
type index_d$8_Snapshot = Snapshot;
declare const index_d$8_Snapshot: typeof Snapshot;
type index_d$8_SnapshotManager = SnapshotManager;
declare const index_d$8_SnapshotManager: typeof SnapshotManager;
declare const index_d$8_isHallway: typeof isHallway;
declare const index_d$8_replaceTile: typeof replaceTile;
declare const index_d$8_getCellPathCost: typeof getCellPathCost;
declare const index_d$8_fillCostMap: typeof fillCostMap;
type index_d$8_PathOptions = PathOptions;
declare const index_d$8_getPathBetween: typeof getPathBetween;
declare namespace index_d$8 {
  export {
    index_d$8_CellFlags as CellFlags,
    index_d$8_SetOptions as SetOptions,
    index_d$8_SetTileOptions as SetTileOptions,
    index_d$8_TileData as TileData,
    index_d$8_TileArray as TileArray,
    index_d$8_CellMemoryFlags as CellMemoryFlags,
    index_d$8_CellMemory as CellMemory,
    index_d$8_NEVER_SEEN as NEVER_SEEN,
    index_d$8_Cell as Cell,
    index_d$8_MapOptions as MapOptions,
    index_d$8_MapFlags as MapFlags,
    index_d$8_EachCellCb as EachCellCb,
    index_d$8_EachItemCb as EachItemCb,
    index_d$8_EachActorCb as EachActorCb,
    index_d$8_MapTestFn as MapTestFn,
    index_d$8_Map as Map,
    index_d$8_analyze as analyze,
    index_d$8_updateChokepoints as updateChokepoints,
    index_d$8_floodFillCount as floodFillCount,
    index_d$8_updateLoopiness as updateLoopiness,
    index_d$8_resetLoopiness as resetLoopiness,
    index_d$8_checkLoopiness as checkLoopiness,
    index_d$8_fillInnerLoopGrid as fillInnerLoopGrid,
    index_d$8_cleanLoopiness as cleanLoopiness,
    index_d$8_Snapshot as Snapshot,
    index_d$8_SnapshotManager as SnapshotManager,
    index_d$8_isHallway as isHallway,
    index_d$8_replaceTile as replaceTile,
    index_d$8_getCellPathCost as getCellPathCost,
    index_d$8_fillCostMap as fillCostMap,
    index_d$8_PathOptions as PathOptions,
    index_d$8_getPathBetween as getPathBetween,
    make$2 as make,
    from$1 as from,
  };
}

interface TextOptions {
    article?: boolean;
    color?: boolean | GWU.color.ColorBase;
}
interface FlavorOptions extends TextOptions {
    action?: boolean;
}
declare type DrawSidebarFn = (entity: Entity, buffer: GWU.buffer.Buffer, bounds: GWU.xy.Bounds) => number;
interface KindOptions extends GWU.sprite.SpriteConfig {
    id?: string;
    name: string;
    flavor?: string;
    description?: string;
    sprite?: GWU.sprite.SpriteConfig;
    tags?: string | string[];
    requireTileFlags?: GWU.flag.FlagBase;
    avoidTileFlags?: GWU.flag.FlagBase;
    forbidTileFlags?: GWU.flag.FlagBase;
    requireTileTags?: string | string[];
    avoidTileTags?: string | string[];
    forbidTileTags?: string | string[];
    drawSidebar?: DrawSidebarFn;
    sidebarFg?: GWU.color.ColorBase;
    actions?: Record<string, ActionFn | boolean>;
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
    requireTileFlags: number;
    forbidTileFlags: number;
    avoidTileFlags: number;
    requireTileTags: string[];
    forbidTileTags: string[];
    avoidTileTags: string[];
    sidebarFg: GWU.color.Color;
    actions: Actions;
    _actions: Record<string, boolean>;
    constructor(config: KindOptions);
    make(opts?: MakeOptions): Entity;
    init(entity: Entity, opts?: MakeOptions): void;
    addToMap(_entity: Entity, _map: Map): void;
    removeFromMap(_entity: Entity): void;
    canBeSeen(_entity: Entity): boolean;
    forbidsCell(cell: Cell, _entity?: Entity): boolean;
    avoidsCell(cell: Cell, entity?: Entity): boolean;
    getName(_entity: Entity, _opts?: TextOptions): string;
    getDescription(_entity: Entity, _opts?: TextOptions): string;
    getFlavor(_entity: Entity, _opts?: FlavorOptions): string;
    getVerb(_entity: Entity, verb: string): string;
    drawSidebar(entity: Entity, buffer: GWU.buffer.Buffer, bounds: GWU.xy.Bounds): number;
    canDoAction(action: string): boolean;
    on(action: string | string[], fn: ActionFn | boolean): void;
    off(action: string | string[]): void;
    trigger(name: string, action?: Action | ActionOpts): void;
}
declare function make$1(opts: KindOptions, makeOpts?: MakeOptions): Entity;

declare function messageYou(this: GWU.text.HelperObj, name: string, view: GWU.text.View, args: string[]): string;
declare function messageThe(this: GWU.text.HelperObj, name: string, view: GWU.text.View, args: string[]): string;
declare function messageA(this: GWU.text.HelperObj, name: string, view: GWU.text.View, args: string[]): string;
declare function messageVerb(this: GWU.text.HelperObj, _name: string, view: GWU.text.View, args: string[]): string;

type index_d$7_KeyInfoType = KeyInfoType;
type index_d$7_EntityType = EntityType;
type index_d$7_KeyInfo = KeyInfo;
declare const index_d$7_KeyInfo: typeof KeyInfo;
declare const index_d$7_makeKeyInfo: typeof makeKeyInfo;
type index_d$7_TextOptions = TextOptions;
type index_d$7_FlavorOptions = FlavorOptions;
type index_d$7_DrawSidebarFn = DrawSidebarFn;
type index_d$7_KindOptions = KindOptions;
type index_d$7_MakeOptions = MakeOptions;
type index_d$7_EntityKind = EntityKind;
declare const index_d$7_EntityKind: typeof EntityKind;
type index_d$7_ActorActionResult = ActorActionResult;
type index_d$7_Entity = Entity;
declare const index_d$7_Entity: typeof Entity;
declare const index_d$7_messageYou: typeof messageYou;
declare const index_d$7_messageThe: typeof messageThe;
declare const index_d$7_messageA: typeof messageA;
declare const index_d$7_messageVerb: typeof messageVerb;
declare namespace index_d$7 {
  export {
    index_d$7_KeyInfoType as KeyInfoType,
    FlagType$1 as FlagType,
    index_d$7_EntityType as EntityType,
    index_d$7_KeyInfo as KeyInfo,
    index_d$7_makeKeyInfo as makeKeyInfo,
    index_d$7_TextOptions as TextOptions,
    index_d$7_FlavorOptions as FlavorOptions,
    index_d$7_DrawSidebarFn as DrawSidebarFn,
    index_d$7_KindOptions as KindOptions,
    index_d$7_MakeOptions as MakeOptions,
    index_d$7_EntityKind as EntityKind,
    make$1 as make,
    index_d$7_ActorActionResult as ActorActionResult,
    index_d$7_Entity as Entity,
    index_d$7_messageYou as messageYou,
    index_d$7_messageThe as messageThe,
    index_d$7_messageA as messageA,
    index_d$7_messageVerb as messageVerb,
  };
}

declare function standStill(action: Action): void;

declare function moveDir(action: Action): void;

declare function idle(action: Action): void;

declare function pickup(action: Action): void;

declare function climb(action: Action): void;

declare function bump(action: Action): void;

declare const index_d$6_standStill: typeof standStill;
declare const index_d$6_moveDir: typeof moveDir;
declare const index_d$6_idle: typeof idle;
declare const index_d$6_pickup: typeof pickup;
declare const index_d$6_climb: typeof climb;
declare const index_d$6_bump: typeof bump;
declare namespace index_d$6 {
  export {
    index_d$6_standStill as standStill,
    index_d$6_moveDir as moveDir,
    index_d$6_idle as idle,
    index_d$6_pickup as pickup,
    index_d$6_climb as climb,
    index_d$6_bump as bump,
  };
}

declare function fn(cfg: ActionFn | ActionFn[]): ActionFn;

declare function activateMachine(): ActionFn;
declare function activateMachineAction(action: Action): void;

declare function chance(opts: EffectConfig): ActionFn;
declare function chanceAction(cfg: number, action: Action): void;

declare function clear(config: any): ActionFn;
declare function clearAction(layers: number, action: Action): void;

declare function emit(config: any): ActionFn;
declare function emitAction(id: string, action: Action): void;

declare function feature(id: string | string[] | {
    id: string;
}): ActionFn;
declare function featureAction(id: string, action: Action): void;

declare function msg(src: any): ActionFn;
declare function messageAction(info: {
    msg: string;
}, action: Action): void;

interface NoursihConfig {
    type: AdjustType;
    amount: GWU.range.RangeBase;
}
interface NourishInfo {
    type: AdjustType;
    amount: GWU.range.Range;
}
declare function nourish(opts: any): ActionFn;
declare function nourishAction(config: NourishInfo, action: Action): void;
declare namespace nourishAction {
    var _a: {
        pukeMsg: string;
    };
    export { _a as default };
}

interface SpreadConfig {
    grow: number;
    decrement: number;
    matchTile: string;
    actions: ActionFn[];
    flags: number;
}
interface SpreadOptions extends Partial<Omit<SpreadConfig, 'flags'>> {
    actions?: EffectConfig;
    flags?: GWU.flag.FlagBase;
}
interface SpreadFn extends ActionFn {
    config: SpreadConfig;
}
declare type SpreadArgs = [number, number, EffectConfig, SpreadOptions?];
declare function spread(config: SpreadArgs | SpreadOptions): SpreadFn;
declare function spread(grow: number, decrement: number, action: EffectConfig, opts?: SpreadOptions): SpreadFn;
declare function spreadAction(this: SpreadConfig, action: Action): void;
declare function mapDisruptedBy(map: Map, blockingGrid: GWU.grid.NumGrid, blockingToMapX?: number, blockingToMapY?: number): boolean;
declare function computeSpawnMap(effect: SpreadConfig, loc: Action, spawnMap: GWU.grid.NumGrid): boolean;
declare function clearCells(map: Map, spawnMap: GWU.grid.NumGrid, flags?: number): boolean;
declare function evacuateCreatures(map: Map, blockingMap: GWU.grid.NumGrid): boolean;
declare function evacuateItems(map: Map, blockingMap: GWU.grid.NumGrid): boolean;

interface StatInfo {
    stat: string;
    type: AdjustType;
    amount: GWU.range.Range;
}
declare function stat(opts: any): ActionFn;
declare function statAction(config: StatInfo, action: Action): void;

interface TileEffectOptions extends SetTileOptions {
    id: string;
    protected?: boolean;
}
declare function tile(src: any): ActionFn;
declare function tileAction(cfg: TileEffectOptions, action: Action): void;

declare const index_d$5_fn: typeof fn;
declare const index_d$5_activateMachine: typeof activateMachine;
declare const index_d$5_activateMachineAction: typeof activateMachineAction;
declare const index_d$5_chance: typeof chance;
declare const index_d$5_chanceAction: typeof chanceAction;
declare const index_d$5_clear: typeof clear;
declare const index_d$5_clearAction: typeof clearAction;
declare const index_d$5_emit: typeof emit;
declare const index_d$5_emitAction: typeof emitAction;
declare const index_d$5_feature: typeof feature;
declare const index_d$5_featureAction: typeof featureAction;
declare const index_d$5_msg: typeof msg;
declare const index_d$5_messageAction: typeof messageAction;
type index_d$5_NoursihConfig = NoursihConfig;
type index_d$5_NourishInfo = NourishInfo;
declare const index_d$5_nourish: typeof nourish;
declare const index_d$5_nourishAction: typeof nourishAction;
type index_d$5_SpreadConfig = SpreadConfig;
type index_d$5_SpreadOptions = SpreadOptions;
type index_d$5_SpreadFn = SpreadFn;
type index_d$5_SpreadArgs = SpreadArgs;
declare const index_d$5_spread: typeof spread;
declare const index_d$5_spreadAction: typeof spreadAction;
declare const index_d$5_mapDisruptedBy: typeof mapDisruptedBy;
declare const index_d$5_computeSpawnMap: typeof computeSpawnMap;
declare const index_d$5_clearCells: typeof clearCells;
declare const index_d$5_evacuateCreatures: typeof evacuateCreatures;
declare const index_d$5_evacuateItems: typeof evacuateItems;
type index_d$5_StatInfo = StatInfo;
declare const index_d$5_stat: typeof stat;
declare const index_d$5_statAction: typeof statAction;
type index_d$5_TileEffectOptions = TileEffectOptions;
declare const index_d$5_tile: typeof tile;
declare const index_d$5_tileAction: typeof tileAction;
declare namespace index_d$5 {
  export {
    index_d$5_fn as fn,
    index_d$5_activateMachine as activateMachine,
    index_d$5_activateMachineAction as activateMachineAction,
    index_d$5_chance as chance,
    index_d$5_chanceAction as chanceAction,
    index_d$5_clear as clear,
    index_d$5_clearAction as clearAction,
    index_d$5_emit as emit,
    index_d$5_emitAction as emitAction,
    index_d$5_feature as feature,
    index_d$5_featureAction as featureAction,
    index_d$5_msg as msg,
    index_d$5_messageAction as messageAction,
    index_d$5_NoursihConfig as NoursihConfig,
    index_d$5_NourishInfo as NourishInfo,
    index_d$5_nourish as nourish,
    index_d$5_nourishAction as nourishAction,
    index_d$5_SpreadConfig as SpreadConfig,
    index_d$5_SpreadOptions as SpreadOptions,
    index_d$5_SpreadFn as SpreadFn,
    index_d$5_SpreadArgs as SpreadArgs,
    index_d$5_spread as spread,
    index_d$5_spreadAction as spreadAction,
    index_d$5_mapDisruptedBy as mapDisruptedBy,
    index_d$5_computeSpawnMap as computeSpawnMap,
    index_d$5_clearCells as clearCells,
    index_d$5_evacuateCreatures as evacuateCreatures,
    index_d$5_evacuateItems as evacuateItems,
    index_d$5_StatInfo as StatInfo,
    index_d$5_stat as stat,
    index_d$5_statAction as statAction,
    index_d$5_TileEffectOptions as TileEffectOptions,
    index_d$5_tile as tile,
    index_d$5_tileAction as tileAction,
  };
}

declare class MapLayer {
    map: Map;
    depth: number;
    properties: Record<string, any>;
    name: string;
    changed: boolean;
    constructor(map: Map, name?: string);
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
    constructor(map: Map, name?: string);
    setTile(x: number, y: number, tile: Tile, opts?: SetTileOptions): boolean;
    clearTile(x: number, y: number): boolean;
    tick(_dt: number): boolean;
}

declare function gas(map: Map): void;

declare function fire(map: Map): void;

type index_d$4_MapLayer = MapLayer;
declare const index_d$4_MapLayer: typeof MapLayer;
type index_d$4_TileLayer = TileLayer;
declare const index_d$4_TileLayer: typeof TileLayer;
declare const index_d$4_gas: typeof gas;
declare const index_d$4_fire: typeof fire;
declare namespace index_d$4 {
  export {
    index_d$4_MapLayer as MapLayer,
    index_d$4_TileLayer as TileLayer,
    index_d$4_gas as gas,
    index_d$4_fire as fire,
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
declare function install$1(id: string, horde: string | Horde | HordeConfig): Horde;
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

type index_d$3_HordeConfig = HordeConfig;
type index_d$3_HordeFlagsType = HordeFlagsType;
type index_d$3_SpawnOptions = SpawnOptions;
type index_d$3_Horde = Horde;
declare const index_d$3_Horde: typeof Horde;
declare const index_d$3_hordes: typeof hordes;
declare const index_d$3_installAll: typeof installAll;
declare const index_d$3_from: typeof from;
type index_d$3_MatchOptions = MatchOptions;
declare const index_d$3_random: typeof random;
declare namespace index_d$3 {
  export {
    index_d$3_HordeConfig as HordeConfig,
    index_d$3_HordeFlagsType as HordeFlagsType,
    index_d$3_SpawnOptions as SpawnOptions,
    index_d$3_Horde as Horde,
    index_d$3_hordes as hordes,
    install$1 as install,
    index_d$3_installAll as installAll,
    index_d$3_from as from,
    index_d$3_MatchOptions as MatchOptions,
    index_d$3_random as random,
  };
}

declare const empty: {};

declare const index_d$2_empty: typeof empty;
declare namespace index_d$2 {
  export {
    index_d$2_empty as empty,
  };
}

declare class BasicDrawer implements CellDrawer {
    scent: boolean;
    constructor();
    drawInto(dest: DrawDest, map: Map, opts?: Partial<MapDrawOptions>): void;
    drawCell(dest: GWU.sprite.Mixer, map: Map, cell: Cell, fov?: GWU.fov.FovTracker | null): boolean;
    getAppearance(dest: GWU.sprite.Mixer, map: Map, cell: Cell): void;
    applyLight(dest: GWU.sprite.Mixer, cell: Cell, fov?: GWU.fov.FovTracker | null): void;
}

type index_d$1_CellDrawFn = CellDrawFn;
type index_d$1_MapDrawOptions = MapDrawOptions;
type index_d$1_DrawDest = DrawDest;
type index_d$1_CellDrawer = CellDrawer;
type index_d$1_BasicDrawer = BasicDrawer;
declare const index_d$1_BasicDrawer: typeof BasicDrawer;
declare namespace index_d$1 {
  export {
    index_d$1_CellDrawFn as CellDrawFn,
    index_d$1_MapDrawOptions as MapDrawOptions,
    index_d$1_DrawDest as DrawDest,
    index_d$1_CellDrawer as CellDrawer,
    index_d$1_BasicDrawer as BasicDrawer,
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
declare function flashSprite(map: Map, x: number, y: number, sprite: string | GWU.sprite.SpriteConfig, duration?: number, count?: number): GWU.tween.Tween;
declare function hit(map: Map, target: GWU.xy.XY, sprite?: string | GWU.sprite.SpriteConfig, duration?: number): GWU.tween.Tween;
declare function miss(map: Map, target: GWU.xy.XY, sprite?: string | GWU.sprite.SpriteConfig, duration?: number): GWU.tween.Tween;
declare function fadeInOut(map: Map, x: number, y: number, sprite: string | GWU.sprite.SpriteConfig, duration?: number): GWU.tween.Tween;
interface MoveOptions {
    speed?: number;
    duration?: number;
    stopBeforeWalls?: boolean;
    stepFn?: FxStepFn;
}
declare function moveSprite(map: Map, source: GWU.xy.XY | GWU.xy.Loc, target: GWU.xy.XY | GWU.xy.Loc, sprite: string | GWU.sprite.SpriteConfig, opts?: MoveOptions): GWU.tween.Tween;
declare function bolt(map: Map, source: GWU.xy.XY | GWU.xy.Loc, target: GWU.xy.XY | GWU.xy.Loc, sprite: string | GWU.sprite.SpriteConfig, opts?: MoveOptions): GWU.tween.Tween;
interface ProjectileOptions extends MoveOptions {
}
declare function projectile(map: Map, source: Actor, target: Actor, sprite: string | GWU.sprite.SpriteConfig, opts?: ProjectileOptions): GWU.tween.Tween;
interface BeamOptions {
    fade?: number;
    speed?: number;
    duration?: number;
    stopAtWalls?: boolean;
    stopBeforeWalls?: boolean;
    stepFn?: FxStepFn;
}
declare function beam(map: Map, from: GWU.xy.XY | GWU.xy.Loc, to: GWU.xy.XY | GWU.xy.Loc, sprite: string | GWU.sprite.SpriteConfig, opts?: BeamOptions): GWU.tween.Tween;
declare type ExplosionShape = 'o' | 'x' | 'X' | '+' | '*';
interface ExplosionOptions {
    speed?: number;
    duration?: number;
    fade?: number;
    shape?: ExplosionShape;
    center?: boolean;
    stepFn?: FxStepFn;
}
declare function explosion(map: Map, x: number, y: number, radius: number, sprite: string | GWU.sprite.SpriteConfig, opts?: ExplosionOptions): GWU.tween.Tween;

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

declare function make(id: string | PlayerKind | KindOptions$1, makeOptions?: any): Player;
declare function install(id: string, kind: PlayerKind | KindOptions$1): PlayerKind;
declare function get(id: string | PlayerKind): PlayerKind | null;
declare function makeKind(info: KindOptions$1): PlayerKind;

type index_d_Modifier = Modifier;
type index_d_Adjustment = Adjustment;
type index_d_ChangeCallback = ChangeCallback;
type index_d_Attributes = Attributes;
declare const index_d_Attributes: typeof Attributes;
declare const index_d_attributes: typeof attributes;
declare const index_d_installAttribute: typeof installAttribute;
declare const index_d_makeAttributes: typeof makeAttributes;
type index_d_SkillInfo = SkillInfo;
type index_d_Skills = Skills;
declare const index_d_Skills: typeof Skills;
type index_d_PlayerKind = PlayerKind;
declare const index_d_PlayerKind: typeof PlayerKind;
type index_d_Player = Player;
declare const index_d_Player: typeof Player;
declare const index_d_make: typeof make;
declare const index_d_install: typeof install;
declare const index_d_get: typeof get;
declare const index_d_makeKind: typeof makeKind;
declare namespace index_d {
  export {
    index_d_Modifier as Modifier,
    index_d_Adjustment as Adjustment,
    index_d_ChangeCallback as ChangeCallback,
    index_d_Attributes as Attributes,
    index_d_attributes as attributes,
    index_d_installAttribute as installAttribute,
    index_d_makeAttributes as makeAttributes,
    index_d_SkillInfo as SkillInfo,
    index_d_Skills as Skills,
    KindOptions$1 as KindOptions,
    index_d_PlayerKind as PlayerKind,
    index_d_Player as Player,
    index_d_make as make,
    index_d_install as install,
    index_d_get as get,
    index_d_makeKind as makeKind,
  };
}

export { index_d$a as action, index_d$6 as actions, index_d$c as actor, index_d$d as ai, index_d$1 as draw, index_d$9 as effect, index_d$5 as effects, index_d$7 as entity, index_d$g as flags, fx_d as fx, index_d$b as game, index_d$3 as horde, index_d$e as item, index_d$4 as layer, index_d$8 as map, index_d$2 as memory, index_d as player, index_d$f as tile };
