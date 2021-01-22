import { flag as Flag } from "gw-utils";
export var Depth;
(function (Depth) {
    Depth[Depth["ALL_LAYERS"] = -1] = "ALL_LAYERS";
    Depth[Depth["GROUND"] = 0] = "GROUND";
    Depth[Depth["LIQUID"] = 1] = "LIQUID";
    Depth[Depth["SURFACE"] = 2] = "SURFACE";
    Depth[Depth["GAS"] = 3] = "GAS";
    Depth[Depth["ITEM"] = 4] = "ITEM";
    Depth[Depth["ACTOR"] = 5] = "ACTOR";
    Depth[Depth["PLAYER"] = 6] = "PLAYER";
    Depth[Depth["FX"] = 7] = "FX";
    Depth[Depth["UI"] = 8] = "UI";
})(Depth || (Depth = {}));
const Fl = Flag.fl;
export var Layer;
(function (Layer) {
    Layer[Layer["L_DYNAMIC"] = Fl(0)] = "L_DYNAMIC";
    Layer[Layer["L_SUPERPRIORITY"] = Fl(1)] = "L_SUPERPRIORITY";
    Layer[Layer["L_SECRETLY_PASSABLE"] = Fl(2)] = "L_SECRETLY_PASSABLE";
    Layer[Layer["L_BLOCKS_MOVE"] = Fl(3)] = "L_BLOCKS_MOVE";
    Layer[Layer["L_BLOCKS_VISION"] = Fl(4)] = "L_BLOCKS_VISION";
    Layer[Layer["L_BLOCKS_SURFACE"] = Fl(6)] = "L_BLOCKS_SURFACE";
    Layer[Layer["L_BLOCKS_LIQUID"] = Fl(8)] = "L_BLOCKS_LIQUID";
    Layer[Layer["L_BLOCKS_GAS"] = Fl(7)] = "L_BLOCKS_GAS";
    Layer[Layer["L_BLOCKS_ITEMS"] = Fl(5)] = "L_BLOCKS_ITEMS";
    Layer[Layer["L_BLOCKS_ACTORS"] = Fl(11)] = "L_BLOCKS_ACTORS";
    Layer[Layer["L_BLOCKS_EFFECTS"] = Fl(9)] = "L_BLOCKS_EFFECTS";
    Layer[Layer["L_BLOCKS_DIAGONAL"] = Fl(10)] = "L_BLOCKS_DIAGONAL";
    Layer[Layer["L_INTERRUPT_WHEN_SEEN"] = Fl(11)] = "L_INTERRUPT_WHEN_SEEN";
    Layer[Layer["L_BLOCKED_BY_STAIRS"] = Layer.L_BLOCKS_ITEMS |
        Layer.L_BLOCKS_SURFACE |
        Layer.L_BLOCKS_GAS |
        Layer.L_BLOCKS_LIQUID |
        Layer.L_BLOCKS_EFFECTS |
        Layer.L_BLOCKS_ACTORS] = "L_BLOCKED_BY_STAIRS";
    Layer[Layer["L_BLOCKS_SCENT"] = Layer.L_BLOCKS_MOVE | Layer.L_BLOCKS_VISION] = "L_BLOCKS_SCENT";
    Layer[Layer["L_DIVIDES_LEVEL"] = Layer.L_BLOCKS_MOVE] = "L_DIVIDES_LEVEL";
    Layer[Layer["L_WAYPOINT_BLOCKER"] = Layer.L_BLOCKS_MOVE] = "L_WAYPOINT_BLOCKER";
    Layer[Layer["L_IS_WALL"] = Layer.L_BLOCKS_MOVE |
        Layer.L_BLOCKS_VISION |
        Layer.L_BLOCKS_LIQUID |
        Layer.L_BLOCKS_GAS |
        Layer.L_BLOCKS_EFFECTS |
        Layer.L_BLOCKS_DIAGONAL] = "L_IS_WALL";
    Layer[Layer["L_BLOCKS_EVERYTHING"] = Layer.L_IS_WALL |
        Layer.L_BLOCKS_ITEMS |
        Layer.L_BLOCKS_ACTORS |
        Layer.L_BLOCKS_SURFACE] = "L_BLOCKS_EVERYTHING";
})(Layer || (Layer = {}));
///////////////////////////////////////////////////////
// TILE EVENT
export var Activation;
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
export var Tile;
(function (Tile) {
    Tile[Tile["T_LIQUID"] = Fl(0)] = "T_LIQUID";
    Tile[Tile["T_SURFACE"] = Fl(1)] = "T_SURFACE";
    Tile[Tile["T_GAS"] = Fl(2)] = "T_GAS";
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
    Tile[Tile["T_OBSTRUCTS_SCENT"] = Tile.T_AUTO_DESCENT |
        Tile.T_LAVA |
        Tile.T_DEEP_WATER |
        Tile.T_SPONTANEOUSLY_IGNITES |
        Tile.T_HAS_STAIRS] = "T_OBSTRUCTS_SCENT";
    Tile[Tile["T_PATHING_BLOCKER"] = Tile.T_AUTO_DESCENT |
        Tile.T_IS_TRAP |
        Tile.T_LAVA |
        Tile.T_DEEP_WATER |
        Tile.T_IS_FIRE |
        Tile.T_SPONTANEOUSLY_IGNITES |
        Tile.T_ENTANGLES] = "T_PATHING_BLOCKER";
    Tile[Tile["T_DIVIDES_LEVEL"] = Tile.T_AUTO_DESCENT | Tile.T_IS_TRAP | Tile.T_LAVA | Tile.T_DEEP_WATER] = "T_DIVIDES_LEVEL";
    Tile[Tile["T_LAKE_PATHING_BLOCKER"] = Tile.T_AUTO_DESCENT |
        Tile.T_LAVA |
        Tile.T_DEEP_WATER |
        Tile.T_SPONTANEOUSLY_IGNITES] = "T_LAKE_PATHING_BLOCKER";
    Tile[Tile["T_WAYPOINT_BLOCKER"] = Tile.T_AUTO_DESCENT |
        Tile.T_IS_TRAP |
        Tile.T_LAVA |
        Tile.T_DEEP_WATER |
        Tile.T_SPONTANEOUSLY_IGNITES] = "T_WAYPOINT_BLOCKER";
    Tile[Tile["T_MOVES_ITEMS"] = Tile.T_DEEP_WATER | Tile.T_LAVA] = "T_MOVES_ITEMS";
    Tile[Tile["T_CAN_BE_BRIDGED"] = Tile.T_AUTO_DESCENT | Tile.T_LAVA | Tile.T_DEEP_WATER] = "T_CAN_BE_BRIDGED";
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
    Tile[Tile["T_IS_DEEP_LIQUID"] = Tile.T_LAVA | Tile.T_AUTO_DESCENT | Tile.T_DEEP_WATER] = "T_IS_DEEP_LIQUID";
})(Tile || (Tile = {}));
///////////////////////////////////////////////////////
// TILE MECH
export var TileMech;
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
export var Cell;
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
    Cell[Cell["WAS_ANY_KIND_OF_VISIBLE"] = Cell.WAS_VISIBLE |
        Cell.WAS_CLAIRVOYANT_VISIBLE |
        Cell.WAS_TELEPATHIC_VISIBLE] = "WAS_ANY_KIND_OF_VISIBLE";
    Cell[Cell["CELL_DEFAULT"] = Cell.VISIBLE | Cell.IN_FOV | Cell.NEEDS_REDRAW | Cell.CELL_CHANGED] = "CELL_DEFAULT";
})(Cell || (Cell = {}));
///////////////////////////////////////////////////////
// CELL MECH
export var CellMech;
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
export var Map;
(function (Map) {
    Map[Map["MAP_CHANGED"] = Fl(0)] = "MAP_CHANGED";
    Map[Map["MAP_STABLE_GLOW_LIGHTS"] = Fl(1)] = "MAP_STABLE_GLOW_LIGHTS";
    Map[Map["MAP_STABLE_LIGHTS"] = Fl(2)] = "MAP_STABLE_LIGHTS";
    Map[Map["MAP_ALWAYS_LIT"] = Fl(3)] = "MAP_ALWAYS_LIT";
    Map[Map["MAP_SAW_WELCOME"] = Fl(4)] = "MAP_SAW_WELCOME";
    Map[Map["MAP_NO_LIQUID"] = Fl(5)] = "MAP_NO_LIQUID";
    Map[Map["MAP_NO_GAS"] = Fl(6)] = "MAP_NO_GAS";
    Map[Map["MAP_CALC_FOV"] = Fl(7)] = "MAP_CALC_FOV";
    Map[Map["MAP_FOV_CHANGED"] = Fl(8)] = "MAP_FOV_CHANGED";
    Map[Map["MAP_DEFAULT"] = Map.MAP_STABLE_LIGHTS | Map.MAP_STABLE_GLOW_LIGHTS] = "MAP_DEFAULT";
})(Map || (Map = {}));
