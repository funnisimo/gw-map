import * as GWU from 'gw-utils';

const Fl = GWU.flag.fl;

export enum Actor {
    IS_PLAYER = Fl(0),
    HAS_MEMORY = Fl(1),
    USES_FOV = Fl(2),

    STABLE_COST_MAP = Fl(3),

    DEFAULT = 0,
}
