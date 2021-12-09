import 'jest-extended';
import '../../../test/matchers';
import * as GWU from 'gw-utils';

import * as Map from '../../map';
import * as Effect from '..';
import '../../tile/tiles';

describe('tile effect', () => {
    let map: Map.Map;

    beforeEach(() => {
        map = Map.make(20, 20, 'FLOOR', 'WALL');

        GWU.data.gameHasEnded = false;

        GWU.rng.random.seed(12345);
        GWU.events.removeAllListeners();
    });

    test('tile', () => {
        const effect = Effect.make('TILE:WALL');

        expect(map.hasTile(5, 6, 'WALL')).toBeFalsy();

        const didSomething = effect.trigger({ map, x: 5, y: 6 });
        expect(didSomething).toBeTruthy();
        expect(map.hasTile(5, 6, 'WALL')).toBeTruthy();
    });

    test('tile - superpriority!', () => {
        const effect = Effect.make('TILE:FLOOR');

        map.setTile(5, 6, 'WALL');
        expect(map.hasTile(5, 6, 'WALL')).toBeTruthy();

        let didSomething = effect.trigger({ map, x: 5, y: 6 });
        expect(didSomething).toBeFalsy();
        expect(map.hasTile(5, 6, 'WALL')).toBeTruthy();

        const effect2 = Effect.make('TILE:FLOOR!');
        didSomething = effect2.trigger({ map, x: 5, y: 6 });
        expect(didSomething).toBeTruthy();
        expect(map.hasTile(5, 6, 'WALL')).toBeFalsy();
    });

    test('tile - !superpriority', () => {
        const effect = Effect.make('TILE:FLOOR');

        map.setTile(5, 6, 'WALL');
        expect(map.hasTile(5, 6, 'WALL')).toBeTruthy();

        let didSomething = effect.trigger({ map, x: 5, y: 6 });
        expect(didSomething).toBeFalsy();
        expect(map.hasTile(5, 6, 'WALL')).toBeTruthy();

        const effect2 = Effect.make('TILE:!FLOOR');
        didSomething = effect2.trigger({ map, x: 5, y: 6 });
        expect(didSomething).toBeTruthy();
        expect(map.hasTile(5, 6, 'WALL')).toBeFalsy();
    });

    test.todo('tile - blocked by actor/item');
});
