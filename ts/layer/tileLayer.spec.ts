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
            name: 'Altar',
            ch: 'O',
            flags: 'L_BLOCKS_SURFACE',
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
});
