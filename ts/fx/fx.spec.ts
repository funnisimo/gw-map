import '../../test/matchers';
import 'jest-extended';

import * as GWU from 'gw-utils';
import * as Tile from '../tile';
import * as Map from '../map';
import * as FX from './index';

import '../effects';
import '../tile/tiles';

describe('FX', () => {
    beforeEach(() => {
        GWU.rng.cosmetic.seed(12345);
        GWU.rng.random.seed(12345);
    });

    test('will show up in a cell', () => {
        const FLOOR = Tile.tiles.FLOOR;
        const m = Map.make(20, 20, { tile: 'FLOOR', boundary: 'WALL' });
        const cell = m.cell(2, 2);

        const sprite = new GWU.sprite.Mixer();
        m.getAppearanceAt(2, 2, sprite);
        expect(sprite.ch).toEqual(FLOOR.sprite.ch);
        expect(sprite.fg).toBakeFrom(FLOOR.sprite.fg);
        expect(sprite.bg).toBakeFrom(FLOOR.sprite.bg);

        const hit = GWU.sprite.make('!', 'red');
        let resolved = false;
        const tween = FX.flashSprite(m, 2, 2, hit, 100, 1);
        tween.onFinish(() => (resolved = true));
        m.addAnimation(tween.start());

        expect(cell.hasFx()).toBeTruthy();
        expect(cell.needsRedraw).toBeTruthy();
        expect(m.needsRedraw).toBeTruthy();

        m.getAppearanceAt(2, 2, sprite);
        expect(sprite.ch).toEqual(hit.ch);
        expect(sprite.fg).toEqual(hit.fg);
        expect(sprite.bg).toBakeFrom(FLOOR.sprite.bg);

        m.tick(50);
        expect(cell.hasFx()).toBeTruthy();
        m.tick(50);
        expect(cell.hasFx()).toBeFalsy();

        m.getAppearanceAt(2, 2, sprite);

        expect(sprite.ch).toEqual(Tile.tiles.FLOOR.sprite.ch);
        expect(sprite.fg).toBakeFrom(FLOOR.sprite.fg);
        expect(sprite.bg).toBakeFrom(FLOOR.sprite.bg);

        expect(resolved).toBeTruthy();
    });
});
