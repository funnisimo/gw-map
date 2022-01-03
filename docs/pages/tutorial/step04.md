# Step 4 - FOV

Ok, it seems a bit unfair that Pedro wanders around looking for our Hero, but the Hero (you) get to see where he is all the time. This makes the cat and mouse game mostly uninteresting. If our Hero used the same rules as Pedro, then it might be a little more challenging. So lets turn on the Fog of War that many Roguelikes used called Field of View (FOV).

Also, we can turn on using the mouse to move around the game. Using this mode allows you to move the mouse around the map and see the path that your Hero will take to get to that point. The path limits itself to the already explored cells.

And while we are at it, lets add a second Pedro. This increases the challenge.

Sounds good? Great.

Lets add them in reverse order...

## Second Pedro

The second Pedro is pretty easy. In makeMap just create and add another. The second one will start at the bottom right of the map.

```js
// create and add Pedro
const PEDRO = GWM.actor.make('PEDRO');
map.addActorNear(0, 0, PEDRO);

const PEDRO2 = GWM.actor.make('PEDRO');
map.addActorNear(79, 39, PEDRO2);
```

Now there are 2 of them walking around. We could have created a separate actor kind for the second Pedro and thereby given another name to our nemesis. However, this was much easier, so we didn't.

Because there are two enemies now and we cannot do anything but evade them, lets add more evasion points into the map. By default only Hero's can swim. Other actors must be given that ability in their installation. So, if we increase the number of lakes in the map, we give the Hero an outlet that allows them to swim away from Pedro.

```js
GWD.digMap(map, {
    stairs: false,
    seed,
    loops: { minDistance: 30, maxLength: 4 },
    lakes: 10,
});
```

This adds more loops around the map and increased the attempts to place lakes. That means there is a lot more water on the map for the Hero to use to escape.

## Mouse

Turning on mouse support is very, very simple. Just add a configuration variable to the Game creation.

```js
GAME = new GWM.game.Game({
    width: 80,
    height: 40,
    div: 'game',

    mouse: true,

    // ...
});
```

That's all there is to it. Now you can use the mouse to move around. Notice that when you are following a path that the game plays fairly quickly. That is nice when you have long distances to travel across the board. Also, it should stop whenever you see Pedro to allow you to react.

### FOV

FOV is a setting that is handled at the map level. In a game where you have multiple maps, you may want different experiences on different maps. Maybe the town map is fully visible, but the dark tower is not. Anyway, when you create a map, if you want to turn on FOV calculation, you just set a field:

```js
const map = GWM.map.make(80, 40, {
    tile: 'FLOOR',
    boundary: 'WALL',
    fov: true,
});
```

This will automatically turn on FOV for the Hero. Under the hood, the game will calculate FOV all the time for our Hero. The setting on the map just turns it on for drawing the map.

## Summary

Ok, lets run it: [Ananas de Caracas: Step 4](tutorial/step04)

Next, we will add some GUI elements. To do that, go to [Step 5](#tutorial/step05).
