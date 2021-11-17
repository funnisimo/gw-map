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

import * as Effect from '.';
import { MapType } from '../map/types';
import * as Flags from '../flags';

describe('Effect', () => {
    afterEach(() => {
        GWU.data.gameHasEnded = false;
        jest.restoreAllMocks();
    });

    test('flags', () => {
        expect(Flags.Effect.E_BUILD_IN_WALLS).toBeGreaterThan(0);
    });

    test('install', () => {
        const te = Effect.install('TEST', {
            emit: 'FLOOR',
        });

        expect(Effect.effects.TEST).toBe(te);

        const te2 = Effect.install('TEST2', te);
        expect(te2).not.toBe(te);
        expect(Effect.effects.TEST2).toBe(te2);

        expect(Effect.from('TEST2')).toBe(te2);
        // @ts-ignore
        expect(() => Effect.make('INVALID')).toThrow();
    });

    test('make', () => {
        const eff = Effect.make({
            emit: 'TEST',
            next: { message: 'YES!' },
        });

        expect(eff.next).not.toBeNull();
        expect(eff.next).toBeObject();

        // @ts-ignore
        expect(() => Effect.make(null)).toThrow();
    });

    test('from', () => {
        const eff = Effect.install('T', {
            emit: 'TEST',
        });

        expect(Effect.from('T')).toBe(eff);

        const e2 = Effect.from(eff);
        expect(e2).toMatchObject(eff);
        expect(e2).not.toBe(eff);

        expect(() => Effect.from('INVALID')).toThrow();
    });

    describe('custom', () => {
        test('fails to make - still ok', () => {
            const handler = {
                make: jest.fn().mockReturnValue(false),
                fire: jest.fn(),
                fireSync: jest.fn(),
            };

            Effect.installHandler('TEST', handler);

            const eff = Effect.make({ TEST: true });
            expect(eff).toMatchObject({
                flags: 0,
                chance: 0,
                next: null,
                id: 'n/a',
            });
        });
    });

    test('resetAll', () => {
        Effect.installAll({
            TEST: { emit: 'FLOOR' },
            TEST2: { emit: 'WALL' },
        });

        Effect.effects.TEST.flags |= Flags.Effect.E_FIRED;
        Effect.effects.TEST2.flags |= Flags.Effect.E_FIRED;

        Effect.resetAll();

        expect(Effect.effects.TEST.flags & Flags.Effect.E_FIRED).toBeFalsy();
        expect(Effect.effects.TEST2.flags & Flags.Effect.E_FIRED).toBeFalsy();
    });

    describe('next', () => {
        test('unknown next', async () => {
            const te = Effect.install('TEST', {
                emit: 'TACO',
                next: 'INVALID', // Not called
            });

            await expect(
                Effect.fire(te, UTILS.mockMap(), 5, 5)
            ).rejects.toThrow();
        });

        test('gameHasEnded - stops before next', async () => {
            const te = Effect.install('TEST', {
                emit: 'TACO',
                next: 'INVALID', // Not called
            });

            const fn = jest.fn().mockImplementation(() => {
                GWU.data.gameHasEnded = true;
            });
            GWU.events.on('TACO', fn);

            await expect(
                Effect.fire(te, UTILS.mockMap(), 5, 5)
            ).resolves.toBeTruthy();
            expect(fn).toHaveBeenCalled();
        });

        test('E_NEXT_ALWAYS', async () => {
            const nextFn = jest.fn().mockReturnValue(true);
            Effect.install('NEXT', {
                fn: nextFn,
            });

            const firstFn = jest.fn().mockReturnValue(false); // did nothing
            const te2 = Effect.install('FIRST', {
                flags: 'E_NEXT_ALWAYS',
                fn: firstFn,
                next: 'NEXT',
            });

            expect(te2.next).toEqual('NEXT');
            expect(Effect.effects.NEXT).toBeObject();

            await expect(
                Effect.fire(te2, UTILS.mockMap(), 5, 5)
            ).resolves.toBeTruthy();

            expect(firstFn).toHaveBeenCalled();
            expect(nextFn).toHaveBeenCalled();
        });

        test('E_NEXT_EVERYWHERE', async () => {
            const nextFn = jest.fn().mockReturnValue(true);
            Effect.install('NEXT', {
                fn: nextFn,
            });

            const firstFn = jest
                .fn()
                .mockImplementation(
                    (
                        _eff: Effect.EffectInfo,
                        _map: MapType,
                        x: number,
                        y: number,
                        ctx: Effect.EffectCtx
                    ) => {
                        ctx.grid[x][y] = 1;
                        ctx.grid.eachNeighbor(x, y, (_v, i, j, g) => {
                            g[i][j] = 1;
                        });
                        return true;
                    }
                );
            const te2 = Effect.install('FIRST', {
                flags: 'E_NEXT_EVERYWHERE',
                fn: firstFn,
                next: 'NEXT',
            });

            expect(te2.next).toEqual('NEXT');
            expect(Effect.effects.NEXT).toBeObject();

            await expect(
                Effect.fire(te2, UTILS.mockMap(), 5, 5)
            ).resolves.toBeTruthy();
            expect(firstFn).toHaveBeenCalled();
            expect(nextFn).toHaveBeenCalledTimes(9);
        });

        test('next is object', async () => {
            const nextFn = jest.fn().mockReturnValue(true);
            Effect.install('NEXT', {
                fn: nextFn,
            });

            const firstFn = jest
                .fn()
                .mockImplementation(
                    (
                        _eff: Effect.EffectInfo,
                        _map: MapType,
                        x: number,
                        y: number,
                        ctx: Effect.EffectCtx
                    ) => {
                        ctx.grid[x][y] = 1;
                        ctx.grid.eachNeighbor(x, y, (_v, i, j, g) => {
                            g[i][j] = 1;
                        });
                        return true;
                    }
                );
            const te2 = Effect.install('FIRST', {
                flags: 'E_NEXT_EVERYWHERE',
                fn: firstFn,
                next: 'NEXT',
            });

            await expect(
                Effect.fire(te2, UTILS.mockMap(), 5, 5)
            ).resolves.toBeTruthy();
            expect(firstFn).toHaveBeenCalled();
            expect(nextFn).toHaveBeenCalledTimes(9);
        });

        test('next does nothing', async () => {
            const next = {
                fn: jest.fn().mockReturnValue(false),
            };

            const eff = Effect.make({ emit: 'TEST' });
            // @ts-ignore
            eff.next = next;

            const result = await Effect.fire(eff, UTILS.mockMap(), 5, 5);
            expect(result).toBeTruthy();
            expect(next.fn).toHaveBeenCalled();
        });

        test('next does nothing - everywhere', async () => {
            const next = {
                fn: jest.fn().mockReturnValue(false),
            };

            const effectFn = jest
                .fn()
                .mockImplementation((_eff, _map, x, y, ctx) => {
                    ctx.grid[x][y] = 1;
                    return true;
                });

            const eff = Effect.make({
                fn: effectFn,
                flags: 'E_NEXT_EVERYWHERE',
                next,
            });

            const result = await Effect.fire(eff, UTILS.mockMap(), 5, 5);
            expect(result).toBeTruthy();
            expect(next.fn).toHaveBeenCalled();
        });
    });

    describe('multiple effects', () => {
        afterEach(() => {
            jest.restoreAllMocks();
            GWU.events.removeAllListeners();
        });

        test('emits', async () => {
            const map = UTILS.mockMap(10, 10);
            const eff = Effect.make({ message: 'MSG3', emit: 'EMIT3' });
            expect(eff).not.toBeNull();

            jest.spyOn(GWU.message, 'addAt');

            const fn = jest.fn();
            GWU.events.on('EMIT3', fn);

            const ctx: Partial<Effect.EffectCtx> = { data: true };

            await Effect.fire(eff, map, ctx.x, ctx.y, ctx);

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

            // Message already logged, so do not do it again...
            await Effect.fire(eff, map, ctx.x, ctx.y, ctx);

            expect(fn).toHaveBeenCalledWith('EMIT3', ctx.x, ctx.y, ctx);
            expect(GWU.message.add).not.toHaveBeenCalledWith('MSG3', ctx);

            // reset the effect - so message will be logged
            Effect.reset(eff);

            // @ts-ignore
            GWU.message.addAt.mockClear();
            fn.mockClear();

            // Message already logged, so do not do it again...
            await Effect.fire(eff, map, ctx.x, ctx.y, ctx);

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
