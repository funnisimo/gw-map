import "jest-extended";
import * as Map from "./gw";
import { colors as COLORS } from "gw-utils";

describe("flags", () => {
  test("flags", () => {
    const flags = Map.tile.Flags;

    expect(flags.T_BRIDGE).toBeGreaterThan(0);

    let f = flags.T_OBSTRUCTS_EVERYTHING;
    expect(f & flags.T_OBSTRUCTS_VISION).toBeTruthy();
  });

  test("mechFlags", () => {
    const mechFlags = Map.tile.MechFlags;

    expect(mechFlags.TM_IS_SECRET).toBeGreaterThan(0);

    let mf = mechFlags.TM_PROMOTES;
    expect(mf & mechFlags.TM_PROMOTES_ON_STEP).toBeTruthy();
  });
});

describe("Tile", () => {
  test("can be created from an object", () => {
    const tile = new Map.tile.Tile({
      id: "WALL",
      name: "Stone Wall",
      sprite: { ch: "#", fg: "light_gray", bg: "dark_gray" },
      flags: ["T_OBSTRUCTS_EVERYTHING"],
      priority: 90,
    });

    expect(tile).toBeDefined();

    expect(tile.flags).toEqual(Map.tile.Flags.T_OBSTRUCTS_EVERYTHING);
    expect(tile.mechFlags).toEqual(0);
    expect(tile.sprite).toEqual({
      ch: "#",
      fg: COLORS.light_gray,
      bg: COLORS.dark_gray,
    });
    expect(tile.layer).toEqual(Map.tile.Layer.GROUND);
    expect(tile.activates).toEqual({});
    expect(tile.priority).toEqual(90);
    expect(tile.name).toEqual("Stone Wall");

    expect(tile.getName()).toEqual("Stone Wall");
    expect(tile.getName("a")).toEqual("a Stone Wall");
    expect(tile.getName("the")).toEqual("the Stone Wall");
    expect(tile.getName(true)).toEqual("a Stone Wall");

    expect(tile.getName({ color: true })).toEqual("Ωlight_grayΩStone Wall∆");
    expect(tile.getName({ color: 0xfff })).toEqual("Ω#fffΩStone Wall∆");
    expect(tile.getName({ color: "white" })).toEqual("ΩwhiteΩStone Wall∆");
    expect(tile.getName({ color: true, article: "a" })).toEqual(
      "a Ωlight_grayΩStone Wall∆"
    );
    expect(tile.getName({ color: true, article: "the" })).toEqual(
      "the Ωlight_grayΩStone Wall∆"
    );
    expect(tile.getName({ color: true, article: true })).toEqual(
      "a Ωlight_grayΩStone Wall∆"
    );

    expect(tile.getDescription()).toEqual(tile.getName());
  });

  test("can create without sprite field", () => {
    const tile = new Map.tile.Tile({
      id: "TEST",
      name: "TEST",
      ch: "#",
      fg: "light_gray",
      bg: "dark_gray",
      priority: 90,
    });

    expect(tile.sprite.ch).toEqual("#");
    expect(tile.sprite.fg).toBe(COLORS.light_gray);
    expect(tile.sprite.bg).toBe(COLORS.dark_gray);
  });

  test("can create tiles with see through bg", () => {
    const tile = new Map.tile.Tile({
      id: "TEST",
      sprite: { ch: "#", fg: "light_gray", bg: null },
    });

    expect(tile.sprite.bg).toEqual(-1);
  });

  test("can extend another tile", () => {
    const wall = new Map.tile.Tile({
      id: "WALL",
      name: "Stone Wall",
      sprite: { ch: "#", fg: "light_gray", bg: "dark_gray" },
      flags: ["T_OBSTRUCTS_EVERYTHING"],
      priority: 90,
    });

    expect(wall).toBeDefined();

    const glassWall = new Map.tile.Tile(
      {
        id: "GLASS_WALL",
        name: "Glass Wall",
        sprite: { ch: "+", fg: "teal" },
        flags: ["!T_OBSTRUCTS_VISION"],
      },
      wall
    );

    expect(glassWall).toBeDefined();

    expect(glassWall.flags).not.toEqual(wall.flags);
    expect(glassWall.flags & Map.tile.Flags.T_OBSTRUCTS_VISION).toBeFalsy();
    expect(
      glassWall.flags & Map.tile.Flags.T_OBSTRUCTS_PASSABILITY
    ).toBeTruthy();
    expect(glassWall.sprite).not.toBe(wall.sprite);
    expect(glassWall.sprite).toEqual({ ch: "+", fg: COLORS.teal, bg: -1 });

    // expect(glassWall.getName()).toEqual('Glass Wall');
  });

  test("can add multiple from an object", () => {
    Map.tile.installAll({
      WALL: {
        name: "Stone Wall",
        sprite: { ch: "#", fg: "light_gray", bg: "dark_gray" },
        flags: ["T_OBSTRUCTS_EVERYTHING"],
        priority: 90,
      },
      GLASS_WALL: {
        Extends: "WALL",
        name: "Glass Wall",
        sprite: { fg: "teal", bg: "silver" },
        flags: ["!T_OBSTRUCTS_VISION"],
      },
    });

    expect(Map.tiles.WALL.getName()).toEqual("Stone Wall");
    expect(Map.tiles.WALL.flags).toEqual(Map.tile.Flags.T_OBSTRUCTS_EVERYTHING);
    expect(Map.tiles.GLASS_WALL.getName()).toEqual("Glass Wall");
    expect(
      Map.tiles.GLASS_WALL.flags & Map.tile.Flags.T_OBSTRUCTS_VISION
    ).toBeFalsy();
    expect(
      Map.tiles.GLASS_WALL.flags & Map.tile.Flags.T_OBSTRUCTS_PASSABILITY
    ).toBeTruthy();
  });

  test("can set the layer", () => {
    const carpet = new Map.tile.Tile({
      id: "CARPET",
      name: "Carpet",
      sprite: { ch: "+", fg: "dark_red", bg: "dark_teal" },
      priority: 10,
      layer: "SURFACE",
    });

    expect(carpet.layer).toEqual(Map.tile.Layer.SURFACE);
  });

  test("can use objects for activations", async () => {
    const carpet = Map.tile.install("CARPET", {
      sprite: { ch: "+", fg: "#f66", bg: "#ff6" },
      activates: {
        tick: { chance: 0, log: "testing" },
      },
      layer: "SURFACE",
    });

    expect(Map.tiles.CARPET).toBe(carpet);
    expect(carpet.activates.tick).not.toBeNil();

    expect(carpet.activatesOn("tick")).toBeTruthy();
  });

  test("can be created by extending another tile", () => {
    const WALL = Map.tiles.WALL;
    expect(WALL).toBeDefined();

    const custom = Map.tile.install("CUSTOM", "WALL", {
      sprite: { ch: "+", fg: "white" },
      name: "Custom Wall",
    });

    expect(custom.sprite).toEqual({ ch: "+", fg: COLORS.white, bg: -1 });
    expect(custom.name).toEqual("Custom Wall");
    expect(custom.id).toEqual("CUSTOM");
  });

  test("can have a glow light", () => {
    const tile = Map.tile.install("TEST", {
      light: "white, 3",
      name: "test",
    });

    expect(tile.light).toBeObject();
    expect(tile.light?.color).toEqual(COLORS.white);
    expect(tile.light?.radius.value()).toEqual(3);
    expect(tile.light?.fadeTo).toEqual(0);

    expect(() => {
      // @ts-ignore
      Map.tile.install("TEST", { light: 4 });
    }).toThrow();
  });

  test("successorFlags", () => {
    const tile = Map.tile.install("TEST", {
      ch: "#",
      fg: "white",
      activates: {
        discover: "WALL",
        enter: false,
        playerEnter: { emit: "TEST" },
        fire: { tile: "UNKNOWN" },
      },
    });

    expect(tile.activates.discover.tile).toEqual("WALL");
    expect(tile.hasFlag(Map.tile.Flags.T_OBSTRUCTS_PASSABILITY)).toBeFalsy();
    expect(
      tile.successorFlags("discover") & Map.tile.Flags.T_OBSTRUCTS_PASSABILITY
    ).toBeTruthy();
    expect(tile.successorFlags("enter")).toEqual(0);
    expect(tile.successorFlags("playerEnter")).toEqual(0);
    expect(tile.successorFlags("fire")).toEqual(0);
  });

  test("hasFlag", () => {
    const tile = Map.tiles.WALL;
    expect(tile.hasFlag(Map.tile.Flags.T_OBSTRUCTS_PASSABILITY)).toBeTruthy();
    expect(tile.hasFlag(Map.tile.Flags.T_BRIDGE)).toBeFalsy();
  });

  test("hasMechFlag", () => {
    const tile = Map.tiles.DOOR;
    expect(
      tile.hasMechFlag(Map.tile.MechFlags.TM_VISUALLY_DISTINCT)
    ).toBeTruthy();
    expect(
      tile.hasMechFlag(Map.tile.MechFlags.TM_EXTINGUISHES_FIRE)
    ).toBeFalsy();
  });

  test("hasFlags", () => {
    const tile = Map.tiles.DOOR;
    expect(
      tile.hasFlags(
        Map.tile.Flags.T_OBSTRUCTS_VISION,
        Map.tile.MechFlags.TM_VISUALLY_DISTINCT
      )
    ).toBeTruthy();
    expect(tile.hasFlags(Map.tile.Flags.T_OBSTRUCTS_VISION, 0)).toBeTruthy();
    expect(
      tile.hasFlags(0, Map.tile.MechFlags.TM_VISUALLY_DISTINCT)
    ).toBeTruthy();

    expect(
      tile.hasFlags(
        Map.tile.Flags.T_OBSTRUCTS_PASSABILITY,
        Map.tile.MechFlags.TM_VISUALLY_DISTINCT
      )
    ).toBeFalsy();
    expect(
      tile.hasFlags(
        Map.tile.Flags.T_OBSTRUCTS_VISION,
        Map.tile.MechFlags.TM_IS_WIRED
      )
    ).toBeFalsy();
  });

  test("install - { Extends }", () => {
    const glassWall = Map.tile.install({
      id: "GLASS_WALL",
      Extends: "WALL",
      sprite: { ch: "+", fg: "teal", bg: "red" },
      flags: ["!T_OBSTRUCTS_VISION"],
    });

    expect(glassWall.name).toEqual("Stone Wall");
    expect(
      glassWall.hasFlag(Map.tile.Flags.T_OBSTRUCTS_PASSABILITY)
    ).toBeTruthy();
  });

  test("install - { Extends: Unknown }", () => {
    expect(() =>
      Map.tile.install({
        id: "GLASS_WALL",
        Extends: "UNKNOWN",
        sprite: { ch: "+", fg: "teal", bg: "red" },
        flags: ["!T_OBSTRUCTS_VISION"],
      })
    ).toThrow();
  });

  test("install - {}", () => {
    const glassWall = Map.tile.install({
      id: "GLASS_WALL",
      name: "glass wall",
      sprite: { ch: "+", fg: "teal", bg: "red" },
      flags: "T_OBSTRUCTS_EVERYTHING,!T_OBSTRUCTS_VISION",
    });

    expect(glassWall.name).toEqual("glass wall");
    expect(
      glassWall.hasFlag(Map.tile.Flags.T_OBSTRUCTS_PASSABILITY)
    ).toBeTruthy();
    expect(glassWall.hasFlag(Map.tile.Flags.T_OBSTRUCTS_VISION)).toBeFalsy();
  });
});

