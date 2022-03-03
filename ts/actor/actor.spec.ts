// import * as GWU from 'gw-utils';
import * as Actor from '.';
import * as Map from '../map';
import * as Flags from '../flags';

import '../tile/tiles';

describe('Actor', () => {
    test('create and place', () => {
        const actor = Actor.make({
            name: 'an actor',
            ch: 'a',
            fg: 'green',
        });

        const map = Map.make(20, 20, 'FLOOR', 'WALL');

        expect(map.addActor(5, 5, actor, false)).toBeTruthy();
        expect(map.actorAt(5, 5)).toBe(actor);

        expect(actor.visionDistance).toEqual(99);

        // Default flags
        expect(actor.hasEntityFlag(Flags.Entity.L_NO_SIDEBAR)).toBeFalsy();

        // expect( map.moveActor(actor, GWU.xy.LEFT)).toBeTruthy();
        // expect(map.actorAt(5, 5)).toBe(null);
        // expect(map.actorAt(4, 5)).toBe(actor);

        expect(map.removeActor(actor, false)).toBeTruthy();
        expect(map.actorAt(5, 5)).toBe(null);

        expect(map.removeActor(actor)).toBeFalsy();
        // expect( map.moveActor(actor, GWU.xy.UP)).toBeFalsy();
    });

    test('vision', () => {
        const actor = Actor.make({
            name: 'an actor',
            ch: 'a',
            fg: 'green',
            vision: 5,
        });

        expect(actor.visionDistance).toEqual(5);
    });

    test('actor with NO fov', () => {
        const map = Map.make(20, 20, 'FLOOR', 'WALL');

        const actor = Actor.make({
            name: 'an actor',
            ch: 'a',
            fg: 'green',
            flags: 'L_NO_SIDEBAR',
        });

        expect(map.addActor(5, 5, actor)).toBeTruthy();
        expect(map.actorAt(5, 5)).toBe(actor);

        expect(actor.hasEntityFlag(Flags.Entity.L_NO_SIDEBAR)).toBeTruthy();

        expect(actor.canSee(6, 6)).toBeTruthy();
        expect(actor.canSee(18, 18)).toBeTruthy(); // nothing in the way
    });

    test('clone', () => {
        const actor = Actor.make({ ch: '@', fg: 'white', name: 'An Actor' });
        const other = actor.clone();
        expect(other).toBeInstanceOf(Actor.Actor);
        expect(other.kind).toBe(actor.kind);
    });
});
