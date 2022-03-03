# Step 6 - Multiple Levels

Until now, our Hero has started every level by being magically plunked down in the middle of the map. After collecting all of the Ananas on the level, the map would dissolve and the Hero would be plunked down in the middle of a new map.

Lets change this so that whenever the last Ananas is picked up, a portal opens up that will take the player to the next level. When the Hero climbs through the portal, they start on the next level at a point very near the spot they started to climb. This gives the levels some spatial relationship that makes it more like climbing a tower.

## Generating Pedro and Ananas

We need to make a slight change to the way we place Pedro and the Ananas. Our implementation to this point has been built around the player always being started in the center of the map. Now that we are going to move to a random location on the map, we need to reflect that in the placement code for both.

Maps have a collection of locations that they store. These allow names to be associated with positions on the map. There are 4 standard names that the map generation will set -- up, down, start, end.

Lets use these to make generic item and actor placement functions:

```js
function addItem(map, kind = 'ANANAS') {
    const start = map.locations.start;
    const item = GWM.item.make(kind);

    const loc = GWU.random.matchingLoc(map.width, map.height, (x, y) => {
        if (item.avoidsCell(map.cell(x, y))) return false;
        if (GWU.xy.distanceBetween(x, y, start[0], start[1]) < 15) return false;

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

function addActor(map, kind = 'PEDRO') {
    const start = map.locations.start;
    const end = map.locations.end;

    const pedro = GWM.actor.make(kind);

    const loc = GWU.random.matchingLoc(map.width, map.height, (x, y) => {
        if (pedro.avoidsCell(map.cell(x, y))) return false;

        // closer to start than finish - nope
        if (
            GWU.xy.distanceBetween(x, y, start[0], start[1]) <
            GWU.xy.distanceBetween(x, y, end[0], end[1])
        ) {
            return false;
        }
        return true;
    });
    map.addActorNear(loc[0], loc[1], pedro);
}
```

## Tiles

To start, we are going to use some custom tiles. These tiles are going to represent the following:

-   ENTRANCE - The portal the player just came through. It will be locked as the player passes through so that the Hero has to focus on the new map.
-   INACTIVE_EXIT - Each map will have an inactive exit on it. This tile will be replaced with an active exit whenever the last Ananas is picked up. The inactive exit does nothing.
-   EXIT - This is the exit that the Hero can use to climb to the next level.
-   FINAL_EXIT - This is the exit on the last map. When the Hero climbs through it, the game will end.

Here is the code for adding our tiles:

```js
GWM.tile.install('ENTRANCE', {
    extends: 'DOWN_STAIRS',
    ch: '\u2229',
    fg: 'gray',
    flags: 'L_BLOCKS_MOVE',
    flavor: 'the entrance gate',
    name: 'Blocked Gate',
});

GWM.tile.install('INACTIVE_EXIT', {
    extends: 'UP_STAIRS',
    ch: '\u2229',
    fg: 'gray',
    flags: 'L_BLOCKS_MOVE',
    flavor: 'the blocked exit gate',
    name: 'Blocked Exit',
});

GWM.tile.install('EXIT', {
    extends: 'UP_STAIRS',
    ch: '\u2229',
    fg: 'green',
    flags: 'L_BRIGHT_MEMORY',
    flavor: 'the exit gate',
    name: 'Exit Gate',
});

GWM.tile.install('FINAL_EXIT', {
    extends: 'UP_STAIRS',
    ch: '\u2229',
    fg: 'green',
    flags: 'L_BRIGHT_MEMORY',
    flavor: 'the exit gate',
    name: 'Exit Gate',
    actions: {
        climb(game, player) {
            game.finish(true);
            return player.endTurn();
        },
    },
});
```

Notice the climb action in the FINAL_EXIT tile. This overrides the default behavior for UP_STAIRS and will end the game.

## Map Generation

As we switch from a series of independent maps to a connected tower experience, we need to change the way we generate maps. Most importantly, we need to manage the locations of the stairs for our floors. gw-dig has a class that does that for us. To use it, we will add a start function to our game:

```js
        start() {
            const seed = GWU.random.number();
            console.log('seed = ', seed);
            // GWU.random.seed(seed);

            const dungeon = new GWD.Dungeon({
                levels: 5,
                goesUp: true,
                width: this.width,
                height: this.height,

                startTile: 'ENTRANCE',

                seed,
                loops: { minDistance: 30, maxLength: 4 },
                lakes: 10,
                stairs: {
                    upTile: 'INACTIVE_EXIT',
                    downTile: 'ENTRANCE',
                },
            });

            this.dungeon = dungeon;
        },
```

This function is run at the start of the game. It configures a Dungeon object that will handle the stair locations and map generation for our floors. Notice that we are using our entrance and exit tiles for the stairs.

To use the dungeon to generate maps, we change the makeMap function slightly:

```js
        makeMap(id) {
            const map = GWM.map.make(this.width, this.height, {
                fov: true,
            });
            this.dungeon.getLevel(id, map);

            // Add boxes randomly
            for (let c = 0; c < 8; ++c) {
                addRandomBox(map);
            }
            map.data.count = map.items.length;

            // create and add Pedros
            addPedro(map);
            addPedro(map);

            return map;
        },

```

Here, we just get the level from the dungeon instead of generating it ourselves.

We also need to add a way for the Hero to climb the tower. To do that, we add a key binding for the climb acton:

```js
        keymap: {
            dir: 'moveDir',
            ' ': 'pickup',
            q() {
                GAME.finish(false);
            },
            '>': 'climb',
        },
```

That should do it.

## Next

Ok, lets run it: [Ananas de Caracas: Step 6](tutorial/step06)

Next, we will turn it into a hack and slash tower runner. To do that, go to [Step 7](#tutorial/step07).
