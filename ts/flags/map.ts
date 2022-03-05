import * as GWU from 'gw-utils';

const Fl = GWU.flag.fl;

///////////////////////////////////////////////////////
// MAP

export enum Map {
    MAP_CHANGED = Fl(0),
    MAP_NEEDS_REDRAW = Fl(1),

    MAP_ALWAYS_LIT = Fl(3),
    MAP_SAW_WELCOME = Fl(4),

    MAP_HAS_LIQUID = Fl(5),
    MAP_HAS_GAS = Fl(6),
    MAP_HAS_FIRE = Fl(7),

    MAP_CALC_FOV = Fl(10),
    MAP_FOV_CHANGED = Fl(11),

    MAP_DANCES = Fl(12),

    MAP_SIDEBAR_TILES_CHANGED = Fl(13),
    MAP_SIDEBAR_CHANGED = Fl(14),

    MAP_DEFAULT = 0,
}
