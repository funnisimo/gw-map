import 'jest-extended';
import '../../test/matchers';

import * as GWU from 'gw-utils';

import * as Map from './index';
import * as Actor from '../actor';
import * as Item from '../item';
import * as Flags from '../flags';
// import * as Tile from '../tile';

describe('Map Memory', () => {
    test('basic modifications', async () => {
        const mixer = GWU.sprite.makeMixer();

        // Default, visible + revealed
        const map = new Map.Map(20, 20);
        map.fill('FLOOR', 'WALL');
        expect(map.hasTile(5, 5, 'FLOOR')).toBeTruthy();
        expect(map.fov.isAnyKindOfVisible(5, 5)).toBeTruthy();
        expect(map.fov.isRevealed(5, 5)).toBeTruthy();

        const cell = map.cell(5, 5);
        const memory = map.memory(5, 5);
        expect(map.knowledge(5, 5)).toBe(cell);

        // constructor...
        expect(cell.needsRedraw).toBeTruthy();
        expect(cell.hasCellFlag(Flags.Cell.STABLE_MEMORY)).toBeFalsy();
        expect(cell.hasCellFlag(Flags.Cell.STABLE_SNAPSHOT)).toBeFalsy();

        cell.needsRedraw = false;

        ///////////////////////////////////////////
        // storeMemory (no snapshot)
        GWU.rng.cosmetic.seed(12345);
        map.storeMemory(5, 5);
        expect(cell.needsRedraw).toBeFalsy(); // no change
        expect(cell.hasCellFlag(Flags.Cell.STABLE_MEMORY)).toBeTruthy(); // now stable
        expect(cell.hasCellFlag(Flags.Cell.STABLE_SNAPSHOT)).toBeTruthy(); // TAKES SNAPSHOT ANYWAY!!!!

        GWU.rng.cosmetic.seed(12345);
        map.getAppearanceAt(5, 5, mixer);
        expect(mixer).toEqual(memory.snapshot); // works b/c light is [100,100,100]

        ///////////////////////////////////////////
        // getAppearanceAt
        cell.clearCellFlag(Flags.Cell.STABLE_SNAPSHOT);
        expect(cell.needsRedraw).toBeFalsy(); // no change
        memory.snapshot.blackOut(); // clear

        GWU.rng.cosmetic.seed(12345);
        map.getAppearanceAt(5, 5, mixer);
        expect(mixer).toEqual(memory.snapshot); // works b/c light is [100,100,100]
        expect(cell.hasCellFlag(Flags.Cell.STABLE_SNAPSHOT)).toBeTruthy(); // Updated

        ///////////////////////////////////////////
        // VISIBLE
        expect(map.fov.isAnyKindOfVisible(5, 5)).toBeTruthy();

        ///////////////////////////////////////////
        // setTile - visible
        cell.needsRedraw = false;
        cell.setCellFlag(Flags.Cell.STABLE_MEMORY | Flags.Cell.STABLE_SNAPSHOT);
        map.setTile(5, 5, 'DOOR');
        expect(cell.needsRedraw).toBeTruthy();
        expect(cell.hasCellFlag(Flags.Cell.STABLE_MEMORY)).toBeFalsy();
        expect(cell.hasCellFlag(Flags.Cell.STABLE_SNAPSHOT)).toBeFalsy();

        const actor = Actor.from({ ch: '@', fg: 'white', name: 'Actor' });
        expect(actor.lastSeen).toBeNull();

        ///////////////////////////////////////////
        // addActor - visible
        cell.needsRedraw = false;
        cell.setCellFlag(Flags.Cell.STABLE_MEMORY | Flags.Cell.STABLE_SNAPSHOT);
        expect(await map.addActor(5, 5, actor)).toBeTruthy();
        expect(cell.needsRedraw).toBeTruthy();
        expect(cell.hasCellFlag(Flags.Cell.STABLE_MEMORY)).toBeFalsy();
        expect(cell.hasCellFlag(Flags.Cell.STABLE_SNAPSHOT)).toBeFalsy();
        expect(map.actorAt(5, 5)).toBe(actor);
        expect(actor.lastSeen).toBeNull();

        ///////////////////////////////////////////
        // removeActor - visible
        cell.needsRedraw = false;
        cell.setCellFlag(Flags.Cell.STABLE_MEMORY | Flags.Cell.STABLE_SNAPSHOT);
        expect(await map.removeActor(actor)).toBeTruthy();
        expect(cell.needsRedraw).toBeTruthy();
        expect(cell.hasCellFlag(Flags.Cell.STABLE_MEMORY)).toBeFalsy();
        expect(cell.hasCellFlag(Flags.Cell.STABLE_SNAPSHOT)).toBeFalsy();
        expect(map.actorAt(5, 5)).toBeNull();
        expect(actor.lastSeen).toBeNull();

        ///////////////////////////////////////////
        // moveActor - into cell - visible
        expect(await map.addActor(6, 5, actor)).toBeTruthy();
        cell.needsRedraw = false;
        cell.setCellFlag(Flags.Cell.STABLE_MEMORY | Flags.Cell.STABLE_SNAPSHOT);
        expect(actor).toBeAtXY(6, 5);
        expect(map.actorAt(6, 5)).toBe(actor);
        expect(await map.moveActor(actor, GWU.xy.LEFT)).toBeTruthy();
        expect(cell.needsRedraw).toBeTruthy();
        expect(cell.hasCellFlag(Flags.Cell.STABLE_MEMORY)).toBeFalsy();
        expect(cell.hasCellFlag(Flags.Cell.STABLE_SNAPSHOT)).toBeFalsy();
        expect(actor.lastSeen).toBeNull();

        ///////////////////////////////////////////
        // moveActor - out of cell - visible
        cell.needsRedraw = false;
        cell.setCellFlag(Flags.Cell.STABLE_MEMORY | Flags.Cell.STABLE_SNAPSHOT);
        expect(await map.moveActor(actor, GWU.xy.RIGHT)).toBeTruthy();
        expect(cell.needsRedraw).toBeTruthy();
        expect(cell.hasCellFlag(Flags.Cell.STABLE_MEMORY)).toBeFalsy();
        expect(cell.hasCellFlag(Flags.Cell.STABLE_SNAPSHOT)).toBeFalsy();
        expect(actor.lastSeen).toBeNull();

        const item = Item.from({ ch: '!', fg: 'yellow', name: 'Item' });
        expect(item.lastSeen).toBeNull();

        ///////////////////////////////////////////
        // addItem - visible
        cell.needsRedraw = false;
        cell.setCellFlag(Flags.Cell.STABLE_MEMORY | Flags.Cell.STABLE_SNAPSHOT);
        expect(await map.addItem(5, 5, item)).toBeTruthy();
        expect(cell.needsRedraw).toBeTruthy();
        expect(cell.hasCellFlag(Flags.Cell.STABLE_MEMORY)).toBeFalsy();
        expect(cell.hasCellFlag(Flags.Cell.STABLE_SNAPSHOT)).toBeFalsy();
        expect(map.itemAt(5, 5)).toBe(item);
        expect(item.lastSeen).toBeNull();

        ///////////////////////////////////////////
        // removeItem - visible
        cell.needsRedraw = false;
        cell.setCellFlag(Flags.Cell.STABLE_MEMORY | Flags.Cell.STABLE_SNAPSHOT);
        expect(await map.removeItem(item)).toBeTruthy();
        expect(cell.needsRedraw).toBeTruthy();
        expect(cell.hasCellFlag(Flags.Cell.STABLE_MEMORY)).toBeFalsy();
        expect(cell.hasCellFlag(Flags.Cell.STABLE_SNAPSHOT)).toBeFalsy();
        expect(map.itemAt(5, 5)).toBeNull();
        expect(item.lastSeen).toBeNull();

        ///////////////////////////////////////////
        // moveItem - into cell - visible
        expect(await map.addItem(6, 5, item)).toBeTruthy();
        cell.needsRedraw = false;
        cell.setCellFlag(Flags.Cell.STABLE_MEMORY | Flags.Cell.STABLE_SNAPSHOT);
        expect(item).toBeAtXY(6, 5);
        expect(map.itemAt(6, 5)).toBe(item);
        expect(await map.moveItem(item, GWU.xy.LEFT)).toBeTruthy();
        expect(cell.needsRedraw).toBeTruthy();
        expect(cell.hasCellFlag(Flags.Cell.STABLE_MEMORY)).toBeFalsy();
        expect(cell.hasCellFlag(Flags.Cell.STABLE_SNAPSHOT)).toBeFalsy();
        expect(item.lastSeen).toBeNull();

        ///////////////////////////////////////////
        // moveItem - out of cell - visible
        cell.needsRedraw = false;
        cell.setCellFlag(Flags.Cell.STABLE_MEMORY | Flags.Cell.STABLE_SNAPSHOT);
        expect(await map.moveItem(item, GWU.xy.RIGHT)).toBeTruthy();
        expect(cell.needsRedraw).toBeTruthy();
        expect(cell.hasCellFlag(Flags.Cell.STABLE_MEMORY)).toBeFalsy();
        expect(cell.hasCellFlag(Flags.Cell.STABLE_SNAPSHOT)).toBeFalsy();
        expect(item.lastSeen).toBeNull();

        ///////////////////////////////////////////
        // NOT VISIBLE
        map.fov.hideCell(5, 5);
        expect(map.fov.isAnyKindOfVisible(5, 5)).toBeFalsy();

        ///////////////////////////////////////////
        // setTile - not visible
        cell.needsRedraw = false;
        cell.setCellFlag(Flags.Cell.STABLE_MEMORY | Flags.Cell.STABLE_SNAPSHOT);
        map.setTile(5, 5, 'DOOR_OPEN');
        expect(cell.needsRedraw).toBeTruthy();
        expect(cell.hasCellFlag(Flags.Cell.STABLE_MEMORY)).toBeTruthy();
        expect(cell.hasCellFlag(Flags.Cell.STABLE_SNAPSHOT)).toBeTruthy();

        ///////////////////////////////////////////
        // addActor - not visible
        cell.needsRedraw = false;
        cell.setCellFlag(Flags.Cell.STABLE_MEMORY | Flags.Cell.STABLE_SNAPSHOT);
        expect(await map.addActor(5, 5, actor)).toBeTruthy();
        expect(cell.needsRedraw).toBeTruthy();
        expect(cell.hasCellFlag(Flags.Cell.STABLE_MEMORY)).toBeTruthy();
        expect(cell.hasCellFlag(Flags.Cell.STABLE_SNAPSHOT)).toBeTruthy();
        expect(map.actorAt(5, 5)).toBe(actor);
        expect(actor.lastSeen).toBeNull(); // never seen anywhere

        ///////////////////////////////////////////
        // removeActor - not visible
        cell.needsRedraw = false;
        cell.setCellFlag(Flags.Cell.STABLE_MEMORY | Flags.Cell.STABLE_SNAPSHOT);
        expect(await map.removeActor(actor)).toBeTruthy();
        expect(cell.needsRedraw).toBeTruthy();
        expect(cell.hasCellFlag(Flags.Cell.STABLE_MEMORY)).toBeTruthy();
        expect(cell.hasCellFlag(Flags.Cell.STABLE_SNAPSHOT)).toBeTruthy();
        expect(map.actorAt(5, 5)).toBeNull();
        expect(actor.lastSeen).toBeNull(); // never seen anywhere

        ///////////////////////////////////////////
        // moveActor - into cell - not visible
        expect(await map.addActor(6, 5, actor)).toBeTruthy();
        cell.needsRedraw = false;
        cell.setCellFlag(Flags.Cell.STABLE_MEMORY | Flags.Cell.STABLE_SNAPSHOT);
        expect(actor).toBeAtXY(6, 5);
        expect(map.actorAt(6, 5)).toBe(actor);
        expect(await map.moveActor(actor, GWU.xy.LEFT)).toBeTruthy();
        expect(cell.needsRedraw).toBeTruthy();
        expect(cell.hasCellFlag(Flags.Cell.STABLE_MEMORY)).toBeTruthy();
        expect(cell.hasCellFlag(Flags.Cell.STABLE_SNAPSHOT)).toBeFalsy(); // vis -> !vis
        expect(actor.lastSeen).toMatchObject({ x: 5, y: 5 }); // last seen in !vis location (dist < 2)

        cell.setCellFlag(Flags.Cell.STABLE_SNAPSHOT);

        ///////////////////////////////////////////
        // moveActor - out of cell - not visible
        cell.needsRedraw = false;
        cell.setCellFlag(Flags.Cell.STABLE_MEMORY | Flags.Cell.STABLE_SNAPSHOT);
        expect(await map.moveActor(actor, GWU.xy.RIGHT)).toBeTruthy();
        expect(cell.needsRedraw).toBeTruthy();
        expect(cell.hasCellFlag(Flags.Cell.STABLE_MEMORY)).toBeTruthy();
        expect(cell.hasCellFlag(Flags.Cell.STABLE_SNAPSHOT)).toBeFalsy(); // !vis -> vis
        expect(actor.lastSeen).toBeNull(); // vis

        cell.setCellFlag(Flags.Cell.STABLE_SNAPSHOT);

        ///////////////////////////////////////////
        // addItem - not visible
        cell.needsRedraw = false;
        cell.setCellFlag(Flags.Cell.STABLE_MEMORY | Flags.Cell.STABLE_SNAPSHOT);
        expect(await map.addItem(5, 5, item)).toBeTruthy();
        expect(cell.needsRedraw).toBeTruthy();
        expect(cell.hasCellFlag(Flags.Cell.STABLE_MEMORY)).toBeTruthy();
        expect(cell.hasCellFlag(Flags.Cell.STABLE_SNAPSHOT)).toBeTruthy();
        expect(map.itemAt(5, 5)).toBe(item);
        expect(item.lastSeen).toBeNull(); // never seen before

        ///////////////////////////////////////////
        // removeItem - not  visible
        cell.needsRedraw = false;
        cell.setCellFlag(Flags.Cell.STABLE_MEMORY | Flags.Cell.STABLE_SNAPSHOT);
        expect(await map.removeItem(item)).toBeTruthy();
        expect(cell.needsRedraw).toBeTruthy();
        expect(cell.hasCellFlag(Flags.Cell.STABLE_MEMORY)).toBeTruthy();
        expect(cell.hasCellFlag(Flags.Cell.STABLE_SNAPSHOT)).toBeTruthy();
        expect(map.itemAt(5, 5)).toBeNull();
        expect(item.lastSeen).toBeNull(); // never seen before

        ///////////////////////////////////////////
        // moveItem - into cell - not visible
        expect(await map.addItem(6, 5, item)).toBeTruthy();
        cell.needsRedraw = false;
        cell.setCellFlag(Flags.Cell.STABLE_MEMORY | Flags.Cell.STABLE_SNAPSHOT);
        expect(item).toBeAtXY(6, 5);
        expect(map.itemAt(6, 5)).toBe(item);
        expect(await map.moveItem(item, GWU.xy.LEFT)).toBeTruthy();
        expect(cell.needsRedraw).toBeTruthy();
        expect(cell.hasCellFlag(Flags.Cell.STABLE_MEMORY)).toBeTruthy();
        expect(cell.hasCellFlag(Flags.Cell.STABLE_SNAPSHOT)).toBeFalsy(); // vis -> !vis
        expect(item.lastSeen).toMatchObject({ x: 5, y: 5 }); // remembered at !vis

        cell.setCellFlag(Flags.Cell.STABLE_SNAPSHOT);

        ///////////////////////////////////////////
        // moveItem - out of cell - not visible
        cell.needsRedraw = false;
        cell.setCellFlag(Flags.Cell.STABLE_MEMORY | Flags.Cell.STABLE_SNAPSHOT);
        expect(await map.moveItem(item, GWU.xy.RIGHT)).toBeTruthy();
        expect(cell.needsRedraw).toBeTruthy();
        expect(cell.hasCellFlag(Flags.Cell.STABLE_MEMORY)).toBeTruthy();
        expect(cell.hasCellFlag(Flags.Cell.STABLE_SNAPSHOT)).toBeFalsy(); // !vis -> vis
        expect(item.lastSeen).toBeNull(); // vis

        cell.setCellFlag(Flags.Cell.STABLE_SNAPSHOT);
    });

    test('actor in/out of vision', async () => {
        const map = Map.make(50, 50, {
            tile: 'FLOOR',
            boundary: 'WALL',
            fov: true,
            visible: true,
        });
        const buffer = GWU.canvas.makeDataBuffer(map.width, map.height);

        // Now update the fov
        map.fov.update(10, 10, 10);
        map.drawInto(buffer);

        expect(map.fov.isAnyKindOfVisible(20, 10)).toBeTruthy();
        expect(map.fov.isAnyKindOfVisible(21, 10)).toBeFalsy();

        const twenty = map.cell(20, 10);
        const memTwenty = map.memory(20, 10);
        const twentyOne = map.cell(21, 10);
        const memTwentyOne = map.memory(21, 10);

        expect(twenty.hasCellFlag(Flags.Cell.STABLE_MEMORY)).toBeFalsy();
        expect(twenty.hasCellFlag(Flags.Cell.STABLE_SNAPSHOT)).toBeTruthy(); // drawn
        expect(twentyOne.hasCellFlag(Flags.Cell.STABLE_MEMORY)).toBeTruthy(); // vis -> !vis
        expect(twentyOne.hasCellFlag(Flags.Cell.STABLE_SNAPSHOT)).toBeTruthy(); // drawn

        const actor = Actor.from({ ch: '@', fg: 'white', name: 'Actor' });

        expect(await map.addActor(21, 10, actor)).toBeTruthy();
        expect(twentyOne.actor).toBe(actor);
        expect(memTwentyOne.actor).toBeNull();
        expect(twentyOne.needsRedraw).toBeTruthy();
        expect(twentyOne.hasCellFlag(Flags.Cell.STABLE_MEMORY)).toBeTruthy(); // !vis so does not mark
        expect(twentyOne.hasCellFlag(Flags.Cell.STABLE_SNAPSHOT)).toBeTruthy();

        /////////////////////////////////////////////
        // Move player toward actor (make visible)
        map.fov.update(11, 10, 10);
        map.drawInto(buffer);

        expect(map.fov.isAnyKindOfVisible(20, 10)).toBeTruthy();
        expect(map.fov.isAnyKindOfVisible(21, 10)).toBeTruthy();

        expect(twentyOne.actor).toBe(actor);
        expect(memTwentyOne.actor).toBeNull(); // Did not update yet...
        expect(twentyOne.needsRedraw).toBeFalsy();
        expect(twentyOne.hasCellFlag(Flags.Cell.STABLE_MEMORY)).toBeTruthy();
        expect(twentyOne.hasCellFlag(Flags.Cell.STABLE_SNAPSHOT)).toBeTruthy();

        /////////////////////////////////////////////
        // Move player away (make not visible)
        map.fov.update(10, 10, 10);
        map.drawInto(buffer);

        expect(map.fov.isAnyKindOfVisible(20, 10)).toBeTruthy();
        expect(map.fov.isAnyKindOfVisible(21, 10)).toBeFalsy();

        expect(twentyOne.actor).toBe(actor);
        expect(memTwentyOne.actor).toBe(actor); // saved memory
        expect(twentyOne.needsRedraw).toBeFalsy();
        expect(twentyOne.hasCellFlag(Flags.Cell.STABLE_MEMORY)).toBeTruthy();
        expect(twentyOne.hasCellFlag(Flags.Cell.STABLE_SNAPSHOT)).toBeTruthy();
        expect(actor.lastSeen).not.toBeNull(); // saved loc

        /////////////////////////////////////////////
        // Now move the actor back into the FOV...
        expect(await map.moveActor(actor, GWU.xy.LEFT)).toBeTruthy();
        expect(twenty.actor).toBe(actor);
        expect(memTwenty.actor).toBeNull(); // not updated yet (visible)
        expect(twentyOne.actor).toBeNull(); // but... we did change this
        expect(memTwentyOne.actor).toBeNull(); // and this!! - b/c actor became visible

        expect(twentyOne.needsRedraw).toBeTruthy();
        expect(twentyOne.hasCellFlag(Flags.Cell.STABLE_MEMORY)).toBeTruthy(); // we updated the memory ourselves
        expect(twentyOne.hasCellFlag(Flags.Cell.STABLE_SNAPSHOT)).toBeFalsy(); // but need to draw again...

        map.drawInto(buffer);
        expect(twentyOne.needsRedraw).toBeFalsy();
        expect(twentyOne.hasCellFlag(Flags.Cell.STABLE_MEMORY)).toBeTruthy();
        expect(twentyOne.hasCellFlag(Flags.Cell.STABLE_SNAPSHOT)).toBeTruthy();

        /////////////////////////////////////////////
        // Now move the actor back out of view...
        expect(await map.moveActor(actor, GWU.xy.RIGHT)).toBeTruthy();
        expect(twenty.actor).toBeNull();
        expect(memTwenty.actor).toBeNull();
        expect(twentyOne.actor).toBe(actor); // but... we did change this
        expect(memTwentyOne.actor).toBe(actor); // And this!!!! b/c we did vis->!vis

        expect(twentyOne.needsRedraw).toBeTruthy();
        expect(twentyOne.hasCellFlag(Flags.Cell.STABLE_MEMORY)).toBeTruthy(); // we updated the memory ourselves
        expect(twentyOne.hasCellFlag(Flags.Cell.STABLE_SNAPSHOT)).toBeFalsy(); // but need to draw again with actor we know moved off

        map.drawInto(buffer);
        expect(twentyOne.needsRedraw).toBeFalsy();
        expect(twentyOne.hasCellFlag(Flags.Cell.STABLE_MEMORY)).toBeTruthy();
        expect(twentyOne.hasCellFlag(Flags.Cell.STABLE_SNAPSHOT)).toBeTruthy();
    });

    test('item in/out of vision', async () => {
        const map = Map.make(50, 50, {
            tile: 'FLOOR',
            boundary: 'WALL',
            fov: true,
            visible: true,
        });
        const buffer = GWU.canvas.makeDataBuffer(map.width, map.height);

        // Now update the fov
        map.fov.update(10, 10, 10);
        map.drawInto(buffer);

        expect(map.fov.isAnyKindOfVisible(20, 10)).toBeTruthy();
        expect(map.fov.isAnyKindOfVisible(21, 10)).toBeFalsy();

        const twenty = map.cell(20, 10);
        const memTwenty = map.memory(20, 10);
        const twentyOne = map.cell(21, 10);
        const memTwentyOne = map.memory(21, 10);

        expect(twenty.hasCellFlag(Flags.Cell.STABLE_MEMORY)).toBeFalsy();
        expect(twenty.hasCellFlag(Flags.Cell.STABLE_SNAPSHOT)).toBeTruthy(); // drawn
        expect(twentyOne.hasCellFlag(Flags.Cell.STABLE_MEMORY)).toBeTruthy(); // vis -> !vis
        expect(twentyOne.hasCellFlag(Flags.Cell.STABLE_SNAPSHOT)).toBeTruthy(); // drawn

        const item = Item.from({ ch: '@', fg: 'white', name: 'Item' });

        expect(await map.addItem(21, 10, item)).toBeTruthy();
        expect(twentyOne.item).toBe(item);
        expect(memTwentyOne.item).toBeNull();
        expect(twentyOne.needsRedraw).toBeTruthy();
        expect(twentyOne.hasCellFlag(Flags.Cell.STABLE_MEMORY)).toBeTruthy(); // !vis so does not mark
        expect(twentyOne.hasCellFlag(Flags.Cell.STABLE_SNAPSHOT)).toBeTruthy();

        /////////////////////////////////////////////
        // Move player toward item (make visible)
        map.fov.update(11, 10, 10);
        map.drawInto(buffer);

        expect(map.fov.isAnyKindOfVisible(20, 10)).toBeTruthy();
        expect(map.fov.isAnyKindOfVisible(21, 10)).toBeTruthy();

        expect(twentyOne.item).toBe(item);
        expect(memTwentyOne.item).toBeNull(); // Did not update yet...
        expect(twentyOne.needsRedraw).toBeFalsy();
        expect(twentyOne.hasCellFlag(Flags.Cell.STABLE_MEMORY)).toBeTruthy();
        expect(twentyOne.hasCellFlag(Flags.Cell.STABLE_SNAPSHOT)).toBeTruthy();

        /////////////////////////////////////////////
        // Move player away (make not visible)
        map.fov.update(10, 10, 10);
        map.drawInto(buffer);

        expect(map.fov.isAnyKindOfVisible(20, 10)).toBeTruthy();
        expect(map.fov.isAnyKindOfVisible(21, 10)).toBeFalsy();

        expect(twentyOne.item).toBe(item);
        expect(memTwentyOne.item).toBe(item); // saved memory
        expect(twentyOne.needsRedraw).toBeFalsy();
        expect(twentyOne.hasCellFlag(Flags.Cell.STABLE_MEMORY)).toBeTruthy();
        expect(twentyOne.hasCellFlag(Flags.Cell.STABLE_SNAPSHOT)).toBeTruthy();

        /////////////////////////////////////////////
        // Now move the item back into the FOV...
        expect(await map.moveItem(item, GWU.xy.LEFT)).toBeTruthy();
        expect(twenty.item).toBe(item);
        expect(memTwenty.item).toBeNull(); // not updated yet (visible)
        expect(twentyOne.item).toBeNull(); // but... we did change this
        expect(memTwentyOne.item).toBeNull(); // and this!! - b/c item became visible

        expect(twentyOne.needsRedraw).toBeTruthy();
        expect(twentyOne.hasCellFlag(Flags.Cell.STABLE_MEMORY)).toBeTruthy(); // we updated the memory ourselves
        expect(twentyOne.hasCellFlag(Flags.Cell.STABLE_SNAPSHOT)).toBeFalsy(); // but need to draw again...

        map.drawInto(buffer);
        expect(twentyOne.needsRedraw).toBeFalsy();
        expect(twentyOne.hasCellFlag(Flags.Cell.STABLE_MEMORY)).toBeTruthy();
        expect(twentyOne.hasCellFlag(Flags.Cell.STABLE_SNAPSHOT)).toBeTruthy();

        /////////////////////////////////////////////
        // Now move the item back out of view...
        expect(await map.moveItem(item, GWU.xy.RIGHT)).toBeTruthy();
        expect(twenty.item).toBeNull();
        expect(memTwenty.item).toBeNull();
        expect(twentyOne.item).toBe(item); // but... we did change this
        expect(memTwentyOne.item).toBe(item); // And this!!!! b/c we did vis->!vis

        expect(twentyOne.needsRedraw).toBeTruthy();
        expect(twentyOne.hasCellFlag(Flags.Cell.STABLE_MEMORY)).toBeTruthy(); // we updated the memory ourselves
        expect(twentyOne.hasCellFlag(Flags.Cell.STABLE_SNAPSHOT)).toBeFalsy(); // but need to draw again with item we know moved off

        map.drawInto(buffer);
        expect(twentyOne.needsRedraw).toBeFalsy();
        expect(twentyOne.hasCellFlag(Flags.Cell.STABLE_MEMORY)).toBeTruthy();
        expect(twentyOne.hasCellFlag(Flags.Cell.STABLE_SNAPSHOT)).toBeTruthy();
    });
});
