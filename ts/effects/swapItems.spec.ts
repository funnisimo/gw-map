import '../../test/matchers';

// import * as GWU from 'gw-utils';
import * as Action from '../action';
import * as Effect from '../effect';
import * as Item from '../item';
import * as Map from '../map';
import * as Tile from '../tile';

import './index';
import '../tile/tiles';

import { spread, tile } from './index';

describe('Special Effects', () => {
    let setup: Action.ActionFn;

    function swapItems(action: Action.Action): void {
        const map = action.map;
        const x = action.x;
        const y = action.y;

        const cell = map.cell(x, y);
        if (!cell.hasItem()) return action.didNothing();
        const myMachine = cell.machineId;
        if (!myMachine) return action.didNothing();

        const item = (action.item = action.item || map.itemAt(x, y));
        if (!item)
            throw new Error(
                'Cell is marked as having item, but no item found @ ' +
                    x +
                    ',' +
                    y
            );

        let items: Item.Item[] = [item];
        map.eachItem((i) => {
            if (i === item) return; // do not use same item again
            const itemCell = map.cell(i.x, i.y);
            if (itemCell.machineId !== myMachine) return;
            items.push(i);
        });

        if (items.length < 2) return action.didNothing();

        // console.log('SWAP ITEMS - ', items.map((i) => i.getName()).join(', '));

        const firstItem = items[0]!;
        let lastLoc = [firstItem.x, firstItem.y];
        for (let i = 1; i < items.length; ++i) {
            const item = items[i]!;
            const prevItem = items[i - 1]!;
            map.removeItem(prevItem);
            map.addItem(item.x, item.y, prevItem, false);
        }
        const lastItem = items[items.length - 1]!;
        map.removeItem(lastItem);
        map.addItem(lastLoc[0], lastLoc[1], lastItem, false);

        return action.didSomething();
    }

    beforeAll(() => {
        // TILES
        // EFFECTS

        Effect.install(
            'DF_ALTAR_INERT',
            tile('SWAP_ALTAR_INERT')
            // msg: 'the items on the altars flash with a brilliant light!',
            // flash: 'ENCHANTMENT_LIGHT',
        );
        // Effect.install('DF_MAGIC_PIPING', { spawn: 'PIPE_GLOWING:90:60' });
        Effect.install(
            'DF_INERT_PIPE',
            tile('PIPE_INERT')
            // flash: 'ENCHANTMENT_LIGHT',
        );
        setup = Effect.install('DF_SWAP_ALTAR_SETUP', [
            spread(90, 60, tile('PIPE_GLOWING')),
            tile('SWAP_ALTAR'),
        ]);

        Tile.install('SWAP_ALTAR', {
            ch: 'T',
            fg: 'gold',
            bg: 'green',
            priority: 100 - 17,
            flags: 'L_BLOCKS_SURFACE, L_LIST_IN_SIDEBAR, L_VISUALLY_DISTINCT',
            actions: {
                place: [swapItems, 'EFFECT:DF_ALTAR_INERT'],
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
            actions: {
                machine: 'EFFECT:DF_INERT_PIPE',
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

    test('swap items', () => {
        const action = new Action.Action({
            map,
            x: 5,
            y: 5,
            machine: 3,
        });
        setup(action);
        action.x = 15;
        action.y = 15;
        setup(action);

        expect(map.cell(5, 5).machineId).toEqual(3);
        expect(map.cell(15, 15).machineId).toEqual(3);
        expect(map.hasTile(5, 5, 'SWAP_ALTAR')).toBeTruthy();
        expect(map.hasTile(15, 15, 'SWAP_ALTAR')).toBeTruthy();

        // map.dump();

        const hat = Item.make('HAT');
        expect(map.addItem(5, 5, hat, true)).toBeTruthy();
        // map.fireQueuedEvents();
        expect(hat).toBeAtXY(5, 5);
        expect(map.itemAt(5, 5)).toBe(hat);

        const coat = Item.make('COAT');
        expect(map.addItem(15, 15, coat, true)).toBeTruthy(); // causes position swap!
        // map.fireQueuedEvents();

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
