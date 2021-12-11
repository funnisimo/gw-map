import * as Kind from './kind';
import * as Actor from '../actor';

describe('ActorKind', () => {
    test('create', () => {
        const kind = new Kind.PlayerKind({
            name: 'Test',
            attributes: { a: 1, b: 2, c: 3 },
        });

        expect(kind.attributes.get('a')).toEqual(1);
        expect(kind.attributes.get('b')).toEqual(2);
        expect(kind.attributes.get('c')).toEqual(3);
    });

    test('install', () => {
        const kind = new Kind.PlayerKind({
            name: 'Test',
            attributes: { a: 1, b: 2, c: 3 },
        });

        Actor.install('Test', kind);

        const k = Actor.get('Test');
        expect(k).toBe(kind);
    });
});
