import 'jest-extended';
import '../../test/matchers';
import * as GWU from 'gw-utils';

import * as Map from '../map';
import * as ACTION from '../action';
import * as Effect from '../effect';
import './index';
import '../tile/tiles';

describe('tile effect', () => {
    let map: Map.Map;
    let action: ACTION.Action;

    beforeEach(() => {
        map = Map.make(20, 20, 'FLOOR', 'WALL');
        action = new ACTION.Action({ map, x: 5, y: 6 });

        GWU.data.gameHasEnded = false;

        GWU.rng.random.seed(12345);
    });

    test('tile', () => {
        const effect = Effect.make('TILE:WALL');

        expect(map.hasTile(5, 6, 'WALL')).toBeFalsy();

        effect!(action);
        expect(action.isSuccess()).toBeTruthy();
        expect(map.hasTile(5, 6, 'WALL')).toBeTruthy();
    });

    test('tile - superpriority!', () => {
        const effect = Effect.make('TILE:FLOOR');

        map.setTile(5, 6, 'WALL');
        expect(map.hasTile(5, 6, 'WALL')).toBeTruthy();

        effect!(action);
        expect(action.isSuccess()).toBeFalsy();
        expect(map.hasTile(5, 6, 'WALL')).toBeTruthy();

        const effect2 = Effect.make('TILE:FLOOR!');
        effect2!(action);
        expect(action.isSuccess()).toBeTruthy();
        expect(map.hasTile(5, 6, 'WALL')).toBeFalsy();
    });

    test('tile - !superpriority', () => {
        const effect = Effect.make({ tile: 'FLOOR' });

        map.setTile(5, 6, 'WALL');
        expect(map.hasTile(5, 6, 'WALL')).toBeTruthy();

        effect!(action);
        expect(action.isSuccess()).toBeFalsy();
        expect(map.hasTile(5, 6, 'WALL')).toBeTruthy();

        const effect2 = Effect.make({ tile: '!FLOOR' });
        effect2!(action);
        expect(action.isSuccess()).toBeTruthy();
        expect(map.hasTile(5, 6, 'WALL')).toBeFalsy();
    });

    test.todo('tile - blocked by actor/item');
});
