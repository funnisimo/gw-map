import * as Map from '../../map';
import * as Effect from '../effect';
import '../../tile/tiles';

describe('basic', () => {
    test('{ type, effect }', () => {
        const eff = Effect.make({ type: 'basic', effect: 'TILE:WALL' });
        const map = Map.make(20, 20, 'FLOOR', 'WALL');
        expect(map.hasTile(5, 5, 'WALL')).toBeFalsy();
        expect(eff.trigger({ map, x: 5, y: 5 })).toBeTruthy();
        expect(map.hasTile(5, 5, 'WALL')).toBeTruthy();
    });

    test('"effect"', () => {
        const eff = Effect.make('TILE:WALL');
        const map = Map.make(20, 20, 'FLOOR', 'WALL');
        expect(map.hasTile(5, 5, 'WALL')).toBeFalsy();
        expect(eff.trigger({ map, x: 5, y: 5 })).toBeTruthy();
        expect(map.hasTile(5, 5, 'WALL')).toBeTruthy();
    });

    test('["effect"]', () => {
        const eff = Effect.make(['TILE:WALL']);
        const map = Map.make(20, 20, 'FLOOR', 'WALL');
        expect(map.hasTile(5, 5, 'WALL')).toBeFalsy();
        expect(eff.trigger({ map, x: 5, y: 5 })).toBeTruthy();
        expect(map.hasTile(5, 5, 'WALL')).toBeTruthy();
    });

    test('{ effects: "" }', () => {
        const eff = Effect.make({ effects: 'TILE:WALL' });
        const map = Map.make(20, 20, 'FLOOR', 'WALL');
        expect(map.hasTile(5, 5, 'WALL')).toBeFalsy();
        expect(eff.trigger({ map, x: 5, y: 5 })).toBeTruthy();
        expect(map.hasTile(5, 5, 'WALL')).toBeTruthy();
    });

    test('{ effects: [] }', () => {
        const eff = Effect.make({ effects: ['TILE:WALL'] });
        const map = Map.make(20, 20, 'FLOOR', 'WALL');
        expect(map.hasTile(5, 5, 'WALL')).toBeFalsy();
        expect(eff.trigger({ map, x: 5, y: 5 })).toBeTruthy();
        expect(map.hasTile(5, 5, 'WALL')).toBeTruthy();
    });

    test('{ effects: {} }', () => {
        const eff = Effect.make({ effects: { tile: 'WALL' } });
        const map = Map.make(20, 20, 'FLOOR', 'WALL');
        expect(map.hasTile(5, 5, 'WALL')).toBeFalsy();
        expect(eff.trigger({ map, x: 5, y: 5 })).toBeTruthy();
        expect(map.hasTile(5, 5, 'WALL')).toBeTruthy();
    });
});
