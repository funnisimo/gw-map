import 'jest-extended';
import '../../test/matchers';

import * as GWU from 'gw-utils';
import * as Actor from '../actor';
import * as Horde from '.';
import * as Tile from '../tile';
import * as Map from '../map';

describe('Horde', () => {
    beforeAll(() => {
        Actor.install('ACTOR', {
            name: 'an Actor',
            ch: 'a',
            fg: 'white',
        });

        Actor.install('BARTENDER', {
            name: 'a Bartender',
            ch: 'b',
            fg: 'white',
        });

        Actor.install('CHEF', {
            name: 'a Chef',
            ch: 'c',
            fg: 'white',
        });

        Actor.install('SPECTATOR', {
            name: 'a Spectator',
            ch: 's',
            fg: 'white',
            requiredTileTags: 'FRONT_HOUSE',
        });

        Tile.install('CHAIR', {
            name: 'a Chair',
            ch: 'h',
            fg: 'brown',
            tags: 'FRONT_HOUSE',
        });
    });

    beforeEach(() => {
        Object.keys(Horde.hordes).forEach((key) => {
            delete Horde.hordes[key];
        });
    });

    test('install', () => {
        const actor = Horde.install('ACTOR', 'ACTOR');
        expect(actor).toBe(Horde.hordes.ACTOR);
        expect(actor.frequency(0)).toEqual(100);
        expect(actor.frequency(10)).toEqual(100);
        expect(actor.leader).toEqual('ACTOR');

        const troupe = Horde.install('TROUPE', {
            leader: 'ACTOR',
            members: { ACTOR: '2-3' },
            frequency: '1-8:30',
        });
        expect(troupe).toBe(Horde.hordes.TROUPE);
        expect(troupe.frequency(0)).toEqual(0);
        expect(troupe.frequency(2)).toEqual(30);
        expect(troupe.frequency(10)).toEqual(0);
        expect(troupe.leader).toEqual('ACTOR');
        expect(troupe.members).toEqual({ ACTOR: GWU.range.make('2-3') });
    });

    test('installAll', () => {
        Horde.installAll({});

        Horde.installAll({
            ACTOR: 'ACTOR',
            TROUPE: { leader: 'ACTOR', members: { ACTOR: '2-3' } },
        });

        expect(Horde.hordes).toContainAllKeys(['ACTOR', 'TROUPE']);
    });

    test('random', () => {
        Horde.installAll({
            ACTOR: {
                leader: 'ACTOR',
                tags: 'SOLO',
                flags: 'HORDE_ALLIED_WITH_PLAYER',
            },
            TROUPE: {
                leader: 'ACTOR',
                members: { ACTOR: '2-3' },
                tags: 'ENSEMBLE',
                flags: 'HORDE_DIES_ON_LEADER_DEATH',
            },
        });

        expect(Horde.random('SOLO')).toBe(Horde.hordes.ACTOR);
        expect(Horde.random('!SOLO')).toBe(Horde.hordes.TROUPE);
        expect(Horde.random({ tags: 'SOLO' })).toBe(Horde.hordes.ACTOR);
        expect(Horde.random({ forbidTags: 'SOLO' })).toBe(Horde.hordes.TROUPE);

        expect(Horde.random({ flags: 'HORDE_ALLIED_WITH_PLAYER' })).toBe(
            Horde.hordes.ACTOR
        );
        expect(Horde.random({ flags: '!HORDE_ALLIED_WITH_PLAYER' })).toBe(
            Horde.hordes.TROUPE
        );
        expect(Horde.random({ forbidFlags: 'HORDE_ALLIED_WITH_PLAYER' })).toBe(
            Horde.hordes.TROUPE
        );
    });

    test('requiredTile', async () => {
        // 	[MK_ARROW_TURRET, 0, null, null, 5, 13, 100, WALL, 0, HORDE_NO_PERIODIC_SPAWN],

        const audience = Horde.install('AUDIENCE', {
            leader: 'SPECTATOR',
            frequency: '5-13',
            flags: 'HORDE_NO_PERIODIC_SPAWN',
        });

        // SPECTATOR requires 'SEAT' tag on tile...

        const map = Map.make(10, 10, 'FLOOR', 'WALL');
        map.setTile(5, 5, 'CHAIR');
        expect(map.cell(5, 5).hasTileTag('FRONT_HOUSE')).toBeTruthy();

        expect(Actor.kinds.SPECTATOR.requiredTileTags).toEqual(['FRONT_HOUSE']);

        expect(Actor.kinds.SPECTATOR.avoidsCell(map.cell(5, 5))).toBeFalsy();
        expect(Actor.kinds.SPECTATOR.avoidsCell(map.cell(4, 4))).toBeTruthy();

        expect(await audience.spawn(map, 4, 4)).toBeNull(); // Fails - avoids cell

        const spectator = await audience.spawn(map, 5, 5);
        expect(spectator).not.toBeNull();
        expect(map.hasActor(5, 5)).toBeTruthy();
        expect(spectator).toBeAtXY(5, 5);
    });

    test('members with required tile tags', async () => {
        const audience = Horde.install('AUDIENCE', {
            leader: 'SPECTATOR',
            frequency: '5-13',
            flags: 'HORDE_NO_PERIODIC_SPAWN',
            members: { SPECTATOR: '5-10' },
        });

        // SPECTATOR requires 'FRONT_HOUSE' tag on tile...

        const map = Map.make(10, 10, 'FLOOR', 'WALL');

        GWU.xy.forRect(1, 1, 4, 4, (x, y) => map.setTile(x, y, 'CHAIR'));

        const leader = await audience.spawn(map, 4, 4);
        expect(leader).toBeObject();

        // map.dump();

        let count = 0;
        map.eachActor((a) => {
            ++count;
            expect(map.cell(a.x, a.y).hasTileTag('FRONT_HOUSE')).toBeTrue();
        });
        expect(count).toBeGreaterThan(5);
    });
});
