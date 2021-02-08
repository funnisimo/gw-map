import { flag as Flag } from 'gw-utils';

export enum Layer {
    ALL_LAYERS = -1,
    GROUND = 0,
    LIQUID,
    SURFACE,
    GAS,
    ITEM,
    ACTOR,
    PLAYER,
    FX,
    UI,
}

const Fl = Flag.fl;

export enum Entity {
    // L_DYNAMIC = Fl(0), // for movable things like actors or items
    L_SUPERPRIORITY = Fl(1), // will overwrite layers at same depth with higher priority
    L_SECRETLY_PASSABLE = Fl(2), // will become passable if discovered/activated/etc...

    L_BLOCKS_MOVE = Fl(3), // cannot be walked through
    L_BLOCKS_VISION = Fl(4), // blocks line of sight
    L_BLOCKS_SURFACE = Fl(6), // grass, blood, etc. cannot exist on this tile
    L_BLOCKS_LIQUID = Fl(8),
    L_BLOCKS_GAS = Fl(7), // blocks the permeation of gas
    L_BLOCKS_ITEMS = Fl(5), // items can't be on this tile
    L_BLOCKS_ACTORS = Fl(11), // actors can't be on this tile
    L_BLOCKS_EFFECTS = Fl(9),
    L_BLOCKS_DIAGONAL = Fl(10), // can't step diagonally around this tile

    L_INTERRUPT_WHEN_SEEN = Fl(11),
    L_LIST_IN_SIDEBAR = Fl(12), // terrain will be listed in the sidebar with a description of the terrain type
    L_VISUALLY_DISTINCT = Fl(13), // terrain will be color-adjusted if necessary so the character stands out from the background
    L_BRIGHT_MEMORY = Fl(14), // no blue fade when this tile is out of sight
    L_INVERT_WHEN_HIGHLIGHTED = Fl(15), // will flip fore and back colors when highlighted with pathing

    L_BLOCKED_BY_STAIRS = L_BLOCKS_ITEMS |
        L_BLOCKS_SURFACE |
        L_BLOCKS_GAS |
        L_BLOCKS_LIQUID |
        L_BLOCKS_EFFECTS |
        L_BLOCKS_ACTORS,

    L_BLOCKS_SCENT = L_BLOCKS_MOVE | L_BLOCKS_VISION,
    L_DIVIDES_LEVEL = L_BLOCKS_MOVE,
    L_WAYPOINT_BLOCKER = L_BLOCKS_MOVE,

    L_IS_WALL = L_BLOCKS_MOVE |
        L_BLOCKS_VISION |
        L_BLOCKS_LIQUID |
        L_BLOCKS_GAS |
        L_BLOCKS_EFFECTS |
        L_BLOCKS_DIAGONAL,

    L_BLOCKS_EVERYTHING = L_IS_WALL |
        L_BLOCKS_ITEMS |
        L_BLOCKS_ACTORS |
        L_BLOCKS_SURFACE,
}

///////////////////////////////////////////////////////
// TILE EVENT

export enum Activation {
    DFF_SUBSEQ_ALWAYS = Fl(0), // Always fire the subsequent event, even if no tiles changed.
    DFF_SUBSEQ_EVERYWHERE = Fl(1), // Subsequent DF spawns in every cell that this DF spawns in, instead of only the origin
    DFF_TREAT_AS_BLOCKING = Fl(2), // If filling the footprint of this DF with walls would disrupt level connectivity, then abort.
    DFF_PERMIT_BLOCKING = Fl(3), // Generate this DF without regard to level connectivity.

    DFF_BLOCKED_BY_OTHER_LAYERS = Fl(4), // Will not propagate into a cell if any layer in that cell has a superior priority.
    DFF_SUPERPRIORITY = Fl(5), // Will overwrite terrain of a superior priority.

    DFF_NO_REDRAW_CELL = Fl(6),
    DFF_ABORT_IF_BLOCKS_MAP = Fl(7),
    DFF_BLOCKED_BY_ITEMS = Fl(8), // Do not fire this event in a cell that has an item.
    DFF_BLOCKED_BY_ACTORS = Fl(9), // Do not fire this event in a cell that has an item.
    DFF_ALWAYS_FIRE = Fl(10), // Fire even if the cell is marked as having fired this turn
    DFF_NO_MARK_FIRED = Fl(11), // Do not mark this cell as having fired an event
    // MUST_REPLACE_LAYER
    // NEEDS_EMPTY_LAYER
    DFF_PROTECTED = Fl(12),

