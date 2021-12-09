import 'jest-extended';
import '../../../test/matchers';
import * as UTILS from '../../../test/utils';
import * as Effect from '..';

describe('fn', () => {
    test('fn', () => {
        const map = UTILS.mockMap(10, 10);
        const fn = jest.fn();
        const eff = Effect.make(fn as Effect.EffectFn);

        expect(eff).not.toBeNull();
        eff.trigger({ map, x: 5, y: 6 });
        expect(fn).toHaveBeenCalled();
    });

    test('default make', () => {
        const map = UTILS.mockMap(10, 10);
        const fn = jest.fn();
        const eff = Effect.make({ effects: fn as Effect.EffectFn });

        expect(eff).not.toBeNull();
        eff.trigger({ map, x: 5, y: 6 });
        expect(fn).toHaveBeenCalled();
    });

    test('didSomething calls next', () => {
        const map = UTILS.mockMap(10, 10);
        const fn = jest.fn().mockReturnValue(true); // did something
        const nextFn = jest.fn();

        const eff = Effect.make([fn, nextFn]);
        expect(eff).not.toBeNull();

        eff.trigger({ map, x: 5, y: 6 });
        expect(fn).toHaveBeenCalled();
        expect(nextFn).toHaveBeenCalled();
    });

    test('did nothing still does next call', () => {
        const map = UTILS.mockMap(10, 10);
        const fn = jest.fn().mockReturnValue(false); // did nothing
        const nextFn = jest.fn();

        const eff = Effect.make([fn, nextFn]);
        expect(eff).not.toBeNull();

        eff.trigger({ map, x: 5, y: 6 });
        expect(fn).toHaveBeenCalled();
        expect(nextFn).toHaveBeenCalled();
    });

    // test('default make - with type',  () => {
    //     const map = UTILS.mockMap(10, 10);
    //     const fn = jest.fn();
    //     const eff = Effect.make(fn, 'fn');

    //     expect(eff).not.toBeNull();
    //     const ctx = { map, x: 5, y: 5 };
    //      eff!.fire(ctx.map, 5, 6);
    //     expect(fn).toHaveBeenCalledWith(eff, 5, 6);
    // });
});
