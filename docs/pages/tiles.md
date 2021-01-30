## Basic Tiles

Creating a dungeon with just the basic tiles that come with gw-map is fine, but it is a lot more interesting if we add some interesting things into the world to make it more fun. Lets create some of those as a way to learn about the many options that exist for tiles in gw-map.

Lets say that we are walking through a set of ruins for this dungeon. So we are outside and their should be walls of buildings along with lots of foliage that is overgrowing the abandoned buildings.

First, lets add some grass alongside a pond of water. Grass is like a decorator that sits on top of the floor. It doesn't do anything yet, except for look pretty. We set the 'layer' of a tile that sits on top of the floor to 'SURFACE'. These are the layers that tiles can use:

- GROUND
- LIQUID
- SURFACE
- GAS

We will talk more about liquid and gas in the future.

The basic visual components of a tile are the sprite elements:

- ch - the text character to draw
- fg - the color of the text
- bg - the background of the tile

All of these fields are optional. Tiles can be placed that have no visual elements to them at all. This could be useful for things like secrets that can be detected (traps?). But most of the time you will have some visual aspect to the tile.

```js
GW.tile.install("GRASS", {
  layer: "SURFACE",
  ch: '"',
  fg: "green",
});

const charToTile = {
  '"': "GRASS",
  ".": "FLOOR",
  "#": "WALL",
  "+": "DOOR",
  "~": "LAKE",
  "=": "BRIDGE",
};

const prefab = [
  "##########",
  "#...#....#",
  "#...+....#",
  "#...#....#",
  "##+####+##",
  '#.."~~~".#',
  "#...==...#",
  '#."~~~"..#',
  '#.."~~~".#',
  "##########",
];

const map = GW.map.from(prefab, charToTile);
const canvas = GW.canvas.withFont({
  font: "monospace",
  width: map.width,
  height: map.height,
});
map.drawInto(canvas);
SHOW(canvas.node);
```

Next, lets add a tree that is growing in one of the rooms. Maybe it has a little bit of grass around it as well. For trees, we have to decide whether or not we want the trees to block players' movement. We also need to decide whether or not the tree will block line of sight (vision). Let say that it blocks both.

We block vision and line of sight in tiles by setting flags on the tile. Here is a list of some of the flags that we have for tiles:

- L_BLOCKS_MOVE - blocks actors (player + npc + monster) movement
- L_BLOCKS_VISION - blocks FOV/line of sight
- L_BLOCKS_SURFACE - This is used on a floor tile to indicate that it should not allow things like grass to grow on the tile. Doors are a good example of a tile that does not wany any decoration put on top of it.
- L_BLOCKS_LIQUID - This tile does not allow liquids. Walls block liquids.
- L_BLOCKS_GAS - This tile blocks gas from coming into it. Walls block gasses as well.
- L_BLOCKS_ITEMS - You cannot place an item on this tile. In an active game, you should use 'placeItemNear(x, y, item)' to place items and that function will automatically move the placed item into a close cell that does not have this flag.
- L_BLOCKS_ACTORS - This is like L_BLOCKS_MOVE, but also serves as information for the map building process about whether or not actors (maybe NPCs) can be placed on this tile at design time.
- L_BLOCKS_EFFECTS - This tile is ignored when using effects to place tiles (more on this later).
- L_BLOCKS_DIAGONAL - This indicates that you cannot cut the corner past this tile. It affects pathfinding and movement of actors.

If you mouse over the map you will see how the tree affects visibility.

```js
GW.tile.install("GRASS", {
  layer: "SURFACE",
  ch: '"',
  fg: "green",
});

GW.tile.install("TREE", {
  layer: "SURFACE",
  ch: "T",
  fg: "green",
  flags: "L_BLOCKS_MOVE, L_BLOCKS_VISION",
});

const charToTile = {
  '"': "GRASS",
  T: "TREE",
  ".": "FLOOR",
  "#": "WALL",
  "+": "DOOR",
  "~": "LAKE",
  "=": "BRIDGE",
};

const prefab = [
  "##########",
  '#....."..#',
  '##.."T"..#',
  '#..."T"..#',
  "#...~~..##",
  '#.."~~~".#',
  "#...==...#",
  '#."~~~"..#',
  '#.."~~~".#',
  "##########",
];

const map = GW.map.from(prefab, charToTile, {
  fov: true,
  revealed: true,
});
const canvas = GW.canvas.withFont({
  font: "monospace",
  width: map.width,
  height: map.height,
});
map.drawInto(canvas);
SHOW(canvas.node);

canvas.onmousemove = (e) => {
  GW.visibility.update(map, e.x, e.y, 10);
  map.drawInto(canvas);
};
```

