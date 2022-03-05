## Waves

Waves on water are a fun way to showcase how effects can string together to create interactive maps.

Here we create a **WAVE** tile that when placed, will expand outward and replace itself with a **WAVE_DONE** tile. The **WAVE_DONE** tile will replace itself with a **LAKE** tile to reset the cycle.

Click on the map to start a wave. Notice how multiple waves will cancel each other out.

```js
GWM.tile.install('WAVE_DONE', {
    ch: '~',
    fg: 'teal',
    bg: 'blue',
    priority: 70,
    flags: 'T_DEEP_WATER',
    name: 'water',
    article: 'some',
    actions: {
        tick: { tile: '!+LAKE' },
    },
});

GWM.tile.install('WAVE', {
    ch: '^',
    fg: 'white',
    bg: 'blue',
    priority: 60,
    flags: 'T_DEEP_WATER',
    name: 'wave crest',
    article: 'the',
    actions: {
        tick: {
            spread: {
                actions: { tile: 'WAVE' },
                match: 'LAKE',
                grow: 100,
                decrement: 100,
            },
            tile: 'WAVE_DONE',
        },
    },
});

const map = GWM.map.make(20, 20, {
    tile: 'LAKE',
    boundary: 'WALL',
});
const app = GWU.app.make({
    width: map.width,
    height: map.height,
    loop: LOOP,
});
SHOW(app);

app.on('click', (e) => {
    map.setTile(e.x, e.y, 'WAVE');
});

app.repeat(500, () => {
    map.tick();
});

app.on('draw', () => {
    map.drawInto(app.buffer);
});
```
