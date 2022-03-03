import 'jest-extended';

import * as Actor from './index';
import * as Map from '../map';

import '../tile/tiles';

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
        expect(actorA.hasAction('jump')).toBeTruthy();
        expect(actorA.canDoAction('jump')).toBeTruthy();
    });

    test('action - false', () => {
        expect(actorA.hasAction('fly')).toBeFalsy();
        expect(actorA.canDoAction('fly')).toBeFalsy();
    });

    test('action - true', () => {
        expect(actorA.hasAction('eat')).toBeFalsy();
        expect(actorA.canDoAction('eat')).toBeTruthy(); // do the global
    });

    test('action - unknown', () => {
        expect(actorA.hasAction('rummage')).toBeFalsy();
        expect(actorA.canDoAction('rummage')).toBeTruthy(); // by default you can do anything!
    });

    test('bump', () => {
        const bumpA = actorA.getBumpActions();
        expect(bumpA).toEqual(['eat', 'fly']);

        const bumpB = actorB.getBumpActions();
        expect(bumpB).toEqual(['fly', 'jump']);
    });
});
