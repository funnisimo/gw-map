// import * as GWU from 'gw-utils';

import { MapType } from '../map/types';
import { MapLayer } from './mapLayer';

export class ActorLayer extends MapLayer {
    constructor(map: MapType, name = 'actor') {
        super(map, name);
    }
}
