import * as Item from '.';

describe('ItemKind', () => {
    test('install - key', () => {
        const kind = Item.install('KEY', {
            tags: 'KEY',
            name: 'a key',
            description: 'a key that looks like it will open a door',
            flavor: 'a door key',
            ch: '~',
            fg: 'gold',
        });

        const key = Item.make('KEY');

        expect(key.getName()).toEqual('a key');
        expect(key.getFlavor()).toEqual('a door key');
        expect(key.getDescription()).toEqual(
            'a key that looks like it will open a door'
        );
        expect(key.getVerb('drop')).toEqual('drop');
        expect(key.sprite.toString()).toEqual('{ ch: ~, fg: gold }');
        expect(key.hasTag('KEY')).toBeTruthy();

        const random = Item.randomKind('KEY, !HEAVY');
        expect(random).toBe(kind);

        expect(Item.randomKind('FLAG')).toBeNull();
    });
});
