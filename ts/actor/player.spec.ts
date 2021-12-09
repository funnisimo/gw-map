// import * as GWU from 'gw-utils';
import * as Actor from '.';
import * as Map from '../map';

import '../effect/handlers';
import '../tile/tiles';

describe('Actor - Player', () => {
    test('make', () => {
        const actor = Actor.from({
            ch: '@',
            fg: 'white',
            name: 'Player',
            flags: 'USES_FOV, HAS_MEMORY, IS_PLAYER',
        });

        expect(actor.fov).toBeNull();
        expect(actor.memory).toBeNull();

        const map = Map.make(20, 20, 'FLOOR', 'WALL');

        map.addActor(5, 5, actor);

        expect(actor.fov).not.toBeNull();
        expect(actor.memory).not.toBeNull();
        expect(actor.memory!.source).toBe(map);

        expect(actor.fov!.isAnyKindOfVisible(5, 5)).toBeFalsy(); // not run yet
        expect(actor.memory!.cell(5, 5)).not.toBe(map.cell(5, 5));
        expect(actor.memory!.cell(5, 5).hasTile('FLOOR')).toBeFalsy();
        expect(actor.memory!.cell(15, 15)).not.toBe(map.cell(15, 15));
        expect(actor.memory!.cell(15, 15).hasTile('FLOOR')).toBeFalsy();

        actor.fov!.update(5, 5, 5);
        expect(actor.fov!.isAnyKindOfVisible(5, 5)).toBeTruthy();
        expect(actor.fov!.isAnyKindOfVisible(15, 15)).toBeFalsy();
        expect(actor.memory!.cell(5, 5)).toBe(map.cell(5, 5));
        expect(actor.memory!.cell(5, 5).hasTile('FLOOR')).toBeTruthy();
        expect(actor.memory!.cell(15, 15)).not.toBe(map.cell(15, 15));
        expect(actor.memory!.cell(15, 15).hasTile('FLOOR')).toBeFalsy();
    });
});
