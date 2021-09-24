import 'jest-extended';
import '../../../test/matchers';
import * as UTILS from '../../../test/utils';
import * as GWU from 'gw-utils';

import * as Map from '../../map';
import * as Effect from '..';
import * as Tile from '../../tile';

import * as MapEffect from './tile';
import * as Flags from '../../flags';

describe('tile effect', () => {
    let map: Map.Map;
    let ctx: any;
    let effect: Effect.EffectInfo;
    let grid: GWU.grid.NumGrid;

    beforeEach(() => {
        map = Map.make(20, 20, 'FLOOR', 'WALL');

        GWU.data.gameHasEnded = false;
        effect = {} as Effect.EffectInfo;

        GWU.rng.random.seed(12345);
        GWU.events.removeAllListeners();
        grid = GWU.grid.alloc(20, 20);
        ctx = { x: 10, y: 10, grid };
    });

    afterEach(() => {
        GWU.grid.free(grid);
    });

    describe('spread', () => {
        test('tile', () => {
            effect = Effect.make({
                tile: 'WALL,0,0',
            });

            expect(effect.tile.grow).toEqual(0);
            expect(effect.tile.decrement).toEqual(0);

            expect(
                MapEffect.computeSpawnMap(effect, map, ctx.x, ctx.y, ctx)
            ).toBeTruthy();

            expect(grid.count((v) => !!v)).toEqual(1);
            expect(grid[ctx.x][ctx.y]).toEqual(1);
            grid.eachNeighbor(ctx.x, ctx.y, (v) => expect(v).toEqual(0), true);
        });

        test('tile and neighbors', () => {
            effect = Effect.make({
                tile: { id: 'WALL', grow: 100, decrement: 100 },
            });

            expect(effect.tile.grow).toEqual(100);
            expect(effect.tile.decrement).toEqual(100);

            expect(
                MapEffect.computeSpawnMap(effect, map, ctx.x, ctx.y, ctx)
            ).toBeTruthy();

            expect(grid.count((v) => !!v)).toEqual(5);
            expect(grid[ctx.x][ctx.y]).toEqual(1);
            grid.eachNeighbor(ctx.x, ctx.y, (v) => expect(v).toEqual(2), true);
        });

        test('2 levels', () => {
            effect = Effect.make({
                tile: { tile: 'WALL', grow: 200, decrement: 100 },
            });

            expect(effect.tile.grow).toEqual(200);
            expect(effect.tile.decrement).toEqual(100);

            expect(
                MapEffect.computeSpawnMap(effect, map, ctx.x, ctx.y, ctx)
            ).toBeTruthy();

            expect(grid.count((v) => !!v)).toEqual(1 + 4 + 8);
            expect(grid[ctx.x][ctx.y]).toEqual(1);
            grid.eachNeighbor(ctx.x, ctx.y, (v) => expect(v).toEqual(2), true);
            expect(grid.count(3)).toEqual(8);
        });

        test('build in walls', () => {
            // not on a wall
            effect = Effect.make({
                tile: { id: 'WALL' },
                flags: 'E_BUILD_IN_WALLS',
            });
            expect(effect.flags & Flags.Effect.E_BUILD_IN_WALLS).toBeTruthy();
            expect(
                MapEffect.computeSpawnMap(effect, map, ctx.x, ctx.y, ctx)
            ).toBeFalsy();
            expect(grid.count(1)).toEqual(0);
            expect(grid.count(0)).toEqual(map.width * map.height);

            // wall
            map.setTile(ctx.x, ctx.y, 'WALL');

            expect(
                MapEffect.computeSpawnMap(effect, map, ctx.x, ctx.y, ctx)
            ).toBeTruthy();

            expect(grid.count(1)).toEqual(1);
            expect(grid.count(0)).toEqual(map.width * map.height - 1);
            expect(grid[ctx.x][ctx.y]).toEqual(1);
        });

        test('must touch walls', () => {
            // not near a wall
            effect = Effect.make({
                tile: { id: 'WALL' },
                flags: 'E_MUST_TOUCH_WALLS',
            })!;
            expect(effect.flags & Flags.Effect.E_MUST_TOUCH_WALLS).toBeTruthy();
            expect(
                MapEffect.computeSpawnMap(effect, map, ctx.x, ctx.y, ctx)
            ).toBeFalsy();
            expect(grid.count(1)).toEqual(0);
            expect(grid.count(0)).toEqual(map.width * map.height);

            // not on a wall
            map.setTile(ctx.x, ctx.y, 'WALL');
            expect(
                MapEffect.computeSpawnMap(effect, map, ctx.x, ctx.y, ctx)
            ).toBeFalsy();
            expect(grid.count(1)).toEqual(0);
            expect(grid.count(0)).toEqual(map.width * map.height);
            expect(grid[ctx.x][ctx.y]).toEqual(0);

            // next to a wall
            map.setTile(ctx.x, ctx.y, 'FLOOR');
            map.setTile(ctx.x, ctx.y - 1, 'WALL');
            expect(
                MapEffect.computeSpawnMap(effect, map, ctx.x, ctx.y, ctx)
            ).toBeTruthy();
            expect(grid.count(1)).toEqual(1);
            expect(grid.count(0)).toEqual(map.width * map.height - 1);
            expect(grid[ctx.x][ctx.y]).toEqual(1);
        });

        test('no touch walls', () => {
            effect = Effect.make({
                tile: { id: 'WALL', grow: 100, decrement: 100 },
                flags: 'E_NO_TOUCH_WALLS',
            });
            expect(effect.flags & Flags.Effect.E_NO_TOUCH_WALLS).toBeTruthy();

            // no walls - ok
            expect(
                MapEffect.computeSpawnMap(effect, map, ctx.x, ctx.y, ctx)
            ).toBeTruthy();
            expect(grid.count(1)).toEqual(1);
            expect(grid.count((v) => !!v)).toEqual(5);
            expect(grid[ctx.x][ctx.y]).toEqual(1);

            // on a wall - no
            map.setTile(ctx.x, ctx.y, 'WALL');
            expect(
                MapEffect.computeSpawnMap(effect, map, ctx.x, ctx.y, ctx)
            ).toBeFalsy();
            expect(grid.count(1)).toEqual(0);
            expect(grid.count(0)).toEqual(map.width * map.height);
            expect(grid[ctx.x][ctx.y]).toEqual(0);

            // next to a wall - no
            map.setTile(ctx.x, ctx.y, 'FLOOR');
            map.setTile(ctx.x, ctx.y - 1, 'WALL');
            expect(
                MapEffect.computeSpawnMap(effect, map, ctx.x, ctx.y, ctx)
            ).toBeFalsy();
            expect(grid.count(1)).toEqual(0);
            expect(grid.count(0)).toEqual(map.width * map.height);
            expect(grid[ctx.x][ctx.y]).toEqual(0);
        });

        test('spawn map - blocks effects', () => {
            effect = Effect.make({
                tile: 'WALL, 100, 100',
                flags: 'E_NO_TOUCH_WALLS',
            });

            // ok
            expect(
                MapEffect.computeSpawnMap(effect, map, ctx.x, ctx.y, ctx)
            ).toBeTruthy();
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

            expect(
                MapEffect.computeSpawnMap(effect, map, ctx.x, ctx.y, ctx)
            ).toBeTruthy();
            expect(grid.count(1)).toEqual(1);
            expect(grid.count(2)).toEqual(2);
            expect(grid[ctx.x][ctx.y]).toEqual(1);
            expect(grid[ctx.x - 1][ctx.y]).toEqual(0);
            expect(grid[ctx.x + 1][ctx.y]).toEqual(2);
            expect(grid[ctx.x][ctx.y - 1]).toEqual(0);
            expect(grid[ctx.x][ctx.y + 1]).toEqual(2);
        });

        // { spread: 50 }
        test('{ spread: 50 }', () => {
            GWU.rng.random.seed(12345);
            effect = Effect.make({
                tile: 'WALL, 50, 0',
            });

            expect(
                MapEffect.computeSpawnMap(effect, map, ctx.x, ctx.y, ctx)
            ).toBeTruthy();

            // grid.dump();
            expect(grid.count((v) => !!v)).toEqual(3);
            expect(grid[10][10]).toEqual(1);
            expect(grid[10][9]).toEqual(2);
            expect(grid[10][11]).toEqual(0);
        });

        // { spread: 100, decrement: 100, matchTile: "DOOR" }
        test('{ spread: 100, decrement: 100, matchTile: "DOOR" }', () => {
            GWU.rng.random.seed(12345);
            effect = Effect.make({
                tile: {
                    id: 'WALL',
                    grow: 100,
                    decrement: 10,
                    matchTile: 'DOOR',
                },
            });

            expect(effect.tile.matchTile).toEqual('DOOR');

            expect(
                MapEffect.computeSpawnMap(effect, map, ctx.x, ctx.y, ctx)
            ).toBeTruthy();

            // grid.dump();
            expect(grid.count((v) => !!v)).toEqual(1); // There are no doors!

            map.setTile(9, 10, 'DOOR');
            // map.setTile(11, 10, 'DOOR');
            map.setTile(10, 9, 'DOOR');
            // map.setTile(10, 11, 'DOOR');

            grid.fill(0);

            expect(
                MapEffect.computeSpawnMap(effect, map, ctx.x, ctx.y, ctx)
            ).toBeTruthy();
            // grid.dump();
            expect(grid.count((v) => !!v)).toEqual(3); // match some doors
        });

        // { spread: 50, decrement: 10 }
        test('{ spread: 50, decrement: 10 }', () => {
            GWU.rng.random.seed(12345);
            effect = Effect.make({
                tile: { id: 'WALL', grow: 50, decrement: 10 },
            });

            expect(
                MapEffect.computeSpawnMap(effect, map, ctx.x, ctx.y, ctx)
            ).toBeTruthy();
            // grid.dump();
            expect(grid.count((v) => !!v)).toEqual(5);
            expect(grid[10][10]).toEqual(1);
            expect(grid[9][8]).toEqual(0);
            expect(grid[10][8]).toEqual(3);
        });

        // // DFF_SPREAD_CIRCLE
        // test('{ spread: 90, decrement: 10, spread circle }', () => {
        //     GWU.rng.random.seed(1234567);
        //     feat = GW.make.tileEvent({
        //         tile: 'WALL',
        //         spread: 90,
        //         decrement: 10,
        //         flags: 'DFF_SPREAD_CIRCLE',
        //     })!;

        //     expect(feat.flags).toEqual(Map.tileEvent.Flags.DFF_SPREAD_CIRCLE);
        //     Map.tileEvent.computeSpawnMap(feat, grid, ctx);
        //     // grid.dump();
        //     expect(grid.count((v) => !!v)).toEqual(137);
        //     grid.forCircle(10, 10, 6, (v) => expect(v).toEqual(1));
        // });

        // // DFF_SPREAD_CIRCLE - big spread
        // test('{ spread: 150, decrement: 50, spread circle }', () => {
        //     GWU.rng.random.seed(1234567);
        //     feat = GW.make.tileEvent({
        //         tile: 'WALL',
        //         spread: 150,
        //         decrement: 50,
        //         flags: 'DFF_SPREAD_CIRCLE',
        //     })!;

        //     expect(feat.flags).toEqual(Map.tileEvent.Flags.DFF_SPREAD_CIRCLE);
        //     Map.tileEvent.computeSpawnMap(feat, grid, ctx);
        //     // grid.dump();
        //     expect(grid.count((v) => !!v)).toEqual(37);
        //     grid.forCircle(10, 10, 3, (v) => expect(v).toEqual(1));
        // });

        // test.todo(
        //     'Add some walls and test that circle does not pass through them.'
        // );

        // // { radius: 3 }
        // test('{ radius: 3 }', () => {
        //     GWU.rng.random.seed(12345);
        //     feat = GW.make.tileEvent({ tile: 'WALL', radius: 3 })!;
        //     // console.log(feat);
        //     Map.tileEvent.computeSpawnMap(feat, grid, ctx);
        //     // grid.dump();
        //     expect(grid.count((v) => !!v)).toEqual(37);
        //     expect(grid[10][10]).toEqual(1);
        //     expect(grid[8][11]).toEqual(1);
        // });

        // // { radius: 3, spread: 75 }
        // test('{ radius: 3, spread: 75 }', () => {
        //     GWU.rng.random.seed(12345);
        //     feat = GW.make.tileEvent({ tile: 'WALL', radius: 3, spread: 75 })!;
        //     // console.log(feat);

        //     Map.tileEvent.computeSpawnMap(feat, grid, ctx);
        //     // grid.dump();
        //     expect(grid.count((v) => !!v)).toEqual(30);
        //     expect(grid[10][10]).toEqual(1);
        //     expect(grid[9][10]).toEqual(0);
        //     expect(grid[8][10]).toEqual(1);
        // });

        // // { radius: 3, spread: 75, decrement: 20 }
        // test('{ radius: 3, spread: 75, decrement: 20 }', () => {
        //     GWU.rng.random.seed(12345);
        //     feat = GW.make.tileEvent({
        //         tile: 'WALL',
        //         radius: 3,
        //         spread: 75,
        //         decrement: 20,
        //     })!;
        //     // console.log(feat);
        //     Map.tileEvent.computeSpawnMap(feat, grid, ctx);
        //     // grid.dump();
        //     expect(grid.count((v) => !!v)).toEqual(12);
        //     expect(grid[10][10]).toEqual(1);
        //     expect(grid[10][11]).toEqual(0);
        //     expect(grid[10][12]).toEqual(1);
        // });

        // // { tile: 'DOOR', line }
        // test('{ tile: "DOOR", line }', async () => {
        //     GWU.rng.random.seed(12345);
        //     const feat = GW.make.tileEvent({
        //         tile: 'DOOR',
        //         flags: 'DFF_SPREAD_LINE',
        //         spread: 200,
        //         decrement: 50,
        //     })!;

        //     await Map.tileEvent.spawn(feat, ctx);

        //     // map.dump();

        //     expect(map.hasTile(10, 10, 'DOOR')).toBeTruthy();
        //     expect(map.hasTile(10, 11, 'DOOR')).toBeTruthy();
        //     expect(map.hasTile(10, 12, 'DOOR')).toBeTruthy();
        //     expect(map.hasTile(10, 13, 'DOOR')).toBeTruthy();
        //     // expect(map.hasTile(10, 14, "DOOR")).toBeTruthy();

        //     expect(map.cells.count((c) => c.hasTile('DOOR'))).toEqual(4);
        // });
    });

    describe('spawnTiles', () => {
        test('will fill a map with a spawn map', async () => {
            grid.fillRect(5, 5, 3, 3, 1);

            GWU.xy.forRect(5, 5, 3, 3, (x, y) => {
                const cell = map.cell(x, y);
                expect(cell.hasTile('WALL')).toBeFalsy();
            });
            MapEffect.spawnTiles(0, grid, map, Tile.tiles.WALL);
            GWU.xy.forRect(5, 5, 3, 3, (x, y) => {
                const cell = map.cell(x, y);
                expect(cell.hasTile('WALL')).toBeTruthy();
                // expect(cell.mechFlags & Map.cell.MechFlags.EVENT_FIRED_THIS_TURN).toBeTruthy();
            });
        });

        // test('gas adds volume', async () => {
        //     grid.fillRect(5, 5, 3, 3, 1);
        //     Tile.install('RED_GAS', {
        //         bg: 'red',
        //         depth: 'GAS',
        //     });

        //     GWU.xy.forRect(5, 5, 3, 3, (x, y) => {
        //         const cell = map.cell(x, y);
        //         expect(cell.hasTile('RED_GAS')).toBeFalsy();
        //     });
        //     MapEffect.spawnTiles(0, grid, map, Tile.tiles.RED_GAS, 10);
        //     GWU.xy.forRect(5, 5, 3, 3, (x, y) => {
        //         const cell = map.cell(x, y);
        //         expect(cell.hasTile('RED_GAS')).toBeTruthy();
        //         expect(cell.gasVolume).toEqual(10);
        //     });
        //     MapEffect.spawnTiles(0, grid, map, Tile.tiles.RED_GAS, 10);
        //     GWU.xy.forRect(5, 5, 3, 3, (x, y) => {
        //         const cell = map.cell(x, y);
        //         expect(cell.hasTile('RED_GAS')).toBeTruthy();
        //         expect(cell.gasVolume).toEqual(20);
        //     });
        // });

        // test('liquid adds volume', async () => {
        //     grid.fillRect(5, 5, 3, 3, 1);
        //     Tile.install('RED_LIQUID', {
        //         bg: 'red',
        //         depth: 'LIQUID',
        //     });

        //     GWU.xy.forRect(5, 5, 3, 3, (x, y) => {
        //         const cell = map.cell(x, y);
        //         expect(cell.hasTile('RED_LIQUID')).toBeFalsy();
        //     });
        //     MapEffect.spawnTiles(0, grid, map, Tile.tiles.RED_LIQUID, 10);
        //     GWU.xy.forRect(5, 5, 3, 3, (x, y) => {
        //         const cell = map.cell(x, y);
        //         expect(cell.hasTile('RED_LIQUID')).toBeTruthy();
        //         expect(cell.liquidVolume).toEqual(10);
        //     });
        //     MapEffect.spawnTiles(0, grid, map, Tile.tiles.RED_LIQUID, 10);
        //     GWU.xy.forRect(5, 5, 3, 3, (x, y) => {
        //         const cell = map.cell(x, y);
        //         expect(cell.hasTile('RED_LIQUID')).toBeTruthy();
        //         expect(cell.liquidVolume).toEqual(20);
        //     });
        // });
    });

    describe('fire', () => {
        test('tile', async () => {
            effect = Effect.make({ tile: 'WALL' });
            expect(map.cell(ctx.x, ctx.y).hasTile('WALL')).toBeFalsy();
            await expect(
                Effect.fire(effect, map, ctx.x, ctx.y, ctx)
            ).resolves.toBeTruthy();
            expect(map.cell(ctx.x, ctx.y).hasTile('WALL')).toBeTruthy();
            GWU.xy.eachNeighbor(ctx.x, ctx.y, (x, y) => {
                const cell = map.cell(x, y);
                expect(cell.hasTile('WALL')).toBeFalsy();
            });
        });

        test('tile and neighbors - string', async () => {
            effect = Effect.make({ tile: 'WALL,100,100' })!;
            expect(map.cell(ctx.x, ctx.y).hasTile('WALL')).toBeFalsy();
            await expect(
                Effect.fire(effect, map, ctx.x, ctx.y, ctx)
            ).resolves.toBeTruthy();
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

        test('tile and neighbors - object', async () => {
            effect = Effect.make({
                tile: { id: 'WALL', spread: 100, decrement: 100 },
            });

            expect(map.cell(ctx.x, ctx.y).hasTile('WALL')).toBeFalsy();
            await expect(
                Effect.fire(effect, map, ctx.x, ctx.y, ctx)
            ).resolves.toBeTruthy();
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

        test('can clear extra tiles from the cell', async () => {
            effect = Effect.make({ flags: 'E_CLEAR_CELL', tile: 'FLOOR' })!;

            expect(effect.flags & Flags.Effect.E_CLEAR_CELL).toBeTruthy();
            map.setTile(ctx.x, ctx.y, 'BRIDGE');
            const cell = map.cell(ctx.x, ctx.y);
            expect(cell.depthTile(Flags.Depth.SURFACE)!.id).toEqual('BRIDGE');
            expect(cell.depthTile(Flags.Depth.GROUND)!.id).toEqual('FLOOR');

            await expect(
                Effect.fire(effect, map, ctx.x, ctx.y, ctx)
            ).resolves.toBeTruthy();
            expect(cell.depthTile(Flags.Depth.GROUND)!.id).toEqual('FLOOR');
            expect(cell.depthTile(Flags.Depth.SURFACE)).toBeNull();
        });

        // test('Will add liquids with volume', async () => {
        //     Tile.install('RED_LIQUID', {
        //         name: 'red liquid',
        //         article: 'some',
        //         bg: 'red',
        //         depth: 'LIQUID',
        //     });

        //     effect = Effect.make({
        //         tile: { id: 'RED_LIQUID', volume: 50 },
        //     })!;
        //     await expect(
        //         Effect.fire(effect, map, ctx.x, ctx.y, ctx)
        //     ).resolves.toBeTruthy();

        //     const cell = map.cell(ctx.x, ctx.y);
        //     expect(cell.liquid).toEqual('RED_LIQUID');
        //     expect(cell.liquidVolume).toEqual(50);
        // });
    });

    describe('cell effects', () => {
        test('effect fn', async () => {
            const fn = jest.fn().mockReturnValue(true);
            Tile.install('ALTAR', {
                name: 'altar',
                article: 'the',
                bg: 'red',
                depth: 'SURFACE',
                effects: {
                    fire: { fn },
                },
            });

            const cell = map.cell(ctx.x, ctx.y);
            map.setTile(ctx.x, ctx.y, 'ALTAR');

            await expect(
                cell.fire('fire', map, ctx.x, ctx.y, ctx)
            ).resolves.toBeTruthy();
            expect(fn).toHaveBeenCalledTimes(1);
        });

        test('evacuateCreatures', async () => {
            Tile.install('ALTAR', {
                name: 'altar',
                article: 'the',
                bg: 'red',
                depth: 'SURFACE',
                effects: {
                    fire: { flags: 'E_EVACUATE_CREATURES', tile: 'FLOOR' },
                },
            });

            const cell = map.cell(ctx.x, ctx.y);
            map.setTile(ctx.x, ctx.y, 'ALTAR');
            const actor = UTILS.mockActor();

            await map.addActor(ctx.x, ctx.y, actor);
            expect(actor).toBeAtXY(ctx.x, ctx.y);
            expect(cell.hasActor()).toBeTruthy();
            grid[ctx.x][ctx.y] = 1;

            await cell.fire('fire', map, ctx.x, ctx.y);
            expect(actor.forbidsCell).toHaveBeenCalled();
            expect(actor).not.toBeAtXY(ctx.x, ctx.y);
            expect(cell.hasActor()).toBeFalsy();
        });

        test('evacuateItems', async () => {
            Tile.install('ALTAR', {
                name: 'altar',
                article: 'some',
                bg: 'red',
                depth: 'SURFACE',
                effects: {
                    fire: { flags: 'E_EVACUATE_ITEMS', tile: 'FLOOR' },
                },
            });

            const cell = map.cell(ctx.x, ctx.y);
            map.setTile(ctx.x, ctx.y, 'ALTAR');

            const item = UTILS.mockItem();

            await map.addItem(ctx.x, ctx.y, item);
            expect(item).toBeAtXY(ctx.x, ctx.y);
            expect(cell.hasItem()).toBeTruthy();
            grid[ctx.x][ctx.y] = 1;

            await cell.fire('fire', map, ctx.x, ctx.y, ctx);
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

    //     test('can do waves', async () => {
    //         map.fill('LAKE');
    //         map.setTile(10, 10, 'WAVE');

    //         await map.tick();
    //         // map.dump();
    //         expect(map.hasTile(10, 10, 'WAVE_DONE')).toBeTruthy();
    //         expect(map.count((c) => c.hasTile('WAVE_DONE'))).toEqual(1);
    //         expect(map.count((c) => c.hasTile('WAVE'))).toEqual(4);

    //         await map.tick();
    //         // map.dump();
    //         expect(map.cell(10, 10).depthTile(Flags.Depth.GROUND).id).toEqual('LAKE');
    //         expect(map.count((c) => c.hasTile('WAVE_DONE'))).toEqual(4);
    //         expect(map.count((c) => c.hasTile('WAVE'))).toEqual(8);

    //         await map.tick();
    //         // map.dump();
    //         expect(map.cell(10, 10).depthTile(Flags.Depth.GROUND).id).toEqual('LAKE');
    //         expect(map.count((c) => c.hasTile('WAVE_DONE'))).toEqual(8);
    //         expect(map.count((c) => c.hasTile('WAVE'))).toEqual(12);

    //         await map.tick();
    //         // map.dump();
    //         expect(map.hasTile(10, 10, 'LAKE')).toBeTruthy();
    //         expect(map.count((c) => c.hasTile('WAVE_DONE'))).toEqual(12);
    //         expect(map.count((c) => c.hasTile('WAVE'))).toEqual(16);

    //         for (let i = 0; i < 5; ++i) {
    //             await map.tick();
    //         }

    //         // map.dump();
    //         await map.tick();
    //         // map.dump();

    //         expect(map.hasTile(19, 10, 'WAVE_DONE')).toBeTruthy();

    //         // expect(map.count( (c) => c.hasTile(WAVE)).toEqual(0);
    //     });
    // });

    test('abort if blocking', async () => {
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
        let result = await Effect.fire('HOLE_WITH_PLATE', map, 9, 4);

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

        result = await Effect.fire('HOLE_WITH_PLATE', map, 3, 8);

        // map.dump();

        expect(result).toBeTruthy();
        expect(map.cells.count((c) => c.hasTile('CHASM'))).toBeGreaterThan(0);
        expect(map.cells.count((c) => c.hasTile('CHASM_EDGE'))).toBeGreaterThan(
            0
        );
        expect(map.cells.count((c) => c.hasTile('PRESSURE_PLATE'))).toEqual(1);
    });
});
