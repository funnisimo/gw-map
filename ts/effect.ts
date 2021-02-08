import * as GW from 'gw-utils';
import * as Cell from './cell';
import * as Map from './map';
import * as Tile from './tile';
import * as Entity from './entity';

const Flags = GW.effect.Flags;

export function makeTileEffect(config: any): GW.effect.EffectFn | null {
    if (!config) {
        GW.utils.ERROR('Config required to make tile effect.');
        return null;
    }
    if (typeof config === 'string') {
        config = config.split(/[,|]/).map((t) => t.trim());
    }
    if (Array.isArray(config)) {
        config = {
            id: config[0],
            spread: config[1] || 0,
            decrement: config[2] || 0,
        };
    }

    config.id = config.id || config.tile;
    config.spread = config.spread || 0;
    config.decrement = config.decrement || 0;
    if (config.spread >= 100 && config.decrement <= 0) {
        config.decrement = 100;
    }
    config.matchTile = config.matchTile || config.match || config.needs || null;
    config.volume = config.volume || 0;

    if (!config.id) {
        GW.utils.ERROR('id required to make tile effect.');
    }

    return tileEffect.bind(config);
}

GW.effect.installType('tile', makeTileEffect);

export interface TileEffectConfig {
    id: string;
    spread: number;
    decrement: number;
    matchTile?: string | null;
    volume: number;
}

export async function tileEffect(
    this: TileEffectConfig,
    effect: GW.effect.Effect,
    x: number,
    y: number
) {
    const id = this.id;
    const tile = Tile.tiles[id] || null;
    if (!tile) return false;

    const abortIfBlocking = !!(effect.flags & Flags.E_ABORT_IF_BLOCKS_MAP);
    const isBlocking = !!(
        abortIfBlocking &&
        !(effect.flags & Flags.E_PERMIT_BLOCKING) &&
        (tile.blocksPathing() || effect.flags & Flags.E_TREAT_AS_BLOCKING)
    );

    let didSomething = false;

    const map = effect.map as Map.Map;

    didSomething = computeSpawnMap(this, effect, x, y);

    if (!didSomething) {
        return false;
    }

    if (
        abortIfBlocking &&
        isBlocking &&
        map.gridDisruptsWalkability(effect.grid)
    ) {
        // GW.grid.free(spawnMap);
        return false;
    }

    if (effect.flags & Flags.E_EVACUATE_CREATURES) {
        // first, evacuate creatures, so that they do not re-trigger the tile.
        if (evacuateCreatures(map, effect.grid)) {
            didSomething = true;
        }
    }

    if (effect.flags & Flags.E_EVACUATE_ITEMS) {
        // first, evacuate items, so that they do not re-trigger the tile.
        if (evacuateItems(map, effect.grid)) {
            didSomething = true;
        }
    }

    if (effect.flags & Flags.E_CLEAR_CELL) {
        // first, clear other tiles (not base/ground)
        if (clearCells(map, effect.grid)) {
            didSomething = true;
        }
    }

    const spawned = spawnTiles(
        effect.flags,
        effect.grid,
        effect.map as Map.Map,
        tile,
        this.volume
    );

    if (spawned) {
        didSomething = true;
        // await spawnMap.forEachAsync( (v, x, y) => {
        //     if (!v) return;
        //     await map.applyInstantEffects(x, y);
        // });

        // if (applyEffects) {
        // if (PLAYER.xLoc == i && PLAYER.yLoc == j && !PLAYER.status.levitating && refresh) {
        // 	flavorMessage(tileFlavor(PLAYER.xLoc, PLAYER.yLoc));
        // }
        // if (cell.actor || cell.item) {
        // 	for(let t of cell.tiles()) {
        // 		await t.applyInstantEffects(map, i, j, cell);
        // 		if (Data.gameHasEnded) {
        // 			return true;
        // 		}
        // 	}
        // }
        // if (tile.flags & TileFlags.T_IS_FIRE) {
        // 	if (cell.flags & CellFlags.HAS_ITEM) {
        // 		theItem = map.itemAt(i, j);
        // 		if (theItem.flags & Flags.Item.ITEM_FLAMMABLE) {
        // 			await burnItem(theItem);
        // 		}
        // 	}
        // }
        // }
    }

    // GW.grid.free(spawnMap);

    return didSomething;
}

