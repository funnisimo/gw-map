import 'jest-extended';
import '../../test/matchers';
import * as UTILS from '../../test/utils';
import * as Effect from '../effect';
import * as ACTION from '../action';

import './index';
import '../tile/tiles';

describe('fn', () => {
    test('fn', () => {
        const map = UTILS.mockMap(10, 10);
        const fn = jest.fn();
        const eff = Effect.make(fn);

        expect(eff).not.toBeNull();

        const action = new ACTION.Action('tbd', { map, x: 5, y: 6 });
        eff!(action);
        expect(fn).toHaveBeenCalled();
    });

    test('default make', () => {
        const map = UTILS.mockMap(10, 10);
        const fn = jest.fn();
        const eff = Effect.make({ fn });

        expect(eff).not.toBeNull();
        const action = new ACTION.Action('tbd', { map, x: 5, y: 6 });
        eff!(action);
        expect(fn).toHaveBeenCalled();
    });

    test('didSomething calls next', () => {
        const map = UTILS.mockMap(10, 10);
        const fn = jest.fn().mockImplementation((a) => a.didSomething()); // did something
        const nextFn = jest.fn();

        const eff = Effect.make([fn, nextFn]);
        expect(eff).not.toBeNull();

        const action = new ACTION.Action('tbd', { map, x: 5, y: 6 });
        eff!(action);
        expect(fn).toHaveBeenCalled();
        expect(nextFn).toHaveBeenCalled();
    });

    test('did nothing still does next call', () => {
        const map = UTILS.mockMap(10, 10);
        const fn = jest.fn().mockImplementation((a) => a.didNothing());
        const nextFn = jest.fn();

        const eff = Effect.make([fn, nextFn]);
        expect(eff).not.toBeNull();

        const action = new ACTION.Action('tbd', { map, x: 5, y: 6 });
        eff!(action);
        expect(fn).toHaveBeenCalled();
        expect(nextFn).toHaveBeenCalled();
    });

    test('stop stops progression', () => {
        const map = UTILS.mockMap(10, 10);
        const fn = jest.fn().mockImplementation((a) => a.stop());
        const nextFn = jest.fn();

        const eff = Effect.make([fn, nextFn]);
        expect(eff).not.toBeNull();

        const action = new ACTION.Action('tbd', { map, x: 5, y: 6 });
        eff!(action);
        expect(fn).toHaveBeenCalled();
        expect(nextFn).not.toHaveBeenCalled();
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
