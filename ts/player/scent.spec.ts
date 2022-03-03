import * as Map from '../map';
import * as Player from './player';
import * as Make from './make';
import * as Scent from './scent';
import '../tile/tiles';

describe('Scent', () => {
    let map: Map.Map;
    let player: Player.Player;
    let scent: Scent.Scent;

    beforeEach(() => {
        map = Map.make(20, 20);
        player = Make.make({ name: 'Hero' });
        scent = player.scent;

        map.setPlayer(player);
    });

    test('update', () => {
        expect(scent.get(10, 10)).toEqual(0);

        map.addActor(10, 10, player);
        scent.update();
        expect(scent.get(10, 10)).toEqual(9);

        // scent._data.dump();

        map.moveActor(player, 9, 10);
        scent.update();

        // scent._data.dump();

        expect(scent.get(9, 10)).toEqual(9);
        expect(scent.get(10, 10)).toEqual(9);
        expect(scent.get(11, 10)).toEqual(8);

        map.moveActor(player, 8, 10);
        scent.update();

        // scent._data.dump();

        expect(scent.get(8, 10)).toEqual(9);
        expect(scent.get(9, 10)).toEqual(9);
        expect(scent.get(10, 10)).toEqual(8);
        expect(scent.get(11, 10)).toEqual(8);

        map.moveActor(player, 7, 10);
        scent.update();

        // scent._data.dump();

        expect(scent.get(7, 10)).toEqual(9);
        expect(scent.get(8, 10)).toEqual(9);
        expect(scent.get(9, 10)).toEqual(8);
        expect(scent.get(10, 10)).toEqual(8);
        expect(scent.get(11, 10)).toEqual(7);

        map.moveActor(player, 6, 10);
        scent.update();

        map.moveActor(player, 5, 10);
        scent.update();

        map.moveActor(player, 4, 10);
        scent.update();

        map.moveActor(player, 3, 10);
        scent.update();

        map.moveActor(player, 2, 10);
        scent.update();

        map.moveActor(player, 1, 10);
        scent.update();

        // scent._data.dump();
        expect(scent.get(1, 10)).toEqual(9);

        scent.update();
        scent.update();
        scent.update();
        scent.update();
        scent.update();

        // scent._data.dump();
        expect(scent.get(1, 10)).toEqual(9);

        scent.update();
        scent.update();
        scent.update();
        scent.update();
        scent.update();

        // scent._data.dump();
        expect(scent.get(1, 10)).toEqual(9);
    });
});
