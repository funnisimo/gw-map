import '../../../test/matchers';

// import * as GWU from 'gw-utils';
import * as Effect from '..';
import * as Item from '../../item';
import * as Map from '../../map';
import * as Tile from '../../tile';

describe('Special Effects', () => {
    async function swapItems(
        _config: Effect.EffectInfo,
        map: Map.Map,
        x: number,
        y: number,
        ctx: Effect.EffectCtx
    ) {
        const cell = map.cell(x, y);
        if (!cell.hasItem()) return false;
        const myMachine = cell.machineId;
        if (!myMachine) return false;

        const item = ctx.item as Item.Item;
        if (!item)
            throw new Error(
                'Cell is marked as having item, but no item found @ ' +
                    x +
                    ',' +
                    y
            );

        const tile = ctx.tile;

        let items: Item.Item[] = [item];
        map.eachItem((i) => {
            if (i === item) return; // do not use same item again
            const itemCell = map.cell(i.x, i.y);
            if (itemCell.machineId !== myMachine) return;
            if (!itemCell.hasTile(tile)) return;
            items.push(i);
        });

        if (items.length < 2) return false;

        // console.log('SWAP ITEMS - ', items.map((i) => i.getName()).join(', '));

        const firstItem = items[0]!;
        let lastLoc = [firstItem.x, firstItem.y];
        for (let i = 1; i < items.length; ++i) {
            const item = items[i]!;
            const prevItem = items[i - 1]!;
            map.removeItem(prevItem);
            map.addItem(item.x, item.y, prevItem);
        }
        const lastItem = items[items.length - 1]!;
        map.removeItem(lastItem);
        map.addItem(lastLoc[0], lastLoc[1], lastItem);
        return true;
    }

    beforeAll(() => {
        // TILES

        Tile.install('SWAP_ALTAR', {
            ch: 'T',
            fg: 'gold',
            bg: 'green',
            priority: 100 - 17,
            flags: 'L_BLOCKS_SURFACE, L_LIST_IN_SIDEBAR, L_VISUALLY_DISTINCT',
            effects: {
                add_item: {
                    fn: swapItems,
                    next: { effect: 'DF_ALTAR_SWAP' },
                },
            },
            name: 'a commutation altar',
            description:
                'crude diagrams on this altar and its twin invite you to place items upon them.',
        });

        Tile.install('SWAP_ALTAR_INERT', {
            ch: 'T',
            fg: 'black',
            bg: 'green',
            priority: 100 - 17,
            flags: 'L_BLOCKS_SURFACE, L_LIST_IN_SIDEBAR , L_VISUALLY_DISTINCT',
            name: 'a scorched altar',
            description:
                'scorch marks cover the surface of the altar, but it is cold to the touch.',
        });

        Tile.install('PIPE_GLOWING', {
            ch: '+',
            fg: 'darkest_gray',
            depth: 'SURFACE',
            priority: 100 - 45,
            effects: {
                machine: 'DF_INERT_PIPE',
            },
            name: 'glowing glass pipes',
            description:
                'glass pipes are set into the floor and emit a soft glow of shifting color.',
        });

        Tile.install('PIPE_INERT', {
            ch: '+',
            fg: 'black',
            depth: 'SURFACE',
            priority: 100 - 45,
            name: 'charred glass pipes',
            description: 'the inside of the glass pipes are charred.',
        });

        // EFFECTS

        Effect.install('DF_ALTAR_SWAP', {
            tile: 'SWAP_ALTAR_INERT',
            message: 'the items on the altars flash with a brilliant light!',
            flash: 'ENCHANTMENT_LIGHT',
        });
        Effect.install('DF_MAGIC_PIPING', { tile: 'PIPE_GLOWING,90,60' });
        Effect.install('DF_INERT_PIPE', {
            tile: 'PIPE_INERT',
            flash: 'ENCHANTMENT_LIGHT',
        });
        Effect.install('DF_SWAP_ALTAR_SETUP', {
            effect: 'DF_MAGIC_PIPING',
            tile: 'SWAP_ALTAR',
        });

        // Items

        Item.install('HAT', {
            tags: 'HEAD',
            ch: 'H',
            fg: 'yellow',
            name: 'Hat',
        });

        Item.install('COAT', {
            tags: 'BODY',
            ch: 'C',
            fg: 'yellow',
            name: 'Coat',
        });
    });

    let map: Map.Map;

    beforeEach(() => {
        map = Map.make(20, 20, 'FLOOR', 'WALL');
    });

    test('swap items', async () => {
        await Effect.fire('DF_SWAP_ALTAR_SETUP', map, 5, 5, { machine: 3 });
        await Effect.fire('DF_SWAP_ALTAR_SETUP', map, 15, 15, { machine: 3 });

        expect(map.cell(5, 5).machineId).toEqual(3);
        expect(map.cell(15, 15).machineId).toEqual(3);

        const hat = Item.make('HAT');
        expect(await map.addItem(5, 5, hat, true)).toBeTruthy();
        expect(hat).toBeAtXY(5, 5);
        expect(map.itemAt(5, 5)).toBe(hat);

        const coat = Item.make('COAT');
        expect(await map.addItem(15, 15, coat, true)).toBeTruthy(); // causes position swap!
        expect(map.itemAt(5, 5)).not.toBeNull();
        expect(map.itemAt(15, 15)).not.toBeNull();

        // map.dump();

        expect(coat).toBeAtXY(5, 5);
        expect(hat).toBeAtXY(15, 15);

        expect(map.hasItem(5, 5)).toBeTruthy();
        expect(map.hasItem(15, 15)).toBeTruthy();

        expect(map.itemAt(5, 5)).toBe(coat);
        expect(map.itemAt(15, 15)).toBe(hat);

        const cell5 = map.cell(5, 5);
        expect(map.itemAt(5, 5)).toBe(coat);
        expect(cell5.hasItem()).toBeTruthy();

        const cell15 = map.cell(15, 15);
        expect(map.itemAt(15, 15)).toBe(hat);
        expect(cell15.hasItem()).toBeTruthy();
    });
});
