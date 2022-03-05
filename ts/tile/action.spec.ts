import * as TEST from '../../test/utils';
import * as TILE from '.';
import * as ACTION from '../action/action';
import './tiles';
import * as GAME from '../game';
import * as PLAYER from '../player';
import * as MAP from '../map';

describe('Tile Action', () => {
    let action: ACTION.Action;
    let game: GAME.Game;
    let map: MAP.Map;
    let player: PLAYER.Player;

    beforeEach(() => {
        player = PLAYER.make({ name: 'Hero' });
        map = MAP.make(20, 20, 'FLOOR', 'WALL');
        game = TEST.mockGame(map, player);
        action = new ACTION.Action({ game, actor: player, map });
    });

    test('eat', () => {
        const actionFn = jest.fn().mockImplementation((a) => a.didSomething());
        const tile = TILE.make({ id: 'TEST', name: 'Test', extends: 'FLOOR' });
        tile.on('eat', actionFn);

        expect(tile.hasAction('eat')).toBeTruthy();
        tile.trigger('eat', action);
        expect(action.isSuccess()).toBeTruthy();

        expect(actionFn).toHaveBeenCalled();
    });

    test('default', () => {
        const tile = TILE.tiles.FLOOR;

        expect(tile.hasAction('test')).toBeFalsy();
        tile.trigger('test', action);
        expect(action.isSuccess()).toBeFalsy();
    });

    test('fails', () => {
        const actionFn = jest.fn().mockImplementation((a) => a.didNothing());
        const tile = TILE.make({ id: 'TEST', name: 'Test', extends: 'FLOOR' });
        tile.on('eat', actionFn);

        expect(tile.hasAction('eat')).toBeTruthy();
        tile.trigger('eat', action);
        expect(action.isSuccess()).toBeFalsy();

        expect(actionFn).toHaveBeenCalled();
    });

    test('tile action - install', () => {
        const climbFn = jest.fn().mockImplementation((a) => a.didNothing());
        const tile = TILE.install('TEST', {
            extends: 'FLOOR',
            actions: {
                climb: climbFn,
            },
        });

        expect(tile.hasAction('climb')).toBeTruthy();
        tile.trigger('climb', action);
        expect(action.isSuccess()).toBeFalsy();
        expect(climbFn).toHaveBeenCalled();
    });
});
