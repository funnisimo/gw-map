import "jest-extended";
import "../test/matchers";
import * as UTILS from "../test/utils";
import * as Map from "./gw";
import * as GW from "gw-utils";

describe("Cell", () => {
  beforeAll(() => {
    Map.tile.install("TEST_FLOOR", {
      name: "floor",
      ch: ".",
      fg: [80, 80, 80],
      bg: [20, 20, 20],
    });
    Map.tile.install("RED_LIQUID", {
      name: "red liquid",
      article: "some",
      bg: "red",
      flags: "TM_EXTINGUISHES_FIRE, T_DEEP_WATER",
      layer: "LIQUID",
    });
    Map.tile.install("BLUE_LIQUID", {
      name: "blue liquid",
      article: "some",
      bg: "blue",
      flags: "TM_STAND_IN_TILE",
      layer: "LIQUID",
    });
    Map.tile.install("RED_GAS", {
      name: "red gas",
      article: "some",
      bg: "red",
      flags:
        "T_SPONTANEOUSLY_IGNITES, T_IS_FLAMMABLE, T_CAUSES_EXPLOSIVE_DAMAGE, T_GAS",
      layer: "GAS",
    });
    Map.tile.install("BLUE_GAS", {
      name: "blue gas",
      article: "some",
      bg: "blue",
      flags: "T_IS_FLAMMABLE, T_GAS",
      layer: "GAS",
    });
    Map.tile.install({
      id: "ENTER",
      ch: "!",
      fg: "red",
      activates: {
        enter: "FLOOR",
      },
    });
    Map.tile.install({
      id: "LOW_CHANCE",
      ch: "!",
      fg: "red",
      activates: {
        enter: { tile: "FLOOR", chance: 1 },
      },
    });
  });

  afterAll(() => {
    delete Map.tiles.TEST_FLOOR;
    delete Map.tiles.RED_LIQUID;
    delete Map.tiles.BLUE_LIQUID;
    delete Map.tiles.RED_GAS;
    delete Map.tiles.BLUE_GAS;
    delete Map.tiles.ENTER;
    delete Map.tiles.LOW_CHANCE;
  });

  test("blocksPathing", () => {
    const cell = GW.make.cell("FLOOR");
    expect(cell.blocksPathing()).toBeFalsy();
    expect(cell.blocksPathing(true)).toBeFalsy();
    cell._setTile("WALL");
    expect(cell.blocksPathing()).toBeTruthy();
    expect(cell.blocksPathing(true)).toBeTruthy();

    cell.flags &= ~Map.cell.Flags.IS_WAS_ANY_KIND_OF_VISIBLE;
    expect(cell.blocksPathing()).toBeTruthy();
    expect(cell.blocksPathing(true)).toBeFalsy();

    cell.storeMemory();
    expect(cell.blocksPathing()).toBeTruthy();
    expect(cell.blocksPathing(true)).toBeTruthy();
  });

  test("blocksVision", () => {
    const cell = GW.make.cell("FLOOR");
    expect(cell.blocksVision()).toBeFalsy();
    cell._setTile("WALL");
    expect(cell.blocksVision()).toBeTruthy();
  });

  test("isLiquid", () => {
    const cell = GW.make.cell("FLOOR");

    expect(cell.isLiquid()).toBeFalsy();
    expect(cell.isLiquid(true)).toBeFalsy();

    cell._setTile("BLUE_LIQUID", 100);
    expect(
      Map.tiles.BLUE_LIQUID.flags & Map.tile.Flags.T_IS_LIQUID
    ).toBeFalsy();
    expect(cell.isAnyKindOfVisible()).toBeTruthy();
    expect(cell.isLiquid()).toBeFalsy();
    expect(cell.isLiquid(true)).toBeFalsy();

    cell._setTile("LAKE");
    expect(Map.tiles.LAKE.flags & Map.tile.Flags.T_IS_LIQUID).toBeTruthy();
    expect(cell.isLiquid()).toBeTruthy();
    expect(cell.isLiquid(true)).toBeTruthy();

    cell.flags &= ~Map.cell.Flags.ANY_KIND_OF_VISIBLE;
    expect(cell.isAnyKindOfVisible()).toBeFalsy();
    expect(cell.isLiquid()).toBeTruthy();
    expect(cell.isLiquid(true)).toBeFalsy();

    cell.storeMemory();
    expect(cell.isLiquid()).toBeTruthy();
    expect(cell.isLiquid(true)).toBeTruthy();
  });

  test("hasGas", () => {
    const cell = GW.make.cell("FLOOR");

    expect(cell.hasGas()).toBeFalsy();
    expect(cell.hasGas(true)).toBeFalsy();

    cell._setTile("RED_GAS", 100);
    expect(cell.isAnyKindOfVisible()).toBeTruthy();
    expect(cell.hasGas()).toBeTruthy();
    expect(cell.hasGas(true)).toBeTruthy();

    cell.flags &= ~Map.cell.Flags.ANY_KIND_OF_VISIBLE;
    expect(cell.isAnyKindOfVisible()).toBeFalsy();
    expect(cell.hasGas()).toBeTruthy();
    expect(cell.hasGas(true)).toBeFalsy();

    cell.storeMemory();
    expect(cell.hasGas()).toBeTruthy();
    expect(cell.hasGas(true)).toBeTruthy();
  });

  test("markRevealed", () => {
    const cell = GW.make.cell("FLOOR");
    expect(cell.flags & Map.cell.Flags.REVEALED).toBeFalsy();
    expect(cell.markRevealed()).toBeTruthy();
    expect(cell.flags & Map.cell.Flags.REVEALED).toBeTruthy();

    cell.flags |= Map.cell.Flags.STABLE_MEMORY;
    expect(cell.markRevealed()).toBeFalsy();
    expect(cell.flags & Map.cell.Flags.STABLE_MEMORY).toBeFalsy();

    cell._setTile("WALL");
    cell.flags = 0;
    expect(cell.flags & Map.cell.Flags.REVEALED).toBeFalsy();
    expect(cell.markRevealed()).toBeFalsy(); // no open space revealed
    expect(cell.flags & Map.cell.Flags.REVEALED).toBeTruthy();
  });

  test("_setTile(null) - can clear tile", () => {
    const c = GW.make.cell();
    c._setTile("FLOOR");
    expect(c.ground).toEqual("FLOOR");

    c._setTile(null);
    expect(c.ground).toEqual(null);
  });

  test("setTile(BRIDGE) will also set ground if null", () => {
    const cell = GW.make.cell();
    expect(cell.isNull()).toBeTruthy();
    expect(cell.ground).toBeNull();
    expect(cell.surface).toBeNull();

    cell._setTile("BRIDGE");
    expect(cell.ground).toEqual("FLOOR");
    expect(cell.surface).toEqual("BRIDGE");
    expect(cell.isNull()).toBeFalsy();
  });

  test("setTile(FIRE) - sets caught fire flag", () => {
    const fire = GW.make.tile({
      id: "FIRE",
      flags: "T_IS_FIRE",
      ch: "^",
      fg: "red",
    });

    const cell = GW.make.cell("FLOOR");
    cell._setTile(fire);
    expect(
      cell.mechFlags & Map.cell.MechFlags.CAUGHT_FIRE_THIS_TURN
    ).toBeTruthy();
  });

  test("setTile(UNKNOWN) - will throw", () => {
    const cell = GW.make.cell("FLOOR");
    expect(() => cell._setTile("UNKNOWN")).toThrow();
  });

  test("_setTile", () => {
    const c = GW.make.cell();

    expect(Map.tiles.FLOOR.priority).toBeLessThan(Map.tiles.DOOR.priority);

    const floor = "FLOOR";
    const wall = "WALL";

    expect(c.ground).toEqual(null);
    c._setTile(floor);
    expect(c.ground).toEqual(floor);
    c._setTile(wall);
    expect(c.ground).toEqual(wall);
    // c._setTile(floor, true); // checks priority
    // expect(c.ground).toEqual(wall);  // 2 has better priority
    c._setTile(floor);
    expect(c.ground).toEqual(floor); // ignored priority
  });

  test("CellMemory - will copy another memory object", () => {
    const a = new Map.cell.CellMemory();
    const b = new Map.cell.CellMemory();

    a.mixer.draw("a");
    a.tileFlags = 1;
    a.cellFlags = 1;

    b.mixer.draw("b");
    b.tileFlags = 2;
    b.tileFlags = 2;

    expect(a.mixer).not.toBe(b.mixer);
    a.copy(b);
    expect(a.mixer).not.toBe(b.mixer);
    expect(a.mixer.ch).toEqual("b");
    expect(a.tileFlags).toEqual(2);
    expect(a.tileFlags).toEqual(2);
  });

  test("will keep sprites in sorted order by layer, priority increasing", () => {
    const c = GW.make.cell();

    c.addSprite(GW.make.sprite("@"), 6);
    expect(c.sprites).toEqual({
      layer: 6,
      sprite: { ch: "@", fg: GW.colors.white, bg: -1 },
      priority: 50,
      next: null,
    });

    c.addSprite(GW.make.sprite("i"), 4);
    expect(c.sprites).toMatchObject({
      layer: 4,
      sprite: { ch: "i", fg: GW.colors.white, bg: -1 },
      priority: 50,
    });
    expect(c.sprites!.next).toEqual({
      layer: 6,
      sprite: { ch: "@", fg: GW.colors.white, bg: -1 },
      priority: 50,
      next: null,
    });
  });

  test("can support many layers", () => {
    const c = GW.make.cell();
    c._setTile("FLOOR");

    const a = GW.canvas.makeSprite("@", "white", "blue");
    const b = GW.canvas.makeSprite(null, null, "red");

    c.addSprite(a, Map.tile.Layer.FX);
    c.addSprite(b, Map.tile.Layer.UI, 100);

    expect(c.sprites).not.toBeNull();
    expect(c.sprites!.sprite).toBe(Map.tiles.FLOOR.sprite);
    expect(c.sprites!.next!.sprite).toBe(a);
    expect(c.sprites!.next!.next!.sprite).toBe(b);

    const app = new GW.canvas.Mixer();
    Map.cell.getAppearance(c, app);

    const ex = GW.canvas.makeSprite("@", "white", "red");
    expect(app).toEqual(ex);
  });

  test("layers will blend opacities", () => {
    GW.cosmetic.seed(12345);
    const c = GW.make.cell();
    c._setTile("FLOOR");

    const a = GW.canvas.makeSprite("@", "white", "blue");
    const b = GW.canvas.makeSprite(null, null, "red", 50);
    expect(b.opacity).toEqual(50);

    c.clearFlags(Map.cell.Flags.CELL_CHANGED);
    c.addSprite(a, Map.tile.Layer.FX);
    expect(c.flags & Map.cell.Flags.CELL_CHANGED).toBeTruthy();
    c.addSprite(b, Map.tile.Layer.UI, 100);

    expect(c.sprites).not.toBeNull();
    expect(c.sprites!.next!.sprite).toBe(a);
    expect(c.sprites!.next!.next!.sprite).toBe(b);

    const app = new GW.canvas.Mixer();
    Map.cell.getAppearance(c, app);

    const ex = GW.canvas.makeSprite("@", "white", [50, 0, 50]);
    expect(app.ch).toEqual(ex.ch);
    expect(app.fg).toEqual(ex.fg);
    expect(app.bg).toEqual(ex.bg);

    c.clearFlags(Map.cell.Flags.CELL_CHANGED);
    c.removeSprite(a);
    expect(c.flags & Map.cell.Flags.CELL_CHANGED).toBeTruthy();
    c.removeSprite(b);

    app.blackOut();
    Map.cell.getAppearance(c, app);
    const FLOOR = Map.tiles.FLOOR.sprite;
    expect(app.ch).toEqual(FLOOR.ch);
    expect(app.fg).toBakeFrom(FLOOR.fg);
    expect(app.bg).toBakeFrom(FLOOR.bg);
  });

  test("memory", () => {
    const c = GW.make.cell("FLOOR");
    c.storeMemory();
    expect(c.memory.item).toBeNull();
    expect(c.memory.itemQuantity).toEqual(0);
    expect(c.memory.actor).toBeNull();
    expect(c.memory.tile).toBe(Map.tiles.FLOOR);
    expect(c.memory.cellFlags).toEqual(
      Map.cell.Flags.VISIBLE |
        Map.cell.Flags.IN_FOV |
        Map.cell.Flags.NEEDS_REDRAW |
        Map.cell.Flags.CELL_CHANGED
    );
    expect(c.memory.cellMechFlags).toEqual(0);
    expect(c.memory.tileFlags).toEqual(0);
    expect(c.memory.tileMechFlags).toEqual(0);
    const FLOOR = Map.tiles.FLOOR.sprite;
    expect(c.memory.mixer.ch).toEqual(FLOOR.ch);
    expect(c.memory.mixer.fg).toBakeFrom(FLOOR.fg);
    expect(c.memory.mixer.bg).toBakeFrom(FLOOR.bg);

    const item = {
      quantity: 1,
      sprite: { ch: "!", fg: "white" },
    };

    const actor: GW.types.ActorType = {
      rememberedInCell: null,
      sprite: { ch: "@", fg: GW.colors.blue, bg: -1 },
    } as GW.types.ActorType;

    c.item = item;
    c.actor = actor;

    c.storeMemory();
    expect(c.memory.item).toBe(item);
    expect(c.memory.itemQuantity).toEqual(item.quantity);
    expect(c.memory.actor).toBe(actor);
    expect(c.memory.tile).toBe(Map.tiles.FLOOR);
    expect(c.memory.cellFlags).toEqual(
      Map.cell.Flags.VISIBLE |
        Map.cell.Flags.IN_FOV |
        Map.cell.Flags.NEEDS_REDRAW |
        Map.cell.Flags.CELL_CHANGED |
        Map.cell.Flags.HAS_ACTOR |
        Map.cell.Flags.HAS_ITEM
    );
    expect(c.memory.cellMechFlags).toEqual(0);
    expect(c.memory.tileFlags).toEqual(0);
    expect(c.memory.tileMechFlags).toEqual(0);
    expect(c.memory.mixer.ch).toEqual(actor.sprite.ch);
    expect(c.memory.mixer.fg).toBakeFrom(actor.sprite.fg);
    expect(c.memory.mixer.bg).toBakeFrom(Map.tiles.FLOOR.sprite.bg);

    const otherCell = ({
      storeMemory: jest.fn().mockReturnValue(undefined),
      flags: 0,
    } as unknown) as GW.types.CellType;

    actor.rememberedInCell = otherCell;
    c.storeMemory();
    expect(otherCell.storeMemory).toHaveBeenCalled();
    expect(otherCell.flags).toBeGreaterThan(0);
  });

  test("will set liquid with volume", () => {
    GW.cosmetic.seed(12345);
    const FLOOR = Map.tiles.TEST_FLOOR;
    const c = GW.make.cell();
    c._setTile("TEST_FLOOR");

    const app = new GW.canvas.Mixer();
    Map.cell.getAppearance(c, app);
    expect(app.ch).toEqual(FLOOR.sprite.ch);
    expect(app.bg).toEqual([20, 20, 20, 0, 0, 0, 0]);
    expect(app.fg).toEqual([80, 80, 80, 0, 0, 0, 0]);

    expect(Map.tiles.RED_LIQUID).toBeObject();
    expect(Map.tiles.RED_LIQUID.layer).toEqual(Map.tile.Layer.LIQUID);

    c._setTile("RED_LIQUID", 100);
    expect(c.liquid).toEqual("RED_LIQUID");
    expect(c.liquidVolume).toEqual(100);
    Map.cell.getAppearance(c, app);
    expect(app.ch).toEqual(FLOOR.sprite.ch);
    expect(app.bg).toEqual([100, 0, 0, 0, 0, 0, 0]);
    expect(app.fg).toEqual([80, 80, 80, 0, 0, 0, 0]);

    c.clearLayer(Map.tile.Layer.LIQUID);
    expect(c.liquid).toEqual(null);
    expect(c.liquidVolume).toEqual(0);
    Map.cell.getAppearance(c, app);
    expect(app.ch).toEqual(FLOOR.sprite.ch);
    expect(app.bg).toEqual([20, 20, 20, 0, 0, 0, 0]);
    expect(app.fg).toEqual([80, 80, 80, 0, 0, 0, 0]);

    c._setTile("RED_LIQUID", 50);
    expect(c.liquid).toEqual("RED_LIQUID");
    expect(c.liquidVolume).toEqual(50);
    Map.cell.getAppearance(c, app);
    expect(app.ch).toEqual(FLOOR.sprite.ch);
    expect(app.bg).toEqual([60, 10, 10, 0, 0, 0, 0]);
    expect(app.fg).toEqual([80, 80, 80, 0, 0, 0, 0]);

    c._setTile("BLUE_LIQUID", 10);
    expect(c.liquid).toEqual("BLUE_LIQUID");
    expect(c.liquidVolume).toEqual(10);
    Map.cell.getAppearance(c, app);
    expect(app.ch).toEqual(FLOOR.sprite.ch);
    expect(app.bg).toEqual([16, 16, 36, 0, 0, 0, 0]);
    expect(app.fg).toEqual([80, 80, 80, 0, 0, 0, 0]);
  });

  test("will add liquid volumes", () => {
    GW.cosmetic.seed(12345);
    const FLOOR = Map.tiles.TEST_FLOOR;
    const c = GW.make.cell();
    c._setTile("TEST_FLOOR");

    const app = new GW.canvas.Mixer();
    Map.cell.getAppearance(c, app);
    expect(app.ch).toEqual(FLOOR.sprite.ch);
    expect(app.bg).toEqual([20, 20, 20, 0, 0, 0, 0]);
    expect(app.fg).toEqual([80, 80, 80, 0, 0, 0, 0]);

    c._setTile("RED_LIQUID", 10);
    expect(c.liquid).toEqual("RED_LIQUID");
    expect(c.liquidVolume).toEqual(10);

    c._setTile("RED_LIQUID", 10);
    expect(c.liquid).toEqual("RED_LIQUID");
    expect(c.liquidVolume).toEqual(20);

    c._setTile("RED_LIQUID", 10);
    expect(c.liquid).toEqual("RED_LIQUID");
    expect(c.liquidVolume).toEqual(30);

    c._setTile("BLUE_LIQUID", 10);
    expect(c.liquid).toEqual("BLUE_LIQUID");
    expect(c.liquidVolume).toEqual(10);

    c.clearLayer(Map.tile.Layer.LIQUID);
    expect(c.liquid).toEqual(null);
    expect(c.liquidVolume).toEqual(0);
  });

  test("will add gas volumes", () => {
    GW.cosmetic.seed(12345);
    const FLOOR = Map.tiles.TEST_FLOOR;
    const c = GW.make.cell();
    c._setTile("TEST_FLOOR");

    const app = new GW.canvas.Mixer();
    Map.cell.getAppearance(c, app);
    expect(app.ch).toEqual(FLOOR.sprite.ch);
    expect(app.bg).toEqual([20, 20, 20, 0, 0, 0, 0]);
    expect(app.fg).toEqual([80, 80, 80, 0, 0, 0, 0]);

    c._setTile("RED_GAS", 10);
    expect(c.gas).toEqual("RED_GAS");
    expect(c.gasVolume).toEqual(10);
    Map.cell.getAppearance(c, app);
    expect(app.ch).toEqual(FLOOR.sprite.ch);
    expect(app.bg).toEqual([36, 16, 16, 0, 0, 0, 0]);
    expect(app.fg).toEqual([80, 80, 80, 0, 0, 0, 0]);

    c._setTile("RED_GAS", 10);
    expect(c.gas).toEqual("RED_GAS");
    expect(c.gasVolume).toEqual(20);

    c._setTile("RED_GAS", 10);
    expect(c.gas).toEqual("RED_GAS");
    expect(c.gasVolume).toEqual(30);

    c._setTile("BLUE_GAS", 10);
    expect(c.gas).toEqual("BLUE_GAS");
    expect(c.gasVolume).toEqual(10);

    c.clearLayer(Map.tile.Layer.GAS);
    expect(c.gas).toEqual(null);
    expect(c.gasVolume).toEqual(0);
  });

  test("sprites", () => {
    const cell = GW.make.cell("FLOOR");
    const mixer = new GW.make.mixer();
    const a = { bg: "blue", _n: "a" };
    const b = { ch: "!", fg: "green", _n: "b" };
    const c = { ch: null, fg: "red", _n: "c" };
    const d = { bg: "yellow", _n: "d" };
    const e = { bg: "orange", _n: "e" };

    const FLOOR = Map.tiles.FLOOR.sprite;
    Map.cell.getAppearance(cell, mixer);
    expect(mixer.ch).toEqual(FLOOR.ch);
    expect(mixer.fg).toBakeFrom(FLOOR.fg);
    expect(mixer.bg).toBakeFrom(FLOOR.bg);

    cell.addSprite(a, Map.tile.Layer.FX);
    Map.cell.getAppearance(cell, mixer);
    expect(mixer.ch).toEqual(FLOOR.ch);
    expect(mixer.fg).toBakeFrom(FLOOR.fg);
    expect(mixer.bg).toBakeFrom(GW.colors.blue);

    cell.addSprite(b, Map.tile.Layer.UI);
    Map.cell.getAppearance(cell, mixer);
    expect(mixer.ch).toEqual(b.ch);
    expect(mixer.fg).toBakeFrom(GW.colors.green);
    expect(mixer.bg).toBakeFrom(GW.colors.blue);

    cell.addSprite(c, Map.tile.Layer.GROUND);
    cell.addSprite(d, Map.tile.Layer.UI);
    Map.cell.getAppearance(cell, mixer);
    expect(mixer.ch).toEqual(b.ch);
    expect(mixer.fg).toBakeFrom(GW.colors.green);
    expect(mixer.bg).toBakeFrom(GW.colors.yellow);

    expect(cell.removeSprite(e)).toBeFalsy();

    cell.removeSprite(d);
    Map.cell.getAppearance(cell, mixer);
    expect(mixer.ch).toEqual(b.ch);
    expect(mixer.fg).toBakeFrom(GW.colors.green);
    expect(mixer.bg).toBakeFrom(GW.colors.blue);

    cell.removeSprite(c);
    cell.removeSprite(a);
    Map.cell.getAppearance(cell, mixer);
    expect(mixer.ch).toEqual(b.ch);
    expect(mixer.fg).toBakeFrom(GW.colors.green);
    expect(mixer.bg).toBakeFrom(FLOOR.bg);

    cell.removeSprite(b);
    Map.cell.getAppearance(cell, mixer);
    expect(mixer.ch).toEqual(FLOOR.ch);
    expect(mixer.fg).toBakeFrom(FLOOR.fg);
    expect(mixer.bg).toBakeFrom(FLOOR.bg);

    cell.addSprite(b, Map.tile.Layer.FX);
    cell.addSprite(a, Map.tile.Layer.UI);
    Map.cell.getAppearance(cell, mixer);
    expect(mixer.ch).toEqual(b.ch);
    expect(mixer.fg).toBakeFrom(GW.colors.green);
    expect(mixer.bg).toBakeFrom(GW.colors.blue);

    cell.removeSprite(b);
    cell.removeSprite(a);
    Map.cell.getAppearance(cell, mixer);
    expect(mixer.ch).toEqual(FLOOR.ch);
    expect(mixer.fg).toBakeFrom(FLOOR.fg);
    expect(mixer.bg).toBakeFrom(FLOOR.bg);
  });

  test("activatesOn", () => {
    const cell = GW.make.cell("ENTER");
    expect(cell.activatesOn("enter")).toBeTruthy();
    expect(cell.activatesOn("fire")).toBeFalsy();
  });

  test("activate", async () => {
    const cell = GW.make.cell("LOW_CHANCE");
    UTILS.mockRandom();
    expect(await cell.activate("enter", {})).toBeFalsy();
  });

  test("clearLayer", () => {
    const cell = GW.make.cell("FLOOR");
    cell._setTile("RED_LIQUID", 100);
    expect(cell.ground).toEqual("FLOOR");
    expect(cell.liquid).toEqual("RED_LIQUID");
    expect(cell.liquidVolume).toEqual(100);
    cell.clearLayer(Map.tile.Layer.LIQUID);
    expect(cell.ground).toEqual("FLOOR");
    expect(cell.liquid).toBeNull();
    expect(cell.liquidVolume).toEqual(0);

    cell._setTile("RED_GAS", 100);
    expect(cell.gas).toEqual("RED_GAS");
    expect(cell.gasVolume).toEqual(100);
    cell.clearLayer(Map.tile.Layer.GAS);
    expect(cell.ground).toEqual("FLOOR");
    expect(cell.gas).toBeNull();
    expect(cell.gasVolume).toEqual(0);
  });

  test("clearLayers", () => {
    const cell = GW.make.cell("ENTER");
    cell._setTile("BRIDGE");
    cell._setTile("RED_LIQUID", 100);
    cell._setTile("RED_GAS", 100);

    expect(cell.groundTile).toBe(Map.tiles.ENTER);
    expect(cell.surfaceTile).toBe(Map.tiles.BRIDGE);
    expect(cell.liquidTile).toBe(Map.tiles.RED_LIQUID);
    expect(cell.gasTile).toBe(Map.tiles.RED_GAS);

    cell.clearLayers(); // does not clear gas
    expect(cell.ground).toBe("ENTER");
    expect(cell.surface).toBeNull();
    expect(cell.liquid).toBeNull();
    expect(cell.gas).toEqual("RED_GAS");

    cell._setTile("BRIDGE");
    cell._setTile("RED_LIQUID", 100);
    cell._setTile("RED_GAS", 100);
    expect(cell.groundTile).toBe(Map.tiles.ENTER);
    expect(cell.surfaceTile).toBe(Map.tiles.BRIDGE);
    expect(cell.liquidTile).toBe(Map.tiles.RED_LIQUID);
    expect(cell.gasTile).toBe(Map.tiles.RED_GAS);

    cell.clearLayers(Map.tile.Layer.SURFACE, "FLOOR");
    expect(cell.groundTile).toBe(Map.tiles.FLOOR);
    expect(cell.surfaceTile).toBe(Map.tiles.BRIDGE);
    expect(cell.liquid).toBeNull();
    expect(cell.gasTile).toBe(Map.tiles.RED_GAS);
  });

  test("clarLayerWithFlags", () => {
    const cell = GW.make.cell("ENTER");
    cell._setTile("BRIDGE");
    cell._setTile("RED_LIQUID", 100);
    cell._setTile("RED_GAS", 100);

    expect(cell.groundTile).toBe(Map.tiles.ENTER);
    expect(cell.surfaceTile).toBe(Map.tiles.BRIDGE);
    expect(cell.liquidTile).toBe(Map.tiles.RED_LIQUID);
    expect(cell.gasTile).toBe(Map.tiles.RED_GAS);

    cell.clearLayersWithFlags(Map.tile.Flags.T_BRIDGE);
    expect(cell.groundTile).toBe(Map.tiles.ENTER);
    expect(cell.surface).toBeNull();
    expect(cell.liquidTile).toBe(Map.tiles.RED_LIQUID);
    expect(cell.gasTile).toBe(Map.tiles.RED_GAS);

    cell._setTile("BRIDGE");
    cell.clearLayersWithFlags(
      Map.tile.Flags.T_DEEP_WATER,
      Map.tile.MechFlags.TM_EXTINGUISHES_FIRE
    );
    expect(cell.groundTile).toBe(Map.tiles.ENTER);
    expect(cell.surfaceTile).toBe(Map.tiles.BRIDGE);
    expect(cell.liquid).toBeNull();
    expect(cell.gasTile).toBe(Map.tiles.RED_GAS);

    cell._setTile("RED_LIQUID", 100);
    cell.clearLayersWithFlags(0, Map.tile.MechFlags.TM_EXTINGUISHES_FIRE);
    expect(cell.groundTile).toBe(Map.tiles.ENTER);
    expect(cell.surfaceTile).toBe(Map.tiles.BRIDGE);
    expect(cell.liquid).toBeNull();
    expect(cell.gasTile).toBe(Map.tiles.RED_GAS);
  });
});
