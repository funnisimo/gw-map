import * as Map from '../map';
import * as Player from './index';

describe('Player', () => {
    test('actor with fov', () => {
        const map = Map.make(20, 20, 'FLOOR', 'WALL');

        const player = Player.make({
            name: 'an actor',
            ch: 'a',
            fg: 'green',
        });

        map.setPlayer(player);
        expect(map.addActor(5, 5, player)).toBeTruthy();
        expect(map.actorAt(5, 5)).toBe(player);

        map.fov.update();

        // map.fov.flags.dump((_v, x, y) =>
        //     map.fov.isDirectlyVisible(x, y) ? '1' : ' '
        // );

        expect(player.canSee(6, 6)).toBeTruthy();
        expect(player.canSee(18, 18)).toBeTruthy();
    });
});
