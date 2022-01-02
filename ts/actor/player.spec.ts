// import * as GWU from 'gw-utils';
import * as Actor from '.';
import * as Map from '../map';

import '../effect/handlers';
import '../tile/tiles';

describe('Actor - Player', () => {
    test('make', () => {
        const actor = Actor.make({
            ch: '@',
            fg: 'white',
            name: 'Player',
            flags: 'USES_FOV, HAS_MEMORY, IS_PLAYER',
        });

        const map = Map.make(20, 20, 'FLOOR', 'WALL');

        map.addActor(5, 5, actor);
        expect(map.actorAt(5, 5)).toBe(actor);
    });
});
