import * as GWU from 'gw-utils';

const Fl = GWU.flag.fl;

///////////////////////////////////////////////////////
// CELL

export enum Cell {
    SEARCHED_FROM_HERE = Fl(0), // Player already auto-searched from here; can't auto search here again
    PRESSURE_PLATE_DEPRESSED = Fl(1), // so that traps do not trigger repeatedly while you stand on them
    KNOWN_TO_BE_TRAP_FREE = Fl(2), // keep track of where the player has stepped as he knows no traps are there

    CAUGHT_FIRE_THIS_TURN = Fl(3), // so that fire does not spread asymmetrically
    EVENT_FIRED_THIS_TURN = Fl(4), // so we don't update cells that have already changed this turn
    EVENT_PROTECTED = Fl(5),

    IS_IN_LOOP = Fl(6), // this cell is part of a terrain loop
    IS_CHOKEPOINT = Fl(7), // if this cell is blocked, part of the map will be rendered inaccessible
    IS_GATE_SITE = Fl(8), // consider placing a locked door here
    IS_IN_ROOM_MACHINE = Fl(9),
    IS_IN_AREA_MACHINE = Fl(10),

    IMPREGNABLE = Fl(11), // no tunneling allowed!

    NEEDS_REDRAW = Fl(13), // needs to be redrawn (maybe in path, etc...)
    LIGHT_CHANGED = Fl(14), // one of the tiles changed the cell lighting
    FOV_CHANGED = Fl(15),

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

    IS_WIRED = Fl(26),
    IS_CIRCUIT_BREAKER = Fl(27),
    IS_POWERED = Fl(28), // has been activated by machine power this turn (can probably be eliminate if needed)

    COLORS_DANCE = Fl(30),

    CHANGED = NEEDS_REDRAW | LIGHT_CHANGED | FOV_CHANGED, // Cell has changed

    IS_IN_MACHINE = IS_IN_ROOM_MACHINE | IS_IN_AREA_MACHINE, // sacred ground; don't generate items here, or teleport randomly to it

    PERMANENT_CELL_FLAGS = HAS_ITEM |
        HAS_DORMANT_MONSTER |
        STABLE_MEMORY |
        SEARCHED_FROM_HERE |
        PRESSURE_PLATE_DEPRESSED |
        KNOWN_TO_BE_TRAP_FREE |
        IS_IN_LOOP |
        IS_CHOKEPOINT |
        IS_GATE_SITE |
        IS_IN_MACHINE |
        IMPREGNABLE,

    HAS_ANY_ACTOR = HAS_PLAYER | HAS_ACTOR,
    HAS_ANY_OBJECT = HAS_ITEM | HAS_ANY_ACTOR,

    CELL_DEFAULT = NEEDS_REDRAW | LIGHT_CHANGED,
}