    DFF_SPREAD_CIRCLE = Fl(13), // Spread in a circle around the spot (using FOV), radius calculated using spread+decrement
    DFF_SPREAD_LINE = Fl(14), // Spread in a line in one random direction
    DFF_NULL_SURFACE = Fl(15), // Clear the surface layer
    DFF_NULL_LIQUID = Fl(16), // Clear liquid layer
    DFF_NULL_GAS = Fl(17), // Clear gas layer
    DFF_EVACUATE_CREATURES = Fl(18), // Creatures in the DF area get moved outside of it
    DFF_EVACUATE_ITEMS = Fl(19), // Creatures in the DF area get moved outside of it
    DFF_BUILD_IN_WALLS = Fl(20),
    DFF_MUST_TOUCH_WALLS = Fl(21),
    DFF_NO_TOUCH_WALLS = Fl(22),

    // These should be effect types
    DFF_ACTIVATE_DORMANT_MONSTER = Fl(23), // Dormant monsters on this tile will appear -- e.g. when a statue bursts to reveal a monster.
    DFF_AGGRAVATES_MONSTERS = Fl(24), // Will act as though an aggravate monster scroll of effectRadius radius had been read at that point.
    DFF_RESURRECT_ALLY = Fl(25), // Will bring back to life your most recently deceased ally.
    DFF_EMIT_EVENT = Fl(26), // Will emit the event when activated

    DFF_ONLY_IF_EMPTY = DFF_BLOCKED_BY_ITEMS | DFF_BLOCKED_BY_ACTORS,
    DFF_NULLIFY_CELL = DFF_NULL_SURFACE | DFF_NULL_LIQUID | DFF_NULL_GAS,
}

///////////////////////////////////////////////////////
// TILE

export enum Tile {
    T_BRIDGE = Fl(0), // Acts as a bridge over the folowing types (auto descent, lava, deep water)
    T_AUTO_DESCENT = Fl(1), // automatically drops creatures down a depth level and does some damage (2d6)
    T_LAVA = Fl(2), // kills any non-levitating non-fire-immune creature instantly
    T_DEEP_WATER = Fl(3), // steals items 50% of the time and moves them around randomly

    T_IS_FLAMMABLE = Fl(4), // terrain can catch fire
    T_SPONTANEOUSLY_IGNITES = Fl(5), // monsters avoid unless chasing player or immune to fire
    T_IS_FIRE = Fl(6), // terrain is a type of fire; ignites neighboring flammable cells
    T_EXTINGUISHES_FIRE = Fl(7), // extinguishes burning terrain or creatures

    T_IS_SECRET = Fl(8), // successful search or being stepped on while visible transforms it into discoverType
    T_IS_TRAP = Fl(9), // spews gas of type specified in fireType when stepped on
    T_SACRED = Fl(10), // monsters that aren't allies of the player will avoid stepping here

    T_UP_STAIRS = Fl(11),
    T_DOWN_STAIRS = Fl(12),
    T_PORTAL = Fl(13),
    T_IS_DOOR = Fl(14),

    T_ALLOWS_SUBMERGING = Fl(15), // allows submersible monsters to submerge in this terrain
    T_ENTANGLES = Fl(16), // entangles players and monsters like a spiderweb

    T_REFLECTS = Fl(17), // magic bolts reflect off of its surface randomly (similar to ACTIVE_CELLS flag IMPREGNABLE)
    T_STAND_IN_TILE = Fl(18), // earthbound creatures will be said to stand "in" the tile, not on it
    T_CONNECTS_LEVEL = Fl(19), // will be treated as passable for purposes of calculating level connectedness, irrespective of other aspects of this terrain layer

