import * as Map from '.';

describe('Snapshot', () => {
    test('constructor', () => {
        const map = Map.make(10, 10, 'FLOOR', 'WALL');
        const manager = new Map.SnapshotManager(map);
        expect(manager.map).toBe(map);
        expect(manager.version).toEqual(0);
    });

    test('take snapshot', () => {
        const map = Map.make(10, 10, 'FLOOR', 'WALL');
        const manager = new Map.SnapshotManager(map);

        const snap = manager.takeNew();
        expect(snap).toBeDefined();

        map.setTile(5, 5, 'WALL');
        expect(map.hasTile(5, 5, 'WALL')).toBeTruthy();

        manager.revertMapTo(snap);
        expect(map.hasTile(5, 5, 'WALL')).toBeFalsy();
    });

    test('take + release + retake', () => {
        const map = Map.make(10, 10, 'FLOOR', 'WALL');
        const manager = new Map.SnapshotManager(map);

        const snap = manager.takeNew();
        expect(snap).toBeDefined();
        expect(snap.version).toEqual(1);
        manager.release(snap);

        map.setTile(5, 5, 'WALL');
        expect(map.hasTile(5, 5, 'WALL')).toBeTruthy();

        const snap2 = manager.takeNew();
        expect(snap2).toBe(snap);
        expect(snap.version).toEqual(2);

        map.setTile(5, 5, 'IMPREGNABLE');
        expect(map.hasTile(5, 5, 'IMPREGNABLE')).toBeTruthy();

        manager.revertMapTo(snap2);
        expect(map.hasTile(5, 5, 'WALL')).toBeTruthy();
        expect(manager.version).toEqual(snap2.version);
    });

    test('take + take2 + release2 + revert', () => {
        const map = Map.make(10, 10, 'FLOOR', 'WALL');
        const manager = new Map.SnapshotManager(map);

        const snap = manager.takeNew();
        expect(snap).toBeDefined();
        expect(snap.version).toEqual(1);

        map.setTile(5, 5, 'WALL');
        expect(map.hasTile(5, 5, 'WALL')).toBeTruthy();

        const snap2 = manager.takeNew();
        expect(snap2).not.toBe(snap);
        expect(snap2.version).toEqual(2);

        map.setTile(5, 5, 'IMPREGNABLE');
        expect(map.hasTile(5, 5, 'IMPREGNABLE')).toBeTruthy();

        manager.release(snap2);

        manager.revertMapTo(snap);
        expect(map.hasTile(5, 5, 'WALL')).toBeFalsy();
        expect(map.hasTile(5, 5, 'IMPREGNABLE')).toBeFalsy();
        expect(map.hasTile(5, 5, 'FLOOR')).toBeTruthy();
        expect(manager.version).toEqual(snap.version);
    });
});
