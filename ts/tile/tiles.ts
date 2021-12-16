import * as GWU from 'gw-utils';
import * as Tile from './tile';

import '../effect/handlers';
import '../effect/types';

// These are the minimal set of tiles to make the diggers work
Tile.install('NULL', {
    ch: '\u2205',
    fg: 'white',
    bg: 'black',
    flags: 'L_BLOCKS_MOVE',
    name: 'eerie nothingness',
    article: 'an',
    priority: 0,
});

Tile.install('FLOOR', {
    ch: '\u00b7',
    fg: GWU.color.from([30, 30, 30]).rand(20, 0, 0, 0),
    bg: GWU.color.from([2, 2, 10]).rand(0, 2, 2, 0),
    priority: 10,
    article: 'the',
    flavor: 'the stone floor',
});

Tile.install('DOOR', {
    ch: '+',
    fg: [100, 40, 40],
    bg: [30, 60, 60],
    priority: 30,
    flags: 'T_IS_DOOR, L_BLOCKS_EFFECTS, L_BLOCKS_ITEMS, L_BLOCKS_VISION, L_VISUALLY_DISTINCT',
    article: 'a',
    effects: {
        enter: 'TILE:DOOR_OPEN',
        open: 'TILE:DOOR_OPEN_ALWAYS',
    },
    flavor: 'a closed door',
});

Tile.install('DOOR_OPEN', 'DOOR', {
    ch: "'",
    fg: [100, 40, 40],
    bg: [30, 60, 60],
    priority: 40,
    flags: '!L_BLOCKS_ITEMS, !L_BLOCKS_VISION',
    name: 'open door',
    article: 'an',
    effects: {
        tick: {
            chance: 100 * 100, // 100%
            effects: 'TILE:DOOR~!',
        },
        enter: null,
        open: null,
        close: 'TILE:DOOR~!',
    },
    flavor: 'an open door',
});

Tile.install('DOOR_OPEN_ALWAYS', 'DOOR_OPEN', {
    effects: {
        tick: null,
        close: 'TILE:DOOR~!',
    },
    flavor: 'an open door',
});

Tile.install('UP_STAIRS', {
    ch: '<',
    fg: [100, 50, 50],
    bg: [40, 20, 20],
    priority: 200,
    flags: 'T_UP_STAIRS, L_BLOCKED_BY_STAIRS, L_VISUALLY_DISTINCT, L_LIST_IN_SIDEBAR',
    name: 'upward staircase',
    article: 'an',
    effects: {
        player: 'EMIT:UP_STAIRS',
    },
    flavor: 'stairs leading upwards',
});
Tile.install('DOWN_STAIRS', {
    ch: '>',
    fg: [100, 50, 50],
    bg: [40, 20, 20],
    priority: 200,
    flags: 'T_DOWN_STAIRS, L_BLOCKED_BY_STAIRS, L_VISUALLY_DISTINCT, L_LIST_IN_SIDEBAR',
    name: 'downward staircase',
    article: 'a',
    effects: {
        player: 'EMIT:DOWN_STAIRS',
    },
    flavor: 'downward leading stairs',
});

Tile.install('WALL', {
    ch: '#',
    fg: GWU.color.from([7, 7, 7]).rand(0, 3, 3, 3),
    bg: GWU.color.from([40, 40, 40]).rand(10, 10, 0, 5),
    priority: 100,
    flags: 'L_WALL_FLAGS',
    article: 'a',
    name: 'stone wall',
    description: 'A wall made from rough cut stone.',
    flavor: 'a rough stone wall',
});

Tile.install('IMPREGNABLE', {
    ch: '#',
    fg: GWU.color.from([7, 7, 7]).rand(0, 3, 3, 3),
    bg: GWU.color.from([40, 40, 40]).rand(10, 10, 0, 5),
    priority: 100,
    flags: 'L_WALL_FLAGS, IMPREGNABLE',
    article: 'a',
    name: 'impregnable wall',
    description: 'A wall made from very hard stone.',
    flavor: 'a very hard wall',
});

Tile.install('LAKE', {
    ch: '~',
    fg: GWU.color.from([5, 8, 20]).dance(10, 0, 4, 15),
    bg: GWU.color.from([10, 15, 41]).dance(6, 5, 5, 5),
    priority: 50,
    flags: 'T_DEEP_WATER',
    name: 'deep water',
    article: 'the',
    flavor: 'some deep water',
});

Tile.install('SHALLOW', {
    ch: '\u00b7',
    fg: GWU.color.from([5, 8, 10]).dance(10, 0, 4, 15),
    bg: GWU.color.from([10, 30, 30]).dance(6, 0, 10, 10),
    priority: 20,
    name: 'shallow water',
    article: 'the',
    flags: 'T_SHALLOW_WATER',
    // depth: 'LIQUID', // 'SURFACE'?
    flavor: 'some shallow water',
});

Tile.install('BRIDGE', {
    ch: '=',
    fg: [100, 40, 40],
    priority: 40,
    depth: 'SURFACE',
    flags: 'T_BRIDGE, L_VISUALLY_DISTINCT',
    article: 'a',
    groundTile: 'LAKE',
    flavor: 'a bridge',
});
