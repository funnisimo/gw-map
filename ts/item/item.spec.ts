// import * as GWU from 'gw-utils';
import * as Item from '.';
import * as Map from '../map';

describe('Item', () => {
    test('create and place', () => {
        Item.install('ITEM', {
            name: 'an item',
            ch: '~',
            fg: 'gold',
        });

        const item = Item.make('ITEM');

        const map = Map.make(20, 20, 'FLOOR', 'WALL');

        expect(map.addItem(5, 5, item)).toBeTruthy();
        expect(map.itemAt(5, 5)).toBe(item);

        // expect( map.moveItem(item, GWU.xy.RIGHT)).toBeTruthy();
        // expect(map.itemAt(5, 5)).toBe(null);
        // expect(map.itemAt(6, 5)).toBe(item);

        expect(map.removeItem(item)).toBeTruthy();
        expect(map.itemAt(5, 5)).toBe(null);

        expect(map.removeItem(item)).toBeFalsy();
        // expect( map.moveItem(item, GWU.xy.UP)).toBeFalsy();
    });

    test('clone', () => {
        const item = Item.make({ ch: '!', name: 'An Item' }, { quantity: 2 });
        expect(item.quantity).toEqual(2);

        const clone = item.clone();
        expect(clone).toBeInstanceOf(Item.Item);
        expect(clone.kind).toBe(item.kind);
        expect(clone.quantity).toEqual(item.quantity);
    });
});
