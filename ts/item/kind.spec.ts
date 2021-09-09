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

    test('subclass', () => {
        interface MyKindMakeOptions {
            quantity?: number;
        }

        class MyItem extends Item.ItemKind {
            constructor(config: Item.KindOptions) {
                super(config);
            }

            make(item: Item.Item, config?: Partial<MyKindMakeOptions>) {
                super.make(item, config);
                if (config && config.quantity) {
                    item.quantity = config.quantity;
                }
            }
        }

        const kind = Item.install('MY_ITEM', new MyItem({ name: 'MyItem' }));
        expect(kind).toBeInstanceOf(MyItem);

        const item = Item.make('MY_ITEM', { quantity: 4 });
        expect(item.kind).toBe(kind);
        expect(item.quantity).toEqual(4);
    });
});
