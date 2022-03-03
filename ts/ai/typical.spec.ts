import 'jest-extended';
import '../../test/matchers';
import * as UTILS from '../../test/utils';

import * as GWU from 'gw-utils';

import * as ACTION from '../action';
import * as Actor from '../actor';
import * as Map from '../map';
import * as AI from './typical';
import { Game } from '../game';

import '../actions';
import '../tile/tiles';

describe('typical', () => {
    let actor: Actor.Actor;
    let target: Actor.Actor;
    let map: Map.Map;
    let game: Game;
    let action: ACTION.Action;

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
        action = new ACTION.Action('test', {
            game,
            map,
            actor,
            target,
            x: 5,
            y: 6,
        });
    });

    describe('moveToward', () => {
        test('straight - down', () => {
            map.addActor(5, 5, actor);
            expect(actor).toBeAtXY(5, 5);
            map.addActor(5, 10, target);
            expect(target).toBeAtXY(5, 10);

            AI.moveToward(action);
            expect(action.isSuccess()).toBeTruthy();
            expect(actor).toBeAtXY(5, 6);
        });

        test('straight - left', () => {
            map.addActor(10, 5, actor);
            expect(actor).toBeAtXY(10, 5);
            map.addActor(5, 5, target);
            expect(target).toBeAtXY(5, 5);

            AI.moveToward(action);
            expect(action.isSuccess()).toBeTruthy();
            expect(actor).toBeAtXY(9, 5);
        });

        test('around obstacle', () => {
            map.addActor(10, 5, actor);
            expect(actor).toBeAtXY(10, 5);
            map.addActor(5, 5, target);
            expect(target).toBeAtXY(5, 5);

            map.setTile(9, 5, 'WALL');

            AI.moveToward(action);
            expect(action.isSuccess()).toBeTruthy();
            expect(actor).toBeAtXY(10, 4);
        });
    });
});
