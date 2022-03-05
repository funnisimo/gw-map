import 'jest-extended';
import * as UTILS from '../../test/utils';

import * as ACTION from '../action';
import * as Actor from '../actor/index';
import * as Map from '../map';
import { Game } from '../game';
import { bump } from './bump';

import '../effects';
import '../tile/tiles';

describe('Bump', () => {
    let map: Map.Map;
    let game: jest.Mocked<Game>;
    let actorA: Actor.Actor;
    let actorB: Actor.Actor;
    let actorC: Actor.Actor;
    let actorD: Actor.Actor;
    let eatFn: jest.MockedFunction<ACTION.ActionFn>;
    let actorEatFn: jest.MockedFunction<ACTION.ActionFn>;

    beforeAll(() => {
        actorEatFn = jest.fn().mockImplementation((a) => a.didSomething());

        Actor.install('A', {
            name: 'A',
            ch: 'A',
            actions: {
                eat: actorEatFn,
            },
            bump: 'eat',
        });

        Actor.install('B', {
            name: 'B',
            ch: 'B',
            actions: { eat: true, talk: true },
            bump: 'eat',
        });

        Actor.install('C', {
            name: 'C',
            ch: 'C',
            actions: { eat: false },
            bump: 'eat',
        });

        Actor.install('D', { name: 'D', ch: 'D', actions: {}, bump: 'talk' });

        eatFn = jest.fn().mockImplementation((a) => a.didSomething());
        ACTION.install('eat', eatFn);
    });

    beforeEach(() => {
        map = Map.make(10, 10, 'FLOOR', 'WALL');
        actorA = Actor.make('A');
        actorB = Actor.make('B');
        actorC = Actor.make('C');
        actorD = Actor.make('D');

        game = UTILS.mockGame(map, actorA);
    });

    test('bump - string -> fn', async () => {
        map.addActor(5, 5, actorA);
        map.addActor(6, 5, actorB);

        expect(actorB.kind.bump).toEqual(['eat']);
        expect(actorA.canDoAction('eat')).toBeTruthy();

        const action = new ACTION.Action({
            game,
            map,
            actor: actorA,
            target: actorB,
        });
        bump(action);
        expect(actorEatFn).toHaveBeenCalled();
        expect(action.isSuccess()).toBeTruthy();
    });

    test('bump - string -> true -> fn', async () => {
        map.addActor(5, 5, actorA);
        map.addActor(6, 5, actorB);

        expect(actorA.kind.bump).toEqual(['eat']);
        expect(actorB.canDoAction('eat')).toBeTrue();

        const action = new ACTION.Action({
            game,
            map,
            actor: actorB,
            target: actorA,
        });
        bump(action);
        expect(action.isSuccess()).toBeTruthy();

        expect(eatFn).toHaveBeenCalled();
    });

    test('bump - string -> false', async () => {
        map.addActor(5, 5, actorA);
        map.addActor(6, 5, actorC);

        expect(actorA.kind.bump).toEqual(['eat']);
        expect(actorC.canDoAction('eat')).toBeFalse();

        const action = new ACTION.Action({
            game,
            map,
            actor: actorC,
            target: actorA,
        });
        bump(action);
        expect(action.isSuccess()).toBeFalsy();
        expect(action.isFailed()).toBeTruthy();
    });

    test('bump - string -> true -> undefined -> throw', async () => {
        map.addActor(5, 5, actorB);
        map.addActor(6, 5, actorD);

        expect(actorD.kind.bump).toEqual(['talk']);
        expect(actorB.canDoAction('talk')).toBeTrue();

        const action = new ACTION.Action({
            game,
            map,
            actor: actorB,
            target: actorD,
        });
        expect(() => bump(action)).toThrow();
        expect(action.isSuccess()).toBeFalsy();
    });
});