// describe('tiles', () => {

//   let map;
//   let grid;
//   let feat;
//   let ctx;

//   beforeEach( () => {
//     map = GW.make.map(20, 20, { tile: 'FLOOR', boundary: 'WALL' });
//     ctx = { map, x: 10, y: 10 };
//     grid = null;
//   });

//   afterEach( () => {
//     if (grid) GW.grid.free(grid);
//     grid = null;
//   });

//   describe('BRIDGE', () => {
//     test('has see through bg', () => {
//       const tile = Map.tiles.BRIDGE;
//       expect(tile.sprite.bg).toBeUndefined();
//     });
//   });

//   describe('DOOR', () => {

//     test('can do doors (open/close)', async () => {
//       map.setTile(10, 10, 'DOOR');
//       const cell = map.cell(10, 10);

//       expect(Map.tiles.DOOR.events.enter).toBeDefined();
//       expect(Map.tiles.DOOR.events.open).toBeDefined();

//       expect(Map.tiles.DOOR_OPEN.events.tick).toBeDefined();
//       expect(Map.tiles.DOOR_OPEN.events.enter).not.toBeDefined();
//       expect(Map.tiles.DOOR_OPEN.events.open).not.toBeDefined();

//       expect(cell.ground).toEqual('DOOR');
//       await cell.fireEvent('enter', ctx);
//       expect(cell.ground).toEqual('DOOR_OPEN');

