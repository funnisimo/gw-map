import * as TEST from '../../test/utils';

import * as TILE from '../tile';
import * as ACTION from './action';
import '../tile/tiles';
import * as GAME from '../game';
import * as PLAYER from '../player';
import * as MAP from '../map';

describe('Tile Action', () => {
    let action: ACTION.Action;
    let game: GAME.Game;
    let player: PLAYER.Player;
    let map: MAP.Map;

    beforeEach(() => {
        map = MAP.make(20, 20, 'FLOOR', 'WALL');
        player = PLAYER.make({ name: 'Hero' });
        game = TEST.mockGame(map, player);
        game.map = map;

        action = new ACTION.Action('TBD', {
            game,
            actor: player,
            map,
            x: 5,
            y: 5,
        });
    });

    test('unset', () => {
        expect(map.hasAction('unset')).toBeFalsy();
        map.trigger('unset', action);
        expect(action.isSuccess()).toBeFalsy();
    });

    test('map action - success', () => {
        const actionFn = jest.fn().mockImplementation((a) => a.didSomething());
        map.on('test', actionFn);
        expect(map.hasAction('test')).toBeTruthy();

        map.trigger('test', action);
        expect(actionFn).toHaveBeenCalled();
    });

    test('map action - breakout', () => {
        const actionFn = jest.fn().mockImplementation((a) => a.didNothing());

        map.on('test', actionFn);
        expect(map.hasAction('test')).toBeTruthy();
        map.trigger('test', action);

        expect(actionFn).toHaveBeenCalled();
    });

    test('tile action - success', () => {
        const climbFn = jest.fn().mockImplementation((a) => a.didSomething());
        const TEST_TILE = TILE.install('TEST', {
            extends: 'FLOOR',
            actions: {
                climb: climbFn,
            },
        });

        map.setTile(5, 5, TEST_TILE);

        expect(map.hasAction('climb')).toBeFalsy(); // tile has it, not map
        map.trigger('climb', action);

        expect(climbFn).toHaveBeenCalled();
    });

    test('tile action - fail', () => {
        const climbFn = jest.fn().mockImplementation((a) => a.didNothing());
        const TEST_TILE = TILE.install('TEST', {
            extends: 'FLOOR',
            actions: {
                climb: climbFn,
            },
        });

        map.setTile(5, 5, TEST_TILE);

        expect(map.hasAction('climb')).toBeFalsy(); // tile has it, not map
        map.trigger('climb', action);
        expect(climbFn).toHaveBeenCalled();
    });
});
