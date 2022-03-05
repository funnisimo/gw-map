import * as GWU from 'gw-utils';

import * as Flags from '../flags';
import * as MAP from '../map';

export function gas(map: MAP.Map) {
    const cleanup: GWU.app.CancelFn[] = [];

    map.data.gas = true;

    cleanup.push(
        map.on('tick', () => {
            gasTick(map);
        })
    );

    cleanup.push(
        map.on('copy', (src: MAP.Map) => {
            if (!src.data.gas) {
                // remove gas
                cleanup.forEach((c) => c());
            }
        })
    );
    cleanup.push(
        map.on('assign', (dest: MAP.Map) => {
            if (!dest.data.gas) {
                // install gas
                gas(dest);
            }
        })
    );
}

function gasTick(map: MAP.Map): void {
    if (!map.hasMapFlag(Flags.Map.MAP_HAS_GAS)) return;

    const updatedVolumes = GWU.grid.alloc(map.width, map.height);

    // dissipate the gas...
    dissipateGas(map, updatedVolumes);

    // spread the gas...
    spreadGas(map, updatedVolumes);

    GWU.grid.free(updatedVolumes);
}

function dissipateGas(map: MAP.Map, volume: GWU.grid.NumGrid) {
    map.cells.forEach((cell, x, y) => {
        if (!cell.volume) {
            volume[x][y] = 0;
        } else {
            let v = cell.volume;
            const tile = cell.depthTile(Flags.Depth.GAS);
            if (tile && tile.dissipate) {
                let d = Math.max(0.5, (v * tile.dissipate) / 10000); // 1000 = 10%
                v = Math.max(0, v - d);
            }
            if (!v) {
                cell.clearDepth(Flags.Depth.GAS);
            } else {
                cell.volume = v;
            }
            volume[x][y] = v;
        }
    });
}

// function calcOpacity(volume: number): number {
//     return Math.floor(Math.min(volume, 10) * 10);
// }

function updateCellVolume(
    map: MAP.Map,
    x: number,
    y: number,
    startingVolume: GWU.grid.NumGrid
) {
    let total = 0;
    let count = 0;

    let highestVolume = 0;
    const cell = map.cell(x, y);
    let startingTile = cell.depthTile(Flags.Depth.GAS);
    let highestTile = startingTile;

    if (cell.hasEntityFlag(Flags.Entity.L_BLOCKS_GAS)) {
        startingVolume[x][y] = 0;
        cell.volume = 0;
        return;
    }

    for (
        let i = Math.max(0, x - 1);
        i < Math.min(x + 2, startingVolume.width);
        ++i
    ) {
        for (
            let j = Math.max(0, y - 1);
            j < Math.min(y + 2, startingVolume.height);
            ++j
        ) {
            const v = startingVolume[i][j];
            if (!cell.hasEntityFlag(Flags.Entity.L_BLOCKS_GAS)) {
                ++count;
                if (v > highestVolume) {
                    highestVolume = v;
                    highestTile = map.cell(i, j).depthTile(Flags.Depth.GAS);
                }
            }
            total += v;
        }
    }

    const v = Math.floor((total * 10) / count) / 10;
    // startingVolume[x][y] = v;

    if (v > 0 && highestTile) {
        if (!startingTile || startingTile !== highestTile) {
            cell.setTile(highestTile, { volume: v });
        } else {
            cell.volume = v;
        }
    }
    if (v > 0) {
        cell.needsRedraw = true;
    }
}

function spreadGas(map: MAP.Map, startingVolume: GWU.grid.NumGrid) {
    for (let x = 0; x < startingVolume.width; ++x) {
        for (let y = 0; y < startingVolume.height; ++y) {
            updateCellVolume(map, x, y, startingVolume);
        }
    }
}
