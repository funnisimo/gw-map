# Step 5 - Game UI

Lets add a better user interface as well as multiple levels to the game.

## Ananas Item

Instead of searching for the Ananas to win the level, lets change it so that you win the level if you collect all of the Ananas.

That means getting rid of our boxes (`EMPTY_BOX`, `FULL_BOX`) and replacing them with just a plain old `ANANAS`. The Ananas checks to see if you have them all when you pick it up. If you do, then it starts the next level for you.

```js
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
```

We are limiting the game to 5 levels. If you get every Ananas on the last level, then we end the game with you as a winner.

Because we only have one type of item, the `addRandomBox` function changes accordingly:

```js
function addRandomBox(map) {
    const item = GWM.item.make('ANANAS');
    // ...
    // rest of fn
    // ...
}
```

And update where we call it...

```js
// in: makeMap()

// Add boxes randomly
for (let c = 0; c < 8; ++c) {
    addRandomBox(map);
}

map.data.count = map.items.length;
```

## Starting a new Level

Whenever a new level starts, the `startMap` function is called. Lets make ours give a little welcome message:

```js
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
```

Notice that every time we start a map, we change Pedro's speed. Toward the end of the game Pedro is faster than the player. That raises the challenge level.

When the game ends we also show a score based on how far you get:

```js
/// in showGameOver

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
```

## Game UI

We are going to enable the UI features in the GW Game object. This will turn on the message display, the tile info display (flavor), and the sidebar.

```js
GAME = new GWM.game.Game({
    // add these after the div: 'game' line.
    mouse: true,
    messages: true, // bottom
    flavor: true,
    sidebar: true,
    //
});
```

The other major change is to add the display of the current level and collected Ananas count to the sidebar. To do this, we override the `drawSidebar` method in the Player object:

```js
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
```

Then, we use our custom class when installing the Hero:

```js
GWM.player.install(
    'HERO',
    new MyHero({
        name: 'Hero',
        stats: { health: 10 },
        sidebarFg: 'green',

        // these are actions that I am performing
        actions: {
            // ... attack
        },
    })
);
```

That should do it.

## Next

Ok, lets run it: [Ananas de Caracas: Step 5](tutorial/step05)

Next, we will add some stairs and update the level progression. To do that, go to [Step 6](#tutorial/step06).