// tick

export async function fireAll(map: Map.Map, event: string) {
    const willFire = GW.grid.alloc(map.width, map.height);

    // Figure out which tiles will fire - before we change everything...
    map.forEach((cell, x, y) => {
        cell.clearFlags(0, Cell.MechFlags.EVENT_FIRED_THIS_TURN);
        for (let tile of cell.tiles()) {
            const effect = GW.effect.from(tile.activates[event]);
            if (!effect) continue;

            let promoteChance = 0;

            // < 0 means try to fire my neighbors...
            if (effect.chance < 0) {
                promoteChance = 0;
                map.eachNeighbor(
                    x,
                    y,
                    (n, _i, _j) => {
                        if (
                            !n.hasLayerFlag(Entity.Flags.L_BLOCKS_EFFECTS) &&
                            n.tileId(tile.layer) != cell.tileId(tile.layer) &&
                            !(
                                n.mechFlags &
                                Cell.MechFlags.CAUGHT_FIRE_THIS_TURN
                            )
                        ) {
                            // TODO - Should this break from the loop after doing this once or keep going?
                            promoteChance += -1 * effect.chance;
                        }
                    },
                    true
                );
            } else {
                promoteChance = effect.chance || 100 * 100; // 100%
            }
            if (
                !(cell.mechFlags & Cell.MechFlags.CAUGHT_FIRE_THIS_TURN) &&
                GW.random.chance(promoteChance, 10000)
            ) {
                willFire[x][y] |= GW.flag.fl(tile.layer);
                cell.mechFlags |= Cell.MechFlags.EVENT_FIRED_THIS_TURN;
            }
        }
    });

    // Then activate them - so that we don't activate the next generation as part of the forEach
    await willFire.forEachAsync(async (w, x, y) => {
        if (!w) return;
        const cell = map.cell(x, y);
        for (let layer = 0; layer <= Entity.Layer.GAS; ++layer) {
            if (w & GW.flag.fl(layer)) {
                await cell.activate(event, map, x, y, { force: true, layer });
            }
        }
    });

    GW.grid.free(willFire);
}

// Spawn

export function spawnTiles(
    flags: GW.effect.Flags,
    spawnMap: GW.grid.NumGrid,
    map: Map.Map,
    tile: Tile.Tile,
    volume = 0
) {
    let i, j;
    let accomplishedSomething;

    accomplishedSomething = false;

    const blockedByOtherLayers = flags & Flags.E_BLOCKED_BY_OTHER_LAYERS;
    const superpriority = flags & Flags.E_SUPERPRIORITY;
    // const applyEffects = ctx.refreshCell;
    volume = volume || 0; // (tile ? tile.volume : 0);

    for (i = 0; i < spawnMap.width; i++) {
        for (j = 0; j < spawnMap.height; j++) {
            if (!spawnMap[i][j]) continue; // If it's not flagged for building in the spawn map,
            const isRoot = spawnMap[i][j] === 1;
            spawnMap[i][j] = 0; // so that the spawnmap reflects what actually got built

            const cell = map.cell(i, j);
            if (
                cell.mechFlags & Cell.MechFlags.EVENT_FIRED_THIS_TURN &&
                !isRoot
            ) {
                continue;
            }

            if (cell.tile(tile.layer) === tile) {
                // If the new cell already contains the fill terrain,
                if (tile.layer == Entity.Layer.GAS) {
                    spawnMap[i][j] = 1;
                    cell.gasVolume += volume;
                } else if (tile.layer == Entity.Layer.LIQUID) {
                    spawnMap[i][j] = 1;
                    cell.liquidVolume += volume;
                }
            } else if (
                (superpriority ||
                    cell.tile(tile.layer).priority < tile.priority) && // If the terrain in the layer to be overwritten has a higher priority number (unless superpriority),
                !cell.obstructsLayer(tile.layer) && // If we will be painting into the surface layer when that cell forbids it,
                (!cell.item || !(flags & Flags.E_BLOCKED_BY_ITEMS)) &&
                (!cell.actor || !(flags & Flags.E_BLOCKED_BY_ACTORS)) &&
                (!blockedByOtherLayers ||
                    cell.topmostTile().priority < tile.priority) // TODO - highestPriorityTile()
            ) {
                // if the fill won't violate the priority of the most important terrain in this cell:
                spawnMap[i][j] = 1; // so that the spawnmap reflects what actually got built

                map.setTile(i, j, tile, volume);
                // map.redrawCell(cell);
                // if (volume && cell.gas) {
                //     cell.volume += (feat.volume || 0);
                // }

                // debug('- tile', i, j, 'tile=', tile.id);

                // cell.mechFlags |= Cell.MechFlags.EVENT_FIRED_THIS_TURN;
                accomplishedSomething = true;
            }
        }
    }
    if (accomplishedSomething) {
        map.changed = true;
    }
    return accomplishedSomething;
}

