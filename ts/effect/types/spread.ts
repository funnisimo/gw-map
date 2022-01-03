import * as GWU from 'gw-utils';
import { Map } from '../../map/map';
import { BasicEffect } from './basic';
import { EffectCtx, MapXY, installType } from '../effect';
import * as Flags from '../../flags';

export function makeSpreadEffect(
    config: string | string[] | Record<string, any>
): SpreadEffect {
    return new SpreadEffect(config);
}

installType('spread', makeSpreadEffect);

export class SpreadEffect extends BasicEffect {
    grow = 0;
    decrement = 0;
    matchTile = '';

    constructor(config?: string | string[] | Record<string, any>) {
        super(config);
        if (!config) {
            config = { grow: 0, decrement: 0, flags: 0 };
        }
        if (typeof config === 'string') {
            config = config.split(':').map((t) => t.trim());
        }
        if (Array.isArray(config)) {
            if (config[0].toLowerCase() === 'spread') {
                config.shift();
            }
            config = {
                grow: config[0] || '0',
                decrement: config[1] || '100',
                flags: config[2] || '0',
            };
        } else if (
            typeof config.type === 'string' &&
            config.type.includes(':')
        ) {
            const parts = config.type.split(':').map((t) => t.trim());
            if (parts[0].toLowerCase() === 'spread') {
                parts.shift();
            }
            config.grow = parts[0] || '0';
            config.decrement = parts[1] || '100';
            config.flags = config.flags + '|' + parts[2];
        }

        this.grow = Number.parseInt(config.grow || 0);
        this.decrement = Number.parseInt(config.decrement || 100);
        this.flags = GWU.flag.from(Flags.Effect, config.flags || 0);
        this.matchTile = config.matchTile || '';
    }

    clone(): this {
        const other = super.clone();
        other.grow = this.grow;
        other.decrement = this.decrement;
        other.matchTile = this.matchTile;
        return other;
    }

    trigger(xy: MapXY, ctx: EffectCtx = {}): boolean {
        const abortIfBlocking = !!(
            this.flags & Flags.Effect.E_ABORT_IF_BLOCKS_MAP
        );

        let didSomething = false;
        const map = xy.map;

        const spawnMap = GWU.grid.alloc(map.width, map.height);
        didSomething = computeSpawnMap(this, xy, spawnMap);

        if (!didSomething) {
            GWU.grid.free(spawnMap);
            return false;
        }

        if (abortIfBlocking && mapDisruptedBy(map, spawnMap)) {
            GWU.grid.free(spawnMap);
            return false;
        }

        if (this.flags & Flags.Effect.E_EVACUATE_CREATURES) {
            // first, evacuate creatures, so that they do not re-trigger the tile.
            if (evacuateCreatures(map, spawnMap)) {
                didSomething = true;
            }
        }

        if (this.flags & Flags.Effect.E_EVACUATE_ITEMS) {
            // first, evacuate items, so that they do not re-trigger the tile.
            if (evacuateItems(map, spawnMap)) {
                didSomething = true;
            }
        }

        if (this.flags & Flags.Effect.E_CLEAR_CELL) {
            // first, clear other tiles (not base/ground)
            if (clearCells(map, spawnMap, this.flags)) {
                didSomething = true;
            }
        }

        spawnMap.forEach((v, x, y) => {
            if (!v) return;
            spawnMap[x][y] = 1; // convert from generations to off/on/success

            for (let eff of this.effects) {
                if (eff({ map, x, y }, ctx)) {
                    didSomething = true;
                    spawnMap[x][y] = 2;
                }
            }
        });

        if (this.next) {
            const nextAlways = !!(this.flags & Flags.Effect.E_NEXT_ALWAYS);
            if (didSomething || nextAlways) {
                if (this.flags & Flags.Effect.E_NEXT_EVERYWHERE) {
                    spawnMap.forEach((v, x, y) => {
                        if (!v) return;
                        if (v == 2 || nextAlways) {
                            this.next!.trigger({ map, x, y }, ctx);
                        }
                    });
                } else {
                    this.next.trigger({ map, x: xy.x, y: xy.y }, ctx);
                }
            }
        }

        GWU.grid.free(spawnMap);
        return didSomething;
    }
}

export function mapDisruptedBy(
    map: Map,
    blockingGrid: GWU.grid.NumGrid,
    blockingToMapX = 0,
    blockingToMapY = 0
) {
    const walkableGrid = GWU.grid.alloc(map.width, map.height);
    let disrupts = false;

    // Get all walkable locations after lake added
    GWU.xy.forRect(map.width, map.height, (i, j) => {
        const lakeX = i + blockingToMapX;
        const lakeY = j + blockingToMapY;
        if (blockingGrid.get(lakeX, lakeY)) {
            if (map.cell(i, j).isStairs()) {
                disrupts = true;
            }
        } else if (!map.cell(i, j).blocksMove()) {
            walkableGrid[i][j] = 1;
        }
    });

    let first = true;
    for (let i = 0; i < walkableGrid.width && !disrupts; ++i) {
        for (let j = 0; j < walkableGrid.height && !disrupts; ++j) {
            if (walkableGrid[i][j] == 1) {
                if (first) {
                    walkableGrid.floodFill(i, j, 1, 2);
                    first = false;
                } else {
                    disrupts = true;
                }
            }
        }
    }

    // console.log('WALKABLE GRID');
    // walkableGWU.grid.dump();

    GWU.grid.free(walkableGrid);
    return disrupts;
}

