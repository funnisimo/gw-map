import 'jest-extended';
import '../../test/matchers';
import * as UTILS from '../../test/utils';

import * as GWU from 'gw-utils';

import * as Actor from '../actor';
import * as Map from '../map';
import * as AI from './typical';
import '../tile/tiles';
import { Game } from '../game';

describe('typical', () => {
    let actor: Actor.Actor;
    let target: Actor.Actor;
    let map: Map.Map;
    let game: Game;

    beforeAll(() => {
        Actor.install('TESTA', { name: 'Test A', ch: 'A', fg: 'white' });
        Actor.install('TESTB', { name: 'Test B', ch: 'B', fg: 'green' });
    });

    beforeEach(() => {
        GWU.random.seed(12345);
        map = Map.make(20, 20, 'FLOOR', 'WALL');
        actor = Actor.make('TESTA');
        target = Actor.make('TESTB');

        game = UTILS.mockGame(map, actor);
    });

    describe('moveToward', () => {
        test('straight - down', async () => {
            map.addActor(5, 5, actor);
            expect(actor).toBeAtXY(5, 5);
            map.addActor(5, 10, target);
            expect(target).toBeAtXY(5, 10);

            expect(await AI.moveToward(game, actor, target)).toEqual(
                actor.moveSpeed()
            );
            expect(actor).toBeAtXY(5, 6);
        });

        test('straight - left', async () => {
            map.addActor(10, 5, actor);
            expect(actor).toBeAtXY(10, 5);
            map.addActor(5, 5, target);
            expect(target).toBeAtXY(5, 5);

            expect(await AI.moveToward(game, actor, target)).toEqual(
                actor.moveSpeed()
            );
            expect(actor).toBeAtXY(9, 5);
        });

        test('around obstacle', async () => {
            map.addActor(10, 5, actor);
            expect(actor).toBeAtXY(10, 5);
            map.addActor(5, 5, target);
            expect(target).toBeAtXY(5, 5);

            map.setTile(9, 5, 'WALL');

            expect(await AI.moveToward(game, actor, target)).toEqual(
                actor.moveSpeed()
            );
            expect(actor).toBeAtXY(10, 4);
        });
    });
});
