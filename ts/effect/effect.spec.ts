import 'jest-extended';
import '../../test/matchers';
import * as UTILS from '../../test/utils';

jest.mock('gw-utils', () => ({
    __esModule: true,
    // @ts-ignore
    ...jest.requireActual('gw-utils'), // This is the golden nugget.
    message: {
        add: jest.fn(),
        addAt: jest.fn(),
        addCombat: jest.fn(),
    },
}));

import * as GWU from 'gw-utils';

import * as Effect from './effect';
import * as Flags from '../flags';
import * as Map from '../map/map';
import './handlers';
import { EffectCtx, MapXY } from '.';
import '../tile/tiles';

describe('Effect', () => {
    let okFn: jest.Mock<GWU.events.EventFn>;
    let map: Map.Map;
    let xy: MapXY;

    beforeEach(() => {
        GWU.rng.random.seed(12345);

        map = Map.make(20, 20, 'FLOOR', 'WALL');

        okFn = jest.fn();
        map.events.on('OK', okFn);

        xy = { map, x: 5, y: 6 };
    });

    afterEach(() => {
        map.events.off('OK', okFn);
        GWU.data.gameHasEnded = false;
        jest.restoreAllMocks();
    });

    test('flags', () => {
        expect(Flags.Effect.E_BUILD_IN_WALLS).toBeGreaterThan(0);
    });

    test('make(null)', () => {
        // @ts-ignore
        expect(() => Effect.make(null)).toThrow();
        // @ts-ignore
        expect(() => Effect.make()).toThrow();
    });

    test('make("TILE:WALL")', () => {
        const eff = Effect.make('TILE:WALL');

        const r = eff.trigger(xy);
        expect(r).toBeTruthy();
        expect(map.hasTile(xy.x, xy.y, 'WALL')).toBeTruthy();
    });

    test('make(["TILE:WALL", "EMIT:OK"])', () => {
        const eff = Effect.make(['TILE:WALL', 'EMIT:OK']);

        const r = eff.trigger(xy);
        expect(r).toBeTruthy();
        expect(map.hasTile(xy.x, xy.y, 'WALL')).toBeTruthy();

        expect(okFn).toHaveBeenCalled();
    });

    test('make({ tile: "WALL" })', () => {
        const eff = Effect.make({ tile: 'WALL' });

        const r = eff.trigger(xy);
        expect(r).toBeTruthy();
        expect(map.hasTile(xy.x, xy.y, 'WALL')).toBeTruthy();
    });

    test.todo('make({ chance: 100, tile: "WALL" })');
    test.todo('make({ chance: 100, tile: { id: "WALL", flags: "A|B"} })');

    test('make({ chance: 20%, effects: "TILE:WALL" })', () => {
        const eff = Effect.make({ chance: '20%', effects: 'TILE:WALL' });

        const r = eff.trigger(xy);
        expect(r).toBeTruthy();
        expect(map.hasTile(xy.x, xy.y, 'WALL')).toBeTruthy();
    });

    test('make({ chance: 20%, effects: ["TILE:WALL", "EMIT:OK"] })', () => {
        const eff = Effect.make({
            chance: '20%',
            effects: ['TILE:WALL', 'EMIT:OK'],
        });

        const r = eff.trigger(xy);
        expect(r).toBeTruthy();
        expect(map.hasTile(xy.x, xy.y, 'WALL')).toBeTruthy();

        expect(okFn).toHaveBeenCalled();
    });

    test.todo('make({ chance: 100, effects: { tile: "WALL", emit: "OK" } })');
    test.todo(
        'make({ chance: 100, effects: { tile: { id: "WALL", flags: "A|B" }, emit: "OK" } })'
    );
    test.todo(
        'make({ chance: 100, tile: { id: "WALL", flags: "A|B" }, emit: "OK"})'
    );

    test('install', () => {
        const te = Effect.install('TEST', 'EMIT:FLOOR');

        expect(Effect.installedEffects.TEST).toBe(te);

        const te2 = Effect.install('TEST2', te);
        expect(te2).not.toBe(te);
        expect(Effect.installedEffects.TEST2).toBe(te2);

        expect(Effect.from('TEST2')).toBe(te2);
        // @ts-ignore
        expect(() => Effect.make('INVALID')).toThrow();
    });

    test('from', () => {
        const eff = Effect.install('T', 'EMIT:TEST');

        expect(Effect.from('T')).toBe(eff);

        const e2 = Effect.from(eff);
        expect(e2).toBe(eff);

        expect(() => Effect.from('INVALID')).toThrow();
    });

    test('resetAll', () => {
        Effect.installAll({
            TEST: 'EMIT:FLOOR',
            TEST2: 'EMIT:WALL',
        });

        Effect.installedEffects.TEST.seen = true;
        Effect.installedEffects.TEST2.seen = true;

        Effect.resetAll();

        expect(Effect.installedEffects.TEST.seen).toBeFalsy();
        expect(Effect.installedEffects.TEST2.seen).toBeFalsy();
    });

    describe.skip('multiple effects', () => {
        test('unknown effect', () => {
            expect(() =>
                Effect.install('TEST', [
                    'emit:TACO',
                    'INVALID', // throws
                ])
            ).toThrow();
        });

        test('gameHasEnded - stops before next', () => {
            const te = Effect.install('TEST', ['EMIT:TACO', 'EMIT:TACO']);

            const fn = jest.fn().mockImplementation(() => {
                GWU.data.gameHasEnded = true;
            });
            map.events.on('TACO', fn);

            expect(te.trigger(xy)).toBeTruthy();
            expect(fn).toHaveBeenCalledTimes(1);
        });

        // test('E_NEXT_ALWAYS',  () => {
        //     const nextFn = jest.fn().mockReturnValue(true);
        //     Effect.install('NEXT', [nextFn]);

        //     const firstFn = jest.fn().mockReturnValue(false); // did nothing
        //     const te2 = Effect.install('FIRST', {
        //         flags: 'E_NEXT_ALWAYS',
        //         fn: firstFn,
        //         next: 'NEXT',
        //     });

        //     expect(te2.next).toEqual('NEXT');
        //     expect(Effect.installedEffects.NEXT).toBeObject();

        //      expect(
        //         Effect.fire(te2, UTILS.mockMap(), xy.x, xy.y)
        //     ).resolves.toBeTruthy();

        //     expect(firstFn).toHaveBeenCalled();
        //     expect(nextFn).toHaveBeenCalled();
        // });

        // test('E_NEXT_EVERYWHERE',  () => {
        //     const nextFn = jest.fn().mockReturnValue(true);
        //     Effect.install('NEXT', {
        //         fn: nextFn,
        //     });

        //     const firstFn = jest
        //         .fn()
        //         .mockImplementation(
        //             (
        //                 _eff: Effect.EffectInfo,
        //                 _map: MapType,
        //                 x: number,
        //                 y: number,
        //                 ctx: Effect.EffectCtx
        //             ) => {
        //                 ctx.grid[x][y] = 1;
        //                 ctx.grid.eachNeighbor(x, y, (_v, i, j, g) => {
        //                     g[i][j] = 1;
        //                 });
        //                 return true;
        //             }
        //         );
        //     const te2 = Effect.install('FIRST', {
        //         flags: 'E_NEXT_EVERYWHERE',
        //         fn: firstFn,
        //         next: 'NEXT',
        //     });

        //     expect(te2.next).toEqual('NEXT');
        //     expect(Effect.installedEffects.NEXT).toBeObject();

        //      expect(
        //         Effect.fire(te2, UTILS.mockMap(), xy.x, xy.y)
        //     ).resolves.toBeTruthy();
        //     expect(firstFn).toHaveBeenCalled();
        //     expect(nextFn).toHaveBeenCalledTimes(9);
        // });

        //     test('next is object',  () => {
        //         const nextFn = jest.fn().mockReturnValue(true);
        //         Effect.install('NEXT', {
        //             fn: nextFn,
        //         });

        //         const firstFn = jest
        //             .fn()
        //             .mockImplementation(
        //                 (
        //                     _eff: Effect.EffectInfo,
        //                     _map: MapType,
        //                     x: number,
        //                     y: number,
        //                     ctx: Effect.EffectCtx
        //                 ) => {
        //                     ctx.grid[x][y] = 1;
        //                     ctx.grid.eachNeighbor(x, y, (_v, i, j, g) => {
        //                         g[i][j] = 1;
        //                     });
        //                     return true;
        //                 }
        //             );
        //         const te2 = Effect.install('FIRST', {
        //             flags: 'E_NEXT_EVERYWHERE',
        //             fn: firstFn,
        //             next: 'NEXT',
        //         });

        //          expect(
        //             Effect.fire(te2, UTILS.mockMap(), xy.x, xy.y)
        //         ).resolves.toBeTruthy();
        //         expect(firstFn).toHaveBeenCalled();
        //         expect(nextFn).toHaveBeenCalledTimes(9);
        //     });

        //     test('next does nothing',  () => {
        //         const next = {
        //             fn: jest.fn().mockReturnValue(false),
        //         };

        //         const eff = Effect.make({ emit: 'TEST' });
        //         // @ts-ignore
        //         eff.next = next;

        //         const result =  Effect.fire(eff, UTILS.mockMap(), xy.x, xy.y);
        //         expect(result).toBeTruthy();
        //         expect(next.fn).toHaveBeenCalled();
        //     });

        //     test('next does nothing - everywhere',  () => {
        //         const next = {
        //             fn: jest.fn().mockReturnValue(false),
        //         };

        //         const effectFn = jest
        //             .fn()
        //             .mockImplementation((_eff, _map, x, y, ctx) => {
        //                 ctx.grid[x][y] = 1;
        //                 return true;
        //             });

        //         const eff = Effect.make({
        //             fn: effectFn,
        //             flags: 'E_NEXT_EVERYWHERE',
        //             next,
        //         });

        //         const result =  Effect.fire(eff, UTILS.mockMap(), xy.x, xy.y);
        //         expect(result).toBeTruthy();
        //         expect(next.fn).toHaveBeenCalled();
        //     });
        // });

        describe.skip('multiple effects', () => {
            afterEach(() => {
                jest.restoreAllMocks();
                map.events.removeAllListeners();
            });

            test('emits', () => {
                const map = UTILS.mockMap(10, 10);
                const eff = Effect.make(['MSG:MSG3', 'EMIT:EMIT3']);
                expect(eff).not.toBeNull();

                jest.spyOn(GWU.message, 'addAt');

                const ctx = { map, x: 10, y: 10, aware: true };

                const fn = jest.fn();
                map.events.on('EMIT3', fn);

                eff.trigger(ctx, ctx as EffectCtx);

                expect(fn).toHaveBeenCalledWith('EMIT3', ctx.x, ctx.y, ctx);
                expect(GWU.message.addAt).toHaveBeenCalledWith(
                    ctx.x,
                    ctx.y,
                    'MSG3',
                    ctx
                );

                // @ts-ignore
                GWU.message.addAt.mockClear();
                fn.mockClear();

                expect(eff.seen).toBeTruthy();

                // Message already logged, so do not do it again...
                eff.trigger(ctx, ctx as EffectCtx);

                expect(fn).toHaveBeenCalledWith('EMIT3', ctx.x, ctx.y, ctx);
                expect(GWU.message.addAt).not.toHaveBeenCalled();

                // reset the effect - so message will be logged
                eff.seen = false;

                // @ts-ignore
                GWU.message.addAt.mockClear();
                fn.mockClear();

                // Message already logged, so do not do it again...
                eff.trigger(ctx, ctx as EffectCtx);

                expect(fn).toHaveBeenCalledWith('EMIT3', ctx.x, ctx.y, ctx);
                expect(GWU.message.addAt).toHaveBeenCalledWith(
                    ctx.x,
                    ctx.y,
                    'MSG3',
                    ctx
                );
            });
        });
    });
});

