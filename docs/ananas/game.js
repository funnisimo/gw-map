var GAME;

GWM.item.install(
    'EMPTY_BOX',
    new GWM.item.ItemKind({
        ch: '*',
        fg: 'gold',

        name: 'Box',

        actions: {
            async pickup(actor, opts) {
                if (!opts.item) {
                    throw new Error('Invalid action - item required!');
                }
                await this.ui.alert('Empty!'); // this === GAME
                this.map.removeItem(opts.item);
                return false;
            },
        },
    })
);

GWM.item.install(
    'FULL_BOX',
    new GWM.item.ItemKind({
        ch: '*',
        fg: 'green',

        name: 'Box',

        actions: {
            async pickup(actor, opts) {
                if (!opts.item) {
                    throw new Error('Inavlid action - item required.');
                }
                await this.ui.alert('You found the ΩgoldΩAnanas∆!');
                this.map.removeItem(opts.item);
                this.finish(true);
                return false;
            },
        },
    })
);

function addBox(map, hasAnanas) {
    const loc = GWU.random.matchingLoc(80, 40, (x, y) => {
        if (map.hasEntityFlag(x, y, GWM.flags.Entity.L_BLOCKS_MOVE))
            return false;
        return GWU.xy.distanceBetween(x, y, 40, 20) > 15;
    });
    const item = GWM.item.make(hasAnanas ? 'FULL_BOX' : 'EMPTY_BOX');
    map.addItemNear(loc[0], loc[1], item);
}

async function start() {
    // create the user interface
    GAME = new GWM.game.Game({
        width: 80,
        height: 40,
        div: 'game',

        makeMap() {
            const map = GWM.map.make(80, 40, 'FLOOR', 'WALL');
            GWD.digMap(map, { stairs: false });

            // Add boxes randomly
            for (let c = 0; c < 8; ++c) {
                addBox(map, false);
            }
            addBox(map, true);

            return map;
        },

        makePlayer() {
            return GWM.player.make({ name: 'Hero', stats: { health: 10 } });
        },

        startMap(map, player) {
            // create and add the player
            map.addActorNear(40, 20, player);
        },

        keymap: {
            dir: 'moveDir',
            ' ': 'pickup',
            Q() {
                this.finish();
            },
        },
    });

    while (true) {
        await showTitle(GAME);
        await playGame(GAME);
        await showGameOver(GAME);
    }
}

async function showTitle(game) {
    const layer = new GWU.ui.Layer(game.ui);
    const buffer = layer.buffer;

    buffer.fill(0);
    buffer.drawText(0, 20, 'Ananas de Caracas', 'yellow', -1, 80, 'center');
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

async function showGameOver(game) {
    const layer = new GWU.ui.Layer(game.ui);

    const buffer = layer.buffer;

    buffer.fill(0);
    buffer.drawText(0, 20, 'GAME OVER', 'yellow', -1, 80, 'center');
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
