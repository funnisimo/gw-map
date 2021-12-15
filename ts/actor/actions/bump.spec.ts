import 'jest-extended';
import * as UTILS from '../../../test/utils';

import * as Actor from '../index';
import * as Map from '../../map';
import { Game } from '../../game';
import '../../tile/tiles';

describe('Bump', () => {
    let map: Map.Map;
    let game: jest.Mocked<Game>;
    let actorA: Actor.Actor;
    let actorB: Actor.Actor;
    let actorC: Actor.Actor;
    let actorD: Actor.Actor;
    let eatFn: jest.MockedFunction<Actor.ActorActionFn>;

    beforeAll(() => {
        Actor.install('A', {
            name: 'A',
            ch: 'A',
            actions: { eat: jest.fn().mockResolvedValue(123) },
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

        eatFn = jest.fn().mockResolvedValue(234);
        Actor.installAction('eat', eatFn);
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
        expect(actorA.kind.actions.eat).toBeFunction();

        expect(
            await Actor.actions.bump(game, actorA, { actor: actorB })
        ).toEqual(123);
        expect(Actor.kinds.A.actions.eat).toHaveBeenCalled();
    });

    test('bump - string -> true -> fn', async () => {
        map.addActor(5, 5, actorA);
        map.addActor(6, 5, actorB);

        expect(actorA.kind.bump).toEqual(['eat']);
        expect(actorB.kind.actions.eat).toBeTrue();
        expect(Actor.getAction('eat')).toBe(eatFn);

        expect(
            await Actor.actions.bump(game, actorB, { actor: actorA })
        ).toEqual(234);
        expect(eatFn).toHaveBeenCalled();
    });

    test('bump - string -> false -> THROW!!', async () => {
        map.addActor(5, 5, actorA);
        map.addActor(6, 5, actorC);

        expect(actorA.kind.bump).toEqual(['eat']);
        expect(actorC.kind.actions.eat).toBeFalse();

        expect(
            Actor.actions.bump(game, actorC, { actor: actorA })
        ).rejects.toThrow();
    });

    test('bump - string -> true -> undefined -> THROW!!', async () => {
        map.addActor(5, 5, actorB);
        map.addActor(6, 5, actorD);

        expect(actorD.kind.bump).toEqual(['talk']);
        expect(actorB.kind.actions.talk).toBeTrue();
        expect(Actor.getAction('talk')).toBeNull();

        expect(
            Actor.actions.bump(game, actorB, { actor: actorD })
        ).rejects.toThrow();
    });
});
