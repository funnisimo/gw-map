## Items as Keys

We are going to do some examples here that show how keys can be used to change the environment.

## 1 - Key opens Door

In this example, there is a key on the map. Click it to pick it up. Then move it around. Notice what happens when you get to the locked door.

```js
GWM.item.install('KEY', {
    name: 'a key',
    ch: '~',
    fg: 'gold',
});

GWM.tile.install('LOCKED_DOOR', {
    extends: 'DOOR',
    name: 'a locked door',
    fg: 'white',
    bg: 'teal',
    effects: {
        enter: null,
        key: { tile: 'DOOR' },
    },
});

const charToTile = {
    '.': 'FLOOR',
    '#': 'WALL',
    '+': 'LOCKED_DOOR',
};

const prefab = [
    '##########',
    '#...#....#',
    '#...#....#',
    '#...#....#',
    '#...###+##',
    '#........#',
    '#........#',
    '#........#',
    '#........#',
    '##########',
];

const map = GWM.map.from(prefab, charToTile);

const item = GWM.item.make('KEY');
map.addItem(1, 1, item);
item.key = GWM.entity.makeKeyInfo(7, 4, false);

const canvas = GWU.canvas.make({
    font: 'monospace',
    width: map.width,
    height: map.height,
    loop: LOOP,
});
SHOW(canvas.node);

let carried = null;

LOOP.run(
    {
        click: (e) => {
            if (carried) {
                carried = null;
            } else {
                carried = map.itemAt(e.x, e.y);
            }
        },
        mousemove: async (e) => {
            if (!carried) return;
            await map.moveItem(e.x, e.y, carried);
            if (carried.isDestroyed) {
                carried = null;
            }
        },
        tick: async (e) => {
            await map.tick();
        },
        draw: () => {
            map.drawInto(canvas);
            canvas.render();
        },
    },
    200
);
```
