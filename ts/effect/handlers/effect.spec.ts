import * as UTILS from '../../../test/utils';
import * as EFFECT from '../index';

describe('EffectHandler', () => {
    test('success - async', async () => {
        const fn = jest.fn().mockReturnValue(true);
        EFFECT.install('TEST', {
            fn,
        });

        const effect = EFFECT.make({ effect: 'TEST' });

        const result = await EFFECT.fire(effect, UTILS.mockMap(), 2, 2);

        expect(result).toBeTruthy();
        expect(fn).toHaveBeenCalled();
    });

    test('success - sync', () => {
        const fn = jest.fn().mockReturnValue(true);
        EFFECT.install('TEST', {
            fn,
        });

        const effect = EFFECT.make({ effect: 'TEST' });

        const result = EFFECT.fireSync(effect, UTILS.mockMap(), 2, 2);

        expect(result).toBeTruthy();
        expect(fn).toHaveBeenCalled();
    });

    test('fail - async', async () => {
        const fn = jest.fn().mockReturnValue(false);
        const nextFn = jest.fn();
        EFFECT.install('TEST', {
            fn,
        });

        const effect = EFFECT.make({ effect: 'TEST', next: nextFn });

        const result = await EFFECT.fire(effect, UTILS.mockMap(), 2, 2);

        expect(result).toBeFalsy();
        expect(fn).toHaveBeenCalled();
        expect(nextFn).not.toHaveBeenCalled();
    });

    test('fail - sync', () => {
        const fn = jest.fn().mockReturnValue(false);
        const nextFn = jest.fn();
        EFFECT.install('TEST', {
            fn,
        });

        const effect = EFFECT.make({ effect: 'TEST', next: nextFn });

        const result = EFFECT.fireSync(effect, UTILS.mockMap(), 2, 2);

        expect(result).toBeFalsy();
        expect(fn).toHaveBeenCalled();
        expect(nextFn).not.toHaveBeenCalled();
    });
});