// Spread

function cellIsOk(
    effect: SpreadEffect,
    map: Map,
    x: number,
    y: number,
    isStart: boolean
) {
    if (!map.hasXY(x, y)) return false;
    const cell = map.cell(x, y);

    if (cell.hasCellFlag(Flags.Cell.EVENT_PROTECTED)) return false;

    if (cell.blocksEffects() && !effect.matchTile && !isStart) {
        return false;
    }

    if (effect.flags & Flags.Effect.E_BUILD_IN_WALLS) {
        if (!map.cell(x, y).isWall()) return false;
    } else if (effect.flags & Flags.Effect.E_MUST_TOUCH_WALLS) {
        let ok = false;
        GWU.xy.eachNeighbor(
            x,
            y,
            (i, j) => {
                if (map.cell(i, j).isWall()) {
                    ok = true;
                }
            },
            true
        );
        if (!ok) return false;
    } else if (effect.flags & Flags.Effect.E_NO_TOUCH_WALLS) {
        let ok = true;
        if (map.cell(x, y).isWall()) return false; // or on wall
        GWU.xy.eachNeighbor(
            x,
            y,
            (i, j) => {
                if (map.cell(i, j).isWall()) {
                    ok = false;
                }
            },
            true
        );
        if (!ok) return false;
    }

    // if (ctx.bounds && !ctx.bounds.containsXY(x, y)) return false;
    if (effect.matchTile && !isStart && !cell.hasTile(effect.matchTile)) {
        return false;
    }

    return true;
}

export function computeSpawnMap(
    effect: SpreadEffect,
    loc: MapXY,
    spawnMap: GWU.grid.NumGrid
) {
    let i, j, dir, t, x2, y2;
    let madeChange;

    // const bounds = ctx.bounds || null;
    // if (bounds) {
    //   // Activation.debug('- bounds', bounds);
    // }

    const map = loc.map;
    let startProb = effect.grow || 0;
    let probDec = effect.decrement || 0;

    spawnMap.fill(0);

    if (!cellIsOk(effect, map, loc.x, loc.y, true)) {
        return false;
    }

    spawnMap[loc.x][loc.y] = t = 1; // incremented before anything else happens
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
                            x2 = i + GWU.xy.DIRS[dir][0];
                            y2 = j + GWU.xy.DIRS[dir][1];
                            if (
                                spawnMap.hasXY(x2, y2) &&
                                !spawnMap[x2][y2] &&
                                map.rng.chance(startProb) &&
                                cellIsOk(effect, map, x2, y2, false)
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

    return count > 0;
}

export function clearCells(map: Map, spawnMap: GWU.grid.NumGrid, flags = 0) {
    let didSomething = false;
    const clearAll =
        (flags & Flags.Effect.E_CLEAR_CELL) === Flags.Effect.E_CLEAR_CELL;
    spawnMap.forEach((v, i, j) => {
        if (!v) return;

        const cell = map.cell(i, j);
        if (clearAll) {
            cell.clear();
        } else {
            if (flags & Flags.Effect.E_CLEAR_GAS) {
                cell.clearDepth(Flags.Depth.GAS);
            }
            if (flags & Flags.Effect.E_CLEAR_LIQUID) {
                cell.clearDepth(Flags.Depth.LIQUID);
            }
            if (flags & Flags.Effect.E_CLEAR_SURFACE) {
                cell.clearDepth(Flags.Depth.SURFACE);
            }
            if (flags & Flags.Effect.E_CLEAR_GROUND) {
                cell.clearDepth(Flags.Depth.GROUND);
            }
        }
        didSomething = true;
    });
    return didSomething;
}

export function evacuateCreatures(map: Map, blockingMap: GWU.grid.NumGrid) {
    let didSomething = false;
    map.eachActor((a) => {
        if (!blockingMap[a.x][a.y]) return;
        const loc = map.rng.matchingLocNear(a.x, a.y, (x, y) => {
            if (!map.hasXY(x, y)) return false;
            if (blockingMap[x][y]) return false;
            const c = map.cell(x, y);
            return !a.forbidsCell(c);
        });
        if (loc && loc[0] >= 0 && loc[1] >= 0) {
            map.removeActor(a);
            map.addActor(loc[0], loc[1], a);
            // map.redrawXY(loc[0], loc[1]);
            didSomething = true;
        }
    });
    return didSomething;
}

export function evacuateItems(map: Map, blockingMap: GWU.grid.NumGrid) {
    let didSomething = false;
    map.eachItem((i) => {
        if (!blockingMap[i.x][i.y]) return;
        const loc = map.rng.matchingLocNear(i.x, i.y, (x, y) => {
            if (!map.hasXY(x, y)) return false;
            if (blockingMap[x][y]) return false;
            const dest = map.cell(x, y);
            return !i.forbidsCell(dest);
        });
        if (loc && loc[0] >= 0 && loc[1] >= 0) {
            map.removeItem(i);
            map.addItem(loc[0], loc[1], i);
            // map.redrawXY(loc[0], loc[1]);
            didSomething = true;
        }
    });
    return didSomething;
}
