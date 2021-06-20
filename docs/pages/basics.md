## Map Basics

A map stores the 2D information about the Roguelike gameworld. It consists of cells that hold tiles (and other things, but more on that later). Making a map is easy enough. Here is a 10x10 map with a basic floor surrounded by walls:

```js
const canvas = GW.canvas.make({ font: 'monospace', width: 10, height: 10 });
const map = GW.map.make(10, 10, 'FLOOR', 'WALL');
map.drawInto(canvas.buffer);
SHOW(canvas.node);
canvas.buffer.render();
```

Most of that code is self explanatory. The tile names are some of the few automatically installed tiles that come with the gw-map library. Here is the list:

```js
SHOW(Object.keys(GW.tiles).join('<br>'));
```

Algorithms for designing maps are beyond the scope of this library. However, we can use these tiles to build a fairly simple dungeon motif level:

```js
const charToTile = {
    '.': 'FLOOR',
    '#': 'WALL',
    '+': 'DOOR',
    '~': 'LAKE',
    '=': 'BRIDGE',
};

const prefab = [
    '##########',
    '#...#....#',
    '#...+....#',
    '#...#....#',
    '##+####+##',
    '#...~~~..#',
    '#...==...#',
    '#..~~~...#',
    '#...~~~..#',
    '##########',
];

const map = GW.map.from(prefab, charToTile);
const canvas = GW.canvas.make({ font: 'monospace', width: 10, height: 10 });
map.drawInto(canvas.buffer);
SHOW(canvas.node);
canvas.buffer.render();
```

Simple enough.

You can also build the map yourself using the setTile function.

```js
const map = GW.map.make(10, 10, 'FLOOR', 'WALL');
const canvas = GW.canvas.make({ font: 'monospace', width: 10, height: 10 });
map.drawInto(canvas.buffer);
SHOW(canvas.node);
canvas.buffer.render();

canvas.onclick = (e) => {
    if (map.isBoundaryXY(e.x, e.y)) return;
    const tile = map.hasTile(e.x, e.y, 'FLOOR') ? 'WALL' : 'FLOOR';
    map.setTile(e.x, e.y, tile);
    map.drawInto(canvas.buffer);
    canvas.buffer.render();
};
```
