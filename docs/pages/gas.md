## Gas and Liquid Tiles

Gas and Liquid tiles are just tiles like Ground and Surface tiles, except that by default they will spread around the map on the map timer. This spreading allows them to behave like real gasses and liquids would.

The way that you add either to the map is to use **setTile** just like a normal tile, except that you provide a **volume** value as well as the tile ID. The **volume** is the approximate number of cells that you want the liquid/gas to seep into.

### Liquids

Here is an example. Click on any square to add between 3 and 11 volume of slime to the map. The slime will not dissipate, so you can see the effects of adding more volume into the same place.

```js
GW.tile.install("SLIME", {
  layer: "LIQUID",
  bg: "dark_green",
  priority: 25,
  dissipate: 0,
});

const map = GW.make.map(20, 20, {
  tile: "FLOOR",
  wall: "WALL",
});
const loop = GW.make.loop();
const canvas = GW.canvas.withFont({
  font: "monospace",
  width: map.width,
  height: map.height,
  io: LOOP,
});
map.drawInto(canvas);
SHOW(canvas.node);

LOOP.run(
  {
    click: async (e) => {
      await map.setTile(e.x, e.y, "SLIME", GW.random.range(3, 11));
      map.drawInto(canvas);
    },
    tick: async (e) => {
      await map.tick();
      map.drawInto(canvas);
    },
  },
  500
);
```

This is the same example, but with the slime dissipating at 20% per turn (the default).

```js
GW.tile.install("SLIME2", {
  layer: "LIQUID",
  bg: "dark_green",
  priority: 25,
});

SHOW(GW.tiles.SLIME2.dissipate);

const map = GW.make.map(20, 20, {
  tile: "FLOOR",
  wall: "WALL",
});
const loop = GW.make.loop();
const canvas = GW.canvas.withFont({
  font: "monospace",
  width: map.width,
  height: map.height,
  io: LOOP,
});
map.drawInto(canvas);
SHOW(canvas.node);

LOOP.run(
  {
    click: async (e) => {
      await map.setTile(e.x, e.y, "SLIME2", GW.random.range(3, 11));
      map.drawInto(canvas);
    },
    tick: async (e) => {
      await map.tick();
      map.drawInto(canvas);
    },
  },
  500
);
```

Sometimes you will see cells of slime that hang out for a long time before going away. That is just a feature of using random numbers and chance to control the slime dissipation.

### Gasses

Gasses spread through the map a little differently than liquids. Liquids push out from places of high concentration to places of low concentration. Gasses pull from areas of low concentration. The difference can best be seen by the way that gasses that do not dissipate will dance around the map.

Here is an example that shows the gas dancing.

```js
GW.tile.install("SWAMP_GAS", {
  layer: "GAS",
  bg: "dark_green",
  priority: 25,
  dissipate: 0,
});

const map = GW.make.map(20, 20, {
  tile: "FLOOR",
  wall: "WALL",
});
const loop = GW.make.loop();
const canvas = GW.canvas.withFont({
  font: "monospace",
  width: map.width,
  height: map.height,
  io: LOOP,
});
map.drawInto(canvas);
SHOW(canvas.node);

LOOP.run(
  {
    click: async (e) => {
      await map.setTile(e.x, e.y, "SWAMP_GAS", GW.random.range(3, 11));
      map.drawInto(canvas);
    },
    tick: async (e) => {
      await map.tick();
      map.drawInto(canvas);
    },
  },
  500
);
```
