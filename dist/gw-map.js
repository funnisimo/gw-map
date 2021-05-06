(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('gw-utils')) :
    typeof define === 'function' && define.amd ? define(['exports', 'gw-utils'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.GW = global.GW || {}, global.GW));
}(this, (function (exports, GW) { 'use strict';

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
    const Fl = GW.flag.fl;
    var Entity;
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
    var Activation;
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
    var Tile;
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
    var TileMech;
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
    var Cell;
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
        Cell[Cell["COLORS_DANCE"] = Fl(30)] = "COLORS_DANCE";
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
    var Map;
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
        Map[Map["MAP_DANCES"] = Fl(9)] = "MAP_DANCES";
        Map[Map["MAP_DEFAULT"] = Map.MAP_STABLE_LIGHTS | Map.MAP_STABLE_GLOW_LIGHTS] = "MAP_DEFAULT";
    })(Map || (Map = {}));

    // const LIGHT_SMOOTHING_THRESHOLD = 150;       // light components higher than this magnitude will be toned down a little
    const config = (GW.config.light = { INTENSITY_DARK: 20 }); // less than 20% for highest color in rgb
    const LIGHT_COMPONENTS = GW.color.make();
    class Light {
        constructor(color, range, fadeTo, pass = false) {
            this.fadeTo = 0;
            this.passThroughActors = false;
            this.id = null;
            this.color = GW.color.from(color) || null; /* color */
            this.radius = GW.range.make(range || 1);
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
                return false;
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
            const grid = GW.grid.alloc(map.width, map.height, 0);
            map.calcFov(grid, x, y, outerRadius, this.passThroughActors ? 0 : Cell.HAS_ANY_ACTOR, Entity.L_BLOCKS_VISION);
            let overlappedFieldOfView = false;
            grid.forCircle(x, y, outerRadius, (v, i, j) => {
                if (!v)
                    return;
                const cell = map.cell(i, j);
                lightMultiplier = Math.floor(100 -
                    (100 - fadeToPercent) *
                        (GW.utils.distanceBetween(x, y, i, j) / radius));
                for (k = 0; k < 3; k++) {
                    cell.light[k] += Math.floor((LIGHT_COMPONENTS[k] * lightMultiplier) / 100);
                }
                if (dispelShadows) {
                    cell.flags &= ~Cell.IS_IN_SHADOW;
                }
                if (cell.flags &
                    (Cell.IN_FOV | Cell.ANY_KIND_OF_VISIBLE)) {
                    overlappedFieldOfView = true;
                }
                // console.log(i, j, lightMultiplier, cell.light);
            });
            if (dispelShadows) {
                const cell = map.cell(x, y);
                cell.flags &= ~Cell.IS_IN_SHADOW;
            }
            GW.grid.free(grid);
            return overlappedFieldOfView;
        }
    }
    function intensity(color) {
        return Math.max(color[0], color[1], color[2]);
    }
    function make(...args) {
        if (args.length == 1) {
            const config = args[0];
            if (typeof config === 'string') {
                const cached = lights[config];
                if (cached)
                    return cached;
                const [color, radius, fadeTo, pass] = config
                    .split(/[,|]/)
                    .map((t) => t.trim());
                return new Light(GW.color.from(color), GW.range.from(radius || 1), Number.parseInt(fadeTo || '0'), !!pass && pass !== 'false');
            }
            else if (Array.isArray(config)) {
                const [color, radius, fadeTo, pass] = config;
                return new Light(color, radius, fadeTo, pass);
            }
            else if (config && config.color) {
                return new Light(GW.color.from(config.color), GW.range.from(config.radius), Number.parseInt(config.fadeTo || '0'), config.pass);
            }
            else {
                throw new Error('Unknown Light config - ' + config);
            }
        }
        else {
            const [color, radius, fadeTo, pass] = args;
            return new Light(color, radius, fadeTo, pass);
        }
    }
    GW.make.light = make;
    const lights = {};
    function from(...args) {
        if (args.length != 1)
            GW.utils.ERROR('Unknown Light config: ' + JSON.stringify(args));
        const arg = args[0];
        if (typeof arg === 'string') {
            const cached = lights[arg];
            if (cached)
                return cached;
        }
        return make(arg);
    }
    function install(id, ...args) {
        let source;
        if (args.length == 1) {
            source = make(args[0]);
        }
        else {
            source = make(args[0], args[1], args[2], args[3]);
        }
        lights[id] = source;
        if (source)
            source.id = id;
        return source;
    }
    function installAll(config = {}) {
        const entries = Object.entries(config);
        entries.forEach(([name, info]) => {
            install(name, info);
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
                cell.lightChanged = true;
            }
            if (cell.isDark()) {
                cell.flags |= Cell.CELL_DARK;
            }
            else if (!(cell.flags & Cell.IS_IN_SHADOW)) {
                cell.flags |= Cell.CELL_LIT;
            }
        });
    }
    // export function backUpLighting(map: Map.Map, lights: LightDataGrid) {
    //   let k;
    //   map.eachCell((cell, i, j) => {
    //     for (k = 0; k < 3; k++) {
    //       lights[i][j][k] = cell.light[k];
    //     }
    //   });
    // }
    // export function restoreLighting(map: Map.Map, lights: LightDataGrid) {
    //   let k;
    //   map.eachCell((cell, i, j) => {
    //     for (k = 0; k < 3; k++) {
    //       cell.light[k] = lights[i][j][k];
    //     }
    //   });
    // }
    function recordOldLights(map) {
        let k;
        map.eachCell((cell) => {
            for (k = 0; k < 3; k++) {
                cell.oldLight[k] = cell.light[k];
                cell.lightChanged = false;
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
        if (!map.anyLightChanged)
            return false;
        // Copy Light over oldLight
        recordOldLights(map);
        // and then zero out Light.
        zeroOutLights(map);
        if (!map.staticLightChanged) {
            restoreGlowLights(map);
        }
        else {
            // GW.debug.log('painting glow lights.');
            // Paint all glowing tiles.
            map.eachStaticLight((light, x, y) => {
                //   const light = lights[id];
                if (light) {
                    light.paint(map, x, y);
                }
            });
            recordGlowLights(map);
            map.staticLightChanged = false;
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
        const PLAYER = GW.data.player;
        if (PLAYER) {
            const PLAYERS_LIGHT = lights.PLAYERS_LIGHT;
            if (PLAYERS_LIGHT && PLAYERS_LIGHT.radius) {
                PLAYERS_LIGHT.paint(map, PLAYER.x, PLAYER.y, true, true);
            }
        }
        map.anyLightChanged = false;
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
    // TODO - Move?
    function playerInDarkness(map, PLAYER, darkColor) {
        const cell = map.cell(PLAYER.x, PLAYER.y);
        return cell.isDark(darkColor);
        // return (
        //   cell.light[0] + 10 < darkColor.r &&
        //   cell.light[1] + 10 < darkColor.g &&
        //   cell.light[2] + 10 < darkColor.b
        // );
    }

    var light = {
        __proto__: null,
        config: config,
        Light: Light,
        intensity: intensity,
        make: make,
        lights: lights,
        from: from,
        install: install,
        installAll: installAll,
        recordOldLights: recordOldLights,
        zeroOutLights: zeroOutLights,
        recordGlowLights: recordGlowLights,
        restoreGlowLights: restoreGlowLights,
        updateLighting: updateLighting,
        playerInDarkness: playerInDarkness
    };

    class Entity$1 {
        constructor(config) {
            this.priority = 50;
            this.layer = 0;
            this.light = null;
            this.flags = { layer: 0 };
            this.sprite = GW.make.sprite(config.sprite || config);
            this.light = config.light ? make(config.light) : null;
            this.priority = GW.utils.first(config.priority, 50);
            this.layer =
                (config.layer && typeof config.layer !== 'number'
                    ? Layer[config.layer]
                    : config.layer) || 0;
            // @ts-ignore
            this.flags.layer = GW.flag.from(Entity, config.layerFlags, config.flags, 0);
        }
        hasLayerFlag(flag) {
            return (this.flags.layer & flag) > 0;
        }
    }
    function make$1(config) {
        return new Entity$1(config);
    }
    GW.make.layer = make$1;

    var entity = {
        __proto__: null,
        get Flags () { return Entity; },
        get Layer () { return Layer; },
        Entity: Entity$1,
        make: make$1
    };

    /** Tile Class */
    class Tile$1 extends Entity$1 {
        /**
         * Creates a new Tile object.
         * @param {Object} [config={}] - The configuration of the Tile
         * @param {String|Number|String[]} [config.flags=0] - Flags and MechFlags for the tile
         * @param {String} [config.layer=GROUND] - Name of the layer for this tile
         * @param {String} [config.ch] - The sprite character
         * @param {String} [config.fg] - The sprite foreground color
         * @param {String} [config.bg] - The sprite background color
         */
        constructor(config) {
            super((() => {
                if (!config.Extends)
                    return config;
                if (typeof config.Extends === 'string') {
                    config.Extends = tiles[config.Extends];
                    if (!config.Extends)
                        throw new Error('Unknown tile base - ' + config.Extends);
                }
                const base = config.Extends;
                config.ch = GW.utils.first(config.ch, base.sprite.ch, -1);
                config.fg = GW.utils.first(config.fg, base.sprite.fg, -1);
                config.bg = GW.utils.first(config.bg, base.sprite.bg, -1);
                config.layer = GW.utils.first(config.layer, base.layer);
                config.priority = GW.utils.first(config.priority, base.priority);
                config.opacity = GW.utils.first(config.opacity, base.sprite.opacity);
                config.light = GW.utils.first(config.light, base.light);
                return config;
            })());
            this.flags = { layer: 0, tile: 0, tileMech: 0 };
            this.activates = {};
            this.flavor = null;
            this.desc = null;
            this.article = null;
            this.dissipate = 2000; // 20 * 100 = 20%
            this.defaultGround = null;
            let base = config.Extends;
            if (base) {
                GW.utils.assignOmitting(['sprite', 'depth', 'priority', 'activates', 'flags', 'light'], this, base);
                if (base.activates) {
                    Object.assign(this.activates, base.activates);
                }
                Object.assign(this.flags, base.flags);
            }
            GW.utils.assignOmitting([
                'Extends',
                'extends',
                'flags',
                'layerFlags',
                'mechFlags',
                'sprite',
                'activates',
                'ch',
                'fg',
                'bg',
                'opacity',
                'light',
                'layer',
                'priority',
                'flags',
                'ground',
                'light',
            ], this, config);
            this.name = config.name || (base ? base.name : config.id);
            this.id = config.id;
            if (config.ground) {
                this.defaultGround = config.ground;
            }
            // @ts-ignore
            this.flags.tile = GW.flag.from(Tile, this.flags.tile, config.flags);
            // @ts-ignore
            this.flags.layer = GW.flag.from(Entity, this.flags.layer, config.layerFlags || config.flags);
            // @ts-ignore
            this.flags.tileMech = GW.flag.from(TileMech, this.flags.tileMech, config.mechFlags || config.flags);
            if (config.activates) {
                Object.entries(config.activates).forEach(([key, info]) => {
                    if (info) {
                        if (typeof info === 'string') {
                            if (tiles[info]) {
                                info = { tile: info };
                            }
                            else {
                                this.activates[key] = info;
                                return;
                            }
                        }
                        const activation = GW.effect.make(info);
                        this.activates[key] = activation;
                    }
                    else {
                        delete this.activates[key];
                    }
                });
            }
        }
        /**
         * Returns whether or not this tile as the given flag.
         * Will return true if any bit in the flag is true, so testing with
         * multiple flags will return true if any of them is set.
         * @param {number} flag - The flag to check
         * @returns {boolean} Whether or not the flag is set
         */
        hasAllFlags(flag) {
            return (this.flags.tile & flag) === flag;
        }
        hasAllLayerFlags(flag) {
            return (this.flags.layer & flag) === flag;
        }
        hasAllMechFlags(flag) {
            return (this.flags.tileMech & flag) === flag;
        }
        blocksPathing() {
            return (this.flags.layer & Entity.L_BLOCKS_MOVE ||
                this.flags.tile & Tile.T_PATHING_BLOCKER);
        }
        activatesOn(name) {
            return !!this.activates[name];
        }
        getName(arg) {
            let opts = {};
            if (arg === true || arg === false) {
                opts.article = arg;
            }
            else if (typeof arg === 'string') {
                opts.article = arg;
            }
            else if (arg) {
                opts = arg;
            }
            if (!opts.article && !opts.color)
                return this.name;
            let result = this.name;
            if (opts.color) {
                let color = opts.color;
                if (opts.color === true) {
                    color = this.sprite.fg || 'white';
                }
                if (typeof color !== 'string') {
                    color = GW.color.from(color).toString();
                }
                result = `Ω${color}Ω${this.name}∆`;
            }
            if (opts.article) {
                let article = typeof opts.article === 'string'
                    ? opts.article
                    : this.article || 'a';
                result = article + ' ' + result;
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
    GW.make.tile = make$2;
    const tiles = {};
    function install$1(...args) {
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
        }
        if (typeof base === 'string') {
            config.Extends =
                tiles[base] || GW.utils.ERROR('Unknown base tile: ' + base);
        }
        // config.name = config.name || base.name || id.toLowerCase();
        config.id = id;
        const tile = make$2(config);
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
            install$1(id, opts);
        });
    }

    var tile = {
        __proto__: null,
        get Flags () { return Tile; },
        get MechFlags () { return TileMech; },
        Tile: Tile$1,
        make: make$2,
        tiles: tiles,
        install: install$1,
        installAll: installAll$1
    };

    // TODO - Move to gw-ui
    GW.color.install('cursorColor', 25, 100, 150);
    GW.config.cursorPathIntensity = 50;
    class CellMemory {
        constructor() {
            this.mixer = new GW.sprite.Mixer();
            this.item = null;
            this.itemQuantity = 0;
            this.actor = null;
            this.tile = null;
            this.cellFlags = 0;
            this.cellMechFlags = 0;
            this.layerFlags = 0;
            this.tileFlags = 0;
            this.tileMechFlags = 0;
        }
        clear() {
            this.mixer.nullify();
            this.item = null;
            this.itemQuantity = 0;
            this.actor = null;
            this.tile = null;
            this.cellFlags = 0;
            this.cellMechFlags = 0;
            this.layerFlags = 0;
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
            this._tiles = [];
            this.layers = null;
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
            this.chokeCount = 0;
        }
        copy(other) {
            GW.utils.copyObject(this, other);
        }
        nullify() {
            for (let i = 0; i < this._tiles.length; ++i) {
                this._tiles[i] = null;
            }
            this.layers = null;
            this._actor = null;
            this._item = null;
            this.data = {};
            this.flags = Cell.CELL_DEFAULT; // non-terrain cell flags
            this.mechFlags = 0;
            this.gasVolume = 0; // quantity of gas in cell
            this.liquidVolume = 0;
            this.machineNumber = 0;
            this.memory.clear();
            this.light = [100, 100, 100];
            this.oldLight = [100, 100, 100];
            this.glowLight = [100, 100, 100];
            this.chokeCount = 0;
        }
        clear(floorTile = 'FLOOR') {
            this.nullify();
            if (typeof floorTile === 'string') {
                floorTile = tiles[floorTile];
            }
            if (floorTile) {
                this._tiles[0] = floorTile;
            }
        }
        clearLayers(layerFlag, floorTile = 'FLOOR') {
            const layers = [Layer.GAS, Layer.LIQUID, Layer.SURFACE, Layer.GROUND];
            return layers.reduce((out, l) => {
                if (l & layerFlag) {
                    return this.clearLayer(l, floorTile) || out;
                }
                return out;
            }, false);
        }
        // clearLayers(nullLiquid = false, nullSurface = false, nullGas = false) {
        //     if (nullLiquid) {
        //         this._tiles[1] = null;
        //         this.liquidVolume = 0;
        //     }
        //     if (nullSurface) {
        //         this._tiles[2] = null;
        //     }
        //     if (nullGas) {
        //         this._tiles[3] = null;
        //         this.gasVolume = 0;
        //     }
        //     this.flags |= Flags.CELL_CHANGED;
        // }
        get ground() {
            var _a;
            return ((_a = this._tiles[Layer.GROUND]) === null || _a === void 0 ? void 0 : _a.id) || null;
        }
        get liquid() {
            var _a;
            return ((_a = this._tiles[Layer.LIQUID]) === null || _a === void 0 ? void 0 : _a.id) || null;
        }
        get surface() {
            var _a;
            return ((_a = this._tiles[Layer.SURFACE]) === null || _a === void 0 ? void 0 : _a.id) || null;
        }
        get gas() {
            var _a;
            return ((_a = this._tiles[Layer.GAS]) === null || _a === void 0 ? void 0 : _a.id) || null;
        }
        get groundTile() {
            return this._tiles[Layer.GROUND] || tiles.NULL;
        }
        get liquidTile() {
            return this._tiles[Layer.LIQUID] || tiles.NULL;
        }
        get surfaceTile() {
            return this._tiles[Layer.SURFACE] || tiles.NULL;
        }
        get gasTile() {
            return this._tiles[Layer.GAS] || tiles.NULL;
        }
        dump() {
            if (this.actor)
                return this.actor.sprite.ch;
            if (this.item)
                return this.item.sprite.ch;
            for (let i = this._tiles.length - 1; i >= 0; --i) {
                if (!this._tiles[i])
                    continue;
                const tile = this._tiles[i] || tiles.NULL;
                if (tile.sprite.ch)
                    return tile.sprite.ch;
            }
            return tiles.NULL.sprite.ch;
        }
        get changed() {
            return (this.flags & Cell.CELL_CHANGED) > 0;
        }
        set changed(v) {
            if (v) {
                this.flags |= Cell.CELL_CHANGED;
            }
            else {
                this.flags &= ~Cell.CELL_CHANGED;
            }
        }
        isVisible() {
            return this.flags & Cell.VISIBLE ? true : false;
        }
        isAnyKindOfVisible() {
            return (this.flags &
                Cell.ANY_KIND_OF_VISIBLE /* || CONFIG.playbackOmniscience */);
        }
        isOrWasAnyKindOfVisible() {
            return (this.flags &
                Cell.IS_WAS_ANY_KIND_OF_VISIBLE /* || CONFIG.playbackOmniscience */);
        }
        isRevealed(orMapped = false) {
            const flag = Cell.REVEALED | (orMapped ? Cell.MAGIC_MAPPED : 0);
            return (this.flags & flag) > 0;
        }
        listInSidebar() {
            return this.hasLayerFlag(Entity.L_LIST_IN_SIDEBAR, true);
        }
        get needsRedraw() {
            return (this.flags & Cell.NEEDS_REDRAW) > 0;
        }
        set needsRedraw(v) {
            if (v) {
                this.flags |= Cell.NEEDS_REDRAW;
            }
            else {
                this.flags &= ~Cell.NEEDS_REDRAW;
            }
        }
        // TODO - Use functions in LIGHT to check these on cell.light directly???
        hasVisibleLight() {
            return intensity(this.light) > GW.config.light.INTENSITY_DARK;
        } // TODO
        isDark(darkColor) {
            const intensity$1 = darkColor
                ? intensity(darkColor)
                : GW.config.light.INTENSITY_DARK;
            return intensity(this.light) <= intensity$1;
        } // TODO
        get lightChanged() {
            return (this.flags & Cell.LIGHT_CHANGED) > 0;
        }
        set lightChanged(v) {
            if (v) {
                this.flags |= Cell.LIGHT_CHANGED | Cell.NEEDS_REDRAW;
            }
            else {
                this.flags &= ~Cell.LIGHT_CHANGED;
            }
        }
        tile(layer = Layer.GROUND) {
            return this._tiles[layer] || tiles.NULL;
        }
        tileId(layer = Layer.GROUND) {
            var _a;
            return ((_a = this._tiles[layer]) === null || _a === void 0 ? void 0 : _a.id) || null;
        }
        volume(layer = Layer.GAS) {
            if (layer === Layer.GAS)
                return this.gasVolume;
            if (layer === Layer.LIQUID)
                return this.liquidVolume;
            return 0;
        }
        setVolume(layer, volume = 0) {
            if (layer === Layer.GAS) {
                this.gasVolume = volume;
            }
            else if (layer === Layer.LIQUID) {
                this.liquidVolume = volume;
            }
        }
        *tiles() {
            for (let tile of this._tiles) {
                if (tile) {
                    yield tile;
                }
            }
        }
        layerFlags(limitToPlayerKnowledge = false) {
            if (limitToPlayerKnowledge && !this.isVisible()) {
                return this.memory.layerFlags;
            }
            let flags = 0;
            for (let tile of this.tiles()) {
                flags |= tile.flags.layer;
            }
            return flags;
        }
        tileFlags(limitToPlayerKnowledge = false) {
            if (limitToPlayerKnowledge && !this.isVisible()) {
                return this.memory.tileFlags;
            }
            let flags = 0;
            for (let tile of this.tiles()) {
                flags |= tile.flags.tile;
            }
            return flags;
        }
        tileMechFlags(limitToPlayerKnowledge = false) {
            if (limitToPlayerKnowledge && !this.isVisible()) {
                return this.memory.tileMechFlags;
            }
            let flags = 0;
            for (let tile of this.tiles()) {
                flags |= tile.flags.tileMech;
            }
            return flags;
        }
        hasLayerFlag(flag, limitToPlayerKnowledge = false) {
            const flags = this.layerFlags(limitToPlayerKnowledge);
            return !!(flag & flags);
        }
        hasAllLayerFlags(flag, limitToPlayerKnowledge = false) {
            const flags = this.layerFlags(limitToPlayerKnowledge);
            return (flag & flags) === flag;
        }
        hasTileFlag(flagMask, limitToPlayerKnowledge = false) {
            const tileFlags = this.tileFlags(limitToPlayerKnowledge);
            return !!(flagMask & tileFlags);
        }
        hasAllTileFlags(flags, limitToPlayerKnowledge = false) {
            return (flags & this.tileFlags(limitToPlayerKnowledge)) === flags;
        }
        hasTileMechFlag(flagMask, limitToPlayerKnowledge = false) {
            const mechFlags = this.tileMechFlags(limitToPlayerKnowledge);
            return !!(flagMask & mechFlags);
        }
        hasAllTileMechFlags(flags, limitToPlayerKnowledge = false) {
            return (flags & this.tileMechFlags(limitToPlayerKnowledge)) === flags;
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
        hasFlag(flag, limitToPlayerKnowledge = false) {
            const flags = limitToPlayerKnowledge && !this.isAnyKindOfVisible()
                ? this.memory.cellFlags
                : this.flags;
            return (flag & flags) > 0;
        }
        hasMechFlag(flag, limitToPlayerKnowledge = false) {
            const flags = limitToPlayerKnowledge && !this.isAnyKindOfVisible()
                ? this.memory.cellMechFlags
                : this.mechFlags;
            return (flag & flags) > 0;
        }
        hasTile(tile) {
            let id;
            if (typeof tile === 'string') {
                id = tile;
            }
            else {
                id = tile.id;
            }
            return this._tiles.some((t) => t && t.id === id);
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
        // promotedTileFlags() {
        //   return this.successorTileFlags("promote");
        // }
        // discoveredTileFlags() {
        //   return this.successorTileFlags("discover");
        // }
        // hasDiscoveredTileFlag(flag: number) {
        //   // if (!this.hasTileMechFlag(TM_IS_SECRET)) return false;
        //   return this.discoveredTileFlags() & flag;
        // }
        topmostTile(skipGas = false) {
            let best = tiles.NULL;
            let bestPriority = -10000;
            for (let layer = Layer.GROUND; layer <= (skipGas ? Layer.LIQUID : Layer.GAS); ++layer) {
                // @ts-ignore
                const tile = this._tiles[layer];
                if (!tile)
                    continue;
                if (tile.priority > bestPriority) {
                    best = tile;
                    bestPriority = tile.priority;
                }
            }
            return best;
        }
        tileWithLayerFlag(layerFlag) {
            for (let tile of this.tiles()) {
                if (tile.flags.layer & layerFlag)
                    return tile;
            }
            return null;
        }
        tileWithFlag(tileFlag) {
            for (let tile of this.tiles()) {
                if (tile.flags.tile & tileFlag)
                    return tile;
            }
            return null;
        }
        tileWithMechFlag(mechFlag) {
            for (let tile of this.tiles()) {
                if (tile.flags.tileMech & mechFlag)
                    return tile;
            }
            return null;
        }
        tileDesc() {
            return this.topmostTile().desc;
        }
        tileFlavor() {
            return this.topmostTile().flavor;
        }
        getName(opts = {}) {
            return this.topmostTile().getName(opts);
        }
        isNull() {
            return this.ground === null;
        }
        isClear() {
            return (this.liquid === null && this.gas === null && this.surface === null);
        }
        isEmpty() {
            return !(this._actor || this._item);
        }
        isMoveableNow(limitToPlayerKnowledge = false) {
            const useMemory = limitToPlayerKnowledge && !this.isAnyKindOfVisible();
            const layerFlags = useMemory
                ? this.memory.layerFlags
                : this.layerFlags(false);
            return (layerFlags & Entity.L_BLOCKS_MOVE) === 0;
        }
        isWalkableNow(limitToPlayerKnowledge = false) {
            const useMemory = limitToPlayerKnowledge && !this.isAnyKindOfVisible();
            const layerFlags = useMemory
                ? this.memory.layerFlags
                : this.layerFlags(false);
            if (layerFlags & Entity.L_BLOCKS_MOVE)
                return false;
            const tileFlags = useMemory ? this.memory.tileFlags : this.tileFlags();
            if (!(tileFlags & Tile.T_IS_DEEP_LIQUID))
                return true;
            return (tileFlags & Tile.T_BRIDGE) > 0;
        }
        canBeWalked(limitToPlayerKnowledge = false) {
            if (this.isWalkableNow(limitToPlayerKnowledge))
                return true;
            const useMemory = limitToPlayerKnowledge && !this.isAnyKindOfVisible();
            const layerFlags = useMemory
                ? this.memory.layerFlags
                : this.layerFlags(false);
            return (layerFlags & Entity.L_SECRETLY_PASSABLE) > 0;
        }
        isWall(limitToPlayerKnowledge = false) {
            const useMemory = limitToPlayerKnowledge && !this.isAnyKindOfVisible();
            let layerFlags = useMemory ? this.memory.layerFlags : this.layerFlags();
            return (layerFlags & Entity.L_IS_WALL) === Entity.L_IS_WALL;
        }
        isObstruction(limitToPlayerKnowledge = false) {
            const useMemory = limitToPlayerKnowledge && !this.isAnyKindOfVisible();
            let layerFlags = useMemory ? this.memory.layerFlags : this.layerFlags();
            return !!(layerFlags & Entity.L_BLOCKS_DIAGONAL);
        }
        isDoorway(limitToPlayerKnowledge = false) {
            const useMemory = limitToPlayerKnowledge && !this.isAnyKindOfVisible();
            let layerFlags = useMemory ? this.memory.layerFlags : this.layerFlags();
            return ((layerFlags & Entity.L_BLOCKS_VISION) > 0 &&
                (layerFlags & Entity.L_BLOCKS_MOVE) === 0);
        }
        isSecretDoorway(limitToPlayerKnowledge = false) {
            if (limitToPlayerKnowledge)
                return false;
            const layerFlags = this.layerFlags(limitToPlayerKnowledge);
            return (layerFlags & Entity.L_SECRETLY_PASSABLE) > 0;
        }
        blocksPathing(limitToPlayerKnowledge = false) {
            const useMemory = limitToPlayerKnowledge && !this.isAnyKindOfVisible();
            if (!this.isWalkableNow(limitToPlayerKnowledge))
                return true;
            let tileFlags = useMemory ? this.memory.tileFlags : this.tileFlags();
            return !!(tileFlags & Tile.T_PATHING_BLOCKER);
        }
        blocksVision() {
            const layerFlags = this.layerFlags();
            return !!(layerFlags & Entity.L_BLOCKS_VISION);
        }
        blocksEffects() {
            const layerFlags = this.layerFlags();
            return !!(layerFlags & Entity.L_BLOCKS_EFFECTS);
        }
        isLiquid(limitToPlayerKnowledge = false) {
            const useMemory = limitToPlayerKnowledge && !this.isAnyKindOfVisible();
            let tileFlags = useMemory ? this.memory.tileFlags : this.tileFlags();
            return !!(tileFlags & Tile.T_IS_DEEP_LIQUID);
        }
        // TODO - Should this look at the tiles instead of the flags?
        // What if a gas tile is not set with T_GAS?
        // Should we force T_GAS if layer === GAS when creating a tile?
        // Should these be cell flags - indicating we have this layer
        hasGas(limitToPlayerKnowledge = false) {
            const useMemory = limitToPlayerKnowledge && !this.isAnyKindOfVisible();
            let cellFlags = useMemory ? this.memory.cellFlags : this.flags;
            return !!(cellFlags & Cell.HAS_GAS);
        }
        // TODO - Check floor and actor
        hasKey() {
            return false;
        }
        markRevealed() {
            this.flags &= ~Cell.STABLE_MEMORY;
            if (this.flags & Cell.REVEALED)
                return false;
            this.flags |= Cell.REVEALED;
            return !this.isWall();
        }
        obstructsLayer(depth) {
            return (depth === Layer.SURFACE &&
                this.hasLayerFlag(Entity.L_BLOCKS_SURFACE));
        }
        setTile(tileId = null, volume = 0, map) {
            map = map || GW.data.map;
            let tile;
            if (tileId === null) {
                tile = tiles.NULL;
                tileId = null;
            }
            else if (typeof tileId === 'string') {
                tile = tiles[tileId];
            }
            else if (tileId instanceof Tile$1) {
                tile = tileId;
                tileId = tile.id;
            }
            if (!tile) {
                return GW.utils.ERROR('Unknown tile - ' + tileId);
            }
            if (tile.layer > 0 && !this._tiles[0]) {
                this.setTile(tile.defaultGround || tiles.FLOOR, 0, map); // TODO - do not use FLOOR?  Does map have the tile to use?
            }
            const oldTile = this._tiles[tile.layer] || tiles.NULL;
            const oldTileId = oldTile === tiles.NULL ? null : oldTile.id;
            if (oldTile.blocksPathing() != tile.blocksPathing()) {
                GW.data.staleLoopMap = true;
            }
            if (tile.flags.tile & Tile.T_IS_FIRE &&
                !(oldTile.flags.tile & Tile.T_IS_FIRE)) {
                this.mechFlags |= CellMech.CAUGHT_FIRE_THIS_TURN;
            }
            const blocksVision = tile.flags.layer & Entity.L_BLOCKS_VISION;
            const oldBlocksVision = oldTile.flags.layer & Entity.L_BLOCKS_VISION;
            if (map &&
                this.isAnyKindOfVisible() &&
                blocksVision != oldBlocksVision) {
                map.setFlag(Map.MAP_FOV_CHANGED);
            }
            if (oldTileId !== null)
                this.removeLayer(oldTile);
            this._tiles[tile.layer] = tileId === null ? null : tile;
            if (tileId !== null)
                this.addLayer(tile);
            let layerFlag = 0;
            if (tile.layer == Layer.LIQUID) {
                layerFlag = Cell.HAS_LIQUID;
                this.liquidVolume =
                    volume + (tileId == oldTileId ? this.liquidVolume : 0);
                if (map)
                    map.clearFlag(Map.MAP_NO_LIQUID);
            }
            else if (tile.layer == Layer.GAS) {
                layerFlag = Cell.HAS_GAS;
                this.gasVolume =
                    volume + (tileId == oldTileId ? this.gasVolume : 0);
                if (map)
                    map.clearFlag(Map.MAP_NO_GAS);
            }
            else if (tile.layer === Layer.SURFACE) {
                layerFlag = Cell.HAS_SURFACE;
            }
            if (tileId) {
                this.flags |= layerFlag;
            }
            else {
                this.flags &= ~layerFlag;
            }
            // this.flags |= (Flags.NEEDS_REDRAW | Flags.CELL_CHANGED);
            this.flags |= Cell.CELL_CHANGED | Cell.NEEDS_REDRAW;
            if (map && oldTile.light !== tile.light) {
                map.clearFlag(Map.MAP_STABLE_GLOW_LIGHTS | Map.MAP_STABLE_LIGHTS);
            }
            return true;
        }
        clearLayer(depth, floorTile = 'FLOOR') {
            // @ts-ignore
            if (typeof depth === 'string')
                depth = Layer[depth];
            const current = this._tiles[depth];
            let didSomething = false;
            if (depth === Layer.GROUND) {
                if (typeof floorTile === 'string') {
                    floorTile = tiles[floorTile] || tiles.FLOOR;
                }
            }
            if (current) {
                // this.flags |= (Flags.NEEDS_REDRAW | Flags.CELL_CHANGED);
                this.flags |= Cell.CELL_CHANGED;
                this.removeLayer(current);
                didSomething =
                    current && (depth !== Layer.GROUND || current !== floorTile);
            }
            this._tiles[depth] = null;
            let layerFlag = 0;
            if (depth == Layer.LIQUID) {
                layerFlag = Cell.HAS_LIQUID;
                this.liquidVolume = 0;
            }
            else if (depth == Layer.GAS) {
                layerFlag = Cell.HAS_GAS;
                this.gasVolume = 0;
            }
            else if (depth == Layer.SURFACE) {
                layerFlag = Cell.HAS_SURFACE;
            }
            else if (depth == Layer.GROUND) {
                this._tiles[Layer.GROUND] = floorTile;
            }
            this.flags &= ~layerFlag;
            return didSomething;
        }
        clearLayersExcept(except = Layer.GROUND, ground) {
            const floorTile = ground ? tiles[ground] : this.groundTile;
            for (let layer = 0; layer < this._tiles.length; layer++) {
                if (layer != except && layer != Layer.GAS) {
                    if (layer === Layer.GROUND) {
                        if (floorTile !== this.groundTile)
                            this.setTile(floorTile);
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
            for (let i = 0; i < this._tiles.length; ++i) {
                const tile = this._tiles[i];
                if (!tile)
                    continue;
                if (tileFlags && tileMechFlags) {
                    if (tile.flags.tile & tileFlags &&
                        tile.flags.tileMech & tileMechFlags) {
                        this.clearLayer(i);
                    }
                }
                else if (tileFlags) {
                    if (tile.flags.tile & tileFlags) {
                        this.clearLayer(i);
                    }
                }
                else if (tileMechFlags) {
                    if (tile.flags.tileMech & tileMechFlags) {
                        this.clearLayer(i);
                    }
                }
            }
            // this.flags |= (Flags.NEEDS_REDRAW | Flags.CELL_CHANGED);
        }
        // EVENTS
        async activate(name, map, x, y, ctx = {}) {
            ctx.cell = this;
            let fired = false;
            if (ctx.layer !== undefined) {
                const tile = this.tile(ctx.layer);
                if (tile && tile.activates) {
                    const ev = tile.activates[name];
                    let effect;
                    if (typeof ev === 'string') {
                        effect = GW.effect.effects[ev];
                    }
                    else {
                        effect = ev;
                    }
                    if (effect) {
                        // console.log(' - has event');
                        if (ctx.force ||
                            !effect.chance ||
                            GW.random.chance(effect.chance, 10000)) {
                            ctx.tile = tile;
                            // console.log(' - spawn event @%d,%d - %s', x, y, name);
                            fired = await effect.fire(map, x, y, ctx);
                            // cell.debug(" - spawned");
                        }
                    }
                }
            }
            else {
                // console.log('fire event - %s', name);
                for (let tile of this.tiles()) {
                    if (!tile.activates)
                        continue;
                    const ev = tile.activates[name];
                    // console.log(' - ', ev);
                    let effect;
                    if (typeof ev === 'string') {
                        effect = GW.effect.effects[ev];
                    }
                    else {
                        effect = ev;
                    }
                    if (effect) {
                        // cell.debug(" - has event");
                        if (ctx.force ||
                            !effect.chance ||
                            GW.random.chance(effect.chance, 10000)) {
                            ctx.tile = tile;
                            // console.log(' - spawn event @%d,%d - %s', x, y, name);
                            fired = (await effect.fire(map, x, y, ctx)) || fired;
                            // cell.debug(" - spawned");
                            if (fired) {
                                break;
                            }
                        }
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
                this.removeLayer(this.item);
            }
            this._item = item;
            if (item) {
                this.flags |= Cell.HAS_ITEM;
                this.addLayer(item);
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
                this.removeLayer(this.actor);
            }
            this._actor = actor;
            if (actor) {
                this.flags |= Cell.HAS_ANY_ACTOR;
                this.addLayer(actor);
            }
            else {
                this.flags &= ~Cell.HAS_ANY_ACTOR;
            }
        }
        addLayer(layer) {
            if (!layer)
                return;
            // this.flags |= Flags.NEEDS_REDRAW;
            this.flags |= Cell.CELL_CHANGED;
            let current = this.layers;
            if (!current ||
                current.layer.layer > layer.layer ||
                (current.layer.layer == layer.layer &&
                    current.layer.priority > layer.priority)) {
                this.layers = {
                    layer,
                    next: current,
                };
                return;
            }
            while (current.next &&
                (current.next.layer.layer < layer.layer ||
                    (current.next.layer.layer == layer.layer &&
                        current.next.layer.priority <= layer.priority))) {
                current = current.next;
            }
            const item = {
                layer,
                next: current.next,
            };
            current.next = item;
        }
        removeLayer(layer) {
            if (!layer)
                return false;
            if (!this.layers)
                return false;
            // this.flags |= Flags.NEEDS_REDRAW;
            this.flags |= Cell.CELL_CHANGED;
            if (this.layers && this.layers.layer === layer) {
                this.layers = this.layers.next;
                return true;
            }
            let prev = this.layers;
            let current = this.layers.next;
            while (current) {
                if (current.layer === layer) {
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
            memory.layerFlags = this.layerFlags();
            memory.cellFlags = this.flags;
            memory.cellMechFlags = this.mechFlags;
            memory.tile = this.topmostTile();
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
                if (this.actor.rememberedInCell &&
                    this.actor.rememberedInCell !== this) {
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
            cell.setTile(tile);
        }
        return cell;
    }
    GW.make.cell = make$3;
    function getAppearance(cell, dest) {
        const memory = cell.memory.mixer;
        memory.blackOut();
        let needDistinctness = cell.layerFlags() & Entity.L_VISUALLY_DISTINCT;
        let current = cell.layers;
        while (current) {
            const layer = current.layer;
            let alpha = layer.sprite.opacity || 100;
            if (layer.layer == Layer.LIQUID) {
                alpha = GW.utils.clamp(cell.liquidVolume * 34, 20, 100);
            }
            else if (layer.layer == Layer.GAS) {
                alpha = GW.utils.clamp(cell.gasVolume * 34, 20, 100);
            }
            memory.drawSprite(layer.sprite, alpha);
            current = current.next;
        }
        memory.fg.multiply(cell.light);
        memory.bg.multiply(cell.light);
        memory.bake(!cell.isAnyKindOfVisible()); // turns off dancing if not visible
        if (needDistinctness) {
            GW.color.separate(memory.fg, memory.bg);
        }
        if (memory.dances) {
            cell.flags |= Cell.COLORS_DANCE;
        }
        else {
            cell.flags &= ~Cell.COLORS_DANCE;
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

    function demoteCellVisibility(cell) {
        cell.flags &= ~(Cell.WAS_ANY_KIND_OF_VISIBLE | Cell.IN_FOV);
        if (cell.flags & Cell.VISIBLE) {
            cell.flags &= ~Cell.VISIBLE;
            cell.flags |= Cell.WAS_VISIBLE;
        }
        if (cell.flags & Cell.CLAIRVOYANT_VISIBLE) {
            cell.flags &= ~Cell.CLAIRVOYANT_VISIBLE;
            cell.flags |= Cell.WAS_CLAIRVOYANT_VISIBLE;
        }
        if (cell.flags & Cell.TELEPATHIC_VISIBLE) {
            cell.flags &= ~Cell.TELEPATHIC_VISIBLE;
            cell.flags |= Cell.WAS_TELEPATHIC_VISIBLE;
        }
    }
    function _updateCellVisibility(cell, i, j, map) {
        const isVisible = cell.flags & Cell.VISIBLE;
        const wasVisible = cell.flags & Cell.WAS_VISIBLE;
        if (isVisible && wasVisible) {
            if (cell.lightChanged) {
                map.redrawCell(cell);
            }
        }
        else if (isVisible && !wasVisible) {
            // if the cell became visible this move
            if (!(cell.flags & Cell.REVEALED) && GW.data.automationActive) {
                if (cell.item) {
                    const theItem = cell.item;
                    if (theItem.hasLayerFlag(Entity.L_INTERRUPT_WHEN_SEEN)) {
                        GW.message.add('§you§ §see§ ΩitemMessageColorΩ§item§∆.', {
                            item: theItem,
                            actor: GW.data.player,
                        });
                    }
                }
                if (!(cell.flags & Cell.MAGIC_MAPPED) &&
                    cell.hasLayerFlag(Entity.L_INTERRUPT_WHEN_SEEN)) {
                    const tile = cell.tileWithLayerFlag(Entity.L_INTERRUPT_WHEN_SEEN);
                    if (tile) {
                        GW.message.add('§you§ §see§ ΩbackgroundMessageColorΩ§item§∆.', {
                            actor: GW.data.player,
                            item: tile.name,
                        });
                    }
                }
            }
            map.markRevealed(i, j);
            map.redrawCell(cell);
        }
        else if (!isVisible && wasVisible) {
            // if the cell ceased being visible this move
            cell.storeMemory();
            map.redrawCell(cell);
        }
        return isVisible;
    }
    function _updateCellClairyvoyance(cell, _i, _j, map) {
        const isClairy = cell.flags & Cell.CLAIRVOYANT_VISIBLE;
        const wasClairy = cell.flags & Cell.WAS_CLAIRVOYANT_VISIBLE;
        if (isClairy && wasClairy) {
            if (cell.lightChanged) {
                map.redrawCell(cell);
            }
        }
        else if (!isClairy && wasClairy) {
            // ceased being clairvoyantly visible
            cell.storeMemory();
            map.redrawCell(cell);
        }
        else if (!wasClairy && isClairy) {
            // became clairvoyantly visible
            cell.flags &= ~Cell.STABLE_MEMORY;
            map.redrawCell(cell);
        }
        return isClairy;
    }
    function _updateCellTelepathy(cell, _i, _j, map) {
        const isTele = cell.flags & Cell.TELEPATHIC_VISIBLE;
        const wasTele = cell.flags & Cell.WAS_TELEPATHIC_VISIBLE;
        if (isTele && wasTele) {
            if (cell.lightChanged) {
                map.redrawCell(cell);
            }
        }
        else if (!isTele && wasTele) {
            // ceased being telepathically visible
            cell.storeMemory();
            map.redrawCell(cell);
        }
        else if (!wasTele && isTele) {
            // became telepathically visible
            if (!(cell.flags & Cell.REVEALED) &&
                !cell.hasTileFlag(Tile.T_PATHING_BLOCKER)) {
                GW.data.xpxpThisTurn++;
            }
            cell.flags &= ~Cell.STABLE_MEMORY;
            map.redrawCell(cell);
        }
        return isTele;
    }
    function _updateCellDetect(cell, _i, _j, map) {
        const isMonst = cell.flags & Cell.MONSTER_DETECTED;
        const wasMonst = cell.flags & Cell.WAS_MONSTER_DETECTED;
        if (isMonst && wasMonst) {
            if (cell.lightChanged) {
                map.redrawCell(cell);
            }
        }
        else if (!isMonst && wasMonst) {
            // ceased being detected visible
            cell.flags &= ~Cell.STABLE_MEMORY;
            map.redrawCell(cell);
            cell.storeMemory();
        }
        else if (!wasMonst && isMonst) {
            // became detected visible
            cell.flags &= ~Cell.STABLE_MEMORY;
            map.redrawCell(cell);
            cell.storeMemory();
        }
        return isMonst;
    }
    function promoteCellVisibility(cell, i, j, map) {
        if (cell.flags & Cell.IN_FOV &&
            map.hasVisibleLight(i, j) &&
            !(cell.mechFlags & CellMech.DARKENED)) {
            cell.flags |= Cell.VISIBLE;
        }
        if (_updateCellVisibility(cell, i, j, map))
            return;
        if (_updateCellClairyvoyance(cell, i, j, map))
            return;
        if (_updateCellTelepathy(cell, i, j, map))
            return;
        if (_updateCellDetect(cell, i, j, map))
            return;
    }
    function initMap(map$1) {
        if (!(map$1.flags & Map.MAP_CALC_FOV)) {
            map$1.forEach((cell) => (cell.flags |= Cell.REVEALED));
            return;
        }
        map$1.clearFlags(0, Cell.IS_WAS_ANY_KIND_OF_VISIBLE);
    }
    function update(map$1, x, y, maxRadius) {
        if (!(map$1.flags & Map.MAP_CALC_FOV) || !map$1.fov)
            return false;
        if (x == map$1.fov.x && y == map$1.fov.y) {
            if (!(map$1.flags & Map.MAP_FOV_CHANGED))
                return false;
        }
        map$1.flags &= ~Map.MAP_FOV_CHANGED;
        map$1.fov.x = x;
        map$1.fov.y = y;
        map$1.forEach(demoteCellVisibility);
        // Calculate player's field of view (distinct from what is visible, as lighting hasn't been done yet).
        const grid = GW.grid.alloc(map$1.width, map$1.height, 0);
        map$1.calcFov(grid, x, y, maxRadius);
        grid.forEach((v, i, j) => {
            if (v) {
                map$1.setCellFlags(i, j, Cell.IN_FOV);
            }
        });
        GW.grid.free(grid);
        map$1.setCellFlags(x, y, Cell.IN_FOV | Cell.VISIBLE);
        // if (PLAYER.bonus.clairvoyance < 0) {
        //   discoverCell(PLAYER.xLoc, PLAYER.yLoc);
        // }
        //
        // if (PLAYER.bonus.clairvoyance != 0) {
        // 	updateClairvoyance();
        // }
        //
        // updateTelepathy();
        // updateMonsterDetection();
        // updateLighting();
        map$1.forEach(promoteCellVisibility);
        // if (PLAYER.status.hallucinating > 0) {
        // 	for (theItem of DUNGEON.items) {
        // 		if ((pmap[theItem.xLoc][theItem.yLoc].flags & DISCOVERED) && refreshDisplay) {
        // 			refreshDungeonCell(theItem.xLoc, theItem.yLoc);
        // 		}
        // 	}
        // 	for (monst of DUNGEON.monsters) {
        // 		if ((pmap[monst.xLoc][monst.yLoc].flags & DISCOVERED) && refreshDisplay) {
        // 			refreshDungeonCell(monst.xLoc, monst.yLoc);
        // 		}
        // 	}
        // }
        return true;
    }

    var visibility = {
        __proto__: null,
        initMap: initMap,
        update: update
    };

    const Flags = GW.effect.Flags;
    function makeTileEffect(config) {
        if (!config) {
            GW.utils.ERROR('Config required to make tile effect.');
            return null;
        }
        if (typeof config === 'string') {
            config = config.split(/[,|]/).map((t) => t.trim());
        }
        if (Array.isArray(config)) {
            config = {
                id: config[0],
                spread: config[1] || 0,
                decrement: config[2] || 0,
            };
        }
        config.id = config.id || config.tile;
        config.spread = config.spread || 0;
        config.decrement = config.decrement || 0;
        if (config.spread >= 100 && config.decrement <= 0) {
            config.decrement = 100;
        }
        config.matchTile = config.matchTile || config.match || config.needs || null;
        config.volume = config.volume || 0;
        if (!config.id) {
            GW.utils.ERROR('id required to make tile effect.');
        }
        return tileEffect.bind(config);
    }
    GW.effect.installType('tile', makeTileEffect);
    async function tileEffect(effect, x, y) {
        const id = this.id;
        const tile$1 = tiles[id] || null;
        if (!tile$1)
            return false;
        const abortIfBlocking = !!(effect.flags & Flags.E_ABORT_IF_BLOCKS_MAP);
        const isBlocking = !!(abortIfBlocking &&
            !(effect.flags & Flags.E_PERMIT_BLOCKING) &&
            (tile$1.blocksPathing() || effect.flags & Flags.E_TREAT_AS_BLOCKING));
        let didSomething = false;
        const map = effect.map;
        didSomething = computeSpawnMap(this, effect, x, y);
        if (!didSomething) {
            return false;
        }
        if (abortIfBlocking &&
            isBlocking &&
            map.gridDisruptsWalkability(effect.grid)) {
            // GW.grid.free(spawnMap);
            return false;
        }
        if (effect.flags & Flags.E_EVACUATE_CREATURES) {
            // first, evacuate creatures, so that they do not re-trigger the tile.
            if (evacuateCreatures(map, effect.grid)) {
                didSomething = true;
            }
        }
        if (effect.flags & Flags.E_EVACUATE_ITEMS) {
            // first, evacuate items, so that they do not re-trigger the tile.
            if (evacuateItems(map, effect.grid)) {
                didSomething = true;
            }
        }
        if (effect.flags & Flags.E_CLEAR_CELL) {
            // first, clear other tiles (not base/ground)
            if (clearCells(map, effect.grid, effect.flags)) {
                didSomething = true;
            }
        }
        const spawned = spawnTiles(effect.flags, effect.grid, effect.map, tile$1, this.volume);
        if (spawned) {
            didSomething = true;
            // await spawnMap.forEachAsync( (v, x, y) => {
            //     if (!v) return;
            //     await map.applyInstantEffects(x, y);
            // });
            // if (applyEffects) {
            // if (PLAYER.xLoc == i && PLAYER.yLoc == j && !PLAYER.status.levitating && refresh) {
            // 	flavorMessage(tileFlavor(PLAYER.xLoc, PLAYER.yLoc));
            // }
            // if (cell.actor || cell.item) {
            // 	for(let t of cell.tiles()) {
            // 		await t.applyInstantEffects(map, i, j, cell);
            // 		if (Data.gameHasEnded) {
            // 			return true;
            // 		}
            // 	}
            // }
            // if (tile.flags & TileFlags.T_IS_FIRE) {
            // 	if (cell.flags & CellFlags.HAS_ITEM) {
            // 		theItem = map.itemAt(i, j);
            // 		if (theItem.flags & Flags.Item.ITEM_FLAMMABLE) {
            // 			await burnItem(theItem);
            // 		}
            // 	}
            // }
            // }
        }
        // GW.grid.free(spawnMap);
        return didSomething;
    }
    // tick
    async function fireAll(map, event) {
        const willFire = GW.grid.alloc(map.width, map.height);
        // Figure out which tiles will fire - before we change everything...
        map.forEach((cell$1, x, y) => {
            cell$1.clearFlags(0, CellMech.EVENT_FIRED_THIS_TURN |
                CellMech.EVENT_PROTECTED);
            for (let tile of cell$1.tiles()) {
                const effect = GW.effect.from(tile.activates[event]);
                if (!effect)
                    continue;
                let promoteChance = 0;
                // < 0 means try to fire my neighbors...
                if (effect.chance < 0) {
                    promoteChance = 0;
                    map.eachNeighbor(x, y, (n, _i, _j) => {
                        if (!n.hasLayerFlag(Entity.L_BLOCKS_EFFECTS) &&
                            n.tileId(tile.layer) != cell$1.tileId(tile.layer) &&
                            !(n.mechFlags &
                                CellMech.CAUGHT_FIRE_THIS_TURN)) {
                            // TODO - Should this break from the loop after doing this once or keep going?
                            promoteChance += -1 * effect.chance;
                        }
                    }, true);
                }
                else {
                    promoteChance = effect.chance || 100 * 100; // 100%
                }
                if (!(cell$1.mechFlags & CellMech.CAUGHT_FIRE_THIS_TURN) &&
                    GW.random.chance(promoteChance, 10000)) {
                    willFire[x][y] |= GW.flag.fl(tile.layer);
                    // cell.mechFlags |= Cell.MechFlags.EVENT_FIRED_THIS_TURN;
                }
            }
        });
        // Then activate them - so that we don't activate the next generation as part of the forEach
        await willFire.forEachAsync(async (w, x, y) => {
            if (!w)
                return;
            const cell$1 = map.cell(x, y);
            if (cell$1.mechFlags & CellMech.EVENT_FIRED_THIS_TURN)
                return;
            for (let layer = 0; layer <= Layer.GAS; ++layer) {
                if (w & GW.flag.fl(layer)) {
                    await cell$1.activate(event, map, x, y, {
                        force: true,
                        layer,
                    });
                }
            }
        });
        GW.grid.free(willFire);
    }
    // Spawn
    function spawnTiles(flags, spawnMap, map, tile, volume = 0) {
        let i, j;
        let accomplishedSomething;
        accomplishedSomething = false;
        const blockedByOtherLayers = flags & Flags.E_BLOCKED_BY_OTHER_LAYERS;
        const superpriority = flags & Flags.E_SUPERPRIORITY;
        // const applyEffects = ctx.refreshCell;
        volume = volume || 0; // (tile ? tile.volume : 0);
        for (i = 0; i < spawnMap.width; i++) {
            for (j = 0; j < spawnMap.height; j++) {
                if (!spawnMap[i][j])
                    continue; // If it's not flagged for building in the spawn map,
                // const isRoot = spawnMap[i][j] === 1;
                spawnMap[i][j] = 0; // so that the spawnmap reflects what actually got built
                const cell$1 = map.cell(i, j);
                if (cell$1.tile(tile.layer) === tile) {
                    // If the new cell already contains the fill terrain,
                    if (tile.layer == Layer.GAS) {
                        spawnMap[i][j] = 1;
                        cell$1.gasVolume += volume;
                    }
                    else if (tile.layer == Layer.LIQUID) {
                        spawnMap[i][j] = 1;
                        cell$1.liquidVolume += volume;
                    }
                }
                else if ((superpriority ||
                    cell$1.tile(tile.layer).priority < tile.priority) && // If the terrain in the layer to be overwritten has a higher priority number (unless superpriority),
                    !cell$1.obstructsLayer(tile.layer) && // If we will be painting into the surface layer when that cell forbids it,
                    (!cell$1.item || !(flags & Flags.E_BLOCKED_BY_ITEMS)) &&
                    (!cell$1.actor || !(flags & Flags.E_BLOCKED_BY_ACTORS)) &&
                    (!blockedByOtherLayers ||
                        cell$1.topmostTile().priority < tile.priority) // TODO - highestPriorityTile()
                ) {
                    if (map.setTile(i, j, tile, volume)) {
                        // if the fill won't violate the priority of the most important terrain in this cell:
                        spawnMap[i][j] = 1; // so that the spawnmap reflects what actually got built
                        // map.redrawCell(cell);
                        // if (volume && cell.gas) {
                        //     cell.volume += (feat.volume || 0);
                        // }
                        cell$1.mechFlags |= CellMech.EVENT_FIRED_THIS_TURN;
                        if (flags & Flags.E_PROTECTED) {
                            cell$1.mechFlags |= CellMech.EVENT_PROTECTED;
                        }
                        accomplishedSomething = true;
                        // debug('- tile', i, j, 'tile=', tile.id);
                    }
                }
            }
        }
        if (accomplishedSomething) {
            map.changed = true;
        }
        return accomplishedSomething;
    }
    // Spread
    function cellIsOk(config, map, x, y, flags, isStart) {
        if (!map.hasXY(x, y))
            return false;
        const cell$1 = map.cell(x, y);
        if (cell$1.mechFlags & CellMech.EVENT_PROTECTED)
            return false;
        if (flags & Flags.E_BUILD_IN_WALLS) {
            if (!cell$1.isWall())
                return false;
        }
        else if (flags & Flags.E_MUST_TOUCH_WALLS) {
            let ok = false;
            map.eachNeighbor(x, y, (c) => {
                if (c.isWall()) {
                    ok = true;
                }
            });
            if (!ok)
                return false;
        }
        else if (flags & Flags.E_NO_TOUCH_WALLS) {
            let ok = true;
            if (cell$1.isWall())
                return false; // or on wall
            map.eachNeighbor(x, y, (c) => {
                if (c.isWall()) {
                    ok = false;
                }
            });
            if (!ok)
                return false;
        }
        else if (cell$1.blocksEffects() && !config.matchTile && !isStart) {
            return false;
        }
        // if (ctx.bounds && !ctx.bounds.containsXY(x, y)) return false;
        if (config.matchTile && !cell$1.hasTile(config.matchTile))
            return false;
        return true;
    }
    function computeSpawnMap(config, effect, x, y) {
        let i, j, dir, t, x2, y2;
        let madeChange;
        // const bounds = ctx.bounds || null;
        // if (bounds) {
        //   // Activation.debug('- bounds', bounds);
        // }
        const map = effect.map;
        const flags = effect.flags;
        const grid = effect.grid;
        let startProb = config.spread || 0;
        let probDec = config.decrement || 0;
        const spawnMap = grid;
        spawnMap.fill(0);
        spawnMap[x][y] = t = 1; // incremented before anything else happens
        let count = 1;
        if (startProb) {
            madeChange = true;
            if (startProb >= 100) {
                probDec = probDec || 100;
            }
            if (probDec <= 0) {
                probDec = startProb;
            }
            while (madeChange && startProb > 0) {
                madeChange = false;
                t++;
                for (i = 0; i < map.width; i++) {
                    for (j = 0; j < map.height; j++) {
                        if (spawnMap[i][j] == t - 1) {
                            for (dir = 0; dir < 4; dir++) {
                                x2 = i + GW.utils.DIRS[dir][0];
                                y2 = j + GW.utils.DIRS[dir][1];
                                if (spawnMap.hasXY(x2, y2) &&
                                    !spawnMap[x2][y2] &&
                                    cellIsOk(config, map, x2, y2, flags, false) &&
                                    GW.random.chance(startProb)) {
                                    spawnMap[x2][y2] = t;
                                    madeChange = true;
                                    ++count;
                                }
                            }
                        }
                    }
                }
                startProb -= probDec;
            }
        }
        if (!cellIsOk(config, map, x, y, flags, true)) {
            spawnMap[x][y] = 0;
            --count;
        }
        return count > 0;
    }
    // export function spreadCircle(
    //     this: any,
    //     ctx: GW.effect.EffectCtx,
    //     spawnMap: GW.grid.NumGrid
    // ) {
    //     const x = ctx.x;
    //     const y = ctx.y;
    //     let startProb = this.spread || 0;
    //     let probDec = this.decrement || 0;
    //     spawnMap.fill(0);
    //     spawnMap[x][y] = 1; // incremented before anything else happens
    //     let radius = 0;
    //     startProb = startProb || 100;
    //     if (startProb >= 100) {
    //         probDec = probDec || 100;
    //     }
    //     while (GW.random.chance(startProb)) {
    //         startProb -= probDec;
    //         ++radius;
    //     }
    //     // startProb = 100;
    //     // probDec = 0;
    //     spawnMap.updateCircle(x, y, radius, (_v, i, j) => {
    //         if (!cellIsOk(this, i, j, ctx)) return 0;
    //         // const dist = Math.floor(Utils.distanceBetween(x, y, i, j));
    //         // const prob = startProb - dist * probDec;
    //         // if (!random.chance(prob)) return 0;
    //         return 1;
    //     });
    //     // spawnMap[x][y] = 1;
    //     // if (!isOk(flags, x, y, ctx)) {
    //     //     spawnMap[x][y] = 0;
    //     // }
    //     return true;
    // }
    // export function spreadLine(
    //     this: any,
    //     ctx: GW.effect.EffectCtx,
    //     spawnMap: GW.grid.NumGrid
    // ) {
    //     let x2, y2;
    //     let madeChange;
    //     const x = ctx.x;
    //     const y = ctx.y;
    //     let startProb = this.spread || 0;
    //     let probDec = this.decrement || 0;
    //     spawnMap.fill(0);
    //     spawnMap[x][y] = 1; // incremented before anything else happens
    //     if (startProb) {
    //         madeChange = true;
    //         if (startProb >= 100) {
    //             probDec = probDec || 100;
    //         }
    //         x2 = x;
    //         y2 = y;
    //         const dir = GW.utils.DIRS[GW.random.number(4)];
    //         while (madeChange) {
    //             madeChange = false;
    //             x2 = x2 + dir[0];
    //             y2 = y2 + dir[1];
    //             if (
    //                 spawnMap.hasXY(x2, y2) &&
    //                 !spawnMap[x2][y2] &&
    //                 cellIsOk(this, x2, y2, ctx) &&
    //                 GW.random.chance(startProb)
    //             ) {
    //                 spawnMap[x2][y2] = 1;
    //                 madeChange = true;
    //                 startProb -= probDec;
    //             }
    //         }
    //     }
    //     if (!cellIsOk(this, x, y, ctx)) {
    //         spawnMap[x][y] = 0;
    //     }
    //     return true;
    // }
    function clearCells(map, spawnMap, flags = 0) {
        let didSomething = false;
        const clearAll = (flags & Flags.E_CLEAR_CELL) === Flags.E_CLEAR_CELL;
        spawnMap.forEach((v, i, j) => {
            if (!v)
                return;
            const cell = map.cell(i, j);
            if (clearAll) {
                cell.clear();
            }
            else {
                if (flags & Flags.E_CLEAR_GAS) {
                    cell.clearLayer(Layer.GAS);
                }
                if (flags & Flags.E_CLEAR_LIQUID) {
                    cell.clearLayer(Layer.LIQUID);
                }
                if (flags & Flags.E_CLEAR_SURFACE) {
                    cell.clearLayer(Layer.SURFACE);
                }
                if (flags & Flags.E_CLEAR_GROUND) {
                    cell.clearLayer(Layer.GROUND);
                }
            }
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
    function makeClearEffect(config) {
        if (!config) {
            GW.utils.ERROR('Config required to make clear effect.');
            return null;
        }
        if (typeof config === 'string') {
            config = config
                .split(/[,|]/)
                .map((t) => t.trim())
                .reduce((out, v) => {
                // @ts-ignore -- huh?
                const layer = Layer[v] || 0;
                return out | layer;
            }, 0);
        }
        else if (config === true) {
            config = Layer.ALL_LAYERS;
        }
        else if (!Array.isArray(config)) {
            GW.utils.ERROR('clear effect must have number or string config.');
            return null;
        }
        return clearEffect.bind(config);
    }
    GW.effect.installType('clear', makeClearEffect);
    function clearEffect(effect, x, y) {
        const map = effect.map;
        if (!map)
            return false;
        return map.clearCellLayers(x, y, this);
    }

    function analyze(map, updateChokeCounts = true) {
        updateLoopiness(map);
        updateChokepoints(map, updateChokeCounts);
    }
    /////////////////////////////////////////////////////
    /////////////////////////////////////////////////////
    // TODO - Move to Map?
    function updateChokepoints(map, updateCounts) {
        const passMap = GW.grid.alloc(map.width, map.height);
        const grid = GW.grid.alloc(map.width, map.height);
        for (let i = 0; i < map.width; i++) {
            for (let j = 0; j < map.height; j++) {
                const cell = map.get(i, j);
                if ((cell.hasTileFlag(Tile.T_PATHING_BLOCKER) ||
                    cell.hasLayerFlag(Entity.L_BLOCKS_MOVE)) &&
                    !cell.hasLayerFlag(Entity.L_SECRETLY_PASSABLE)) {
                    // cell.flags &= ~FLAGS.CellMech.IS_IN_LOOP;
                    passMap[i][j] = 0;
                }
                else {
                    // cell.flags |= FLAGS.CellMech.IS_IN_LOOP;
                    passMap[i][j] = 1;
                }
            }
        }
        let passableArcCount;
        // done finding loops; now flag chokepoints
        for (let i = 1; i < passMap.width - 1; i++) {
            for (let j = 1; j < passMap.height - 1; j++) {
                map.cells[i][j].mechFlags &= ~CellMech.IS_CHOKEPOINT;
                if (passMap[i][j] &&
                    !(map.cells[i][j].mechFlags & CellMech.IS_IN_LOOP)) {
                    passableArcCount = 0;
                    for (let dir = 0; dir < 8; dir++) {
                        const oldX = i + GW.utils.CLOCK_DIRS[(dir + 7) % 8][0];
                        const oldY = j + GW.utils.CLOCK_DIRS[(dir + 7) % 8][1];
                        const newX = i + GW.utils.CLOCK_DIRS[dir][0];
                        const newY = j + GW.utils.CLOCK_DIRS[dir][1];
                        if ((map.hasXY(newX, newY) && // RUT.Map.makeValidXy(map, newXy) &&
                            passMap[newX][newY]) !=
                            (map.hasXY(oldX, oldY) && // RUT.Map.makeValidXy(map, oldXy) &&
                                passMap[oldX][oldY])) {
                            if (++passableArcCount > 2) {
                                if ((!passMap[i - 1][j] && !passMap[i + 1][j]) ||
                                    (!passMap[i][j - 1] && !passMap[i][j + 1])) {
                                    map.cells[i][j].mechFlags |=
                                        CellMech.IS_CHOKEPOINT;
                                }
                                break;
                            }
                        }
                    }
                }
            }
        }
        if (updateCounts) {
            // Done finding chokepoints; now create a chokepoint map.
            // The chokepoint map is a number for each passable tile. If the tile is a chokepoint,
            // then the number indicates the number of tiles that would be rendered unreachable if the
            // chokepoint were blocked. If the tile is not a chokepoint, then the number indicates
            // the number of tiles that would be rendered unreachable if the nearest exit chokepoint
            // were blocked.
            // The cost of all of this is one depth-first flood-fill per open point that is adjacent to a chokepoint.
            // Start by setting the chokepoint values really high, and roping off room machines.
            for (let i = 0; i < map.width; i++) {
                for (let j = 0; j < map.height; j++) {
                    map.cells[i][j].chokeCount = 30000;
                    if (map.cells[i][j].mechFlags &
                        CellMech.IS_IN_ROOM_MACHINE) {
                        passMap[i][j] = 0;
                    }
                }
            }
            // Scan through and find a chokepoint next to an open point.
            for (let i = 0; i < map.width; i++) {
                for (let j = 0; j < map.height; j++) {
                    const cell = map.cells[i][j];
                    if (passMap[i][j] &&
                        cell.mechFlags & CellMech.IS_CHOKEPOINT) {
                        for (let dir = 0; dir < 4; dir++) {
                            const newX = i + GW.utils.DIRS[dir][0];
                            const newY = j + GW.utils.DIRS[dir][1];
                            if (map.hasXY(newX, newY) && // RUT.Map.makeValidXy(map, newXy) &&
                                passMap[newX][newY] &&
                                !(map.cells[newX][newY].mechFlags &
                                    CellMech.IS_CHOKEPOINT)) {
                                // OK, (newX, newY) is an open point and (i, j) is a chokepoint.
                                // Pretend (i, j) is blocked by changing passMap, and run a flood-fill cell count starting on (newX, newY).
                                // Keep track of the flooded region in grid[][].
                                grid.fill(0);
                                passMap[i][j] = 0;
                                let cellCount = floodFillCount(map, grid, passMap, newX, newY);
                                passMap[i][j] = 1;
                                // CellCount is the size of the region that would be obstructed if the chokepoint were blocked.
                                // CellCounts less than 4 are not useful, so we skip those cases.
                                if (cellCount >= 4) {
                                    // Now, on the chokemap, all of those flooded cells should take the lesser of their current value or this resultant number.
                                    for (let i2 = 0; i2 < grid.width; i2++) {
                                        for (let j2 = 0; j2 < grid.height; j2++) {
                                            if (grid[i2][j2] &&
                                                cellCount <
                                                    map.cells[i2][j2].chokeCount) {
                                                map.cells[i2][j2].chokeCount = cellCount;
                                                map.cells[i2][j2].mechFlags &= ~CellMech
                                                    .IS_GATE_SITE;
                                            }
                                        }
                                    }
                                    // The chokepoint itself should also take the lesser of its current value or the flood count.
                                    if (cellCount < cell.chokeCount) {
                                        cell.chokeCount = cellCount;
                                        cell.mechFlags |=
                                            CellMech.IS_GATE_SITE;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        GW.grid.free(passMap);
        GW.grid.free(grid);
    }
    // Assumes it is called with respect to a passable (startX, startY), and that the same is not already included in results.
    // Returns 10000 if the area included an area machine.
    function floodFillCount(map, results, passMap, startX, startY) {
        let count = passMap[startX][startY] == 2 ? 5000 : 1;
        if (map.cells[startX][startY].mechFlags & CellMech.IS_IN_AREA_MACHINE) {
            count = 10000;
        }
        results[startX][startY] = 1;
        for (let dir = 0; dir < 4; dir++) {
            const newX = startX + GW.utils.DIRS[dir][0];
            const newY = startY + GW.utils.DIRS[dir][1];
            if (map.hasXY(newX, newY) && // RUT.Map.makeValidXy(map, newXy) &&
                passMap[newX][newY] &&
                !results[newX][newY]) {
                count += floodFillCount(map, results, passMap, newX, newY);
            }
        }
        return Math.min(count, 10000);
    }
    ////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////
    // TODO = Move loopiness to Map
    function updateLoopiness(map) {
        map.forEach(resetLoopiness);
        map.forEach(checkLoopiness);
        cleanLoopiness(map);
    }
    function resetLoopiness(cell, _x, _y, _map) {
        if ((cell.hasTileFlag(Tile.T_PATHING_BLOCKER) ||
            cell.hasLayerFlag(Entity.L_BLOCKS_MOVE)) &&
            !cell.hasLayerFlag(Entity.L_SECRETLY_PASSABLE)) {
            cell.mechFlags &= ~CellMech.IS_IN_LOOP;
            // passMap[i][j] = false;
        }
        else {
            cell.mechFlags |= CellMech.IS_IN_LOOP;
            // passMap[i][j] = true;
        }
    }
    function checkLoopiness(cell, x, y, map) {
        let inString;
        let newX, newY, dir, sdir;
        let numStrings, maxStringLength, currentStringLength;
        if (!cell || !(cell.mechFlags & CellMech.IS_IN_LOOP)) {
            return false;
        }
        // find an unloopy neighbor to start on
        for (sdir = 0; sdir < 8; sdir++) {
            newX = x + GW.utils.CLOCK_DIRS[sdir][0];
            newY = y + GW.utils.CLOCK_DIRS[sdir][1];
            if (!map.hasXY(newX, newY))
                continue;
            const cell = map.get(newX, newY);
            if (!cell || !(cell.mechFlags & CellMech.IS_IN_LOOP)) {
                break;
            }
        }
        if (sdir == 8) {
            // no unloopy neighbors
            return false; // leave cell loopy
        }
        // starting on this unloopy neighbor,
        // work clockwise and count up:
        // (a) the number of strings of loopy neighbors, and
        // (b) the length of the longest such string.
        numStrings = maxStringLength = currentStringLength = 0;
        inString = false;
        for (dir = sdir; dir < sdir + 8; dir++) {
            newX = x + GW.utils.CLOCK_DIRS[dir % 8][0];
            newY = y + GW.utils.CLOCK_DIRS[dir % 8][1];
            if (!map.hasXY(newX, newY))
                continue;
            const newCell = map.get(newX, newY);
            if (newCell && newCell.mechFlags & CellMech.IS_IN_LOOP) {
                currentStringLength++;
                if (!inString) {
                    if (numStrings > 0) {
                        return false; // more than one string here; leave loopy
                    }
                    numStrings++;
                    inString = true;
                }
            }
            else if (inString) {
                if (currentStringLength > maxStringLength) {
                    maxStringLength = currentStringLength;
                }
                currentStringLength = 0;
                inString = false;
            }
        }
        if (inString && currentStringLength > maxStringLength) {
            maxStringLength = currentStringLength;
        }
        if (numStrings == 1 && maxStringLength <= 4) {
            cell.mechFlags &= ~CellMech.IS_IN_LOOP;
            for (dir = 0; dir < 8; dir++) {
                const newX = x + GW.utils.CLOCK_DIRS[dir][0];
                const newY = y + GW.utils.CLOCK_DIRS[dir][1];
                if (map.hasXY(newX, newY)) {
                    const newCell = map.get(newX, newY);
                    checkLoopiness(newCell, newX, newY, map);
                }
            }
            return true;
        }
        else {
            return false;
        }
    }
    function fillInnerLoopGrid(map, grid) {
        for (let x = 0; x < map.width; ++x) {
            for (let y = 0; y < map.height; ++y) {
                const cell = map.cells[x][y];
                if (cell.mechFlags & CellMech.IS_IN_LOOP) {
                    grid[x][y] = 1;
                }
                else if (x > 0 && y > 0) {
                    const up = map.cells[x][y - 1];
                    const left = map.cells[x - 1][y];
                    if (up.mechFlags & CellMech.IS_IN_LOOP &&
                        left.mechFlags & CellMech.IS_IN_LOOP) {
                        grid[x][y] = 1;
                    }
                }
            }
        }
    }
    function cleanLoopiness(map) {
        // remove extraneous loop markings
        const grid = GW.grid.alloc(map.width, map.height);
        fillInnerLoopGrid(map, grid);
        // const xy = { x: 0, y: 0 };
        let designationSurvives;
        for (let i = 0; i < grid.width; i++) {
            for (let j = 0; j < grid.height; j++) {
                const cell = map.get(i, j);
                if (cell.mechFlags & CellMech.IS_IN_LOOP) {
                    designationSurvives = false;
                    for (let dir = 0; dir < 8; dir++) {
                        let newX = i + GW.utils.CLOCK_DIRS[dir][0];
                        let newY = j + GW.utils.CLOCK_DIRS[dir][1];
                        if (map.hasXY(newX, newY) && // RUT.Map.makeValidXy(map, xy, newX, newY) &&
                            !grid[newX][newY] &&
                            !(map.cells[newX][newY].mechFlags &
                                CellMech.IS_IN_LOOP)) {
                            designationSurvives = true;
                            break;
                        }
                    }
                    if (!designationSurvives) {
                        grid[i][j] = 1;
                        map.cells[i][j].mechFlags &= ~CellMech.IS_IN_LOOP;
                    }
                }
            }
        }
        GW.grid.free(grid);
    }
    ////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////

    GW.utils.setDefaults(GW.config, {
        'map.deepestLevel': 99,
    });
    class Map$1 {
        constructor(w, h, opts = {}) {
            this.locations = {};
            this.config = {};
            this._actors = null;
            this._items = null;
            this.flags = 0;
            this.lights = null;
            this.fov = null;
            this._width = w;
            this._height = h;
            this.cells = GW.grid.make(w, h, () => new Cell$1());
            this.locations = opts.locations || {};
            this.config = Object.assign({}, opts);
            this.config.tick = this.config.tick || 100;
            this._actors = null;
            this._items = null;
            this.flags = GW.flag.from(Map, Map.MAP_DEFAULT, opts.flags);
            const ambient = opts.ambient || opts.ambientLight || opts.light || 'white';
            this.ambientLight = GW.color.make(ambient);
            if (opts.ambient || opts.ambientLight || opts.light) {
                this.ambientLightChanged = true;
            }
            this.lights = null;
            this.id = opts.id;
            if (this.config.fov) {
                this.flags |= Map.MAP_CALC_FOV;
                this.fov = { x: -1, y: -1 };
            }
            if (opts.updateLiquid && typeof opts.updateLiquid === 'function') {
                this.updateLiquid = opts.updateLiquid.bind(this);
            }
            if (opts.updateGas && typeof opts.updateGas === 'function') {
                this.updateGas = opts.updateGas.bind(this);
            }
            updateLighting(this); // to set the ambient light
            initMap(this);
        }
        get width() {
            return this._width;
        }
        get height() {
            return this._height;
        }
        async start() { }
        clear(floorTile = 'FLOOR') {
            this.cells.forEach((c) => c.clear(floorTile));
            this.changed = true;
        }
        dump(fmt) {
            this.cells.dump(fmt || ((c) => c.dump()));
        }
        cell(x, y) {
            return this.cells[x][y];
        }
        get(x, y) {
            return this.cells[x][y];
        }
        eachCell(fn) {
            this.cells.forEach((c, i, j) => fn(c, i, j, this));
        }
        forEach(fn) {
            this.cells.forEach((c, i, j) => fn(c, i, j, this));
        }
        async forEachAsync(fn) {
            return this.cells.forEachAsync((c, i, j) => fn(c, i, j, this));
        }
        forRect(x, y, w, h, fn) {
            this.cells.forRect(x, y, w, h, (c, i, j) => fn(c, i, j, this));
        }
        eachNeighbor(x, y, fn, only4dirs = false) {
            this.cells.eachNeighbor(x, y, (c, i, j) => fn(c, i, j, this), only4dirs);
        }
        eachNeighborAsync(x, y, fn, only4dirs = false) {
            return this.cells.eachNeighborAsync(x, y, (c, i, j) => fn(c, i, j, this), only4dirs);
        }
        randomEach(fn) {
            this.cells.randomEach((c, i, j) => fn(c, i, j, this));
        }
        count(fn) {
            let count = 0;
            this.forEach((c, x, y, g) => {
                if (fn(c, x, y, g)) {
                    ++count;
                }
            });
            return count;
        }
        hasXY(x, y) {
            return this.cells.hasXY(x, y);
        }
        isBoundaryXY(x, y) {
            return this.cells.isBoundaryXY(x, y);
        }
        get changed() {
            return (this.flags & Map.MAP_CHANGED) > 0;
        }
        set changed(v) {
            if (v === true) {
                this.flags |= Map.MAP_CHANGED;
            }
            else if (v === false) {
                this.flags &= ~Map.MAP_CHANGED;
            }
        }
        hasCellFlag(x, y, flag) {
            return this.cell(x, y).flags & flag;
        }
        hasCellMechFlag(x, y, flag) {
            return this.cell(x, y).mechFlags & flag;
        }
        hasLayerFlag(x, y, flag) {
            return this.cell(x, y).hasLayerFlag(flag);
        }
        hasTileFlag(x, y, flag) {
            return this.cell(x, y).hasTileFlag(flag);
        }
        hasTileMechFlag(x, y, flag) {
            return this.cell(x, y).hasTileMechFlag(flag);
        }
        redrawCell(cell) {
            // if (cell.isAnyKindOfVisible()) {
            cell.needsRedraw = true;
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
                c.needsRedraw = true;
                // }
            });
            this.changed = true;
        }
        drawInto(canvas, opts = {}) {
            updateLighting(this);
            if (typeof opts === 'boolean')
                opts = { force: opts };
            const mixer = new GW.sprite.Mixer();
            for (let x = 0; x < canvas.width; ++x) {
                for (let y = 0; y < canvas.height; ++y) {
                    const cell = this.cell(x, y);
                    if (cell.needsRedraw || opts.force) {
                        getCellAppearance(this, x, y, mixer);
                        const glyph = typeof mixer.ch === 'number'
                            ? mixer.ch
                            : canvas.toGlyph(mixer.ch);
                        canvas.draw(x, y, glyph, mixer.fg.toInt(), mixer.bg.toInt());
                        cell.needsRedraw = false;
                    }
                }
            }
        }
        revealAll() {
            this.forEach((c) => {
                c.markRevealed();
                c.storeMemory();
            });
            if (GW.data.player) {
                GW.data.player.invalidateCostMap();
            }
        }
        markRevealed(x, y) {
            if (!this.cell(x, y).markRevealed())
                return;
            if (GW.data.player) {
                GW.data.player.invalidateCostMap();
            }
        }
        makeVisible(v = true) {
            if (v) {
                this.setFlags(0, Cell.VISIBLE);
            }
            else {
                this.clearFlags(0, Cell.ANY_KIND_OF_VISIBLE);
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
        isRevealed(x, y) {
            return this.cell(x, y).isRevealed();
        }
        get anyLightChanged() {
            return (this.flags & Map.MAP_STABLE_LIGHTS) == 0;
        }
        set anyLightChanged(v) {
            if (v) {
                this.flags &= ~Map.MAP_STABLE_LIGHTS;
            }
            else {
                this.flags |= Map.MAP_STABLE_LIGHTS;
            }
        }
        get ambientLightChanged() {
            return this.staticLightChanged;
        }
        set ambientLightChanged(v) {
            this.staticLightChanged = v;
        }
        get staticLightChanged() {
            return (this.flags & Map.MAP_STABLE_GLOW_LIGHTS) == 0;
        }
        set staticLightChanged(v) {
            if (v) {
                this.flags &= ~(Map.MAP_STABLE_GLOW_LIGHTS | Map.MAP_STABLE_LIGHTS);
            }
            else {
                this.flags |= Map.MAP_STABLE_GLOW_LIGHTS;
            }
        }
        setFlag(flag) {
            this.flags |= flag;
            this.changed = true;
        }
        setFlags(mapFlag = 0, cellFlag = 0, cellMechFlag = 0) {
            if (mapFlag) {
                this.flags |= mapFlag;
            }
            if (cellFlag || cellMechFlag) {
                this.forEach((c) => c.setFlags(cellFlag, cellMechFlag));
            }
            this.changed = true;
        }
        clearFlag(flag) {
            this.flags &= ~flag;
            this.changed = true;
        }
        clearFlags(mapFlag = 0, cellFlag = 0, cellMechFlag = 0) {
            if (mapFlag) {
                this.flags &= ~mapFlag;
            }
            if (cellFlag || cellMechFlag) {
                this.forEach((cell) => cell.clearFlags(cellFlag, cellMechFlag));
            }
            this.changed = true;
        }
        // setCellFlag(x: number, y: number, flag: number) {
        //   this.cell(x, y).flags |= flag;
        // }
        setCellFlags(x, y, cellFlag = 0, cellMechFlag = 0) {
            this.cell(x, y).setFlags(cellFlag, cellMechFlag);
            this.flags |= Map.MAP_CHANGED;
        }
        clearCellFlags(x, y, cellFlags = 0, cellMechFlags = 0) {
            this.cell(x, y).clearFlags(cellFlags, cellMechFlags);
            this.changed = true;
        }
        hasTile(x, y, tile) {
            return this.cells[x][y].hasTile(tile);
        }
        layerFlags(x, y, limitToPlayerKnowledge = false) {
            return this.cells[x][y].layerFlags(limitToPlayerKnowledge);
        }
        tileFlags(x, y, limitToPlayerKnowledge = false) {
            return this.cells[x][y].tileFlags(limitToPlayerKnowledge);
        }
        tileMechFlags(x, y, limitToPlayerKnowledge = false) {
            return this.cells[x][y].tileMechFlags(limitToPlayerKnowledge);
        }
        tileWithLayerFlag(x, y, mechFlag = 0) {
            return this.cells[x][y].tileWithLayerFlag(mechFlag);
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
        // discoveredTileFlags(x: number, y: number) {
        //   return this.cells[x][y].discoveredTileFlags();
        // }
        // hasDiscoveredTileFlag(x: number, y: number, flag = 0) {
        //   return this.cells[x][y].hasDiscoveredTileFlag(flag);
        // }
        isClear(x, y) {
            return this.cells[x][y].isClear();
        }
        isEmpty(x, y) {
            return this.cells[x][y].isEmpty();
        }
        isObstruction(x, y, limitToPlayerKnowledge = false) {
            return this.cells[x][y].isObstruction(limitToPlayerKnowledge);
        }
        isDoorway(x, y, limitToPlayerKnowledge = false) {
            return this.cells[x][y].isDoorway(limitToPlayerKnowledge);
        }
        isSecretDoorway(x, y, limitToPlayerKnowledge = false) {
            return this.cells[x][y].isSecretDoorway(limitToPlayerKnowledge);
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
        isMoveableNow(x, y, limitToPlayerKnowledge = false) {
            return this.cells[x][y].isMoveableNow(limitToPlayerKnowledge);
        }
        isWalkableNow(x, y, limitToPlayerKnowledge = false) {
            return this.cells[x][y].isWalkableNow(limitToPlayerKnowledge);
        }
        canBeWalked(x, y, limitToPlayerKnowledge = false) {
            return this.cells[x][y].canBeWalked(limitToPlayerKnowledge);
        }
        topmostTile(x, y, skipGas = false) {
            return this.cells[x][y].topmostTile(skipGas);
        }
        tileFlavor(x, y) {
            return this.cells[x][y].tileFlavor();
        }
        setTile(x, y, tileId, volume = 0) {
            return this.cell(x, y).setTile(tileId, volume, this);
        }
        nullifyCell(x, y) {
            this.cell(x, y).nullify();
        }
        clearCell(x, y) {
            this.cell(x, y).clear();
        }
        clearCellLayers(x, y, layers = -1) {
            return this.cell(x, y).clearLayers(layers);
        }
        clearCellLayersWithFlags(x, y, tileFlags, tileMechFlags = 0) {
            const cell = this.cell(x, y);
            cell.clearLayersWithFlags(tileFlags, tileMechFlags);
        }
        // clearCellLayers(
        //     x: number,
        //     y: number,
        //     nullLiquid = true,
        //     nullSurface = true,
        //     nullGas = true
        // ) {
        //     this.changed = true;
        //     return this.cell(x, y).clearLayers(nullLiquid, nullSurface, nullGas);
        // }
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
        walkableArcCount(x, y) {
            if (!this.hasXY(x, y))
                return -1;
            return this.cells.arcCount(x, y, (c) => c.isWalkableNow());
        }
        diagonalBlocked(x1, y1, x2, y2, limitToPlayerKnowledge = false) {
            if (x1 == x2 || y1 == y2) {
                return false; // If it's not a diagonal, it's not diagonally blocked.
            }
            if (this.isObstruction(x1, y2, limitToPlayerKnowledge)) {
                return true;
            }
            if (this.isObstruction(x2, y1, limitToPlayerKnowledge)) {
                return true;
            }
            return false;
        }
        fillCostGrid(costGrid, costFn) {
            costFn =
                costFn ||
                    ((c) => (c.isWalkableNow() ? 1 : GW.path.OBSTRUCTION));
            this.cells.forEach((cell, i, j) => {
                if (cell.isNull()) {
                    costGrid[i][j] = GW.path.OBSTRUCTION;
                }
                else {
                    costGrid[i][j] = costFn(cell, i, j, this);
                }
            });
        }
        matchingNeighbor(x, y, matcher, only4dirs = false) {
            const maxIndex = only4dirs ? 4 : 8;
            for (let d = 0; d < maxIndex; ++d) {
                const dir = GW.utils.DIRS[d];
                const i = x + dir[0];
                const j = y + dir[1];
                if (this.hasXY(i, j)) {
                    if (matcher(this.cells[i][j], i, j, this))
                        return [i, j];
                }
            }
            return [-1, -1];
        }
        matchingLocNear(x, y, ...args) {
            let i, j, k;
            let matcher = args[0];
            let opts = args[1] || {};
            const arg = args[0];
            if (typeof arg === 'string') {
                matcher = (c) => c.hasTile(arg);
            }
            if (typeof matcher !== 'function') {
                opts = matcher || opts;
                matcher = opts.match || GW.utils.TRUE;
            }
            const hallwaysAllowed = opts.hallways !== false;
            const blockingMap = opts.blockingMap || null;
            const forbidLiquid = opts.liquids === false;
            const deterministic = opts.deterministic || false;
            let candidateLocs = [];
            let closestDist = (this.width + this.height) * 10;
            // count up the number of candidate locations
            for (k = 0; k < Math.max(this.width, this.height) && !candidateLocs.length; k++) {
                for (i = x - k; i <= x + k; i++) {
                    for (j = y - k; j <= y + k; j++) {
                        if (!this.hasXY(i, j))
                            continue;
                        const cell = this.cell(i, j);
                        const dist = Math.floor(10 * GW.utils.distanceBetween(x, y, i, j));
                        // if ((i == x-k || i == x+k || j == y-k || j == y+k)
                        if (Math.floor(dist) == k * 10 &&
                            (!blockingMap || !blockingMap[i][j]) &&
                            matcher(cell, i, j, this) &&
                            (!forbidLiquid || !cell.liquid) &&
                            (hallwaysAllowed || this.walkableArcCount(i, j) < 2)) {
                            if (dist < closestDist) {
                                candidateLocs = [[i, j]];
                                closestDist = dist;
                            }
                            else if (dist == closestDist) {
                                candidateLocs.push([i, j]);
                            }
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
                randIndex = GW.random.number(candidateLocs.length);
            }
            return candidateLocs[randIndex];
        }
        randomMatchingLoc(opts = {}) {
            let x;
            let y;
            let cell;
            if (typeof opts === 'function') {
                opts = { match: opts };
            }
            const sequence = GW.random.sequence(this.width * this.height);
            const hallwaysAllowed = opts.hallways || false;
            const blockingMap = opts.blockingMap || null;
            const forbidLiquid = opts.liquids === false;
            const matcher = opts.match || GW.utils.TRUE;
            const forbidCellFlags = opts.forbidCellFlags || 0;
            const forbidTileFlags = opts.forbidTileFlags || 0;
            const forbidTileMechFlags = opts.forbidTileMechFlags || 0;
            const tile = opts.tile || null;
            let success = false;
            let index = 0;
            while (!success && index < sequence.length) {
                const v = sequence[index];
                x = v % this.width;
                y = Math.floor(v / this.width);
                cell = this.cell(x, y);
                if ((!blockingMap || !blockingMap[x][y]) &&
                    (!tile || cell.hasTile(tile)) &&
                    (!forbidLiquid || !cell.liquid) &&
                    (!forbidCellFlags || !(cell.flags & forbidCellFlags)) &&
                    (!forbidTileFlags || !cell.hasTileFlag(forbidTileFlags)) &&
                    (!forbidTileMechFlags ||
                        !cell.hasTileMechFlag(forbidTileMechFlags)) &&
                    (hallwaysAllowed || this.walkableArcCount(x, y) < 2) &&
                    matcher(cell, x, y, this)) {
                    success = true;
                }
                ++index;
            }
            if (!success) {
                // map.debug('randomMatchingLocation', dungeonType, liquidType, terrainType, ' => FAIL');
                return [-1, -1];
            }
            // map.debug('randomMatchingLocation', dungeonType, liquidType, terrainType, ' => ', x, y);
            return [x, y];
        }
        // LIGHT
        hasVisibleLight(x, y) {
            return this.cell(x, y).hasVisibleLight();
        }
        addStaticLight(x, y, light) {
            const info = { x, y, light, next: this.lights };
            this.lights = info;
            this.staticLightChanged = true;
            return info;
        }
        removeStaticLight(x, y, light) {
            let prev = this.lights;
            if (!prev)
                return;
            function matches(info) {
                if (info.x != x || info.y != y)
                    return false;
                return !light || light === info.light;
            }
            this.staticLightChanged = true;
            while (prev && matches(prev)) {
                prev = this.lights = prev.next;
            }
            if (!prev)
                return;
            let current = prev.next;
            while (current) {
                if (matches(current)) {
                    prev.next = current.next;
                }
                else {
                    prev = current;
                }
                current = current.next;
            }
        }
        eachStaticLight(fn) {
            GW.utils.eachChain(this.lights, (info) => fn(info.light, info.x, info.y));
            this.eachCell((cell, x, y) => {
                for (let tile of cell.tiles()) {
                    if (tile.light) {
                        fn(tile.light, x, y);
                    }
                }
            });
        }
        eachDynamicLight(fn) {
            GW.utils.eachChain(this._actors, (actor) => {
                if (actor.light)
                    fn(actor.light, actor.x, actor.y);
            });
        }
        // Layers
        addFx(x, y, anim) {
            if (!this.hasXY(x, y))
                return false;
            const cell = this.cell(x, y);
            cell.addLayer(anim);
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
            oldCell.removeLayer(anim);
            this.redrawCell(oldCell);
            cell.addLayer(anim);
            this.redrawCell(cell);
            anim.x = x;
            anim.y = y;
            return true;
        }
        removeFx(anim) {
            const oldCell = this.cell(anim.x, anim.y);
            oldCell.removeLayer(anim);
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
            cell.actor = theActor; // adjusts the layer
            theActor.next = this._actors;
            this._actors = theActor;
            const flag = theActor === GW.data.player
                ? Cell.HAS_PLAYER
                : Cell.HAS_ANY_ACTOR;
            cell.flags |= flag;
            // if (theActor.flags & Flags.Actor.MK_DETECTED)
            // {
            // 	cell.flags |= CellFlags.MONSTER_DETECTED;
            // }
            if (theActor.light) {
                this.anyLightChanged = true;
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
                return !theActor.avoidsCell(cell);
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
                this.anyLightChanged = true;
            }
            return true;
        }
        removeActor(actor) {
            if (!this.hasXY(actor.x, actor.y))
                return false;
            const cell = this.cell(actor.x, actor.y);
            if (cell.actor === actor) {
                cell.actor = null;
                GW.utils.removeFromChain(this, 'actors', actor);
                if (actor.light) {
                    this.anyLightChanged = true;
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
            if (cell.item) {
                // GW.ui.message(colors.badMessageColor, 'There is already an item there.');
                return false;
            }
            theItem.x = x;
            theItem.y = y;
            cell.item = theItem; // adjusts the layers
            theItem.next = this._items;
            this._items = theItem;
            if (theItem.light) {
                this.anyLightChanged = true;
            }
            this.redrawCell(cell);
            if (theItem.isDetected() || GW.config.D_ITEM_OMNISCIENCE) {
                cell.flags |= Cell.ITEM_DETECTED;
            }
            return true;
        }
        addItemNear(x, y, theItem) {
            const loc = this.matchingLocNear(x, y, (cell) => {
                return !theItem.forbidsCell(cell);
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
            cell.item = null;
            GW.utils.removeFromChain(this, 'items', theItem);
            if (theItem.light) {
                this.anyLightChanged = true;
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
        gridDisruptsWalkability(blockingGrid, opts = {}) {
            const walkableGrid = GW.grid.alloc(this.width, this.height);
            let disrupts = false;
            const gridOffsetX = opts.gridOffsetX || 0;
            const gridOffsetY = opts.gridOffsetY || 0;
            const bounds = opts.bounds || null; // TODO - Where is this used ???
            // Get all walkable locations after lake added
            this.cells.forEach((cell, i, j) => {
                if (bounds && !bounds.contains(i, j))
                    return; // outside bounds
                const blockingX = i + gridOffsetX;
                const blockingY = j + gridOffsetY;
                if (cell.isNull()) {
                    return; // not walkable
                }
                else if (cell.hasTileFlag(Tile.T_HAS_STAIRS)) {
                    if (blockingGrid.get(blockingX, blockingY)) {
                        disrupts = true;
                    }
                    else {
                        walkableGrid[i][j] = 1;
                    }
                }
                else if (cell.canBeWalked()) {
                    if (blockingGrid.get(blockingX, blockingY))
                        return;
                    walkableGrid[i][j] = 1;
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
            GW.grid.free(walkableGrid);
            return disrupts;
        }
        // FOV
        // Returns a boolean grid indicating whether each square is in the field of view of (xLoc, yLoc).
        // forbiddenTileFlags is the set of terrain flags that will block vision (but the blocking cell itself is
        // illuminated); forbiddenCellFlags is the set of map flags that will block vision.
        // If cautiousOnWalls is set, we will not illuminate blocking tiles unless the tile one space closer to the origin
        // is visible to the player; this is to prevent lights from illuminating a wall when the player is on the other
        // side of the wall.
        calcFov(grid, x, y, maxRadius, forbiddenCellFlags = 0, forbiddenLayerFlags = Entity.L_BLOCKS_VISION) {
            maxRadius = maxRadius || this.width + this.height;
            grid.fill(0);
            const map = this;
            const FOV = new GW.fov.FOV({
                isBlocked(i, j) {
                    return !!(!grid.hasXY(i, j) ||
                        map.hasCellFlag(i, j, forbiddenCellFlags) ||
                        map.hasLayerFlag(i, j, forbiddenLayerFlags));
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
            if (GW.utils.equalsXY(a, b))
                return true;
            const line = GW.utils.getLine(a.x, a.y, b.x, b.y);
            if (!line.length)
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
                        cell.storeMemory();
                    }
                    // cell.flags &= CellFlags.PERMANENT_CELL_FLAGS;
                    // cell.mechFlags &= CellMechFlags.PERMANENT_MECH_FLAGS;
                }
            }
        }
        // TICK
        async activateCell(x, y, event) {
            const cell = this.cell(x, y);
            return await cell.activate(event, this, x, y, { cell });
        }
        async activateAll(event) {
            return fireAll(this, event);
        }
        async tick() {
            await fireAll(this, 'tick');
            // Bookkeeping for fire, pressure plates and key-activated tiles.
            await this.forEachAsync(async (cell$1, x, y) => {
                cell$1.mechFlags &= ~CellMech.CAUGHT_FIRE_THIS_TURN;
                if (!(cell$1.flags &
                    (Cell.HAS_ANY_ACTOR | Cell.HAS_ITEM)) &&
                    cell$1.mechFlags & CellMech.PRESSURE_PLATE_DEPRESSED) {
                    cell$1.mechFlags &= ~CellMech.PRESSURE_PLATE_DEPRESSED;
                }
                if (cell$1.activatesOn('noKey') && !cell$1.hasKey()) {
                    await cell$1.activate('noKey', this, x, y);
                }
            });
            // now spread the fire...
            await this.forEachAsync(async (cell, x, y) => {
                if (cell.hasTileFlag(Tile.T_IS_FIRE) &&
                    !(cell.mechFlags & CellMech.CAUGHT_FIRE_THIS_TURN)) {
                    await this.exposeToFire(x, y, false);
                    await this.eachNeighborAsync(x, y, (_n, i, j) => this.exposeToFire(i, j), true);
                }
            });
            if (!(this.flags & Map.MAP_NO_LIQUID)) {
                const newVolume = GW.grid.alloc(this.width, this.height);
                const calc = calcBaseVolume(this, Layer.LIQUID, newVolume);
                if (calc === CalcType.CALC) {
                    this.updateLiquid(newVolume);
                }
                if (calc != CalcType.NONE) {
                    updateVolume(this, Layer.LIQUID, newVolume);
                    this.flags &= ~Map.MAP_NO_LIQUID;
                }
                else {
                    this.flags |= Map.MAP_NO_LIQUID;
                }
                this.changed = true;
                GW.grid.free(newVolume);
            }
            if (!(this.flags & Map.MAP_NO_GAS)) {
                const newVolume = GW.grid.alloc(this.width, this.height);
                const calc = calcBaseVolume(this, Layer.GAS, newVolume);
                if (calc === CalcType.CALC) {
                    this.updateGas(newVolume);
                }
                if (calc != CalcType.NONE) {
                    updateVolume(this, Layer.GAS, newVolume);
                    this.flags &= ~Map.MAP_NO_GAS;
                }
                else {
                    this.flags |= Map.MAP_NO_GAS;
                }
                this.changed = true;
                GW.grid.free(newVolume);
            }
        }
        async exposeToFire(x, y, alwaysIgnite = false) {
            let ignitionChance = 0, bestExtinguishingPriority = 0, explosiveNeighborCount = 0;
            let fireIgnited = false, explosivePromotion = false;
            const cell = this.cell(x, y);
            if (!cell.hasTileFlag(Tile.T_IS_FLAMMABLE)) {
                return false;
            }
            // Pick the extinguishing layer with the best priority.
            for (let tile of cell.tiles()) {
                if (tile.flags.tile & Tile.T_EXTINGUISHES_FIRE &&
                    tile.priority > bestExtinguishingPriority) {
                    bestExtinguishingPriority = tile.priority;
                }
            }
            // Pick the fire type of the most flammable layer that is either gas or equal-or-better priority than the best extinguishing layer.
            for (let tile of cell.tiles()) {
                if (tile.flags.tile & Tile.T_IS_FLAMMABLE &&
                    (tile.layer === Layer.GAS ||
                        tile.priority >= bestExtinguishingPriority)) {
                    const effect = GW.effect.from(tile.activates.fire);
                    if (effect && effect.chance > ignitionChance) {
                        ignitionChance = effect.chance;
                    }
                }
            }
            if (alwaysIgnite ||
                (ignitionChance && GW.random.chance(ignitionChance, 10000))) {
                // If it ignites...
                fireIgnited = true;
                // Count explosive neighbors.
                if (cell.hasTileMechFlag(TileMech.TM_EXPLOSIVE_PROMOTE)) {
                    this.eachNeighbor(x, y, (n) => {
                        if (n.hasLayerFlag(Entity.L_BLOCKS_GAS) ||
                            n.hasTileFlag(Tile.T_IS_FIRE) ||
                            n.hasTileMechFlag(TileMech.TM_EXPLOSIVE_PROMOTE)) {
                            ++explosiveNeighborCount;
                        }
                    });
                    if (explosiveNeighborCount >= 8) {
                        explosivePromotion = true;
                    }
                }
                let event = 'fire';
                if (explosivePromotion && cell.activatesOn('explode')) {
                    event = 'explode';
                }
                for (let tile of cell.tiles()) {
                    if (tile.flags.tile & Tile.T_IS_FLAMMABLE) {
                        if (tile.layer === Layer.GAS) {
                            cell.gasVolume = 0;
                        }
                        else if (tile.layer === Layer.LIQUID) {
                            cell.liquidVolume = 0;
                        }
                    }
                }
                await cell.activate(event, this, x, y, {
                    force: true,
                });
                this.redrawCell(cell);
            }
            return fireIgnited;
        }
        updateLiquid(newVolume) {
            this.randomEach((c, x, y) => {
                if (c.hasLayerFlag(Entity.L_BLOCKS_LIQUID))
                    return;
                let highVol = 0;
                let highX = -1;
                let highY = -1;
                let highTile = c.liquidTile;
                let myVol = newVolume[x][y];
                newVolume.eachNeighbor(x, y, (v, i, j) => {
                    if (v <= myVol)
                        return;
                    if (v <= highVol)
                        return;
                    highVol = v;
                    highX = i;
                    highY = j;
                    highTile = this.cell(i, j).liquidTile;
                });
                if (highVol > 1) {
                    // guaranteed => myVol < highVol
                    this.setTile(x, y, highTile, 0); // place tile with 0 volume - will force liquid to be same as highest volume liquid neighbor
                    const amt = Math.floor((highVol - myVol) / 9) + 1;
                    newVolume[x][y] += amt;
                    newVolume[highX][highY] -= amt;
                }
            });
            // }
        }
        updateGas(newVolume) {
            const dirs = GW.random.sequence(4).map((i) => GW.utils.DIRS[i]);
            const grid = GW.grid.alloc(this.width, this.height);
            // push out from my square
            newVolume.forEach((v, x, y) => {
                if (!v)
                    return;
                let adj = v;
                if (v > 1) {
                    let count = 1;
                    newVolume.eachNeighbor(x, y, () => {
                        ++count;
                    }, true); // only 4 dirs
                    let avg = Math.floor(v / count);
                    let rem = v - avg * count;
                    grid[x][y] += avg;
                    if (rem > 0) {
                        grid[x][y] += 1;
                        rem -= 1;
                    }
                    for (let i = 0; i < dirs.length; ++i) {
                        const dir = dirs[i];
                        const x2 = x + dir[0];
                        const y2 = y + dir[1];
                        if (grid.hasXY(x2, y2)) {
                            adj = avg;
                            if (rem > 0) {
                                --rem;
                                ++adj;
                            }
                            grid[x2][y2] += adj;
                        }
                    }
                }
                else {
                    grid[x][y] += v;
                }
            });
            newVolume.copy(grid);
            GW.grid.free(grid);
            // newVolume.dump();
        }
        resetCellEvents() {
            this.forEach((c) => (c.mechFlags &= ~(CellMech.EVENT_FIRED_THIS_TURN |
                CellMech.EVENT_PROTECTED)));
        }
    }
    function make$4(w, h, opts = {}, wall) {
        if (typeof opts === 'string') {
            opts = { tile: opts };
            if (wall) {
                opts.wall = wall;
            }
        }
        const map = new Map$1(w, h, opts);
        let floor = opts.tile || opts.floor || opts.floorTile;
        if (floor === true) {
            floor = 'FLOOR';
        }
        let boundary = opts.boundary || opts.wall || opts.wallTile;
        if (boundary === true) {
            boundary = 'WALL';
        }
        if (floor) {
            map.fill(floor, boundary);
        }
        if (opts.visible || opts.revealed) {
            map.makeVisible();
            map.revealAll();
        }
        if (opts.revealed && !opts.visible) {
            map.makeVisible(false);
        }
        if (!GW.data.map) {
            GW.data.map = map;
        }
        return map;
    }
    GW.make.map = make$4;
    function isString(value) {
        return typeof value === 'string';
    }
    function isStringArray(value) {
        return Array.isArray(value) && typeof value[0] === 'string';
    }
    function from$1(prefab, charToTile, opts = {}) {
        let height = 0;
        let width = 0;
        let map;
        if (isString(prefab)) {
            prefab = prefab.split('\n');
        }
        if (isStringArray(prefab)) {
            height = prefab.length;
            width = prefab.reduce((len, line) => Math.max(len, line.length), 0);
            map = make$4(width, height, opts);
            prefab.forEach((line, y) => {
                for (let x = 0; x < width; ++x) {
                    const ch = line[x] || '.';
                    const tile = charToTile[ch] || 'FLOOR';
                    map.setTile(x, y, tile);
                }
            });
        }
        else {
            height = prefab.height;
            width = prefab.width;
            map = make$4(width, height, opts);
            prefab.forEach((v, x, y) => {
                const tile = charToTile[v] || 'FLOOR';
                map.setTile(x, y, tile);
            });
        }
        // redo this because we changed the tiles
        if (opts.visible || opts.revealed) {
            map.makeVisible();
            map.revealAll();
        }
        if (opts.revealed && !opts.visible) {
            map.makeVisible(false);
        }
        return map;
    }
    if (!GW.colors.cursor) {
        GW.color.install('cursor', GW.colors.yellow);
    }
    if (!GW.colors.path) {
        GW.color.install('path', GW.colors.gold);
    }
    function getCellAppearance(map, x, y, dest) {
        dest.blackOut();
        if (!map.hasXY(x, y))
            return;
        const cell$1 = map.cell(x, y);
        if (cell$1.isAnyKindOfVisible() &&
            cell$1.flags & (Cell.CELL_CHANGED | Cell.NEEDS_REDRAW)) {
            getAppearance(cell$1, dest);
        }
        else {
            // if (cell.isRevealed()) {
            dest.drawSprite(cell$1.memory.mixer);
        }
        if (cell$1.isVisible()) ;
        else if (!cell$1.isRevealed()) {
            if (!cell$1.isAnyKindOfVisible())
                dest.blackOut();
        }
        else if (!cell$1.isAnyKindOfVisible()) {
            dest.bg.mix(GW.colors.black, 30);
            dest.fg.mix(GW.colors.black, 30);
        }
        let needDistinctness = false;
        if (cell$1.flags & (Cell.IS_CURSOR | Cell.IS_IN_PATH)) {
            const highlight = cell$1.flags & Cell.IS_CURSOR ? GW.colors.cursor : GW.colors.path;
            if (cell$1.hasLayerFlag(Entity.L_INVERT_WHEN_HIGHLIGHTED)) {
                GW.color.swap(dest.fg, dest.bg);
            }
            else {
                // if (!GAME.trueColorMode || !dest.needDistinctness) {
                // dest.fg.mix(highlight, CONFIG.cursorPathIntensity || 20);
                // }
                dest.bg.mix(highlight, GW.config.cursorPathIntensity || 20);
            }
            needDistinctness = true;
        }
        if (needDistinctness) {
            GW.color.separate(dest.fg, dest.bg);
        }
        if (dest.dances) {
            map.flags |= Map.MAP_DANCES;
        }
        // dest.bake();
    }
    function addText(map, x, y, text, fg, bg, layer) {
        for (let ch of text) {
            const sprite = make$1({
                ch,
                fg,
                bg,
                layer: layer || Layer.GROUND,
                priority: 200,
            }); // on top of ground tiles
            const cell = map.cell(x++, y);
            cell.addLayer(sprite);
        }
    }
    var CalcType;
    (function (CalcType) {
        CalcType[CalcType["NONE"] = 0] = "NONE";
        CalcType[CalcType["UPDATE"] = 1] = "UPDATE";
        CalcType[CalcType["CALC"] = 2] = "CALC";
    })(CalcType || (CalcType = {}));
    function calcBaseVolume(map, depth, newVolume) {
        let hasVolume = false;
        let needsAjustment = false;
        map.forEach((c, x, y) => {
            let volume = c.volume(depth);
            const tile$1 = c.tile(depth);
            if (volume && tile$1.dissipate) {
                if (tile$1.dissipate > 10000) {
                    volume -= Math.floor(tile$1.dissipate / 10000);
                    if (GW.random.chance(tile$1.dissipate % 10000, 10000)) {
                        volume -= 1;
                    }
                }
                else if (GW.random.chance(tile$1.dissipate, 10000)) {
                    volume -= 1;
                }
            }
            if (volume > 0) {
                newVolume[x][y] = volume;
                hasVolume = true;
                if (volume > 1) {
                    needsAjustment = true;
                }
            }
            else if (tile$1 !== tiles.NULL) {
                c.clearLayer(depth);
                map.redrawCell(c);
            }
        });
        if (needsAjustment)
            return CalcType.CALC;
        if (hasVolume)
            return CalcType.UPDATE;
        return CalcType.NONE;
    }
    function updateVolume(map, depth, newVolume) {
        newVolume.forEach((v, i, j) => {
            const cell = map.cell(i, j);
            const current = cell.volume(depth);
            const tile$1 = cell.tile(depth);
            if (v > 0) {
                // hasLiquid = true;
                if (current !== v || !tile$1) {
                    let highVol = current;
                    let highTile = tile$1;
                    map.eachNeighbor(i, j, (n) => {
                        if (n.volume(depth) > highVol) {
                            highVol = n.volume(depth);
                            highTile = n.tile(depth);
                        }
                    });
                    if (highTile !== tile$1) {
                        cell.setTile(highTile, 0, map);
                    }
                    cell.setVolume(depth, v);
                    map.redrawCell(cell);
                }
            }
            else if (current || tile$1 !== tiles.NULL) {
                cell.clearLayer(depth);
                map.redrawCell(cell);
            }
        });
    }

    var map = {
        __proto__: null,
        get Flags () { return Map; },
        Map: Map$1,
        make: make$4,
        from: from$1,
        getCellAppearance: getCellAppearance,
        addText: addText,
        analyze: analyze,
        updateChokepoints: updateChokepoints,
        floodFillCount: floodFillCount,
        updateLoopiness: updateLoopiness,
        resetLoopiness: resetLoopiness,
        checkLoopiness: checkLoopiness,
        fillInnerLoopGrid: fillInnerLoopGrid,
        cleanLoopiness: cleanLoopiness
    };

    // These are the minimal set of tiles to make the diggers work
    install$1('NULL', {
        ch: '\u2205',
        fg: 'white',
        bg: 'black',
        flags: 'L_BLOCKS_MOVE',
        name: 'eerie nothingness',
        article: 'an',
        priority: 0,
    });
    install$1('FLOOR', {
        ch: '\u00b7',
        fg: [30, 30, 30, 20, 0, 0, 0],
        bg: [2, 2, 10, 0, 2, 2, 0],
        priority: 10,
        article: 'the',
    });
    install$1('DOOR', {
        ch: '+',
        fg: [100, 40, 40],
        bg: [30, 60, 60],
        priority: 30,
        flags: 'T_IS_DOOR, L_BLOCKS_EFFECTS, L_BLOCKS_ITEMS, L_BLOCKS_VISION, L_VISUALLY_DISTINCT',
        article: 'a',
        activates: {
            enter: { tile: 'DOOR_OPEN' },
            open: { tile: 'DOOR_OPEN_ALWAYS' },
        },
    });
    install$1('DOOR_OPEN', 'DOOR', {
        ch: "'",
        fg: [100, 40, 40],
        bg: [30, 60, 60],
        priority: 40,
        flags: '!L_BLOCKS_ITEMS, !L_BLOCKS_VISION',
        name: 'open door',
        article: 'an',
        activates: {
            tick: {
                chance: 100 * 100,
                tile: 'DOOR',
                flags: 'E_SUPERPRIORITY, E_ONLY_IF_EMPTY',
            },
            enter: null,
            open: null,
            close: { tile: 'DOOR', flags: 'E_SUPERPRIORITY, E_ONLY_IF_EMPTY' },
        },
    });
    install$1('DOOR_OPEN_ALWAYS', 'DOOR_OPEN', {
        activates: {
            tick: null,
            close: { tile: 'DOOR', flags: 'E_SUPERPRIORITY, E_ONLY_IF_EMPTY' },
        },
    });
    install$1('UP_STAIRS', {
        ch: '<',
        fg: [100, 50, 50],
        bg: [40, 20, 20],
        priority: 200,
        flags: 'T_UP_STAIRS, L_BLOCKED_BY_STAIRS, L_VISUALLY_DISTINCT, L_LIST_IN_SIDEBAR',
        name: 'upward staircase',
        article: 'an',
        activates: {
            player: { emit: 'UP_STAIRS' },
        },
    });
    install$1('DOWN_STAIRS', {
        ch: '>',
        fg: [100, 50, 50],
        bg: [40, 20, 20],
        priority: 200,
        flags: 'T_DOWN_STAIRS, L_BLOCKED_BY_STAIRS, L_VISUALLY_DISTINCT, L_LIST_IN_SIDEBAR',
        name: 'downward staircase',
        article: 'a',
        activates: {
            player: { emit: 'DOWN_STAIRS' },
        },
    });
    install$1('WALL', {
        ch: '#',
        fg: [7, 7, 7, 0, 3, 3, 3],
        bg: [40, 40, 40, 10, 10, 0, 5],
        priority: 100,
        flags: 'L_BLOCKS_EVERYTHING',
        article: 'a',
        name: 'stone wall',
        desc: 'A wall made from rough cut stone.',
        flavor: 'a rough stone wall',
    });
    install$1('LAKE', {
        ch: '~',
        fg: [5, 8, 20, 10, 0, 4, 15, true],
        bg: [10, 15, 41, 6, 5, 5, 5, true],
        priority: 50,
        flags: 'T_DEEP_WATER',
        name: 'deep water',
        article: 'the',
    });
    install$1('SHALLOW', {
        ch: '\u00b7',
        fg: [5, 8, 10, 10, 0, 4, 15, true],
        bg: [10, 15, 31, 6, 5, 5, 5, true],
        priority: 20,
        name: 'shallow water',
        article: 'the',
    });
    install$1('BRIDGE', {
        ch: '=',
        fg: [100, 40, 40],
        priority: 40,
        layer: 'SURFACE',
        flags: 'T_BRIDGE, L_VISUALLY_DISTINCT',
        article: 'a',
        ground: 'LAKE',
    });

    exports.cell = cell;
    exports.entity = entity;
    exports.light = light;
    exports.lights = lights;
    exports.map = map;
    exports.tile = tile;
    exports.tiles = tiles;
    exports.visibility = visibility;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=gw-map.js.map