/*

STAT:INC:health:10

BALL:99:3:FIRE:2d6

SPAWN:WALL:100:100:<FLAGS>

{ type: 'spread', grow: 60, decrement: 40, effect: 'TILE:WALL!', flags: 'E_NEXT_EVERYWHERE', next: 'HEAL' }}

GWM.effect.install('CHASM_EDGE', 'SPAWN:CHASM_EDGE:100');

GWM.effect.install('CHASM_MEDIUM', {
    type: 'spawn',
    grow: 150,
    decrement: 50,
    tile: 'CHASM',
    flags: 'E_NEXT_EVERYWHERE, E_ABORT_IF_BLOCKS_MAP',
    next: 'CHASM_EDGE',
});

GWM.effect.install('HOLE_WITH_PLATE', {
    effect: 'CHASM_MEDIUM',
    next: { tile: 'PRESSURE_PLATE' },
});

GWM.effect.install('PRESSURE_PLATE', 'TILE:PRESSURE_PLATE' );

GWM.effect.install('HOLE_WITH_PLATE', {
    effect: 'CHASM_MEDIUM',
    next: 'PRESSURE_PLATE',
});

GWM.effect.install('HOLE_WITH_PLATE', {
    effect: 'CHASM_MEDIUM',
    next: 'TILE:PRESSURE_PLATE',
});

GWM.effect.install('FLOOR_HEAL', {
    type: 'SPREAD:150:50',
    effects: { tile: 'FLOOR', heal: '2d6' }
});

GWM.effect.install('FLOOR_HEAL', {
    type: 'SPREAD:150',
    tile: 'FLOOR', 
    heal: '2d6'
});

GWM.effect.install('FLOOR_HEAL', {
    type: 'SPREAD', // same as self (spread:0:0)
    tile: 'FLOOR', 
    heal: '2d6'
});

GWM.effect.install('FLOOR_HEAL', {
    type: 'BURST:5', // 5 radius ball from given x,y
    tile: 'FLOOR', 
    heal: '2d6'
});

GWM.effect.install('FLOOR_HEAL', {
    type: 'AURA:2', // Aura
    tile: 'FLOOR', 
    heal: '2d6'
});

*/
