import "jest-extended";
import "../test/matchers";
import { mockRandom, rnd } from "../test/utils";
import * as Map from "./gw";
import * as GW from "gw-utils";

describe("Map", () => {
  beforeEach(() => {
    mockRandom();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test("constructor", () => {
    const map = GW.make.map(10, 10);
    expect(map.width).toEqual(10);
    expect(map.height).toEqual(10);
    expect(map.id).toBeUndefined();

    expect(map.hasXY(3, 3)).toBeTruthy();
    expect(map.hasXY(30, 3)).toBeFalsy();

    // You need to validate the XY before getting the cell
    expect(map.cell(3, 3)).toBeDefined();
    expect(() => map.cell(30, 3)).toThrow();
  });

  test("constructor with id", () => {
    const map = GW.make.map(10, 10, { id: 1 });
    expect(map.width).toEqual(10);
    expect(map.height).toEqual(10);
    expect(map.id).toEqual(1);
  });

  test("setTile", () => {
    GW.cosmetic.seed(12345);

    const map = GW.make.map(10, 10);
    expect(Map.tiles.FLOOR).toBeDefined();

    map.setTile(2, 2, "FLOOR");

    const sprite = new GW.canvas.Mixer();
    Map.map.getCellAppearance(map, 2, 2, sprite);
    expect(sprite.ch).toEqual(Map.tiles.FLOOR.sprite.ch);
    expect(sprite.fg).toBakeFrom(Map.tiles.FLOOR.sprite.fg);
    expect(sprite.bg).toBakeFrom(Map.tiles.FLOOR.sprite.bg);

    map.setTile(2, 2, "DOOR"); // can use tile name too (slower)

    Map.map.getCellAppearance(map, 2, 2, sprite);
    expect(sprite.ch).toEqual(Map.tiles.DOOR.sprite.ch);
    expect(sprite.fg).toBakeFrom(Map.tiles.DOOR.sprite.fg);
    expect(sprite.bg).toBakeFrom(Map.tiles.DOOR.sprite.bg);
  });

  test("getLine", () => {
    const map = GW.make.map(10, 10);
    const line = GW.utils.getLineThru(1, 1, 7, 8, map.width, map.height);
    expect(line).not.toContainEqual([1, 1]);
    expect(line).toContainEqual([7, 8]);
    expect(line).toEqual([
      [2, 2],
      [3, 3],
      [4, 4],
      [4, 5],
      [5, 6],
      [6, 7],
      [7, 8],
      [8, 9],
    ]);
    expect(line.length).toEqual(8);
  });

  describe("liquids", () => {
    beforeAll(() => {
      Map.tile.install("RED_LIQUID", {
        name: "red liquid",
        layer: "LIQUID",
      });
    });

    afterAll(() => {
      delete Map.tiles.RED_LIQUID;
    });

    test("liquids dissipate", async () => {
      GW.random.seed(12345);
      const map = GW.make.map(10, 10);
      map.setTile(5, 5, "RED_LIQUID", 50);
      const cell = map.cell(5, 5);
      expect(cell.liquidVolume).toEqual(50);
      expect(map.cell(4, 5).liquidVolume).toEqual(0);

      await map.tick();
      expect(cell.liquidVolume).toEqual(39);
      expect(map.cell(4, 5).liquidVolume).toEqual(0);

      await map.tick();
      expect(cell.liquidVolume).toEqual(30);
      expect(map.cell(4, 5).liquidVolume).toEqual(0);

      rnd.mockReturnValue(0); // force dissipate
      expect(cell.liquidTile.dissipate).toBeGreaterThan(0);
      while (cell.liquidVolume > 0) {
        await map.tick();
      }

      expect(cell.liquid).toEqual(null);
    });
  });
});
