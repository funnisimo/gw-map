import * as GWU from 'gw-utils';
import * as Map from '../map';
import * as Actor from '../actor';
import { Memory } from './memory';

describe('memory', () => {
    test('basic', () => {
        const map = Map.make(20, 20, 'FLOOR', 'WALL');
        expect(map.cell(5, 5).hasStableSnapshot).toBeFalsy();

        const memory = new Memory(map);
        const cellMem = memory.cell(5, 5);
        expect(cellMem.isNull()).toBeTruthy();
        expect(cellMem.hasStableSnapshot).toBeFalsy(); // snapshots are not stable by default
        expect(cellMem.hasStableMemory).toBeTruthy(); // memory is stable by default

        // becomes visible
        memory.onFovChange(5, 5, true);
        expect(cellMem.isNull()).toBeTruthy();
        expect(cellMem.hasStableSnapshot).toBeFalsy();
        expect(cellMem.hasStableMemory).toBeFalsy(); // memory is not stable

        // store when !vis
        memory.onFovChange(5, 5, false);
        expect(cellMem.isNull()).toBeFalsy();
        expect(cellMem.hasStableSnapshot).toBeFalsy();
        expect(cellMem.hasStableMemory).toBeTruthy(); // memory is stable
    });

    test('fov moves around', () => {
        const map = Map.make(20, 20, 'FLOOR', 'WALL');
        const buffer = GWU.canvas.makeDataBuffer(map.width, map.height);
        const memory = new Memory(map);
        const fov = new GWU.fov.FovSystem(map, { onFovChange: memory });
        expect(fov.isAnyKindOfVisible(5, 5)).toBeFalsy();
        map.drawInto(buffer); // sets STABLE_SNAPSHOT

        const onFovChange = jest.spyOn(memory, 'onFovChange');

        const cellMem = memory.cell(5, 5);
        expect(cellMem.hasStableMemory).toBeTruthy(); // not visible

        fov.update(5, 5, 5);
        expect(memory.onFovChange).toHaveBeenCalledWith(5, 5, true);
        expect(cellMem.hasStableMemory).toBeFalsy(); // visible

        onFovChange.mockClear();
        fov.update(15, 15, 5);
        expect(memory.onFovChange).toHaveBeenCalledWith(5, 5, false);
        expect(cellMem.hasStableMemory).toBeTruthy(); // not visible
    });

    test('actor moves around', async () => {
        const map = Map.make(20, 20, 'FLOOR', 'WALL');
        const buffer = GWU.canvas.makeDataBuffer(map.width, map.height);
        const memory = new Memory(map);
        const fov = new GWU.fov.FovSystem(map, { onFovChange: memory });
        expect(fov.isAnyKindOfVisible(5, 5)).toBeFalsy();
        const actor = Actor.from({ ch: '@', fg: 'white', name: 'Actor' });
        await map.addActor(11, 5, actor);
        expect(fov.isAnyKindOfVisible(11, 5)).toBeFalsy();
        map.drawInto(buffer); // sets STABLE_SNAPSHOT for whole map
        memory.drawInto(buffer); // sets STABLE_SNAPSHOT for whole memory

        jest.spyOn(memory, 'onFovChange');

        const cellMem = memory.cell(10, 5);
        expect(cellMem.hasStableMemory).toBeTruthy(); // not visible

        fov.update(5, 5, 5);
        expect(memory.onFovChange).toHaveBeenCalledWith(10, 5, true);
        expect(memory.onFovChange).not.toHaveBeenCalledWith(11, 5, true);
        expect(fov.isAnyKindOfVisible(11, 5)).toBeFalsy();
        expect(cellMem.hasStableMemory).toBeFalsy(); // visible

        // actor walks into FOV
        // await map.moveActor(actor, GWU.xy.LEFT);
        map.removeActor(actor);
        map.addActor(actor.x - 1, actor.y, actor);
        fov.update(5, 5, 5); // no fov change - player stood still
        expect(map.actorAt(10, 5)).toBe(actor);
        expect(memory.cell(10, 5).hasStableMemory).toBeFalsy();
        expect(memory.cell(11, 5).hasStableMemory).toBeTruthy();
        expect(memory.actorAt(11, 5)).toBeNull(); // never seen!

        // actor walks off
        map.removeActor(actor);
        map.addActor(actor.x + 1, actor.y, actor);
        fov.update(5, 5, 5); // no fov change - player stood still

        // nothing changes - no fov change
        expect(map.actorAt(10, 5)).toBeNull();
        expect(map.actorAt(11, 5)).toBe(actor);
        expect(memory.cell(10, 5).hasStableMemory).toBeFalsy();
        expect(memory.cell(11, 5).hasStableMemory).toBeTruthy();
        expect(memory.actorAt(11, 5)).toBeNull(); // not seen

        fov.update(6, 5, 5); // Move actor into view
        memory.drawInto(buffer);

        fov.update(5, 5, 5); // and back out of view
        expect(memory.actorAt(11, 5)).not.toBeNull(); // actor clone
        expect(memory.actorAt(11, 5)).not.toBe(actor); // actor clone

        expect(memory.cell(11, 5).hasStableMemory).toBeTruthy();
        expect(memory.cell(11, 5).hasStableSnapshot).toBeTruthy();
        memory.drawInto(buffer);
    });
});
