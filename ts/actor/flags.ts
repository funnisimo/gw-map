import * as GWU from 'gw-utils';

const Fl = GWU.flag.fl;
export { GameObject, Depth } from '../gameObject/flags';

export enum Actor {
    IS_PLAYER = Fl(0),
}
