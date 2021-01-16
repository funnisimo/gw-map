import { flag as Flag } from "gw-utils";

export enum Depth {
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

export enum Layer {
  L_DYNAMIC = Fl(0), // for movable things like actors or items
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
  DFF_ACTIVATE_DORMANT_MONSTER = Fl(4), // Dormant monsters on this tile will appear -- e.g. when a statue bursts to reveal a monster.

  DFF_BLOCKED_BY_OTHER_LAYERS = Fl(6), // Will not propagate into a cell if any layer in that cell has a superior priority.
  DFF_SUPERPRIORITY = Fl(7), // Will overwrite terrain of a superior priority.
  DFF_AGGRAVATES_MONSTERS = Fl(8), // Will act as though an aggravate monster scroll of effectRadius radius had been read at that point.
  DFF_RESURRECT_ALLY = Fl(9), // Will bring back to life your most recently deceased ally.
  DFF_EMIT_EVENT = Fl(10), // Will emit the event when activated
  DFF_NO_REDRAW_CELL = Fl(11),
  DFF_ABORT_IF_BLOCKS_MAP = Fl(12),
  DFF_BLOCKED_BY_ITEMS = Fl(13), // Do not fire this event in a cell that has an item.
  DFF_BLOCKED_BY_ACTORS = Fl(14), // Do not fire this event in a cell that has an item.
  DFF_ALWAYS_FIRE = Fl(15), // Fire even if the cell is marked as having fired this turn
  DFF_NO_MARK_FIRED = Fl(16), // Do not mark this cell as having fired an event
  // MUST_REPLACE_LAYER
  // NEEDS_EMPTY_LAYER
  DFF_PROTECTED = Fl(19),

  DFF_SPREAD_CIRCLE = Fl(20), // Spread in a circle around the spot (using FOV), radius calculated using spread+decrement
  DFF_SPREAD_LINE = Fl(21), // Spread in a line in one random direction
  DFF_NULL_SURFACE = Fl(22), // Clear the surface layer
  DFF_NULL_LIQUID = Fl(23), // Clear liquid layer
  DFF_NULL_GAS = Fl(24), // Clear gas layer
  DFF_EVACUATE_CREATURES = Fl(25), // Creatures in the DF area get moved outside of it
  DFF_EVACUATE_ITEMS = Fl(26), // Creatures in the DF area get moved outside of it
  DFF_BUILD_IN_WALLS = Fl(27),
  DFF_MUST_TOUCH_WALLS = Fl(28),
  DFF_NO_TOUCH_WALLS = Fl(29),

  DFF_ONLY_IF_EMPTY = DFF_BLOCKED_BY_ITEMS | DFF_BLOCKED_BY_ACTORS,
  DFF_NULLIFY_CELL = DFF_NULL_SURFACE | DFF_NULL_LIQUID | DFF_NULL_GAS,
}

///////////////////////////////////////////////////////
// TILE

export enum Tile {
  T_LIQUID = Fl(0),
  T_SURFACE = Fl(1),
  T_GAS = Fl(2),

  T_BRIDGE = Fl(11), // Acts as a bridge over the folowing types=
  T_AUTO_DESCENT = Fl(12), // automatically drops creatures down a depth level and does some damage (2d6)
  T_LAVA = Fl(13), // kills any non-levitating non-fire-immune creature instantly
  T_DEEP_WATER = Fl(14), // steals items 50% of the time and moves them around randomly

  T_SPONTANEOUSLY_IGNITES = Fl(15), // monsters avoid unless chasing player or immune to fire
  T_IS_FLAMMABLE = Fl(16), // terrain can catch fire
  T_IS_FIRE = Fl(17), // terrain is a type of fire; ignites neighboring flammable cells
  T_ENTANGLES = Fl(18), // entangles players and monsters like a spiderweb

