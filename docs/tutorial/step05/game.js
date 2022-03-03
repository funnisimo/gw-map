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
                '{{you}} {{verb pick[s]}} up {{an item}}.',
                {
                    actor,
                    item,
                }
            );

            actor.data.count += 1;
            game.sidebar.needsDraw = true;
            if (game.map.items.length === 0) {
                await game.ui.alert('You found them all!');
                await game.ui.fadeTo('black', 1000);
                if (game.map.id === 5) {
                    game.finish(true); // game over!
                } else {
                    game.startNewMap(game.map.id + 1);
                }
            }
            return actor.endTurn(); // handled
        },
    },
});

function addRandomBox(map) {
    const item = GWM.item.make('ANANAS');

    const centerX = Math.floor(map.width / 2);
    const centerY = Math.floor(map.height / 2);
    const loc = GWU.random.matchingLoc(map.width, map.height, (x, y) => {
        if (item.avoidsCell(map.cell(x, y))) return false;
        if (GWU.xy.distanceBetween(x, y, centerX, centerY) < 15) return false;

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

        makeMap() {
            const seed = GWU.random.number();
            console.log('seed = ', seed);
            // GWU.random.seed(seed);

            const map = GWM.map.make(this.width, this.height, {
                tile: 'FLOOR',
                boundary: 'WALL',
                fov: true,
            });

            GWD.digMap(map, {
                stairs: false,
                seed,
                loops: { minDistance: 30, maxLength: 4 },
                lakes: 10,
            });

            // Add boxes randomly
            for (let c = 0; c < 8; ++c) {
                addRandomBox(map);
            }
            map.data.count = map.items.length;

            // create and add Pedro
            const PEDRO = GWM.actor.make('PEDRO');
            map.addActorNear(0, 0, PEDRO);

            const PEDRO2 = GWM.actor.make('PEDRO');
            map.addActorNear(this.width - 1, this.height - 1, PEDRO2);

            map.locations.start = [
                Math.floor(map.width / 2),
                Math.floor(map.height / 2),
            ];

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
