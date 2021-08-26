import * as Item from '.';
import * as Map from '../map';

describe('Item', () => {
    test('create and place', async () => {
        Item.install('ITEM', {
            name: 'an item',
            ch: '~',
            fg: 'gold',
        });

        const item = Item.make('ITEM');

        const map = Map.make(20, 20, 'FLOOR', 'WALL');

        expect(await map.addItem(5, 5, item)).toBeTruthy();
        expect(map.itemAt(5, 5)).toBe(item);

        expect(await map.moveItem(7, 8, item)).toBeTruthy();
        expect(map.itemAt(5, 5)).toBe(null);
        expect(map.itemAt(7, 8)).toBe(item);

        expect(await map.removeItem(item)).toBeTruthy();
        expect(map.itemAt(7, 8)).toBe(null);

        expect(await map.removeItem(item)).toBeFalsy();
        expect(await map.moveItem(5, 6, item)).toBeFalsy();
    });
});
