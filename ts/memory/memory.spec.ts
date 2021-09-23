import * as GWU from 'gw-utils';
import * as Map from '../map';
import * as Actor from '../actor';
import { Memory } from './memory';
import * as Flags from '../flags';

describe('memory', () => {
    test('basic', () => {
        const map = Map.make(20, 20, 'FLOOR', 'WALL');
        expect(
            map.cell(5, 5).hasCellFlag(Flags.Cell.STABLE_SNAPSHOT)
        ).toBeFalsy();

        const memory = new Memory(map);
        const cellMem = memory.cell(5, 5);
        expect(cellMem.isNull()).toBeTruthy();
        expect(cellMem.hasCellFlag(Flags.Cell.STABLE_SNAPSHOT)).toBeFalsy(); // snapshots are not stable by default
        expect(cellMem.hasCellFlag(Flags.Cell.STABLE_MEMORY)).toBeTruthy(); // memory is stable by default

        // becomes visible
        memory.onFovChange(5, 5, true);
        expect(cellMem.isNull()).toBeTruthy();
        expect(cellMem.hasCellFlag(Flags.Cell.STABLE_SNAPSHOT)).toBeFalsy();
        expect(cellMem.hasCellFlag(Flags.Cell.STABLE_MEMORY)).toBeFalsy(); // memory is not stable

        // store when !vis
        memory.onFovChange(5, 5, false);
        expect(cellMem.isNull()).toBeFalsy();
        expect(cellMem.hasCellFlag(Flags.Cell.STABLE_SNAPSHOT)).toBeFalsy();
        expect(cellMem.hasCellFlag(Flags.Cell.STABLE_MEMORY)).toBeTruthy(); // memory is stable
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
        expect(cellMem.hasCellFlag(Flags.Cell.STABLE_MEMORY)).toBeTruthy(); // not visible

        fov.update(5, 5, 5);
        expect(memory.onFovChange).toHaveBeenCalledWith(5, 5, true);
        expect(cellMem.hasCellFlag(Flags.Cell.STABLE_MEMORY)).toBeFalsy(); // visible

        onFovChange.mockClear();
        fov.update(15, 15, 5);
        expect(memory.onFovChange).toHaveBeenCalledWith(5, 5, false);
        expect(cellMem.hasCellFlag(Flags.Cell.STABLE_MEMORY)).toBeTruthy(); // not visible
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
        expect(cellMem.hasCellFlag(Flags.Cell.STABLE_MEMORY)).toBeTruthy(); // not visible

        fov.update(5, 5, 5);
        expect(memory.onFovChange).toHaveBeenCalledWith(10, 5, true);
        expect(memory.onFovChange).not.toHaveBeenCalledWith(11, 5, true);
        expect(fov.isAnyKindOfVisible(11, 5)).toBeFalsy();
        expect(cellMem.hasCellFlag(Flags.Cell.STABLE_MEMORY)).toBeFalsy(); // visible

        // actor walks into FOV
        await map.moveActor(actor, GWU.xy.LEFT);
        fov.update(5, 5, 5); // no fov change - player stood still
        expect(map.actorAt(10, 5)).toBe(actor);
        expect(
            memory.cell(10, 5).hasCellFlag(Flags.Cell.STABLE_MEMORY)
        ).toBeFalsy();
        expect(
            memory.cell(11, 5).hasCellFlag(Flags.Cell.STABLE_MEMORY)
        ).toBeTruthy();
        expect(memory.cell(11, 5).actor).toBeNull(); // never seen!

        // actor walks off
        await map.moveActor(actor, GWU.xy.RIGHT);
        fov.update(5, 5, 5); // no fov change - player stood still

        // nothing changes - no fov change
        expect(map.actorAt(10, 5)).toBeNull();
        expect(map.actorAt(11, 5)).toBe(actor);
        expect(
            memory.cell(10, 5).hasCellFlag(Flags.Cell.STABLE_MEMORY)
        ).toBeFalsy();
        expect(
            memory.cell(11, 5).hasCellFlag(Flags.Cell.STABLE_MEMORY)
        ).toBeTruthy();
        expect(memory.cell(11, 5).actor).toBeNull(); // not seen

        fov.update(6, 5, 5); // Move actor into view
        memory.drawInto(buffer);

        fov.update(5, 5, 5); // and back out of view
        expect(memory.cell(11, 5).actor).toBeNull(); // not seen
        expect(
            memory.cell(11, 5).hasCellFlag(Flags.Cell.STABLE_MEMORY)
        ).toBeTruthy();
        expect(
            memory.cell(11, 5).hasCellFlag(Flags.Cell.STABLE_SNAPSHOT)
        ).toBeFalsy();
        memory.drawInto(buffer);
        expect(
            memory.cell(11, 5).hasCellFlag(Flags.Cell.STABLE_SNAPSHOT)
        ).toBeTruthy();
    });
});
