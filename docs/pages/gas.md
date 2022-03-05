## Gas Tiles

Gas tiles are just tiles like Ground and Surface tiles, except that by default they will spread around the map on the map timer. This spreading allows them to behave like real gasses would.

The way that you add them to the map is to use **setTile** just like a normal tile, except that you provide a **volume** value as well as the tile ID. The **volume** is the approximate number of cells that you want the gas to seep into.

### Gasses

Here is an example that shows the gas being deployed.

```js
GWM.tile.install('SWAMP_GAS', {
    depth: 'GAS',
    bg: 'dark_green',
    priority: 25,
    dissipate: 0,
});

const map = GWM.map.make(20, 20, {
    tile: 'FLOOR',
    boundary: 'WALL',
});
GWM.layer.gas(map);

const app = GWU.app.make({
    font: 'monospace',
    width: map.width,
    height: map.height,
    loop: LOOP,
});
const buffer = app.buffer;
SHOW(app);

app.on('click', (e) => {
    map.setTile(e.x, e.y, 'SWAMP_GAS', {
        volume: GWU.random.range(30, 150),
    });
});

app.repeat(250, () => {
    map.tick();
});

app.on('draw', () => {
    map.drawInto(buffer);
    // buffer.render();
});
```

Here is a gas example with a faster dissipation.

```js
GWM.tile.install('SWAMP_GAS2', {
    depth: 'GAS',
    bg: 'dark_green',
    priority: 25,
    dissipate: 20 * 100, // 20%
});

const map = GWM.map.make(20, 20, {
    tile: 'FLOOR',
    boundary: 'WALL',
});
GWM.layer.gas(map);

const app = GWU.app.make({
    font: 'monospace',
    width: map.width,
    height: map.height,
    loop: LOOP,
});
const buffer = app.buffer;
SHOW(app);

app.on('click', (e) => {
    map.setTile(e.x, e.y, 'SWAMP_GAS2', {
        volume: GWU.random.range(30, 150),
    });
});

app.repeat(250, () => {
    map.tick();
});

app.on('draw', () => {
    map.drawInto(buffer);
    // buffer.render();
});
```