    T_HAS_STAIRS = T_UP_STAIRS | T_DOWN_STAIRS | T_PORTAL,
    T_OBSTRUCTS_SCENT = T_AUTO_DESCENT |
        T_LAVA |
        T_DEEP_WATER |
        T_SPONTANEOUSLY_IGNITES |
        T_HAS_STAIRS,
    T_PATHING_BLOCKER = T_AUTO_DESCENT |
        T_IS_TRAP |
        T_LAVA |
        T_DEEP_WATER |
        T_IS_FIRE |
        T_SPONTANEOUSLY_IGNITES |
        T_ENTANGLES,
    T_DIVIDES_LEVEL = T_AUTO_DESCENT | T_IS_TRAP | T_LAVA | T_DEEP_WATER,
    T_LAKE_PATHING_BLOCKER = T_AUTO_DESCENT |
        T_LAVA |
        T_DEEP_WATER |
        T_SPONTANEOUSLY_IGNITES,
    T_WAYPOINT_BLOCKER = T_AUTO_DESCENT |
        T_IS_TRAP |
        T_LAVA |
        T_DEEP_WATER |
        T_SPONTANEOUSLY_IGNITES,
    T_MOVES_ITEMS = T_DEEP_WATER | T_LAVA,
    T_CAN_BE_BRIDGED = T_AUTO_DESCENT | T_LAVA | T_DEEP_WATER,
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
    T_IS_DEEP_LIQUID = T_LAVA | T_AUTO_DESCENT | T_DEEP_WATER,
}

///////////////////////////////////////////////////////
// TILE MECH

export enum TileMech {
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

    TM_IS_WIRED = Fl(9), // if wired, promotes when powered, and sends power when promoting
    TM_IS_CIRCUIT_BREAKER = Fl(10), // prevents power from circulating in its machine

    TM_VANISHES_UPON_PROMOTION = Fl(15), // vanishes when creating promotion dungeon feature, even if the replacement terrain priority doesn't require it

    TM_EXPLOSIVE_PROMOTE = Fl(21), // when burned, will promote to promoteType instead of burningType if surrounded by tiles with T_IS_FIRE or TM_EXPLOSIVE_PROMOTE
    TM_SWAP_ENCHANTS_ACTIVATION = Fl(25), // in machine, swap item enchantments when two suitable items are on this terrain, and activate the machine when that happens

    // TM_PROMOTES = TM_PROMOTES_WITH_KEY |
    //   TM_PROMOTES_WITHOUT_KEY |
    //   TM_PROMOTES_ON_STEP |
    //   TM_PROMOTES_ON_ITEM_REMOVE |
    //   TM_PROMOTES_ON_SACRIFICE_ENTRY |
    //   TM_PROMOTES_ON_ELECTRICITY |
    //   TM_PROMOTES_ON_PLAYER_ENTRY,
}

///////////////////////////////////////////////////////
// CELL

export enum Cell {
    VISIBLE = Fl(0), // cell has sufficient light and is in field of view, ready to draw.
    WAS_VISIBLE = Fl(1),
    CLAIRVOYANT_VISIBLE = Fl(2),
    WAS_CLAIRVOYANT_VISIBLE = Fl(3),
    TELEPATHIC_VISIBLE = Fl(4), // potions of telepathy let you see through other creatures' eyes
    WAS_TELEPATHIC_VISIBLE = Fl(5), // potions of telepathy let you see through other creatures' eyes
    ITEM_DETECTED = Fl(6),
    WAS_ITEM_DETECTED = Fl(7),
    MONSTER_DETECTED = Fl(8),
    WAS_MONSTER_DETECTED = Fl(9),

    REVEALED = Fl(10),
    MAGIC_MAPPED = Fl(11),
    IN_FOV = Fl(12), // player has unobstructed line of sight whether or not there is enough light
    WAS_IN_FOV = Fl(13),

    NEEDS_REDRAW = Fl(14), // needs to be redrawn (maybe in path, etc...)
    CELL_CHANGED = Fl(15), // one of the tiles or sprites (item, actor, fx) changed

    // These are to help memory
    HAS_SURFACE = Fl(16),
    HAS_LIQUID = Fl(17),
    HAS_GAS = Fl(18),
    HAS_PLAYER = Fl(19),
    HAS_ACTOR = Fl(20),
    HAS_DORMANT_MONSTER = Fl(21), // hidden monster on the square
    HAS_ITEM = Fl(22),

