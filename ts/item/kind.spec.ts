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
        interface MyKindMakeOptions extends Item.MakeOptions {
            weight: number;
        }

        class MyItemKind extends Item.ItemKind {
            constructor(config: Item.KindOptions) {
                super(config);
            }

            init(item: Item.Item, config?: Partial<MyKindMakeOptions>) {
                super.init(item, config);
                if (config && config.weight) {
                    // @ts-ignore
                    item.weight = config.weight;
                }
            }
        }

        const kind = Item.install(
            'MY_ITEM',
            new MyItemKind({ name: 'MyItem' })
        );
        expect(kind).toBeInstanceOf(MyItemKind);

        const item = Item.make('MY_ITEM', { weight: 4 });
        expect(item.kind).toBe(kind);
        // @ts-ignore
        expect(item.weight).toEqual(4);
    });
});
