import * as GWU from 'gw-utils';
import { Map } from './map';

export function isHallway(map: Map, x: number, y: number): boolean {
    return (
        GWU.xy.arcCount(x, y, (i, j) => {
            return map.cell(i, j).isPassable();
        }) > 1
    );
}
