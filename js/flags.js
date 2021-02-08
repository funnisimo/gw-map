import { flag as Flag } from 'gw-utils';
export var Layer;
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
const Fl = Flag.fl;
export var Entity;
(function (Entity) {
    // L_DYNAMIC = Fl(0), // for movable things like actors or items
    Entity[Entity["L_SUPERPRIORITY"] = Fl(1)] = "L_SUPERPRIORITY";
    Entity[Entity["L_SECRETLY_PASSABLE"] = Fl(2)] = "L_SECRETLY_PASSABLE";
    Entity[Entity["L_BLOCKS_MOVE"] = Fl(3)] = "L_BLOCKS_MOVE";
    Entity[Entity["L_BLOCKS_VISION"] = Fl(4)] = "L_BLOCKS_VISION";
    Entity[Entity["L_BLOCKS_SURFACE"] = Fl(6)] = "L_BLOCKS_SURFACE";
    Entity[Entity["L_BLOCKS_LIQUID"] = Fl(8)] = "L_BLOCKS_LIQUID";
    Entity[Entity["L_BLOCKS_GAS"] = Fl(7)] = "L_BLOCKS_GAS";
    Entity[Entity["L_BLOCKS_ITEMS"] = Fl(5)] = "L_BLOCKS_ITEMS";
    Entity[Entity["L_BLOCKS_ACTORS"] = Fl(11)] = "L_BLOCKS_ACTORS";
    Entity[Entity["L_BLOCKS_EFFECTS"] = Fl(9)] = "L_BLOCKS_EFFECTS";
    Entity[Entity["L_BLOCKS_DIAGONAL"] = Fl(10)] = "L_BLOCKS_DIAGONAL";
    Entity[Entity["L_INTERRUPT_WHEN_SEEN"] = Fl(11)] = "L_INTERRUPT_WHEN_SEEN";
    Entity[Entity["L_LIST_IN_SIDEBAR"] = Fl(12)] = "L_LIST_IN_SIDEBAR";
    Entity[Entity["L_VISUALLY_DISTINCT"] = Fl(13)] = "L_VISUALLY_DISTINCT";
    Entity[Entity["L_BRIGHT_MEMORY"] = Fl(14)] = "L_BRIGHT_MEMORY";
    Entity[Entity["L_INVERT_WHEN_HIGHLIGHTED"] = Fl(15)] = "L_INVERT_WHEN_HIGHLIGHTED";
    Entity[Entity["L_BLOCKED_BY_STAIRS"] = Entity.L_BLOCKS_ITEMS |
        Entity.L_BLOCKS_SURFACE |
        Entity.L_BLOCKS_GAS |
        Entity.L_BLOCKS_LIQUID |
        Entity.L_BLOCKS_EFFECTS |
        Entity.L_BLOCKS_ACTORS] = "L_BLOCKED_BY_STAIRS";
    Entity[Entity["L_BLOCKS_SCENT"] = Entity.L_BLOCKS_MOVE | Entity.L_BLOCKS_VISION] = "L_BLOCKS_SCENT";
    Entity[Entity["L_DIVIDES_LEVEL"] = Entity.L_BLOCKS_MOVE] = "L_DIVIDES_LEVEL";
    Entity[Entity["L_WAYPOINT_BLOCKER"] = Entity.L_BLOCKS_MOVE] = "L_WAYPOINT_BLOCKER";
    Entity[Entity["L_IS_WALL"] = Entity.L_BLOCKS_MOVE |
        Entity.L_BLOCKS_VISION |
        Entity.L_BLOCKS_LIQUID |
        Entity.L_BLOCKS_GAS |
        Entity.L_BLOCKS_EFFECTS |
        Entity.L_BLOCKS_DIAGONAL] = "L_IS_WALL";
    Entity[Entity["L_BLOCKS_EVERYTHING"] = Entity.L_IS_WALL |
        Entity.L_BLOCKS_ITEMS |
        Entity.L_BLOCKS_ACTORS |
        Entity.L_BLOCKS_SURFACE] = "L_BLOCKS_EVERYTHING";
})(Entity || (Entity = {}));
///////////////////////////////////////////////////////
// TILE EVENT
export var Activation;
(function (Activation) {
    Activation[Activation["DFF_SUBSEQ_ALWAYS"] = Fl(0)] = "DFF_SUBSEQ_ALWAYS";
    Activation[Activation["DFF_SUBSEQ_EVERYWHERE"] = Fl(1)] = "DFF_SUBSEQ_EVERYWHERE";
    Activation[Activation["DFF_TREAT_AS_BLOCKING"] = Fl(2)] = "DFF_TREAT_AS_BLOCKING";
    Activation[Activation["DFF_PERMIT_BLOCKING"] = Fl(3)] = "DFF_PERMIT_BLOCKING";
    Activation[Activation["DFF_BLOCKED_BY_OTHER_LAYERS"] = Fl(4)] = "DFF_BLOCKED_BY_OTHER_LAYERS";
    Activation[Activation["DFF_SUPERPRIORITY"] = Fl(5)] = "DFF_SUPERPRIORITY";
    Activation[Activation["DFF_NO_REDRAW_CELL"] = Fl(6)] = "DFF_NO_REDRAW_CELL";
    Activation[Activation["DFF_ABORT_IF_BLOCKS_MAP"] = Fl(7)] = "DFF_ABORT_IF_BLOCKS_MAP";
    Activation[Activation["DFF_BLOCKED_BY_ITEMS"] = Fl(8)] = "DFF_BLOCKED_BY_ITEMS";
    Activation[Activation["DFF_BLOCKED_BY_ACTORS"] = Fl(9)] = "DFF_BLOCKED_BY_ACTORS";
    Activation[Activation["DFF_ALWAYS_FIRE"] = Fl(10)] = "DFF_ALWAYS_FIRE";
    Activation[Activation["DFF_NO_MARK_FIRED"] = Fl(11)] = "DFF_NO_MARK_FIRED";
    // MUST_REPLACE_LAYER
    // NEEDS_EMPTY_LAYER
    Activation[Activation["DFF_PROTECTED"] = Fl(12)] = "DFF_PROTECTED";
    Activation[Activation["DFF_SPREAD_CIRCLE"] = Fl(13)] = "DFF_SPREAD_CIRCLE";
    Activation[Activation["DFF_SPREAD_LINE"] = Fl(14)] = "DFF_SPREAD_LINE";
    Activation[Activation["DFF_NULL_SURFACE"] = Fl(15)] = "DFF_NULL_SURFACE";
    Activation[Activation["DFF_NULL_LIQUID"] = Fl(16)] = "DFF_NULL_LIQUID";
    Activation[Activation["DFF_NULL_GAS"] = Fl(17)] = "DFF_NULL_GAS";
    Activation[Activation["DFF_EVACUATE_CREATURES"] = Fl(18)] = "DFF_EVACUATE_CREATURES";
    Activation[Activation["DFF_EVACUATE_ITEMS"] = Fl(19)] = "DFF_EVACUATE_ITEMS";
    Activation[Activation["DFF_BUILD_IN_WALLS"] = Fl(20)] = "DFF_BUILD_IN_WALLS";
    Activation[Activation["DFF_MUST_TOUCH_WALLS"] = Fl(21)] = "DFF_MUST_TOUCH_WALLS";
    Activation[Activation["DFF_NO_TOUCH_WALLS"] = Fl(22)] = "DFF_NO_TOUCH_WALLS";
    // These should be effect types
    Activation[Activation["DFF_ACTIVATE_DORMANT_MONSTER"] = Fl(23)] = "DFF_ACTIVATE_DORMANT_MONSTER";
    Activation[Activation["DFF_AGGRAVATES_MONSTERS"] = Fl(24)] = "DFF_AGGRAVATES_MONSTERS";
    Activation[Activation["DFF_RESURRECT_ALLY"] = Fl(25)] = "DFF_RESURRECT_ALLY";
    Activation[Activation["DFF_EMIT_EVENT"] = Fl(26)] = "DFF_EMIT_EVENT";
    Activation[Activation["DFF_ONLY_IF_EMPTY"] = Activation.DFF_BLOCKED_BY_ITEMS | Activation.DFF_BLOCKED_BY_ACTORS] = "DFF_ONLY_IF_EMPTY";
    Activation[Activation["DFF_NULLIFY_CELL"] = Activation.DFF_NULL_SURFACE | Activation.DFF_NULL_LIQUID | Activation.DFF_NULL_GAS] = "DFF_NULLIFY_CELL";
})(Activation || (Activation = {}));
///////////////////////////////////////////////////////
// TILE
export var Tile;
(function (Tile) {
    Tile[Tile["T_BRIDGE"] = Fl(0)] = "T_BRIDGE";
    Tile[Tile["T_AUTO_DESCENT"] = Fl(1)] = "T_AUTO_DESCENT";
    Tile[Tile["T_LAVA"] = Fl(2)] = "T_LAVA";
    Tile[Tile["T_DEEP_WATER"] = Fl(3)] = "T_DEEP_WATER";
    Tile[Tile["T_IS_FLAMMABLE"] = Fl(4)] = "T_IS_FLAMMABLE";
    Tile[Tile["T_SPONTANEOUSLY_IGNITES"] = Fl(5)] = "T_SPONTANEOUSLY_IGNITES";
    Tile[Tile["T_IS_FIRE"] = Fl(6)] = "T_IS_FIRE";
    Tile[Tile["T_EXTINGUISHES_FIRE"] = Fl(7)] = "T_EXTINGUISHES_FIRE";
    Tile[Tile["T_IS_SECRET"] = Fl(8)] = "T_IS_SECRET";
    Tile[Tile["T_IS_TRAP"] = Fl(9)] = "T_IS_TRAP";
    Tile[Tile["T_SACRED"] = Fl(10)] = "T_SACRED";
    Tile[Tile["T_UP_STAIRS"] = Fl(11)] = "T_UP_STAIRS";
    Tile[Tile["T_DOWN_STAIRS"] = Fl(12)] = "T_DOWN_STAIRS";
    Tile[Tile["T_PORTAL"] = Fl(13)] = "T_PORTAL";
    Tile[Tile["T_IS_DOOR"] = Fl(14)] = "T_IS_DOOR";
    Tile[Tile["T_ALLOWS_SUBMERGING"] = Fl(15)] = "T_ALLOWS_SUBMERGING";
    Tile[Tile["T_ENTANGLES"] = Fl(16)] = "T_ENTANGLES";
    Tile[Tile["T_REFLECTS"] = Fl(17)] = "T_REFLECTS";
    Tile[Tile["T_STAND_IN_TILE"] = Fl(18)] = "T_STAND_IN_TILE";
    Tile[Tile["T_CONNECTS_LEVEL"] = Fl(19)] = "T_CONNECTS_LEVEL";
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
    // TM_PROMOTES_WITH_KEY = Fl(1), // promotes if the key is present on the tile (in your pack, carried by monster, or lying on the ground)
    // TM_PROMOTES_WITHOUT_KEY = Fl(2), // promotes if the key is NOT present on the tile (in your pack, carried by monster, or lying on the ground)
    // TM_PROMOTES_ON_STEP = Fl(3), // promotes when a creature, player or item is on the tile (whether or not levitating)
    // TM_PROMOTES_ON_ITEM_REMOVE = Fl(4), // promotes when an item is lifted from the tile (primarily for altars)
    // TM_PROMOTES_ON_PLAYER_ENTRY = Fl(5), // promotes when the player enters the tile (whether or not levitating)
    // TM_PROMOTES_ON_SACRIFICE_ENTRY = Fl(6), // promotes when the sacrifice target enters the tile (whether or not levitating)
    // TM_PROMOTES_ON_ELECTRICITY = Fl(7), // promotes when hit by a lightning bolt
    // T_CAUSES_POISON = Fl(18), // any non-levitating creature gets 10 poison
    // T_CAUSES_DAMAGE = Fl(19), // anything on the tile takes max(1-2, 10%) damage per turn
    // T_CAUSES_NAUSEA = Fl(20), // any creature on the tile becomes nauseous
    // T_CAUSES_PARALYSIS = Fl(21), // anything caught on this tile is paralyzed
    // T_CAUSES_CONFUSION = Fl(22), // causes creatures on this tile to become confused
    // T_CAUSES_HEALING = Fl(23), // heals 20% max HP per turn for any player or non-inanimate monsters
    // T_CAUSES_EXPLOSIVE_DAMAGE = Fl(25), // is an explosion; deals higher of 15-20 or 50% damage instantly, but not again for five turns
    TileMech[TileMech["TM_IS_WIRED"] = Fl(9)] = "TM_IS_WIRED";
    TileMech[TileMech["TM_IS_CIRCUIT_BREAKER"] = Fl(10)] = "TM_IS_CIRCUIT_BREAKER";
    TileMech[TileMech["TM_VANISHES_UPON_PROMOTION"] = Fl(15)] = "TM_VANISHES_UPON_PROMOTION";
    TileMech[TileMech["TM_EXPLOSIVE_PROMOTE"] = Fl(21)] = "TM_EXPLOSIVE_PROMOTE";
    TileMech[TileMech["TM_SWAP_ENCHANTS_ACTIVATION"] = Fl(25)] = "TM_SWAP_ENCHANTS_ACTIVATION";
    // TM_PROMOTES = TM_PROMOTES_WITH_KEY |
    //   TM_PROMOTES_WITHOUT_KEY |
    //   TM_PROMOTES_ON_STEP |
    //   TM_PROMOTES_ON_ITEM_REMOVE |
    //   TM_PROMOTES_ON_SACRIFICE_ENTRY |
    //   TM_PROMOTES_ON_ELECTRICITY |
    //   TM_PROMOTES_ON_PLAYER_ENTRY,
})(TileMech || (TileMech = {}));
///////////////////////////////////////////////////////
// CELL
export var Cell;
(function (Cell) {
    Cell[Cell["VISIBLE"] = Fl(0)] = "VISIBLE";
    Cell[Cell["WAS_VISIBLE"] = Fl(1)] = "WAS_VISIBLE";
    Cell[Cell["CLAIRVOYANT_VISIBLE"] = Fl(2)] = "CLAIRVOYANT_VISIBLE";
    Cell[Cell["WAS_CLAIRVOYANT_VISIBLE"] = Fl(3)] = "WAS_CLAIRVOYANT_VISIBLE";
    Cell[Cell["TELEPATHIC_VISIBLE"] = Fl(4)] = "TELEPATHIC_VISIBLE";
    Cell[Cell["WAS_TELEPATHIC_VISIBLE"] = Fl(5)] = "WAS_TELEPATHIC_VISIBLE";
    Cell[Cell["ITEM_DETECTED"] = Fl(6)] = "ITEM_DETECTED";
    Cell[Cell["WAS_ITEM_DETECTED"] = Fl(7)] = "WAS_ITEM_DETECTED";
    Cell[Cell["MONSTER_DETECTED"] = Fl(8)] = "MONSTER_DETECTED";
    Cell[Cell["WAS_MONSTER_DETECTED"] = Fl(9)] = "WAS_MONSTER_DETECTED";
    Cell[Cell["REVEALED"] = Fl(10)] = "REVEALED";
    Cell[Cell["MAGIC_MAPPED"] = Fl(11)] = "MAGIC_MAPPED";
    Cell[Cell["IN_FOV"] = Fl(12)] = "IN_FOV";
    Cell[Cell["WAS_IN_FOV"] = Fl(13)] = "WAS_IN_FOV";
    Cell[Cell["NEEDS_REDRAW"] = Fl(14)] = "NEEDS_REDRAW";
    Cell[Cell["CELL_CHANGED"] = Fl(15)] = "CELL_CHANGED";
    // These are to help memory
    Cell[Cell["HAS_SURFACE"] = Fl(16)] = "HAS_SURFACE";
    Cell[Cell["HAS_LIQUID"] = Fl(17)] = "HAS_LIQUID";
    Cell[Cell["HAS_GAS"] = Fl(18)] = "HAS_GAS";
    Cell[Cell["HAS_PLAYER"] = Fl(19)] = "HAS_PLAYER";
    Cell[Cell["HAS_ACTOR"] = Fl(20)] = "HAS_ACTOR";
    Cell[Cell["HAS_DORMANT_MONSTER"] = Fl(21)] = "HAS_DORMANT_MONSTER";
    Cell[Cell["HAS_ITEM"] = Fl(22)] = "HAS_ITEM";
    Cell[Cell["IS_IN_PATH"] = Fl(23)] = "IS_IN_PATH";
    Cell[Cell["IS_CURSOR"] = Fl(24)] = "IS_CURSOR";
    Cell[Cell["STABLE_MEMORY"] = Fl(25)] = "STABLE_MEMORY";
    Cell[Cell["LIGHT_CHANGED"] = Fl(26)] = "LIGHT_CHANGED";
    Cell[Cell["CELL_LIT"] = Fl(27)] = "CELL_LIT";
    Cell[Cell["IS_IN_SHADOW"] = Fl(28)] = "IS_IN_SHADOW";
    Cell[Cell["CELL_DARK"] = Fl(29)] = "CELL_DARK";
    Cell[Cell["PERMANENT_CELL_FLAGS"] = Cell.REVEALED |
        Cell.MAGIC_MAPPED |
        Cell.ITEM_DETECTED |
        Cell.HAS_ITEM |
        Cell.HAS_DORMANT_MONSTER |
        Cell.STABLE_MEMORY] = "PERMANENT_CELL_FLAGS";
    Cell[Cell["ANY_KIND_OF_VISIBLE"] = Cell.VISIBLE | Cell.CLAIRVOYANT_VISIBLE | Cell.TELEPATHIC_VISIBLE] = "ANY_KIND_OF_VISIBLE";
    Cell[Cell["HAS_ANY_ACTOR"] = Cell.HAS_PLAYER | Cell.HAS_ACTOR] = "HAS_ANY_ACTOR";
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
    CellMech[CellMech["IMPREGNABLE"] = Fl(20)] = "IMPREGNABLE";
    CellMech[CellMech["DARKENED"] = Fl(19)] = "DARKENED";
    CellMech[CellMech["IS_IN_MACHINE"] = CellMech.IS_IN_ROOM_MACHINE | CellMech.IS_IN_AREA_MACHINE] = "IS_IN_MACHINE";
    CellMech[CellMech["PERMANENT_MECH_FLAGS"] = CellMech.SEARCHED_FROM_HERE |
        CellMech.PRESSURE_PLATE_DEPRESSED |
        CellMech.KNOWN_TO_BE_TRAP_FREE |
        CellMech.IS_IN_LOOP |
        CellMech.IS_CHOKEPOINT |
        CellMech.IS_GATE_SITE |
        CellMech.IS_IN_MACHINE |
        CellMech.IMPREGNABLE] = "PERMANENT_MECH_FLAGS";
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
