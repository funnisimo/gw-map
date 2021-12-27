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
        fg: 'green',

        actions: {
            async pickup(game, actor, item) {
                await game.ui.alert('You found the ΩgoldΩAnanas∆!');
                game.map.removeItem(item);
                game.finish(true); // game over!
                return actor.endTurn(); // handled
            },
        },
    })
);

function addRandomBox(map, hasAnanas) {
    const item = GWM.item.make(hasAnanas ? 'FULL_BOX' : 'EMPTY_BOX');

    const loc = GWU.random.matchingLoc(80, 40, (x, y) => {
        if (item.avoidsCell(map.cell(x, y))) return false;
        if (GWU.xy.distanceBetween(x, y, 40, 20) < 15) return false;

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
        async attack(game, pedro) {
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

        makeMap() {
            const seed = GWU.random.number();
            console.log('seed = ', seed);
            // GWU.random.seed(seed);

            const map = GWM.map.make(80, 40, 'FLOOR', 'WALL');
            GWD.digMap(map, { stairs: false, seed });

            // Add boxes randomly
            for (let c = 0; c < 8; ++c) {
                addRandomBox(map, false);
            }
            addRandomBox(map, true);

            // create and add Pedro
            PEDRO = GWM.actor.make('PEDRO');
            map.addActorNear(0, 0, PEDRO);

            return map;
        },

        makePlayer() {
            PLAYER = GWM.player.make('HERO');
            return PLAYER;
        },

        startMap(map, player) {
            // create and add the player
            map.addActorNear(40, 20, player);
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