  // T_CAUSES_POISON = Fl(18), // any non-levitating creature gets 10 poison
  // T_CAUSES_DAMAGE = Fl(19), // anything on the tile takes max(1-2, 10%) damage per turn
  // T_CAUSES_NAUSEA = Fl(20), // any creature on the tile becomes nauseous
  // T_CAUSES_PARALYSIS = Fl(21), // anything caught on this tile is paralyzed
  // T_CAUSES_CONFUSION = Fl(22), // causes creatures on this tile to become confused
  // T_CAUSES_HEALING = Fl(23), // heals 20% max HP per turn for any player or non-inanimate monsters
  T_IS_TRAP = Fl(24), // spews gas of type specified in fireType when stepped on
  // T_CAUSES_EXPLOSIVE_DAMAGE = Fl(25), // is an explosion; deals higher of 15-20 or 50% damage instantly, but not again for five turns
  T_SACRED = Fl(26), // monsters that aren't allies of the player will avoid stepping here

  T_UP_STAIRS = Fl(27),
  T_DOWN_STAIRS = Fl(28),
  T_PORTAL = Fl(29),
  T_IS_DOOR = Fl(30),

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
  TM_IS_SECRET = Fl(0), // successful search or being stepped on while visible transforms it into discoverType
  TM_PROMOTES_WITH_KEY = Fl(1), // promotes if the key is present on the tile (in your pack, carried by monster, or lying on the ground)
  TM_PROMOTES_WITHOUT_KEY = Fl(2), // promotes if the key is NOT present on the tile (in your pack, carried by monster, or lying on the ground)
  TM_PROMOTES_ON_STEP = Fl(3), // promotes when a creature, player or item is on the tile (whether or not levitating)
  TM_PROMOTES_ON_ITEM_REMOVE = Fl(4), // promotes when an item is lifted from the tile (primarily for altars)
  TM_PROMOTES_ON_PLAYER_ENTRY = Fl(5), // promotes when the player enters the tile (whether or not levitating)
  TM_PROMOTES_ON_SACRIFICE_ENTRY = Fl(6), // promotes when the sacrifice target enters the tile (whether or not levitating)
  TM_PROMOTES_ON_ELECTRICITY = Fl(7), // promotes when hit by a lightning bolt

  TM_ALLOWS_SUBMERGING = Fl(8), // allows submersible monsters to submerge in this terrain
  TM_IS_WIRED = Fl(9), // if wired, promotes when powered, and sends power when promoting
  TM_IS_CIRCUIT_BREAKER = Fl(10), // practivates power from circulating in its machine

  TM_EXTINGUISHES_FIRE = Fl(14), // extinguishes burning terrain or creatures
  TM_VANISHES_UPON_PROMOTION = Fl(15), // vanishes when creating promotion dungeon feature, even if the replacement terrain priority doesn't require it
  TM_REFLECTS_BOLTS = Fl(16), // magic bolts reflect off of its surface randomly (similar to ACTIVE_CELLS flag IMPREGNABLE)
  TM_STAND_IN_TILE = Fl(17), // earthbound creatures will be said to stand "in" the tile, not on it
  TM_LIST_IN_SIDEBAR = Fl(18), // terrain will be listed in the sidebar with a description of the terrain type
  TM_VISUALLY_DISTINCT = Fl(19), // terrain will be color-adjusted if necessary so the character stands out from the background
  TM_BRIGHT_MEMORY = Fl(20), // no blue fade when this tile is out of sight
  TM_EXPLOSIVE_PROMOTE = Fl(21), // when burned, will promote to promoteType instead of burningType if surrounded by tiles with T_IS_FIRE or TM_EXPLOSIVE_PROMOTE
  TM_CONNECTS_LEVEL = Fl(22), // will be treated as passable for purposes of calculating level connectedness, irrespective of other aspects of this terrain layer
  TM_INTERRUPT_EXPLORATION_WHEN_SEEN = Fl(23), // will generate a message when discovered during exploration to interrupt exploration
  TM_INVERT_WHEN_HIGHLIGHTED = Fl(24), // will flip fore and back colors when highlighted with pathing
  TM_SWAP_ENCHANTS_ACTIVATION = Fl(25), // in machine, swap item enchantments when two suitable items are on this terrain, and activate the machine when that happens

