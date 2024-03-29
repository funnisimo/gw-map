import * as GWU from 'gw-utils';
import { Map } from './map/map';

export function getCellPathCost(map: Map, x: number, y: number): number {
    const cell = map.cell(x, y);
    if (cell.blocksMove()) return GWU.path.OBSTRUCTION;
    if (cell.blocksPathing()) return GWU.path.FORBIDDEN;
    if (cell.hasActor()) return 10;
    return 1;
}

export function fillCostMap(map: Map, costMap: GWU.grid.NumGrid): void {
    costMap.update((_v, x, y) => getCellPathCost(map, x, y));
}

export interface PathOptions {
    eightWays: boolean;
}

export function getPathBetween(
    map: Map,
    x0: number,
    y0: number,
    x1: number,
    y1: number,
    options: Partial<PathOptions> = {}
): GWU.xy.Loc[] | null {
    const distanceMap = GWU.grid.alloc(map.width, map.height);
    const costMap = GWU.grid.alloc(map.width, map.height);
    fillCostMap(map, costMap);

    GWU.path.calculateDistances(
        distanceMap,
        x0,
        y0,
        costMap,
        options.eightWays,
        GWU.xy.straightDistanceBetween(x0, y0, x1, y1) + 1
    );

    const path = GWU.path.getPath(
        distanceMap,
        x1,
        y1,
        (x, y) => map.cell(x, y).blocksMove(),
        options.eightWays
    );
    GWU.grid.free(costMap);
    GWU.grid.free(distanceMap);
    return path;
}
