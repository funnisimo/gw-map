import 'jest-extended';
import '../../../test/matchers';
import * as UTILS from '../../../test/utils';
import * as GWU from 'gw-utils';

import * as Map from '../../map';
import * as Tile from '../../tile';

import * as Spread from './spread';
import * as Effect from '../effect';
import * as Flags from '../../flags';

import '../../tile/tiles';

describe('spread type', () => {
    let map: Map.Map;
    let grid: GWU.grid.NumGrid;

    beforeEach(() => {
        map = Map.make(20, 20, 'FLOOR', 'WALL');

        GWU.data.gameHasEnded = false;

        GWU.rng.random.seed(12345);
        map.events.removeAllListeners();
        grid = GWU.grid.alloc(20, 20);
    });

    afterEach(() => {
        GWU.grid.free(grid);
    });

    describe('compute spread map', () => {
        test('0:0', () => {
            const fn = jest.fn().mockReturnValue(true);
            const effect = Spread.makeSpreadEffect({
                type: 'SPREAD:0:0',
                effects: fn,
            });
            const ctx = { map, x: 5, y: 6 };

            expect(effect.grow).toEqual(0);
            expect(effect.decrement).toEqual(0);

            expect(Spread.computeSpawnMap(effect, ctx, grid)).toBeTruthy();

            expect(grid.count((v) => !!v)).toEqual(1);
            expect(grid[ctx.x][ctx.y]).toEqual(1);
            grid.eachNeighbor(ctx.x, ctx.y, (v) => expect(v).toEqual(0), true);
        });

        test('100:100', () => {
            const fn = jest.fn().mockReturnValue(true);
            const effect = Spread.makeSpreadEffect({
                type: 'SPREAD:100:100',
                effects: fn,
            });
            const ctx = { map, x: 5, y: 6 };

            expect(effect.grow).toEqual(100);
            expect(effect.decrement).toEqual(100);

            expect(Spread.computeSpawnMap(effect, ctx, grid)).toBeTruthy();

            expect(grid.count((v) => !!v)).toEqual(5);
            expect(grid[ctx.x][ctx.y]).toEqual(1);
            grid.eachNeighbor(ctx.x, ctx.y, (v) => expect(v).toEqual(2), true);
        });

        test('200:100', () => {
            const fn = jest.fn().mockReturnValue(true);
            const effect = Spread.makeSpreadEffect({
                type: 'SPREAD:200:100',
                effects: fn,
            });
            const ctx = { map, x: 5, y: 6 };

            expect(effect.grow).toEqual(200);
            expect(effect.decrement).toEqual(100);

            expect(Spread.computeSpawnMap(effect, ctx, grid)).toBeTruthy();

            expect(grid.count((v) => !!v)).toEqual(1 + 4 + 8);
            expect(grid[ctx.x][ctx.y]).toEqual(1);
            grid.eachNeighbor(ctx.x, ctx.y, (v) => expect(v).toEqual(2), true);
            expect(grid.count(3)).toEqual(8);
        });

        test('build in walls', () => {
            // not on a wall
            const fn = jest.fn().mockReturnValue(true);
            const effect = Spread.makeSpreadEffect({
                type: 'SPREAD:100:100:E_BUILD_IN_WALLS',
                effects: fn,
            });
            const ctx = { map, x: 5, y: 6 };

            expect(effect.flags & Flags.Effect.E_BUILD_IN_WALLS).toBeTruthy();
            expect(Spread.computeSpawnMap(effect, ctx, grid)).toBeFalsy();
            expect(grid.count(1)).toEqual(0);
            expect(grid.count(0)).toEqual(map.width * map.height);

            // wall
            map.setTile(ctx.x, ctx.y, 'WALL');

            expect(Spread.computeSpawnMap(effect, ctx, grid)).toBeTruthy();

            expect(grid.count(1)).toEqual(1);
            expect(grid.count(0)).toEqual(map.width * map.height - 1);
            expect(grid[ctx.x][ctx.y]).toEqual(1);
        });

        test('must touch walls', () => {
            // not near a wall
            const fn = jest.fn().mockReturnValue(true);
            const effect = Spread.makeSpreadEffect({
                type: 'SPREAD:100:100:E_MUST_TOUCH_WALLS',
                effects: fn,
            });

            const ctx = { map, x: 5, y: 6 };

            expect(effect.flags & Flags.Effect.E_MUST_TOUCH_WALLS).toBeTruthy();
            expect(Spread.computeSpawnMap(effect, ctx, grid)).toBeFalsy();
            expect(grid.count(1)).toEqual(0);
            expect(grid.count(2)).toEqual(0);
            expect(grid.count(0)).toEqual(map.width * map.height);

            // not on a wall
            map.setTile(ctx.x, ctx.y, 'WALL');
            expect(Spread.computeSpawnMap(effect, ctx, grid)).toBeFalsy();
            expect(grid.count(1)).toEqual(0);
            expect(grid.count(2)).toEqual(0);
            expect(grid.count(0)).toEqual(map.width * map.height);
            expect(grid[ctx.x][ctx.y]).toEqual(0);

            // next to a wall
            map.setTile(ctx.x, ctx.y, 'FLOOR', true);
            map.setTile(ctx.x, ctx.y - 1, 'WALL');
            expect(Spread.computeSpawnMap(effect, ctx, grid)).toBeTruthy();

            // map.dump();
            // grid.dump();
            expect(grid.count(1)).toEqual(1);
            expect(grid.count(2)).toEqual(0);
            expect(grid.count(0)).toEqual(map.width * map.height - 1);
            expect(grid[ctx.x][ctx.y]).toEqual(1);
        });

        test('no touch walls', () => {
            const fn = jest.fn().mockReturnValue(true);
            const effect = Spread.makeSpreadEffect({
                type: 'SPREAD:100:100:E_NO_TOUCH_WALLS',
                effects: fn,
            });

            const ctx = { map, x: 5, y: 6 };

            expect(effect.flags & Flags.Effect.E_NO_TOUCH_WALLS).toBeTruthy();

            // no walls - ok
            expect(Spread.computeSpawnMap(effect, ctx, grid)).toBeTruthy();
            expect(grid.count(1)).toEqual(1);
            expect(grid.count((v) => !!v)).toEqual(5);
            expect(grid[ctx.x][ctx.y]).toEqual(1);

            // on a wall - no
            map.setTile(ctx.x, ctx.y, 'WALL');
            expect(Spread.computeSpawnMap(effect, ctx, grid)).toBeFalsy();
            expect(grid.count(1)).toEqual(0);
            expect(grid.count(0)).toEqual(map.width * map.height);
            expect(grid[ctx.x][ctx.y]).toEqual(0);

            // next to a wall - no
            map.setTile(ctx.x, ctx.y, 'FLOOR', true);
            map.setTile(ctx.x, ctx.y - 1, 'WALL');
            expect(Spread.computeSpawnMap(effect, ctx, grid)).toBeFalsy();
            expect(grid.count(1)).toEqual(0);
            expect(grid.count(0)).toEqual(map.width * map.height);
            expect(grid[ctx.x][ctx.y]).toEqual(0);
        });

        test('spread map - blocks effects', () => {
            const fn = jest.fn().mockReturnValue(true);
            const effect = Spread.makeSpreadEffect({
                type: 'SPREAD:100:100:E_NO_TOUCH_WALLS',
                effects: fn,
            });
            const ctx = { map, x: 5, y: 6 };

            // ok
            expect(Spread.computeSpawnMap(effect, ctx, grid)).toBeTruthy();
            expect(grid.count(1)).toEqual(1);
            expect(grid.count(2)).toEqual(4);
            expect(grid[ctx.x][ctx.y]).toEqual(1);
            grid.eachNeighbor(ctx.x, ctx.y, (v) => expect(v).toEqual(2), true);

            // blocks effects
            const tile = Tile.make({
                id: 'TEST',
                ch: '!',
                fg: 'green',
                flags: 'L_BLOCKS_EFFECTS',
            });

            map.setTile(ctx.x, ctx.y - 1, tile);
            map.setTile(ctx.x - 1, ctx.y, tile);

            expect(
                map
                    .cell(ctx.x, ctx.y - 1)
                    .hasEntityFlag(Flags.Entity.L_BLOCKS_EFFECTS)
            ).toBeTruthy();
            expect(
                map
                    .cell(ctx.x - 1, ctx.y)
                    .hasEntityFlag(Flags.Entity.L_BLOCKS_EFFECTS)
            ).toBeTruthy();

            let cell = map.cell(ctx.x - 1, ctx.y);
            expect(cell.blocksEffects()).toBeTruthy();
            cell = map.cell(ctx.x, ctx.y - 1);
            expect(cell.blocksEffects()).toBeTruthy();

            expect(effect.matchTile).toBeFalsy();

            expect(Spread.computeSpawnMap(effect, ctx, grid)).toBeTruthy();
            expect(grid.count(1)).toEqual(1);
            expect(grid.count(2)).toEqual(2);
            expect(grid[ctx.x][ctx.y]).toEqual(1);
            expect(grid[ctx.x - 1][ctx.y]).toEqual(0);
            expect(grid[ctx.x + 1][ctx.y]).toEqual(2);
            expect(grid[ctx.x][ctx.y - 1]).toEqual(0);
            expect(grid[ctx.x][ctx.y + 1]).toEqual(2);
        });

        // { spread: 50 }
        test('50:0', () => {
            GWU.rng.random.seed(12345);
            const fn = jest.fn().mockReturnValue(true);
            const effect = Spread.makeSpreadEffect({
                type: 'SPREAD:50:0',
                effects: fn,
            });

            const ctx = { map, x: 10, y: 10 };

            expect(Spread.computeSpawnMap(effect, ctx, grid)).toBeTruthy();

            // grid.dump();
            expect(grid.count((v) => !!v)).toEqual(3);
            expect(grid[10][10]).toEqual(1);
            expect(grid[10][9]).toEqual(2);
            expect(grid[10][11]).toEqual(0);
        });

        // { spread: 100, decrement: 100, matchTile: "DOOR" }
        test('100:10, matchTile: "DOOR"', () => {
            GWU.rng.random.seed(12345);

            const fn = jest.fn().mockReturnValue(true);
            const effect = Spread.makeSpreadEffect({
                type: 'SPREAD:100:10',
                effects: fn,
            });
            effect.matchTile = 'DOOR';

            const ctx = { map, x: 10, y: 10 };

            expect(Spread.computeSpawnMap(effect, ctx, grid)).toBeTruthy(); // always match center?

            // grid.dump();
            expect(grid.count((v) => !!v)).toEqual(1); // There are no doors!

            map.setTile(9, 10, 'DOOR');
            // map.setTile(11, 10, 'DOOR');
            map.setTile(10, 9, 'DOOR');
            // map.setTile(10, 11, 'DOOR');

            grid.fill(0);

            expect(Spread.computeSpawnMap(effect, ctx, grid)).toBeTruthy();
            // grid.dump();
            expect(grid.count((v) => !!v)).toEqual(3); // match some doors
        });

        // { spread: 50, decrement: 10 }
        test('50:10', () => {
            GWU.rng.random.seed(12345);
            const fn = jest.fn().mockReturnValue(true);
            const effect = Spread.makeSpreadEffect({
                type: 'SPREAD:50:10',
                effects: fn,
            });
            const ctx = { map, x: 10, y: 10 };

            expect(Spread.computeSpawnMap(effect, ctx, grid)).toBeTruthy();
            // grid.dump();
            expect(grid.count((v) => !!v)).toEqual(5);
            expect(grid[10][10]).toEqual(1);
            expect(grid[9][8]).toEqual(0);
            expect(grid[10][8]).toEqual(3);
        });
    });

    describe('spreadTiles', () => {
        // test('will fill a map with a spread map', () => {
        //     grid.fillRect(5, 5, 3, 3, 1);
        //     GWU.xy.forRect(5, 5, 3, 3, (x, y) => {
        //         const cell = map.cell(x, y);
        //         expect(cell.hasTile('WALL')).toBeFalsy();
        //     });
        //     Spawn.spawnTiles(0, grid, map, Tile.tiles.WALL);
        //     GWU.xy.forRect(5, 5, 3, 3, (x, y) => {
        //         const cell = map.cell(x, y);
        //         expect(cell.hasTile('WALL')).toBeTruthy();
        //         // expect(cell.mechFlags & Map.cell.MechFlags.EVENT_FIRED_THIS_TURN).toBeTruthy();
        //     });
        // });
        // test('gas adds volume',  () => {
        //     grid.fillRect(5, 5, 3, 3, 1);
        //     Tile.install('RED_GAS', {
        //         bg: 'red',
        //         depth: 'GAS',
        //     });
        //     GWU.xy.forRect(5, 5, 3, 3, (x, y) => {
        //         const cell = map.cell(x, y);
        //         expect(cell.hasTile('RED_GAS')).toBeFalsy();
        //     });
        //     Spawn.spawnTiles(0, grid, map, Tile.tiles.RED_GAS, 10);
        //     GWU.xy.forRect(5, 5, 3, 3, (x, y) => {
        //         const cell = map.cell(x, y);
        //         expect(cell.hasTile('RED_GAS')).toBeTruthy();
        //         expect(cell.gasVolume).toEqual(10);
        //     });
        //     Spawn.spawnTiles(0, grid, map, Tile.tiles.RED_GAS, 10);
        //     GWU.xy.forRect(5, 5, 3, 3, (x, y) => {
        //         const cell = map.cell(x, y);
        //         expect(cell.hasTile('RED_GAS')).toBeTruthy();
        //         expect(cell.gasVolume).toEqual(20);
        //     });
        // });
        // test('liquid adds volume',  () => {
        //     grid.fillRect(5, 5, 3, 3, 1);
        //     Tile.install('RED_LIQUID', {
        //         bg: 'red',
        //         depth: 'LIQUID',
        //     });
        //     GWU.xy.forRect(5, 5, 3, 3, (x, y) => {
        //         const cell = map.cell(x, y);
        //         expect(cell.hasTile('RED_LIQUID')).toBeFalsy();
        //     });
        //     Spawn.spawnTiles(0, grid, map, Tile.tiles.RED_LIQUID, 10);
        //     GWU.xy.forRect(5, 5, 3, 3, (x, y) => {
        //         const cell = map.cell(x, y);
        //         expect(cell.hasTile('RED_LIQUID')).toBeTruthy();
        //         expect(cell.liquidVolume).toEqual(10);
        //     });
        //     Spawn.spawnTiles(0, grid, map, Tile.tiles.RED_LIQUID, 10);
        //     GWU.xy.forRect(5, 5, 3, 3, (x, y) => {
        //         const cell = map.cell(x, y);
        //         expect(cell.hasTile('RED_LIQUID')).toBeTruthy();
        //         expect(cell.liquidVolume).toEqual(20);
        //     });
        // });
    });

    describe('fire', () => {
        test('tile', () => {
            const effect = Effect.make('TILE:WALL');
            const ctx = { map, x: 10, y: 10 };

            expect(map.cell(ctx.x, ctx.y).hasTile('WALL')).toBeFalsy();
            expect(expect(effect.trigger(ctx))).toBeTruthy();

            expect(map.cell(ctx.x, ctx.y).hasTile('WALL')).toBeTruthy();
            GWU.xy.eachNeighbor(ctx.x, ctx.y, (x, y) => {
                const cell = map.cell(x, y);
                expect(cell.hasTile('WALL')).toBeFalsy();
            });
        });

        test('tile and neighbors - string', () => {
            const effect = Effect.make({
                type: 'SPREAD:100:100',
                tile: 'WALL',
            });
            const ctx = { map, x: 10, y: 10 };

            expect(map.cell(ctx.x, ctx.y).hasTile('WALL')).toBeFalsy();
            expect(effect.trigger(ctx)).toBeTruthy();

            expect(map.cell(ctx.x, ctx.y).hasTile('WALL')).toBeTruthy();
            GWU.xy.eachNeighbor(
                ctx.x,
                ctx.y,
                (x, y) => {
                    const cell = map.cell(x, y);
                    expect(cell.hasTile('WALL')).toBeTruthy();
                },
                true
            );
        });

        test('tile and neighbors - object', () => {
            const effect = Effect.make({
                type: 'SPREAD:100:100',
                tile: 'WALL',
            });
            const ctx = { map, x: 10, y: 10 };

            expect(map.cell(ctx.x, ctx.y).hasTile('WALL')).toBeFalsy();
            expect(effect.trigger(ctx)).toBeTruthy();
            expect(map.cell(ctx.x, ctx.y).hasTile('WALL')).toBeTruthy();
            GWU.xy.eachNeighbor(
                ctx.x,
                ctx.y,
                (x, y) => {
                    const c = map.cell(x, y);
                    expect(c.hasTile('WALL')).toBeTruthy();
                },
                true
            );
        });

        test('can clear extra tiles from the cell', () => {
            const effect = Effect.make({
                type: 'SPREAD:0:0:E_CLEAR_CELL',
                tile: 'FLOOR',
            });
            const ctx = { map, x: 10, y: 10 };

            map.setTile(ctx.x, ctx.y, 'BRIDGE');
            const cell = map.cell(ctx.x, ctx.y);
            expect(cell.depthTile(Flags.Depth.SURFACE)!.id).toEqual('BRIDGE');
            expect(cell.depthTile(Flags.Depth.GROUND)!.id).toEqual('LAKE');

            expect(effect.trigger(ctx)).toBeTruthy();
            expect(cell.depthTile(Flags.Depth.GROUND)!.id).toEqual('FLOOR');
            expect(cell.depthTile(Flags.Depth.SURFACE)).toBeNull();
        });

        // test('Will add liquids with volume',  () => {
        //     Tile.install('RED_LIQUID', {
        //         name: 'red liquid',
        //         article: 'some',
        //         bg: 'red',
        //         depth: 'LIQUID',
        //     });

        //     effect = Effect.make({
        //         tile: { id: 'RED_LIQUID', volume: 50 },
        //     })!;
        //      expect(
        //         Effect.fire(info, ctx, grid)
        //     ).resolves.toBeTruthy();

        //     const cell = map.cell(ctx.x, ctx.y);
        //     expect(cell.liquid).toEqual('RED_LIQUID');
        //     expect(cell.liquidVolume).toEqual(50);
        // });
    });

    describe('cell effects', () => {
        test('effect fn', () => {
            const fn = jest.fn().mockReturnValue(true);
            Tile.install('ALTAR', {
                name: 'altar',
                article: 'the',
                bg: 'red',
                depth: 'SURFACE',
                effects: {
                    fire: fn,
                },
            });

            const ctx = { map, x: 10, y: 10 };

            const cell = map.cell(ctx.x, ctx.y);
            map.setTile(ctx.x, ctx.y, 'ALTAR');

            expect(cell.fireEvent('fire')).toBeTruthy();
            expect(fn).toHaveBeenCalledTimes(1);
        });

        test('evacuateCreatures', () => {
            Tile.install('ALTAR', {
                name: 'altar',
                article: 'the',
                bg: 'red',
                depth: 'SURFACE',
                effects: {
                    fire: {
                        type: 'SPREAD:0:0:E_EVACUATE_CREATURES',
                        tile: 'FLOOR',
                    },
                },
            });

            const ctx = { map, x: 10, y: 10 };

            const cell = map.cell(ctx.x, ctx.y);
            map.setTile(ctx.x, ctx.y, 'ALTAR');
            const actor = UTILS.mockActor();

            map.addActor(ctx.x, ctx.y, actor);
            expect(actor).toBeAtXY(ctx.x, ctx.y);
            expect(cell.hasActor()).toBeTruthy();

            cell.fireEvent('fire');
            expect(actor).not.toBeAtXY(ctx.x, ctx.y);
            expect(cell.hasActor()).toBeFalsy();
            expect(actor.forbidsCell).toHaveBeenCalled();
        });

        test('evacuateItems', () => {
            Tile.install('ALTAR', {
                name: 'altar',
                article: 'some',
                bg: 'red',
                depth: 'SURFACE',
                effects: {
                    fire: {
                        type: 'SPREAD:0:0:E_EVACUATE_ITEMS',
                        tile: 'FLOOR',
                    },
                },
            });

            const ctx = { map, x: 10, y: 10 };

            const cell = map.cell(ctx.x, ctx.y);
            map.setTile(ctx.x, ctx.y, 'ALTAR');

            const item = UTILS.mockItem();

            map.addItem(ctx.x, ctx.y, item);
            expect(item).toBeAtXY(ctx.x, ctx.y);
            expect(cell.hasItem()).toBeTruthy();

            cell.fireEvent('fire');
            expect(item.forbidsCell).toHaveBeenCalled();
            expect(item).not.toBeAtXY(ctx.x, ctx.y);
            expect(cell.hasItem()).toBeFalsy();
        });
    });

    // describe('waves', () => {
    //     beforeAll(() => {
    //         Tile.install('WAVE_DONE', {
    //             ch: 'X',
    //             fg: 'blue',
    //             bg: 'green',
    //             priority: 70,
    //             flags: 'T_DEEP_WATER',
    //             name: 'water',
    //             article: 'some',
    //             effects: {
    //                 tick: {
    //                     tile: 'LAKE',
    //                     flags: 'E_SUPERPRIORITY, E_PROTECTED',
    //                 },
    //             },
    //         });
    //         Tile.install('WAVE', {
    //             ch: 'W',
    //             fg: 'white',
    //             bg: 'blue',
    //             priority: 60,
    //             flags: 'T_DEEP_WATER',
    //             name: 'wave crest',
    //             article: 'the',
    //             effects: {
    //                 tick: {
    //                     tile: {
    //                         id: 'WAVE',
    //                         match: 'LAKE',
    //                         spread: 100,
    //                         decrement: 100,
    //                     },
    //                     flags: 'E_NEXT_ALWAYS',
    //                     next: { tile: 'WAVE_DONE' },
    //                 },
    //             },
    //         });
    //     });

    //     afterAll(() => {
    //         delete Tile.tiles.WAVE_DONE;
    //         delete Tile.tiles.WAVE;
    //     });

    //     test('tiles installed', () => {
    //         expect(Tile.tiles.WAVE).toBeDefined();
    //         expect(Tile.tiles.WAVE.effects.tick).toBeDefined();
    //         expect(Tile.tiles.WAVE_DONE).toBeDefined();
    //         expect(Tile.tiles.WAVE_DONE.effects.tick).toBeDefined();
    //     });

    //     test('can do waves',  () => {
    //         map.fill('LAKE');
    //         map.setTile(10, 10, 'WAVE');

    //          map.tick();
    //         // map.dump();
    //         expect(map.hasTile(10, 10, 'WAVE_DONE')).toBeTruthy();
    //         expect(map.count((c) => c.hasTile('WAVE_DONE'))).toEqual(1);
    //         expect(map.count((c) => c.hasTile('WAVE'))).toEqual(4);

    //          map.tick();
    //         // map.dump();
    //         expect(map.cell(10, 10).depthTile(Flags.Depth.GROUND).id).toEqual('LAKE');
    //         expect(map.count((c) => c.hasTile('WAVE_DONE'))).toEqual(4);
    //         expect(map.count((c) => c.hasTile('WAVE'))).toEqual(8);

    //          map.tick();
    //         // map.dump();
    //         expect(map.cell(10, 10).depthTile(Flags.Depth.GROUND).id).toEqual('LAKE');
    //         expect(map.count((c) => c.hasTile('WAVE_DONE'))).toEqual(8);
    //         expect(map.count((c) => c.hasTile('WAVE'))).toEqual(12);

    //          map.tick();
    //         // map.dump();
    //         expect(map.hasTile(10, 10, 'LAKE')).toBeTruthy();
    //         expect(map.count((c) => c.hasTile('WAVE_DONE'))).toEqual(12);
    //         expect(map.count((c) => c.hasTile('WAVE'))).toEqual(16);

    //         for (let i = 0; i < 5; ++i) {
    //              map.tick();
    //         }

    //         // map.dump();
    //          map.tick();
    //         // map.dump();

    //         expect(map.hasTile(19, 10, 'WAVE_DONE')).toBeTruthy();

    //         // expect(map.count( (c) => c.hasTile(WAVE)).toEqual(0);
    //     });
    // });

    /*
    test('abort if blocking',  () => {
        Tile.install('PRESSURE_PLATE', {
            extends: 'FLOOR',
            priority: '+10',
            ch: '^',
            fg: 0x00f,
            flags: 'T_IS_TRAP, L_LIST_IN_SIDEBAR, L_VISUALLY_DISTINCT',
            effects: {
                enter: {
                    activateMachine: true,
                    message: 'the pressure plate clicks.',
                    tile: 'PRESSURE_PLATE_DEPRESSED',
                },
            },
        });

        Tile.install('PRESSURE_PLATE_DEPRESSED', {
            extends: 'FLOOR',
            priority: '+10',
            ch: 'v',
            fg: 0x00f,
            effects: {
                exit: { tile: 'PRESSURE_PLATE' },
            },
        });

        Tile.install('CHASM', {
            extends: 'FLOOR',
            priority: '+2',
            ch: ' ',
            flavor: 'a chasm',
            flags: 'T_AUTO_DESCENT',
        });

        Tile.install('CHASM_EDGE', {
            extends: 'FLOOR',
            priority: '+1',
            ch: ':',
            fg: 0x777,
            flavor: 'a chasm edge',
        });

        Effect.install('CHASM_EDGE', { tile: 'CHASM_EDGE,100' });
        Effect.install('CHASM_MEDIUM', {
            tile: 'CHASM,150,50',
            flags: 'E_NEXT_EVERYWHERE, E_ABORT_IF_BLOCKS_MAP',
            next: 'CHASM_EDGE',
        });
        const holeEffect = Effect.install('HOLE_WITH_PLATE', {
            effect: 'CHASM_MEDIUM',
            next: { tile: 'PRESSURE_PLATE' },
        });

        const map = Map.make(21, 11, { tile: 'WALL' });

        GWU.xy.forRect(1, 1, 9, 9, (x, y) => map.forceTile(x, y, 'FLOOR'));
        GWU.xy.forRect(11, 1, 9, 9, (x, y) => map.forceTile(x, y, 'FLOOR'));
        map.forceTile(10, 3, 'FLOOR');

        jest.spyOn(Effect.handlers.effect, 'fire');

        expect(holeEffect.effect).toEqual('CHASM_MEDIUM');

        GWU.rng.random.seed(12345);
        let result =  Effect.fire('HOLE_WITH_PLATE', map, 9, 4);

        expect(Effect.handlers.effect.fire).toHaveBeenCalledTimes(2); // HOLE_WITH_PLATE -> CHASM_MEDIUM
        expect(result).toBeFalsy();
        expect(Effect.handlers.effect.fire).toHaveBeenCalledWith(
            Effect.effects.CHASM_MEDIUM,
            map,
            9,
            4,
            expect.any(Object)
        );
        expect(map.cells.count((c) => c.hasTile('CHASM'))).toEqual(0);
        expect(map.cells.count((c) => c.hasTile('CHASM_EDGE'))).toEqual(0);
        expect(map.cells.count((c) => c.hasTile('PRESSURE_PLATE'))).toEqual(0);

        result =  Effect.fire('HOLE_WITH_PLATE', map, 3, 8);

        // map.dump();

        expect(result).toBeTruthy();
        expect(map.cells.count((c) => c.hasTile('CHASM'))).toBeGreaterThan(0);
        expect(map.cells.count((c) => c.hasTile('CHASM_EDGE'))).toBeGreaterThan(
            0
        );
        expect(map.cells.count((c) => c.hasTile('PRESSURE_PLATE'))).toEqual(1);
    });
    */
});
