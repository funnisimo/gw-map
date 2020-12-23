import "jest-extended";
import * as Tile from "./tile";
import { colors as COLORS } from "gw-utils";

describe("flags", () => {
  test("flags", () => {
    const flags = Tile.Flags;

    expect(flags.T_BRIDGE).toBeGreaterThan(0);

    let f = flags.T_OBSTRUCTS_EVERYTHING;
    expect(f & flags.T_OBSTRUCTS_VISION).toBeTruthy();
  });

  test("mechFlags", () => {
    const mechFlags = Tile.MechFlags;

    expect(mechFlags.TM_IS_SECRET).toBeGreaterThan(0);

    let mf = mechFlags.TM_PROMOTES;
    expect(mf & mechFlags.TM_PROMOTES_ON_STEP).toBeTruthy();
  });
});

describe("Tile", () => {
  test("can be created from an object", () => {
    const tile = new Tile.Tile({
      id: "WALL",
      name: "Stone Wall",
      sprite: { ch: "#", fg: "light_gray", bg: "dark_gray" },
      flags: ["T_OBSTRUCTS_EVERYTHING"],
      priority: 90,
    });

    expect(tile).toBeDefined();

    expect(tile.flags).toEqual(Tile.Flags.T_OBSTRUCTS_EVERYTHING);
    expect(tile.mechFlags).toEqual(0);
    expect(tile.sprite).toEqual({
      ch: "#",
      fg: COLORS.light_gray,
      bg: COLORS.dark_gray,
    });
    expect(tile.layer).toEqual(Tile.Layer.GROUND);
    expect(tile.activates).toEqual({});
    expect(tile.priority).toEqual(90);
    expect(tile.name).toEqual("Stone Wall");

    expect(tile.getName()).toEqual("Stone Wall");
    expect(tile.getName("a")).toEqual("a Stone Wall");
    expect(tile.getName("the")).toEqual("the Stone Wall");
    expect(tile.getName(true)).toEqual("a Stone Wall");

    expect(tile.getName({ color: true })).toEqual("Ωlight_grayΩStone Wall∆");
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
    const tile = new Tile.Tile({
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
    const tile = new Tile.Tile({
      id: "TEST",
      sprite: { ch: "#", fg: "light_gray", bg: null },
    });

    expect(tile.sprite.bg).toEqual(-1);
  });

  test("can extend another tile", () => {
    const wall = new Tile.Tile({
      id: "WALL",
      name: "Stone Wall",
      sprite: { ch: "#", fg: "light_gray", bg: "dark_gray" },
      flags: ["T_OBSTRUCTS_EVERYTHING"],
      priority: 90,
    });

    expect(wall).toBeDefined();

    const glassWall = new Tile.Tile(
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
    expect(glassWall.flags & Tile.Flags.T_OBSTRUCTS_VISION).toBeFalsy();
    expect(glassWall.flags & Tile.Flags.T_OBSTRUCTS_PASSABILITY).toBeTruthy();
    expect(glassWall.sprite).not.toBe(wall.sprite);
    expect(glassWall.sprite).toEqual({ ch: "+", fg: COLORS.teal, bg: -1 });

    // expect(glassWall.getName()).toEqual('Glass Wall');
  });

  test("can add multiple from an object", () => {
    Tile.installAll({
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

    expect(Tile.tiles.WALL.getName()).toEqual("Stone Wall");
    expect(Tile.tiles.WALL.flags).toEqual(Tile.Flags.T_OBSTRUCTS_EVERYTHING);
    expect(Tile.tiles.GLASS_WALL.getName()).toEqual("Glass Wall");
    expect(
      Tile.tiles.GLASS_WALL.flags & Tile.Flags.T_OBSTRUCTS_VISION
    ).toBeFalsy();
    expect(
      Tile.tiles.GLASS_WALL.flags & Tile.Flags.T_OBSTRUCTS_PASSABILITY
    ).toBeTruthy();
  });

  test("can set the layer", () => {
    const carpet = new Tile.Tile({
      id: "CARPET",
      name: "Carpet",
      sprite: { ch: "+", fg: "dark_red", bg: "dark_teal" },
      priority: 10,
      layer: "SURFACE",
    });

    expect(carpet.layer).toEqual(Tile.Layer.SURFACE);
  });

  test("can use objects for activations", async () => {
    const carpet = Tile.install("CARPET", {
      sprite: { ch: "+", fg: "#f66", bg: "#ff6" },
      activates: {
        tick: { chance: 0, log: "testing" },
      },
      layer: "SURFACE",
    });

    expect(Tile.tiles.CARPET).toBe(carpet);
    expect(carpet.activates.tick).not.toBeNil();

    expect(carpet.activatesOn("tick")).toBeTruthy();
  });

  test("can be created by extending another tile", () => {
    const WALL = Tile.tiles.WALL;
    expect(WALL).toBeDefined();

    const custom = Tile.install("CUSTOM", "WALL", {
      sprite: { ch: "+", fg: "white" },
      name: "Custom Wall",
    });

    expect(custom.sprite).toEqual({ ch: "+", fg: COLORS.white, bg: -1 });
    expect(custom.name).toEqual("Custom Wall");
    expect(custom.id).toEqual("CUSTOM");
  });

  test("can have a glow light", () => {
    const tile = Tile.install("TEST", {
      light: "white, 3",
      name: "test",
    });

    expect(tile.light).toBeObject();
    expect(tile.light?.color).toEqual(COLORS.white);
    expect(tile.light?.radius.value()).toEqual(3);
    expect(tile.light?.fadeTo).toEqual(0);

    expect(() => {
      // @ts-ignore
      Tile.install("TEST", { light: 4 });
    }).toThrow();
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
//       const tile = Tile.tiles.BRIDGE;
//       expect(tile.sprite.bg).toBeUndefined();
//     });
//   });

//   describe('DOOR', () => {

//     test('can do doors (open/close)', async () => {
//       map.setTile(10, 10, 'DOOR');
//       const cell = map.cell(10, 10);

//       expect(Tile.tiles.DOOR.events.enter).toBeDefined();
//       expect(Tile.tiles.DOOR.events.open).toBeDefined();

//       expect(Tile.tiles.DOOR_OPEN.events.tick).toBeDefined();
//       expect(Tile.tiles.DOOR_OPEN.events.enter).not.toBeDefined();
//       expect(Tile.tiles.DOOR_OPEN.events.open).not.toBeDefined();

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
