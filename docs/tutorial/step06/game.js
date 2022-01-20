GWM.tile.install('ENTRANCE', {
    extends: 'DOWN_STAIRS',
    ch: '\u2229',
    fg: 'gray',
    flags: 'L_BLOCKS_MOVE',
    flavor: 'the entrance gate',
    name: 'Blocked Gate',
});

GWM.tile.install('EXIT', {
    extends: 'UP_STAIRS',
    ch: '\u2229',
    fg: 'green',
    flags: 'L_BRIGHT_MEMORY',
    flavor: 'the exit gate',
    name: 'Exit Gate',
});

GWM.tile.install('FINAL_EXIT', {
    extends: 'UP_STAIRS',
    ch: '\u2229',
    fg: 'green',
    flags: 'L_BRIGHT_MEMORY',
    flavor: 'the exit gate',
    name: 'Exit Gate',
});

GWM.tile.install('INACTIVE_EXIT', {
    extends: 'EXIT',
    fg: 'gray',
    flags: 'L_BLOCKS_MOVE',
    flavor: 'the exit gate',
    name: 'Blocked Gate',
});

// GWM.tile.install('INACTIVE_UP_STAIRS', {
//     extends: 'UP_STAIRS',
//     fg: 'gray',
//     flags: 'L_BLOCKS_MOVE',
//     flavor: 'blocked stairs',
//     name: 'Blocked Stairs',
// });

// GWM.tile.install('INACTIVE_DOWN_STAIRS', {
//     extends: 'DOWN_STAIRS',
//     fg: 'gray',
//     flags: 'L_BLOCKS_MOVE',
//     flavor: 'blocked stairs',
//     name: 'Blocked Stairs',
// });

GWM.item.install('ANANAS', {
    name: 'Ananas',
    ch: '*',
    fg: 'gold',

    actions: {
        async pickup(game, actor, item) {
            game.map.removeItem(item);

            GWU.message.addAt(
                actor.x,
                actor.y,
                '{{you}} {{verb pick~}} up {{an item}}.',
                {
                    actor,
                    item,
                }
            );

            actor.data.count += 1;
            actor.changed = true; // causes sidebar to redraw
            if (game.map.items.length === 0) {
                await game.ui.alert('You found them all!');
                // await game.ui.fadeTo('black', 500);
                const tile = game.map.id === 5 ? 'FINAL_EXIT' : 'EXIT';
                game.map.eachCell((c) => {
                    if (!c.hasTile('INACTIVE_EXIT')) return;
                    c.setTile(tile);
                    game.map.fov.revealCell(c.x, c.y, 3, true);
                });
                GWU.message.addAt(
                    game.player.x,
                    game.player.y,
                    'Proceed to the exit.',
                    'green'
                );
            }
            return actor.endTurn(); // handled
        },
    },
});

function addRandomBox(map, playerLoc) {
    const item = GWM.item.make('ANANAS');

    const loc = GWU.random.matchingLoc(map.width, map.height, (x, y) => {
        if (item.avoidsCell(map.cell(x, y))) return false;
        if (GWU.xy.distanceBetween(x, y, playerLoc[0], playerLoc[1]) < 15)
            return false;

        let ok = true;
        map.eachItem((i) => {
            if (GWU.xy.distanceBetween(x, y, i.x, i.y) < 10) {
                ok = false;
            }
        });

        return ok;
    });
    map.addItemNear(loc[0], loc[1], item);
}

function addPedro(map) {
    const start = map.locations.start;
    const end = map.locations.end;

    const pedro = GWM.actor.make('PEDRO');

    const loc = GWU.random.matchingLoc(map.width, map.height, (x, y) => {
        if (pedro.avoidsCell(map.cell(x, y))) return false;

        // closer to start than finish - nope
        if (
            GWU.xy.distanceBetween(x, y, start[0], start[1]) <
            GWU.xy.distanceBetween(x, y, end[0], end[1])
        ) {
            return false;
        }
        return true;
    });
    map.addActorNear(loc[0], loc[1], pedro);
}

class MyHero extends GWM.player.PlayerKind {
    drawSidebar(player, buffer, bounds) {
        let count = super.drawSidebar(player, buffer, bounds);
        if (!count) return 0;
        buffer.drawText(
            bounds.x + 3,
            bounds.y + count++,
            'Level: ' + (player.map.id + 1),
            'lighter_gray'
        );
        buffer.drawText(
            bounds.x + 3,
            bounds.y + count++,
            `Found: ${player.data.count}/${player.map.data.count}`,
            'gold'
        );
        return count;
    }
}

GWM.player.install(
    'HERO',
    new MyHero({
        name: 'Hero',
        stats: { health: 10 },
        sidebarFg: 'green',

        // these are actions that I am performing
        actions: {
            async attack(game, hero) {
                await game.ui.alert(
                    'You should not have run into me, you thief!'
                );
                game.finish(false);
                return -1;
            },
        },
    })
);

