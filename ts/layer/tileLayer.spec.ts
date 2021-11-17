import * as Map from '../map';
import * as Tile from '../tile';
import * as Flags from '../flags';

describe('tileLayer', () => {
    let map: Map.Map;

    beforeAll(() => {
        Tile.install('GRASS', {
            name: 'grass',
            ch: '"',
            fg: 'green',
            depth: 'SURFACE',
        });
        Tile.install('ALTAR', {
            priority: 'FLOOR+1',
            name: 'Altar',
            ch: 'O',
            flags: 'L_BLOCKS_SURFACE, L_LIST_IN_SIDEBAR',
        });
    });

    beforeEach(() => {
        map = Map.make(20, 20, 'FLOOR', 'WALL');
    });

    test('setTile - blocks surface', () => {
        map.setTile(4, 4, 'GRASS');

        expect(map.hasTile(4, 4, 'GRASS')).toBeTruthy();

        const altar = Tile.tiles.ALTAR;
        expect(altar.hasEntityFlag(Flags.Entity.L_BLOCKS_SURFACE)).toBeTruthy();
        map.setTile(4, 4, 'ALTAR');
        expect(map.hasTile(4, 4, 'GRASS')).toBeFalsy();
        expect(map.hasTile(4, 4, 'ALTAR')).toBeTruthy();
    });

    test('sidebar changed', async () => {
        expect(map.hasMapFlag(Flags.Map.MAP_SIDEBAR_TILES_CHANGED)).toBeFalsy();

        map.setTile(4, 4, 'GRASS');
        expect(map.hasMapFlag(Flags.Map.MAP_SIDEBAR_TILES_CHANGED)).toBeFalsy();

        map.setTile(5, 5, 'ALTAR');
        expect(
            map.hasMapFlag(Flags.Map.MAP_SIDEBAR_TILES_CHANGED)
        ).toBeTruthy();

        map.clearMapFlag(Flags.Map.MAP_SIDEBAR_TILES_CHANGED);
        map.setTile(5, 5, 'FLOOR', { superpriority: true });
        expect(
            map.hasMapFlag(Flags.Map.MAP_SIDEBAR_TILES_CHANGED)
        ).toBeTruthy();
    });
});
