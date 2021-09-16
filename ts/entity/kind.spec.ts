import * as GWU from 'gw-utils';
import * as Entity from '.';
import * as Map from '../map';
import * as Tile from '../tile';

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
            requiredTileTags: 'FRONT_HOUSE',
        });

        Tile.install('SEAT', {
            name: 'a Seat',
            ch: 'h',
            fg: 'brown',
            tags: 'FRONT_HOUSE',
        });

        const map = Map.make(10, 10, 'FLOOR', 'WALL');
        const cell = map.cell(5, 5);
        expect(kind.avoidsCell(cell)).toBeTruthy();
        expect(kind.forbidsCell(cell)).toBeTruthy();

        map.setTile(5, 5, 'SEAT');
        expect(kind.avoidsCell(cell)).toBeFalsy();
        expect(kind.forbidsCell(cell)).toBeFalsy();
    });
});
