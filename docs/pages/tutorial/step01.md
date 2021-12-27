# Step 1 - Basic Map and Moving Around

The tutorial starts with getting a basic game up and going. For the tutorial, that will involve a Welcome screen followed by playing the game and them a Game Over screen. After that, you will restart at the Welcome screen.

## HTML

Since we are creating an HTML game, lets start with the HTML. Here is the basic HTML to use:

```html
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8" />
        <title>Ananas au Caracas - Example</title>

        <script src="../../js/gw-utils.js"></script>
        <script src="../../js/gw-map.js"></script>
        <script src="../../js/gw-dig.js"></script>
        <script src="./game.js"></script>
    </head>
    <body>
        <div id="game"></div>
    </body>
</html>
```

Obviously you will use different paths for the various Goblinwerks scripts. You might even want to load them from a CDN like [JSDelivr](https://www.jsdelivr.com/package/npm/gw-utils).

This is a very basic HTML file. It pulls in our 3 libraries and loads our `game.js` file. The `div` is where our game canvas will go.

Now lets look at our game code.

## Game.js

The Basic game file runs a start function when the body loads. This function creates our environment (UI) and then runs a loop that handles the various screens (Welcome, Game, Game Over). Pretty simple.

```js
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
```

The UI will create the canvas and attach it to the diven div. The canvas will be 80 characters wide by 40 lines tall. It will use the default monospace font and will attach the appropriate event handlers so that IO will work (mouse, keyboard).

Then we have a loop that shows our various screens.

### showTitle

```js
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
```

This function starts by creating a new Layer that we will draw on. The Layer has a buffer object that is where the drawing occurs. First we fill it with all black (0), then draw various texts onto it and render it to the canvas. Next we wait for the player to press a key or click the mouse. Then we close the layer (finish).

There are more drawing functions in the buffer and more IO handling functions in the layer.io handler for you to use. This is just a very basic screen.

### showGameOver

The GameOver screen is pretty much the same as the Welcome screen. It just accepts a parameter that is the game results.

```js
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
```

### showGame

The game uses the Goblinwerks Game object to run the game. There is a little bit of setup that we have to do first.

```js
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
```

The Game is managed by a Game object that we create. It uses the UI that we have and gets a couple of functions:

-   ui: The UI
-   makeMap: a function that returns the map to use. In our case, we are creating a blank map and then digging a default dungeon floor - without stairs or lakes.
-   makePlayer: a function that creates and returns our Hero object.
-   startMap: a function that is given the map that is about to start and the Hero. The function needs to place the Hero in the correct place.
-   keymap: This is the map of keys that the game will respond to. The map is from the key combination (e.g. 'Q') to either the name of a standard command or a command function. Our 'Q' handler just finishes the game as a winner.

Once we setup the game, all we have to do is to start it. Thats's it.

## Summary

Ok, lets run it: [Ananas de Caracas: Step 1](tutorial/step01)

Next we will give our Hero something to do! To do that, go to [Step 2](#tutorial/step02).
