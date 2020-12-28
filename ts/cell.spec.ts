import "jest-extended";
import "../test/matchers";
import * as Tile from "./tile";
import * as Cell from "./cell";
import "./tiles";
import * as GW from "gw-utils";

describe("CellMemory", () => {
  beforeAll(() => {
    Tile.install("TEST_FLOOR", {
      name: "floor",
      ch: ".",
      fg: [80, 80, 80],
      bg: [20, 20, 20],
    });
    Tile.install("RED_LIQUID", {
      name: "red liquid",
      article: "some",
      bg: "red",
      layer: "LIQUID",
    });
    Tile.install("BLUE_LIQUID", {
      name: "blue liquid",
      article: "some",
      bg: "blue",
      layer: "LIQUID",
    });
  });

  afterAll(() => {
    delete Tile.tiles.TEST_FLOOR;
    delete Tile.tiles.RED_LIQUID;
    delete Tile.tiles.BLUE_LIQUID;
  });

  test("_setTile(0) - can clear tile", () => {
    const c = Cell.make();
    c._setTile("FLOOR");
    expect(c.ground).toEqual("FLOOR");

    c._setTile(null);
    expect(c.ground).toEqual(null);
  });

  test("will copy another memory object", () => {
    const a = new Cell.CellMemory();
    const b = new Cell.CellMemory();

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

  test("_setTile", () => {
    const c = Cell.make();

    expect(Tile.tiles.FLOOR.priority).toBeLessThan(Tile.tiles.DOOR.priority);

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

  test("will keep sprites in sorted order by layer, priority increasing", () => {
    const c = Cell.make();

    c.addSprite(6, GW.make.sprite("@"));
    expect(c.sprites).toEqual({
      layer: 6,
      sprite: { ch: "@", fg: GW.colors.white, bg: -1 },
      priority: 50,
      next: null,
    });

    c.addSprite(4, GW.make.sprite("i"));
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
    const c = Cell.make();
    c._setTile("FLOOR");

    const a = GW.canvas.makeSprite("@", "white", "blue");
    const b = GW.canvas.makeSprite(null, null, "red");

    c.addSprite(1, a);
    c.addSprite(2, b, 100);

    expect(c.sprites).not.toBeNull();
    expect(c.sprites!.sprite).toBe(a);
    expect(c.sprites!.next!.sprite).toBe(b);

    const app = new GW.canvas.Mixer();
    Cell.getAppearance(c, app);

    const ex = GW.canvas.makeSprite("@", "white", "red");
    expect(app).toEqual(ex);
  });

  test("layers will blend opacities", () => {
    GW.cosmetic.seed(12345);
    const c = Cell.make();
    c._setTile("FLOOR");

    const a = GW.canvas.makeSprite("@", "white", "blue");
    const b = GW.canvas.makeSprite(null, null, "red", 50);
    expect(b.opacity).toEqual(50);

    c.clearFlags(Cell.Flags.CELL_CHANGED);
    c.addSprite(1, a);
    expect(c.flags & Cell.Flags.CELL_CHANGED).toBeTruthy();
    c.addSprite(2, b, 100);

    expect(c.sprites).not.toBeNull();
    expect(c.sprites!.sprite).toBe(a);
    expect(c.sprites!.next!.sprite).toBe(b);

    const app = new GW.canvas.Mixer();
    Cell.getAppearance(c, app);

    const ex = GW.canvas.makeSprite("@", "white", [50, 0, 50]);
    expect(app.ch).toEqual(ex.ch);
    expect(app.fg).toEqual(ex.fg);
    expect(app.bg).toEqual(ex.bg);

    c.clearFlags(Cell.Flags.CELL_CHANGED);
    c.removeSprite(a);
    expect(c.flags & Cell.Flags.CELL_CHANGED).toBeTruthy();
    c.removeSprite(b);

    app.blackOut();
    Cell.getAppearance(c, app);
    const FLOOR = Tile.tiles.FLOOR.sprite;
    expect(app.ch).toEqual(FLOOR.ch);
    expect(app.fg).toBakeFrom(FLOOR.fg);
    expect(app.bg).toBakeFrom(FLOOR.bg);
  });

  test("will set liquid with volume", () => {
    GW.cosmetic.seed(12345);
    const FLOOR = Tile.tiles.TEST_FLOOR.sprite;
    const c = Cell.make();
    c._setTile("TEST_FLOOR");

    const app = new GW.canvas.Mixer();
    Cell.getAppearance(c, app);
    expect(app.ch).toEqual(FLOOR.ch);
    expect(app.bg).toEqual([20, 20, 20, 0, 0, 0, 0]);
    expect(app.fg).toEqual([80, 80, 80, 0, 0, 0, 0]);

    expect(Tile.tiles.RED_LIQUID).toBeObject();
    expect(Tile.tiles.RED_LIQUID.layer).toEqual(Tile.Layer.LIQUID);

    c._setTile("RED_LIQUID", 100);
    expect(c.liquid).toEqual("RED_LIQUID");
    expect(c.liquidVolume).toEqual(100);
    Cell.getAppearance(c, app);
    expect(app.ch).toEqual(FLOOR.ch);
    expect(app.bg).toEqual([100, 0, 0, 0, 0, 0, 0]);
    expect(app.fg).toEqual([80, 80, 80, 0, 0, 0, 0]);

    c.clearLayer(Tile.Layer.LIQUID);
    expect(c.liquid).toEqual(null);
    expect(c.liquidVolume).toEqual(0);
    Cell.getAppearance(c, app);
    expect(app.ch).toEqual(FLOOR.ch);
    expect(app.bg).toEqual([20, 20, 20, 0, 0, 0, 0]);
    expect(app.fg).toEqual([80, 80, 80, 0, 0, 0, 0]);

    c._setTile("RED_LIQUID", 50);
    expect(c.liquid).toEqual("RED_LIQUID");
    expect(c.liquidVolume).toEqual(50);
    Cell.getAppearance(c, app);
    expect(app.ch).toEqual(FLOOR.ch);
    expect(app.bg).toEqual([60, 10, 10, 0, 0, 0, 0]);
    expect(app.fg).toEqual([80, 80, 80, 0, 0, 0, 0]);

    c._setTile("BLUE_LIQUID", 10);
    expect(c.liquid).toEqual("BLUE_LIQUID");
    expect(c.liquidVolume).toEqual(10);
    Cell.getAppearance(c, app);
    expect(app.ch).toEqual(FLOOR.ch);
    expect(app.bg).toEqual([16, 16, 36, 0, 0, 0, 0]);
    expect(app.fg).toEqual([80, 80, 80, 0, 0, 0, 0]);
  });

  test("will add liquid volumes", () => {
    GW.cosmetic.seed(12345);
    const FLOOR = Tile.tiles.TEST_FLOOR.sprite;
    const c = Cell.make();
    c._setTile("TEST_FLOOR");

    const app = new GW.canvas.Mixer();
    Cell.getAppearance(c, app);
    expect(app.ch).toEqual(FLOOR.ch);
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

    c.clearLayer(Tile.Layer.LIQUID);
    expect(c.liquid).toEqual(null);
    expect(c.liquidVolume).toEqual(0);
  });
});