    IS_IN_PATH = Fl(23), // the yellow trail leading to the cursor
    IS_CURSOR = Fl(24), // the current cursor

    STABLE_MEMORY = Fl(25), // redraws will simply be pulled from the memory array, not recalculated

    LIGHT_CHANGED = Fl(26), // Light level changed this turn
    CELL_LIT = Fl(27),
    IS_IN_SHADOW = Fl(28), // so that a player gains an automatic stealth bonus
    CELL_DARK = Fl(29),

    PERMANENT_CELL_FLAGS = REVEALED |
        MAGIC_MAPPED |
        ITEM_DETECTED |
        HAS_ITEM |
        HAS_DORMANT_MONSTER |
        STABLE_MEMORY,

    ANY_KIND_OF_VISIBLE = VISIBLE | CLAIRVOYANT_VISIBLE | TELEPATHIC_VISIBLE,
    HAS_ANY_ACTOR = HAS_PLAYER | HAS_ACTOR,
    IS_WAS_ANY_KIND_OF_VISIBLE = VISIBLE |
        WAS_VISIBLE |
        CLAIRVOYANT_VISIBLE |
        WAS_CLAIRVOYANT_VISIBLE |
        TELEPATHIC_VISIBLE |
        WAS_TELEPATHIC_VISIBLE,

    WAS_ANY_KIND_OF_VISIBLE = WAS_VISIBLE |
        WAS_CLAIRVOYANT_VISIBLE |
        WAS_TELEPATHIC_VISIBLE,

    CELL_DEFAULT = VISIBLE | IN_FOV | NEEDS_REDRAW | CELL_CHANGED, // !CELL_LIT until lights remove the shadow
}

///////////////////////////////////////////////////////
// CELL MECH

export enum CellMech {
    SEARCHED_FROM_HERE = Fl(0), // Player already auto-searched from here; can't auto search here again
    PRESSURE_PLATE_DEPRESSED = Fl(1), // so that traps do not trigger repeatedly while you stand on them
    KNOWN_TO_BE_TRAP_FREE = Fl(2), // keep track of where the player has stepped as he knows no traps are there

    CAUGHT_FIRE_THIS_TURN = Fl(4), // so that fire does not spread asymmetrically
    EVENT_FIRED_THIS_TURN = Fl(5), // so we don't update cells that have already changed this turn
    EVENT_PROTECTED = Fl(6),

    IS_IN_LOOP = Fl(10), // this cell is part of a terrain loop
    IS_CHOKEPOINT = Fl(11), // if this cell is blocked, part of the map will be rendered inaccessible
    IS_GATE_SITE = Fl(12), // consider placing a locked door here
    IS_IN_ROOM_MACHINE = Fl(13),
    IS_IN_AREA_MACHINE = Fl(14),
    IS_POWERED = Fl(15), // has been activated by machine power this turn (can probably be eliminate if needed)

    IMPREGNABLE = Fl(20), // no tunneling allowed!
    DARKENED = Fl(19), // magical blindness?

    IS_IN_MACHINE = IS_IN_ROOM_MACHINE | IS_IN_AREA_MACHINE, // sacred ground; don't generate items here, or teleport randomly to it

    PERMANENT_MECH_FLAGS = SEARCHED_FROM_HERE |
        PRESSURE_PLATE_DEPRESSED |
        KNOWN_TO_BE_TRAP_FREE |
        IS_IN_LOOP |
        IS_CHOKEPOINT |
        IS_GATE_SITE |
        IS_IN_MACHINE |
        IMPREGNABLE,
}

///////////////////////////////////////////////////////
// MAP

export enum Map {
    MAP_CHANGED = Fl(0),

    MAP_STABLE_GLOW_LIGHTS = Fl(1),
    MAP_STABLE_LIGHTS = Fl(2),

    MAP_ALWAYS_LIT = Fl(3),
    MAP_SAW_WELCOME = Fl(4),

    MAP_NO_LIQUID = Fl(5),
    MAP_NO_GAS = Fl(6),

    MAP_CALC_FOV = Fl(7),
    MAP_FOV_CHANGED = Fl(8),

    MAP_DEFAULT = MAP_STABLE_LIGHTS | MAP_STABLE_GLOW_LIGHTS,
}
