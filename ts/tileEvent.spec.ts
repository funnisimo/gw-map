import "../test/matchers";
import * as UTILS from "../test/utils";
import * as Map from "./gw";
import * as GW from "gw-utils";

describe("tileEvent", () => {
  let map: Map.map.Map;
  let grid: GW.grid.NumGrid;
  let feat: Map.tileEvent.TileEvent;
  let ctx: any;

  const LAKE = "LAKE";
  let ROUGH_WATER = "ROUGH_WATER";
  let WAVE = "WAVE";

  beforeAll(() => {
    Map.tile.install(ROUGH_WATER, {
      ch: "R",
      fg: "blue",
      bg: "green",
      priority: 70,
      flags: "T_DEEP_WATER",
      name: "water",
      article: "some",
      activates: {
        tick: { tile: LAKE, flags: "DFF_SUPERPRIORITY | DFF_PROTECTED" },
      },
    });
    Map.tile.install(WAVE, {
      ch: "W",
      fg: "white",
      bg: "blue",
      priority: 60,
      flags: "T_DEEP_WATER",
      name: "wave crest",
      article: "the",
      activates: {
        tick: {
          radius: 1,
          tile: "WAVE",
          flags: "DFF_NULLIFY_CELL | DFF_SUBSEQ_ALWAYS",
          needs: LAKE,
          next: { tile: ROUGH_WATER },
        },
      },
    });
  });

  afterAll(() => {
    delete Map.tiles[ROUGH_WATER];
    delete Map.tiles[WAVE];
  });

  beforeEach(() => {
    map = GW.make.map(20, 20, { tile: "FLOOR", boundary: "WALL" });
    ctx = { map, x: 10, y: 10 };
    grid = GW.grid.alloc(20, 20);

    UTILS.mockRandom();
  });

  afterEach(() => {
    GW.grid.free(grid);
    // Activation.debug = GW.utils.NOOP;
    jest.resetAllMocks();
  });

  // COMPUTE SPAWN MAP

  test("can compute a spawn map", () => {
    // only a single tile
    feat = GW.make.tileEvent({ tile: "WALL" })!;
    Map.tileEvent.computeSpawnMap(feat, grid, ctx);
    expect(grid.count(1)).toEqual(1);
    expect(grid.count(0)).toEqual(20 * 20 - 1);
    expect(grid[10][10]).toEqual(1);

    // tile and neighbors
    feat = GW.make.tileEvent({ tile: "WALL", spread: 100, decrement: 100 })!;
    grid.fill(0);
    Map.tileEvent.computeSpawnMap(feat, grid, ctx);
    expect(grid.count(0)).toEqual(20 * 20 - 5);
    expect(grid[10][10]).toEqual(1);
    grid.eachNeighbor(10, 10, (v) => expect(v).toEqual(2), true);

    // 2 levels
    feat = GW.make.tileEvent({ tile: "WALL", spread: 200, decrement: 100 })!;
    grid.fill(0);
    Map.tileEvent.computeSpawnMap(feat, grid, ctx);
    expect(grid.count(0)).toEqual(20 * 20 - 1 - 4 - 8);
    expect(grid[10][10]).toEqual(1);
    grid.eachNeighbor(10, 10, (v) => expect(v).toEqual(2), true);
    expect(grid.count(3)).toEqual(8);
  });

  // { spread: 50 }
  test("{ spread: 50 }", () => {
    GW.random.seed(12345);
    feat = GW.make.tileEvent({ tile: "WALL", spread: 50 })!;

    Map.tileEvent.computeSpawnMap(feat, grid, ctx);
    // grid.dump();
    expect(grid.count((v) => !!v)).toEqual(3);
    expect(grid[10][10]).toEqual(1);
    expect(grid[10][11]).toEqual(2);
    expect(grid[10][9]).toEqual(0);
  });

  // { spread: 75, matchTile: "DOOR" }
  test('{ spread: 75, matchTile: "DOOR" }', () => {
    GW.random.seed(12345);
    feat = GW.make.tileEvent({ tile: "WALL", spread: 50, matchTile: "DOOR" })!;
    Map.tileEvent.computeSpawnMap(feat, grid, ctx);
    // grid.dump();
    expect(grid.count((v) => !!v)).toEqual(0); // There are no doors!

    map.setTile(9, 10, "DOOR");
    map.setTile(11, 10, "DOOR");
    map.setTile(10, 9, "DOOR");
    map.setTile(10, 11, "DOOR");

    Map.tileEvent.computeSpawnMap(feat, grid, ctx);
    // grid.dump();
    expect(grid.count((v) => !!v)).toEqual(2); // match some doors
  });

  // { spread: 50, decrement: 10 }
  test("{ spread: 50, decrement: 10 }", () => {
    GW.random.seed(12345);
    feat = GW.make.tileEvent({ tile: "WALL", spread: 50, decrement: 10 })!;
    Map.tileEvent.computeSpawnMap(feat, grid, ctx);
    // grid.dump();
    expect(grid.count((v) => !!v)).toEqual(11);
    expect(grid[10][10]).toEqual(1);
    expect(grid[9][8]).toEqual(0);
    expect(grid[13][10]).toEqual(6);
  });

  // DFF_SPREAD_CIRCLE
  test("{ spread: 90, decrement: 10, spread circle }", () => {
    GW.random.seed(1234567);
    feat = GW.make.tileEvent({
      tile: "WALL",
      spread: 90,
      decrement: 10,
      flags: "DFF_SPREAD_CIRCLE",
    })!;

    expect(feat.flags).toEqual(Map.tileEvent.Flags.DFF_SPREAD_CIRCLE);
    Map.tileEvent.computeSpawnMap(feat, grid, ctx);
    // grid.dump();
    expect(grid.count((v) => !!v)).toEqual(137);
    grid.forCircle(10, 10, 6, (v) => expect(v).toEqual(1));
  });

  test.todo("Add some walls and test that circle does not pass through them.");

  // { radius: 3 }
  test("{ radius: 3 }", () => {
    GW.random.seed(12345);
    feat = GW.make.tileEvent({ tile: "WALL", radius: 3 })!;
    // console.log(feat);
    Map.tileEvent.computeSpawnMap(feat, grid, ctx);
    // grid.dump();
    expect(grid.count((v) => !!v)).toEqual(37);
    expect(grid[10][10]).toEqual(1);
    expect(grid[8][11]).toEqual(1);
  });

  // { radius: 3, spread: 75 }
  test("{ radius: 3, spread: 75 }", () => {
    GW.random.seed(12345);
    feat = GW.make.tileEvent({ tile: "WALL", radius: 3, spread: 75 })!;
    // console.log(feat);

    Map.tileEvent.computeSpawnMap(feat, grid, ctx);
    // grid.dump();
    expect(grid.count((v) => !!v)).toEqual(30);
    expect(grid[10][10]).toEqual(1);
    expect(grid[9][10]).toEqual(0);
    expect(grid[8][10]).toEqual(1);
  });

  // { radius: 3, spread: 75, decrement: 20 }
  test("{ radius: 3, spread: 75, decrement: 20 }", () => {
    GW.random.seed(12345);
    feat = GW.make.tileEvent({
      tile: "WALL",
      radius: 3,
      spread: 75,
      decrement: 20,
    })!;
    // console.log(feat);
    Map.tileEvent.computeSpawnMap(feat, grid, ctx);
    // grid.dump();
    expect(grid.count((v) => !!v)).toEqual(12);
    expect(grid[10][10]).toEqual(1);
    expect(grid[10][11]).toEqual(0);
    expect(grid[10][12]).toEqual(1);
  });

  // { match: 2, radius: 1 }
  // { match: 1, radius: 1 }
  // { match: [0,1], radius: 1 }
  // { match: fn, radius: 3 }
  // { radius: 5, decrement: 20, match: [0,1] }

  // SPAWN TILE

  test("will fill a map with a spawn map", async () => {
    grid.fillRect(5, 5, 3, 3, 1);
    const feat = GW.make.tileEvent({ tile: "WALL" })!;

    map.forRect(5, 5, 3, 3, (cell) => expect(cell.hasTile("WALL")).toBeFalsy());
    await Map.tileEvent.spawnTiles(feat, grid, { map }, Map.tiles.WALL);
    map.forRect(5, 5, 3, 3, (cell) => {
      expect(cell.hasTile("WALL")).toBeTruthy();
      // expect(cell.mechFlags & Map.cell.MechFlags.EVENT_FIRED_THIS_TURN).toBeTruthy();
    });
  });

  test("will skip tiles that are event protected", async () => {
    grid.fillRect(5, 5, 3, 3, 1);

    map.forRect(5, 5, 3, 3, (cell) => expect(cell.hasTile("WALL")).toBeFalsy());

    map.setCellFlags(5, 5, 0, Map.cell.MechFlags.EVENT_PROTECTED);
    map.setCellFlags(6, 5, 0, Map.cell.MechFlags.EVENT_PROTECTED);
    map.setCellFlags(7, 5, 0, Map.cell.MechFlags.EVENT_PROTECTED);

    const feat = GW.make.tileEvent({ tile: "WALL" })!;

    await Map.tileEvent.spawnTiles(feat, grid, { map }, Map.tiles.WALL);
    map.forRect(5, 5, 3, 3, (cell, _x, y) => {
      if (y != 5) {
        expect(cell.hasTile("WALL")).toBeTruthy();
        // expect(cell.mechFlags & Map.cell.MechFlags.EVENT_FIRED_THIS_TURN).toBeTruthy();
        expect(cell.mechFlags & Map.cell.MechFlags.EVENT_PROTECTED).toBeFalsy();
      } else {
        expect(cell.hasTile("WALL")).toBeFalsy();
        // expect(cell.mechFlags & Map.cell.MechFlags.EVENT_FIRED_THIS_TURN).toBeFalsy();
        expect(
          cell.mechFlags & Map.cell.MechFlags.EVENT_PROTECTED
        ).toBeTruthy();
      }
    });
  });

  // SPAWN

  test("will spawn into map", async () => {
    feat = GW.make.tileEvent({ tile: "WALL", spread: 200, decrement: 100 })!;
    await Map.tileEvent.spawn(feat, { map, x: 5, y: 5 });
    expect(map.hasTile(5, 5, "WALL")).toBeTruthy();
    map.eachNeighbor(5, 5, (c) => expect(c.hasTile("WALL")).toBeTruthy(), true);
  });

  // fn
  test("fn", async () => {
    const feat = jest.fn();
    ctx = "ctx";
    await UTILS.alwaysAsync(() => Map.tileEvent.spawn(feat, ctx));
    expect(feat).toHaveBeenCalledWith(ctx);
    // expect(map.hasCellMechFlag(10, 10, Map.cell.MechFlags.EVENT_FIRED_THIS_TURN)).toBeFalsy(); // You have to set it yourself
    expect(feat).toHaveBeenCalledTimes(1000);
  });

  // { fn }
  test("{ fn }", async () => {
    const feat = GW.make.tileEvent({ fn: jest.fn() })!;
    await UTILS.alwaysAsync(async () => {
      await Map.tileEvent.spawn(feat, ctx);
      // expect(map.hasCellMechFlag(10, 10, Map.cell.MechFlags.EVENT_FIRED_THIS_TURN)).toBeTruthy();
    });
    expect(feat.fn).toHaveBeenCalledWith(10, 10, ctx);
    expect(feat.fn).toHaveBeenCalledTimes(1000);
  });

  // { fn: ..., always fire }
  test("{ fn, always fire }", async () => {
    const featFn = jest.fn();
    const feat = GW.make.tileEvent({
      fn: featFn,
      chance: 50,
      flags: "DFF_ALWAYS_FIRE",
    })!;

    await UTILS.alwaysAsync(async () => {
      await Map.tileEvent.spawn(feat, ctx);
      // expect(map.hasCellMechFlag(10, 10, Map.cell.MechFlags.EVENT_FIRED_THIS_TURN)).toBeTruthy();
    });
    expect(featFn).toHaveBeenCalledTimes(1000);
  });

  // { fn: ..., do not mark }
  test("{ fn, do not mark }", async () => {
    const featFn = jest.fn();
    const feat = GW.make.tileEvent({
      fn: featFn,
      chance: 50,
      flags: "DFF_NO_MARK_FIRED",
    })!;

    await UTILS.alwaysAsync(async () => {
      await Map.tileEvent.spawn(feat, ctx);
      // expect(map.hasCellMechFlag(10, 10, Map.cell.MechFlags.EVENT_FIRED_THIS_TURN)).toBeFalsy();
    });
    expect(featFn).toHaveBeenCalledTimes(1000);
  });

  // { tile: "WALL" }
  test('{ tile: "WALL" }', async () => {
    const feat = GW.make.tileEvent({ tile: "WALL" })!;
    await Map.tileEvent.spawn(feat, ctx);
    expect(map.hasTile(10, 10, "WALL")).toBeTruthy();
    // expect(map.hasCellFlag(10, 10, Map.cell.Flags.NEEDS_REDRAW)).toBeTruthy();
    expect(map.hasCellFlag(10, 10, Map.cell.Flags.CELL_CHANGED)).toBeTruthy();
    // expect(map.hasCellMechFlag(10, 10, Map.cell.MechFlags.EVENT_FIRED_THIS_TURN)).toBeTruthy();
  });

  //   // { item: 'BOX' }
  //   test('{ item: "BOX" }', async () => {
  //     GW.item.addKind("BOX", {
  //       name: "box",
  //       description: "a large wooden box",
  //       sprite: { ch: "\u2612", fg: "light_brown" },
  //       flags: "A_PUSH, A_PULL, A_SLIDE, A_NO_PICKUP, IK_BLOCKS_MOVE",
  //       stats: { health: 10 },
  //     });

  //     expect(GW.itemKinds.BOX).toBeDefined();
  //     const feat = GW.make.tileEvent({ item: "BOX" });
  //     expect(feat.item).toEqual("BOX");

  //     expect(map.itemAt(10, 10)).toBeNull();
  //     expect(map.hasTile(10, 10, "FLOOR")).toBeTruthy();

  //     await Map.tileEvent.spawn(feat, ctx);
  //     expect(map.hasTile(10, 10, "FLOOR")).toBeTruthy();
  //     expect(map.itemAt(10, 10)).not.toBeNull();
  //     // expect(map.hasCellFlag(10, 10, Map.cell.Flags.NEEDS_REDRAW)).toBeTruthy();
  //     expect(map.hasCellFlag(10, 10, Map.cell.Flags.CELL_CHANGED)).toBeTruthy();
  //     // expect(map.hasCellMechFlag(10, 10, Map.cell.MechFlags.EVENT_FIRED_THIS_TURN)).toBeTruthy();
  //   });

  // { tile: 'WALL' }
  test("{ tile: WALL }", async () => {
    const feat = GW.make.tileEvent({ tile: "WALL" })!;
    expect(feat.tile).toEqual("WALL");
    await Map.tileEvent.spawn(feat, ctx);
    expect(feat.tile).toEqual("WALL");
    expect(map.hasTile(10, 10, "WALL")).toBeTruthy();
    // expect(map.hasCellFlag(10, 10, Map.cell.Flags.NEEDS_REDRAW)).toBeTruthy();
    expect(map.hasCellFlag(10, 10, Map.cell.Flags.CELL_CHANGED)).toBeTruthy();
    // expect(map.hasCellMechFlag(10, 10, Map.cell.MechFlags.EVENT_FIRED_THIS_TURN)).toBeTruthy();
  });

  // { tile: 8, next: 'OTHER' }

  test("can clear extra tiles from the cell", async () => {
    const feat = GW.make.tileEvent({ flags: "DFF_NULLIFY_CELL" })!;

    map.setTile(5, 5, "BRIDGE");
    const cell = map.cell(5, 5);
    expect(cell.surface).toEqual("BRIDGE");
    expect(cell.ground).toEqual("FLOOR");

    await Map.tileEvent.spawn(feat, { map, x: 5, y: 5 });
    expect(cell.ground).toEqual("FLOOR");
    expect(cell.surface).toEqual(null);
  });

  test("can do waves", async () => {
    const wave: Map.tile.Tile = Map.tiles.WAVE;
    const waveTick = wave.activates.tick;
    expect(waveTick.flags).toEqual(
      Map.tileEvent.Flags.DFF_NULLIFY_CELL |
        Map.tileEvent.Flags.DFF_SUBSEQ_ALWAYS
    );

    map.fill(LAKE);
    for (let i = 0; i < map.width; ++i) {
      map.setTile(i, 8, "BRIDGE");
    }
    map.setTile(10, 10, WAVE);

    expect(UTILS.countTile(map, "BRIDGE")).toEqual(map.width);

    await map.tick();
    // map.dump();
    expect(map.hasTile(10, 10, ROUGH_WATER)).toBeTruthy();
    expect(UTILS.countTile(map, ROUGH_WATER)).toEqual(1);
    expect(UTILS.countTile(map, WAVE)).toEqual(4);

    expect(UTILS.countTile(map, "BRIDGE")).toEqual(map.width);

    await map.tick();
    // map.dump();
    expect(map.hasTile(10, 10, LAKE)).toBeTruthy();
    expect(UTILS.countTile(map, ROUGH_WATER)).toEqual(4);
    expect(UTILS.countTile(map, WAVE)).toEqual(8);

    expect(UTILS.countTile(map, "BRIDGE")).toEqual(map.width - 1);

    await map.tick();
    // map.dump();
    expect(map.hasTile(10, 10, LAKE)).toBeTruthy();
    expect(UTILS.countTile(map, ROUGH_WATER)).toEqual(8);
    expect(UTILS.countTile(map, WAVE)).toEqual(12);

    expect(UTILS.countTile(map, "BRIDGE")).toEqual(map.width - 3);

    await map.tick();
    // map.dump();
    expect(map.hasTile(10, 10, LAKE)).toBeTruthy();
    expect(UTILS.countTile(map, ROUGH_WATER)).toEqual(12);
    expect(UTILS.countTile(map, WAVE)).toEqual(16);

    expect(UTILS.countTile(map, "BRIDGE")).toEqual(map.width - 5);

    for (let i = 0; i < 5; ++i) {
      await map.tick();
    }

    // map.dump();
    await map.tick();
    // map.dump();

    expect(map.hasTile(19, 10, ROUGH_WATER)).toBeTruthy();

    // expect(UTILS.countTile(map, WAVE)).toEqual(0);
  });

  test("can do waves - in turbulent waters", async () => {
    map.fill(LAKE);
    map.setTile(10, 10, WAVE);

    await map.tick();
    // map.dump();
    expect(map.hasTile(10, 10, ROUGH_WATER)).toBeTruthy();
    expect(UTILS.countTile(map, ROUGH_WATER)).toEqual(1);
    expect(UTILS.countTile(map, WAVE)).toEqual(4);

    // begin map.tick
    map.forEach(
      (c) =>
        (c.mechFlags &= ~(
          Map.cell.MechFlags.EVENT_FIRED_THIS_TURN |
          Map.cell.MechFlags.EVENT_PROTECTED
        ))
    );
    // map.forEach( (c) => c.mechFlags &= ~Map.cell.MechFlags.EVENT_PROTECTED);

    map.setCellFlags(8, 10, Map.cell.MechFlags.EVENT_FIRED_THIS_TURN); // fake another event was fired (should still overwrite)

    for (let x = 0; x < map.width; ++x) {
      for (let y = 0; y < map.height; ++y) {
        const cell = map.cells[x][y];
        await cell.activate("tick", { map, x, y, cell, safe: true });
      }
    }
    // end map.tick

    // map.dump();
    expect(map.hasTile(10, 10, LAKE)).toBeTruthy();
    expect(UTILS.countTile(map, ROUGH_WATER)).toEqual(4);
    expect(UTILS.countTile(map, WAVE)).toEqual(8);

    await map.tick();
    // map.dump();
    expect(map.hasTile(10, 10, LAKE)).toBeTruthy();
    expect(UTILS.countTile(map, ROUGH_WATER)).toEqual(8);
    expect(UTILS.countTile(map, WAVE)).toEqual(12);
  });

  // { tile: 'DOOR', line }
  test('{ tile: "DOOR", line }', async () => {
    GW.random.seed(12345);
    const feat = GW.make.tileEvent({
      tile: "DOOR",
      flags: "DFF_SPREAD_LINE",
      spread: 200,
      decrement: 50,
    })!;

    await Map.tileEvent.spawn(feat, ctx);

    // map.dump();

    expect(map.hasTile(10, 10, "DOOR")).toBeTruthy();
    expect(map.hasTile(10, 11, "DOOR")).toBeTruthy();
    expect(map.hasTile(10, 12, "DOOR")).toBeTruthy();
    expect(map.hasTile(10, 13, "DOOR")).toBeTruthy();
    // expect(map.hasTile(10, 14, "DOOR")).toBeTruthy();

    expect(map.cells.count((c) => c.hasTile("DOOR"))).toEqual(4);
  });

  test("Will add liquids with volume", async () => {
    Map.tile.install("RED_LIQUID", {
      name: "red liquid",
      article: "some",
      bg: "red",
      depth: "LIQUID",
    });

    const feat = GW.make.tileEvent({ tile: "RED_LIQUID", volume: 50 })!;
    await Map.tileEvent.spawn(feat, ctx);

    const cell = map.cell(ctx.x, ctx.y);
    expect(cell.liquid).toEqual("RED_LIQUID");
    expect(cell.liquidVolume).toEqual(50);
  });

  test("spawn fn", async () => {
    const fn = jest.fn().mockReturnValue(true);
    Map.tile.install("RED_LIQUID", {
      name: "red liquid",
      article: "some",
      bg: "red",
      depth: "LIQUID",
      activates: {
        fire: { fn },
      },
    });

    const cell = map.cell(ctx.x, ctx.y);
    cell.setTile("RED_LIQUID", 100);

    await cell.activate("fire", ctx);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  test("evacuateCreatures", async () => {
    Map.tile.install("RED_LIQUID", {
      name: "red liquid",
      article: "some",
      bg: "red",
      depth: "LIQUID",
      activates: {
        fire: { flags: "DFF_EVACUATE_CREATURES" },
      },
    });

    const cell = map.cell(ctx.x, ctx.y);
    cell.setTile("RED_LIQUID", 100);
    const actor = {
      forbidsCell: jest.fn().mockReturnValue(false),
      x: -1,
      y: -1,
      sprite: { ch: "!" },
      isDetected() {
        return false;
      },
      isPlayer() {
        return false;
      },
      blocksVision() {
        return false;
      },
    };
    // @ts-ignore
    map.addActor(ctx.x, ctx.y, actor);
    expect(actor).toBeAtXY(ctx.x, ctx.y);
    expect(cell.actor).toBe(actor);
    grid[ctx.x][ctx.y] = 1;

    await cell.activate("fire", ctx);
    expect(actor.forbidsCell).toHaveBeenCalled();
    expect(actor).not.toBeAtXY(ctx.x, ctx.y);
    expect(cell.actor).toBeNull();
  });

  test("evacuateItems", async () => {
    Map.tile.install("RED_LIQUID", {
      name: "red liquid",
      article: "some",
      bg: "red",
      depth: "LIQUID",
      activates: {
        fire: { flags: "DFF_EVACUATE_ITEMS" },
      },
    });

    const cell = map.cell(ctx.x, ctx.y);
    cell.setTile("RED_LIQUID", 100);
    const item = {
      forbidsCell: jest.fn().mockReturnValue(false),
      x: -1,
      y: -1,
      sprite: { ch: "!" },
      isDetected() {
        return false;
      },
    };
    // @ts-ignore
    map.addItem(ctx.x, ctx.y, item);
    expect(item).toBeAtXY(ctx.x, ctx.y);
    expect(cell.item).toBe(item);
    grid[ctx.x][ctx.y] = 1;

    await cell.activate("fire", ctx);
    expect(item.forbidsCell).toHaveBeenCalled();
    expect(item).not.toBeAtXY(ctx.x, ctx.y);
    expect(cell.item).toBeNull();
  });
});
