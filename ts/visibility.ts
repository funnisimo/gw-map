import * as GW from 'gw-utils';
import * as Flags from './mapFlags';
import * as Cell from './cell';
import * as Map from './map';

function demoteCellVisibility(cell: Cell.Cell) {
    cell.flags.cell &= ~(
        Flags.Cell.WAS_ANY_KIND_OF_VISIBLE | Flags.Cell.IN_FOV
    );
    if (cell.flags.cell & Flags.Cell.VISIBLE) {
        cell.flags.cell &= ~Flags.Cell.VISIBLE;
        cell.flags.cell |= Flags.Cell.WAS_VISIBLE;
    }
    if (cell.flags.cell & Flags.Cell.CLAIRVOYANT_VISIBLE) {
        cell.flags.cell &= ~Flags.Cell.CLAIRVOYANT_VISIBLE;
        cell.flags.cell |= Flags.Cell.WAS_CLAIRVOYANT_VISIBLE;
    }
    if (cell.flags.cell & Flags.Cell.TELEPATHIC_VISIBLE) {
        cell.flags.cell &= ~Flags.Cell.TELEPATHIC_VISIBLE;
        cell.flags.cell |= Flags.Cell.WAS_TELEPATHIC_VISIBLE;
    }
}

function _updateCellVisibility(
    cell: Cell.Cell,
    i: number,
    j: number,
    map: Map.Map
) {
    const isVisible = cell.flags.cell & Flags.Cell.VISIBLE;
    const wasVisible = cell.flags.cell & Flags.Cell.WAS_VISIBLE;

    if (isVisible && wasVisible) {
        if (cell.lightChanged) {
            map.redrawCell(cell);
        }
    } else if (isVisible && !wasVisible) {
        // if the cell became visible this move
        if (
            !(cell.flags.cell & Flags.Cell.REVEALED) &&
            GW.data.automationActive
        ) {
            if (cell.item) {
                const theItem: GW.types.ItemType = cell.item;
                if (theItem.hasLayerFlag(Flags.Entity.L_INTERRUPT_WHEN_SEEN)) {
                    GW.message.add('§you§ §see§ ΩitemMessageColorΩ§item§∆.', {
                        item: theItem,
                        actor: GW.data.player,
                    });
                }
            }
            if (
                !(cell.flags.cell & Flags.Cell.MAGIC_MAPPED) &&
                cell.hasLayerFlag(Flags.Entity.L_INTERRUPT_WHEN_SEEN)
            ) {
                const tile = cell.tileWithLayerFlag(
                    Flags.Entity.L_INTERRUPT_WHEN_SEEN
                );
                if (tile) {
                    GW.message.add(
                        '§you§ §see§ ΩbackgroundMessageColorΩ§item§∆.',
                        {
                            actor: GW.data.player,
                            item: tile.name,
                        }
                    );
                }
            }
        }
        map.markRevealed(i, j);
        map.redrawCell(cell);
    } else if (!isVisible && wasVisible) {
        // if the cell ceased being visible this move
        cell.storeMemory();
        map.redrawCell(cell);
    }
    return isVisible;
}

function _updateCellClairyvoyance(
    cell: Cell.Cell,
    _i: number,
    _j: number,
    map: Map.Map
) {
    const isClairy = cell.flags.cell & Flags.Cell.CLAIRVOYANT_VISIBLE;
    const wasClairy = cell.flags.cell & Flags.Cell.WAS_CLAIRVOYANT_VISIBLE;

    if (isClairy && wasClairy) {
        if (cell.lightChanged) {
            map.redrawCell(cell);
        }
    } else if (!isClairy && wasClairy) {
        // ceased being clairvoyantly visible
        cell.storeMemory();
        map.redrawCell(cell);
    } else if (!wasClairy && isClairy) {
        // became clairvoyantly visible
        cell.flags.cell &= ~Flags.Cell.STABLE_MEMORY;
        map.redrawCell(cell);
    }

    return isClairy;
}

function _updateCellTelepathy(
    cell: Cell.Cell,
    _i: number,
    _j: number,
    map: Map.Map
) {
    const isTele = cell.flags.cell & Flags.Cell.TELEPATHIC_VISIBLE;
    const wasTele = cell.flags.cell & Flags.Cell.WAS_TELEPATHIC_VISIBLE;

    if (isTele && wasTele) {
        if (cell.lightChanged) {
            map.redrawCell(cell);
        }
    } else if (!isTele && wasTele) {
        // ceased being telepathically visible
        cell.storeMemory();
        map.redrawCell(cell);
    } else if (!wasTele && isTele) {
        // became telepathically visible
        if (
            !(cell.flags.cell & Flags.Cell.REVEALED) &&
            !cell.hasTileFlag(Flags.Tile.T_PATHING_BLOCKER)
        ) {
            GW.data.xpxpThisTurn++;
        }
        cell.flags.cell &= ~Flags.Cell.STABLE_MEMORY;
        map.redrawCell(cell);
    }
    return isTele;
}

