# Step 3 - Pedro

Let's add a farmer who wanders around the map. If he sees the Hero, he will chase them. When he catches the Hero, the game is over and the Hero loses. If the Hero finds the Ananas, then the game is over and the Hero loses.

## Meet Pedro

Adding an actor to the Goblinwerks framework is pretty simple. You have to install a new kind of actor and give that all the behavior information that you need. Lets look at how we are going to do that.

```js
GWM.actor.install('PEDRO', {
    name: 'Pedro',
    ch: 'P',
    fg: 'red',
    ai: {
        wander: true,
    },

    // these are actions that I am performing
    actions: {
        async attack(game, pedro) {
            await game.ui.alert('I got you, you nasty thief!');
            game.finish(false);
            return -1;
        },
    },
});
```

Here is what these fields tell us about Pedro:

-   name : The name of our actor (Pedro)
-   ch: The glyph that will show when Pedro is drawn
-   fg: The color of the glyph
-   ai: The parameters for the AI that Pedro will use.
    -   wander: Tells Pedro to wander when not doing anything else. By default, Pedro will attack the Hero when he notices them. Pedro will also use the default chasing setup to try to catch the Hero.
-   actions: The custom actions for Pedro to execute.
    -   attack: By default, when an actor bumps into another actor, they will attack them. This is a custom attack function for when Pedro attacks our hero. In it, we alert the player that we caught them and then end the game.

### Adding Pedro

Adding Pedro into the game is pretty easy as well. We just update the makeMap function.

```js
        makeMap() {
            const map = GWM.map.make(80, 40, 'FLOOR', 'WALL');
            GWD.digMap(map, { stairs: false, lakes: false });

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
```

That's it. Now, if you run the game you will see Pedro wanding around. Don't get too close to him because if he sees our Hero, then the chase is on! If Pedro bumps into the Hero, he will attack and that causes our Game Over code to execute.

### Player adjustments

We also need to handle the case where our Hero walks into Pedro. It is unlikely that this will be on purpose, because nobody likes to lose a game - especially a simple one like this one. However, lets put it there for completeness.

You will probably guess that this means we are adding a custom action to our player too. We are, but it just reverses the message to tell you that the Hero ran into Pedro - even though the Hero still loses.

```js
GWM.player.install('HERO', {
    name: 'Hero',

    actions: {
        async attack(game, hero) {
            await game.ui.alert('You should not have run into me, you thief!');
            game.finish(false);
            return -1;
        },
    },
});
```

We changed the file to install the Hero like we are installing Pedro. Then, in the makePlayer funciton we made a small adjustment.

```js
        makePlayer() {
            PLAYER = GWM.player.make('HERO');
            return PLAYER;
        },

```

Now we are ready.

## Summary

Ok, lets run it: [Ananas de Caracas: Step 3](tutorial/step03)

Next, we will add some mouse features into our game. To do that, go to [Step 4](#tutorial/step04).
