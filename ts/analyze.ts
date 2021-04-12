import * as GW from 'gw-utils';
import * as MAP from './map';
import * as CELL from './cell';
import * as FLAGS from './flags';

export function analyze(map: MAP.Map, updateChokeCounts = true) {
    updateLoopiness(map);
    updateChokepoints(map, updateChokeCounts);
}

/////////////////////////////////////////////////////
/////////////////////////////////////////////////////
// TODO - Move to Map?

export function updateChokepoints(map: MAP.Map, updateCounts: boolean) {
    const passMap = GW.grid.alloc(map.width, map.height);
    const grid = GW.grid.alloc(map.width, map.height);

    for (let i = 0; i < map.width; i++) {
        for (let j = 0; j < map.height; j++) {
            const cell = map.get(i, j);
            if (
                (cell.hasTileFlag(FLAGS.Tile.T_PATHING_BLOCKER) ||
                    cell.hasLayerFlag(FLAGS.Entity.L_BLOCKS_MOVE)) &&
                !cell.hasLayerFlag(FLAGS.Entity.L_SECRETLY_PASSABLE)
            ) {
                // cell.flags &= ~FLAGS.CellMech.IS_IN_LOOP;
                passMap[i][j] = 0;
            } else {
                // cell.flags |= FLAGS.CellMech.IS_IN_LOOP;
                passMap[i][j] = 1;
            }
        }
    }

    let passableArcCount;

    // done finding loops; now flag chokepoints
    for (let i = 1; i < passMap.width - 1; i++) {
        for (let j = 1; j < passMap.height - 1; j++) {
            map.cells[i][j].mechFlags &= ~FLAGS.CellMech.IS_CHOKEPOINT;
            if (
                passMap[i][j] &&
                !(map.cells[i][j].mechFlags & FLAGS.CellMech.IS_IN_LOOP)
            ) {
                passableArcCount = 0;
                for (let dir = 0; dir < 8; dir++) {
                    const oldX = i + GW.utils.CLOCK_DIRS[(dir + 7) % 8][0];
                    const oldY = j + GW.utils.CLOCK_DIRS[(dir + 7) % 8][1];
                    const newX = i + GW.utils.CLOCK_DIRS[dir][0];
                    const newY = j + GW.utils.CLOCK_DIRS[dir][1];
                    if (
                        (map.hasXY(newX, newY) && // RUT.Map.makeValidXy(map, newXy) &&
                            passMap[newX][newY]) !=
                        (map.hasXY(oldX, oldY) && // RUT.Map.makeValidXy(map, oldXy) &&
                            passMap[oldX][oldY])
                    ) {
                        if (++passableArcCount > 2) {
                            if (
                                (!passMap[i - 1][j] && !passMap[i + 1][j]) ||
                                (!passMap[i][j - 1] && !passMap[i][j + 1])
                            ) {
                                map.cells[i][j].mechFlags |=
                                    FLAGS.CellMech.IS_CHOKEPOINT;
                            }
                            break;
                        }
                    }
                }
            }
        }
    }

    if (updateCounts) {
        // Done finding chokepoints; now create a chokepoint map.

        // The chokepoint map is a number for each passable tile. If the tile is a chokepoint,
        // then the number indicates the number of tiles that would be rendered unreachable if the
        // chokepoint were blocked. If the tile is not a chokepoint, then the number indicates
        // the number of tiles that would be rendered unreachable if the nearest exit chokepoint
        // were blocked.
        // The cost of all of this is one depth-first flood-fill per open point that is adjacent to a chokepoint.

        // Start by setting the chokepoint values really high, and roping off room machines.
        for (let i = 0; i < map.width; i++) {
            for (let j = 0; j < map.height; j++) {
                map.cells[i][j].chokeCount = 30000;
                if (
                    map.cells[i][j].mechFlags &
                    FLAGS.CellMech.IS_IN_ROOM_MACHINE
                ) {
                    passMap[i][j] = 0;
                }
            }
        }

        // Scan through and find a chokepoint next to an open point.

        for (let i = 0; i < map.width; i++) {
            for (let j = 0; j < map.height; j++) {
                const cell = map.cells[i][j];

                if (
                    passMap[i][j] &&
                    cell.mechFlags & FLAGS.CellMech.IS_CHOKEPOINT
                ) {
                    for (let dir = 0; dir < 4; dir++) {
                        const newX = i + GW.utils.DIRS[dir][0];
                        const newY = j + GW.utils.DIRS[dir][1];
                        if (
                            map.hasXY(newX, newY) && // RUT.Map.makeValidXy(map, newXy) &&
                            passMap[newX][newY] &&
                            !(
                                map.cells[newX][newY].mechFlags &
                                FLAGS.CellMech.IS_CHOKEPOINT
                            )
                        ) {
                            // OK, (newX, newY) is an open point and (i, j) is a chokepoint.
                            // Pretend (i, j) is blocked by changing passMap, and run a flood-fill cell count starting on (newX, newY).
                            // Keep track of the flooded region in grid[][].
                            grid.fill(0);
                            passMap[i][j] = 0;
                            let cellCount = floodFillCount(
                                map,
                                grid,
                                passMap,
                                newX,
                                newY
                            );
                            passMap[i][j] = 1;

                            // CellCount is the size of the region that would be obstructed if the chokepoint were blocked.
                            // CellCounts less than 4 are not useful, so we skip those cases.

                            if (cellCount >= 4) {
                                // Now, on the chokemap, all of those flooded cells should take the lesser of their current value or this resultant number.
                                for (let i2 = 0; i2 < grid.width; i2++) {
                                    for (let j2 = 0; j2 < grid.height; j2++) {
                                        if (
                                            grid[i2][j2] &&
                                            cellCount <
                                                map.cells[i2][j2].chokeCount
                                        ) {
                                            map.cells[i2][
                                                j2
                                            ].chokeCount = cellCount;
                                            map.cells[i2][
                                                j2
                                            ].mechFlags &= ~FLAGS.CellMech
                                                .IS_GATE_SITE;
                                        }
                                    }
                                }

                                // The chokepoint itself should also take the lesser of its current value or the flood count.
                                if (cellCount < cell.chokeCount) {
                                    cell.chokeCount = cellCount;
                                    cell.mechFlags |=
                                        FLAGS.CellMech.IS_GATE_SITE;
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    GW.grid.free(passMap);
    GW.grid.free(grid);
}

// Assumes it is called with respect to a passable (startX, startY), and that the same is not already included in results.
// Returns 10000 if the area included an area machine.
export function floodFillCount(
    map: MAP.Map,
    results: GW.grid.NumGrid,
    passMap: GW.grid.NumGrid,
    startX: number,
    startY: number
) {
    let count = passMap[startX][startY] == 2 ? 5000 : 1;

    if (
        map.cells[startX][startY].mechFlags & FLAGS.CellMech.IS_IN_AREA_MACHINE
    ) {
        count = 10000;
    }

    results[startX][startY] = 1;

    for (let dir = 0; dir < 4; dir++) {
        const newX = startX + GW.utils.DIRS[dir][0];
        const newY = startY + GW.utils.DIRS[dir][1];

        if (
            map.hasXY(newX, newY) && // RUT.Map.makeValidXy(map, newXy) &&
            passMap[newX][newY] &&
            !results[newX][newY]
        ) {
            count += floodFillCount(map, results, passMap, newX, newY);
        }
    }
    return Math.min(count, 10000);
}

////////////////////////////////////////////////////////
////////////////////////////////////////////////////////
// TODO = Move loopiness to Map

export function updateLoopiness(map: MAP.Map) {
    map.forEach(resetLoopiness);
    map.forEach(checkLoopiness);
    cleanLoopiness(map);
}

export function resetLoopiness(
    cell: CELL.Cell,
    _x: number,
    _y: number,
    _map: MAP.Map
) {
    if (
        (cell.hasTileFlag(FLAGS.Tile.T_PATHING_BLOCKER) ||
            cell.hasLayerFlag(FLAGS.Entity.L_BLOCKS_MOVE)) &&
        !cell.hasLayerFlag(FLAGS.Entity.L_SECRETLY_PASSABLE)
    ) {
        cell.mechFlags &= ~FLAGS.CellMech.IS_IN_LOOP;
        // passMap[i][j] = false;
    } else {
        cell.mechFlags |= FLAGS.CellMech.IS_IN_LOOP;
        // passMap[i][j] = true;
    }
}

export function checkLoopiness(
    cell: CELL.Cell,
    x: number,
    y: number,
    map: MAP.Map
) {
    let inString;
    let newX, newY, dir, sdir;
    let numStrings, maxStringLength, currentStringLength;

    if (!cell || !(cell.mechFlags & FLAGS.CellMech.IS_IN_LOOP)) {
        return false;
    }

    // find an unloopy neighbor to start on
    for (sdir = 0; sdir < 8; sdir++) {
        newX = x + GW.utils.CLOCK_DIRS[sdir][0];
        newY = y + GW.utils.CLOCK_DIRS[sdir][1];

        if (!map.hasXY(newX, newY)) continue;

        const cell = map.get(newX, newY);
        if (!cell || !(cell.mechFlags & FLAGS.CellMech.IS_IN_LOOP)) {
            break;
        }
    }
    if (sdir == 8) {
        // no unloopy neighbors
        return false; // leave cell loopy
    }

    // starting on this unloopy neighbor,
    // work clockwise and count up:
    // (a) the number of strings of loopy neighbors, and
    // (b) the length of the longest such string.
    numStrings = maxStringLength = currentStringLength = 0;
    inString = false;
    for (dir = sdir; dir < sdir + 8; dir++) {
        newX = x + GW.utils.CLOCK_DIRS[dir % 8][0];
        newY = y + GW.utils.CLOCK_DIRS[dir % 8][1];
        if (!map.hasXY(newX, newY)) continue;

        const newCell = map.get(newX, newY);
        if (newCell && newCell.mechFlags & FLAGS.CellMech.IS_IN_LOOP) {
            currentStringLength++;
            if (!inString) {
                if (numStrings > 0) {
                    return false; // more than one string here; leave loopy
                }
                numStrings++;
                inString = true;
            }
        } else if (inString) {
            if (currentStringLength > maxStringLength) {
                maxStringLength = currentStringLength;
            }
            currentStringLength = 0;
            inString = false;
        }
    }

    if (inString && currentStringLength > maxStringLength) {
        maxStringLength = currentStringLength;
    }
    if (numStrings == 1 && maxStringLength <= 4) {
        cell.mechFlags &= ~FLAGS.CellMech.IS_IN_LOOP;

        for (dir = 0; dir < 8; dir++) {
            const newX = x + GW.utils.CLOCK_DIRS[dir][0];
            const newY = y + GW.utils.CLOCK_DIRS[dir][1];
            if (map.hasXY(newX, newY)) {
                const newCell = map.get(newX, newY);
                checkLoopiness(newCell, newX, newY, map);
            }
        }
        return true;
    } else {
        return false;
    }
}

export function fillInnerLoopGrid(map: MAP.Map, grid: GW.grid.NumGrid) {
    for (let x = 0; x < map.width; ++x) {
        for (let y = 0; y < map.height; ++y) {
            const cell = map.cells[x][y];
            if (cell.mechFlags & FLAGS.CellMech.IS_IN_LOOP) {
                grid[x][y] = 1;
            } else if (x > 0 && y > 0) {
                const up = map.cells[x][y - 1];
                const left = map.cells[x - 1][y];
                if (
                    up.mechFlags & FLAGS.CellMech.IS_IN_LOOP &&
                    left.mechFlags & FLAGS.CellMech.IS_IN_LOOP
                ) {
                    grid[x][y] = 1;
                }
            }
        }
    }
}

export function cleanLoopiness(map: MAP.Map) {
    // remove extraneous loop markings
    const grid = GW.grid.alloc(map.width, map.height);
    fillInnerLoopGrid(map, grid);

    // const xy = { x: 0, y: 0 };
    let designationSurvives;

    for (let i = 0; i < grid.width; i++) {
        for (let j = 0; j < grid.height; j++) {
            const cell = map.get(i, j);
            if (cell.mechFlags & FLAGS.CellMech.IS_IN_LOOP) {
                designationSurvives = false;
                for (let dir = 0; dir < 8; dir++) {
                    let newX = i + GW.utils.CLOCK_DIRS[dir][0];
                    let newY = j + GW.utils.CLOCK_DIRS[dir][1];

                    if (
                        map.hasXY(newX, newY) && // RUT.Map.makeValidXy(map, xy, newX, newY) &&
                        !grid[newX][newY] &&
                        !(
                            map.cells[newX][newY].mechFlags &
                            FLAGS.CellMech.IS_IN_LOOP
                        )
                    ) {
                        designationSurvives = true;
                        break;
                    }
                }
                if (!designationSurvives) {
                    grid[i][j] = 1;
                    map.cells[i][j].mechFlags &= ~FLAGS.CellMech.IS_IN_LOOP;
                }
            }
        }
    }
    GW.grid.free(grid);
}

////////////////////////////////////////////////////////
////////////////////////////////////////////////////////
