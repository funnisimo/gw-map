import 'jest-extended';
import '../../../test/matchers';
import * as Effect from '..';
import * as Map from '../../map';

describe('emit', () => {
    let map: Map.Map;

    beforeEach(() => {
        map = Map.make(20, 20);
    });

    afterEach(() => {
        map.events.removeAllListeners();
    });

    // test('not gonna happen',  () => {
    //     const eff = Effect.make({ emit: 'TEST' });
    //      expect(Effect.effectEmit(eff, 3, 4)).resolves.toBeFalsy();
    // });

    test('make', () => {
        expect(() => Effect.make('EMIT:ID')).not.toThrow();
        expect(() => Effect.make('EMIT')).toThrow();
    });

    test('emits', () => {
        const eff = Effect.make('EMIT:EMIT1');
        expect(eff).not.toBeNull();

        const fn = jest.fn();
        map.events.on('EMIT1', fn);

        const didSomething = eff.trigger({ map, x: 5, y: 6 });
        expect(didSomething).toBeTruthy();
        expect(fn).toHaveBeenCalledWith({ map, x: 5, y: 6 }, expect.anything());
    });

    // test('default make',  () => {
    //     const map = UTILS.mockMap(10, 10);
    //     const eff = Effect.make('EMIT2', 'emit');

    //     expect(eff).not.toBeNull();
    //     const fn = jest.fn();
    //     Events.on('EMIT2', fn);
    //     const ctx = { map, x: 5, y: 5 };
    //      eff!.fire(ctx.map, ctx.x, ctx.y);
    //     expect(fn).toHaveBeenCalledWith('EMIT2', ctx.x, ctx.y, eff);
    // });

    test('emit', () => {
        const te = Effect.install('TEST', 'EMIT:TACO');

        const fn = jest.fn();
        map.events.on('TACO', fn);

        te.trigger({ map, x: 5, y: 5 });
        expect(fn).toHaveBeenCalled();
    });
});
