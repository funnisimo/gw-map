import * as GWU from 'gw-utils';
import * as GAS from './gasLayer';
import * as MAP from '../map';
import * as TILE from '../tile';
import * as Flags from '../flags';
import '../tile/tiles';

describe('fire', () => {
    let map: MAP.Map;

    beforeAll(() => {
        TILE.install('SWAMP_GAS', {
            depth: 'GAS',
            bg: 'dark_green',
            priority: 25,
            dissipate: 0,
        });
    });

    beforeEach(() => {
        map = MAP.make(30, 30, 'FLOOR', 'WALL');
        TILE.tiles.SWAMP_GAS.dissipate = 0;
    });

    test('tile setup', () => {
        expect(TILE.tiles.SWAMP_GAS.dissipate).toEqual(0);
        expect(TILE.tiles.SWAMP_GAS.depth).toEqual(Flags.Depth.GAS);
    });

    test('setup', () => {
        expect(map.hasAction('tick')).toBeFalsy();
        expect(map.hasAction('assign')).toBeFalsy();
        expect(map.hasAction('copy')).toBeFalsy();
        GAS.gas(map);
        expect(map.hasAction('tick')).toBeTruthy();
        expect(map.hasAction('assign')).toBeTruthy();
        expect(map.hasAction('copy')).toBeTruthy();
    });

    test('gas placed', () => {
        map.setTile(15, 15, 'SWAMP_GAS', { volume: 100 });
        expect(map.cell(15, 15).volume).toEqual(100);
    });

    test('gas cleared', () => {
        map.setTile(15, 15, 'SWAMP_GAS', { volume: 100 });
        expect(map.cell(15, 15).volume).toEqual(100);

        map.clearCell(15, 15, 'FLOOR');
        expect(map.cell(15, 15).volume).toEqual(0);
    });

    test('gas depth cleared', () => {
        map.setTile(15, 15, 'SWAMP_GAS', { volume: 100 });
        expect(map.cell(15, 15).volume).toEqual(100);

        map.cell(15, 15).clearDepth(Flags.Depth.GAS);
        expect(map.cell(15, 15).volume).toEqual(0);
        expect(map.hasTile(15, 15, 'SWAMP_GAS')).toBeFalsy();
    });

    test('gas spreads - no dissipate', () => {
        GWU.random.seed(12345);

        GAS.gas(map);

        map.setTile(15, 15, 'SWAMP_GAS', { volume: 100 });
        expect(map.cells.count((c) => c.volume > 0)).toEqual(1);

        map.tick(50);
        expect(map.cells.count((c) => c.volume > 0)).toEqual(9);

        map.tick(50);
        expect(map.cells.count((c) => c.volume > 0)).toEqual(25);

        map.tick(50);
        expect(map.cells.count((c) => c.volume > 0)).toEqual(49);

        map.tick(50);
        expect(map.cells.count((c) => c.volume > 0)).toEqual(69);

        map.tick(50);
        expect(map.cells.count((c) => c.volume > 0)).toEqual(69);

        map.tick(50);
        expect(map.cells.count((c) => c.volume > 0)).toEqual(81);

        map.tick(50);
        expect(map.cells.count((c) => c.volume > 0)).toEqual(89);

        map.tick(50);
        expect(map.cells.count((c) => c.volume > 0)).toEqual(94);

        map.tick(50);
        expect(map.cells.count((c) => c.volume > 0)).toEqual(97);

        map.tick(50);
        expect(map.cells.count((c) => c.volume > 0)).toEqual(97);

        map.tick(50);
        expect(map.cells.count((c) => c.volume > 0)).toEqual(97);
    });

    test('gas spreads - dissipate', () => {
        GWU.random.seed(12345);
        TILE.tiles.SWAMP_GAS.dissipate = 100; // 1%

        GAS.gas(map);

        map.setTile(15, 15, 'SWAMP_GAS', { volume: 100 });
        expect(map.cells.count((c) => c.volume > 0)).toEqual(1);

        map.tick(50);
        expect(map.cells.count((c) => c.volume > 0)).toEqual(9);

        map.tick(50);
        expect(map.cells.count((c) => c.volume > 0)).toEqual(25);

        map.tick(50);
        expect(map.cells.count((c) => c.volume > 0)).toEqual(45);

        map.tick(50);
        expect(map.cells.count((c) => c.volume > 0)).toEqual(45);

        map.tick(50);
        expect(map.cells.count((c) => c.volume > 0)).toEqual(45);

        map.tick(50);
        expect(map.cells.count((c) => c.volume > 0)).toEqual(37);

        map.tick(50);
        expect(map.cells.count((c) => c.volume > 0)).toEqual(21);

        map.tick(50);
        expect(map.cells.count((c) => c.volume > 0)).toEqual(0);

        map.tick(50);
        expect(map.cells.count((c) => c.volume > 0)).toEqual(0);
    });
});
