import { flag, color, make as make$5, utils, message, grid, data, events, random, config as config$1, range, canvas, path, fov, colors } from 'gw-utils';

var Layer;
(function (Layer) {
    Layer[Layer["ALL_LAYERS"] = -1] = "ALL_LAYERS";
    Layer[Layer["GROUND"] = 0] = "GROUND";
    Layer[Layer["LIQUID"] = 1] = "LIQUID";
    Layer[Layer["SURFACE"] = 2] = "SURFACE";
    Layer[Layer["GAS"] = 3] = "GAS";
    Layer[Layer["ITEM"] = 4] = "ITEM";
    Layer[Layer["ACTOR"] = 5] = "ACTOR";
    Layer[Layer["PLAYER"] = 6] = "PLAYER";
    Layer[Layer["FX"] = 7] = "FX";
    Layer[Layer["UI"] = 8] = "UI";
})(Layer || (Layer = {}));
const Fl = flag.fl;
///////////////////////////////////////////////////////
// TILE EVENT
var Activation;
(function (Activation) {
    Activation[Activation["DFF_SUBSEQ_ALWAYS"] = Fl(0)] = "DFF_SUBSEQ_ALWAYS";
    Activation[Activation["DFF_SUBSEQ_EVERYWHERE"] = Fl(1)] = "DFF_SUBSEQ_EVERYWHERE";
    Activation[Activation["DFF_TREAT_AS_BLOCKING"] = Fl(2)] = "DFF_TREAT_AS_BLOCKING";
    Activation[Activation["DFF_PERMIT_BLOCKING"] = Fl(3)] = "DFF_PERMIT_BLOCKING";
    Activation[Activation["DFF_ACTIVATE_DORMANT_MONSTER"] = Fl(4)] = "DFF_ACTIVATE_DORMANT_MONSTER";
    Activation[Activation["DFF_BLOCKED_BY_OTHER_LAYERS"] = Fl(6)] = "DFF_BLOCKED_BY_OTHER_LAYERS";
    Activation[Activation["DFF_SUPERPRIORITY"] = Fl(7)] = "DFF_SUPERPRIORITY";
    Activation[Activation["DFF_AGGRAVATES_MONSTERS"] = Fl(8)] = "DFF_AGGRAVATES_MONSTERS";
    Activation[Activation["DFF_RESURRECT_ALLY"] = Fl(9)] = "DFF_RESURRECT_ALLY";
    Activation[Activation["DFF_EMIT_EVENT"] = Fl(10)] = "DFF_EMIT_EVENT";
    Activation[Activation["DFF_NO_REDRAW_CELL"] = Fl(11)] = "DFF_NO_REDRAW_CELL";
    Activation[Activation["DFF_ABORT_IF_BLOCKS_MAP"] = Fl(12)] = "DFF_ABORT_IF_BLOCKS_MAP";
    Activation[Activation["DFF_BLOCKED_BY_ITEMS"] = Fl(13)] = "DFF_BLOCKED_BY_ITEMS";
    Activation[Activation["DFF_BLOCKED_BY_ACTORS"] = Fl(14)] = "DFF_BLOCKED_BY_ACTORS";
    Activation[Activation["DFF_ALWAYS_FIRE"] = Fl(15)] = "DFF_ALWAYS_FIRE";
    Activation[Activation["DFF_NO_MARK_FIRED"] = Fl(16)] = "DFF_NO_MARK_FIRED";
    // MUST_REPLACE_LAYER
    // NEEDS_EMPTY_LAYER
    Activation[Activation["DFF_PROTECTED"] = Fl(19)] = "DFF_PROTECTED";
    Activation[Activation["DFF_SPREAD_CIRCLE"] = Fl(20)] = "DFF_SPREAD_CIRCLE";
    Activation[Activation["DFF_SPREAD_LINE"] = Fl(21)] = "DFF_SPREAD_LINE";
    Activation[Activation["DFF_NULL_SURFACE"] = Fl(22)] = "DFF_NULL_SURFACE";
    Activation[Activation["DFF_NULL_LIQUID"] = Fl(23)] = "DFF_NULL_LIQUID";
    Activation[Activation["DFF_NULL_GAS"] = Fl(24)] = "DFF_NULL_GAS";
    Activation[Activation["DFF_EVACUATE_CREATURES"] = Fl(25)] = "DFF_EVACUATE_CREATURES";
    Activation[Activation["DFF_EVACUATE_ITEMS"] = Fl(26)] = "DFF_EVACUATE_ITEMS";
    Activation[Activation["DFF_BUILD_IN_WALLS"] = Fl(27)] = "DFF_BUILD_IN_WALLS";
    Activation[Activation["DFF_MUST_TOUCH_WALLS"] = Fl(28)] = "DFF_MUST_TOUCH_WALLS";
    Activation[Activation["DFF_NO_TOUCH_WALLS"] = Fl(29)] = "DFF_NO_TOUCH_WALLS";
    Activation[Activation["DFF_ONLY_IF_EMPTY"] = Activation.DFF_BLOCKED_BY_ITEMS | Activation.DFF_BLOCKED_BY_ACTORS] = "DFF_ONLY_IF_EMPTY";
    Activation[Activation["DFF_NULLIFY_CELL"] = Activation.DFF_NULL_SURFACE | Activation.DFF_NULL_LIQUID | Activation.DFF_NULL_GAS] = "DFF_NULLIFY_CELL";
})(Activation || (Activation = {}));
///////////////////////////////////////////////////////
// TILE
var Tile;
(function (Tile) {
    Tile[Tile["T_LIQUID"] = Fl(0)] = "T_LIQUID";
    Tile[Tile["T_SURFACE"] = Fl(1)] = "T_SURFACE";
    Tile[Tile["T_GAS"] = Fl(2)] = "T_GAS";
    Tile[Tile["T_OBSTRUCTS_PASSABILITY"] = Fl(3)] = "T_OBSTRUCTS_PASSABILITY";
    Tile[Tile["T_OBSTRUCTS_VISION"] = Fl(4)] = "T_OBSTRUCTS_VISION";
    Tile[Tile["T_OBSTRUCTS_ITEMS"] = Fl(5)] = "T_OBSTRUCTS_ITEMS";
    Tile[Tile["T_OBSTRUCTS_SURFACE"] = Fl(6)] = "T_OBSTRUCTS_SURFACE";
    Tile[Tile["T_OBSTRUCTS_GAS"] = Fl(7)] = "T_OBSTRUCTS_GAS";
    Tile[Tile["T_OBSTRUCTS_LIQUID"] = Fl(8)] = "T_OBSTRUCTS_LIQUID";
    Tile[Tile["T_OBSTRUCTS_TILE_EFFECTS"] = Fl(9)] = "T_OBSTRUCTS_TILE_EFFECTS";
    Tile[Tile["T_OBSTRUCTS_DIAGONAL_MOVEMENT"] = Fl(10)] = "T_OBSTRUCTS_DIAGONAL_MOVEMENT";
    Tile[Tile["T_BRIDGE"] = Fl(11)] = "T_BRIDGE";
    Tile[Tile["T_AUTO_DESCENT"] = Fl(12)] = "T_AUTO_DESCENT";
    Tile[Tile["T_LAVA"] = Fl(13)] = "T_LAVA";
    Tile[Tile["T_DEEP_WATER"] = Fl(14)] = "T_DEEP_WATER";
    Tile[Tile["T_SPONTANEOUSLY_IGNITES"] = Fl(15)] = "T_SPONTANEOUSLY_IGNITES";
    Tile[Tile["T_IS_FLAMMABLE"] = Fl(16)] = "T_IS_FLAMMABLE";
    Tile[Tile["T_IS_FIRE"] = Fl(17)] = "T_IS_FIRE";
    Tile[Tile["T_ENTANGLES"] = Fl(18)] = "T_ENTANGLES";
    // T_CAUSES_POISON = Fl(18), // any non-levitating creature gets 10 poison
    // T_CAUSES_DAMAGE = Fl(19), // anything on the tile takes max(1-2, 10%) damage per turn
    // T_CAUSES_NAUSEA = Fl(20), // any creature on the tile becomes nauseous
    // T_CAUSES_PARALYSIS = Fl(21), // anything caught on this tile is paralyzed
    // T_CAUSES_CONFUSION = Fl(22), // causes creatures on this tile to become confused
    // T_CAUSES_HEALING = Fl(23), // heals 20% max HP per turn for any player or non-inanimate monsters
    Tile[Tile["T_IS_TRAP"] = Fl(24)] = "T_IS_TRAP";
    // T_CAUSES_EXPLOSIVE_DAMAGE = Fl(25), // is an explosion; deals higher of 15-20 or 50% damage instantly, but not again for five turns
    Tile[Tile["T_SACRED"] = Fl(26)] = "T_SACRED";
    Tile[Tile["T_UP_STAIRS"] = Fl(27)] = "T_UP_STAIRS";
    Tile[Tile["T_DOWN_STAIRS"] = Fl(28)] = "T_DOWN_STAIRS";
    Tile[Tile["T_PORTAL"] = Fl(29)] = "T_PORTAL";
    Tile[Tile["T_IS_DOOR"] = Fl(30)] = "T_IS_DOOR";
    Tile[Tile["T_HAS_STAIRS"] = Tile.T_UP_STAIRS | Tile.T_DOWN_STAIRS | Tile.T_PORTAL] = "T_HAS_STAIRS";
    Tile[Tile["T_OBSTRUCTS_SCENT"] = Tile.T_OBSTRUCTS_PASSABILITY |
        Tile.T_OBSTRUCTS_VISION |
        Tile.T_AUTO_DESCENT |
        Tile.T_LAVA |
        Tile.T_DEEP_WATER |
        Tile.T_SPONTANEOUSLY_IGNITES |
        Tile.T_HAS_STAIRS] = "T_OBSTRUCTS_SCENT";
    Tile[Tile["T_PATHING_BLOCKER"] = Tile.T_OBSTRUCTS_PASSABILITY |
        Tile.T_AUTO_DESCENT |
        Tile.T_IS_TRAP |
        Tile.T_LAVA |
        Tile.T_DEEP_WATER |
        Tile.T_IS_FIRE |
        Tile.T_SPONTANEOUSLY_IGNITES |
        Tile.T_ENTANGLES] = "T_PATHING_BLOCKER";
    Tile[Tile["T_DIVIDES_LEVEL"] = Tile.T_OBSTRUCTS_PASSABILITY |
        Tile.T_AUTO_DESCENT |
        Tile.T_IS_TRAP |
        Tile.T_LAVA |
        Tile.T_DEEP_WATER] = "T_DIVIDES_LEVEL";
    Tile[Tile["T_LAKE_PATHING_BLOCKER"] = Tile.T_AUTO_DESCENT |
        Tile.T_LAVA |
        Tile.T_DEEP_WATER |
        Tile.T_SPONTANEOUSLY_IGNITES] = "T_LAKE_PATHING_BLOCKER";
    Tile[Tile["T_WAYPOINT_BLOCKER"] = Tile.T_OBSTRUCTS_PASSABILITY |
        Tile.T_AUTO_DESCENT |
        Tile.T_IS_TRAP |
        Tile.T_LAVA |
        Tile.T_DEEP_WATER |
        Tile.T_SPONTANEOUSLY_IGNITES] = "T_WAYPOINT_BLOCKER";
    Tile[Tile["T_MOVES_ITEMS"] = Tile.T_DEEP_WATER | Tile.T_LAVA] = "T_MOVES_ITEMS";
    Tile[Tile["T_CAN_BE_BRIDGED"] = Tile.T_AUTO_DESCENT | Tile.T_LAVA | Tile.T_DEEP_WATER] = "T_CAN_BE_BRIDGED";
    Tile[Tile["T_OBSTRUCTS_EVERYTHING"] = Tile.T_OBSTRUCTS_PASSABILITY |
        Tile.T_OBSTRUCTS_VISION |
        Tile.T_OBSTRUCTS_ITEMS |
        Tile.T_OBSTRUCTS_GAS |
        Tile.T_OBSTRUCTS_SURFACE |
        Tile.T_OBSTRUCTS_LIQUID |
        Tile.T_OBSTRUCTS_DIAGONAL_MOVEMENT] = "T_OBSTRUCTS_EVERYTHING";
    // T_HARMFUL_TERRAIN = T_CAUSES_POISON |
    //   T_IS_FIRE |
    //   T_CAUSES_DAMAGE |
    //   T_CAUSES_PARALYSIS |
    //   T_CAUSES_CONFUSION |
    //   T_CAUSES_EXPLOSIVE_DAMAGE,
    // T_RESPIRATION_IMMUNITIES = T_CAUSES_DAMAGE |
    //   T_CAUSES_CONFUSION |
    //   T_CAUSES_PARALYSIS |
    //   T_CAUSES_NAUSEA,
    Tile[Tile["T_IS_LIQUID"] = Tile.T_LAVA | Tile.T_AUTO_DESCENT | Tile.T_DEEP_WATER] = "T_IS_LIQUID";
    Tile[Tile["T_STAIR_BLOCKERS"] = Tile.T_OBSTRUCTS_ITEMS |
        Tile.T_OBSTRUCTS_SURFACE |
        Tile.T_OBSTRUCTS_GAS |
        Tile.T_OBSTRUCTS_LIQUID |
        Tile.T_OBSTRUCTS_TILE_EFFECTS] = "T_STAIR_BLOCKERS";
})(Tile || (Tile = {}));
///////////////////////////////////////////////////////
// TILE MECH
var TileMech;
(function (TileMech) {
    TileMech[TileMech["TM_IS_SECRET"] = Fl(0)] = "TM_IS_SECRET";
    TileMech[TileMech["TM_PROMOTES_WITH_KEY"] = Fl(1)] = "TM_PROMOTES_WITH_KEY";
    TileMech[TileMech["TM_PROMOTES_WITHOUT_KEY"] = Fl(2)] = "TM_PROMOTES_WITHOUT_KEY";
    TileMech[TileMech["TM_PROMOTES_ON_STEP"] = Fl(3)] = "TM_PROMOTES_ON_STEP";
    TileMech[TileMech["TM_PROMOTES_ON_ITEM_REMOVE"] = Fl(4)] = "TM_PROMOTES_ON_ITEM_REMOVE";
    TileMech[TileMech["TM_PROMOTES_ON_PLAYER_ENTRY"] = Fl(5)] = "TM_PROMOTES_ON_PLAYER_ENTRY";
    TileMech[TileMech["TM_PROMOTES_ON_SACRIFICE_ENTRY"] = Fl(6)] = "TM_PROMOTES_ON_SACRIFICE_ENTRY";
    TileMech[TileMech["TM_PROMOTES_ON_ELECTRICITY"] = Fl(7)] = "TM_PROMOTES_ON_ELECTRICITY";
    TileMech[TileMech["TM_ALLOWS_SUBMERGING"] = Fl(8)] = "TM_ALLOWS_SUBMERGING";
    TileMech[TileMech["TM_IS_WIRED"] = Fl(9)] = "TM_IS_WIRED";
    TileMech[TileMech["TM_IS_CIRCUIT_BREAKER"] = Fl(10)] = "TM_IS_CIRCUIT_BREAKER";
    TileMech[TileMech["TM_EXTINGUISHES_FIRE"] = Fl(14)] = "TM_EXTINGUISHES_FIRE";
    TileMech[TileMech["TM_VANISHES_UPON_PROMOTION"] = Fl(15)] = "TM_VANISHES_UPON_PROMOTION";
    TileMech[TileMech["TM_REFLECTS_BOLTS"] = Fl(16)] = "TM_REFLECTS_BOLTS";
    TileMech[TileMech["TM_STAND_IN_TILE"] = Fl(17)] = "TM_STAND_IN_TILE";
    TileMech[TileMech["TM_LIST_IN_SIDEBAR"] = Fl(18)] = "TM_LIST_IN_SIDEBAR";
    TileMech[TileMech["TM_VISUALLY_DISTINCT"] = Fl(19)] = "TM_VISUALLY_DISTINCT";
    TileMech[TileMech["TM_BRIGHT_MEMORY"] = Fl(20)] = "TM_BRIGHT_MEMORY";
    TileMech[TileMech["TM_EXPLOSIVE_PROMOTE"] = Fl(21)] = "TM_EXPLOSIVE_PROMOTE";
    TileMech[TileMech["TM_CONNECTS_LEVEL"] = Fl(22)] = "TM_CONNECTS_LEVEL";
    TileMech[TileMech["TM_INTERRUPT_EXPLORATION_WHEN_SEEN"] = Fl(23)] = "TM_INTERRUPT_EXPLORATION_WHEN_SEEN";
    TileMech[TileMech["TM_INVERT_WHEN_HIGHLIGHTED"] = Fl(24)] = "TM_INVERT_WHEN_HIGHLIGHTED";
    TileMech[TileMech["TM_SWAP_ENCHANTS_ACTIVATION"] = Fl(25)] = "TM_SWAP_ENCHANTS_ACTIVATION";
    TileMech[TileMech["TM_PROMOTES"] = TileMech.TM_PROMOTES_WITH_KEY |
        TileMech.TM_PROMOTES_WITHOUT_KEY |
        TileMech.TM_PROMOTES_ON_STEP |
        TileMech.TM_PROMOTES_ON_ITEM_REMOVE |
        TileMech.TM_PROMOTES_ON_SACRIFICE_ENTRY |
        TileMech.TM_PROMOTES_ON_ELECTRICITY |
        TileMech.TM_PROMOTES_ON_PLAYER_ENTRY] = "TM_PROMOTES";
})(TileMech || (TileMech = {}));
///////////////////////////////////////////////////////
// CELL
var Cell;
(function (Cell) {
    Cell[Cell["REVEALED"] = Fl(0)] = "REVEALED";
    Cell[Cell["VISIBLE"] = Fl(1)] = "VISIBLE";
    Cell[Cell["WAS_VISIBLE"] = Fl(2)] = "WAS_VISIBLE";
    Cell[Cell["IN_FOV"] = Fl(3)] = "IN_FOV";
    Cell[Cell["HAS_PLAYER"] = Fl(4)] = "HAS_PLAYER";
    Cell[Cell["HAS_MONSTER"] = Fl(5)] = "HAS_MONSTER";
    Cell[Cell["HAS_DORMANT_MONSTER"] = Fl(6)] = "HAS_DORMANT_MONSTER";
    Cell[Cell["HAS_ITEM"] = Fl(7)] = "HAS_ITEM";
    Cell[Cell["HAS_STAIRS"] = Fl(8)] = "HAS_STAIRS";
    Cell[Cell["NEEDS_REDRAW"] = Fl(9)] = "NEEDS_REDRAW";
    Cell[Cell["CELL_CHANGED"] = Fl(10)] = "CELL_CHANGED";
    Cell[Cell["IS_IN_PATH"] = Fl(12)] = "IS_IN_PATH";
    Cell[Cell["IS_CURSOR"] = Fl(13)] = "IS_CURSOR";
    Cell[Cell["MAGIC_MAPPED"] = Fl(14)] = "MAGIC_MAPPED";
    Cell[Cell["ITEM_DETECTED"] = Fl(15)] = "ITEM_DETECTED";
    Cell[Cell["STABLE_MEMORY"] = Fl(16)] = "STABLE_MEMORY";
    Cell[Cell["CLAIRVOYANT_VISIBLE"] = Fl(17)] = "CLAIRVOYANT_VISIBLE";
    Cell[Cell["WAS_CLAIRVOYANT_VISIBLE"] = Fl(18)] = "WAS_CLAIRVOYANT_VISIBLE";
    Cell[Cell["CLAIRVOYANT_DARKENED"] = Fl(19)] = "CLAIRVOYANT_DARKENED";
    Cell[Cell["IMPREGNABLE"] = Fl(20)] = "IMPREGNABLE";
    Cell[Cell["TELEPATHIC_VISIBLE"] = Fl(22)] = "TELEPATHIC_VISIBLE";
    Cell[Cell["WAS_TELEPATHIC_VISIBLE"] = Fl(23)] = "WAS_TELEPATHIC_VISIBLE";
    Cell[Cell["MONSTER_DETECTED"] = Fl(24)] = "MONSTER_DETECTED";
    Cell[Cell["WAS_MONSTER_DETECTED"] = Fl(25)] = "WAS_MONSTER_DETECTED";
    Cell[Cell["LIGHT_CHANGED"] = Fl(27)] = "LIGHT_CHANGED";
    Cell[Cell["CELL_LIT"] = Fl(28)] = "CELL_LIT";
    Cell[Cell["IS_IN_SHADOW"] = Fl(29)] = "IS_IN_SHADOW";
    Cell[Cell["CELL_DARK"] = Fl(30)] = "CELL_DARK";
    Cell[Cell["PERMANENT_CELL_FLAGS"] = Cell.REVEALED |
        Cell.MAGIC_MAPPED |
        Cell.ITEM_DETECTED |
        Cell.HAS_ITEM |
        Cell.HAS_DORMANT_MONSTER |
        Cell.HAS_STAIRS |
        Cell.STABLE_MEMORY |
        Cell.IMPREGNABLE] = "PERMANENT_CELL_FLAGS";
    Cell[Cell["ANY_KIND_OF_VISIBLE"] = Cell.VISIBLE | Cell.CLAIRVOYANT_VISIBLE | Cell.TELEPATHIC_VISIBLE] = "ANY_KIND_OF_VISIBLE";
    Cell[Cell["HAS_ACTOR"] = Cell.HAS_PLAYER | Cell.HAS_MONSTER] = "HAS_ACTOR";
    Cell[Cell["IS_WAS_ANY_KIND_OF_VISIBLE"] = Cell.VISIBLE |
        Cell.WAS_VISIBLE |
        Cell.CLAIRVOYANT_VISIBLE |
        Cell.WAS_CLAIRVOYANT_VISIBLE |
        Cell.TELEPATHIC_VISIBLE |
        Cell.WAS_TELEPATHIC_VISIBLE] = "IS_WAS_ANY_KIND_OF_VISIBLE";
    Cell[Cell["CELL_DEFAULT"] = Cell.VISIBLE | Cell.IN_FOV | Cell.NEEDS_REDRAW | Cell.CELL_CHANGED] = "CELL_DEFAULT";
})(Cell || (Cell = {}));
///////////////////////////////////////////////////////
// CELL MECH
var CellMech;
(function (CellMech) {
    CellMech[CellMech["SEARCHED_FROM_HERE"] = Fl(0)] = "SEARCHED_FROM_HERE";
    CellMech[CellMech["PRESSURE_PLATE_DEPRESSED"] = Fl(1)] = "PRESSURE_PLATE_DEPRESSED";
    CellMech[CellMech["KNOWN_TO_BE_TRAP_FREE"] = Fl(2)] = "KNOWN_TO_BE_TRAP_FREE";
    CellMech[CellMech["CAUGHT_FIRE_THIS_TURN"] = Fl(4)] = "CAUGHT_FIRE_THIS_TURN";
    CellMech[CellMech["EVENT_FIRED_THIS_TURN"] = Fl(5)] = "EVENT_FIRED_THIS_TURN";
    CellMech[CellMech["EVENT_PROTECTED"] = Fl(6)] = "EVENT_PROTECTED";
    CellMech[CellMech["IS_IN_LOOP"] = Fl(10)] = "IS_IN_LOOP";
    CellMech[CellMech["IS_CHOKEPOINT"] = Fl(11)] = "IS_CHOKEPOINT";
    CellMech[CellMech["IS_GATE_SITE"] = Fl(12)] = "IS_GATE_SITE";
    CellMech[CellMech["IS_IN_ROOM_MACHINE"] = Fl(13)] = "IS_IN_ROOM_MACHINE";
    CellMech[CellMech["IS_IN_AREA_MACHINE"] = Fl(14)] = "IS_IN_AREA_MACHINE";
    CellMech[CellMech["IS_POWERED"] = Fl(15)] = "IS_POWERED";
    CellMech[CellMech["IS_IN_MACHINE"] = CellMech.IS_IN_ROOM_MACHINE | CellMech.IS_IN_AREA_MACHINE] = "IS_IN_MACHINE";
    CellMech[CellMech["PERMANENT_MECH_FLAGS"] = CellMech.SEARCHED_FROM_HERE |
        CellMech.PRESSURE_PLATE_DEPRESSED |
        CellMech.KNOWN_TO_BE_TRAP_FREE |
        CellMech.IS_IN_LOOP |
        CellMech.IS_CHOKEPOINT |
        CellMech.IS_GATE_SITE |
        CellMech.IS_IN_MACHINE] = "PERMANENT_MECH_FLAGS";
})(CellMech || (CellMech = {}));
///////////////////////////////////////////////////////
// MAP
var Map;
(function (Map) {
    Map[Map["MAP_CHANGED"] = Fl(0)] = "MAP_CHANGED";
    Map[Map["MAP_STABLE_GLOW_LIGHTS"] = Fl(1)] = "MAP_STABLE_GLOW_LIGHTS";
    Map[Map["MAP_STABLE_LIGHTS"] = Fl(2)] = "MAP_STABLE_LIGHTS";
    Map[Map["MAP_ALWAYS_LIT"] = Fl(3)] = "MAP_ALWAYS_LIT";
    Map[Map["MAP_SAW_WELCOME"] = Fl(4)] = "MAP_SAW_WELCOME";
    Map[Map["MAP_NO_LIQUID"] = Fl(5)] = "MAP_NO_LIQUID";
    Map[Map["MAP_NO_GAS"] = Fl(6)] = "MAP_NO_GAS";
    Map[Map["MAP_FOV_CHANGED"] = Fl(7)] = "MAP_FOV_CHANGED";
    Map[Map["MAP_DEFAULT"] = Map.MAP_STABLE_LIGHTS | Map.MAP_STABLE_GLOW_LIGHTS | Map.MAP_FOV_CHANGED] = "MAP_DEFAULT";
})(Map || (Map = {}));

