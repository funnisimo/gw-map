import * as GWU from 'gw-utils';
import * as FIRE from './fireLayer';
import * as MAP from '../map';
import * as TILE from '../tile';
import * as Flags from '../flags';
import '../tile/tiles';

describe('fire', () => {
    let map: MAP.Map;

    beforeAll(() => {
        TILE.install('GRASS', {
            depth: 'SURFACE',
            ch: '"',
            fg: 'green',
            name: 'grass',
            actions: {
                fire: { chance: 80 * 100, tile: 'GRASS_ON_FIRE' },
            },
        });

        TILE.install('GRASS_BURNT', {
            depth: 'SURFACE',
            ch: '"',
            fg: 'dark_brown',
            name: 'burnt grass',
        });

        TILE.install('GRASS_ON_FIRE', {
            depth: 'SURFACE',
            ch: '^',
            fg: 'red',
            name: 'burning grass',
            flags: 'T_IS_FIRE',
            priority: 100,
            actions: {
                tick: {
                    chance: 30 * 100,
                    tile: '!GRASS_BURNT',
                },
            },
        });
    });

    beforeEach(() => {
        map = MAP.make(30, 30, 'FLOOR', 'WALL');
    });

    test('tile setup', () => {
        expect(
            TILE.tiles.GRASS.hasTileFlag(Flags.Tile.T_IS_FLAMMABLE)
        ).toBeTruthy();
        expect(TILE.tiles.GRASS.hasAction('fire')).toBeTruthy();

        expect(TILE.tiles.GRASS_ON_FIRE.hasAction('tick')).toBeTruthy();
        expect(
            TILE.tiles.GRASS_ON_FIRE.hasTileFlag(Flags.Tile.T_IS_FIRE)
        ).toBeTruthy();
    });

    test('setup', () => {
        expect(map.hasAction('tick')).toBeFalsy();
        expect(map.hasAction('assign')).toBeFalsy();
        expect(map.hasAction('copy')).toBeFalsy();
        FIRE.fire(map);
        expect(map.hasAction('tick')).toBeTruthy();
        expect(map.hasAction('assign')).toBeTruthy();
        expect(map.hasAction('copy')).toBeTruthy();
    });

    test('fire placed', () => {
        GWU.xy.forRect(10, 10, (i, j) => {
            map.setTile(i + 10, j + 10, 'GRASS');
        });

        map.setTile(15, 15, 'GRASS_ON_FIRE');

        expect(
            map.hasCellFlag(15, 15, Flags.Cell.CAUGHT_FIRE_THIS_TURN)
        ).toBeTruthy();
    });

    test('fire spreads', () => {
        GWU.random.seed(12345);

        FIRE.fire(map);

        GWU.xy.forRect(10, 10, (i, j) => {
            map.setTile(i + 10, j + 10, 'GRASS');
        });

        map.setTile(15, 15, 'GRASS_ON_FIRE');

        expect(
            map.hasCellFlag(15, 15, Flags.Cell.CAUGHT_FIRE_THIS_TURN)
        ).toBeTruthy();

        map.tick(50);

        expect(
            map.hasCellFlag(15, 15, Flags.Cell.CAUGHT_FIRE_THIS_TURN)
        ).toBeFalsy();

        expect(
            map.cells.count((c) =>
                c.hasCellFlag(Flags.Cell.CAUGHT_FIRE_THIS_TURN)
            )
        ).toEqual(3);
    });
});
