import * as GWU from 'gw-utils';
import * as Actor from '.';
import * as Map from '../map';

describe('Actor', () => {
    test('create and place', async () => {
        const actor = Actor.from({
            name: 'an actor',
            ch: 'a',
            fg: 'green',
        });

        const map = Map.make(20, 20, 'FLOOR', 'WALL');

        expect(await map.addActor(5, 5, actor)).toBeTruthy();
        expect(map.actorAt(5, 5)).toBe(actor);

        expect(await map.moveActor(actor, GWU.xy.LEFT)).toBeTruthy();
        expect(map.actorAt(5, 5)).toBe(null);
        expect(map.actorAt(4, 5)).toBe(actor);

        expect(await map.removeActor(actor)).toBeTruthy();
        expect(map.actorAt(4, 5)).toBe(null);

        expect(await map.removeActor(actor)).toBeFalsy();
        expect(await map.moveActor(actor, GWU.xy.UP)).toBeFalsy();
    });

    test('actor with fov', async () => {
        const map = Map.make(20, 20, 'FLOOR', 'WALL');
        const fov = new GWU.fov.FovSystem(map);

        const actor = Actor.from(
            {
                name: 'an actor',
                ch: 'a',
                fg: 'green',
            },
            { fov }
        );

        expect(await map.addActor(5, 5, actor)).toBeTruthy();
        expect(map.actorAt(5, 5)).toBe(actor);

        fov.update(5, 5, 5);

        expect(actor.canSee(6, 6)).toBeTruthy();
        expect(actor.canSee(18, 18)).toBeFalsy();
    });

    test('actor with NO fov', async () => {
        const map = Map.make(20, 20, 'FLOOR', 'WALL');

        const actor = Actor.from({
            name: 'an actor',
            ch: 'a',
            fg: 'green',
        });

        expect(await map.addActor(5, 5, actor)).toBeTruthy();
        expect(map.actorAt(5, 5)).toBe(actor);

        expect(actor.canSee(6, 6)).toBeTruthy();
        expect(actor.canSee(18, 18)).toBeTruthy(); // nothing in the way
    });
});
