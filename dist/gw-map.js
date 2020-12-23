(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('gw-utils')) :
    typeof define === 'function' && define.amd ? define(['exports', 'gw-utils'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.GW = global.GW || {}, global.GW));
}(this, (function (exports, gwUtils) { 'use strict';

    var Layer;
    (function (Layer) {
        Layer[Layer["GROUND"] = 0] = "GROUND";
        Layer[Layer["SURFACE"] = 1] = "SURFACE";
        Layer[Layer["LIQUID"] = 2] = "LIQUID";
        Layer[Layer["GAS"] = 3] = "GAS";
        Layer[Layer["ITEM"] = 4] = "ITEM";
        Layer[Layer["ACTOR"] = 5] = "ACTOR";
        Layer[Layer["PLAYER"] = 6] = "PLAYER";
        Layer[Layer["FX"] = 7] = "FX";
        Layer[Layer["UI"] = 8] = "UI";
    })(Layer || (Layer = {}));
    const Fl = gwUtils.flag.fl;
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
        Tile[Tile["T_OBSTRUCTS_PASSABILITY"] = Fl(0)] = "T_OBSTRUCTS_PASSABILITY";
        Tile[Tile["T_OBSTRUCTS_VISION"] = Fl(1)] = "T_OBSTRUCTS_VISION";
        Tile[Tile["T_OBSTRUCTS_ITEMS"] = Fl(2)] = "T_OBSTRUCTS_ITEMS";
        Tile[Tile["T_OBSTRUCTS_SURFACE"] = Fl(3)] = "T_OBSTRUCTS_SURFACE";
        Tile[Tile["T_OBSTRUCTS_GAS"] = Fl(4)] = "T_OBSTRUCTS_GAS";
        Tile[Tile["T_OBSTRUCTS_LIQUID"] = Fl(5)] = "T_OBSTRUCTS_LIQUID";
        Tile[Tile["T_OBSTRUCTS_TILE_EFFECTS"] = Fl(6)] = "T_OBSTRUCTS_TILE_EFFECTS";
        Tile[Tile["T_OBSTRUCTS_DIAGONAL_MOVEMENT"] = Fl(7)] = "T_OBSTRUCTS_DIAGONAL_MOVEMENT";
        Tile[Tile["T_GAS"] = Fl(9)] = "T_GAS";
        Tile[Tile["T_BRIDGE"] = Fl(10)] = "T_BRIDGE";
        Tile[Tile["T_AUTO_DESCENT"] = Fl(11)] = "T_AUTO_DESCENT";
        Tile[Tile["T_LAVA"] = Fl(12)] = "T_LAVA";
        Tile[Tile["T_DEEP_WATER"] = Fl(13)] = "T_DEEP_WATER";
        Tile[Tile["T_SPONTANEOUSLY_IGNITES"] = Fl(14)] = "T_SPONTANEOUSLY_IGNITES";
        Tile[Tile["T_IS_FLAMMABLE"] = Fl(15)] = "T_IS_FLAMMABLE";
        Tile[Tile["T_IS_FIRE"] = Fl(16)] = "T_IS_FIRE";
        Tile[Tile["T_ENTANGLES"] = Fl(17)] = "T_ENTANGLES";
        Tile[Tile["T_CAUSES_POISON"] = Fl(18)] = "T_CAUSES_POISON";
        Tile[Tile["T_CAUSES_DAMAGE"] = Fl(19)] = "T_CAUSES_DAMAGE";
        Tile[Tile["T_CAUSES_NAUSEA"] = Fl(20)] = "T_CAUSES_NAUSEA";
        Tile[Tile["T_CAUSES_PARALYSIS"] = Fl(21)] = "T_CAUSES_PARALYSIS";
        Tile[Tile["T_CAUSES_CONFUSION"] = Fl(22)] = "T_CAUSES_CONFUSION";
        Tile[Tile["T_CAUSES_HEALING"] = Fl(23)] = "T_CAUSES_HEALING";
        Tile[Tile["T_IS_TRAP"] = Fl(24)] = "T_IS_TRAP";
        Tile[Tile["T_CAUSES_EXPLOSIVE_DAMAGE"] = Fl(25)] = "T_CAUSES_EXPLOSIVE_DAMAGE";
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
        Tile[Tile["T_HARMFUL_TERRAIN"] = Tile.T_CAUSES_POISON |
            Tile.T_IS_FIRE |
            Tile.T_CAUSES_DAMAGE |
            Tile.T_CAUSES_PARALYSIS |
            Tile.T_CAUSES_CONFUSION |
            Tile.T_CAUSES_EXPLOSIVE_DAMAGE] = "T_HARMFUL_TERRAIN";
        Tile[Tile["T_RESPIRATION_IMMUNITIES"] = Tile.T_CAUSES_DAMAGE |
            Tile.T_CAUSES_CONFUSION |
            Tile.T_CAUSES_PARALYSIS |
            Tile.T_CAUSES_NAUSEA] = "T_RESPIRATION_IMMUNITIES";
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
        Cell[Cell["CELL_DEFAULT"] = Cell.VISIBLE | Cell.IN_FOV | Cell.NEEDS_REDRAW | Cell.CELL_CHANGED | Cell.IS_IN_SHADOW] = "CELL_DEFAULT";
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

    // const LIGHT_SMOOTHING_THRESHOLD = 150;       // light components higher than this magnitude will be toned down a little
    const config = (gwUtils.config.light = { INTENSITY_DARK: 20 }); // less than 20% for highest color in rgb
    const LIGHT_COMPONENTS = gwUtils.color.make();
    const lights = {};

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
            this.sprite = {};
            this.activates = {};
            this.light = null; // TODO - Light
            this.flavor = null;
            this.desc = null;
            this.article = null;
            this.dissipate = 2000; // 20 * 100 = 20%
            if (base !== undefined) {
                gwUtils.utils.assignOmitting(["activates"], this, base);
            }
            gwUtils.utils.assignOmitting([
                "Extends",
                "extends",
                "flags",
                "mechFlags",
                "sprite",
                "activates",
                "ch",
                "fg",
                "bg",
                "light",
            ], this, config);
            this.name = config.name || (base ? base.name : config.id);
            this.id = config.id;
            if (this.priority < 0) {
                this.priority = 50;
            }
            if (this.layer !== undefined) {
                if (typeof this.layer === "string") {
                    this.layer = Layer[this.layer];
                }
            }
            this.flags = gwUtils.flag.from(Tile, this.flags, config.flags);
            this.mechFlags = gwUtils.flag.from(TileMech, this.mechFlags, config.mechFlags || config.flags);
            if (config.light) {
                if (typeof config.light === "string") {
                    this.light = lights[config.light] || null;
                }
                else {
                    this.light = config.light;
                }
            }
            if (config.sprite) {
                this.sprite = gwUtils.canvas.makeSprite(config.sprite);
            }
            else if (config.ch || config.fg || config.bg) {
                this.sprite = gwUtils.canvas.makeSprite(config.ch || null, config.fg || null, config.bg || null, config.opacity);
            }
            if (base && base.activates) {
                Object.assign(this.activates, base.activates);
            }
            if (config.activates) {
                Object.entries(config.activates).forEach(([key, info]) => {
                    if (info) {
                        this.activates[key] = info;
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
        hasFlags(flags, mechFlags) {
            return ((!flags || this.flags & flags) &&
                (!mechFlags || this.mechFlags & mechFlags));
        }
        hasMechFlag(flag) {
            return (this.mechFlags & flag) > 0;
        }
        hasEvent(name) {
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
                let color = this.sprite.fg;
                if (typeof color !== "string") {
                    color = gwUtils.color.from(color).toString();
                }
                result = `Ω${color}Ω${this.name}∆`;
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
    const tiles = {};
    function install(...args) {
        let id = args[0];
        let base = args[1];
        let config = args[2];
        if (arguments.length == 1) {
            config = args[0];
            base = config.Extends || config.extends || {};
            id = config.id || config.name;
        }
        else if (arguments.length == 2) {
            config = base;
            base = config.Extends || config.extends || {};
        }
        if (typeof base === "string") {
            base = tiles[base] || gwUtils.utils.ERROR("Unknown base tile: " + base);
        }
        config.name = config.name || id.toLowerCase();
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
    function installAll(config) {
        Object.entries(config).forEach(([id, opts]) => {
            opts.id = id;
            install(id, opts);
        });
    }

    var tile = {
        __proto__: null,
        get Flags () { return Tile; },
        get MechFlags () { return TileMech; },
        get Layer () { return Layer; },
        Tile: Tile$1,
        tiles: tiles,
        install: install,
        installAll: installAll
    };

    exports.tile = tile;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=gw-map.js.map
