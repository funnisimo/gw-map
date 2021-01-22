## Map Visibility

By default every cell on a map is visible. That will remain true until you start to manage the visibility. Here is how it is done. Move the mouse around the map to change the FOV starting point.

```js
const map = GW.make.map(20, 20, { fov: true, tile: "FLOOR", wall: "WALL" });
const canvas = GW.canvas.withFont({
  font: "monospace",
  width: map.width,
  height: map.height,
});
map.drawInto(canvas);
SHOW(canvas.node);

canvas.onclick = (e) => {
  if (map.isBoundaryXY(e.x, e.y)) return;
  const tile = map.hasTile(e.x, e.y, "FLOOR") ? "WALL" : "FLOOR";
  map.setTile(e.x, e.y, tile);
  GW.visibility.update(map, e.x, e.y, 10);
  map.drawInto(canvas);
};

canvas.onmousemove = (e) => {
  GW.visibility.update(map, e.x, e.y, 10);
  map.drawInto(canvas);
};
```
