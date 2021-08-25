import * as GWU from 'gw-utils';

const Fl = GWU.flag.fl;

///////////////////////////////////////////////////////
// TILE

export enum Tile {
    T_BRIDGE = Fl(0), // Acts as a bridge over the folowing types (auto descent, lava, deep water)
    T_AUTO_DESCENT = Fl(1), // automatically drops creatures down a depth level and does some damage (2d6)
    T_LAVA = Fl(2), // kills any non-levitating non-fire-immune creature instantly
    T_DEEP_WATER = Fl(3), // steals items 50% of the time and moves them around randomly

    T_IS_FLAMMABLE = Fl(5), // terrain can catch fire
    T_SPONTANEOUSLY_IGNITES = Fl(6), // monsters avoid unless chasing player or immune to fire
    T_IS_FIRE = Fl(7), // terrain is a type of fire; ignites neighboring flammable cells
    T_EXTINGUISHES_FIRE = Fl(8), // extinguishes burning terrain or creatures

    T_IS_SECRET = Fl(9), // successful search or being stepped on while visible transforms it into discoverType
    T_IS_TRAP = Fl(10), // spews gas of type specified in fireType when stepped on
    T_SACRED = Fl(11), // monsters that aren't allies of the player will avoid stepping here

    T_UP_STAIRS = Fl(12),
    T_DOWN_STAIRS = Fl(13),
    T_PORTAL = Fl(14),
    T_IS_DOOR = Fl(15),

    T_ALLOWS_SUBMERGING = Fl(16), // allows submersible monsters to submerge in this terrain
    T_ENTANGLES = Fl(17), // entangles players and monsters like a spiderweb

    T_REFLECTS = Fl(18), // magic bolts reflect off of its surface randomly (similar to ACTIVE_CELLS flag IMPREGNABLE)
    T_STAND_IN_TILE = Fl(19), // earthbound creatures will be said to stand "in" the tile, not on it
    T_CONNECTS_LEVEL = Fl(20), // will be treated as passable for purposes of calculating level connectedness, irrespective of other aspects of this terrain layer

    T_BLOCKS_OTHER_LAYERS = Fl(21),

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
    T_LAKE_PATHING_BLOCKER = T_AUTO_DESCENT |
        T_LAVA |
        T_DEEP_WATER |
        T_SPONTANEOUSLY_IGNITES,
    T_WAYPOINT_BLOCKER = T_AUTO_DESCENT |
        T_IS_TRAP |
        T_LAVA |
        T_DEEP_WATER |
        T_SPONTANEOUSLY_IGNITES,

    T_DIVIDES_LEVEL = T_AUTO_DESCENT | T_IS_TRAP | T_LAVA | T_DEEP_WATER,

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
