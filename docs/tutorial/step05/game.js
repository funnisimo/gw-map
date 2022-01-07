GWM.item.install(
    'EMPTY_BOX',
    new GWM.item.ItemKind({
        name: 'Box',
        ch: '*',
        fg: 'gold',

        actions: {
            async pickup(game, actor, item) {
                await game.ui.alert('Empty!'); // this === GAME
                game.map.removeItem(item);
                return actor.endTurn(); // handled
            },
        },
    })
);

GWM.item.install(
    'FULL_BOX',
    new GWM.item.ItemKind({
        name: 'Box',
        ch: '*',
        fg: 'yellow',

        actions: {
            async pickup(game, actor, item) {
                await game.ui.alert('You found the #{gold Ananas}!');
                game.map.removeItem(item);
                game.finish(true); // game over!
                return actor.endTurn(); // handled
            },
        },
    })
);

function addRandomBox(map, hasAnanas) {
    const item = GWM.item.make(hasAnanas ? 'FULL_BOX' : 'EMPTY_BOX');

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

async function start() {
    // create the user interface
    const UI = new GWU.ui.UI({
        width: 80,
        height: 40,
        div: 'game',
    });

    while (true) {
        await showWelcome(UI);
        const success = await playGame(UI);
        await showGameOver(UI, success);
    }
}

window.onload = start;

GWM.player.install('HERO', {
    name: 'Hero',
    stats: { health: 10 },

    // these are actions that I am performing
    actions: {
        // async pickup(game, actor) {
        //     const item = game.map.itemAt(actor.x, actor.y);
        //     if (!item) {
        //         await game.ui.alert('No box here.');
        //         return actor.endTurn(); // handled
        //     }
        //     return 0; // no action taken
        // },
        async attack(game, hero) {
            await game.ui.alert('You should not have run into me, you thief!');
            game.finish(false);
            return -1;
        },
    },
});

GWM.actor.install('PEDRO', {
    name: 'Pedro',
    ch: 'P',
    fg: 'red',
    ai: { wander: true },

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
        messages: { size: -4 }, // bottom
        flavor: true,

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
                addRandomBox(map, false);
            }
            addRandomBox(map, true);

            // create and add Pedro
            const PEDRO = GWM.actor.make('PEDRO');
            map.addActorNear(0, 0, PEDRO);

            const PEDRO2 = GWM.actor.make('PEDRO');
            map.addActorNear(this.width - 1, this.height - 1, PEDRO2);

            return map;
        },

        makePlayer() {
            PLAYER = GWM.player.make('HERO');
            return PLAYER;
        },

        startMap(map, player) {
            // create and add the player
            map.addActorNear(
                Math.floor(this.width / 2),
                Math.floor(this.height / 2),
                player
            );
            GWU.message.add('Welcome to Ananas de Caracas!');
        },

        keymap: {
            dir: 'moveDir',
            ' ': 'pickup',
            Q() {
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
        'Use the #{green ARROW keys} to move around.',
        'white',
        -1,
        80,
        'center'
    );
    buffer.drawText(
        0,
        27,
        'Press #{green SPACE} to open boxes.',
        'white',
        -1,
        80,
        'center'
    );
    buffer.drawText(
        0,
        28,
        'Press #{green Q} to quit.',
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

window.onload = start;
