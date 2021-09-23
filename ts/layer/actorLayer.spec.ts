import '../../test/matchers';
import * as GWU from 'gw-utils';

import * as Map from '../map';
import * as Actor from '../actor';

describe('actorLayer', () => {
    test('moveActor - bumps into wall, fails', async () => {
        const map = Map.make(20, 20, 'FLOOR', 'WALL');

        const actor = Actor.from({ ch: '@', fg: 'white', name: 'an Actor' });

        await map.addActor(1, 1, actor);

        expect(actor).toBeAtXY(1, 1);

        const ok = await map.moveActor(actor, GWU.xy.LEFT);
        expect(ok).toBeFalsy();
        expect(actor).toBeAtXY(1, 1);
        expect(map.actorAt(1, 1)).toBe(actor);
    });
});