Now, lets make our world a little more interactive. Tiles can respond to events. They do this by having effects that will handle the events. Lets make a super simple effect of trampling our grass.

In this example, we are going to have a field of grass, as you move the mouse around, you will trample the grass and it will grow back randomly over time.

We are going to start using the LOOP object in this example. This is a convenience method for examples that handles some of the underlying GW.io.Loop mechanics.

```js
GW.tile.install("GRASS", {
  layer: "SURFACE",
  ch: '"',
  fg: "green",
  priority: 25,
  activates: {
    enter: "GRASS_TRAMPLED",
  },
});

GW.tile.install("GRASS_TRAMPLED", {
  layer: "SURFACE",
  ch: "'",
  fg: "dark_green",
  priority: 50,
  activates: {
    tick: {
      chance: 10 * 100, // 10% of the time...
      tile: "GRASS", // replace this tile with GRASS
      flags: "DFF_SUPERPRIORITY", // allows GRASS tile to overwrite this tile even though our priority is higher
    },
  },
});

const map = GW.make.map(20, 20, {
  tile: "GRASS",
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
    mousemove: async (e) => {
      await map.activateCell(e.x, e.y, "enter");
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

In this example, we see 2 difference events: enter and tick. There are others (actually as many as you want) and we will talk about them later. Right now, lets keep focusing on some other things we can do with tiles and events.

For now, lets combine some of what we have done so far and review doors. Doors by default are handled by two tiles - DOOR and DOOR_OPEN. As you would expect DOOR is a closed door and it blocks vision (and gas, etc...). But, when an actor enters the door, it is replaced with DOOR_OPEN which does not block vision (or gas, etc...). When you exit the DOOR_OPEN, it will revert to a DOOR - thus simulating closing a door.

If you do not want this auto-opening feature of doors, then you can just create your own DOOR variant that does not have the **enter** event. Then you can have a command that the player uses to open doors. There is already an included door that does not auto-close for this use case - DOOR_OPEN_ALWAYS. It just does not close on exit/tick.

Here is a map with a couple of doors. The FOV is calculated from the **X** tile and you can see it change as you mouseover the doors to open them. There will be some odd behavior in this example because we do not have an actual actor to hold the door open. So it will close whenever the **tick** event fires instead of staying open if the mouse is still over it.

```js
GW.tile.install("CENTER", {
  layer: "SURFACE",
  ch: "X",
  fg: "green",
});

const charToTile = {
  X: "CENTER",
  ".": "FLOOR",
  "#": "WALL",
  "+": "DOOR",
  "~": "LAKE",
  "=": "BRIDGE",
};

const prefab = [
  "###########",
  "#.........#",
  "#.........#",
  "#..#+#+#..#",
  "#..+...#..#",
  "#..#.X.+..#",
  "#..+...#..#",
  "#..##+##..#",
  "#.........#",
  "#.........#",
  "###########",
];

const map = GW.map.from(prefab, charToTile, { fov: true });
const canvas = GW.canvas.withFont({
  font: "monospace",
  width: map.width,
  height: map.height,
  io: LOOP,
});
GW.visibility.update(map, 5, 5, 10);
map.drawInto(canvas);
SHOW(canvas.node);

LOOP.run(
  {
    mousemove: async (e) => {
      await map.activateCell(e.x, e.y, "enter");
      GW.visibility.update(map, 5, 5, 10);
      map.drawInto(canvas);
    },
    tick: async (e) => {
      await map.tick();
      GW.visibility.update(map, 5, 5, 10);
      map.drawInto(canvas);
    },
  },
  500
);
```

Now that we have some of the basics of tile events and replacements, lets move on to liquid and gas tiles.
