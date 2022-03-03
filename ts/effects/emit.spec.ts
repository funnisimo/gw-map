import 'jest-extended';
import '../../test/matchers';
import * as TEST from '../../test/utils';

import * as PLAYER from '../player';
import * as Effect from '../effect';
import * as Map from '../map';
import * as ACTION from '../action';
import './index';
import '../tile/tiles';

describe('emit', () => {
    let map: Map.Map;
    let action: ACTION.Action;

    beforeEach(() => {
        map = Map.make(20, 20);
        const player = PLAYER.make({ name: 'Hero ' });
        const game = TEST.mockGame(map, player);
        action = new ACTION.Action('emit', {
            map,
            x: 5,
            y: 6,
            game,
            actor: player,
        });
    });

    test('make', () => {
        expect(() => Effect.make('EMIT:ID')).not.toThrow();
        expect(() => Effect.make('EMIT')).toThrow();
    });

    test('emits', () => {
        const eff = Effect.make('EMIT:EMIT1');
        expect(eff).toBeFunction();

        const fn = jest.fn().mockImplementation((a) => a.didSomething());
        map.on('EMIT1', fn);

        eff!(action);
        expect(action.isSuccess()).toBeTruthy();
        expect(fn).toHaveBeenCalledWith(action);
    });

    test('emits', () => {
        const eff = Effect.make({ emit: 'EMIT1' });
        expect(eff).toBeFunction();

        const fn = jest.fn().mockImplementation((a) => a.didSomething());
        map.on('EMIT1', fn);

        eff!(action);
        expect(action.isSuccess()).toBeTruthy();
        expect(fn).toHaveBeenCalledWith(action);
    });

    test.todo('emit on game');
    test.todo('emit on actor');
});
