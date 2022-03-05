import * as GWU from 'gw-utils';

import * as Flags from '../flags';
import { Map } from '../map/map';

const ObjectFlags = Flags.Entity;
const TileFlags = Flags.Tile;
const TileMechFlags = Flags.TileMech;
const CellFlags = Flags.Cell;

export function fire(map: Map) {
    map.data.fire = true;
    const cancelFns: GWU.app.CancelFn[] = [];

    cancelFns.push(
        map.on('tick', () => {
            fireTick(map);
        })
    );

    cancelFns.push(
        map.on('assign', (dest: Map) => {
            if (!dest.data.fire) {
                fire(dest);
            }
        })
    );

    // Not sure if we should do this, but...
    cancelFns.push(
        map.on('copy', (src: Map) => {
            if (!src.data.fire) {
                cancelFns.forEach((c) => c());
            }
        })
    );
}

function fireTick(map: Map): void {
    // Run any tick effects
    if (!map.hasMapFlag(Flags.Map.MAP_HAS_FIRE)) return;

    map.clearMapFlag(Flags.Map.MAP_HAS_FIRE);

    // Bookkeeping for fire
    for (let x = 0; x < map.width; ++x) {
        for (let y = 0; y < map.height; ++y) {
            const cell = map.cell(x, y);
            cell.clearCellFlag(CellFlags.CAUGHT_FIRE_THIS_TURN);
        }
    }

    // now spread the fire...
    for (let x = 0; x < map.width; ++x) {
        for (let y = 0; y < map.height; ++y) {
            const cell = map.cell(x, y);
            if (
                cell.hasTileFlag(TileFlags.T_IS_FIRE) &&
                !(cell.flags.cell & CellFlags.CAUGHT_FIRE_THIS_TURN)
            ) {
                exposeToFire(map, x, y, false);
                for (let d = 0; d < 4; ++d) {
                    const dir = GWU.xy.DIRS[d];
                    exposeToFire(map, x + dir[0], y + dir[1]);
                }
            }
        }
    }

    if (map.someCell((c) => c.hasTileFlag(Flags.Tile.T_IS_FIRE))) {
        map.setMapFlag(Flags.Map.MAP_HAS_FIRE);
    }
}

function exposeToFire(
    map: Map,
    x: number,
    y: number,
    alwaysIgnite = false
): boolean {
    let firePriority = 0,
        bestExtinguishingPriority = 0,
        explosiveNeighborCount = 0;
    let explosivePromotion = false;

    const cell = map.cell(x, y);
    if (!cell.hasTileFlag(TileFlags.T_IS_FLAMMABLE)) {
        return false;
    }

    cell.eachTile((tile) => {
        // Pick the extinguishing layer with the best priority.
        if (
            tile.hasTileFlag(TileFlags.T_EXTINGUISHES_FIRE) &&
            tile.priority > bestExtinguishingPriority
        ) {
            bestExtinguishingPriority = tile.priority;
        }

        // Pick the fire type of the most flammable layer that is either gas or equal-or-better priority than the best extinguishing layer.
        if (
            tile.flags.tile & TileFlags.T_IS_FLAMMABLE &&
            tile.priority > firePriority
        ) {
            firePriority = tile.priority;
        }
    });

    // didNothing
    if (bestExtinguishingPriority >= firePriority && !alwaysIgnite)
        return false;

    // Count explosive neighbors.
    if (cell.hasTileMechFlag(TileMechFlags.TM_EXPLOSIVE_PROMOTE)) {
        GWU.xy.eachNeighbor(x, y, (x0, y0) => {
            const n = map.cell(x0, y0);
            if (
                n.hasEntityFlag(ObjectFlags.L_BLOCKS_GAS) ||
                n.hasTileFlag(TileFlags.T_IS_FIRE) ||
                n.hasTileMechFlag(TileMechFlags.TM_EXPLOSIVE_PROMOTE)
            ) {
                ++explosiveNeighborCount;
            }
        });
        if (explosiveNeighborCount >= 8) {
            explosivePromotion = true;
        }
    }

    let event = 'fire';
    if (explosivePromotion && cell.hasAction('explode')) {
        event = 'explode';
    }
    // cell.eachTile( (tile) => {
    //     if (tile.flags.tile & TileFlags.T_IS_FLAMMABLE) {
    //         if (tile.depth === Depth.GAS) {
    //             cell.gasVolume = 0;
    //         } else if (tile.depth === Depth.LIQUID) {
    //             cell.liquidVolume = 0;
    //         }
    //     }
    // });

    cell.trigger(event, {
        force: true,
    });

    // cell.needsRedraw = true;

    return true;
}
