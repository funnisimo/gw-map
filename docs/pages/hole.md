## Effects - Creating a chasm hole

Sometimes you might want to create a feature in the map that has a hole. A hole is just a group of tiles that will automatically drop you to the next level. To make it more obvious to the player that there is a hole there you might want to place an edge around the hole that is visually noticible. And to top it all off, you might want to place something interesting floating in the chasm - like a pressure plate that you can press to open a door somewhere.

All of this can be done with tile effects. Here is how...

## 1 - Pressure Plate

Let's start with a pressure plate. This is just a tile that will activate the machine that it is in when something enters it. For our example, we will show a hidden tile when you click on the pressure plate.

```js
const plate = GWM.tile.install('PRESSURE_PLATE', {
    extends: 'FLOOR',
    priority: '+10',
    ch: '^',
    flags: 'T_IS_TRAP',
    effects: {
        enter: { activateMachine: true, message: 'the pressure plate clicks.' },
    },
});

const sign = GWM.tile.install('SIGNPOST', {
    extends: 'FLOOR',
    priority: '+1',
    ch: '!',
    fg: 0x00f,
    bg: 0x888,
    flavor: 'Welcome!',
    effects: {
        tick: { chance: 20 * 100, tile: 'HIDDEN_SIGN' },
    },
});

const hidden = GWM.tile.install('HIDDEN_SIGN', {
    extends: 'FLOOR',
    priority: '+10',
    effects: {
        machine: { tile: 'SIGNPOST', flags: 'E_SUPERPRIORITY' },
    },
});

const map = GWM.map.make(21, 21, 'FLOOR', 'WALL');

map.setTile(10, 10, 'PRESSURE_PLATE', { machine: 1 });
map.setTile(10, 15, 'HIDDEN_SIGN', { machine: 1 });

const canvas = GWU.canvas.make({
    font: 'monospace',
    width: map.width,
    height: map.height,
    loop: LOOP,
});
map.drawInto(canvas);
SHOW(canvas.node);
canvas.render();

LOOP.run(
    {
        click: async (e) => {
            await map.fire('enter', e.x, e.y);
        },
        tick: async (e) => {
            await map.tick();
        },
        draw: () => {
            map.drawInto(canvas);
            canvas.render();
        },
    },
    500
);
```

## 2 - Hole

Lets place a chasm in the map. This is a tile that will automatically make entities fall to the next level if they enter it.

```js
const edge = GWM.tile.install('CHASM', {
    extends: 'FLOOR',
    priority: '+2',
    ch: ' ',
    flavor: 'a chasm',
    flags: 'T_AUTO_DESCENT',
});

const effect = GWM.effect.make({ tile: 'CHASM,100' });

const map = GWM.map.make(21, 21, 'FLOOR', 'WALL');

const canvas = GWU.canvas.make({
    font: 'monospace',
    width: map.width,
    height: map.height,
    loop: LOOP,
});
SHOW(canvas.node);

LOOP.run({
    async start() {
        await GWM.effect.fire(effect, map, 11, 11);
    },
    draw() {
        map.drawInto(canvas);
        canvas.render();
    },
});
```

## 3 - Hole Edge

Around the edge of our hole, we want to place a tile that will make it visually clear that you are at the precipice of falling into a void. This tile needs to have higher priority than the floor, but lower than the hole.

```js
const edge = GWM.tile.install('CHASM_EDGE', {
    extends: 'FLOOR',
    priority: '+1',
    ch: ':',
    fg: 0x777,
    flavor: 'a chasm edge',
});

GWM.effect.install('CHASM_EDGE', { tile: 'CHASM_EDGE,100' });

const map = GWM.map.make(21, 21, 'FLOOR', 'WALL');

map.setTile(11, 11, 'CHASM');

const canvas = GWU.canvas.make({
    font: 'monospace',
    width: map.width,
    height: map.height,
    loop: LOOP,
});
SHOW(canvas.node);

GWM.effect.fireSync('CHASM_EDGE', map, 11, 11);
map.drawInto(canvas);
canvas.render();
```

## 4 - Make the hole larger

Now, we need to place a large hole and surround it with edge tiles...

```js
GWM.effect.install('CHASM_MEDIUM', {
    tile: 'CHASM,150,50',
    flags: 'E_NEXT_EVERYWHERE',
    next: 'CHASM_EDGE',
});

const map = GWM.map.make(21, 21, 'FLOOR', 'WALL');

const canvas = GWU.canvas.make({
    font: 'monospace',
    width: map.width,
    height: map.height,
    loop: LOOP,
});
SHOW(canvas.node);

GWM.effect.fireSync('CHASM_MEDIUM', map, 11, 11);
map.drawInto(canvas);
canvas.render();
```

## 5 - Add the pressure plate

So lets put it all together by adding a hidden sign and then running an effect that places a pressure plate and surrounds it with a medium chasm that has an edge.

Click on the plate to show the hidden sign.

```js
GWM.effect.install('HOLE_WITH_PLATE', {
    tile: 'PRESSURE_PLATE',
    flags: 'E_NEXT_ALWAYS',
    next: 'CHASM_MEDIUM',
});

const map = GWM.map.make(21, 21, 'FLOOR', 'WALL');

map.setTile(5, 5, 'HIDDEN_SIGN', { machine: 1 });
GWM.effect.fireSync('HOLE_WITH_PLATE', map, 11, 11, {
    machine: 1,
});

const canvas = GWU.canvas.make({
    font: 'monospace',
    width: map.width,
    height: map.height,
    loop: LOOP,
});
SHOW(canvas.node);

LOOP.run(
    {
        click: async (e) => {
            await map.fire('enter', e.x, e.y);
        },
        tick: async (e) => {
            await map.tick();
        },
        draw() {
            map.drawInto(canvas);
            canvas.render();
        },
    },
    500
);
```
