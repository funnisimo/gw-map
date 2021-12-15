import 'jest-extended';

import * as Actor from './index';
import * as Map from '../map';

describe('Actor Actions', () => {
    beforeAll(() => {
        Actor.install('A', {
            name: 'A',
            ch: 'A',
            fg: 'white',
            actions: {
                jump: jest.fn(),
                eat: true,
                fly: false,
            },
            bump: 'eat | fly',
        });

        Actor.install('B', {
            name: 'B',
            ch: 'B',
            fg: 'blue',
            actions: {
                jump: jest.fn(),
                eat: true,
                fly: false,
            },
            bump: ['fly', 'jump'],
        });
    });

    let map: Map.Map;
    let actorA: Actor.Actor;
    let actorB: Actor.Actor;

    beforeEach(() => {
        map = Map.make(20, 20, 'FLOOR', 'WALL');
        actorA = Actor.make('A');
        actorB = Actor.make('B');

        map.addActor(5, 5, actorA);
        map.addActor(6, 5, actorB);
    });

    test('action - fn', () => {
        const action = actorA.getAction('jump');
        expect(action).toBeFunction();
    });

    test('action - false', () => {
        const action = actorA.getAction('fly');
        expect(action).toBeFalse();
    });

    test('action - true', () => {
        const action = actorA.getAction('eat');
        expect(action).toBeTrue();
    });

    test('action - unknown', () => {
        const action = actorA.getAction('rummage');
        expect(action).toBeTrue(); // default is do the default
    });

    test('bump', () => {
        const bumpA = actorA.getBumpActions();
        expect(bumpA).toEqual(['eat', 'fly']);

        const bumpB = actorB.getBumpActions();
        expect(bumpB).toEqual(['fly', 'jump']);
    });
});