GWM.actor.install('PEDRO', {
    name: 'Pedro',
    ch: 'P',
    fg: 'red',
    ai: { wander: true },
    flags: 'L_FORMAL_NAME',
    moveSpeed: 130,

    actions: {
        async attack(game, pedro, ctx) {
            if (ctx.actor !== game.player) return 0;
            await game.ui.alert('I got you, you nasty thief!');
            game.finish(false);
            return -1;
        },
    },
});

async function start() {
    // create the user interface
    GAME = new GWM.game.Game({
        width: 80,
        height: 40,
        div: 'game',

        mouse: true,
        viewport: { scent: false },
        messages: true, // bottom
        flavor: true,
        sidebar: true,

        start() {
            const seed = GWU.random.number();
            console.log('seed = ', seed);
            // GWU.random.seed(seed);

            const dungeon = new GWD.Dungeon({
                levels: 5,
                goesUp: true,
                width: this.width,
                height: this.height,

                startTile: 'ENTRANCE',

                seed,
                loops: { minDistance: 30, maxLength: 4 },
                lakes: 10,
                stairs: {
                    upTile: 'INACTIVE_EXIT',
                    downTile: 'ENTRANCE',
                },
            });

            dungeon.stairLocs.forEach(([down, up], i) => {
                console.log(i, down, up);
            });

            this.dungeon = dungeon;
        },

        makeMap(id) {
            const map = GWM.map.make(this.width, this.height, {
                visible: true,
            });
            this.dungeon.getLevel(id, map);

            // Add boxes randomly
            for (let c = 0; c < 8; ++c) {
                addRandomBox(map, map.locations.start);
            }
            map.data.count = map.items.length;

            // create and add Pedros
            addPedro(map);
            addPedro(map);

            // map.locations.start = [
            //     Math.floor(map.width / 2),
            //     Math.floor(map.height / 2),
            // ];

            return map;
        },

        makePlayer() {
            const PLAYER = GWM.player.make('HERO');
            return PLAYER;
        },

        startMap(map, player) {
            player.data.count = 0;
            if (map.id === 0) {
                GWU.message.add('#{gold}Welcome to Ananas de Caracas!');
            } else {
                const info = { id: map.id + 1 };
                GWU.message.add('#{gold}Welcome to floor #{{id}}', info);
            }
            GWM.actor.get('PEDRO').moveSpeed = 130 - 10 * map.id;
        },

        keymap: {
            dir: 'moveDir',
            ' ': 'pickup',
            q() {
                GAME.finish(false);
            },
            '>': 'climb',
        },
    });

    while (true) {
        await showTitle(GAME);
        const result = await playGame(GAME);
        await showGameOver(GAME, result);
    }
}

window.onload = start;

async function showTitle(game) {
    const layer = new GWU.ui.Layer(game.ui);
    const buffer = layer.buffer;

    buffer.fill(0);
    buffer.drawText(0, 15, 'Ananas de Caracas', 'yellow', -1, 80, 'center');

    buffer.drawText(
        0,
        20,
        'Try to find the #{gold Ananas} before #{red Pedro} catches you!',
        'white',
        -1,
        80,
        'center'
    );

    buffer.drawText(
        0,
        22,
        "Hint: #{red Pedro} can't swim!",
        'gray',
        -1,
        80,
        'center'
    );

    buffer.drawText(
        0,
        26,
        'Use the #{green arrow keys} to move around.',
        'white',
        -1,
        80,
        'center'
    );
    buffer.drawText(
        0,
        27,
        'Press #{green space} to open boxes.',
        'white',
        -1,
        80,
        'center'
    );
    buffer.drawText(
        0,
        28,
        'Press #{green q} to quit.',
        'white',
        -1,
        80,
        'center'
    );

    buffer.drawText(
        0,
        30,
        '[Press any key to begin]',
        'gray',
        -1,
        80,
        'center'
    );

    buffer.render();

    await layer.io.nextKeyOrClick();

    layer.finish();
}

async function playGame(game) {
    // create and dig the map

    return game.start();
}

async function showGameOver(game, success) {
    const layer = new GWU.ui.Layer(game.ui);

    const buffer = layer.buffer;

    buffer.fill(0);
    buffer.drawText(0, 20, 'GAME OVER', 'yellow', -1, 80, 'center');

    const score = game.map.id * 10 + game.player.data.count;
    buffer.drawText(
        0,
        23,
        'Final Score: #{gold}' + score,
        'white',
        -1,
        80,
        'center'
    );

    if (success) {
        buffer.drawText(0, 25, 'WINNER!', 'green', -1, 80, 'center');
    } else {
        buffer.drawText(0, 25, 'Try Again!', 'red', -1, 80, 'center');
    }

    buffer.drawText(
        0,
        30,
        '[Press any key to start over]',
        'gray',
        -1,
        80,
        'center'
    );
    buffer.render();

    await layer.io.nextKeyOrClick();

    layer.finish();
}
