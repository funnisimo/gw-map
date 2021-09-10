# Commutation Altar

Here is an example where we have an altar that is activated when you place something on it. The altar has a custom effect that will try to swap

## Setup

```js
// EFFECT HANDLER

async function swapItems(config, map, x, y, ctx) {
    const cell = map.cell(x, y);
    const item = cell.item;
    if (!item) return false;

    const myMachine = cell.machineId;
    if (!myMachine) return false;

    const tile = ctx.tile;

    let items = [item];
    map.eachItem((i) => {
        if (i === item) return; // do not use same item again
        const itemCell = map.cell(i.x, i.y);
        if (itemCell.machineId !== myMachine) return;
        if (!itemCell.hasTile(tile)) return;
        items.push(i);
    });

    if (items.length < 2) return false;

    console.log('SWAP ITEMS - ', items.map((i) => i.getName()).join(', '));

    const firstItem = items[0];
    let lastLoc = [firstItem.x, firstItem.y];
    for (let i = 1; i < items.length; ++i) {
        const item = items[i];
        const prevItem = items[i - 1];
        map.moveItem(item.x, item.y, previtem);
    }
    const lastItem = items.at(-1);
    map.moveItem(lastLoc[0], lastLoc[1], lastItem);
    return true;
}

// TILES

GWM.tile.install('COMMUTATION_ALTAR', {
    ch: 'T',
    fg: 'gold',
    bg: 'green',
    priority: 100 - 17,
    flags: 'L_BLOCKS_SURFACE, L_LIST_IN_SIDEBAR, L_VISUALLY_DISTINCT',
    effects: {
        addItem: { fn: swapItems, next: { effect: 'DF_ALTAR_COMMUTE' } },
    },
    flavor: 'a commutation altar',
    description:
        'crude diagrams on this altar and its twin invite you to place items upon them.',
});

//   'COMMUTATION_ALTAR_INERT',[ALTAR_CHAR,	black,                 greenAltarBackColor,   17, 0,	0,				0,			0,				0,				NO_LIGHT,       (T_OBSTRUCTS_SURFACE_EFFECTS), (TM_LIST_IN_SIDEBAR | TM_VISUALLY_DISTINCT),							"a scorched altar",     "scorch marks cover the surface of the altar, but it is cold to the touch."],
//   'PIPE_GLOWING',['+',           veryDarkGray,          0,                      45, 0,  DF_PLAIN_FIRE,  0,          DF_INERT_PIPE,  0,              CONFUSION_GAS_LIGHT, (0), (TM_IS_WIRED | TM_VANISHES_UPON_PROMOTION),                                               "glowing glass pipes",  "glass pipes are set into the floor and emit a soft glow of shifting color."],
//   'PIPE_INERT',['+',           black,                 0,                      45, 0,  DF_PLAIN_FIRE,  0,          0,              0,              NO_LIGHT,       (0), (0),                                                                                           "charred glass pipes",  "the inside of the glass pipes are charred."],

// EFFECTS

GWM.effect.install('DF_ALTAR_COMMUTE', {
    tile: 'COMMUTATION_ALTAR_INERT',
    message: 'the items on the altars flash with a brilliant light!',
    flash: 'SCROLL_ENCHANTMENT_LIGHT',
});
GWM.effect.install('DF_MAGIC_PIPING', { tile: 'PIPE_GLOWING,90,60' });
GWM.effect.install('DF_INERT_PIPE', {
    tile: 'PIPE_INERT',
    flash: 'SCROLL_ENCHANTMENT_LIGHT',
});
```

## Usage

```js
const map = GWM.map.make(20, 20, 'FLOOR', 'WALL');

const canvas = GWU.canvas.make(20, 20);
SHOW(canvas.node);

map.drawInto(canvas);
canvas.render();
```