//       cell.clearFlags(0, GW.flags.cellMech.EVENT_FIRED_THIS_TURN);
//       await cell.fireEvent('tick', ctx);
//       expect(cell.ground).toEqual('DOOR');

//       const kind = new GW.types.ItemKind({ name: 'Thing' });
//       const item = GW.make.item(kind);

//       cell.clearFlags(0, GW.flags.cellMech.EVENT_FIRED_THIS_TURN);
//       await cell.fireEvent('enter', ctx);
//       expect(cell.ground).toEqual('DOOR_OPEN');

//       // drop item to block door
//       map.addItem(10, 10, item);
//       expect(cell.item).toBe(item);

//       cell.clearFlags(0, GW.flags.cellMech.EVENT_FIRED_THIS_TURN);
//       await cell.fireEvent('tick', ctx);
//       expect(cell.ground).toEqual('DOOR_OPEN');

//       map.removeItem(item);
//       expect(cell.item).toBeNull();

//       cell.clearFlags(0, GW.flags.cellMech.EVENT_FIRED_THIS_TURN);
//       await cell.fireEvent('tick', ctx);
//       expect(cell.ground).toEqual('DOOR');

//       cell.clearFlags(0, GW.flags.cellMech.EVENT_FIRED_THIS_TURN);
//       await cell.fireEvent('enter', ctx);
//       expect(cell.ground).toEqual('DOOR_OPEN');

//       const player = GW.make.player({ name: 'player' });
//       map.addActor(10, 10, player);
//       expect(cell.actor).toBe(player);

//       cell.clearFlags(0, GW.flags.cellMech.EVENT_FIRED_THIS_TURN);
//       await cell.fireEvent('tick', ctx);
//       expect(cell.ground).toEqual('DOOR_OPEN');

//     });

//   });
// });