// Spread

function cellIsOk(
    config: TileEffectConfig,
    map: Map.Map,
    x: number,
    y: number,
    flags: GW.effect.Flags
) {
    if (!map.hasXY(x, y)) return false;
    const cell = map.cell(x, y);

    if (flags & Flags.E_BUILD_IN_WALLS) {
        if (!cell.isWall()) return false;
    } else if (flags & Flags.E_MUST_TOUCH_WALLS) {
        let ok = false;
        map.eachNeighbor(x, y, (c: Cell.Cell) => {
            if (c.isWall()) {
                ok = true;
            }
        });
        if (!ok) return false;
    } else if (flags & Flags.E_NO_TOUCH_WALLS) {
        let ok = true;
        if (cell.isWall()) return false; // or on wall
        map.eachNeighbor(x, y, (c: Cell.Cell) => {
            if (c.isWall()) {
                ok = false;
            }
        });
        if (!ok) return false;
    } else if (
        cell.blocksEffects() &&
        !config.matchTile // &&
        // (ctx.x != x || ctx.y != y)
    ) {
        return false;
    }

    // if (ctx.bounds && !ctx.bounds.containsXY(x, y)) return false;
    if (config.matchTile && !cell.hasTile(config.matchTile)) return false;

    return true;
}

export function computeSpawnMap(
    config: TileEffectConfig,
    effect: GW.effect.Effect,
    x: number,
    y: number
) {
    let i, j, dir, t, x2, y2;
    let madeChange;

    // const bounds = ctx.bounds || null;
    // if (bounds) {
    //   // Activation.debug('- bounds', bounds);
    // }

    const map: Map.Map = effect.map as Map.Map;
    const flags: GW.effect.Flags = effect.flags;
    const grid: GW.grid.NumGrid = effect.grid;

    let startProb = config.spread || 0;
    let probDec = config.decrement || 0;
    const spawnMap = grid;

    spawnMap.fill(0);
    spawnMap[x][y] = t = 1; // incremented before anything else happens
    let count = 1;

    if (startProb) {
        madeChange = true;
        if (startProb >= 100) {
            probDec = probDec || 100;
        }

        if (probDec <= 0) {
            probDec = startProb;
        }
        while (madeChange && startProb > 0) {
            madeChange = false;
            t++;
            for (i = 0; i < map.width; i++) {
                for (j = 0; j < map.height; j++) {
                    if (spawnMap[i][j] == t - 1) {
                        for (dir = 0; dir < 4; dir++) {
                            x2 = i + GW.utils.DIRS[dir][0];
                            y2 = j + GW.utils.DIRS[dir][1];
                            if (
                                spawnMap.hasXY(x2, y2) &&
                                !spawnMap[x2][y2] &&
                                cellIsOk(config, map, x2, y2, flags) &&
                                GW.random.chance(startProb)
                            ) {
                                spawnMap[x2][y2] = t;
                                madeChange = true;
                                ++count;
                            }
                        }
                    }
                }
            }
            startProb -= probDec;
        }
    }

    if (!cellIsOk(config, map, x, y, flags)) {
        spawnMap[x][y] = 0;
        --count;
    }

    return count > 0;
}

// export function spreadCircle(
//     this: any,
//     ctx: GW.effect.EffectCtx,
//     spawnMap: GW.grid.NumGrid
// ) {
//     const x = ctx.x;
//     const y = ctx.y;
//     let startProb = this.spread || 0;
//     let probDec = this.decrement || 0;

