import 'jest-extended';
import '../../../test/matchers';
import * as UTILS from '../../../test/utils';
import * as Effect from '..';

describe('fn', () => {
    test('fn', async () => {
        const map = UTILS.mockMap(10, 10);
        const fn = jest.fn();
        const eff = Effect.make({ fn });

        expect(eff).not.toBeNull();
        const ctx = { data: true };
        await Effect.fire(eff, map, 5, 6, ctx);
        expect(fn).toHaveBeenCalledWith(eff, map, 5, 6, ctx);
    });

    test('default make', async () => {
        const map = UTILS.mockMap(10, 10);
        const fn = jest.fn();
        const eff = Effect.make(fn);

        expect(eff).not.toBeNull();
        const ctx = { data: true };
        await Effect.fire(eff, map, 5, 6, ctx);
        expect(fn).toHaveBeenCalledWith(eff, map, 5, 6, ctx);
    });

    test('didSomething calls next', async () => {
        const map = UTILS.mockMap(10, 10);
        const fn = jest.fn().mockReturnValue(true); // did something
        const nextFn = jest.fn();

        const eff = Effect.make({ fn, next: nextFn });
        expect(eff).not.toBeNull();

        const ctx = { data: true };
        await Effect.fire(eff, map, 5, 6, ctx);
        expect(fn).toHaveBeenCalledWith(eff, map, 5, 6, ctx);
        expect(nextFn).toHaveBeenCalledWith(eff.next, map, 5, 6, ctx);
    });

    test('did nothing does not call next', async () => {
        const map = UTILS.mockMap(10, 10);
        const fn = jest.fn().mockReturnValue(false); // did nothing
        const nextFn = jest.fn();

        const eff = Effect.make({ fn, next: nextFn });
        expect(eff).not.toBeNull();

        const ctx = { data: true };
        await Effect.fire(eff, map, 5, 6, ctx);
        expect(fn).toHaveBeenCalledWith(eff, map, 5, 6, ctx);
        expect(nextFn).not.toHaveBeenCalled();
    });

    // test('default make - with type', async () => {
    //     const map = UTILS.mockMap(10, 10);
    //     const fn = jest.fn();
    //     const eff = Effect.make(fn, 'fn');

    //     expect(eff).not.toBeNull();
    //     const ctx = { map, x: 5, y: 5 };
    //     await eff!.fire(ctx.map, 5, 6);
    //     expect(fn).toHaveBeenCalledWith(eff, 5, 6);
    // });
});