class TileEvent {
    constructor(opts = {}) {
        if (typeof opts === "function") {
            opts = {
                fn: opts,
            };
        }
        this.tile = opts.tile || null;
        this.fn = opts.fn || null;
        this.item = opts.item || null;
        this.chance = opts.chance || 0;
        this.volume = opts.volume || 0;
        // spawning pattern:
        this.spread = opts.spread || 0;
        this.radius = opts.radius || 0;
        this.decrement = opts.decrement || 0;
        this.flags = flag.from(Activation, opts.flags);
        this.matchTile = opts.matchTile || opts.needs || 0; /* ENUM tileType */
        this.next = opts.next || null; /* ENUM makeEventTypes */
        this.message = opts.message || null;
        this.lightFlare = opts.flare || null;
        this.flashColor = opts.flash ? color.from(opts.flash) : null;
        // this.effectRadius = radius || 0;
        this.messageDisplayed = false;
        this.emit = opts.emit || null; // name of the event to emit when activated
        this.id = opts.id || null;
    }
}
function make(opts) {
    if (!opts)
        return null;
    if (typeof opts === "string") {
        opts = { tile: opts };
    }
    const te = new TileEvent(opts);
    return te;
}
make$5.tileEvent = make;
const activations = {
    DF_NONE: null,
};
function install(id, event) {
    if (!(event instanceof TileEvent)) {
        event = make(event);
    }
    activations[id] = event;
    if (event)
        event.id = id;
    return event;
}
function resetAllMessages() {
    Object.values(activations).forEach((f) => {
        if (f instanceof TileEvent) {
            f.messageDisplayed = false;
        }
    });
}
// returns whether the feature was successfully generated (false if we aborted because of blocking)
async function spawn(activation, ctx = {}) {
    let i, j;
    if (!activation)
        return false;
    if (!ctx)
        return false;
    let feat;
    if (typeof activation === "string") {
        // @ts-ignore
        feat = activations[activation];
        if (!feat)
            utils.ERROR("Unknown tile Event: " + activation);
    }
    else if (typeof activation === "function") {
        return activation(ctx);
    }
    else {
        feat = activation;
    }
    const map = ctx.map;
    const x = ctx.x;
    const y = ctx.y;
    if (!map || x === undefined || y === undefined) {
        utils.ERROR("MAP, x, y are required in context.");
    }
    if (ctx.safe &&
        map.hasCellMechFlag(x, y, CellMech.EVENT_FIRED_THIS_TURN)) {
        if (!(feat.flags & Activation.DFF_ALWAYS_FIRE)) {
            // Activation.debug('spawn - already fired.');
            return false;
        }
    }
    // Activation.debug('spawn', x, y, 'id=', feat.id, 'tile=', feat.tile, 'item=', feat.item);
    ctx.refreshCell = ctx.refreshCell || !(feat.flags & Activation.DFF_NO_REDRAW_CELL);
    const abortIfBlocking = (ctx.abortIfBlocking =
        ctx.abortIfBlocking || feat.flags & Activation.DFF_ABORT_IF_BLOCKS_MAP);
    // if ((feat.flags & DFF_RESURRECT_ALLY) && !resurrectAlly(x, y))
    // {
    //     return false;
    // }
    if (feat.message &&
        feat.message.length &&
        !feat.messageDisplayed &&
        map.isVisible(x, y)) {
        feat.messageDisplayed = true;
        message.add(feat.message);
    }
    let tile$1 = null;
    if (feat.tile) {
        tile$1 = tiles[feat.tile] || null;
        if (!tile$1) {
            utils.ERROR("Unknown tile: " + feat.tile);
        }
    }
    let item = null;
    if (feat.item && "item" in make$5) {
        item = make$5.item(feat.item);
        if (!item) {
            utils.ERROR("Unknown item: " + feat.item);
        }
    }
    // Blocking keeps track of whether to abort if it turns out that the DF would obstruct the level.
    const blocking = (ctx.blocking =
        abortIfBlocking &&
            !(feat.flags & Activation.DFF_PERMIT_BLOCKING) &&
            ((tile$1 && tile$1.flags & Tile.T_PATHING_BLOCKER) ||
                (item && item.blocksMove()) ||
                feat.flags & Activation.DFF_TREAT_AS_BLOCKING)
            ? true
            : false);
    // Activation.debug('- blocking', blocking);
    const spawnMap = grid.alloc(map.width, map.height);
    let didSomething = false;
    computeSpawnMap(feat, spawnMap, ctx);
    if (!blocking ||
        !map.gridDisruptsPassability(spawnMap, { bounds: ctx.bounds })) {
        if (feat.flags & Activation.DFF_EVACUATE_CREATURES) {
            // first, evacuate creatures, so that they do not re-trigger the tile.
            if (evacuateCreatures(map, spawnMap)) {
                didSomething = true;
            }
        }
        if (feat.flags & Activation.DFF_EVACUATE_ITEMS) {
            // first, evacuate items, so that they do not re-trigger the tile.
            if (evacuateItems(map, spawnMap)) {
                didSomething = true;
            }
        }
        if (feat.flags & Activation.DFF_NULLIFY_CELL) {
            // first, clear other tiles (not base/ground)
            if (nullifyCells(map, spawnMap, feat.flags)) {
                didSomething = true;
            }
        }
        if (tile$1 || item || feat.fn) {
            if (await spawnTiles(feat, spawnMap, ctx, tile$1, item)) {
                didSomething = true;
            }
        }
    }
    if (item) {
        item.delete();
    }
    if (didSomething && feat.flags & Activation.DFF_PROTECTED) {
        spawnMap.forEach((v, i, j) => {
            if (!v)
                return;
            const cell = map.cell(i, j);
            cell.mechFlags |= CellMech.EVENT_PROTECTED;
        });
    }
    // if (refreshCell && feat.tile
    // 	&& (tile.flags & (TileFlags.T_IS_FIRE | TileFlags.T_AUTO_DESCENT))
    // 	&& map.hasTileFlag(PLAYER.xLoc, PLAYER.yLoc, (TileFlags.T_IS_FIRE | TileFlags.T_AUTO_DESCENT)))
    // {
    // 	await applyInstantTileEffectsToCreature(PLAYER);
    // }
    // apply tile effects
    if (didSomething) {
        for (let i = 0; i < spawnMap.width; ++i) {
            for (let j = 0; j < spawnMap.height; ++j) {
                const v = spawnMap[i][j];
                if (!v || data.gameHasEnded)
                    continue;
                const cell = map.cell(i, j);
                if (cell.actor || cell.item) {
                    for (let t of cell.tiles()) {
                        await t.applyInstantEffects(map, i, j, cell);
                        if (data.gameHasEnded) {
                            return true;
                        }
                    }
                }
            }
        }
    }
    if (feat.emit) {
        await events.emit(feat.emit, ctx);
        didSomething = true;
    }
    if (data.gameHasEnded) {
        grid.free(spawnMap);
        return didSomething;
    }
    //	if (succeeded && feat.message[0] && !feat.messageDisplayed && isVisible(x, y)) {
    //		feat.messageDisplayed = true;
    //		message(feat.message, false);
    //	}
    if (feat.next && (didSomething || feat.flags & Activation.DFF_SUBSEQ_ALWAYS)) {
        // Activation.debug('- subsequent: %s, everywhere=%s', feat.next, feat.flags & Flags.DFF_SUBSEQ_EVERYWHERE);
        if (feat.flags & Activation.DFF_SUBSEQ_EVERYWHERE) {
            for (i = 0; i < map.width; i++) {
                for (j = 0; j < map.height; j++) {
                    if (spawnMap[i][j]) {
                        ctx.x = i;
                        ctx.y = j;
                        await spawn(feat.next, ctx);
                    }
                }
            }
            ctx.x = x;
            ctx.y = y;
        }
        else {
            await spawn(feat.next, ctx);
        }
    }
    if (didSomething) {
        if (tile$1 &&
            tile$1.flags &
                (Tile.T_DEEP_WATER | Tile.T_LAVA | Tile.T_AUTO_DESCENT)) {
            data.updateMapToShoreThisTurn = false;
        }
        // awaken dormant creatures?
        // if (feat.flags & Flags.DFF_ACTIVATE_DORMANT_MONSTER) {
        //     for (monst of map.dormant) {
        //         if (monst.x == x && monst.y == y || spawnMap[monst.x][monst.y]) {
        //             // found it!
        //             toggleMonsterDormancy(monst);
        //         }
        //     }
        // }
    }
    if (didSomething) {
        spawnMap.forEach((v, i, j) => {
            if (v)
                map.redrawXY(i, j);
        });
        map.changed(true);
        if (!(feat.flags & Activation.DFF_NO_MARK_FIRED)) {
            spawnMap.forEach((v, i, j) => {
                if (v) {
                    map.setCellFlags(i, j, 0, CellMech.EVENT_FIRED_THIS_TURN);
                }
            });
        }
    }
    // Activation.debug('- spawn complete : @%d,%d, ok=%s, feat=%s', ctx.x, ctx.y, didSomething, feat.id);
    grid.free(spawnMap);
    return didSomething;
}
function cellIsOk(feat, x, y, ctx = {}) {
    const map = ctx.map;
    if (!map.hasXY(x, y))
        return false;
    const cell = map.cell(x, y);
    if (feat.flags & Activation.DFF_BUILD_IN_WALLS) {
        if (!cell.isWall())
            return false;
    }
    else if (feat.flags & Activation.DFF_MUST_TOUCH_WALLS) {
        let ok = false;
        map.eachNeighbor(x, y, (c) => {
            if (c.isWall()) {
                ok = true;
            }
        });
        if (!ok)
            return false;
    }
    else if (feat.flags & Activation.DFF_NO_TOUCH_WALLS) {
        let ok = true;
        map.eachNeighbor(x, y, (c) => {
            if (c.isWall()) {
                ok = false;
            }
        });
        if (!ok)
            return false;
    }
    if (ctx.bounds && !ctx.bounds.containsXY(x, y))
        return false;
    if (feat.matchTile && !cell.hasTile(feat.matchTile))
        return false;
    if (cell.hasTileFlag(Tile.T_OBSTRUCTS_TILE_EFFECTS) &&
        !feat.matchTile &&
        (ctx.x != x || ctx.y != y))
        return false;
    return true;
}
function computeSpawnMap(feat, spawnMap, ctx = {}) {
    let i, j, dir, t, x2, y2;
    let madeChange;
    const map = ctx.map;
    const x = ctx.x;
    const y = ctx.y;
    const bounds = ctx.bounds || null;
    let startProb = feat.spread || 0;
    let probDec = feat.decrement || 0;
    if (feat.matchTile && typeof feat.matchTile === "string") {
        const name = feat.matchTile;
        const tile$1 = tiles[name];
        if (!tile$1) {
            utils.ERROR("Failed to find match tile with name:" + name);
        }
        feat.matchTile = tile$1.id;
    }
    spawnMap[x][y] = t = 1; // incremented before anything else happens
    let radius = feat.radius || 0;
    if (feat.flags & Activation.DFF_SPREAD_CIRCLE) {
        radius = 0;
        startProb = startProb || 100;
        if (startProb >= 100) {
            probDec = probDec || 100;
        }
        while (random.chance(startProb)) {
            startProb -= probDec;
            ++radius;
        }
        startProb = 100;
        probDec = 0;
    }
    if (radius) {
        startProb = startProb || 100;
        spawnMap.updateCircle(x, y, radius, (_v, i, j) => {
            if (!cellIsOk(feat, i, j, ctx))
                return 0;
            const dist = Math.floor(utils.distanceBetween(x, y, i, j));
            const prob = startProb - dist * probDec;
            if (!random.chance(prob))
                return 0;
            return 1;
        });
        spawnMap[x][y] = 1;
    }
    else if (startProb) {
        madeChange = true;
        if (startProb >= 100) {
            probDec = probDec || 100;
        }
        if (feat.flags & Activation.DFF_SPREAD_LINE) {
            x2 = x;
            y2 = y;
            const dir = utils.DIRS[random.number(4)];
            while (madeChange) {
                madeChange = false;
                x2 = x2 + dir[0];
                y2 = y2 + dir[1];
                if (spawnMap.hasXY(x2, y2) &&
                    !spawnMap[x2][y2] &&
                    cellIsOk(feat, x2, y2, ctx) &&
                    random.chance(startProb)) {
                    spawnMap[x2][y2] = 1;
                    madeChange = true;
                    startProb -= probDec;
                }
            }
        }
        else {
            if (probDec <= 0)
                probDec = startProb;
            while (madeChange && startProb > 0) {
                madeChange = false;
                t++;
                for (i = 0; i < map.width; i++) {
                    for (j = 0; j < map.height; j++) {
                        if (spawnMap[i][j] == t - 1) {
                            for (dir = 0; dir < 4; dir++) {
                                x2 = i + utils.DIRS[dir][0];
                                y2 = j + utils.DIRS[dir][1];
                                if (spawnMap.hasXY(x2, y2) &&
                                    !spawnMap[x2][y2] &&
                                    cellIsOk(feat, x2, y2, ctx) &&
                                    random.chance(startProb)) {
                                    spawnMap[x2][y2] = t;
                                    madeChange = true;
                                }
                            }
                        }
                    }
                }
                startProb -= probDec;
            }
        }
    }
    if (!cellIsOk(feat, x, y, ctx)) {
        spawnMap[x][y] = 0;
    }
}
async function spawnTiles(feat, spawnMap, ctx, tile, item) {
    let i, j;
    let accomplishedSomething;
    accomplishedSomething = false;
    const blockedByOtherLayers = feat.flags & Activation.DFF_BLOCKED_BY_OTHER_LAYERS;
    const superpriority = feat.flags & Activation.DFF_SUPERPRIORITY;
    const applyEffects = ctx.refreshCell;
    const map = ctx.map;
    const volume = ctx.volume || feat.volume || 0; // (tile ? tile.volume : 0);
    for (i = 0; i < spawnMap.width; i++) {
        for (j = 0; j < spawnMap.height; j++) {
            if (!spawnMap[i][j])
                continue; // If it's not flagged for building in the spawn map,
            spawnMap[i][j] = 0; // so that the spawnmap reflects what actually got built
            const cell = map.cell(i, j);
            if (cell.mechFlags & CellMech.EVENT_PROTECTED)
                continue;
            if (tile) {
                if (cell.layers[tile.layer] === tile.id) {
                    // If the new cell does not already contains the fill terrain,
                    if (tile.layer == Layer.GAS) {
                        spawnMap[i][j] = 1;
                        cell.gasVolume += volume;
                    }
                    else if (tile.layer == Layer.LIQUID) {
                        spawnMap[i][j] = 1;
                        cell.liquidVolume += volume;
                    }
                }
                else if ((superpriority || cell.tile(tile.layer).priority < tile.priority) && // If the terrain in the layer to be overwritten has a higher priority number (unless superpriority),
                    !cell.obstructsLayer(tile.layer) && // If we will be painting into the surface layer when that cell forbids it,
                    (!cell.item || !(feat.flags & Activation.DFF_BLOCKED_BY_ITEMS)) &&
                    (!cell.actor || !(feat.flags & Activation.DFF_BLOCKED_BY_ACTORS)) &&
                    (!blockedByOtherLayers ||
                        cell.highestPriorityTile().priority < tile.priority)) {
                    // if the fill won't violate the priority of the most important terrain in this cell:
                    spawnMap[i][j] = 1; // so that the spawnmap reflects what actually got built
                    map.setTile(i, j, tile, volume);
                    // map.redrawCell(cell);
                    // if (volume && cell.gas) {
                    //     cell.volume += (feat.volume || 0);
                    // }
                    // debug('- tile', i, j, 'tile=', tile.id);
                    // cell.mechFlags |= CellMechFlags.EVENT_FIRED_THIS_TURN;
                    accomplishedSomething = true;
                }
            }
            if (item) {
                if (superpriority || !cell.item) {
                    if (!cell.hasTileFlag(Tile.T_OBSTRUCTS_ITEMS)) {
                        spawnMap[i][j] = 1; // so that the spawnmap reflects what actually got built
                        if (cell.item) {
                            map.removeItem(cell.item);
                        }
                        const clone = item.clone();
                        map.addItem(i, j, clone);
                        // map.redrawCell(cell);
                        // cell.mechFlags |= CellMechFlags.EVENT_FIRED_THIS_TURN;
                        accomplishedSomething = true;
                        // Activation.debug('- item', i, j, 'item=', itemKind.id);
                    }
                }
            }
            if (feat.fn) {
                ctx.spawnMap = spawnMap;
                if (await feat.fn(i, j, ctx)) {
                    spawnMap[i][j] = 1; // so that the spawnmap reflects what actually got built
                    // map.redrawCell(cell);
                    // cell.mechFlags |= CellMechFlags.EVENT_FIRED_THIS_TURN;
                    accomplishedSomething = true;
                }
            }
        }
    }
    if (accomplishedSomething) {
        map.changed(true);
    }
    return accomplishedSomething;
}
function nullifyCells(map, spawnMap, flags) {
    let didSomething = false;
    const nullSurface = flags & Activation.DFF_NULL_SURFACE;
    const nullLiquid = flags & Activation.DFF_NULL_LIQUID;
    const nullGas = flags & Activation.DFF_NULL_GAS;
    spawnMap.forEach((v, i, j) => {
        if (!v)
            return;
        map.clearCellLayers(i, j, !!nullLiquid, !!nullSurface, !!nullGas);
        didSomething = true;
    });
    return didSomething;
}
function evacuateCreatures(map, blockingMap) {
    let i, j;
    let didSomething = false;
    for (i = 0; i < map.width; i++) {
        for (j = 0; j < map.height; j++) {
            if (!blockingMap[i][j])
                continue;
            const cell = map.cell(i, j);
            if (!cell.actor)
                continue;
            const monst = cell.actor;
            const loc = map.matchingLocNear(i, j, (cell) => {
                return !monst.forbidsCell(cell);
            }, { hallways: true, blockingMap });
            if (loc && loc[0] >= 0 && loc[1] >= 0) {
                map.moveActor(loc[0], loc[1], monst);
                // map.redrawXY(loc[0], loc[1]);
                didSomething = true;
            }
        }
    }
    return didSomething;
}
function evacuateItems(map, blockingMap) {
    let didSomething = false;
    blockingMap.forEach((v, i, j) => {
        if (!v)
            return;
        const cell = map.cell(i, j);
        if (!cell.item)
            return;
        const item = cell.item;
        const loc = map.matchingLocNear(i, j, (dest) => {
            return !item.forbidsCell(dest);
        }, { hallways: true, blockingMap });
        if (loc && loc[0] >= 0 && loc[1] >= 0) {
            map.removeItem(item);
            map.addItem(loc[0], loc[1], item);
            // map.redrawXY(loc[0], loc[1]);
            didSomething = true;
        }
    });
    return didSomething;
}

