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
    STALE_COST_MAP,
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

type index_d$f_Depth = Depth;
declare const index_d$f_Depth: typeof Depth;
type index_d$f_DepthString = DepthString;
type index_d$f_TileMech = TileMech;
declare const index_d$f_TileMech: typeof TileMech;
declare namespace index_d$f {
  export {
    index_d$f_Depth as Depth,
    index_d$f_DepthString as DepthString,
    Entity$1 as Entity,
    Actor$1 as Actor,
    Item$1 as Item,
    Tile$1 as Tile,
    index_d$f_TileMech as TileMech,
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

interface FlagType extends FlagType$1 {
    item: number;
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

interface KindOptions$3 extends KindOptions$1 {
    attributes?: Record<string, number>;
    skills?: Record<string, number | boolean>;
    stats?: Record<string, number>;
}
declare class PlayerKind extends ActorKind {
    attributes: Attributes;
    skills: Skills;
    constructor(opts?: Partial<KindOptions$3>);
    make(options?: MakeOptions$1): Player;
}

declare class Player extends Actor {
    static default: {
        ch: string;
        fg: string;
        name: string;
    };
    kind: PlayerKind;
    constructor(kind: PlayerKind);
}

declare type CommandFn = (this: Game, actor: Actor, ev: GWU.io.Event) => Promise<number>;
declare type CommandBase = boolean | CommandFn;
declare const actions: Record<string, CommandFn>;
declare function install$7(name: string, fn: CommandFn): void;
declare function get$5(name: string): CommandFn | undefined;

declare function moveDir$1(this: Game, actor: Actor, e: GWU.io.Event): Promise<number>;

declare function pickup(this: Game, actor: Actor, _ev: GWU.io.Event): Promise<number>;

type index_d$e_CommandFn = CommandFn;
type index_d$e_CommandBase = CommandBase;
declare const index_d$e_actions: typeof actions;
declare const index_d$e_pickup: typeof pickup;
declare namespace index_d$e {
  export {
    index_d$e_CommandFn as CommandFn,
    index_d$e_CommandBase as CommandBase,
    index_d$e_actions as actions,
    install$7 as install,
    get$5 as get,
    moveDir$1 as moveDir,
    index_d$e_pickup as pickup,
  };
}

interface GameOptions extends GWU.ui.UIOptions {
    ui?: GWU.ui.UI;
    makeMap: MakeMapFn;
    makePlayer: MakePlayerFn;
    startMap: StartMapFn;
    keymap: Record<string, string | CommandFn>;
}
declare type MakeMapFn = (id: number) => Map;
declare type MakePlayerFn = () => Player;
declare type StartMapFn = (map: Map, player: Player) => void;
declare class Game {
    ui: GWU.ui.UI;
    layer: GWU.ui.Layer;
    buffer: GWU.canvas.Buffer;
    io: GWU.io.Handler;
    scheduler: GWU.scheduler.Scheduler;
    player: Player;
    map: Map;
    _makeMap: MakeMapFn;
    _makePlayer: MakePlayerFn;
    _startMap: StartMapFn;
    running: boolean;
    keymap: Record<string, string | CommandFn>;
    constructor(opts: GameOptions);
    start(): Promise<void>;
    draw(): void;
    finish(): void;
    runTurn(): Promise<void>;
    animate(): Promise<void>;
    playerTurn(player: Player): Promise<number>;
}

type index_d$d_GameOptions = GameOptions;
type index_d$d_MakeMapFn = MakeMapFn;
type index_d$d_MakePlayerFn = MakePlayerFn;
type index_d$d_StartMapFn = StartMapFn;
type index_d$d_Game = Game;
declare const index_d$d_Game: typeof Game;
declare namespace index_d$d {
  export {
    index_d$d_GameOptions as GameOptions,
    index_d$d_MakeMapFn as MakeMapFn,
    index_d$d_MakePlayerFn as MakePlayerFn,
    index_d$d_StartMapFn as StartMapFn,
    index_d$d_Game as Game,
  };
}

interface KindOptions$2 extends KindOptions {
    flags?: GWU.flag.FlagBase;
    actions?: Record<string, ItemActionBase>;
    bump?: string | ItemActionFn | (string | ItemActionFn)[];
}
interface MakeOptions$2 extends MakeOptions {
    quantity: number;
}
declare class ItemKind extends EntityKind {
    flags: FlagType;
    actions: Record<string, ItemActionBase>;
    bump: (string | ItemActionFn)[];
    constructor(config: KindOptions$2);
    make(options?: Partial<MakeOptions$2>): Item;
    init(item: Item, options?: Partial<MakeOptions$2>): void;
}

declare function make$6(id: string | ItemKind, makeOptions?: any): Item;
declare function makeRandom$1(opts: Partial<MatchOptions$2> | string, makeOptions?: any): Item;
declare function from$5(info: string | ItemKind | KindOptions$2, makeOptions?: any): Item;
declare const kinds$1: Record<string, ItemKind>;
declare function install$6(id: string, kind: ItemKind | KindOptions$2): ItemKind;
declare function get$4(id: string | ItemKind): ItemKind | null;
declare function makeKind$2(info: KindOptions$2): ItemKind;
interface MatchOptions$2 {
    tags: string | string[];
    forbidTags: string | string[];
    rng: GWU.rng.Random;
}
declare function randomKind$1(opts?: Partial<MatchOptions$2> | string): ItemKind | null;

type index_d$c_FlagType = FlagType;
type index_d$c_ItemKind = ItemKind;
declare const index_d$c_ItemKind: typeof ItemKind;
type index_d$c_Item = Item;
declare const index_d$c_Item: typeof Item;
declare namespace index_d$c {
  export {
    index_d$c_FlagType as FlagType,
    KindOptions$2 as KindOptions,
    MakeOptions$2 as MakeOptions,
    index_d$c_ItemKind as ItemKind,
    index_d$c_Item as Item,
    make$6 as make,
    makeRandom$1 as makeRandom,
    from$5 as from,
    kinds$1 as kinds,
    install$6 as install,
    get$4 as get,
    makeKind$2 as makeKind,
    MatchOptions$2 as MatchOptions,
    randomKind$1 as randomKind,
  };
}

interface ActorActionCtx {
    actor?: Actor | null;
    item?: Item | null;
    dir?: GWU.xy.Loc | null;
    loc?: GWU.xy.Loc | null;
}
declare type ActorActionFn = (game: Game, actor: Actor, ctx?: ActorActionCtx) => Promise<number>;
declare type ActorActionBase = boolean | ActorActionFn;
declare const installedActions: Record<string, ActorActionFn>;
declare function installAction(name: string, fn: ActorActionFn): void;
declare function getAction(name: string): ActorActionFn | null;

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
declare function make$5(opts: EffectBase): Effect;
declare function from$4(opts: EffectBase): Effect;
declare const installedEffects: Record<string, Effect>;
declare function install$5(id: string, config: EffectBase): Effect;
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
declare function make$4(options: Partial<TileOptions>): Tile;
declare const tiles: Record<string, Tile>;
declare const all: Tile[];
declare function get$3(id: string | number | Tile): Tile;
declare function install$4(id: string, options: Partial<TileOptions>): Tile;
declare function install$4(id: string, base: string, options: Partial<TileOptions>): Tile;
declare function installAll$1(tiles: Record<string, Partial<TileOptions>>): void;

declare const flags: {
    Tile: typeof Tile$1;
    TileMech: typeof TileMech;
};

declare const index_d$b_flags: typeof flags;
type index_d$b_TileFlags = TileFlags;
type index_d$b_TileConfig = TileConfig;
type index_d$b_Tile = Tile;
declare const index_d$b_Tile: typeof Tile;
type index_d$b_TileOptions = TileOptions;
declare const index_d$b_tiles: typeof tiles;
declare const index_d$b_all: typeof all;
declare namespace index_d$b {
  export {
    index_d$b_flags as flags,
    index_d$b_TileFlags as TileFlags,
    TextOptions$1 as TextOptions,
    index_d$b_TileConfig as TileConfig,
    index_d$b_Tile as Tile,
    index_d$b_TileOptions as TileOptions,
    make$4 as make,
    index_d$b_tiles as tiles,
    index_d$b_all as all,
    get$3 as get,
    install$4 as install,
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

type index_d$a_MapLayer = MapLayer;
declare const index_d$a_MapLayer: typeof MapLayer;
type index_d$a_TileLayer = TileLayer;
declare const index_d$a_TileLayer: typeof TileLayer;
type index_d$a_GasLayer = GasLayer;
declare const index_d$a_GasLayer: typeof GasLayer;
type index_d$a_FireLayer = FireLayer;
declare const index_d$a_FireLayer: typeof FireLayer;
declare namespace index_d$a {
  export {
    index_d$a_MapLayer as MapLayer,
    index_d$a_TileLayer as TileLayer,
    index_d$a_GasLayer as GasLayer,
    index_d$a_FireLayer as FireLayer,
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

interface NoursihConfig {
    type: AdjustType;
    amount: GWU.range.RangeBase;
}
interface NourishInfo {
    type: AdjustType;
    amount: GWU.range.Range;
}
declare function makeNourishEffect(opts: any): EffectFn;
declare function nourishEffect(config: NourishInfo, loc: MapXY, _ctx?: EffectCtx): boolean;
declare namespace nourishEffect {
    var _a: {
        pukeMsg: string;
    };
    export { _a as default };
}

interface StatConfig {
    stat: string;
    type?: AdjustType;
    amount?: GWU.range.RangeBase;
}
interface StatInfo {
    stat: string;
    type: AdjustType;
    amount: GWU.range.Range;
}
declare function makeStatEffect(opts: any): EffectFn;
declare function statEffect(config: StatInfo, loc: MapXY, _ctx?: EffectCtx): boolean;

type index_d$9_EffectCtx = EffectCtx;
type index_d$9_MapXY = MapXY;
type index_d$9_EffectFn = EffectFn;
type index_d$9_HandlerFn = HandlerFn;
declare const index_d$9_handlers: typeof handlers;
declare const index_d$9_installHandler: typeof installHandler;
type index_d$9_MakeEffectFn = MakeEffectFn;
declare const index_d$9_effectTypes: typeof effectTypes;
declare const index_d$9_installType: typeof installType;
type index_d$9_Effect = Effect;
type index_d$9_EffectConfig = EffectConfig;
type index_d$9_EffectBase = EffectBase;
declare const index_d$9_installedEffects: typeof installedEffects;
declare const index_d$9_resetAll: typeof resetAll;
type index_d$9_BasicEffect = BasicEffect;
declare const index_d$9_BasicEffect: typeof BasicEffect;
declare const index_d$9_makeBasicEffect: typeof makeBasicEffect;
declare const index_d$9_makeSpreadEffect: typeof makeSpreadEffect;
type index_d$9_SpreadEffect = SpreadEffect;
declare const index_d$9_SpreadEffect: typeof SpreadEffect;
declare const index_d$9_mapDisruptedBy: typeof mapDisruptedBy;
declare const index_d$9_computeSpawnMap: typeof computeSpawnMap;
declare const index_d$9_clearCells: typeof clearCells;
declare const index_d$9_evacuateCreatures: typeof evacuateCreatures;
declare const index_d$9_evacuateItems: typeof evacuateItems;
declare const index_d$9_makeEmitHandler: typeof makeEmitHandler;
declare const index_d$9_emitEffect: typeof emitEffect;
declare const index_d$9_makeMessageHandler: typeof makeMessageHandler;
declare const index_d$9_messageEffect: typeof messageEffect;
declare const index_d$9_makeActivateMachine: typeof makeActivateMachine;
declare const index_d$9_activateMachine: typeof activateMachine;
type index_d$9_TileEffectOptions = TileEffectOptions;
declare const index_d$9_makeTileHandler: typeof makeTileHandler;
declare const index_d$9_tileEffect: typeof tileEffect;
declare const index_d$9_makeClearHandler: typeof makeClearHandler;
declare const index_d$9_clearEffect: typeof clearEffect;
declare const index_d$9_makeFeatureHandler: typeof makeFeatureHandler;
declare const index_d$9_featureEffect: typeof featureEffect;
type index_d$9_NoursihConfig = NoursihConfig;
type index_d$9_NourishInfo = NourishInfo;
declare const index_d$9_makeNourishEffect: typeof makeNourishEffect;
declare const index_d$9_nourishEffect: typeof nourishEffect;
type index_d$9_StatConfig = StatConfig;
type index_d$9_StatInfo = StatInfo;
declare const index_d$9_makeStatEffect: typeof makeStatEffect;
declare const index_d$9_statEffect: typeof statEffect;
declare namespace index_d$9 {
  export {
    index_d$9_EffectCtx as EffectCtx,
    index_d$9_MapXY as MapXY,
    index_d$9_EffectFn as EffectFn,
    index_d$9_HandlerFn as HandlerFn,
    index_d$9_handlers as handlers,
    index_d$9_installHandler as installHandler,
    index_d$9_MakeEffectFn as MakeEffectFn,
    index_d$9_effectTypes as effectTypes,
    index_d$9_installType as installType,
    index_d$9_Effect as Effect,
    index_d$9_EffectConfig as EffectConfig,
    index_d$9_EffectBase as EffectBase,
    make$5 as make,
    from$4 as from,
    index_d$9_installedEffects as installedEffects,
    install$5 as install,
    installAll$2 as installAll,
    index_d$9_resetAll as resetAll,
    index_d$9_BasicEffect as BasicEffect,
    index_d$9_makeBasicEffect as makeBasicEffect,
    index_d$9_makeSpreadEffect as makeSpreadEffect,
    index_d$9_SpreadEffect as SpreadEffect,
    index_d$9_mapDisruptedBy as mapDisruptedBy,
    index_d$9_computeSpawnMap as computeSpawnMap,
    index_d$9_clearCells as clearCells,
    index_d$9_evacuateCreatures as evacuateCreatures,
    index_d$9_evacuateItems as evacuateItems,
    index_d$9_makeEmitHandler as makeEmitHandler,
    index_d$9_emitEffect as emitEffect,
    index_d$9_makeMessageHandler as makeMessageHandler,
    index_d$9_messageEffect as messageEffect,
    index_d$9_makeActivateMachine as makeActivateMachine,
    index_d$9_activateMachine as activateMachine,
    index_d$9_TileEffectOptions as TileEffectOptions,
    index_d$9_makeTileHandler as makeTileHandler,
    index_d$9_tileEffect as tileEffect,
    index_d$9_makeClearHandler as makeClearHandler,
    index_d$9_clearEffect as clearEffect,
    index_d$9_makeFeatureHandler as makeFeatureHandler,
    index_d$9_featureEffect as featureEffect,
    index_d$9_NoursihConfig as NoursihConfig,
    index_d$9_NourishInfo as NourishInfo,
    index_d$9_makeNourishEffect as makeNourishEffect,
    index_d$9_nourishEffect as nourishEffect,
    index_d$9_StatConfig as StatConfig,
    index_d$9_StatInfo as StatInfo,
    index_d$9_makeStatEffect as makeStatEffect,
    index_d$9_statEffect as statEffect,
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
declare type LayerType = TileLayer;
declare class Map implements GWU.light.LightSystemSite, MapType, GWU.tween.Animator {
    cells: GWU.grid.Grid<Cell>;
    layers: LayerType[];
    flags: {
        map: 0;
    };
    light: GWU.light.LightSystemType;
    properties: Record<string, any>;
    rng: GWU.rng.Random;
    actors: Actor[];
    items: Item[];
    drawer: CellDrawer;
    fx: Entity[];
    _animations: GWU.tween.Animation[];
    events: GWU.events.EventEmitter<MapEvents>;
    constructor(width: number, height: number, opts?: Partial<MapOptions>);
    get seed(): number;
    set seed(v: number);
    get width(): number;
    get height(): number;
    initLayers(): void;
    addLayer(depth: number | keyof typeof Depth, layer: LayerType): void;
    removeLayer(depth: number | keyof typeof Depth): void;
    getLayer(depth: number | keyof typeof Depth): LayerType | null;
    hasXY(x: number, y: number): boolean;
    isBoundaryXY(x: number, y: number): boolean;
    cell(x: number, y: number): CellType;
    _cell(x: number, y: number): Cell;
    get(x: number, y: number): Cell | undefined;
    eachCell(cb: EachCellCb): void;
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
declare function make$3(w: number, h: number, floor?: string, boundary?: string): Map;
declare function make$3(w: number, h: number, floor: string): Map;
declare function make$3(w: number, h: number, opts: Partial<MapOptions>): Map;
declare function from$3(prefab: string | string[] | GWU.grid.NumGrid, charToTile: Record<string, string | null>, opts?: Partial<MapOptions>): Map;

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
declare function get$2(actor: Actor, map: MapType): Memory;

type index_d$8_ActorInfo = ActorInfo;
type index_d$8_ItemInfo = ItemInfo;
type index_d$8_Memory = Memory;
declare const index_d$8_Memory: typeof Memory;
declare const index_d$8_store: typeof store;
declare namespace index_d$8 {
  export {
    index_d$8_ActorInfo as ActorInfo,
    index_d$8_ItemInfo as ItemInfo,
    index_d$8_Memory as Memory,
    index_d$8_store as store,
    get$2 as get,
  };
}

declare type ActorAiFn = (game: Game, actor: Actor) => Promise<number>;
declare const ais: Record<string, ActorAiFn>;
declare function install$3(name: string, fn: ActorAiFn): void;

interface PickupOptions {
    admin: boolean;
}
interface DropOptions {
    admin: boolean;
}
declare class Actor extends Entity {
    flags: ActorFlags;
    kind: ActorKind;
    ai: ActorAiFn | null;
    leader: Actor | null;
    items: Item | null;
    fov: GWU.fov.FovSystem | null;
    memory: Memory | null;
    visionDistance: number;
    stats: Stats;
    status: Status;
    data: Record<string, number>;
    _costMap: GWU.grid.NumGrid | null;
    next: Actor | null;
    constructor(kind: ActorKind);
    copy(other: Actor): void;
    destroy(): void;
    hasActorFlag(flag: number): boolean;
    hasAllActorFlags(flags: number): boolean;
    actorFlags(): number;
    setActorFlag(flag: number): void;
    clearActorFlag(flag: number): void;
    isPlayer(): boolean;
    isDead(): boolean;
    getAction(name: string): ActorActionBase;
    getBumpActions(): (ActorActionFn | string)[];
    canSee(x: number, y: number): boolean;
    canSee(entity: Entity): boolean;
    canSeeOrSense(x: number, y: number): boolean;
    canSeeOrSense(entity: Entity): boolean;
    isAbleToSee(entity: Entity): boolean;
    isAbleToSense(entity: Entity): boolean;
    act(game: Game): Promise<number>;
    moveSpeed(): number;
    startTurn(): void;
    endTurn(pct?: number): number;
    willAttack(_other: Actor): boolean;
    avoidsItem(_item: Item): boolean;
    canAddItem(_item: Item): boolean;
    addItem(_item: Item): void;
    pickupItem(item: Item, opts?: Partial<PickupOptions>): boolean;
    dropItem(item: Item, opts?: Partial<DropOptions>): boolean;
    addToMap(map: MapType, x: number, y: number): boolean;
    removeFromMap(): void;
    costMap(): GWU.grid.NumGrid;
}

declare type ItemActionFn = (game: Game, actor: Actor, item: Item) => Promise<number>;
declare type ItemActionBase = boolean | ItemActionFn;

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
    getAction(name: string): ItemActionBase | undefined;
    getBumpActions(): (ItemActionFn | string)[];
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

type index_d$7_CellFlags = CellFlags;
type index_d$7_MapFlags = MapFlags;
type index_d$7_SetOptions = SetOptions;
type index_d$7_SetTileOptions = SetTileOptions;
type index_d$7_TileData = TileData;
type index_d$7_TileArray = TileArray;
type index_d$7_CellInfoType = CellInfoType;
type index_d$7_CellType = CellType;
type index_d$7_EachCellCb = EachCellCb;
type index_d$7_EachItemCb = EachItemCb;
type index_d$7_EachActorCb = EachActorCb;
type index_d$7_MapTestFn = MapTestFn;
type index_d$7_MapEvents = MapEvents;
type index_d$7_MapType = MapType;
type index_d$7_Cell = Cell;
declare const index_d$7_Cell: typeof Cell;
type index_d$7_MapOptions = MapOptions;
type index_d$7_LayerType = LayerType;
type index_d$7_Map = Map;
declare const index_d$7_Map: typeof Map;
declare const index_d$7_analyze: typeof analyze;
declare const index_d$7_updateChokepoints: typeof updateChokepoints;
declare const index_d$7_floodFillCount: typeof floodFillCount;
declare const index_d$7_updateLoopiness: typeof updateLoopiness;
declare const index_d$7_resetLoopiness: typeof resetLoopiness;
declare const index_d$7_checkLoopiness: typeof checkLoopiness;
declare const index_d$7_fillInnerLoopGrid: typeof fillInnerLoopGrid;
declare const index_d$7_cleanLoopiness: typeof cleanLoopiness;
type index_d$7_Snapshot = Snapshot;
declare const index_d$7_Snapshot: typeof Snapshot;
type index_d$7_SnapshotManager = SnapshotManager;
declare const index_d$7_SnapshotManager: typeof SnapshotManager;
declare const index_d$7_isHallway: typeof isHallway;
declare namespace index_d$7 {
  export {
    index_d$7_CellFlags as CellFlags,
    index_d$7_MapFlags as MapFlags,
    index_d$7_SetOptions as SetOptions,
    index_d$7_SetTileOptions as SetTileOptions,
    index_d$7_TileData as TileData,
    index_d$7_TileArray as TileArray,
    index_d$7_CellInfoType as CellInfoType,
    index_d$7_CellType as CellType,
    index_d$7_EachCellCb as EachCellCb,
    index_d$7_EachItemCb as EachItemCb,
    index_d$7_EachActorCb as EachActorCb,
    index_d$7_MapTestFn as MapTestFn,
    index_d$7_MapEvents as MapEvents,
    index_d$7_MapType as MapType,
    index_d$7_Cell as Cell,
    index_d$7_MapOptions as MapOptions,
    index_d$7_LayerType as LayerType,
    index_d$7_Map as Map,
    make$3 as make,
    from$3 as from,
    index_d$7_analyze as analyze,
    index_d$7_updateChokepoints as updateChokepoints,
    index_d$7_floodFillCount as floodFillCount,
    index_d$7_updateLoopiness as updateLoopiness,
    index_d$7_resetLoopiness as resetLoopiness,
    index_d$7_checkLoopiness as checkLoopiness,
    index_d$7_fillInnerLoopGrid as fillInnerLoopGrid,
    index_d$7_cleanLoopiness as cleanLoopiness,
    index_d$7_Snapshot as Snapshot,
    index_d$7_SnapshotManager as SnapshotManager,
    index_d$7_isHallway as isHallway,
  };
}

interface KindOptions$1 extends KindOptions {
    flags?: GWU.flag.FlagBase;
    vision?: number;
    stats?: Record<string, GWU.range.RangeBase>;
    actions?: Record<string, ActorActionBase>;
    moveSpeed?: number;
    ai?: string | ActorAiFn;
    bump?: ActorActionFn | string | (ActorActionFn | string)[];
}
interface MakeOptions$1 extends MakeOptions {
    fov?: GWU.fov.FovSystem;
    memory?: Memory;
}
declare class ActorKind extends EntityKind {
    flags: ActorFlags;
    vision: Record<string, number>;
    stats: Record<string, GWU.range.RangeBase>;
    actions: Record<string, ActorActionBase>;
    bump: (ActorActionFn | string)[];
    moveSpeed: number;
    ai: ActorAiFn | null;
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

declare function make$2(id: string | ActorKind, makeOptions?: any): Actor;
declare function makeRandom(opts: Partial<MatchOptions$1> | string, makeOptions?: any): Actor;
declare function from$2(info: string | ActorKind | KindOptions$1, makeOptions?: any): Actor;
declare const kinds: Record<string, ActorKind>;
declare function install$2(id: string, kind: ActorKind | KindOptions$1): ActorKind;
declare function get$1(id: string | ActorKind): ActorKind | null;
declare function makeKind$1(info: KindOptions$1): ActorKind;
interface MatchOptions$1 {
    tags: string | string[];
    forbidTags: string | string[];
    rng: GWU.rng.Random;
}
declare function randomKind(opts?: Partial<MatchOptions$1> | string): ActorKind | null;

declare function bump(game: Game, actor: Actor, ctx?: ActorActionCtx): Promise<number>;

declare function moveDir(game: Game, actor: Actor, ctx?: ActorActionCtx): Promise<number>;

declare function standStill$1(_game: Game, actor: Actor, _ctx?: ActorActionCtx): Promise<number>;

declare const index_d$6_bump: typeof bump;
declare const index_d$6_moveDir: typeof moveDir;
declare namespace index_d$6 {
  export {
    index_d$6_bump as bump,
    index_d$6_moveDir as moveDir,
    standStill$1 as standStill,
  };
}

type index_d$5_PainMessages = PainMessages;
declare const index_d$5_PainMessages: typeof PainMessages;
declare const index_d$5_painMessages: typeof painMessages;
declare const index_d$5_installPain: typeof installPain;
declare const index_d$5_getPain: typeof getPain;
type index_d$5_AdjustType = AdjustType;
type index_d$5_StatOptions = StatOptions;
type index_d$5_StatAdjustment = StatAdjustment;
type index_d$5_RegenInfo = RegenInfo;
type index_d$5_Stats = Stats;
declare const index_d$5_Stats: typeof Stats;
type index_d$5_StatusCallback = StatusCallback;
type index_d$5_Status = Status;
declare const index_d$5_Status: typeof Status;
type index_d$5_ActorFlags = ActorFlags;
type index_d$5_ActorKind = ActorKind;
declare const index_d$5_ActorKind: typeof ActorKind;
type index_d$5_PickupOptions = PickupOptions;
type index_d$5_DropOptions = DropOptions;
type index_d$5_Actor = Actor;
declare const index_d$5_Actor: typeof Actor;
declare const index_d$5_makeRandom: typeof makeRandom;
declare const index_d$5_kinds: typeof kinds;
declare const index_d$5_randomKind: typeof randomKind;
type index_d$5_ActorActionCtx = ActorActionCtx;
type index_d$5_ActorActionFn = ActorActionFn;
type index_d$5_ActorActionBase = ActorActionBase;
declare const index_d$5_installedActions: typeof installedActions;
declare const index_d$5_installAction: typeof installAction;
declare const index_d$5_getAction: typeof getAction;
declare namespace index_d$5 {
  export {
    index_d$6 as actions,
    index_d$5_PainMessages as PainMessages,
    index_d$5_painMessages as painMessages,
    index_d$5_installPain as installPain,
    index_d$5_getPain as getPain,
    index_d$5_AdjustType as AdjustType,
    index_d$5_StatOptions as StatOptions,
    index_d$5_StatAdjustment as StatAdjustment,
    index_d$5_RegenInfo as RegenInfo,
    index_d$5_Stats as Stats,
    index_d$5_StatusCallback as StatusCallback,
    index_d$5_Status as Status,
    index_d$5_ActorFlags as ActorFlags,
    KindOptions$1 as KindOptions,
    MakeOptions$1 as MakeOptions,
    index_d$5_ActorKind as ActorKind,
    index_d$5_PickupOptions as PickupOptions,
    index_d$5_DropOptions as DropOptions,
    index_d$5_Actor as Actor,
    make$2 as make,
    index_d$5_makeRandom as makeRandom,
    from$2 as from,
    index_d$5_kinds as kinds,
    install$2 as install,
    get$1 as get,
    makeKind$1 as makeKind,
    MatchOptions$1 as MatchOptions,
    index_d$5_randomKind as randomKind,
    index_d$5_ActorActionCtx as ActorActionCtx,
    index_d$5_ActorActionFn as ActorActionFn,
    index_d$5_ActorActionBase as ActorActionBase,
    index_d$5_installedActions as installedActions,
    index_d$5_installAction as installAction,
    index_d$5_getAction as getAction,
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
    canAddItem(item: Item): boolean;
    canRemoveItem(item: Item): boolean;
    hasActor(): boolean;
    hasPlayer(): boolean;
    canAddActor(actor: Actor): boolean;
    canRemoveActor(actor: Actor): boolean;
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
    fireEvent(event: string, ctx?: Partial<EffectCtx>): boolean;
    copy(other: CellInfoType): void;
    needsRedraw: boolean;
    readonly changed: boolean;
}
declare type EachCellCb = (cell: CellType, x: number, y: number, map: MapType) => any;
declare type EachItemCb = (item: Item) => any;
declare type EachActorCb = (actor: Actor) => any;
declare type MapTestFn = (cell: CellType, x: number, y: number, map: MapType) => boolean;
interface MapEvents extends GWU.events.Events {
    actor: (map: MapType, actor: Actor, isNew: boolean) => void;
    item: (map: MapType, item: Item, isNew: boolean) => void;
    fx: (map: MapType, fx: Entity, isNew: boolean) => void;
    cell: (map: MapType, cell: CellType) => void;
}
interface MapType extends GWU.fov.FovSite, GWU.tween.Animator {
    readonly width: number;
    readonly height: number;
    readonly rng: GWU.rng.Random;
    readonly properties: Record<string, any>;
    readonly events: GWU.events.EventEmitter<MapEvents>;
    needsRedraw: boolean;
    actors: Actor[];
    items: Item[];
    light: GWU.light.LightSystemType;
    hasXY(x: number, y: number): boolean;
    isBoundaryXY(x: number, y: number): boolean;
    cell(x: number, y: number): CellType;
    get(x: number, y: number): CellType | undefined;
    eachCell(cb: EachCellCb): void;
    eachItem(cb: EachItemCb): void;
    addItem(x: number, y: number, item: Item, fireEffects?: boolean): boolean;
    removeItem(item: Item, fireEffects?: boolean): boolean;
    moveItem(item: Item, x: number, y: number, fireEffects?: boolean): boolean;
    itemAt(x: number, y: number): Item | null;
    hasItem(x: number, y: number): boolean;
    eachActor(cb: EachActorCb): void;
    addActor(x: number, y: number, actor: Actor, fireEffects?: boolean): boolean;
    removeActor(actor: Actor, fireEffects?: boolean): boolean;
    moveActor(actor: Actor, x: number, y: number, fireEffects?: boolean): boolean;
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
declare function make$1(opts: KindOptions, makeOpts?: MakeOptions): Entity;

type index_d$4_KeyInfoType = KeyInfoType;
type index_d$4_EntityType = EntityType;
type index_d$4_KeyInfo = KeyInfo;
declare const index_d$4_KeyInfo: typeof KeyInfo;
declare const index_d$4_makeKeyInfo: typeof makeKeyInfo;
type index_d$4_TextOptions = TextOptions;
type index_d$4_FlavorOptions = FlavorOptions;
type index_d$4_KindOptions = KindOptions;
type index_d$4_MakeOptions = MakeOptions;
type index_d$4_EntityKind = EntityKind;
declare const index_d$4_EntityKind: typeof EntityKind;
type index_d$4_Entity = Entity;
declare const index_d$4_Entity: typeof Entity;
declare namespace index_d$4 {
  export {
    index_d$4_KeyInfoType as KeyInfoType,
    FlagType$1 as FlagType,
    index_d$4_EntityType as EntityType,
    index_d$4_KeyInfo as KeyInfo,
    index_d$4_makeKeyInfo as makeKeyInfo,
    index_d$4_TextOptions as TextOptions,
    index_d$4_FlavorOptions as FlavorOptions,
    index_d$4_KindOptions as KindOptions,
    index_d$4_MakeOptions as MakeOptions,
    index_d$4_EntityKind as EntityKind,
    make$1 as make,
    index_d$4_Entity as Entity,
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
declare function install$1(id: string, horde: string | Horde | HordeConfig): Horde;
declare function installAll(hordes: Record<string, string | Horde | HordeConfig>): void;
declare function from$1(id: string | Horde | HordeConfig): Horde;
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
    from$1 as from,
    index_d$3_MatchOptions as MatchOptions,
    index_d$3_random as random,
  };
}

declare class BasicDrawer implements CellDrawer {
    isAnyKindOfVisible(_cell: CellType): boolean;
    drawInto(dest: BufferSource | GWU.buffer.Buffer, map: MapType, opts?: Partial<MapDrawOptions>): void;
    drawCell(dest: GWU.sprite.Mixer, cell: CellType, fov?: GWU.fov.FovTracker): boolean;
    getAppearance(dest: GWU.sprite.Mixer, cell: CellType): void;
    applyLight(dest: GWU.sprite.Mixer, cell: CellType, fov?: GWU.fov.FovTracker): void;
}

type index_d$2_CellDrawFn = CellDrawFn;
type index_d$2_MapDrawOptions = MapDrawOptions;
type index_d$2_BufferSource = BufferSource;
type index_d$2_CellDrawer = CellDrawer;
type index_d$2_BasicDrawer = BasicDrawer;
declare const index_d$2_BasicDrawer: typeof BasicDrawer;
declare namespace index_d$2 {
  export {
    index_d$2_CellDrawFn as CellDrawFn,
    index_d$2_MapDrawOptions as MapDrawOptions,
    index_d$2_BufferSource as BufferSource,
    index_d$2_CellDrawer as CellDrawer,
    index_d$2_BasicDrawer as BasicDrawer,
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

declare function make(id: string | PlayerKind, makeOptions?: any): Player;
declare function from(info: string | PlayerKind | KindOptions$3, makeOptions?: any): Player;
declare function install(id: string, kind: PlayerKind | KindOptions$3): PlayerKind;
declare function get(id: string | PlayerKind): PlayerKind | null;
declare function makeKind(info: KindOptions$3): PlayerKind;

type index_d$1_Modifier = Modifier;
type index_d$1_Adjustment = Adjustment;
type index_d$1_ChangeCallback = ChangeCallback;
type index_d$1_Attributes = Attributes;
declare const index_d$1_Attributes: typeof Attributes;
declare const index_d$1_attributes: typeof attributes;
declare const index_d$1_installAttribute: typeof installAttribute;
declare const index_d$1_makeAttributes: typeof makeAttributes;
type index_d$1_SkillInfo = SkillInfo;
type index_d$1_Skills = Skills;
declare const index_d$1_Skills: typeof Skills;
type index_d$1_PlayerKind = PlayerKind;
declare const index_d$1_PlayerKind: typeof PlayerKind;
type index_d$1_Player = Player;
declare const index_d$1_Player: typeof Player;
declare const index_d$1_make: typeof make;
declare const index_d$1_from: typeof from;
declare const index_d$1_install: typeof install;
declare const index_d$1_get: typeof get;
declare const index_d$1_makeKind: typeof makeKind;
declare namespace index_d$1 {
  export {
    index_d$1_Modifier as Modifier,
    index_d$1_Adjustment as Adjustment,
    index_d$1_ChangeCallback as ChangeCallback,
    index_d$1_Attributes as Attributes,
    index_d$1_attributes as attributes,
    index_d$1_installAttribute as installAttribute,
    index_d$1_makeAttributes as makeAttributes,
    index_d$1_SkillInfo as SkillInfo,
    index_d$1_Skills as Skills,
    KindOptions$3 as KindOptions,
    index_d$1_PlayerKind as PlayerKind,
    index_d$1_Player as Player,
    index_d$1_make as make,
    index_d$1_from as from,
    index_d$1_install as install,
    index_d$1_get as get,
    index_d$1_makeKind as makeKind,
  };
}

declare function fillSafetyMap(safetyMap: GWU.grid.NumGrid, actor: Actor, target: Actor): void;

declare class AICtx {
    game: Game;
    actor: Actor;
    target: Actor | null;
    item: Item | null;
    distanceMap: GWU.grid.NumGrid;
    count: number;
    constructor(game: Game, actor: Actor, target?: Actor);
    start(): this;
    done<T>(result: T): T;
}
declare function typical(game: Game, actor: Actor): Promise<number>;
declare function canMoveToward(game: Game, actor: Actor, target: Actor, ctx?: AICtx): boolean;
declare function moveToward(game: Game, actor: Actor, target: Actor, ctx?: AICtx): Promise<number>;
declare function canMoveAwayFrom(game: Game, actor: Actor, target: Actor, ctx?: AICtx): boolean;
declare function moveAwayFrom(_game: Game, actor: Actor, _target: Actor, _ctx?: AICtx): Promise<number>;
declare function canRunAwayFrom(_game: Game, _actor: Actor, _target: Actor, _ctx?: AICtx): boolean;
declare function runAwayFrom(_game: Game, actor: Actor, _target: Actor, _ctx?: AICtx): Promise<number>;
declare function canAttack(_game: Game, _actor: Actor, _target: Actor, _ctx?: AICtx): boolean;
declare function attack(_game: Game, actor: Actor, _target: Actor, _ctx?: AICtx): Promise<number>;
declare function tooFarFrom(_game: Game, _actor: Actor, _target: Actor, _ctx?: AICtx): boolean;
declare function tooCloseTo(_game: Game, _actor: Actor, _target: Actor, _ctx?: AICtx): boolean;
declare function standStill(_game: Game, actor: Actor, _ctx?: AICtx): Promise<number>;

declare const index_d_fillSafetyMap: typeof fillSafetyMap;
type index_d_ActorAiFn = ActorAiFn;
declare const index_d_ais: typeof ais;
type index_d_AICtx = AICtx;
declare const index_d_AICtx: typeof AICtx;
declare const index_d_typical: typeof typical;
declare const index_d_canMoveToward: typeof canMoveToward;
declare const index_d_moveToward: typeof moveToward;
declare const index_d_canMoveAwayFrom: typeof canMoveAwayFrom;
declare const index_d_moveAwayFrom: typeof moveAwayFrom;
declare const index_d_canRunAwayFrom: typeof canRunAwayFrom;
declare const index_d_runAwayFrom: typeof runAwayFrom;
declare const index_d_canAttack: typeof canAttack;
declare const index_d_attack: typeof attack;
declare const index_d_tooFarFrom: typeof tooFarFrom;
declare const index_d_tooCloseTo: typeof tooCloseTo;
declare const index_d_standStill: typeof standStill;
declare namespace index_d {
  export {
    index_d_fillSafetyMap as fillSafetyMap,
    index_d_ActorAiFn as ActorAiFn,
    index_d_ais as ais,
    install$3 as install,
    index_d_AICtx as AICtx,
    index_d_typical as typical,
    index_d_canMoveToward as canMoveToward,
    index_d_moveToward as moveToward,
    index_d_canMoveAwayFrom as canMoveAwayFrom,
    index_d_moveAwayFrom as moveAwayFrom,
    index_d_canRunAwayFrom as canRunAwayFrom,
    index_d_runAwayFrom as runAwayFrom,
    index_d_canAttack as canAttack,
    index_d_attack as attack,
    index_d_tooFarFrom as tooFarFrom,
    index_d_tooCloseTo as tooCloseTo,
    index_d_standStill as standStill,
  };
}

export { index_d$e as action, index_d$5 as actor, index_d as ai, index_d$2 as draw, index_d$9 as effect, index_d$4 as entity, index_d$f as flags, fx_d as fx, index_d$d as game, index_d$3 as horde, index_d$c as item, index_d$a as layer, index_d$7 as map, index_d$8 as memory, path_d as path, index_d$1 as player, index_d$b as tile };
