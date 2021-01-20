## Map Basics

A map stores the 2D information about the Roguelike gameworld.  It consists of cells that hold tiles (and other things, but more on that later).  Making a map is easy enough:

```js
const canvas = GW.canvas.withFont({ font: 'monospace', width: 20, height: 20 });
const map = GW.make.map(20, 20, 'FLOOR', 'WALL');
map.drawInto(canvas);
SHOW(canvas.node);
```
