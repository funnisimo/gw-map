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
import * as Effect from '../effect';
import * as ACTION from '../action';
import './index';
import '../tile/tiles';

describe('message', () => {
    let action: ACTION.Action;

    beforeEach(() => {
        action = new ACTION.Action('test', {
            map: UTILS.mockMap(20, 20),
            x: 5,
            y: 6,
        });
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    test('make', () => {
        expect(() => Effect.make('MSG')).toThrow();
        expect(() => Effect.make('MSG:Test')).not.toThrow();
    });

    test('logs', () => {
        // const map = UTILS.mockMap(10, 10);
        const eff = Effect.make('MSG:MSG');
        expect(eff).not.toBeNull();

        action.aware = true;
        eff!(action);
        expect(GWU.message.addAt).toHaveBeenCalledWith(5, 6, 'MSG', action);
    });

    // test('default make',  () => {
    //     const map = UTILS.mockMap(10, 10);
    //     const eff = Effect.make('MSG2', 'message');

    //     expect(eff).not.toBeNull();
    //     jest.spyOn(MSG, 'add');
    //     const ctx = { map, x: 5, y: 5 };
    //      eff!.fire(ctx.map, ctx.x, ctx.y);
    //     expect(MSG.add).toHaveBeenCalledWith('MSG2', eff!.ctx);
    // });
});
