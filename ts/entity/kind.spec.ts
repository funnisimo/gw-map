import * as GWU from 'gw-utils';
import * as Entity from '.';
import * as Map from '../map';

import '../effects';
import '../tile/tiles';

describe('Entity Kind', () => {
    test('basics', () => {
        const kind = new Entity.EntityKind({
            name: 'an entity',
            ch: '%',
            fg: 0x800,
            bg: 'black',
        });

        const entity = new Entity.Entity(kind);

        expect(entity.getName()).toEqual('an entity');
        expect(entity.getFlavor()).toEqual('an entity');
        expect(entity.getDescription()).toEqual('an entity');
        expect(entity.sprite).toMatchObject({
            ch: '%',
            fg: GWU.color.from(0x800),
            bg: GWU.color.colors.black,
        });
    });

    test('forbidsCell', () => {
        const kind = new Entity.EntityKind({
            name: 'a Spectator',
            ch: 's',
            fg: 'white',
            requireTileFlags: 'T_DEEP_WATER',
        });
        expect(kind.requireTileFlags).toBeGreaterThan(0);

        const map = Map.make(10, 10, 'FLOOR', 'WALL');
        const cell = map.cell(5, 5);
        expect(kind.avoidsCell(cell)).toBeTruthy();
        expect(kind.forbidsCell(cell)).toBeTruthy();

        map.setTile(5, 5, 'LAKE');
        expect(kind.avoidsCell(cell)).toBeFalsy();
        expect(kind.forbidsCell(cell)).toBeFalsy();
    });
});
