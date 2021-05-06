import 'jest-extended';
import '../test/matchers';
import * as UTILS from '../test/utils';
import * as Map from './gw';
import * as GW from 'gw-utils';
import * as Effect from './mapEffect';

describe('tile effect', () => {
    let map: Map.map.Map;
    let ctx: any;
    let effect: GW.effect.Effect;
    let config: Effect.TileEffectConfig;
    let grid: GW.grid.NumGrid;

    function makeEffect(config = {}) {
        // @ts-ignore
        if (effect && effect._grid) {
            // @ts-ignore
            GW.grid.free(effect._grid);
        }
        effect = GW.effect.make(config)!;
        effect.map = map;
        grid = effect.grid;
        return effect;
    }

    beforeEach(() => {
        map = Map.map.make(20, 20, 'FLOOR', 'WALL');
        ctx = { x: 10, y: 10, map };
        config = { spread: 0, decrement: 0, id: 'WALL', volume: 0 };
        effect = makeEffect({ tile: 'WALL ' });

        GW.data.gameHasEnded = false;

        UTILS.mockRandom();
        GW.events.removeAllListeners();
    });

    afterEach(() => {
        // @ts-ignore
        GW.grid.free(effect._grid);
    });

    describe('spread', () => {
        test('tile', () => {
            expect(grid).toBeArray();

            config.spread = 0;
            config.decrement = 0;
            expect(
                Effect.computeSpawnMap(config, effect, ctx.x, ctx.y)
            ).toBeTruthy();

            expect(grid.count(0)).toEqual(map.width * map.height - 1);
            expect(grid[ctx.x][ctx.y]).toEqual(1);
            grid.eachNeighbor(ctx.x, ctx.y, (v) => expect(v).toEqual(0), true);
        });

        test('tile and neighbors', () => {
            config.spread = 100;
            config.decrement = 100;
            expect(
                Effect.computeSpawnMap(config, effect, ctx.x, ctx.y)
            ).toBeTruthy();

            expect(grid.count(0)).toEqual(map.width * map.height - 5);
            expect(grid[ctx.x][ctx.y]).toEqual(1);
            grid.eachNeighbor(ctx.x, ctx.y, (v) => expect(v).toEqual(2), true);
        });

        test('2 levels', () => {
            config.spread = 200;
            config.decrement = 100;
            expect(
                Effect.computeSpawnMap(config, effect, ctx.x, ctx.y)
            ).toBeTruthy();

            expect(grid.count(0)).toEqual(map.width * map.height - 1 - 4 - 8);
            expect(grid[ctx.x][ctx.y]).toEqual(1);
            grid.eachNeighbor(ctx.x, ctx.y, (v) => expect(v).toEqual(2), true);
            expect(grid.count(3)).toEqual(8);
        });

        test('build in walls', () => {
            // not on a wall
            effect = makeEffect({
                tile: { id: 'WALL' },
                flags: 'E_BUILD_IN_WALLS',
            })!;
            expect(
                effect.flags & GW.effect.Flags.E_BUILD_IN_WALLS
            ).toBeTruthy();
            expect(
                Effect.computeSpawnMap(config, effect, ctx.x, ctx.y)
            ).toBeFalsy();
            expect(grid.count(1)).toEqual(0);
            expect(grid.count(0)).toEqual(map.width * map.height);

            // wall
            map.setTile(ctx.x, ctx.y, 'WALL');

            expect(
                Effect.computeSpawnMap(config, effect, ctx.x, ctx.y)
            ).toBeTruthy();

            expect(grid.count(1)).toEqual(1);
            expect(grid.count(0)).toEqual(map.width * map.height - 1);
            expect(grid[ctx.x][ctx.y]).toEqual(1);
        });

        test('must touch walls', () => {
            // not near a wall
            effect = makeEffect({
                tile: { id: 'WALL' },
                flags: 'E_MUST_TOUCH_WALLS',
            })!;
            expect(
                effect.flags & GW.effect.Flags.E_MUST_TOUCH_WALLS
            ).toBeTruthy();
            expect(
                Effect.computeSpawnMap(config, effect, ctx.x, ctx.y)
            ).toBeFalsy();
            expect(grid.count(1)).toEqual(0);
            expect(grid.count(0)).toEqual(map.width * map.height);

            // not on a wall
            map.setTile(ctx.x, ctx.y, 'WALL');
            expect(
                Effect.computeSpawnMap(config, effect, ctx.x, ctx.y)
            ).toBeFalsy();
            expect(grid.count(1)).toEqual(0);
            expect(grid.count(0)).toEqual(map.width * map.height);
            expect(grid[ctx.x][ctx.y]).toEqual(0);

            // next to a wall
            map.setTile(ctx.x, ctx.y, 'FLOOR');
            map.setTile(ctx.x, ctx.y - 1, 'WALL');
            expect(
                Effect.computeSpawnMap(config, effect, ctx.x, ctx.y)
            ).toBeTruthy();
            expect(grid.count(1)).toEqual(1);
            expect(grid.count(0)).toEqual(map.width * map.height - 1);
            expect(grid[ctx.x][ctx.y]).toEqual(1);
        });

        test('no touch walls', () => {
            effect = makeEffect({
                tile: { id: 'WALL' },
                flags: 'E_NO_TOUCH_WALLS',
            })!;
            expect(
                effect.flags & GW.effect.Flags.E_NO_TOUCH_WALLS
            ).toBeTruthy();

            // no walls - ok
            expect(
                Effect.computeSpawnMap(config, effect, ctx.x, ctx.y)
            ).toBeTruthy();
            expect(grid.count(1)).toEqual(1);
            expect(grid.count(0)).toEqual(map.width * map.height - 1);
            expect(grid[ctx.x][ctx.y]).toEqual(1);

            // on a wall - no
            map.setTile(ctx.x, ctx.y, 'WALL');
            expect(
                Effect.computeSpawnMap(config, effect, ctx.x, ctx.y)
            ).toBeFalsy();
            expect(grid.count(1)).toEqual(0);
            expect(grid.count(0)).toEqual(map.width * map.height);
            expect(grid[ctx.x][ctx.y]).toEqual(0);

            // next to a wall - no
            map.setTile(ctx.x, ctx.y, 'FLOOR');
            map.setTile(ctx.x, ctx.y - 1, 'WALL');
            expect(
                Effect.computeSpawnMap(config, effect, ctx.x, ctx.y)
            ).toBeFalsy();
            expect(grid.count(1)).toEqual(0);
            expect(grid.count(0)).toEqual(map.width * map.height);
            expect(grid[ctx.x][ctx.y]).toEqual(0);
        });

        test('spawn map - blocks effects', () => {
            config.spread = 100;
            config.decrement = 100;

            // ok
            expect(
                Effect.computeSpawnMap(config, effect, ctx.x, ctx.y)
            ).toBeTruthy();
            expect(grid.count(1)).toEqual(1);
            expect(grid.count(2)).toEqual(4);
            expect(grid[ctx.x][ctx.y]).toEqual(1);
            grid.eachNeighbor(ctx.x, ctx.y, (v) => expect(v).toEqual(2), true);

            // blocks effects
            const tile = Map.tile.make({
                id: 'TEST',
                ch: '!',
                fg: 'green',
                flags: 'L_BLOCKS_EFFECTS',
            });

            map.setTile(ctx.x, ctx.y - 1, tile);
            map.setTile(ctx.x - 1, ctx.y, tile);

            expect(
                map.hasLayerFlag(
                    ctx.x,
                    ctx.y - 1,
                    Map.entity.Flags.L_BLOCKS_EFFECTS
                )
            ).toBeTruthy();
            expect(
                map.hasLayerFlag(
                    ctx.x - 1,
                    ctx.y,
                    Map.entity.Flags.L_BLOCKS_EFFECTS
                )
            ).toBeTruthy();

            expect(
                Effect.computeSpawnMap(config, effect, ctx.x, ctx.y)
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
            GW.random.seed(12345);
            config.spread = 50;
            config.decrement = 0;

            expect(
                Effect.computeSpawnMap(config, effect, ctx.x, ctx.y)
            ).toBeTruthy();

            // grid.dump();
            expect(grid.count((v) => !!v)).toEqual(3);
            expect(grid[10][10]).toEqual(1);
            expect(grid[10][9]).toEqual(2);
            expect(grid[10][11]).toEqual(0);
        });

        // { spread: 100, decrement: 100, matchTile: "DOOR" }
        test('{ spread: 100, decrement: 100, matchTile: "DOOR" }', () => {
            GW.random.seed(12345);
            config.spread = 100;
            config.decrement = 100;
            config.matchTile = 'DOOR';

            expect(
                Effect.computeSpawnMap(config, effect, ctx.x, ctx.y)
            ).toBeFalsy();

            // grid.dump();
            expect(grid.count((v) => !!v)).toEqual(0); // There are no doors!

            map.setTile(9, 10, 'DOOR');
            // map.setTile(11, 10, 'DOOR');
            map.setTile(10, 9, 'DOOR');
            // map.setTile(10, 11, 'DOOR');

            expect(
                Effect.computeSpawnMap(config, effect, ctx.x, ctx.y)
            ).toBeTruthy();
            // grid.dump();
            expect(grid.count((v) => !!v)).toEqual(2); // match some doors
        });

        // { spread: 50, decrement: 10 }
        test('{ spread: 50, decrement: 10 }', () => {
            GW.random.seed(12345);
            config.spread = 50;
            config.decrement = 10;

            expect(
                Effect.computeSpawnMap(config, effect, ctx.x, ctx.y)
            ).toBeTruthy();
            // grid.dump();
            expect(grid.count((v) => !!v)).toEqual(11);
            expect(grid[10][10]).toEqual(1);
            expect(grid[9][8]).toEqual(0);
            expect(grid[13][10]).toEqual(6);
        });

        // // DFF_SPREAD_CIRCLE
        // test('{ spread: 90, decrement: 10, spread circle }', () => {
        //     GW.random.seed(1234567);
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
        //     GW.random.seed(1234567);
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
        //     GW.random.seed(12345);
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
        //     GW.random.seed(12345);
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
        //     GW.random.seed(12345);
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
        //     GW.random.seed(12345);
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

            map.forRect(5, 5, 3, 3, (cell) =>
                expect(cell.hasTile('WALL')).toBeFalsy()
            );
            Effect.spawnTiles(0, grid, map, Map.tiles.WALL);
            map.forRect(5, 5, 3, 3, (cell) => {
                expect(cell.hasTile('WALL')).toBeTruthy();
                // expect(cell.mechFlags & Map.cell.MechFlags.EVENT_FIRED_THIS_TURN).toBeTruthy();
            });
        });

        test('gas adds volume', async () => {
            grid.fillRect(5, 5, 3, 3, 1);
            Map.tile.install('RED_GAS', {
                bg: 'red',
                layer: 'GAS',
            });

            map.forRect(5, 5, 3, 3, (cell) =>
                expect(cell.hasTile('RED_GAS')).toBeFalsy()
            );
            Effect.spawnTiles(0, grid, map, Map.tiles.RED_GAS, 10);
            map.forRect(5, 5, 3, 3, (cell) => {
                expect(cell.hasTile('RED_GAS')).toBeTruthy();
                expect(cell.gasVolume).toEqual(10);
            });
            Effect.spawnTiles(0, grid, map, Map.tiles.RED_GAS, 10);
            map.forRect(5, 5, 3, 3, (cell) => {
                expect(cell.hasTile('RED_GAS')).toBeTruthy();
                expect(cell.gasVolume).toEqual(20);
            });
        });

        test('liquid adds volume', async () => {
            grid.fillRect(5, 5, 3, 3, 1);
            Map.tile.install('RED_LIQUID', {
                bg: 'red',
                layer: 'LIQUID',
            });

            map.forRect(5, 5, 3, 3, (cell) =>
                expect(cell.hasTile('RED_LIQUID')).toBeFalsy()
            );
            Effect.spawnTiles(0, grid, map, Map.tiles.RED_LIQUID, 10);
            map.forRect(5, 5, 3, 3, (cell) => {
                expect(cell.hasTile('RED_LIQUID')).toBeTruthy();
                expect(cell.liquidVolume).toEqual(10);
            });
            Effect.spawnTiles(0, grid, map, Map.tiles.RED_LIQUID, 10);
            map.forRect(5, 5, 3, 3, (cell) => {
                expect(cell.hasTile('RED_LIQUID')).toBeTruthy();
                expect(cell.liquidVolume).toEqual(20);
            });
        });
    });

    describe('fire', () => {
        test('tile', async () => {
            expect(map.hasTile(ctx.x, ctx.y, 'WALL')).toBeFalsy();
            await expect(
                effect.fire(ctx.map, ctx.x, ctx.y)
            ).resolves.toBeTruthy();
            expect(map.hasTile(ctx.x, ctx.y, 'WALL')).toBeTruthy();
            map.eachNeighbor(ctx.x, ctx.y, (c) =>
                expect(c.hasTile('WALL')).toBeFalsy()
            );
        });

        test('tile and neighbors - string', async () => {
            effect = makeEffect({ tile: 'WALL,100,100' })!;
            expect(map.hasTile(ctx.x, ctx.y, 'WALL')).toBeFalsy();
            await expect(
                effect.fire(ctx.map, ctx.x, ctx.y)
            ).resolves.toBeTruthy();
            expect(map.hasTile(ctx.x, ctx.y, 'WALL')).toBeTruthy();
            map.eachNeighbor(
                ctx.x,
                ctx.y,
                (c) => expect(c.hasTile('WALL')).toBeTruthy(),
                true
            );
        });

        test('tile and neighbors - object', async () => {
            effect = makeEffect({
                tile: { id: 'WALL', spread: 100, decrement: 100 },
            })!;
            expect(map.hasTile(ctx.x, ctx.y, 'WALL')).toBeFalsy();
            await expect(
                effect.fire(ctx.map, ctx.x, ctx.y)
            ).resolves.toBeTruthy();
            expect(map.hasTile(ctx.x, ctx.y, 'WALL')).toBeTruthy();
            map.eachNeighbor(
                ctx.x,
                ctx.y,
                (c) => expect(c.hasTile('WALL')).toBeTruthy(),
                true
            );
        });

        test('can clear extra tiles from the cell', async () => {
            effect = makeEffect({ flags: 'E_CLEAR_CELL', tile: 'FLOOR' })!;

            expect(effect.flags & GW.effect.Flags.E_CLEAR_CELL).toBeTruthy();
            map.setTile(ctx.x, ctx.y, 'BRIDGE');
            const cell = map.cell(ctx.x, ctx.y);
            expect(cell.surface).toEqual('BRIDGE');
            expect(cell.ground).toEqual('FLOOR');

            await expect(
                effect.fire(ctx.map, ctx.x, ctx.y)
            ).resolves.toBeTruthy();
            expect(cell.ground).toEqual('FLOOR');
            expect(cell.surface).toEqual(null);
        });

        test('Will add liquids with volume', async () => {
            Map.tile.install('RED_LIQUID', {
                name: 'red liquid',
                article: 'some',
                bg: 'red',
                layer: 'LIQUID',
            });

            effect = makeEffect({
                tile: { id: 'RED_LIQUID', volume: 50 },
            })!;
            await expect(
                effect.fire(ctx.map, ctx.x, ctx.y)
            ).resolves.toBeTruthy();

            const cell = map.cell(ctx.x, ctx.y);
            expect(cell.liquid).toEqual('RED_LIQUID');
            expect(cell.liquidVolume).toEqual(50);
        });
    });

    describe('cell effects', () => {
        test('effect fn', async () => {
            const fn = jest.fn().mockReturnValue(true);
            Map.tile.install('RED_LIQUID', {
                name: 'red liquid',
                article: 'some',
                bg: 'red',
                layer: 'LIQUID',
                activates: {
                    fire: { fn },
                },
            });

            const cell = map.cell(ctx.x, ctx.y);
            cell.setTile('RED_LIQUID', 100);

            await expect(
                cell.activate('fire', map, ctx.x, ctx.y, ctx)
            ).resolves.toBeTruthy();
            expect(fn).toHaveBeenCalledTimes(1);
        });

        test('evacuateCreatures', async () => {
            Map.tile.install('RED_LIQUID', {
                name: 'red liquid',
                article: 'some',
                bg: 'red',
                layer: 'LIQUID',
                activates: {
                    fire: { flags: 'E_EVACUATE_CREATURES', tile: 'FLOOR' },
                },
            });

            const cell = map.cell(ctx.x, ctx.y);
            cell.setTile('RED_LIQUID', 100);
            const actor = {
                forbidsCell: jest.fn().mockReturnValue(false),
                x: -1,
                y: -1,
                sprite: { ch: '!' },
                isDetected() {
                    return false;
                },
                isPlayer() {
                    return false;
                },
                blocksVision() {
                    return false;
                },
            };
            // @ts-ignore
            map.addActor(ctx.x, ctx.y, actor);
            expect(actor).toBeAtXY(ctx.x, ctx.y);
            expect(cell.actor).toBe(actor);
            grid[ctx.x][ctx.y] = 1;

            await cell.activate('fire', map, ctx.x, ctx.y);
            expect(actor.forbidsCell).toHaveBeenCalled();
            expect(actor).not.toBeAtXY(ctx.x, ctx.y);
            expect(cell.actor).toBeNull();
        });

        test('evacuateItems', async () => {
            Map.tile.install('RED_LIQUID', {
                name: 'red liquid',
                article: 'some',
                bg: 'red',
                layer: 'LIQUID',
                activates: {
                    fire: { flags: 'E_EVACUATE_ITEMS', tile: 'FLOOR' },
                },
            });

            const cell = map.cell(ctx.x, ctx.y);
            cell.setTile('RED_LIQUID', 100);
            const item = {
                forbidsCell: jest.fn().mockReturnValue(false),
                x: -1,
                y: -1,
                sprite: { ch: '!' },
                isDetected() {
                    return false;
                },
            };
            // @ts-ignore
            map.addItem(ctx.x, ctx.y, item);
            expect(item).toBeAtXY(ctx.x, ctx.y);
            expect(cell.item).toBe(item);
            grid[ctx.x][ctx.y] = 1;

            await cell.activate('fire', map, ctx.x, ctx.y, ctx);
            expect(item.forbidsCell).toHaveBeenCalled();
            expect(item).not.toBeAtXY(ctx.x, ctx.y);
            expect(cell.item).toBeNull();
        });
    });

    describe('waves', () => {
        beforeAll(() => {
            Map.tile.install('WAVE_DONE', {
                ch: 'X',
                fg: 'blue',
                bg: 'green',
                priority: 70,
                flags: 'T_DEEP_WATER',
                name: 'water',
                article: 'some',
                activates: {
                    tick: {
                        tile: 'LAKE',
                        flags: 'E_SUPERPRIORITY, E_PROTECTED',
                    },
                },
            });
            Map.tile.install('WAVE', {
                ch: 'W',
                fg: 'white',
                bg: 'blue',
                priority: 60,
                flags: 'T_DEEP_WATER',
                name: 'wave crest',
                article: 'the',
                activates: {
                    tick: {
                        tile: {
                            id: 'WAVE',
                            match: 'LAKE',
                            spread: 100,
                            decrement: 100,
                        },
                        flags: 'E_NEXT_ALWAYS',
                        next: { tile: 'WAVE_DONE' },
                    },
                },
            });
        });

        afterAll(() => {
            delete Map.tiles.WAVE_DONE;
            delete Map.tiles.WAVE;
        });

        test('tiles installed', () => {
            expect(Map.tiles.WAVE).toBeDefined();
            expect(Map.tiles.WAVE.activates.tick).toBeDefined();
            expect(Map.tiles.WAVE_DONE).toBeDefined();
            expect(Map.tiles.WAVE_DONE.activates.tick).toBeDefined();
        });

        test('can do waves', async () => {
            map.fill('LAKE');
            map.setTile(10, 10, 'WAVE');

            await map.tick();
            // map.dump();
            expect(map.hasTile(10, 10, 'WAVE_DONE')).toBeTruthy();
            expect(UTILS.countTile(map, 'WAVE_DONE')).toEqual(1);
            expect(UTILS.countTile(map, 'WAVE')).toEqual(4);

            await map.tick();
            // map.dump();
            expect(map.cell(10, 10).ground).toEqual('LAKE');
            expect(UTILS.countTile(map, 'WAVE_DONE')).toEqual(4);
            expect(UTILS.countTile(map, 'WAVE')).toEqual(8);

            await map.tick();
            // map.dump();
            expect(map.cell(10, 10).ground).toEqual('LAKE');
            expect(UTILS.countTile(map, 'WAVE_DONE')).toEqual(8);
            expect(UTILS.countTile(map, 'WAVE')).toEqual(12);

            await map.tick();
            // map.dump();
            expect(map.hasTile(10, 10, 'LAKE')).toBeTruthy();
            expect(UTILS.countTile(map, 'WAVE_DONE')).toEqual(12);
            expect(UTILS.countTile(map, 'WAVE')).toEqual(16);

            for (let i = 0; i < 5; ++i) {
                await map.tick();
            }

            // map.dump();
            await map.tick();
            // map.dump();

            expect(map.hasTile(19, 10, 'WAVE_DONE')).toBeTruthy();

            // expect(UTILS.countTile(map, WAVE)).toEqual(0);
        });
    });
});
