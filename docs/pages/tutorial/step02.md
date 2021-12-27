# Step 2 - Box Hunting

Step 1 was a good start, but now, lets give ourselves something to do. We are going to add some boxes that we have to go around and open, looking for the magic box that has the Ananas de Caracas in it.

### Installing Box Kinds

Every object in Goblinwerks is represented by an object kind that is registered ahead of time. For our game, we are going to have these:

-   Empty Box : A box that conatins nothing - keep looking!
-   Full Box : A box that has the Ananas in it - you win!

Lets start with the Empty Box. Here is how we install it:

```js
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
```

The installation function takes the ID of the item kind and the ItemKind object. Our Item Kind sets the following fields:

-   name : The name of the item that will be shown in the UI (when we add more to it later)
-   ch: The character/glyph that will be drawn for this item
-   fg: The foreground color of the character/glyph
-   actions: An object with any custom object handling functions:
    -   pickup : This function taks a game object, the actor who is looking in our box, and our box object. It shows an alert to the player that they are opening an empty box, then it removes the box from the map and ends the player turn.

That's it for an empty box. Now lets see how the winning box differs:

```js
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
```

The full box only really differs in what happens when it is opened. (I change the color of the box as well to make testing easier). In this pickup, we show a different message (Winner!), remove the item, finish the game, and end the player turn.

The big thing is that we finish the game when opening this box. That will cause the game loop to exit and will return the value that we pass into the finish function as the result.

### Placing our boxes

We are going to randomly place our boxes around the map. To make that easier, lets create a helper funciton:

```js
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
```

First, we create our item - either a full box or an empty one.

Then we find a suitable location to put our new box. This involves looking for a random location that works for the item (!avoidsCell), and is not close to the Hero (the first distance check) and is not close to the other boxes (the second distance check).

Last we add the item there.

Now, lets update our Game's `makeMap` function to place some boxes:

```js
        makeMap() {
            const map = GWM.map.make(80, 40);
            GWD.digMap(map, { stairs: false });

            // Add boxes randomly
            for (let c = 0; c < 8; ++c) {
                addRandomBox(map, false);
            }
            addRandomBox(map, true);

            return map;
        },
```

The only difference from step 1 is that we place 8 empty boxes and one winning box.

Now, we need to allow our player to look into the boxes. To do that we add a key for checking in a box - lets use SPACE. That means we update the keymap of the game:

```js
        keymap: {
            dir: 'moveDir',
            ' ': 'pickup',
            Q() {
                GAME.finish(true);
            },
        },
```

That's it!

## Summary

Ok, lets run it: [Ananas de Caracas: Step 2](tutorial/step02)

Next we will give our Hero something to avoid! To do that, go to [Step 3](#tutorial/step03).