var tileEvent = {
    __proto__: null,
    get Flags () { return Activation; },
    TileEvent: TileEvent,
    make: make,
    activations: activations,
    install: install,
    resetAllMessages: resetAllMessages,
    spawn: spawn,
    computeSpawnMap: computeSpawnMap,
    spawnTiles: spawnTiles,
    nullifyCells: nullifyCells,
    evacuateCreatures: evacuateCreatures,
    evacuateItems: evacuateItems
};

// const LIGHT_SMOOTHING_THRESHOLD = 150;       // light components higher than this magnitude will be toned down a little
const config = (config$1.light = { INTENSITY_DARK: 20 }); // less than 20% for highest color in rgb
const LIGHT_COMPONENTS = color.make();
class Light {
    constructor(color$1, range$1, fadeTo, pass = false) {
        this.fadeTo = 0;
        this.passThroughActors = false;
        this.id = null;
        this.color = color.from(color$1) || null; /* color */
        this.radius = range.make(range$1 || 1);
        this.fadeTo = fadeTo || 0;
        this.passThroughActors = pass; // generally no, but miner light does (TODO - string parameter?  'false' or 'true')
    }
    copy(other) {
        this.color = other.color;
        this.radius.copy(other.radius);
        this.fadeTo = other.fadeTo;
        this.passThroughActors = other.passThroughActors;
    }
    get intensity() {
        return intensity(this.color);
    }
    // Returns true if any part of the light hit cells that are in the player's field of view.
    paint(map, x, y, maintainShadows = false, isMinersLight = false) {
        if (!map)
            return;
        let k;
        // let colorComponents = [0,0,0];
        let lightMultiplier;
        let radius = this.radius.value();
        let outerRadius = Math.ceil(radius);
        // calcLightComponents(colorComponents, this);
        LIGHT_COMPONENTS.copy(this.color).bake();
        // console.log('paint', LIGHT_COMPONENTS.toString(true), x, y, outerRadius);
        // the miner's light does not dispel IS_IN_SHADOW,
        // so the player can be in shadow despite casting his own light.
        const dispelShadows = !isMinersLight &&
            !maintainShadows &&
            intensity(LIGHT_COMPONENTS) > config.INTENSITY_DARK;
        const fadeToPercent = this.fadeTo;
        const grid$1 = grid.alloc(map.width, map.height, 0);
        map.calcFov(grid$1, x, y, outerRadius, this.passThroughActors ? 0 : Cell.HAS_ACTOR, Tile.T_OBSTRUCTS_VISION);
        let overlappedFieldOfView = false;
        grid$1.forCircle(x, y, outerRadius, (v, i, j) => {
            if (!v)
                return;
            const cell = map.cell(i, j);
            lightMultiplier = Math.floor(100 -
                (100 - fadeToPercent) * (utils.distanceBetween(x, y, i, j) / radius));
            for (k = 0; k < 3; k++) {
                cell.light[k] += Math.floor((LIGHT_COMPONENTS[k] * lightMultiplier) / 100);
            }
            if (dispelShadows) {
                cell.flags &= ~Cell.IS_IN_SHADOW;
            }
            if (cell.flags & (Cell.IN_FOV | Cell.ANY_KIND_OF_VISIBLE)) {
                overlappedFieldOfView = true;
            }
            // console.log(i, j, lightMultiplier, cell.light);
        });
        if (dispelShadows) {
            const cell = map.cell(x, y);
            cell.flags &= ~Cell.IS_IN_SHADOW;
        }
        grid.free(grid$1);
        return overlappedFieldOfView;
    }
}
function intensity(color) {
    return Math.max(color[0], color[1], color[2]);
}
function make$1(...args) {
    if (args.length == 1) {
        const config = args[0];
        if (typeof config === "string") {
            const cached = lights[config];
            if (cached)
                return cached;
            const [color$1, radius, fadeTo, pass] = config
                .split(/[,|]/)
                .map((t) => t.trim());
            return new Light(color.from(color$1), range.from(radius || 1), Number.parseInt(fadeTo || "0"), !!pass && pass !== "false");
        }
        else if (Array.isArray(config)) {
            const [color, radius, fadeTo, pass] = config;
            return new Light(color, radius, fadeTo, pass);
        }
        else if (config && config.color) {
            return new Light(color.from(config.color), range.from(config.radius), Number.parseInt(config.fadeTo || "0"), config.pass);
        }
        else {
            throw new Error("Unknown Light config - " + config);
        }
    }
    else {
        const [color, radius, fadeTo, pass] = args;
        return new Light(color, radius, fadeTo, pass);
    }
}
make$5.light = make$1;
const lights = {};
function from(...args) {
    if (args.length != 1)
        utils.ERROR("Unknown Light config: " + JSON.stringify(args));
    const arg = args[0];
    if (typeof arg === "string") {
        const cached = lights[arg];
        if (cached)
            return cached;
    }
    return make$1(arg);
}
function install$1(id, ...args) {
    let source;
    if (args.length == 1) {
        source = make$1(args[0]);
    }
    else {
        source = make$1(args[0], args[1], args[2], args[3]);
    }
    lights[id] = source;
    if (source)
        source.id = id;
    return source;
}
function installAll(config = {}) {
    const entries = Object.entries(config);
    entries.forEach(([name, info]) => {
        install$1(name, info);
    });
}
// export function calcLightComponents(colorComponents, theLight) {
// 	const randComponent = cosmetic.range(0, theLight.color.rand);
// 	colorComponents[0] = randComponent + theLight.color.red + cosmetic.range(0, theLight.color.redRand);
// 	colorComponents[1] = randComponent + theLight.color.green + cosmetic.range(0, theLight.color.greenRand);
// 	colorComponents[2] = randComponent + theLight.color.blue + cosmetic.range(0, theLight.color.blueRand);
// }
function updateDisplayDetail(map) {
    map.eachCell((cell, _i, _j) => {
        // clear light flags
        cell.flags &= ~(Cell.CELL_LIT | Cell.CELL_DARK);
        if (cell.light.some((v, i) => v !== cell.oldLight[i])) {
            cell.flags |= Cell.LIGHT_CHANGED;
        }
        if (cell.isDark()) {
            cell.flags |= Cell.CELL_DARK;
        }
        else if (!(cell.flags & Cell.IS_IN_SHADOW)) {
            cell.flags |= Cell.CELL_LIT;
        }
    });
}
function backUpLighting(map, lights) {
    let k;
    map.eachCell((cell, i, j) => {
        for (k = 0; k < 3; k++) {
            lights[i][j][k] = cell.light[k];
        }
    });
}
function restoreLighting(map, lights) {
    let k;
    map.eachCell((cell, i, j) => {
        for (k = 0; k < 3; k++) {
            cell.light[k] = lights[i][j][k];
        }
    });
}
function recordOldLights(map) {
    let k;
    map.eachCell((cell) => {
        for (k = 0; k < 3; k++) {
            cell.oldLight[k] = cell.light[k];
            cell.flags &= ~Cell.LIGHT_CHANGED;
        }
    });
}
function zeroOutLights(map) {
    let k;
    const light = map.ambientLight ? map.ambientLight : [0, 0, 0];
    map.eachCell((cell, _i, _j) => {
        for (k = 0; k < 3; k++) {
            cell.light[k] = light[k];
        }
        cell.flags |= Cell.IS_IN_SHADOW;
    });
}
function recordGlowLights(map) {
    let k;
    map.eachCell((cell) => {
        for (k = 0; k < 3; k++) {
            cell.glowLight[k] = cell.light[k];
        }
    });
}
function restoreGlowLights(map) {
    let k;
    map.eachCell((cell) => {
        for (k = 0; k < 3; k++) {
            cell.light[k] = cell.glowLight[k];
        }
    });
}
function updateLighting(map) {
    // Copy Light over oldLight
    recordOldLights(map);
    if (map.flags & Map.MAP_STABLE_LIGHTS)
        return false;
    // and then zero out Light.
    zeroOutLights(map);
    if (map.flags & Map.MAP_STABLE_GLOW_LIGHTS) {
        restoreGlowLights(map);
    }
    else {
        // GW.debug.log('painting glow lights.');
        // Paint all glowing tiles.
        map.eachGlowLight((light, x, y) => {
            //   const light = lights[id];
            if (light) {
                light.paint(map, x, y);
            }
        });
        recordGlowLights(map);
        map.setFlag(Map.MAP_STABLE_GLOW_LIGHTS);
    }
    // Cycle through monsters and paint their lights:
    map.eachDynamicLight((light, x, y) => {
        light.paint(map, x, y);
        // if (monst.mutationIndex >= 0 && mutationCatalog[monst.mutationIndex].light != lights['NO_LIGHT']) {
        //     paint(map, mutationCatalog[monst.mutationIndex].light, actor.x, actor.y, false, false);
        // }
        // if (actor.isBurning()) { // monst.status.burning && !(actor.kind.flags & Flags.Actor.AF_FIERY)) {
        // 	paint(map, lights.BURNING_CREATURE, actor.x, actor.y, false, false);
        // }
        // if (actor.isTelepathicallyRevealed()) {
        // 	paint(map, lights['TELEPATHY_LIGHT'], actor.x, actor.y, false, true);
        // }
    });
    // Also paint telepathy lights for dormant monsters.
    // for (monst of map.dormantMonsters) {
    //     if (monsterTelepathicallyRevealed(monst)) {
    //         paint(map, lights['TELEPATHY_LIGHT'], monst.xLoc, monst.yLoc, false, true);
    //     }
    // }
    updateDisplayDetail(map);
    // Miner's light:
    const PLAYER = data.player;
    if (PLAYER) {
        const MINERS_LIGHT = lights.MINERS_LIGHT;
        if (MINERS_LIGHT && MINERS_LIGHT.radius) {
            MINERS_LIGHT.paint(map, PLAYER.x, PLAYER.y, true, true);
        }
    }
    map.setFlag(Map.MAP_STABLE_LIGHTS);
    // if (PLAYER.status.invisible) {
    //     PLAYER.info.foreColor = playerInvisibleColor;
    // } else if (playerInDarkness()) {
    // 	PLAYER.info.foreColor = playerInDarknessColor;
    // } else if (pmap[PLAYER.xLoc][PLAYER.yLoc].flags & IS_IN_SHADOW) {
    // 	PLAYER.info.foreColor = playerInShadowColor;
    // } else {
    // 	PLAYER.info.foreColor = playerInLightColor;
    // }
    return true;
}
// TODO - Move and make more generic
function playerInDarkness(map, PLAYER, darkColor) {
    const cell = map.cell(PLAYER.x, PLAYER.y);
    return (cell.light[0] + 10 < darkColor.r &&
        cell.light[1] + 10 < darkColor.g &&
        cell.light[2] + 10 < darkColor.b);
}

