import * as GWU from 'gw-utils';
import * as Entity from '.';

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
});
