import * as Tile from "./tile";

// These are the minimal set of tiles to make the diggers work
Tile.install("NULL", {
  ch: "\u2205",
  fg: "white",
  bg: "black",
  flags: "T_OBSTRUCTS_PASSABILITY",
  name: "eerie nothingness",
  article: "an",
  priority: 0,
});

Tile.install("FLOOR", {
  ch: "\u00b7",
  fg: [30, 30, 30, 20, 0, 0, 0],
  bg: [2, 2, 10, 0, 2, 2, 0],
  priority: 10,
  article: "the",
});

Tile.install("DOOR", {
  ch: "+",
  fg: [100, 40, 40],
  bg: [30, 60, 60],
  priority: 30,
  flags:
    "T_IS_DOOR, T_OBSTRUCTS_TILE_EFFECTS, T_OBSTRUCTS_ITEMS, T_OBSTRUCTS_VISION, TM_VISUALLY_DISTINCT",
  article: "a",
  activates: {
    enter: { tile: "DOOR_OPEN" },
    open: { tile: "DOOR_OPEN_ALWAYS" },
  },
});

Tile.install("DOOR_OPEN", "DOOR", {
  ch: "'",
  fg: [100, 40, 40],
  bg: [30, 60, 60],
  priority: 40,
  flags: "!T_OBSTRUCTS_ITEMS, !T_OBSTRUCTS_VISION",
  name: "open door",
  article: "an",
  activates: {
    tick: { tile: "DOOR", flags: "DFF_SUPERPRIORITY, DFF_ONLY_IF_EMPTY" },
    enter: null,
    open: null,
    close: { tile: "DOOR", flags: "DFF_SUPERPRIORITY, DFF_ONLY_IF_EMPTY" },
  },
});

Tile.install("DOOR_OPEN_ALWAYS", "DOOR_OPEN", {
  activates: {
    tick: null,
    close: { tile: "DOOR", flags: "DFF_SUPERPRIORITY, DFF_ONLY_IF_EMPTY" },
  },
});

Tile.install("BRIDGE", {
  ch: "=",
  fg: [100, 40, 40],
  priority: 40,
  layer: "SURFACE",
  flags: "T_BRIDGE, TM_VISUALLY_DISTINCT",
  article: "a",
});

Tile.install("UP_STAIRS", {
  ch: "<",
  fg: [100, 40, 40],
  bg: [100, 60, 20],
  priority: 200,
  flags:
    "T_UP_STAIRS, T_STAIR_BLOCKERS, TM_VISUALLY_DISTINCT, TM_LIST_IN_SIDEBAR",
  name: "upward staircase",
  article: "an",
});
Tile.install("DOWN_STAIRS", {
  ch: ">",
  fg: [100, 40, 40],
  bg: [100, 60, 20],
  priority: 200,
  flags:
    "T_DOWN_STAIRS, T_STAIR_BLOCKERS, TM_VISUALLY_DISTINCT, TM_LIST_IN_SIDEBAR",
  name: "downward staircase",
  article: "a",
});

Tile.install("WALL", {
  ch: "#",
  fg: [7, 7, 7, 0, 3, 3, 3],
  bg: [40, 40, 40, 10, 10, 0, 5],
  priority: 100,
  flags: "T_OBSTRUCTS_EVERYTHING",
  article: "a",
});

Tile.install("LAKE", {
  ch: "~",
  fg: [5, 8, 20, 10, 0, 4, 15, true],
  bg: [10, 15, 41, 6, 5, 5, 5, true],
  priority: 50,
  flags: "T_DEEP_WATER",
  name: "deep water",
  article: "the",
});