var light = {
    __proto__: null,
    config: config,
    Light: Light,
    intensity: intensity,
    make: make$1,
    lights: lights,
    from: from,
    install: install$1,
    installAll: installAll,
    backUpLighting: backUpLighting,
    restoreLighting: restoreLighting,
    recordOldLights: recordOldLights,
    zeroOutLights: zeroOutLights,
    recordGlowLights: recordGlowLights,
    restoreGlowLights: restoreGlowLights,
    updateLighting: updateLighting,
    playerInDarkness: playerInDarkness
};

/** Tile Class */
class Tile$1 {
    /**
     * Creates a new Tile object.
     * @param {Object} [config={}] - The configuration of the Tile
     * @param {String|Number|String[]} [config.flags=0] - Flags and MechFlags for the tile
     * @param {String} [config.layer=GROUND] - Name of the layer for this tile
     * @param {String} [config.ch] - The sprite character
     * @param {String} [config.fg] - The sprite foreground color
     * @param {String} [config.bg] - The sprite background color
     */
    constructor(config, base) {
        this.flags = 0;
        this.mechFlags = 0;
        this.layer = Layer.GROUND;
        this.priority = -1;
        this.activates = {};
        this.light = null; // TODO - Light
        this.flavor = null;
        this.desc = null;
        this.article = null;
        this.dissipate = 2000; // 20 * 100 = 20%
        if (base) {
            utils.assignOmitting(["activates", "ch", "fg", "bg", "opacity"], this, base);
        }
        utils.assignOmitting([
            "Extends",
            "extends",
            "flags",
            "mechFlags",
            "sprite",
            "activates",
            "ch",
            "fg",
            "bg",
            "opacity",
            "light",
        ], this, config);
        this.name = config.name || (base ? base.name : config.id);
        this.id = config.id;
        this.sprite = new canvas.Sprite(utils.first(config.ch, base ? base.sprite.ch : -1), utils.first(config.fg, base ? base.sprite.fg : -1), utils.first(config.bg, base ? base.sprite.bg : -1), utils.first(config.opacity, base ? base.sprite.opacity : 100));
        this.layer = this.layer || Layer.GROUND;
        if (typeof this.layer === "string") {
            this.layer = Layer[this.layer];
        }
        if (this.priority < 0) {
            this.priority = 50;
        }
        this.flags = flag.from(Tile, this.flags, config.flags);
        this.mechFlags = flag.from(TileMech, this.mechFlags, config.mechFlags || config.flags);
        if (config.light) {
            // Light.from will throw an Error on invalid config
            this.light = from(config.light);
        }
        if (base && base.activates) {
            Object.assign(this.activates, base.activates);
        }
        if (config.activates) {
            Object.entries(config.activates).forEach(([key, info]) => {
                if (info) {
                    const activation = make(info);
                    this.activates[key] = activation;
                }
                else {
                    delete this.activates[key];
                }
            });
        }
    }
    /**
     * Returns the flags for the tile after the given event is fired.
     * @param {string} id - Name of the event to fire.
     * @returns {number} The flags from the Tile after the event.
     */
    successorFlags(id) {
        const e = this.activates[id];
        if (!e)
            return 0;
        const tileId = e.tile;
        if (!tileId)
            return 0;
        const tile = tiles[tileId];
        if (!tile)
            return 0;
        return tile.flags;
    }
    /**
     * Returns whether or not this tile as the given flag.
     * Will return true if any bit in the flag is true, so testing with
     * multiple flags will return true if any of them is set.
     * @param {number} flag - The flag to check
     * @returns {boolean} Whether or not the flag is set
     */
    hasFlag(flag) {
        return (this.flags & flag) > 0;
    }
    hasMechFlag(flag) {
        return (this.mechFlags & flag) > 0;
    }
    hasFlags(flags, mechFlags) {
        return ((!flags || this.flags & flags) &&
            (!mechFlags || this.mechFlags & mechFlags));
    }
    activatesOn(name) {
        return !!this.activates[name];
    }
    getName(arg) {
        let opts = {};
        if (arg === true || arg === false) {
            opts.article = arg;
        }
        else if (typeof arg === "string") {
            opts.article = arg;
        }
        else if (arg) {
            opts = arg;
        }
        if (!opts.article && !opts.color)
            return this.name;
        let result = this.name;
        if (opts.color) {
            let color$1 = opts.color;
            if (opts.color === true) {
                color$1 = this.sprite.fg;
            }
            if (typeof color$1 !== "string") {
                color$1 = color.from(color$1).toString();
            }
            result = `Ω${color$1}Ω${this.name}∆`;
        }
        if (opts.article) {
            let article = typeof opts.article === "string" ? opts.article : this.article || "a";
            result = article + " " + result;
        }
        return result;
    }
    getDescription(opts = {}) {
        return this.getName(opts);
    }
}
// Types.Tile = Tile;
function make$2(config) {
    return new Tile$1(config);
}
make$5.tile = make$2;
const tiles = {};
function install$2(...args) {
    let id = args[0];
    let base = args[1];
    let config = args[2];
    if (arguments.length == 1) {
        config = args[0];
        base = config.Extends || null;
        id = config.id;
    }
    else if (arguments.length == 2) {
        config = base;
        base = config.Extends || config.extends || null;
    }
    if (typeof base === "string") {
        base = tiles[base] || utils.ERROR("Unknown base tile: " + base);
    }
    // config.name = config.name || base.name || id.toLowerCase();
    config.id = id;
    const tile = new Tile$1(config, base);
    tiles[id] = tile;
    return tile;
}
/**
 * Adds multiple tiles to the GW.tiles collection.
 * It extracts all the id:opts pairs from the config object and uses
 * them to call addTileKind.
 * @param {Object} config - The tiles to add in [id, config] pairs
 * @returns {void} Nothing
 * @see addTileKind
 */
