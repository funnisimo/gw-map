import * as GWU from 'gw-utils';
import * as Actor from '.';
import * as Map from '../map';

describe('Actor', () => {
    test('create and place', async () => {
        Actor.install('ACTOR', {
            name: 'an actor',
            ch: 'a',
            fg: 'green',
        });

        const actor = Actor.make('ACTOR');

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
});
