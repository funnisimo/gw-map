import 'jest-extended';
import * as GWU from 'gw-utils';

import * as Map from './map';
import * as Tile from '../tile';
import * as Flags from '../flags';

describe('Map', () => {
    test('from', () => {
        Tile.install('GRASS', {
            depth: 'SURFACE',
            ch: '"',
            fg: 'green',
        });

        Tile.install('TREE', {
            depth: 'SURFACE',
            ch: 'T',
            fg: 'green',
            flags: 'L_BLOCKS_MOVE, L_BLOCKS_VISION',
        });

        const charToTile = {
            '"': 'GRASS',
            T: 'TREE',
            '.': 'FLOOR',
            '#': 'WALL',
            '+': 'DOOR',
            '~': 'LAKE',
            '=': 'BRIDGE',
        };

        const prefab = [
            '##########',
            '#....."..#',
            '##.."T"..#',
            '#...TT"..#',
            '#.TT~~..##',
            '#.."~~~".#',
            '#...==...#',
            '#."~~~"..#',
            '#.."~~~".#',
            '##########',
        ];

        const map = Map.from(prefab, charToTile, {
            fov: true,
            revealed: true,
        });

        const mixer = new GWU.sprite.Mixer();

        map.getAppearanceAt(0, 0, mixer);
        expect(mixer.fg.toInt()).toBeGreaterThan(0);
        expect(mixer.bg.toInt()).toBeGreaterThan(0);

        expect(Tile.tiles.BRIDGE.groundTile).toEqual('LAKE');
        expect(Tile.tiles.LAKE).toBeDefined();

        expect(map.cell(4, 6).hasTile('BRIDGE')).toBeTruthy();
        expect(map.cell(4, 6).hasTile('LAKE')).toBeTruthy();
    });

    test('clone (incl. copy)', () => {
        const map = Map.make(20, 20, 'FLOOR', 'WALL');
        map.properties.test = 1;
        map.seed = 12345;
        map.setMapFlag(Flags.Map.MAP_SAW_WELCOME);

        const clone = map.clone();
        expect(clone.properties.test).toEqual(1);
        expect(clone.rng).toBe(map.rng);
        GWU.xy.forRect(map.width, map.height, (x, y) => {
            const tile = clone.isBoundaryXY(x, y) ? 'WALL' : 'FLOOR';
            expect(clone.hasTile(x, y, tile)).toBeTruthy();
        });
        expect(clone.hasMapFlag(Flags.Map.MAP_SAW_WELCOME)).toBeTruthy();
    });

    test('make', () => {
        const map = Map.make(10, 10);
        expect(map.cell(0, 0).needsRedraw).toBeTruthy();
        expect(map.fov.isAnyKindOfVisible(0, 0)).toBeTrue(); // by default the map is visible

        expect(map.hasMapFlag(Flags.Map.MAP_CHANGED)).toBeFalsy();
        // map.dump();
    });

    test('rng', () => {
        const map = Map.make(20, 20, {
            tile: 'FLOOR',
            boundary: 'WALL',
            seed: 12345,
        });

        const nums = [];
        for (let i = 0; i < 100; ++i) {
            nums.push(map.rng.number());
        }

        map.rng.seed(12345);
        const nums2 = [];
        for (let i = 0; i < 100; ++i) {
            nums2.push(map.rng.number());
        }

        expect(nums).toEqual(nums2);

        map.seed = 12345;
        const nums3 = [];
        for (let i = 0; i < 100; ++i) {
            nums3.push(map.rng.number());
        }

        expect(nums).toEqual(nums2);
        expect(nums).toEqual(nums3);
    });
});