function installAll$1(config) {
    Object.entries(config).forEach(([id, opts]) => {
        opts.id = id;
        install$2(id, opts);
    });
}

var tile = {
    __proto__: null,
    get Flags () { return Tile; },
    get MechFlags () { return TileMech; },
    get Layer () { return Layer; },
    Tile: Tile$1,
    make: make$2,
    tiles: tiles,
    install: install$2,
    installAll: installAll$1
};

// TODO - Move to gw-ui
color.install("cursorColor", 25, 100, 150);
config$1.cursorPathIntensity = 50;
class CellMemory {
    constructor() {
        this.mixer = new canvas.Mixer();
        this.item = null;
        this.itemQuantity = 0;
        this.actor = null;
        this.tile = null;
        this.cellFlags = 0;
        this.cellMechFlags = 0;
        this.tileFlags = 0;
        this.tileMechFlags = 0;
    }
    nullify() {
        this.mixer.nullify();
        this.item = null;
        this.itemQuantity = 0;
        this.actor = null;
        this.tile = null;
        this.cellFlags = 0;
        this.cellMechFlags = 0;
        this.tileFlags = 0;
        this.tileMechFlags = 0;
    }
    copy(other) {
        const mixer = this.mixer;
        Object.assign(this, other);
        this.mixer = mixer;
        this.mixer.copy(other.mixer);
    }
}
class Cell$1 {
    constructor() {
        this.layers = [];
        this.sprites = null;
        this._actor = null;
        this._item = null;
        this.data = {};
        this.flags = Cell.CELL_DEFAULT; // non-terrain cell flags
        this.mechFlags = 0;
        this.gasVolume = 0; // quantity of gas in cell
        this.liquidVolume = 0;
        this.machineNumber = 0;
        this.memory = new CellMemory();
        this.light = [100, 100, 100];
        this.oldLight = [100, 100, 100];
        this.glowLight = [100, 100, 100];
    }
    copy(other) {
        utils.copyObject(this, other);
    }
    nullify() {
        for (let i = 0; i < this.layers.length; ++i) {
            this.layers[i] = null;
        }
        this.sprites = null;
        this._actor = null;
        this._item = null;
        this.data = {};
        this.flags = Cell.CELL_DEFAULT; // non-terrain cell flags
        this.mechFlags = 0;
        this.gasVolume = 0; // quantity of gas in cell
        this.liquidVolume = 0;
        this.machineNumber = 0;
        this.memory.nullify();
        this.light = [100, 100, 100];
        this.oldLight = [100, 100, 100];
        this.glowLight = [100, 100, 100];
    }
    nullifyLayers(nullLiquid = false, nullSurface = false, nullGas = false) {
        if (nullLiquid) {
            this.layers[1] = null;
            this.liquidVolume = 0;
        }
        if (nullSurface) {
            this.layers[2] = null;
        }
        if (nullGas) {
            this.layers[3] = null;
            this.gasVolume = 0;
        }
        this.flags |= Cell.CELL_CHANGED;
    }
    get ground() {
        var _a;
        return ((_a = this.layers[Layer.GROUND]) === null || _a === void 0 ? void 0 : _a.id) || null;
    }
    get liquid() {
        var _a;
        return ((_a = this.layers[Layer.LIQUID]) === null || _a === void 0 ? void 0 : _a.id) || null;
    }
    get surface() {
        var _a;
        return ((_a = this.layers[Layer.SURFACE]) === null || _a === void 0 ? void 0 : _a.id) || null;
    }
    get gas() {
        var _a;
        return ((_a = this.layers[Layer.GAS]) === null || _a === void 0 ? void 0 : _a.id) || null;
    }
    get groundTile() {
        return this.layers[Layer.GROUND] || tiles.NULL;
    }
    get liquidTile() {
        return this.layers[Layer.LIQUID] || tiles.NULL;
    }
    get surfaceTile() {
        return this.layers[Layer.SURFACE] || tiles.NULL;
    }
    get gasTile() {
        return this.layers[Layer.GAS] || tiles.NULL;
    }
    dump() {
        if (this.actor)
            return this.actor.sprite.ch;
        if (this.item)
            return this.item.sprite.ch;
        for (let i = this.layers.length - 1; i >= 0; --i) {
            if (!this.layers[i])
                continue;
            const tile = this.layers[i] || tiles.NULL;
            if (tile.sprite.ch)
                return tile.sprite.ch;
        }
        return tiles[0].sprite.ch;
    }
    changed() {
        return this.flags & Cell.CELL_CHANGED;
    }
    isVisible() {
        return this.flags & Cell.VISIBLE;
    }
    isAnyKindOfVisible() {
        return (this.flags & Cell.ANY_KIND_OF_VISIBLE /* || CONFIG.playbackOmniscience */);
    }
    isOrWasAnyKindOfVisible() {
        return (this.flags &
            Cell.IS_WAS_ANY_KIND_OF_VISIBLE /* || CONFIG.playbackOmniscience */);
    }
    isRevealed(orMapped = false) {
        const flag = Cell.REVEALED | (orMapped ? Cell.MAGIC_MAPPED : 0);
        return this.flags & flag;
    }
    listInSidebar() {
        return this.hasTileMechFlag(TileMech.TM_LIST_IN_SIDEBAR, true);
    }
    _needsRedraw() {
        this.flags |= Cell.NEEDS_REDRAW;
    }
    // TODO - Use functions in LIGHT to check these on cell.light directly???
    hasVisibleLight() {
        return intensity(this.light) > config$1.light.INTENSITY_DARK;
    } // TODO
    isDark() {
        return intensity(this.light) <= config$1.light.INTENSITY_DARK;
    } // TODO
    lightChanged() {
        return this.flags & Cell.LIGHT_CHANGED;
    } // TODO
    tile(layer = Layer.GROUND) {
        return this.layers[layer] || tiles.NULL;
    }
    *tiles() {
        for (let tile of this.layers) {
            if (tile) {
                yield tile;
            }
        }
    }
    tileFlags(limitToPlayerKnowledge = false) {
        if (limitToPlayerKnowledge && !this.isVisible()) {
            return this.memory.tileFlags;
        }
        let flags = 0;
        for (let tile of this.tiles()) {
            flags |= tile.flags;
        }
        return flags;
    }
    tileMechFlags(limitToPlayerKnowledge = false) {
        if (limitToPlayerKnowledge && !this.isVisible()) {
            return this.memory.tileMechFlags;
        }
        let flags = 0;
        for (let tile of this.tiles()) {
            flags |= tile.mechFlags;
        }
        return flags;
    }
    hasTileFlag(flagMask = 0, limitToPlayerKnowledge = false) {
        const tileFlags = this.tileFlags(limitToPlayerKnowledge);
        return !!(flagMask & tileFlags);
    }
    hasAllTileFlags(flags = 0) {
        return (flags & this.tileFlags()) === flags;
    }
    hasTileMechFlag(flagMask = 0, limitToPlayerKnowledge = false) {
        const mechFlags = this.tileMechFlags(limitToPlayerKnowledge);
        return !!(flagMask & mechFlags);
    }
    hasAllTileMechFlags(flags = 0) {
        return (flags & this.tileMechFlags()) === flags;
    }
    setFlags(cellFlag = 0, cellMechFlag = 0) {
        this.flags |= cellFlag;
        this.mechFlags |= cellMechFlag;
        // this.flags |= Flags.NEEDS_REDRAW;
    }
    clearFlags(cellFlag = 0, cellMechFlag = 0) {
        this.flags &= ~cellFlag;
        this.mechFlags &= ~cellMechFlag;
        // if ((~cellFlag) & Flags.NEEDS_REDRAW) {
        //   this.flags |= Flags.NEEDS_REDRAW;
        // }
    }
    hasFlag(flag = 0, limitToPlayerKnowledge = false) {
        const flags = limitToPlayerKnowledge && !this.isAnyKindOfVisible()
            ? this.memory.cellFlags
            : this.flags;
        return !!(flag & flags);
    }
    hasMechFlag(flag = 0, limitToPlayerKnowledge = false) {
        const flags = limitToPlayerKnowledge && !this.isAnyKindOfVisible()
            ? this.memory.cellMechFlags
            : this.mechFlags;
        return !!(flag & flags);
    }
    hasTile(tile) {
        let id;
        if (tile instanceof Tile$1) {
            id = tile.id;
        }
        else {
            id = tile;
        }
        return this.layers.some((t) => t && t.id === id);
    }
    // hasTileInGroup(...groups) {
    //   if (groups.length == 1 && Array.isArray(groups[0])) {
    //     groups = groups[0];
    //   }
    //   return this.layers.some( (tileId) => {
    //     const tile = TILES[tileId] || TILES.NOTHING;
    //     return Utils.intersect(groups, tile.groups);
    //   });
    // }
    successorTileFlags(id) {
        let flags = 0;
        for (let tile of this.tiles()) {
            flags |= tile.successorFlags(id);
        }
        return flags;
    }
    promotedTileFlags() {
        return this.successorTileFlags("promote");
    }
    discoveredTileFlags() {
        return this.successorTileFlags("discover");
    }
    hasDiscoveredTileFlag(flag) {
        // if (!this.hasTileMechFlag(TM_IS_SECRET)) return false;
        return this.discoveredTileFlags() & flag;
    }
    highestPriorityTile(skipGas = false) {
        let best = tiles[0];
        let bestPriority = -10000;
        for (let layer = Layer.GROUND; layer <= (skipGas ? Layer.LIQUID : Layer.GAS); ++layer) {
            // @ts-ignore
            const tile = this.layers[layer];
            if (!tile)
                continue;
            if (tile.priority > bestPriority) {
                best = tile;
                bestPriority = tile.priority;
            }
        }
        return best;
    }
    tileWithFlag(tileFlag) {
        for (let tile of this.tiles()) {
            if (tile.flags & tileFlag)
                return tile;
        }
        return null;
    }
    tileWithMechFlag(mechFlag) {
        for (let tile of this.tiles()) {
            if (tile.mechFlags & mechFlag)
                return tile;
        }
        return null;
    }
    tileDesc() {
        return this.highestPriorityTile().desc;
    }
    tileFlavor() {
        return this.highestPriorityTile().flavor;
    }
    getName(opts = {}) {
        return this.highestPriorityTile().getName(opts);
    }
    isNull() {
        return this.ground == null;
    }
    isEmpty() {
        return !(this._actor || this._item);
    }
    isPassableNow(limitToPlayerKnowledge = false) {
        const useMemory = limitToPlayerKnowledge && !this.isAnyKindOfVisible();
        const tileFlags = useMemory ? this.memory.tileFlags : this.tileFlags();
        if (!(tileFlags & Tile.T_PATHING_BLOCKER))
            return true;
        if (tileFlags & Tile.T_BRIDGE)
            return true;
        return limitToPlayerKnowledge
            ? false
            : this.isSecretDoor(limitToPlayerKnowledge);
    }
    canBePassed(limitToPlayerKnowledge = false) {
        if (this.isPassableNow(limitToPlayerKnowledge))
            return true;
        const useMemory = limitToPlayerKnowledge && !this.isAnyKindOfVisible();
        let tileMechFlags = useMemory
            ? this.memory.tileMechFlags
            : this.tileMechFlags();
        if (tileMechFlags & TileMech.TM_CONNECTS_LEVEL)
            return true;
        return !!(tileMechFlags & TileMech.TM_PROMOTES &&
            !(this.promotedTileFlags() & Tile.T_PATHING_BLOCKER));
    }
    isWall(limitToPlayerKnowledge = false) {
        const useMemory = limitToPlayerKnowledge && !this.isAnyKindOfVisible();
        let tileFlags = useMemory ? this.memory.tileFlags : this.tileFlags();
        return !!(tileFlags & Tile.T_OBSTRUCTS_EVERYTHING);
    }
    isObstruction(limitToPlayerKnowledge = false) {
        const useMemory = limitToPlayerKnowledge && !this.isAnyKindOfVisible();
        let tileFlags = useMemory ? this.memory.tileFlags : this.tileFlags();
        return !!(tileFlags & Tile.T_OBSTRUCTS_DIAGONAL_MOVEMENT);
    }
    isDoor(limitToPlayerKnowledge = false) {
        const useMemory = limitToPlayerKnowledge && !this.isAnyKindOfVisible();
        let tileFlags = useMemory ? this.memory.tileFlags : this.tileFlags();
        return !!(tileFlags & Tile.T_IS_DOOR);
    }
    isSecretDoor(limitToPlayerKnowledge = false) {
        if (limitToPlayerKnowledge)
            return false;
        const tileMechFlags = this.tileMechFlags();
        return !!(tileMechFlags & TileMech.TM_IS_SECRET &&
            !(this.discoveredTileFlags() & Tile.T_PATHING_BLOCKER));
    }
    blocksPathing(limitToPlayerKnowledge = false) {
        const useMemory = limitToPlayerKnowledge && !this.isAnyKindOfVisible();
        let tileFlags = useMemory ? this.memory.tileFlags : this.tileFlags();
        return !!(tileFlags & Tile.T_PATHING_BLOCKER);
    }
    blocksVision() {
        let tileFlags = this.tileFlags();
        return !!(tileFlags & Tile.T_OBSTRUCTS_VISION);
    }
    isLiquid(limitToPlayerKnowledge = false) {
        const useMemory = limitToPlayerKnowledge && !this.isAnyKindOfVisible();
        let tileFlags = useMemory ? this.memory.tileFlags : this.tileFlags();
        return !!(tileFlags & Tile.T_IS_LIQUID);
    }
    // TODO - Should this look at the tiles instead of the flags?
    // What if a gas tile is not set with T_GAS?
    // Should we force T_GAS if layer === GAS when creating a tile?
    hasGas(limitToPlayerKnowledge = false) {
        const useMemory = limitToPlayerKnowledge && !this.isAnyKindOfVisible();
        let tileFlags = useMemory ? this.memory.tileFlags : this.tileFlags();
        return !!(tileFlags & Tile.T_GAS);
    }
    markRevealed() {
        this.flags &= ~Cell.STABLE_MEMORY;
        if (this.flags & Cell.REVEALED)
            return false;
        this.flags |= Cell.REVEALED;
        return !this.hasTileFlag(Tile.T_PATHING_BLOCKER);
    }
    obstructsLayer(layer) {
        return (layer == Layer.SURFACE && this.hasTileFlag(Tile.T_OBSTRUCTS_SURFACE));
    }
    _setTile(tileId = null, volume = 0, map) {
        map = map || data.map;
        let tile;
        if (tileId === null) {
            tile = tiles.NULL;
            tileId = null;
        }
        else if (typeof tileId === "string") {
            tile = tiles[tileId];
        }
        else if (tileId instanceof Tile$1) {
            tile = tileId;
            tileId = tile.id;
        }
        if (!tile) {
            return utils.ERROR("Unknown tile - " + tileId);
        }
        const oldTile = this.layers[tile.layer] || tiles.NULL;
        const oldTileId = oldTile === tiles.NULL ? null : oldTile.id;
        if ((oldTile.flags & Tile.T_PATHING_BLOCKER) !=
            (tile.flags & Tile.T_PATHING_BLOCKER)) {
            data.staleLoopMap = true;
        }
        if (tile.flags & Tile.T_IS_FIRE &&
            !(oldTile.flags & Tile.T_IS_FIRE)) {
            this.mechFlags |= CellMech.CAUGHT_FIRE_THIS_TURN;
        }
        const blocksVision = tile.flags & Tile.T_OBSTRUCTS_VISION;
        const oldBlocksVision = oldTile.flags & Tile.T_OBSTRUCTS_VISION;
        if (map && this.isAnyKindOfVisible() && blocksVision != oldBlocksVision) {
            map.setFlag(Map.MAP_FOV_CHANGED);
        }
        if (oldTileId !== null)
            this.removeSprite(oldTile.sprite);
        this.layers[tile.layer] = tileId === null ? null : tile;
        if (tileId !== null)
            this.addSprite(tile.sprite, tile.layer);
        if (tile.layer == Layer.LIQUID) {
            this.liquidVolume =
                volume + (tileId == oldTileId ? this.liquidVolume : 0);
            if (map)
                map.clearFlag(Map.MAP_NO_LIQUID);
        }
        else if (tile.layer == Layer.GAS) {
            this.gasVolume = volume + (tileId == oldTileId ? this.gasVolume : 0);
            if (map)
                map.clearFlag(Map.MAP_NO_GAS);
        }
        if (tile.layer > 0 && !this.layers[0]) {
            this.layers[0] = tiles.FLOOR; // TODO - Not good
        }
        // this.flags |= (Flags.NEEDS_REDRAW | Flags.CELL_CHANGED);
        this.flags |= Cell.CELL_CHANGED;
        if (map && oldTile.light !== tile.light) {
            map.clearFlag(Map.MAP_STABLE_GLOW_LIGHTS | Map.MAP_STABLE_LIGHTS);
        }
        return true;
    }
    clearLayer(layer) {
        // @ts-ignore
        if (typeof layer === "string")
            layer = Layer[layer];
        const current = this.layers[layer];
        if (current) {
            // this.flags |= (Flags.NEEDS_REDRAW | Flags.CELL_CHANGED);
            this.flags |= Cell.CELL_CHANGED;
            this.removeSprite(current.sprite);
        }
        this.layers[layer] = null;
        if (layer == Layer.LIQUID) {
            this.liquidVolume = 0;
        }
        else if (layer == Layer.GAS) {
            this.gasVolume = 0;
        }
    }
    clearLayers(except = Layer.GROUND, ground) {
        const floorTile = ground ? tiles[ground] : this.groundTile;
        for (let layer = 0; layer < this.layers.length; layer++) {
            if (layer != except && layer != Layer.GAS) {
                if (layer === Layer.GROUND) {
                    if (floorTile !== this.groundTile)
                        this._setTile(floorTile);
                }
                else {
                    this.clearLayer(layer);
                }
            }
        }
        // this.flags |= (Flags.NEEDS_REDRAW | Flags.CELL_CHANGED);
        this.flags |= Cell.CELL_CHANGED;
    }
    clearLayersWithFlags(tileFlags, tileMechFlags = 0) {
        for (let i = 0; i < this.layers.length; ++i) {
            const tile = this.layers[i];
            if (!tile)
                continue;
            if (tileFlags && tileMechFlags) {
                if (tile.flags & tileFlags && tile.mechFlags & tileMechFlags) {
                    this.clearLayer(i);
                }
            }
            else if (tileFlags) {
                if (tile.flags & tileFlags) {
                    this.clearLayer(i);
                }
            }
            else if (tileMechFlags) {
                if (tile.mechFlags & tileMechFlags) {
                    this.clearLayer(i);
                }
            }
        }
        // this.flags |= (Flags.NEEDS_REDRAW | Flags.CELL_CHANGED);
    }
    // EVENTS
    async activate(name, ctx = {}) {
        ctx.cell = this;
        let fired = false;
        // cell.debug("fire event - %s", name);
        for (let tile of this.tiles()) {
            if (!tile.activates)
                continue;
            const ev = tile.activates[name];
            if (ev) {
                // cell.debug(" - has event");
                if (ev.chance && !random.chance(ev.chance, 10000)) {
                    continue;
                }
                ctx.tile = tile;
                // cell.debug(" - spawn event @%d,%d - %s", ctx.x, ctx.y, name);
                fired = (await spawn(ev, ctx)) || fired;
                // cell.debug(" - spawned");
                if (fired) {
                    break;
                }
            }
        }
        return fired;
    }
    activatesOn(name) {
        for (let tile of this.tiles()) {
            if (tile.activatesOn(name))
                return true;
        }
        return false;
    }
    // ITEM
    get item() {
        return this._item;
    }
    set item(item) {
        if (this.item) {
            this.removeSprite(this.item.sprite);
        }
        this._item = item;
        if (item) {
            this.flags |= Cell.HAS_ITEM;
            this.addSprite(item.sprite, Layer.ITEM);
        }
        else {
            this.flags &= ~Cell.HAS_ITEM;
        }
    }
    // ACTOR
    get actor() {
        return this._actor;
    }
    set actor(actor) {
        if (this.actor) {
            this.removeSprite(this.actor.sprite);
        }
        this._actor = actor;
        if (actor) {
            this.flags |= Cell.HAS_ACTOR;
            this.addSprite(actor.sprite, Layer.ACTOR);
        }
        else {
            this.flags &= ~Cell.HAS_ACTOR;
        }
    }
    // SPRITES
    addSprite(sprite, layer = Layer.GROUND, priority = 50) {
        if (!sprite)
            return;
        // this.flags |= Flags.NEEDS_REDRAW;
        this.flags |= Cell.CELL_CHANGED;
        if (!this.sprites ||
            this.sprites.layer > layer ||
            (this.sprites.layer == layer && this.sprites.priority > priority)) {
            this.sprites = { layer, priority, sprite, next: this.sprites };
            return;
        }
        let current = this.sprites;
        while (current.next &&
            (current.layer < layer ||
                (current.layer == layer && current.priority <= priority))) {
            current = current.next;
        }
        const item = { layer, priority, sprite, next: current.next };
        current.next = item;
    }
    removeSprite(sprite) {
        if (!sprite)
            return false;
        if (!this.sprites)
            return false;
        // this.flags |= Flags.NEEDS_REDRAW;
        this.flags |= Cell.CELL_CHANGED;
        if (this.sprites && this.sprites.sprite === sprite) {
            this.sprites = this.sprites.next;
            return true;
        }
        let prev = this.sprites;
        let current = this.sprites.next;
        while (current) {
            if (current.sprite === sprite) {
                prev.next = current.next;
                return true;
            }
            prev = current;
            current = current.next;
        }
        return false;
    }
    // MEMORY
    storeMemory() {
        const memory = this.memory;
        memory.tileFlags = this.tileFlags();
        memory.tileMechFlags = this.tileMechFlags();
        memory.cellFlags = this.flags;
        memory.cellMechFlags = this.mechFlags;
        memory.tile = this.highestPriorityTile();
        if (this.item) {
            memory.item = this.item;
            memory.itemQuantity = this.item.quantity;
        }
        else {
            memory.item = null;
            memory.itemQuantity = 0;
        }
        memory.actor = this.actor;
        getAppearance(this, memory.mixer);
        if (this.actor && this.isOrWasAnyKindOfVisible()) {
            if (this.actor.rememberedInCell && this.actor.rememberedInCell !== this) {
                // console.log("remembered in cell change");
                this.actor.rememberedInCell.storeMemory();
                this.actor.rememberedInCell.flags |= Cell.NEEDS_REDRAW;
            }
            this.actor.rememberedInCell = this;
        }
    }
}
function make$3(tile) {
    const cell = new Cell$1();
    if (tile) {
        cell._setTile(tile);
    }
    return cell;
}
make$5.cell = make$3;
function getAppearance(cell, dest) {
    const memory = cell.memory.mixer;
    memory.blackOut();
    let needDistinctness = cell.tileMechFlags() & TileMech.TM_VISUALLY_DISTINCT;
    let current = cell.sprites;
    while (current) {
        let alpha = current.sprite.opacity || 100;
        if (current.layer == Layer.LIQUID) {
            alpha = utils.clamp(cell.liquidVolume || 0, 20, 100);
        }
        else if (current.layer == Layer.GAS) {
            alpha = utils.clamp(cell.gasVolume || 0, 20, 100);
        }
        memory.drawSprite(current.sprite, alpha);
        current = current.next;
    }
    memory.fg.multiply(cell.light);
    memory.bg.multiply(cell.light);
    memory.bake(!cell.isAnyKindOfVisible()); // turns off dancing if not visible
    if (needDistinctness) {
        color.separate(memory.fg, memory.bg);
    }
    dest.drawSprite(memory);
    return true;
}