//     spawnMap.fill(0);
//     spawnMap[x][y] = 1; // incremented before anything else happens

//     let radius = 0;
//     startProb = startProb || 100;
//     if (startProb >= 100) {
//         probDec = probDec || 100;
//     }
//     while (GW.random.chance(startProb)) {
//         startProb -= probDec;
//         ++radius;
//     }
//     // startProb = 100;
//     // probDec = 0;

//     spawnMap.updateCircle(x, y, radius, (_v, i, j) => {
//         if (!cellIsOk(this, i, j, ctx)) return 0;

//         // const dist = Math.floor(Utils.distanceBetween(x, y, i, j));
//         // const prob = startProb - dist * probDec;
//         // if (!random.chance(prob)) return 0;
//         return 1;
//     });
//     // spawnMap[x][y] = 1;

//     // if (!isOk(flags, x, y, ctx)) {
//     //     spawnMap[x][y] = 0;
//     // }

//     return true;
// }

// export function spreadLine(
//     this: any,
//     ctx: GW.effect.EffectCtx,
//     spawnMap: GW.grid.NumGrid
// ) {
//     let x2, y2;
//     let madeChange;

//     const x = ctx.x;
//     const y = ctx.y;

//     let startProb = this.spread || 0;
//     let probDec = this.decrement || 0;

//     spawnMap.fill(0);
//     spawnMap[x][y] = 1; // incremented before anything else happens

//     if (startProb) {
//         madeChange = true;
//         if (startProb >= 100) {
//             probDec = probDec || 100;
//         }

//         x2 = x;
//         y2 = y;
//         const dir = GW.utils.DIRS[GW.random.number(4)];
//         while (madeChange) {
//             madeChange = false;
//             x2 = x2 + dir[0];
//             y2 = y2 + dir[1];
//             if (
//                 spawnMap.hasXY(x2, y2) &&
//                 !spawnMap[x2][y2] &&
//                 cellIsOk(this, x2, y2, ctx) &&
//                 GW.random.chance(startProb)
//             ) {
//                 spawnMap[x2][y2] = 1;
//                 madeChange = true;
//                 startProb -= probDec;
//             }
//         }
//     }

//     if (!cellIsOk(this, x, y, ctx)) {
//         spawnMap[x][y] = 0;
//     }

//     return true;
// }

export function clearCells(map: Map.Map, spawnMap: GW.grid.NumGrid) {
    let didSomething = false;
    spawnMap.forEach((v, i, j) => {
        if (!v) return;
        map.clearCell(i, j);
        didSomething = true;
    });
    return didSomething;
}

export function evacuateCreatures(map: Map.Map, blockingMap: GW.grid.NumGrid) {
    let i, j;

    let didSomething = false;
    for (i = 0; i < map.width; i++) {
        for (j = 0; j < map.height; j++) {
            if (!blockingMap[i][j]) continue;
            const cell = map.cell(i, j);
            if (!cell.actor) continue;
            const monst = cell.actor;
            const loc = map.matchingLocNear(
                i,
                j,
                (cell: Cell.Cell) => {
                    return !monst.forbidsCell(cell);
                },
                { hallways: true, blockingMap }
            );
            if (loc && loc[0] >= 0 && loc[1] >= 0) {
                map.moveActor(loc[0], loc[1], monst);
                // map.redrawXY(loc[0], loc[1]);
                didSomething = true;
            }
        }
    }
    return didSomething;
}

export function evacuateItems(map: Map.Map, blockingMap: GW.grid.NumGrid) {
    let didSomething = false;
    blockingMap.forEach((v: number, i: number, j: number) => {
        if (!v) return;
        const cell = map.cell(i, j);
        if (!cell.item) return;

        const item: GW.types.ItemType = cell.item;
        const loc = map.matchingLocNear(
            i,
            j,
            (dest: Cell.Cell) => {
                return !item.forbidsCell(dest);
            },
            { hallways: true, blockingMap }
        );
        if (loc && loc[0] >= 0 && loc[1] >= 0) {
            map.removeItem(item);
            map.addItem(loc[0], loc[1], item);
            // map.redrawXY(loc[0], loc[1]);
            didSomething = true;
        }
    });
    return didSomething;
}
