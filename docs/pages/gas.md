## Gas and Liquid Tiles

Gas and Liquid tiles are just tiles like Ground and Surface tiles, except that by default they will spread around the map on the map timer. This spreading allows them to behave like real gasses and liquids would.

The way that you add either to the map is to use **setTile** just like a normal tile, except that you provide a **volume** value as well as the tile ID. The **volume** is the approximate number of cells that you want the liquid/gas to seep into.

### Liquids

Here is an example. Click on any square to add between 3 and 11 volume of slime to the map. The slime will not dissipate, so you can see the effects of adding more volume into the same place.

```js
GW.tile.install('SLIME', {
    layer: 'LIQUID',
    bg: 'dark_green',
    priority: 25,
    dissipate: 0,
});

const map = GW.map.make(20, 20, {
    tile: 'FLOOR',
    wall: 'WALL',
});
const canvas = GW.canvas.make(map.width, map.height, {
    font: 'monospace',
    loop: LOOP,
});
const buffer = canvas.buffer;
SHOW(canvas.node);

LOOP.run(
    {
        click: async (e) => {
            await map.setTile(e.x, e.y, 'SLIME', GW.random.range(3, 11));
        },
        tick: async (e) => {
            await map.tick();
        },
        draw: () => {
            map.drawInto(buffer);
            buffer.render();
        },
    },
    500
);
```

This is the same example, but with the slime dissipating at 20% per turn (the default).

```js
GW.tile.install('SLIME2', {
    layer: 'LIQUID',
    bg: 'dark_green',
    priority: 25,
});

SHOW(GW.tiles.SLIME2.dissipate);

const map = GW.map.make(20, 20, {
    tile: 'FLOOR',
    wall: 'WALL',
});
const canvas = GW.canvas.make({
    font: 'monospace',
    width: map.width,
    height: map.height,
    loop: LOOP,
});
const buffer = canvas.buffer;
SHOW(canvas.node);

LOOP.run(
    {
        click: async (e) => {
            await map.setTile(e.x, e.y, 'SLIME2', GW.random.range(3, 11));
        },
        tick: async (e) => {
            await map.tick();
        },
        draw: () => {
            map.drawInto(buffer);
            buffer.render();
        },
    },
    500
);
```

Sometimes you will see cells of slime that hang out for a long time before going away. That is just a feature of using random numbers and chance to control the slime dissipation.

### Gasses

Gasses spread through the map a little differently than liquids. Liquids push out from places of high concentration to places of low concentration. Gasses pull from areas of low concentration. The difference can best be seen by the way that gasses that do not dissipate will dance around the map.

Here is an example that shows the gas being deployed.

```js
GW.tile.install('SWAMP_GAS', {
    layer: 'GAS',
    bg: 'dark_green',
    priority: 25,
    dissipate: 0,
});

const map = GW.map.make(20, 20, {
    tile: 'FLOOR',
    wall: 'WALL',
});
const canvas = GW.canvas.make({
    font: 'monospace',
    width: map.width,
    height: map.height,
    loop: LOOP,
});
const buffer = canvas.buffer;
SHOW(canvas.node);

LOOP.run(
    {
        click: async (e) => {
            await map.setTile(e.x, e.y, 'SWAMP_GAS', GW.random.range(30, 50));
        },
        tick: async (e) => {
            await map.tick();
        },
        draw: () => {
            map.drawInto(buffer);
            buffer.render();
        },
    },
    500
);
```

Here is a gas example with dissipate.

```js
GW.tile.install('SWAMP_GAS2', {
    layer: 'GAS',
    bg: 'dark_green',
    priority: 25,
    dissipate: 20 * 100, // 20%
});

const map = GW.map.make(20, 20, {
    tile: 'FLOOR',
    wall: 'WALL',
});
const canvas = GW.canvas.make({
    font: 'monospace',
    width: map.width,
    height: map.height,
    loop: LOOP,
});
const buffer = canvas.buffer;
SHOW(canvas.node);

LOOP.run(
    {
        click: async (e) => {
            await map.setTile(e.x, e.y, 'SWAMP_GAS2', GW.random.range(30, 50));
        },
        tick: async (e) => {
            await map.tick();
        },
        draw: () => {
            map.drawInto(buffer);
            buffer.render();
        },
    },
    500
);
```

### Customization

These behaviors of how the liquids and gasses spread may not be what you are interested in. That's OK. You can customize the gas and liquid spreading logic on a per map basis. You can customize the logic in one of two ways:

-   Create a Map subclass and overrride **updateGas** and/or **updateLiquid**.
-   Provide custom **updateGas** and/or **updateLiquid** methods in the configuration options when you make/create the map.

Either of these will work fine. You just need to make sure that you follow the rules for these customizations:

1 - You will receive a **NumGrid** with the current volume of liquid or gas in each cell. This is after any dissipation that needs to occur in this turn.
2 - You will return that grid updated with whatever changes you want to make.
3 - If you add volume to a cell that does not have any volume in the original grid, then you need to set the appropriate tile in the map. You can set it with any volume (The defaults use: this.setTile(x, y, id, 0)) because the volume will be corrected later.

These functions are called on every tick of the map.

Also note, that if the map does not have any gas/liquid, then these funcitons are not called.