var cell = {
    __proto__: null,
    get Flags () { return Cell; },
    get MechFlags () { return CellMech; },
    CellMemory: CellMemory,
    Cell: Cell$1,
    make: make$3,
    getAppearance: getAppearance
};

utils.setDefaults(config$1, {
    "map.deepestLevel": 99,
});
class Map$1 {
    constructor(w, h, opts = {}) {
        this.locations = {};
        this.config = {};
        this._actors = null;
        this._items = null;
        this.flags = 0;
        this.ambientLight = null;
        this.lights = null;
        this.events = {};
        this._width = w;
        this._height = h;
        this.cells = grid.make(w, h, () => new Cell$1());
        this.locations = opts.locations || {};
        this.config = Object.assign({}, opts);
        this.config.tick = this.config.tick || 100;
        this._actors = null;
        this._items = null;
        this.flags = flag.from(Map, Map.MAP_DEFAULT, opts.flags);
        this.ambientLight = null;
        const ambient = opts.ambient || opts.ambientLight || opts.light;
        if (ambient) {
            this.ambientLight = color.make(ambient);
        }
        this.lights = null;
        this.id = opts.id;
        this.events = opts.events || {};
    }
    get width() {
        return this._width;
    }
    get height() {
        return this._height;
    }
    async start() { }
    nullify() {
        this.cells.forEach((c) => c.nullify());
    }
    dump(fmt) {
        this.cells.dump(fmt || ((c) => c.dump()));
    }
    cell(x, y) {
        return this.cells[x][y];
    }
    eachCell(fn) {
        this.cells.forEach((c, i, j) => fn(c, i, j, this));
    }
    forEach(fn) {
        this.cells.forEach((c, i, j) => fn(c, i, j, this));
    }
    forRect(x, y, w, h, fn) {
        this.cells.forRect(x, y, w, h, (c, i, j) => fn(c, i, j, this));
    }
    eachNeighbor(x, y, fn, only4dirs = false) {
        this.cells.eachNeighbor(x, y, (c, i, j) => fn(c, i, j, this), only4dirs);
    }
    hasXY(x, y) {
        return this.cells.hasXY(x, y);
    }
    isBoundaryXY(x, y) {
        return this.cells.isBoundaryXY(x, y);
    }
    changed(v) {
        if (v === true) {
            this.flags |= Map.MAP_CHANGED;
        }
        else if (v === false) {
            this.flags &= ~Map.MAP_CHANGED;
        }
        return this.flags & Map.MAP_CHANGED;
    }
    hasCellFlag(x, y, flag) {
        return this.cell(x, y).flags & flag;
    }
    hasCellMechFlag(x, y, flag) {
        return this.cell(x, y).mechFlags & flag;
    }
    hasTileFlag(x, y, flag) {
        return this.cell(x, y).hasTileFlag(flag);
    }
    hasTileMechFlag(x, y, flag) {
        return this.cell(x, y).hasTileMechFlag(flag);
    }
    setCellFlag(x, y, flag) {
        this.cell(x, y).flags |= flag;
    }
    redrawCell(cell) {
        // if (cell.isAnyKindOfVisible()) {
        cell._needsRedraw();
        this.flags |= Map.MAP_CHANGED;
        // }
    }
    redrawXY(x, y) {
        const cell = this.cell(x, y);
        this.redrawCell(cell);
    }
    redrawAll() {
        this.forEach((c) => {
            // if (c.isAnyKindOfVisible()) {
            c.flags |= Cell.NEEDS_REDRAW;
            // }
        });
        this.flags |= Map.MAP_CHANGED;
    }
    revealAll() {
        this.forEach((c) => {
            c.markRevealed();
            c.storeMemory();
        });
    }
    markRevealed(x, y) {
        if (!this.cell(x, y).markRevealed())
            return;
        if (data.player) {
            data.player.invalidateCostMap();
        }
    }
    isVisible(x, y) {
        return this.cell(x, y).isVisible();
    }
    isAnyKindOfVisible(x, y) {
        return this.cell(x, y).isAnyKindOfVisible();
    }
    isOrWasAnyKindOfVisible(x, y) {
        return this.cell(x, y).isOrWasAnyKindOfVisible();
    }
    hasVisibleLight(x, y) {
        return this.cell(x, y).hasVisibleLight();
    }
    setFlag(flag) {
        this.flags |= flag;
        this.changed(true);
    }
    setFlags(mapFlag = 0, cellFlag = 0, cellMechFlag = 0) {
        if (mapFlag) {
            this.flags |= mapFlag;
        }
        if (cellFlag || cellMechFlag) {
            this.forEach((c) => c.setFlags(cellFlag, cellMechFlag));
        }
        this.changed(true);
    }
    clearFlag(flag) {
        this.flags &= ~flag;
        this.changed(true);
    }
    clearFlags(mapFlag = 0, cellFlag = 0, cellMechFlag = 0) {
        if (mapFlag) {
            this.flags &= ~mapFlag;
        }
        if (cellFlag || cellMechFlag) {
            this.forEach((cell) => cell.clearFlags(cellFlag, cellMechFlag));
        }
        this.changed(true);
    }
    setCellFlags(x, y, cellFlag = 0, cellMechFlag = 0) {
        this.cell(x, y).setFlags(cellFlag, cellMechFlag);
        this.flags |= Map.MAP_CHANGED;
    }
    clearCellFlags(x, y, cellFlags = 0, cellMechFlags = 0) {
        this.cell(x, y).clearFlags(cellFlags, cellMechFlags);
        this.changed(true);
    }
    hasTile(x, y, tile) {
        return this.cells[x][y].hasTile(tile);
    }
    tileFlags(x, y, limitToPlayerKnowledge = false) {
        return this.cells[x][y].tileFlags(limitToPlayerKnowledge);
    }
    tileMechFlags(x, y, limitToPlayerKnowledge = false) {
        return this.cells[x][y].tileMechFlags(limitToPlayerKnowledge);
    }
    tileWithFlag(x, y, flag = 0) {
        return this.cells[x][y].tileWithFlag(flag);
    }
    tileWithMechFlag(x, y, mechFlag = 0) {
        return this.cells[x][y].tileWithMechFlag(mechFlag);
    }
    hasKnownTileFlag(x, y, flagMask = 0) {
        return this.cells[x][y].memory.tileFlags & flagMask;
    }
    // hasTileInGroup(x, y, ...groups) { return this.cells[x][y].hasTileInGroup(...groups); }
    discoveredTileFlags(x, y) {
        return this.cells[x][y].discoveredTileFlags();
    }
    hasDiscoveredTileFlag(x, y, flag = 0) {
        return this.cells[x][y].hasDiscoveredTileFlag(flag);
    }
    canBePassed(x, y, limitToPlayerKnowledge = false) {
        return this.cells[x][y].canBePassed(limitToPlayerKnowledge);
    }
    isPassableNow(x, y, limitToPlayerKnowledge = false) {
        return this.cells[x][y].isPassableNow(limitToPlayerKnowledge);
    }
    isNull(x, y) {
        return this.cells[x][y].isNull();
    }
    isEmpty(x, y) {
        return this.cells[x][y].isEmpty();
    }
    isObstruction(x, y, limitToPlayerKnowledge = false) {
        return this.cells[x][y].isObstruction(limitToPlayerKnowledge);
    }
    isDoor(x, y, limitToPlayerKnowledge = false) {
        return this.cells[x][y].isDoor(limitToPlayerKnowledge);
    }
    isLiquid(x, y, limitToPlayerKnowledge = false) {
        return this.cells[x][y].isLiquid(limitToPlayerKnowledge);
    }
    hasGas(x, y, limitToPlayerKnowledge = false) {
        return this.cells[x][y].hasGas(limitToPlayerKnowledge);
    }
    blocksPathing(x, y, limitToPlayerKnowledge = false) {
        return this.cells[x][y].blocksPathing(limitToPlayerKnowledge);
    }
    blocksVision(x, y) {
        return this.cells[x][y].blocksVision();
    }
    highestPriorityTile(x, y, skipGas = false) {
        return this.cells[x][y].highestPriorityTile(skipGas);
    }
    tileFlavor(x, y) {
        return this.cells[x][y].tileFlavor();
    }
    setTile(x, y, tileId, volume = 0) {
        return this.cell(x, y)._setTile(tileId, volume, this);
    }
    clearLayersWithFlags(x, y, tileFlags, tileMechFlags = 0) {
        const cell = this.cell(x, y);
        cell.clearLayersWithFlags(tileFlags, tileMechFlags);
    }
    clearCellLayers(x, y, nullLiquid = true, nullSurface = true, nullGas = true) {
        this.changed(true);
        return this.cell(x, y).nullifyLayers(nullLiquid, nullSurface, nullGas);
    }
    fill(tileId, boundaryTile) {
        let i, j;
        if (boundaryTile === undefined) {
            boundaryTile = tileId;
        }
        for (i = 0; i < this.width; ++i) {
            for (j = 0; j < this.height; ++j) {
                if (this.isBoundaryXY(i, j)) {
                    this.setTile(i, j, boundaryTile);
                }
                else {
                    this.setTile(i, j, tileId);
                }
            }
        }
    }
    neighborCount(x, y, matchFn, only4dirs = false) {
        let count = 0;
        this.eachNeighbor(x, y, (...args) => {
            if (matchFn(...args))
                ++count;
        }, only4dirs);
        return count;
    }
    passableArcCount(x, y) {
        if (!this.hasXY(x, y))
            return -1;
        return this.cells.arcCount(x, y, (c) => c.isPassableNow());
    }
    diagonalBlocked(x1, y1, x2, y2, limitToPlayerKnowledge = false) {
        if (x1 == x2 || y1 == y2) {
            return false; // If it's not a diagonal, it's not diagonally blocked.
        }
        const locFlags1 = this.tileFlags(x1, y2, limitToPlayerKnowledge);
        if (locFlags1 & Tile.T_OBSTRUCTS_DIAGONAL_MOVEMENT) {
            return true;
        }
        const locFlags2 = this.tileFlags(x2, y1, limitToPlayerKnowledge);
        if (locFlags2 & Tile.T_OBSTRUCTS_DIAGONAL_MOVEMENT) {
            return true;
        }
        return false;
    }
    fillCostGrid(costGrid, costFn) {
        costFn = costFn || utils.ONE;
        this.cells.forEach((cell, i, j) => {
            if (cell.isNull()) {
                costGrid[i][j] = path.OBSTRUCTION;
            }
            else {
                costGrid[i][j] = cell.canBePassed()
                    ? costFn(cell, i, j, this)
                    : path.OBSTRUCTION;
            }
        });
    }
    matchingNeighbor(x, y, matcher, only4dirs = false) {
        const maxIndex = only4dirs ? 4 : 8;
        for (let d = 0; d < maxIndex; ++d) {
            const dir = utils.DIRS[d];
            const i = x + dir[0];
            const j = y + dir[1];
            if (this.hasXY(i, j)) {
                if (matcher(this.cells[i][j], i, j, this))
                    return [i, j];
            }
        }
        return null;
    }
    matchingLocNear(x, y, ...args) {
        let i, j, k;
        let matcher = args[0];
        let opts = args[1] || {};
        const arg = args[0];
        if (typeof arg !== "function") {
            opts = arg || args[1];
            matcher = opts.match || utils.TRUE;
        }
        const hallwaysAllowed = opts.hallways || false;
        const blockingMap = opts.blockingMap || null;
        const forbidLiquid = opts.liquids === false;
        const deterministic = opts.deterministic || false;
        const candidateLocs = [];
        // count up the number of candidate locations
        for (k = 0; k < Math.max(this.width, this.height) && !candidateLocs.length; k++) {
            for (i = x - k; i <= x + k; i++) {
                for (j = y - k; j <= y + k; j++) {
                    if (!this.hasXY(i, j))
                        continue;
                    const cell = this.cell(i, j);
                    // if ((i == x-k || i == x+k || j == y-k || j == y+k)
                    if (Math.ceil(utils.distanceBetween(x, y, i, j)) == k &&
                        (!blockingMap || !blockingMap[i][j]) &&
                        matcher(cell, i, j, this) &&
                        (!forbidLiquid || !cell.liquid) &&
                        (hallwaysAllowed || this.passableArcCount(i, j) < 2)) {
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
        }
        else {
            randIndex = random.number(candidateLocs.length);
        }
        return candidateLocs[randIndex];
    }
    // fills (*x, *y) with the coordinates of a random cell with
    // no creatures, items or stairs and with either a matching liquid and dungeon type
    // or at least one layer of type terrainType.
    // A dungeon, liquid type of -1 will match anything.
    randomMatchingLoc(opts = {}) {
        let x;
        let y;
        let cell;
        if (typeof opts === "function") {
            opts = { match: opts };
        }
        const hallwaysAllowed = opts.hallways || false;
        const blockingMap = opts.blockingMap || null;
        const forbidLiquid = opts.liquids === false;
        const matcher = opts.match || utils.TRUE;
        const forbidCellFlags = opts.forbidCellFlags || 0;
        const forbidTileFlags = opts.forbidTileFlags || 0;
        const forbidTileMechFlags = opts.forbidTileMechFlags || 0;
        const tile = opts.tile || null;
        let tries = opts.tries || 500;
        let retry = true;
        while (retry) {
            tries--;
            if (!tries)
                break;
            x = random.range(0, this.width - 1);
            y = random.range(0, this.height - 1);
            cell = this.cell(x, y);
            if ((!blockingMap || !blockingMap[x][y]) &&
                (!tile || cell.hasTile(tile)) &&
                (!forbidLiquid || !cell.liquid) &&
                (!forbidCellFlags || !(cell.flags & forbidCellFlags)) &&
                (!forbidTileFlags || !cell.hasTileFlag(forbidTileFlags)) &&
                (!forbidTileMechFlags || !cell.hasTileMechFlag(forbidTileMechFlags)) &&
                (hallwaysAllowed || this.passableArcCount(x, y) < 2) &&
                matcher(cell, x, y, this)) {
                retry = false;
            }
        }
        if (!tries) {
            // map.debug('randomMatchingLocation', dungeonType, liquidType, terrainType, ' => FAIL');
            return false;
        }
        // map.debug('randomMatchingLocation', dungeonType, liquidType, terrainType, ' => ', x, y);
        return [x, y];
    }
    // LIGHT
    addLight(x, y, light) {
        const info = { x, y, light, next: this.lights };
        this.lights = info;
        this.flags &= ~(Map.MAP_STABLE_LIGHTS | Map.MAP_STABLE_GLOW_LIGHTS);
        return info;
    }
    removeLight(info) {
        utils.removeFromChain(this, "lights", info);
        this.flags &= ~(Map.MAP_STABLE_LIGHTS | Map.MAP_STABLE_GLOW_LIGHTS);
    }
    eachGlowLight(fn) {
        utils.eachChain(this.lights, (info) => fn(info.light, info.x, info.y));
        this.eachCell((cell, x, y) => {
            for (let tile of cell.tiles()) {
                if (tile.light) {
                    fn(tile.light, x, y);
                }
            }
        });
    }
    eachDynamicLight(fn) {
        utils.eachChain(this._actors, (actor) => {
            if (actor.light)
                fn(actor.light, actor.x, actor.y);
        });
    }
    // FX
    addFx(x, y, anim) {
        if (!this.hasXY(x, y))
            return false;
        const cell = this.cell(x, y);
        cell.addSprite(anim.sprite, Layer.FX);
        anim.x = x;
        anim.y = y;
        this.redrawCell(cell);
        return true;
    }
    moveFx(x, y, anim) {
        if (!this.hasXY(x, y))
            return false;
        const cell = this.cell(x, y);
        const oldCell = this.cell(anim.x, anim.y);
        oldCell.removeSprite(anim.sprite);
        this.redrawCell(oldCell);
        cell.addSprite(anim.sprite, Layer.FX);
        this.redrawCell(cell);
        anim.x = x;
        anim.y = y;
        return true;
    }
    removeFx(anim) {
        const oldCell = this.cell(anim.x, anim.y);
        oldCell.removeSprite(anim.sprite);
        this.redrawCell(oldCell);
        this.flags |= Map.MAP_CHANGED;
        return true;
    }
    // ACTORS
    // will return the PLAYER if the PLAYER is at (x, y).
    actorAt(x, y) {
        // creature *
        if (!this.hasXY(x, y))
            return null;
        const cell = this.cell(x, y);
        return cell.actor;
    }
    addActor(x, y, theActor) {
        if (!this.hasXY(x, y))
            return false;
        const cell = this.cell(x, y);
        if (cell.actor) {
            return false;
        }
        cell.actor = theActor;
        theActor.next = this._actors;
        this._actors = theActor;
        const layer = theActor === data.player ? Layer.PLAYER : Layer.ACTOR;
        cell.addSprite(theActor.sprite, layer);
        const flag = theActor === data.player ? Cell.HAS_PLAYER : Cell.HAS_MONSTER;
        cell.flags |= flag;
        // if (theActor.flags & Flags.Actor.MK_DETECTED)
        // {
        // 	cell.flags |= CellFlags.MONSTER_DETECTED;
        // }
        if (theActor.light) {
            this.flags &= ~Map.MAP_STABLE_LIGHTS;
        }
        // If the player moves or an actor that blocks vision and the cell is visible...
        // -- we need to update the FOV
        if (theActor.isPlayer() ||
            (cell.isAnyKindOfVisible() && theActor.blocksVision())) {
            this.flags |= Map.MAP_FOV_CHANGED;
        }
        theActor.x = x;
        theActor.y = y;
        this.redrawCell(cell);
        return true;
    }
    addActorNear(x, y, theActor) {
        const loc = this.matchingLocNear(x, y, (cell) => {
            return theActor.avoidsCell(cell);
        });
        if (!loc || loc[0] < 0) {
            // GW.ui.message(colors.badMessageColor, 'There is no place to put the actor.');
            return false;
        }
        return this.addActor(loc[0], loc[1], theActor);
    }
    moveActor(x, y, actor) {
        if (!this.hasXY(x, y))
            return false;
        this.removeActor(actor);
        if (!this.addActor(x, y, actor)) {
            this.addActor(actor.x, actor.y, actor);
            return false;
        }
        if (actor.light) {
            this.flags &= ~Map.MAP_STABLE_LIGHTS;
        }
        return true;
    }
    removeActor(actor) {
        if (!this.hasXY(actor.x, actor.y))
            return false;
        const cell = this.cell(actor.x, actor.y);
        if (cell.actor === actor) {
            cell.actor = null;
            utils.removeFromChain(this, "actors", actor);
            cell.flags &= ~Cell.HAS_ACTOR;
            cell.removeSprite(actor.sprite);
            if (actor.light) {
                this.flags &= ~Map.MAP_STABLE_LIGHTS;
            }
            // If the player moves or an actor that blocks vision and the cell is visible...
            // -- we need to update the FOV
            if (actor.isPlayer() ||
                (cell.isAnyKindOfVisible() && actor.blocksVision())) {
                this.flags |= Map.MAP_FOV_CHANGED;
            }
            this.redrawCell(cell);
            return true;
        }
        return false;
    }
    deleteActorAt(x, y) {
        const actor = this.actorAt(x, y);
        if (!actor)
            return false;
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
    itemAt(x, y) {
        const cell = this.cell(x, y);
        return cell.item;
    }
    addItem(x, y, theItem) {
        if (!this.hasXY(x, y))
            return false;
        const cell = this.cell(x, y);
        if (cell.flags & Cell.HAS_ITEM) {
            // GW.ui.message(colors.badMessageColor, 'There is already an item there.');
            return false;
        }
        theItem.x = x;
        theItem.y = y;
        cell.item = theItem;
        theItem.next = this._items;
        this._items = theItem;
        cell.addSprite(theItem.sprite, Layer.ITEM);
        cell.flags |= Cell.HAS_ITEM;
        if (theItem.light) {
            this.flags &= ~Map.MAP_STABLE_LIGHTS;
        }
        this.redrawCell(cell);
        if (theItem.isDetected() || config$1.D_ITEM_OMNISCIENCE) {
            cell.flags |= Cell.ITEM_DETECTED;
        }
        return true;
    }
    addItemNear(x, y, theItem) {
        const loc = this.matchingLocNear(x, y, (cell) => {
            return theItem.forbidsCell(cell);
        });
        if (!loc || loc[0] < 0) {
            // GW.ui.message(colors.badMessageColor, 'There is no place to put the item.');
            return false;
        }
        return this.addItem(loc[0], loc[1], theItem);
    }
    removeItem(theItem) {
        const x = theItem.x;
        const y = theItem.y;
        if (!this.hasXY(x, y))
            return false;
        const cell = this.cell(x, y);
        if (cell.item !== theItem)
            return false;
        cell.removeSprite(theItem.sprite);
        cell.item = null;
        utils.removeFromChain(this, "items", theItem);
        if (theItem.light) {
            this.flags &= ~Map.MAP_STABLE_LIGHTS;
        }
        cell.flags &= ~(Cell.HAS_ITEM | Cell.ITEM_DETECTED);
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
    gridDisruptsPassability(blockingGrid, opts = {}) {
        const walkableGrid = grid.alloc(this.width, this.height);
        let disrupts = false;
        const gridOffsetX = opts.gridOffsetX || 0;
        const gridOffsetY = opts.gridOffsetY || 0;
        const bounds = opts.bounds || null;
        // Get all walkable locations after lake added
        this.cells.forEach((cell, i, j) => {
            if (bounds && !bounds.contains(i, j))
                return; // outside bounds
            const blockingX = i + gridOffsetX;
            const blockingY = j + gridOffsetY;
            if (cell.isNull()) {
                return; // do nothing
            }
            else if (cell.canBePassed()) {
                if (blockingGrid.hasXY(blockingX, blockingY) &&
                    blockingGrid[blockingX][blockingY])
                    return;
                walkableGrid[i][j] = 1;
            }
            else if (cell.hasTileFlag(Tile.T_HAS_STAIRS)) {
                if (blockingGrid.hasXY(blockingX, blockingY) &&
                    blockingGrid[blockingX][blockingY]) {
                    disrupts = true;
                }
                else {
                    walkableGrid[i][j] = 1;
                }
            }
        });
        let first = true;
        for (let i = 0; i < walkableGrid.width && !disrupts; ++i) {
            for (let j = 0; j < walkableGrid.height && !disrupts; ++j) {
                if (walkableGrid[i][j] == 1) {
                    if (first) {
                        walkableGrid.floodFill(i, j, 1, 2);
                        first = false;
                    }
                    else {
                        disrupts = true;
                    }
                }
            }
        }
        grid.free(walkableGrid);
        return disrupts;
    }
    // FOV
    // Returns a boolean grid indicating whether each square is in the field of view of (xLoc, yLoc).
    // forbiddenTileFlags is the set of terrain flags that will block vision (but the blocking cell itself is
    // illuminated); forbiddenCellFlags is the set of map flags that will block vision.
    // If cautiousOnWalls is set, we will not illuminate blocking tiles unless the tile one space closer to the origin
    // is visible to the player; this is to prevent lights from illuminating a wall when the player is on the other
    // side of the wall.
    calcFov(grid, x, y, maxRadius, forbiddenCellFlags = 0, forbiddenTileFlags = Tile.T_OBSTRUCTS_VISION) {
        maxRadius = maxRadius || this.width + this.height;
        grid.fill(0);
        const map = this;
        const FOV = new fov.FOV({
            isBlocked(i, j) {
                return !!(!grid.hasXY(i, j) ||
                    map.hasCellFlag(i, j, forbiddenCellFlags) ||
                    map.hasTileFlag(i, j, forbiddenTileFlags));
            },
            calcRadius(x, y) {
                return Math.sqrt(x ** 2 + y ** 2);
            },
            setVisible(x, y) {
                grid[x][y] = 1;
            },
            hasXY(x, y) {
                return grid.hasXY(x, y);
            },
        });
        return FOV.calculate(x, y, maxRadius);
    }
    losFromTo(a, b) {
        const line = utils.getLine(a.x, a.y, b.x, b.y);
        if (!line || !line.length)
            return false;
        return !line.some((loc) => {
            return this.blocksVision(loc[0], loc[1]);
        });
    }
    // MEMORIES
    storeMemory(x, y) {
        const cell = this.cell(x, y);
        cell.storeMemory();
    }
    storeMemories() {
        let x, y;
        for (x = 0; x < this.width; ++x) {
            for (y = 0; y < this.height; ++y) {
                const cell = this.cell(x, y);
                if (cell.flags & Cell.ANY_KIND_OF_VISIBLE) {
                    this.storeMemory(x, y);
                }
                cell.flags &= Cell.PERMANENT_CELL_FLAGS;
                cell.mechFlags &= CellMech.PERMANENT_MECH_FLAGS;
            }
        }
    }
    // TICK
    async tick() {
        // map.debug("tick");
        this.forEach((c) => (c.mechFlags &= ~(CellMech.EVENT_FIRED_THIS_TURN | CellMech.EVENT_PROTECTED)));
        for (let x = 0; x < this.width; ++x) {
            for (let y = 0; y < this.height; ++y) {
                const cell = this.cells[x][y];
                await cell.activate("tick", { map: this, x, y, cell, safe: true });
            }
        }
        updateLiquid(this);
    }
    resetEvents() {
        this.forEach((c) => (c.mechFlags &= ~(CellMech.EVENT_FIRED_THIS_TURN | CellMech.EVENT_PROTECTED)));
    }
}
function make$4(w, h, opts = {}, wall) {
    if (typeof opts === "string") {
        opts = { tile: opts };
        if (wall) {
            opts.wall = wall;
        }
    }
    const map = new Map$1(w, h, opts);
    const floor = opts.tile || opts.floor || opts.floorTile;
    const boundary = opts.boundary || opts.wall || opts.wallTile;
    if (floor) {
        map.fill(floor, boundary);
    }
    if (!data.map) {
        data.map = map;
    }
    return map;
}
make$5.map = make$4;
function getCellAppearance(map, x, y, dest) {
    dest.blackOut();
    if (!map.hasXY(x, y))
        return;
    const cell$1 = map.cell(x, y);
    if (cell$1.isAnyKindOfVisible() &&
        cell$1.flags & (Cell.CELL_CHANGED | Cell.NEEDS_REDRAW)) {
        getAppearance(cell$1, dest);
    }
    else if (cell$1.isRevealed()) {
        dest.drawSprite(cell$1.memory.mixer);
    }
    if (cell$1.isVisible()) ;
    else if (!cell$1.isRevealed()) {
        dest.blackOut();
    }
    else if (!cell$1.isAnyKindOfVisible()) {
        dest.bg.mix(colors.black, 30);
        dest.fg.mix(colors.black, 30);
    }
    let needDistinctness = false;
    if (cell$1.flags & (Cell.IS_CURSOR | Cell.IS_IN_PATH)) {
        const highlight = cell$1.flags & Cell.IS_CURSOR ? colors.cursorColor : colors.yellow;
        if (cell$1.hasTileMechFlag(TileMech.TM_INVERT_WHEN_HIGHLIGHTED)) {
            color.swap(dest.fg, dest.bg);
        }
        else {
            // if (!GAME.trueColorMode || !dest.needDistinctness) {
            // dest.fg.mix(highlight, CONFIG.cursorPathIntensity || 20);
            // }
            dest.bg.mix(highlight, config$1.cursorPathIntensity || 20);
        }
        needDistinctness = true;
    }
    if (needDistinctness) {
        color.separate(dest.fg, dest.bg);
    }
    // dest.bake();
}
function addText(map, x, y, text, fg, bg, layer) {
    for (let ch of text) {
        const sprite = canvas.makeSprite(ch, fg, bg);
        const cell = map.cell(x++, y);
        cell.addSprite(sprite, layer || Layer.GROUND);
    }
}
function updateGas(map) {
    if (map.flags & Map.MAP_NO_GAS)
        return;
    const newVolume = grid.alloc(map.width, map.height);
    map.forEach((c, x, y) => {
        if (c.hasTileFlag(Tile.T_OBSTRUCTS_GAS))
            return;
        let gas = c.gas;
        let highest = c.gasVolume;
        let sum = c.gasVolume;
        let count = 1;
        map.eachNeighbor(x, y, (n) => {
            if (n.hasTileFlag(Tile.T_OBSTRUCTS_GAS))
                return;
            ++count;
            sum += n.gasVolume;
            if (n.gasVolume > highest) {
                gas = n.gas;
                highest = n.gasVolume;
            }
        });
        if (!sum)
            return;
        const newVol = Math.floor(sum / count);
        if (c.gas != gas) {
            c._setTile(gas, newVol, map); // volume = 1 to start, will change later
        }
        newVolume[x][y] += newVol;
        const rem = sum - count * Math.floor(sum / count);
        if (rem && random.number(count) < rem) {
            newVolume[x][y] += 1;
        }
        // disperses
        // if (newVolume[x][y] && random.chance(20)) {
        // 	newVolume[x][y] -= 1;
        // }
    });
    let hasGas = false;
    newVolume.forEach((v, i, j) => {
        const cell = map.cell(i, j);
        if (v) {
            hasGas = true;
            if (cell.gas && cell.gasVolume !== v) {
                cell.gasVolume = v;
                map.redrawCell(cell);
            }
        }
        else if (cell.gas) {
            cell.clearLayer(Layer.GAS);
            map.redrawCell(cell);
        }
    });
    if (hasGas) {
        map.flags &= ~Map.MAP_NO_GAS;
    }
    else {
        map.flags |= Map.MAP_NO_GAS;
    }
    map.changed(true);
    grid.free(newVolume);
}
function updateLiquid(map) {
    if (map.flags & Map.MAP_NO_LIQUID)
        return;
    const newVolume = grid.alloc(map.width, map.height);
    map.forEach((c, x, y) => {
        if (c.hasTileFlag(Tile.T_OBSTRUCTS_LIQUID))
            return;
        let liquid = c.liquid;
        let highest = c.liquidVolume;
        let count = 1;
        map.eachNeighbor(x, y, (n) => {
            if (n.hasTileFlag(Tile.T_OBSTRUCTS_LIQUID))
                return;
            ++count;
            if (n.liquidVolume > highest) {
                liquid = n.liquid;
                highest = n.liquidVolume;
            }
        });
        let newVol = c.liquidVolume;
        if (newVol > 10 && count > 1) {
            let spread = Math.round(0.2 * c.liquidVolume);
            if (spread > 5) {
                newVol -= spread;
                if (c.liquid != liquid) {
                    c._setTile(liquid, newVol, map); // volume = 1 to start, will change later
                }
                // spread = Math.floor(spread / count);
                if (spread) {
                    newVolume.eachNeighbor(x, y, (v, i, j) => {
                        newVolume[i][j] = v + spread;
                    });
                }
            }
        }
        newVolume[x][y] += newVol;
        // disperses
        const tile = c.liquidTile;
        if (newVolume[x][y] > 0 && random.chance(tile.dissipate, 10000)) {
            newVolume[x][y] -= 1;
        }
    });
    let hasLiquid = false;
    newVolume.forEach((v, i, j) => {
        const cell = map.cell(i, j);
        if (v) {
            hasLiquid = true;
            if (cell.liquid && cell.liquidVolume !== v) {
                cell.liquidVolume = v;
                map.redrawCell(cell);
            }
        }
        else if (cell.liquid) {
            cell.clearLayer(Layer.LIQUID);
            map.redrawCell(cell);
        }
    });
    if (hasLiquid) {
        map.flags &= ~Map.MAP_NO_LIQUID;
    }
    else {
        map.flags |= Map.MAP_NO_LIQUID;
    }
    map.changed(true);
    grid.free(newVolume);
}

var map = {
    __proto__: null,
    get Flags () { return Map; },
    Map: Map$1,
    make: make$4,
    getCellAppearance: getCellAppearance,
    addText: addText,
    updateGas: updateGas,
    updateLiquid: updateLiquid
};

// These are the minimal set of tiles to make the diggers work
install$2("NULL", {
    ch: "\u2205",
    fg: "white",
    bg: "black",
    flags: "T_OBSTRUCTS_PASSABILITY",
    name: "eerie nothingness",
    article: "an",
    priority: 0,
});
install$2("FLOOR", {
    ch: "\u00b7",
    fg: [30, 30, 30, 20, 0, 0, 0],
    bg: [2, 2, 10, 0, 2, 2, 0],
    priority: 10,
    article: "the",
});
install$2("DOOR", {
    ch: "+",
    fg: [100, 40, 40],
    bg: [30, 60, 60],
    priority: 30,
    flags: "T_IS_DOOR, T_OBSTRUCTS_TILE_EFFECTS, T_OBSTRUCTS_ITEMS, T_OBSTRUCTS_VISION, TM_VISUALLY_DISTINCT",
    article: "a",
    activates: {
        enter: { tile: "DOOR_OPEN" },
        open: { tile: "DOOR_OPEN_ALWAYS" },
    },
});
install$2("DOOR_OPEN", "DOOR", {
    ch: "'",
    fg: [100, 40, 40],
    bg: [30, 60, 60],
    priority: 40,
    flags: "!T_OBSTRUCTS_ITEMS, !T_OBSTRUCTS_VISION",
    name: "open door",
    article: "an",
    activates: {
        tick: { tile: "DOOR", flags: "DFF_SUPERPRIORITY, DFF_ONLY_IF_EMPTY" },
        enter: null,
        open: null,
        close: { tile: "DOOR", flags: "DFF_SUPERPRIORITY, DFF_ONLY_IF_EMPTY" },
    },
});
install$2("DOOR_OPEN_ALWAYS", "DOOR_OPEN", {
    activates: {
        tick: null,
        close: { tile: "DOOR", flags: "DFF_SUPERPRIORITY, DFF_ONLY_IF_EMPTY" },
    },
});
install$2("BRIDGE", {
    ch: "=",
    fg: [100, 40, 40],
    priority: 40,
    layer: "SURFACE",
    flags: "T_BRIDGE, TM_VISUALLY_DISTINCT",
    article: "a",
});
install$2("UP_STAIRS", {
    ch: "<",
    fg: [100, 40, 40],
    bg: [100, 60, 20],
    priority: 200,
    flags: "T_UP_STAIRS, T_STAIR_BLOCKERS, TM_VISUALLY_DISTINCT, TM_LIST_IN_SIDEBAR",
    name: "upward staircase",
    article: "an",
});
install$2("DOWN_STAIRS", {
    ch: ">",
    fg: [100, 40, 40],
    bg: [100, 60, 20],
    priority: 200,
    flags: "T_DOWN_STAIRS, T_STAIR_BLOCKERS, TM_VISUALLY_DISTINCT, TM_LIST_IN_SIDEBAR",
    name: "downward staircase",
    article: "a",
});
install$2("WALL", {
    ch: "#",
    fg: [7, 7, 7, 0, 3, 3, 3],
    bg: [40, 40, 40, 10, 10, 0, 5],
    priority: 100,
    flags: "T_OBSTRUCTS_EVERYTHING",
    article: "a",
});
install$2("LAKE", {
    ch: "~",
    fg: [5, 8, 20, 10, 0, 4, 15, true],
    bg: [10, 15, 41, 6, 5, 5, 5, true],
    priority: 50,
    flags: "T_DEEP_WATER",
    name: "deep water",
    article: "the",
});

export { cell, light, lights, map, tile, tileEvent, tiles };
