import { MapType } from '../map/types';
import { MapLayer } from './mapLayer';

export class ItemLayer extends MapLayer {
    constructor(map: MapType, name = 'item') {
        super(map, name);
    }
}
