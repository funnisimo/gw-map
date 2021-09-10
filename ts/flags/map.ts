import * as GWU from 'gw-utils';

const Fl = GWU.flag.fl;

///////////////////////////////////////////////////////
// MAP

export enum Map {
    MAP_CHANGED = Fl(0),

    MAP_ALWAYS_LIT = Fl(3),
    MAP_SAW_WELCOME = Fl(4),

    MAP_NO_LIQUID = Fl(5),
    MAP_NO_GAS = Fl(6),

    MAP_CALC_FOV = Fl(7),
    MAP_FOV_CHANGED = Fl(8),

    MAP_DANCES = Fl(9),

    MAP_DEFAULT = 0,
}
