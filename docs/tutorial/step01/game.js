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

async function showWelcome(ui) {
    const layer = new GWU.ui.Layer(ui);
    const buffer = layer.buffer;

    buffer.fill(0);
    buffer.drawText(0, 20, 'Ananas de Caracas', 'yellow', -1, 80, 'center');

    buffer.drawText(
        0,
        25,
        'Use the ARROW keys to move around.',
        'white',
        -1,
        80,
        'center'
    );
    buffer.drawText(0, 26, 'Press "Q" to quit.', 'white', -1, 80, 'center');

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

async function playGame(ui) {
    // create and dig the map
    const GAME = new GWM.game.Game({
        ui,

        makeMap() {
            const map = GWM.map.make(80, 40);
            GWD.digMap(map, { stairs: false, lakes: false });
            return map;
        },

        makePlayer() {
            const PLAYER = GWM.player.make({ name: 'Hero' });
            return PLAYER;
        },

        startMap(map, player) {
            map.addActorNear(40, 20, player);
        },

        keymap: {
            dir: 'moveDir',
            Q() {
                GAME.finish(true);
            },
        },
    });

    return GAME.start();
}

async function showGameOver(ui, success) {
    const layer = new GWU.ui.Layer(ui);

    const buffer = layer.buffer;

    buffer.fill(0);
    buffer.drawText(0, 20, 'GAME OVER', 'yellow', -1, 80, 'center');

    if (success) {
        buffer.drawText(0, 25, 'WINNER!', 'green', -1, 80, 'center');
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