function _updateCellDetect(
    cell: Cell.Cell,
    _i: number,
    _j: number,
    map: Map.Map
) {
    const isMonst = cell.flags.cell & Flags.Cell.MONSTER_DETECTED;
    const wasMonst = cell.flags.cell & Flags.Cell.WAS_MONSTER_DETECTED;

    if (isMonst && wasMonst) {
        if (cell.lightChanged) {
            map.redrawCell(cell);
        }
    } else if (!isMonst && wasMonst) {
        // ceased being detected visible
        cell.flags.cell &= ~Flags.Cell.STABLE_MEMORY;
        map.redrawCell(cell);
        cell.storeMemory();
    } else if (!wasMonst && isMonst) {
        // became detected visible
        cell.flags.cell &= ~Flags.Cell.STABLE_MEMORY;
        map.redrawCell(cell);
        cell.storeMemory();
    }
    return isMonst;
}

function promoteCellVisibility(
    cell: Cell.Cell,
    i: number,
    j: number,
    map: Map.Map
) {
    if (
        cell.flags.cell & Flags.Cell.IN_FOV &&
        map.hasVisibleLight(i, j) &&
        !(cell.flags.cellMech & Flags.CellMech.DARKENED)
    ) {
        cell.flags.cell |= Flags.Cell.VISIBLE;
    }

    if (_updateCellVisibility(cell, i, j, map)) return;
    if (_updateCellClairyvoyance(cell, i, j, map)) return;
    if (_updateCellTelepathy(cell, i, j, map)) return;
    if (_updateCellDetect(cell, i, j, map)) return;
}

export function initMap(map: Map.Map) {
    if (!(map.flags.map & Map.Flags.MAP_CALC_FOV)) {
        map.setFlags(0, Flags.Cell.REVEALED | Flags.Cell.VISIBLE);
        return;
    }

    map.clearFlags(0, Flags.Cell.IS_WAS_ANY_KIND_OF_VISIBLE);
}

export function update(map: Map.Map, x: number, y: number, maxRadius: number) {
    if (!(map.flags.map & Map.Flags.MAP_CALC_FOV) || !map.fov) return false;

    if (x == map.fov.x && y == map.fov.y) {
        if (!(map.flags.map & Flags.Map.MAP_FOV_CHANGED)) return false;
    }
    map.flags.map &= ~Flags.Map.MAP_FOV_CHANGED;
    map.fov.x = x;
    map.fov.y = y;

    map.forEach(demoteCellVisibility);

    // Calculate player's field of view (distinct from what is visible, as lighting hasn't been done yet).
    const grid = GW.grid.alloc(map.width, map.height, 0);
    map.calcFov(grid, x, y, maxRadius);
    grid.forEach((v, i, j) => {
        if (v) {
            map.setCellFlags(i, j, Flags.Cell.IN_FOV);
        }
    });
    GW.grid.free(grid);

    map.setCellFlags(x, y, Flags.Cell.IN_FOV | Flags.Cell.VISIBLE);

    // if (PLAYER.bonus.clairvoyance < 0) {
    //   discoverCell(PLAYER.xLoc, PLAYER.yLoc);
    // }
    //
    // if (PLAYER.bonus.clairvoyance != 0) {
    // 	updateClairvoyance();
    // }
    //
    // updateTelepathy();
    // updateMonsterDetection();

    // updateLighting();
    map.forEach(promoteCellVisibility);

    // if (PLAYER.status.hallucinating > 0) {
    // 	for (theItem of DUNGEON.items) {
    // 		if ((pmap[theItem.xLoc][theItem.yLoc].flags & DISCOVERED) && refreshDisplay) {
    // 			refreshDungeonCell(theItem.xLoc, theItem.yLoc);
    // 		}
    // 	}
    // 	for (monst of DUNGEON.monsters) {
    // 		if ((pmap[monst.xLoc][monst.yLoc].flags & DISCOVERED) && refreshDisplay) {
    // 			refreshDungeonCell(monst.xLoc, monst.yLoc);
    // 		}
    // 	}
    // }
    return true;
}