  TM_PROMOTES = TM_PROMOTES_WITH_KEY |
    TM_PROMOTES_WITHOUT_KEY |
    TM_PROMOTES_ON_STEP |
    TM_PROMOTES_ON_ITEM_REMOVE |
    TM_PROMOTES_ON_SACRIFICE_ENTRY |
    TM_PROMOTES_ON_ELECTRICITY |
    TM_PROMOTES_ON_PLAYER_ENTRY,
}

///////////////////////////////////////////////////////
// CELL

export enum Cell {
  REVEALED = Fl(0),
  VISIBLE = Fl(1), // cell has sufficient light and is in field of view, ready to draw.
  WAS_VISIBLE = Fl(2),
  IN_FOV = Fl(3), // player has unobstructed line of sight whether or not there is enough light

  HAS_PLAYER = Fl(4),
  HAS_MONSTER = Fl(5),
  HAS_DORMANT_MONSTER = Fl(6), // hidden monster on the square
  HAS_ITEM = Fl(7),
  HAS_STAIRS = Fl(8),

  NEEDS_REDRAW = Fl(9), // needs to be redrawn (maybe in path, etc...)
  CELL_CHANGED = Fl(10), // one of the tiles or sprites (item, actor, fx) changed

  IS_IN_PATH = Fl(12), // the yellow trail leading to the cursor
  IS_CURSOR = Fl(13), // the current cursor

  MAGIC_MAPPED = Fl(14),
  ITEM_DETECTED = Fl(15),

  STABLE_MEMORY = Fl(16), // redraws will simply be pulled from the memory array, not recalculated

  CLAIRVOYANT_VISIBLE = Fl(17),
  WAS_CLAIRVOYANT_VISIBLE = Fl(18),
  CLAIRVOYANT_DARKENED = Fl(19), // magical blindness from a cursed ring of clairvoyance

  IMPREGNABLE = Fl(20), // no tunneling allowed!

  TELEPATHIC_VISIBLE = Fl(22), // potions of telepathy let you see through other creatures' eyes
  WAS_TELEPATHIC_VISIBLE = Fl(23), // potions of telepathy let you see through other creatures' eyes

  MONSTER_DETECTED = Fl(24),
  WAS_MONSTER_DETECTED = Fl(25),

  LIGHT_CHANGED = Fl(27), // Light level changed this turn
  CELL_LIT = Fl(28),
  IS_IN_SHADOW = Fl(29), // so that a player gains an automatic stealth bonus
  CELL_DARK = Fl(30),

  PERMANENT_CELL_FLAGS = REVEALED |
    MAGIC_MAPPED |
    ITEM_DETECTED |
    HAS_ITEM |
    HAS_DORMANT_MONSTER |
    HAS_STAIRS |
    STABLE_MEMORY |
    IMPREGNABLE,

  ANY_KIND_OF_VISIBLE = VISIBLE | CLAIRVOYANT_VISIBLE | TELEPATHIC_VISIBLE,
  HAS_ACTOR = HAS_PLAYER | HAS_MONSTER,
  IS_WAS_ANY_KIND_OF_VISIBLE = VISIBLE |
    WAS_VISIBLE |
    CLAIRVOYANT_VISIBLE |
    WAS_CLAIRVOYANT_VISIBLE |
    TELEPATHIC_VISIBLE |
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

  IS_IN_MACHINE = IS_IN_ROOM_MACHINE | IS_IN_AREA_MACHINE, // sacred ground; don't generate items here, or teleport randomly to it

  PERMANENT_MECH_FLAGS = SEARCHED_FROM_HERE |
    PRESSURE_PLATE_DEPRESSED |
    KNOWN_TO_BE_TRAP_FREE |
    IS_IN_LOOP |
    IS_CHOKEPOINT |
    IS_GATE_SITE |
    IS_IN_MACHINE,
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

  MAP_FOV_CHANGED = Fl(7),

  MAP_DEFAULT = MAP_STABLE_LIGHTS | MAP_STABLE_GLOW_LIGHTS | MAP_FOV_CHANGED,
}
