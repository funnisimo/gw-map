async function start() {
    // create the user interface
    GAME = new GWM.game.Game({
        width: 80,
        height: 40,
        div: 'game',

        makeMap() {
            const seed = GWU.random.number();
            console.log('seed = ', seed);
            // GWU.random.seed(seed);

            const map = GWM.map.make(this.width, this.height, 'FLOOR', 'WALL');
            GWD.digMap(map, { stairs: false, seed });

            return map;
        },

        makePlayer() {
            const PLAYER = GWM.player.make({ name: 'Hero' });
            return PLAYER;
        },

        startMap(map, player) {
            // create and add the player
            map.addActorNear(
                Math.floor(map.width / 2),
                Math.floor(map.height / 2),
                player
            );
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
        26,
        'Use the #{green arrow keys} to move around.',
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
