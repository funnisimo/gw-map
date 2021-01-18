import "jest-extended";
import "../test/matchers";
import * as UTILS from "../test/utils";
import * as Map from "./gw";
import * as GW from "gw-utils";

describe("Map", () => {
  beforeEach(() => {
    UTILS.mockRandom();
  });

  afterEach(() => {
    jest.restoreAllMocks();
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

  test("make - ambient light", () => {
    const a = GW.make.map(10, 10, "FLOOR");
    expect(a.ambientLight).toBeNull();

    const b = GW.make.map(10, 10, { tile: "FLOOR", light: 0xfff });
    expect(b.ambientLight).toEqual(GW.colors.white);

    const c = GW.make.map(10, 10, { tile: "FLOOR", ambient: 0xf00 });
    expect(c.ambientLight).toEqual(GW.colors.red);

    const d = GW.make.map(10, 10, { tile: "FLOOR", ambientLight: 0x0f0 });
    expect(d.ambientLight).toEqual(GW.colors.green);
  });

  test("clear", () => {
    const map = GW.make.map(10, 10, "FLOOR", "WALL");
    expect(map.hasTile(3, 3, "FLOOR")).toBeTruthy();
    map.clear();
    expect(map.hasTile(3, 3, "FLOOR")).toBeFalsy();
    expect(map.changed).toBeTruthy();
  });

  test("dump", () => {
    jest.spyOn(console, "log").mockReturnValue(undefined);

    const map = GW.make.map(10, 10, "WALL");
    map.dump();
    expect(console.log).toHaveBeenCalled();

    // @ts-ignore
    console.log.mockClear();
    const fmt = jest.fn().mockReturnValue(" ");
    map.dump(fmt);
    expect(fmt).toHaveBeenCalledTimes(100);
    expect(console.log).toHaveBeenCalled();
  });

  test("changed", () => {
    const map = GW.make.map(10, 10, "FLOOR");
    expect(map.changed).toBeFalsy();
    expect(map.flags & Map.map.Flags.MAP_CHANGED).toBeFalsy();
    map.changed = true;
    expect(map.changed).toBeTruthy();
    expect(map.flags & Map.map.Flags.MAP_CHANGED).toBeTruthy();
    map.changed = false;
    expect(map.changed).toBeFalsy();
    expect(map.flags & Map.map.Flags.MAP_CHANGED).toBeFalsy();
  });

  test("has-XXX-Flag", () => {
    const map = GW.make.map(10, 10, "FLOOR", "WALL");
    map.setTile(3, 3, "UP_STAIRS");
    map.setCellFlags(3, 3, 0, Map.cell.MechFlags.IS_CHOKEPOINT);

    expect(map.hasCellFlag(3, 3, Map.cell.Flags.CELL_CHANGED)).toBeTruthy();
    expect(
      map.hasCellMechFlag(3, 3, Map.cell.MechFlags.IS_CHOKEPOINT)
    ).toBeTruthy();

    expect(
      map.hasLayerFlag(3, 3, Map.layer.Flags.L_BLOCKS_SURFACE)
    ).toBeTruthy();
    expect(map.hasTileFlag(3, 3, Map.tile.Flags.T_HAS_STAIRS)).toBeTruthy();
    expect(
      map.hasTileMechFlag(3, 3, Map.tile.MechFlags.TM_LIST_IN_SIDEBAR)
    ).toBeTruthy();
  });

  test("redrawCell", () => {
    const map = GW.make.map(10, 10, "FLOOR");
    expect(map.cell(3, 3).needsRedraw).toBeTruthy();
    map.cell(3, 3).needsRedraw = false;

    map.redrawXY(3, 3);
    expect(map.cell(3, 3).needsRedraw).toBeTruthy();

    map.cell(3, 3).needsRedraw = false;
    map.redrawCell(map.cell(3, 3));
    expect(map.cell(3, 3).needsRedraw).toBeTruthy();
  });

  test("redrawAll", () => {
    const map: Map.map.Map = GW.make.map(10, 10, "FLOOR");
    map.clearFlags(0, Map.cell.Flags.NEEDS_REDRAW);
    map.eachCell((c: Map.cell.Cell) => {
      expect(c.needsRedraw).toBeFalsy();
    });

    map.redrawAll();
    map.eachCell((c: Map.cell.Cell) => {
      expect(c.needsRedraw).toBeTruthy();
    });
  });

  test("revealAll + markRevealed", () => {
    const player = (GW.data.player = {
      invalidateCostMap: jest.fn(),
    });

    const map: Map.map.Map = GW.make.map(10, 10, "FLOOR");
    map.eachCell((c) => expect(c.flags & Map.cell.Flags.REVEALED).toBeFalsy());
    map.markRevealed(3, 3);
    expect(map.cell(3, 3).flags & Map.cell.Flags.REVEALED).toBeTruthy();
    expect(player.invalidateCostMap).toHaveBeenCalled();
    player.invalidateCostMap.mockClear();

    map.revealAll();
    map.eachCell((c) => expect(c.flags & Map.cell.Flags.REVEALED).toBeTruthy());
    expect(player.invalidateCostMap).toHaveBeenCalled();
  });

  test("visibility", () => {
    const map: Map.map.Map = GW.make.map(10, 10, "FLOOR");

    // defaults to a visible map
    expect(map.isVisible(3, 3)).toBeTruthy();
    expect(map.isAnyKindOfVisible(3, 3)).toBeTruthy();
    expect(map.isOrWasAnyKindOfVisible(3, 3)).toBeTruthy();

    map.clearFlags(0, Map.cell.Flags.IS_WAS_ANY_KIND_OF_VISIBLE);
    expect(map.isVisible(3, 3)).toBeFalsy();
    expect(map.isAnyKindOfVisible(3, 3)).toBeFalsy();
    expect(map.isOrWasAnyKindOfVisible(3, 3)).toBeFalsy();

    map.setCellFlags(3, 3, Map.cell.Flags.VISIBLE);
    expect(map.isVisible(3, 3)).toBeTruthy();
    expect(map.isAnyKindOfVisible(3, 3)).toBeTruthy();
    expect(map.isOrWasAnyKindOfVisible(3, 3)).toBeTruthy();

    // Magic Map is not "visible"
    map.clearFlags(0, Map.cell.Flags.IS_WAS_ANY_KIND_OF_VISIBLE);
    map.setCellFlags(3, 3, Map.cell.Flags.MAGIC_MAPPED);
    expect(map.isVisible(3, 3)).toBeFalsy();
    expect(map.isAnyKindOfVisible(3, 3)).toBeFalsy();
    expect(map.isOrWasAnyKindOfVisible(3, 3)).toBeFalsy();

    map.clearFlags(
      0,
      Map.cell.Flags.IS_WAS_ANY_KIND_OF_VISIBLE | Map.cell.Flags.MAGIC_MAPPED
    );
    map.setCellFlags(3, 3, Map.cell.Flags.CLAIRVOYANT_VISIBLE);
    expect(map.isVisible(3, 3)).toBeFalsy();
    expect(map.isAnyKindOfVisible(3, 3)).toBeTruthy();
    expect(map.isOrWasAnyKindOfVisible(3, 3)).toBeTruthy();

    map.clearFlags(0, Map.cell.Flags.IS_WAS_ANY_KIND_OF_VISIBLE);
    map.setCellFlags(3, 3, Map.cell.Flags.TELEPATHIC_VISIBLE);
    expect(map.isVisible(3, 3)).toBeFalsy();
    expect(map.isAnyKindOfVisible(3, 3)).toBeTruthy();
    expect(map.isOrWasAnyKindOfVisible(3, 3)).toBeTruthy();

    map.clearFlags(0, Map.cell.Flags.IS_WAS_ANY_KIND_OF_VISIBLE);
    map.setCellFlags(3, 3, Map.cell.Flags.WAS_VISIBLE);
    expect(map.isVisible(3, 3)).toBeFalsy();
    expect(map.isAnyKindOfVisible(3, 3)).toBeFalsy();
    expect(map.isOrWasAnyKindOfVisible(3, 3)).toBeTruthy();

    map.clearFlags(0, Map.cell.Flags.IS_WAS_ANY_KIND_OF_VISIBLE);
    map.setCellFlags(3, 3, Map.cell.Flags.WAS_TELEPATHIC_VISIBLE);
    expect(map.isVisible(3, 3)).toBeFalsy();
    expect(map.isAnyKindOfVisible(3, 3)).toBeFalsy();
    expect(map.isOrWasAnyKindOfVisible(3, 3)).toBeTruthy();

    map.clearFlags(0, Map.cell.Flags.IS_WAS_ANY_KIND_OF_VISIBLE);
    map.setCellFlags(3, 3, Map.cell.Flags.WAS_CLAIRVOYANT_VISIBLE);
    expect(map.isVisible(3, 3)).toBeFalsy();
    expect(map.isAnyKindOfVisible(3, 3)).toBeFalsy();
    expect(map.isOrWasAnyKindOfVisible(3, 3)).toBeTruthy();
  });

  test("clearFlag", () => {
    const map: Map.map.Map = GW.make.map(10, 10, "FLOOR");

    expect(map.flags).toEqual(
      Map.map.Flags.MAP_STABLE_LIGHTS |
        Map.map.Flags.MAP_STABLE_GLOW_LIGHTS |
        Map.map.Flags.MAP_FOV_CHANGED
    );

    map.clearFlag(Map.map.Flags.MAP_STABLE_LIGHTS);
    expect(map.flags).toEqual(
      Map.map.Flags.MAP_STABLE_GLOW_LIGHTS |
        Map.map.Flags.MAP_FOV_CHANGED |
        Map.map.Flags.MAP_CHANGED
    );

    // cannot undo changed b/c clearing flags sets changed!  must do 'changed = false'
    map.clearFlags(Map.map.Flags.MAP_FOV_CHANGED | Map.map.Flags.MAP_CHANGED);
    expect(map.flags).toEqual(
      Map.map.Flags.MAP_STABLE_GLOW_LIGHTS | Map.map.Flags.MAP_CHANGED
    );

    map.changed = false;
    expect(map.flags).toEqual(Map.map.Flags.MAP_STABLE_GLOW_LIGHTS);

    expect(
      map.hasCellFlag(3, 3, Map.cell.Flags.TELEPATHIC_VISIBLE)
    ).toBeFalsy();
    map.setFlags(
      Map.map.Flags.MAP_ALWAYS_LIT,
      Map.cell.Flags.TELEPATHIC_VISIBLE
    );
    expect(
      map.hasCellFlag(3, 3, Map.cell.Flags.TELEPATHIC_VISIBLE)
    ).toBeTruthy();
    expect(map.flags & Map.map.Flags.MAP_ALWAYS_LIT).toBeTruthy();

    map.clearFlags(
      Map.map.Flags.MAP_ALWAYS_LIT,
      Map.cell.Flags.TELEPATHIC_VISIBLE
    );
    expect(
      map.hasCellFlag(3, 3, Map.cell.Flags.TELEPATHIC_VISIBLE)
    ).toBeFalsy();
    expect(map.flags & Map.map.Flags.MAP_ALWAYS_LIT).toBeFalsy();

    map.setCellFlags(3, 3, Map.cell.Flags.CLAIRVOYANT_VISIBLE);
    expect(
      map.hasCellFlag(3, 3, Map.cell.Flags.CLAIRVOYANT_VISIBLE)
    ).toBeTruthy();
    map.clearCellFlags(3, 3, Map.cell.Flags.CLAIRVOYANT_VISIBLE);
    expect(
      map.hasCellFlag(3, 3, Map.cell.Flags.CLAIRVOYANT_VISIBLE)
    ).toBeFalsy();
  });

  test("flags", () => {
    const map: Map.map.Map = GW.make.map(3, 3, "FLOOR");
    map.setTile(1, 1, "UP_STAIRS");
    map.storeMemories();
    expect(map.layerFlags(1, 1)).toEqual(Map.layer.Flags.L_BLOCKED_BY_STAIRS);
    expect(map.layerFlags(1, 1, true)).toEqual(
      Map.layer.Flags.L_BLOCKED_BY_STAIRS
    );
    expect(map.tileFlags(1, 1)).toEqual(Map.tile.Flags.T_UP_STAIRS);
    expect(map.tileFlags(1, 1, true)).toEqual(Map.tile.Flags.T_UP_STAIRS);
    expect(map.tileMechFlags(1, 1)).toEqual(
      Map.tile.MechFlags.TM_LIST_IN_SIDEBAR |
        Map.tile.MechFlags.TM_VISUALLY_DISTINCT
    );
    expect(map.tileMechFlags(1, 1, true)).toEqual(
      Map.tile.MechFlags.TM_LIST_IN_SIDEBAR |
        Map.tile.MechFlags.TM_VISUALLY_DISTINCT
    );

    expect(map.tileWithFlag(1, 1, Map.tile.Flags.T_UP_STAIRS)).toBe(
      Map.tiles.UP_STAIRS
    );
    expect(map.tileWithFlag(1, 1, Map.tile.Flags.T_BRIDGE)).toBeNull();

    expect(
      map.tileWithMechFlag(1, 1, Map.tile.MechFlags.TM_VISUALLY_DISTINCT)
    ).toBe(Map.tiles.UP_STAIRS);
    expect(
      map.tileWithMechFlag(1, 1, Map.tile.MechFlags.TM_ALLOWS_SUBMERGING)
    ).toBeNull();

    expect(map.hasKnownTileFlag(1, 1, Map.tile.Flags.T_UP_STAIRS)).toBeTruthy();
    expect(
      map.hasKnownTileFlag(1, 1, Map.tile.Flags.T_DOWN_STAIRS)
    ).toBeFalsy();
  });

  test.each([
    // prettier-ignore
    [null,true,true,false,false,false,false,false,false,false,true,true,true],
    // prettier-ignore
    ["FLOOR",false,true,false,false,false,false,false,false,false,true,true,true],
    // prettier-ignore
    ["WALL",false,true,true,false,false,false,false,true,true,false,false,false],
    // prettier-ignore
    ["DOOR",false,true,false,true,false,false,false,false,true,true,true,true],
    // prettier-ignore
    ["LAKE",false,true,false,false,false,true,false,true,false,true,false,false],
  ])(
    "passthroughs - %s",
    // prettier-ignore
    (tile,clear,empty,obstruction,doorway,secret,liquid,gas,pathing,vision,move,walk,canWalk
    ) => {
      const map: Map.map.Map = GW.make.map(3, 3, "FLOOR");
      map.setTile(1, 1, tile);
      map.storeMemory(1, 1);
      expect(map.isClear(1, 1)).toEqual(clear);
      expect(map.isEmpty(1, 1)).toEqual(empty);
      expect(map.isObstruction(1, 1)).toEqual(obstruction);
      expect(map.isDoorway(1, 1)).toEqual(doorway);
      expect(map.isSecretDoorway(1, 1)).toEqual(secret);
      expect(map.isLiquid(1, 1)).toEqual(liquid);
      expect(map.hasGas(1, 1)).toEqual(gas);
      expect(map.blocksPathing(1, 1)).toEqual(pathing);
      expect(map.blocksVision(1, 1)).toEqual(vision);

      expect(map.isMoveableNow(1, 1)).toEqual(move);
      expect(map.isWalkableNow(1, 1)).toEqual(walk);
      expect(map.canBeWalked(1, 1)).toEqual(canWalk);

      expect(map.isMoveableNow(1, 1, true)).toEqual(move);
      expect(map.isWalkableNow(1, 1, true)).toEqual(walk);
      expect(map.canBeWalked(1, 1, true)).toEqual(canWalk);

      map.clearCell(1, 1);
      expect(map.isClear(1, 1)).toBeTruthy();
    }
  );

  test("topmostTile", () => {
    const map: Map.map.Map = GW.make.map(3, 3, "FLOOR");

    map.setTile(1, 1, "BRIDGE");
    expect(map.topmostTile(1, 1)).toBe(Map.tiles.BRIDGE);
    expect(map.topmostTile(0, 0)).toBe(Map.tiles.FLOOR);
  });

  test("tileFlavor", () => {
    const map: Map.map.Map = GW.make.map(3, 3, "WALL");
    expect(map.tileFlavor(1, 1)).toEqual("a rough stone wall");
  });

  test("clearCellLayersWithFlags", () => {
    const map: Map.map.Map = GW.make.map(3, 3, "FLOOR");

    map.setTile(1, 1, "UP_STAIRS");
    expect(map.isClear(1, 1)).toBeFalsy();
    map.clearCellLayersWithFlags(1, 1, Map.tile.Flags.T_HAS_STAIRS);
    expect(map.isClear(1, 1)).toBeTruthy();
  });

  test("clearCellLayers", () => {
    const map: Map.map.Map = GW.make.map(3, 3, "LAKE");

    map.setTile(1, 1, "BRIDGE");
    expect(map.isWalkableNow(1, 1)).toBeTruthy();
    map.clearCellLayers(1, 1, false, true, false);
    expect(map.isWalkableNow(1, 1)).toBeFalsy();
  });

  test("neighborCount", () => {
    const map: Map.map.Map = GW.make.map(5, 5, "FLOOR");

    map.setTile(3, 3, "WALL");
    expect(map.neighborCount(2, 2, (c) => c.isWall())).toEqual(1);
    expect(map.neighborCount(2, 2, (c) => c.isWall(), true)).toEqual(0);
  });

  function mapFrom(template: string[], tileMap: Record<string, string | null>) {
    const h = template.length;
    const w = template[0].length;

    const map: Map.map.Map = GW.make.map(w, h, "FLOOR");

    template.forEach((line, y) => {
      for (let x = 0; x < line.length; ++x) {
        const ch = line[x] || " ";
        const tile = tileMap[ch];
        if (tile !== undefined) {
          map.setTile(x, y, tile);
        }
      }
    });

    return map;
  }

  function isWall(cell: Map.cell.Cell) {
    return cell.isWall();
  }

  function isDoor(cell: Map.cell.Cell) {
    return cell.isDoorway();
  }

  test("walkableArcCount", () => {
    const tiles = { "#": "WALL", "~": "LAKE" };
    let map = mapFrom(["   ", "   ", "   "], tiles);
    expect(map.walkableArcCount(1, 1)).toEqual(1);

    map = mapFrom(["###", "   ", "   "], tiles);
    expect(map.walkableArcCount(1, 1)).toEqual(1);

    map = mapFrom(["###", "   ", "###"], tiles);
    expect(map.walkableArcCount(1, 1)).toEqual(2);

    map = mapFrom(["~~~", "# #", "###"], tiles);
    expect(map.walkableArcCount(1, 1)).toEqual(0);

    map = mapFrom(["###", "   ", "# #"], tiles);
    expect(map.walkableArcCount(1, 1)).toEqual(3);

    map = mapFrom(["# #", "   ", "~ ~"], tiles);
    expect(map.walkableArcCount(1, 1)).toEqual(4);
  });

  test("diagonalBlocked", () => {
    const map: Map.map.Map = GW.make.map(10, 10, "FLOOR");
    map.clearFlags(0, Map.cell.Flags.ANY_KIND_OF_VISIBLE);
    expect(map.cell(3, 3).isObstruction(true)).toBeFalsy();

    expect(map.diagonalBlocked(1, 1, 1, 2)).toBeFalsy();
    expect(map.diagonalBlocked(1, 1, 2, 2)).toBeFalsy();

    map.setTile(3, 3, "WALL");
    expect(map.diagonalBlocked(2, 3, 3, 4)).toBeTruthy();
    expect(map.diagonalBlocked(3, 4, 2, 3)).toBeTruthy();

    // remembers clear cell...
    expect(map.cell(3, 3).isObstruction(true)).toBeFalsy();
    expect(map.diagonalBlocked(2, 3, 3, 4, true)).toBeFalsy();
    expect(map.diagonalBlocked(3, 4, 2, 3, true)).toBeFalsy();

    map.storeMemories();
    expect(map.diagonalBlocked(2, 3, 3, 4)).toBeTruthy();
    expect(map.diagonalBlocked(3, 4, 2, 3)).toBeTruthy();
  });

  test("fillCostGrid", () => {
    const tiles = { "#": "WALL", "0": null };
    const map = mapFrom(["     ", " ### ", "     ", " ### ", "00000"], tiles);

    const costGrid = GW.grid.alloc(map.width, map.height);
    map.fillCostGrid(costGrid);
    expect(costGrid[0][0]).toEqual(1);
    expect(costGrid[1][1]).toEqual(GW.path.OBSTRUCTION); // wall
    expect(costGrid[0][4]).toEqual(GW.path.OBSTRUCTION); // null
  });

  test("matchingNeighbor", () => {
    const tiles = { "#": "WALL", "0": null };
    const map = mapFrom(["     ", " ### ", "     ", " ### ", "00000"], tiles);

    expect(map.matchingNeighbor(0, 0, isWall, true)).toEqual([-1, -1]);
    expect(map.matchingNeighbor(0, 0, isWall)).toEqual([1, 1]);
  });

  test("matchingLocNear", () => {
    const map: Map.map.Map = GW.make.map(10, 10, "FLOOR");

    map.setTile(9, 8, "WALL");
    expect(map.matchingLocNear(3, 3, isWall)).toEqual([9, 8]);
    expect(map.matchingLocNear(3, 3, { match: isWall })).toEqual([9, 8]);
    expect(
      map.matchingLocNear(3, 3, { match: isWall, deterministic: true })
    ).toEqual([9, 8]);

    expect(map.matchingLocNear(3, 3, isDoor)).toEqual([-1, -1]);
  });

  describe("randomMatchingLoc", () => {
    test("finds one", () => {
      const map: Map.map.Map = GW.make.map(10, 10, "FLOOR");
      map.setTile(9, 8, "WALL");
      expect(map.randomMatchingLoc(isWall)).toEqual([9, 8]);
    });

    test("fails to find one", () => {
      const map: Map.map.Map = GW.make.map(10, 10, "FLOOR");
      expect(map.randomMatchingLoc(isWall)).toEqual([-1, -1]);
    });
  });

  test("hasVisibleLight", () => {
    const map: Map.map.Map = GW.make.map(5, 5, "FLOOR");
    const cell = map.cell(3, 3);
    expect(cell.light).toEqual([100, 100, 100]);
    expect(map.hasVisibleLight(3, 3)).toBeTruthy();
    cell.light = [5, 5, 5];
    expect(map.hasVisibleLight(3, 3)).toBeFalsy();
  });

  test("add/remove Light", () => {
    const map: Map.map.Map = GW.make.map(10, 10, "FLOOR");
    const light = GW.make.light("blue, 3, 0");
    const other = GW.make.light("green", 3, 0);
    const also = GW.make.light("blue", 3, 0);
    const eachFn = jest.fn();

    map.eachStaticLight(eachFn);
    expect(eachFn).toHaveBeenCalledTimes(0);

    map.addStaticLight(3, 3, light);
    map.eachStaticLight(eachFn);
    expect(eachFn).toHaveBeenCalledTimes(1);
    eachFn.mockClear();

    map.removeStaticLight(3, 3, light);
    map.eachStaticLight(eachFn);
    expect(eachFn).toHaveBeenCalledTimes(0);

    map.addStaticLight(3, 3, light);
    map.addStaticLight(3, 3, other);
    map.eachStaticLight(eachFn);
    expect(eachFn).toHaveBeenCalledTimes(2);
    eachFn.mockClear();

    map.removeStaticLight(3, 3);
    map.eachStaticLight(eachFn);
    expect(eachFn).toHaveBeenCalledTimes(0);
    expect(map.lights).toBeNull();
    eachFn.mockClear();

    map.addStaticLight(5, 5, also);
    map.addStaticLight(3, 3, light);
    map.addStaticLight(4, 4, other);

    map.removeStaticLight(3, 3, light);
    map.eachStaticLight(eachFn);
    expect(eachFn).toHaveBeenCalledTimes(2);
  });

  test("FX", () => {
    const fx: GW.types.FxType = GW.make.layer({ ch: "!" });
    const map: Map.map.Map = GW.make.map(10, 10, "FLOOR");
    const mixer: GW.canvas.Mixer = GW.make.mixer();
    const cell = map.cell(3, 3);
    Map.cell.getAppearance(cell, mixer);
    expect(mixer.ch).not.toEqual(fx.sprite.ch);

    map.addFx(3, 3, fx);
    Map.cell.getAppearance(cell, mixer);
    expect(mixer.ch).toEqual(fx.sprite.ch);
    expect(fx).toBeAtXY(3, 3);

    map.moveFx(4, 4, fx);
    Map.cell.getAppearance(cell, mixer);
    expect(mixer.ch).not.toEqual(fx.sprite.ch);
    expect(fx).toBeAtXY(4, 4);

    map.moveFx(3, 3, fx);
    Map.cell.getAppearance(cell, mixer);
    expect(mixer.ch).toEqual(fx.sprite.ch);
    expect(fx).toBeAtXY(3, 3);

    map.removeFx(fx);
    Map.cell.getAppearance(cell, mixer);
    expect(mixer.ch).not.toEqual(fx.sprite.ch);
    expect(fx).toBeAtXY(3, 3); // leaves last pos
  });

  test("Actor", () => {
    const player = UTILS.makePlayer();
    expect(player.isPlayer()).toBeTruthy();
    const map: Map.map.Map = GW.make.map(10, 10, "FLOOR");
    map.lightChanged = false;

    map.addActor(3, 3, player);
    expect(map.actorAt(3, 3)).toBe(player);
    expect(map.hasCellFlag(3, 3, Map.cell.Flags.HAS_PLAYER)).toBeTruthy();
    expect(map.flags & Map.map.Flags.MAP_FOV_CHANGED).toBeTruthy();
    expect(map.lightChanged).toBeFalsy();
    expect(map.cell(3, 3).needsRedraw).toBeTruthy();

    const other = UTILS.makeActor();
    // @ts-ignore
    other.light = GW.make.light("blue, 3, 0");
    expect(map.addActor(3, 3, other)).toBeFalsy();
    expect(map.actorAt(3, 3)).toBe(player);

    map.clearFlag(Map.map.Flags.MAP_FOV_CHANGED);
    map.moveActor(4, 4, player);
    expect(map.actorAt(3, 3)).toBeNull();
    expect(map.hasCellFlag(3, 3, Map.cell.Flags.HAS_ACTOR)).toBeFalsy();
    expect(map.flags & Map.map.Flags.MAP_FOV_CHANGED).toBeTruthy();

    map.addActor(3, 3, other);
    expect(map.lightChanged).toBeTruthy();
    expect(map.actorAt(3, 3)).toBe(other);
    expect(map.moveActor(3, 3, player)).toBeFalsy();
    expect(map.actorAt(3, 3)).toBe(other);
    expect(map.actorAt(4, 4)).toBe(player);

    map.lightChanged = false;
    map.moveActor(5, 5, other);
    expect(map.lightChanged).toBeTruthy();

    map.lightChanged = false;
    map.removeActor(other);
    expect(map.lightChanged).toBeTruthy();

    expect(map.removeActor(other)).toBeFalsy();

    map.removeActor(player);
    expect(map.actorAt(4, 4)).toBeNull();
    expect(map.hasCellFlag(4, 4, Map.cell.Flags.HAS_ACTOR)).toBeFalsy();
    expect(map.flags & Map.map.Flags.MAP_FOV_CHANGED).toBeTruthy();

    // @ts-ignore
    other.avoidsCell.mockReturnValue(true);
    expect(map.addActorNear(3, 3, other)).toBeFalsy();
    expect(map.actorAt(3, 3)).toBeNull();

    expect(map.addActorNear(3, 3, player)).toBeTruthy();
    expect(map.actorAt(3, 3)).toBe(player);
    expect(map.hasCellFlag(3, 3, Map.cell.Flags.HAS_PLAYER)).toBeTruthy();
    expect(map.flags & Map.map.Flags.MAP_FOV_CHANGED).toBeTruthy();

    map.deleteActorAt(3, 3);
    expect(map.actorAt(3, 3)).toBeNull();
    expect(player.delete).toHaveBeenCalled();
  });

  test("Item", () => {
    const item = UTILS.makeItem();
    const map: Map.map.Map = GW.make.map(10, 10, "FLOOR");
    map.lightChanged = false;

    map.addItem(3, 3, item);
    expect(map.itemAt(3, 3)).toBe(item);
    expect(map.hasCellFlag(3, 3, Map.cell.Flags.HAS_ITEM)).toBeTruthy();
    expect(map.lightChanged).toBeFalsy();
    expect(map.cell(3, 3).needsRedraw).toBeTruthy();

    const other = UTILS.makeItem();
    // @ts-ignore
    other.light = GW.make.light("blue, 3, 0");
    // @ts-ignore
    other.isDetected.mockReturnValue(true);
    expect(map.addItem(3, 3, other)).toBeFalsy();
    expect(map.itemAt(3, 3)).toBe(item);

    map.addItem(5, 5, other);
    expect(map.lightChanged).toBeTruthy();
    expect(map.hasCellFlag(5, 5, Map.cell.Flags.ITEM_DETECTED)).toBeTruthy();
    expect(map.itemAt(5, 5)).toBe(other);

    map.lightChanged = false;
    map.removeItem(other);
    expect(map.hasCellFlag(5, 5, Map.cell.Flags.ITEM_DETECTED)).toBeFalsy();
    expect(map.lightChanged).toBeTruthy();
    expect(map.itemAt(5, 5)).toBeNull();

    expect(map.removeItem(other)).toBeFalsy();

    map.removeItem(item);
    expect(map.itemAt(3, 3)).toBeNull();
    expect(map.hasCellFlag(3, 3, Map.cell.Flags.HAS_ITEM)).toBeFalsy();

    // @ts-ignore
    other.forbidsCell.mockReturnValue(true);
    expect(map.addItemNear(3, 3, other)).toBeFalsy();
    expect(map.itemAt(3, 3)).toBeNull();

    expect(map.addItemNear(3, 3, item)).toBeTruthy();
    expect(map.itemAt(3, 3)).toBe(item);
    expect(map.hasCellFlag(3, 3, Map.cell.Flags.HAS_ITEM)).toBeTruthy();
  });

  test("gridDisruptsWalkability", () => {
    const map = mapFrom(["     ", " ####", "     ", " ### ", " ~~  "], {
      "#": "WALL",
      "~": "LAKE",
      ">": "UP_STAIRS",
    });

    const grid = GW.make.grid(5, 5);
    expect(map.gridDisruptsWalkability(grid)).toBeFalsy();

    // block off section
    grid[0][1] = 1;
    expect(map.gridDisruptsWalkability(grid)).toBeTruthy();
    grid.fill(0);

    // stairs - automatic disruption if you block/remove stairs
    grid[0][4] = 1;
    expect(map.gridDisruptsWalkability(grid)).toBeFalsy();
    map.setTile(0, 4, "UP_STAIRS");
    expect(map.hasTileFlag(0, 4, Map.tile.Flags.T_HAS_STAIRS)).toBeTruthy();
    expect(map.cell(0, 4).canBeWalked()).toBeTruthy();
    grid[0][4] = 1;
    expect(map.gridDisruptsWalkability(grid)).toBeTruthy();
    grid.fill(0);

    // clear cells are not walkable
    grid[3][0] = 1; // separate 1 cell
    expect(map.gridDisruptsWalkability(grid)).toBeTruthy();
    map.clearCell(4, 0); // clear that cell
    expect(map.gridDisruptsWalkability(grid)).toBeFalsy();
    grid.fill(0);
  });

  test("losFromTo", () => {
    const map: Map.map.Map = GW.make.map(10, 10, "FLOOR");

    expect(map.losFromTo({ x: 0, y: 0 }, { x: 0, y: 0 })).toBeTruthy();
    expect(map.losFromTo({ x: 0, y: 0 }, { x: 3, y: 4 })).toBeTruthy();
    map.setTile(1, 1, "WALL");
    expect(map.losFromTo({ x: 0, y: 0 }, { x: 3, y: 4 })).toBeFalsy();
  });

  test("resetCellEvents", () => {
    const map: Map.map.Map = GW.make.map(10, 10, "FLOOR");

    map.setCellFlags(2, 2, 0, Map.cell.MechFlags.EVENT_FIRED_THIS_TURN);
    map.setCellFlags(3, 3, 0, Map.cell.MechFlags.EVENT_PROTECTED);

    map.resetCellEvents();
    expect(
      map.hasCellMechFlag(2, 2, Map.cell.MechFlags.EVENT_FIRED_THIS_TURN)
    ).toBeFalsy();
    expect(
      map.hasCellMechFlag(3, 3, Map.cell.MechFlags.EVENT_PROTECTED)
    ).toBeFalsy();
  });

  test("storeMemories", () => {
    const map: Map.map.Map = GW.make.map(10, 10, "FLOOR", "WALL");

    expect(map.hasTile(0, 0, "WALL")).toBeTruthy();
    expect(map.cell(0, 0).memory.layerFlags).toEqual(0);
    expect(map.isAnyKindOfVisible(0, 0)).toBeTruthy();

    map.storeMemories();
    expect(map.cell(0, 0).memory.layerFlags).toBeGreaterThan(0);
  });

  test("addText", () => {
    const map: Map.map.Map = GW.make.map(10, 10, "FLOOR", "WALL");
    const mixer: GW.canvas.Mixer = GW.make.mixer();

    Map.map.getCellAppearance(map, 1, 1, mixer);
    expect(mixer.ch).not.toEqual("T");

    Map.map.addText(map, 1, 1, "Text", "red", null);
    Map.map.getCellAppearance(map, 1, 1, mixer);

    expect(mixer.ch).toEqual("T");
    expect(mixer.fg).toEqual(GW.colors.red);
  });

  test.each([
    // redraw, changed, visible, revealed, anyVisible, cursor, path, ch, fg, bg
    [true, true, false, false, false, false, false, 0, 0, 0],

    // visible && revealed
    // prettier-ignore
    [true, true, true, true, false, false, false, "<", [100, 50, 50], [40, 20, 20]],
    // prettier-ignore
    [false, true, true, true, false, false, false, "<", [100, 50, 50], [40, 20, 20]],
    // prettier-ignore
    [true, false, true, true, false, false, false, "<", [100, 50, 50], [40, 20, 20]],
    // prettier-ignore
    [false, false, true, true, false, false, false, "<", [100, 50, 50], [40, 20, 20]],

    // visible and !revealed => for super simple games that do not deal with reveal mechanics
    // prettier-ignore
    [true, true, true, false, false, false, false, "<", [100, 50, 50], [40, 20, 20]],
    // prettier-ignore
    [true, true, true, true, false, false, false, "<", [100, 50, 50], [40, 20, 20]],
    // prettier-ignore
    [false, true, true, true, false, false, false, "<", [100, 50, 50], [40, 20, 20]],
    // prettier-ignore
    [true, false, true, true, false, false, false, "<", [100, 50, 50], [40, 20, 20]],
    // prettier-ignore
    [false, true, true, true, false, false, false, "<", [100, 50, 50], [40, 20, 20]],

    // ! visible && revealed
    // prettier-ignore
    [true, true, false, true, false, false, false, "<", [70, 35, 35], [28, 14, 14]],
    // prettier-ignore
    [true, false, false, true, false, false, false, "<", [70, 35, 35], [28, 14, 14]],
    // prettier-ignore
    [false, true, false, true, false, false, false, "<", [70, 35, 35], [28, 14, 14]],
    // prettier-ignore
    [false, false, false, true, false, false, false, "<", [70, 35, 35], [28, 14, 14]],

    // telepathy && revealed
    // prettier-ignore
    [true, true, false, true, true, false, false, "<", [100, 50, 50], [40, 20, 20]],
    // prettier-ignore
    [true, false, false, true, true, false, false, "<", [100, 50, 50], [40, 20, 20]],
    // prettier-ignore
    [false, true, false, true, true, false, false, "<", [100, 50, 50], [40, 20, 20]],
    // prettier-ignore
    [false, false, false, true, true, false, false, "<", [100, 50, 50], [40, 20, 20]],

    // telepathy && !revealed
    // prettier-ignore
    [true, true, false, false, true, false, false, "<", [100, 50, 50], [40, 20, 20]],
    // prettier-ignore
    [true, false, false, false, true, false, false, "<", [100, 50, 50], [40, 20, 20]],
    // prettier-ignore
    [false, true, false, false, true, false, false, "<", [100, 50, 50], [40, 20, 20]],
    // prettier-ignore
    [false, false, false, false, true, false, false, "<", [100, 50, 50], [40, 20, 20]],

    // cursor
    // prettier-ignore
    [true,true,true,true,false,true,false,"<",[100, 50, 50],GW.color.from([40, 20, 20]).mix(GW.colors.cursor, 50),],
    // prettier-ignore
    [false,false,false,true,false,true,false,"<",[70, 35, 35],GW.color.from([28, 14, 14]).mix(GW.colors.cursor, 50),],

    // path
    // prettier-ignore
    [true,true,true,true,false,false,true,"<",[43, 23, 23],[88, 79, 62],], // lots of separation change here
    // prettier-ignore
    [false,false,false,true,false,false,true,"<",[70, 35, 35],GW.color.from([28, 14, 14]).mix(GW.colors.path, 50),],
  ])(
    "getCellAppearance - changed=%s|%s, visible=%s, revealed=%s, any=%s, cursor=%s, path=%s",
    // prettier-ignore
    (redraw,changed,visible,revealed,anyVisible,cursor,path,ch,fg,bg
    ) => {
      const map: Map.map.Map = GW.make.map(3, 3, "FLOOR");
      map.setTile(1, 1, "UP_STAIRS");
      // const stairs = GW.make.mixer(Map.tiles.UP_STAIRS.sprite);
      const cell = map.cell(1, 1);
      const app: GW.canvas.Mixer = GW.make.mixer();

      cell.needsRedraw = redraw;
      cell.changed = changed;

      if (revealed || visible || anyVisible) {
        // need to have drawn in past...
        Map.cell.getAppearance(cell, app);
      }

      if (visible) {
        cell.flags |= Map.cell.Flags.VISIBLE;
      } else {
        cell.clearFlags(Map.cell.Flags.ANY_KIND_OF_VISIBLE);
      }
      if (revealed) {
        cell.markRevealed();
      } else {
        cell.clearFlags(Map.cell.Flags.REVEALED);
      }

      if (anyVisible) {
        cell.flags |= Map.cell.Flags.CLAIRVOYANT_VISIBLE;
      } else {
        cell.clearFlags(
          Map.cell.Flags.CLAIRVOYANT_VISIBLE | Map.cell.Flags.TELEPATHIC_VISIBLE
        );
      }

      if (cursor) {
        cell.flags |= Map.cell.Flags.IS_CURSOR;
      } else {
        cell.clearFlags(Map.cell.Flags.IS_CURSOR);
      }

      if (path) {
        cell.flags |= Map.cell.Flags.IS_IN_PATH;
      } else {
        cell.clearFlags(Map.cell.Flags.IS_IN_PATH);
      }

      const expected: GW.canvas.Mixer = GW.make.mixer({ ch, fg, bg });
      Map.map.getCellAppearance(map, 1, 1, app);
      expect(app.ch).toEqual(expected.ch);
      expect(app.fg).toEqual(expected.fg);
      expect(app.bg).toEqual(expected.bg);
    }
  );

  test("getCellAppearance - inverted", () => {
    const tile: Map.tile.Tile = GW.make.tile({
      id: "INVERT",
      name: "invert",
      flags: "TM_INVERT_WHEN_HIGHLIGHTED",
      fg: "blue",
      bg: "red",
      ch: "!",
    });

    const map: Map.map.Map = GW.make.map(3, 3, "FLOOR");
    map.setTile(1, 1, tile);
    map.setCellFlags(1, 1, Map.cell.Flags.IS_CURSOR);

    const app: GW.canvas.Mixer = GW.make.mixer();
    Map.map.getCellAppearance(map, 1, 1, app);
    expect(app.ch).toEqual("!");
    expect(app.fg).toEqual(GW.colors.red);
    expect(app.bg).toEqual(GW.colors.blue);

    map.clearCellFlags(1, 1, Map.cell.Flags.IS_CURSOR);
    map.setCellFlags(1, 1, Map.cell.Flags.IS_IN_PATH);
    Map.map.getCellAppearance(map, 1, 1, app);
    expect(app.ch).toEqual("!");
    expect(app.fg).toEqual(GW.colors.red);
    expect(app.bg).toEqual(GW.colors.blue);

    map.clearCellFlags(1, 1, Map.cell.Flags.IS_IN_PATH);
    Map.map.getCellAppearance(map, 1, 1, app);
    expect(app.ch).toEqual("!");
    expect(app.fg).toEqual(GW.colors.blue);
    expect(app.bg).toEqual(GW.colors.red);
  });

  describe("liquids", () => {
    beforeAll(() => {
      Map.tile.install("RED_LIQUID", {
        name: "red liquid",
        depth: "LIQUID",
      });
    });

    afterAll(() => {
      delete Map.tiles.RED_LIQUID;
    });

    test("liquids can dissipate", async () => {
      GW.random.seed(12345);
      const map = GW.make.map(10, 10);
      map.setTile(5, 5, "RED_LIQUID", 50);
      const cell = map.cell(5, 5);
      expect(cell.liquidVolume).toEqual(50);
      expect(map.cell(4, 5).liquidVolume).toEqual(0);

      await map.tick();
      expect(cell.liquidVolume).toEqual(6);
      expect(map.cell(4, 5).liquidVolume).toEqual(4);

      await map.tick();
      expect(cell.liquidVolume).toEqual(6);
      expect(map.cell(4, 5).liquidVolume).toEqual(3);

      UTILS.rnd.mockReturnValue(0); // force dissipate
      expect(cell.liquidTile.dissipate).toBeGreaterThan(0);
      while (cell.liquidVolume > 0) {
        await map.tick();
      }

      expect(cell.liquid).toEqual(null);
    });

    test.each([
      [2, 0, 10, 0],
      [5, 0, 7, 0],
      [10, 0, 11, 0],
      [15, 0, 18, 0],
      [25, 0, 36, 0],
      [50, 0, 49, 0],
      [75, 0, 52, 0],
      [100, 0, 86, 0],
      [125, 0, 133, 0],
      [150, 0, 120, 0],
      [175, 0, 166, 0],
      [200, 0, 270, 0],

      [5, 10, 5, 7],
      [5, 20, 5, 5],
      [5, 30, 4, 5],
      [5, 40, 4, 4],
      [5, 50, 3, 3],

      [10, 10, 10, 9],
      [15, 10, 15, 10],

      [25, 10, 21, 9],
      [25, 25, 18, 7],
      [25, 50, 11, 5],
      [25, 75, 9, 4],
      [25, 100, 9, 3],
      [25, 125, 9, 3],
      [25, 150, 9, 3],
      [25, 200, 8, 2],

      [50, 10, 25, 16],
      [75, 10, 38, 20],

      [100, 10, 50, 20],
      [100, 25, 37, 12],
      [100, 50, 26, 9],
      [100, 75, 22, 7],
      [100, 100, 21, 5],
      [100, 125, 20, 5],
      [100, 150, 18, 5],
      [100, 175, 18, 4],
      [100, 200, 13, 4],
      [100, 250, 10, 4],
      [100, 300, 9, 3],

      [125, 10, 60, 27],
      [150, 10, 67, 27],
      [175, 10, 79, 33],
      [200, 10, 76, 34],
      [200, 20, 57, 18],
      [200, 30, 52, 17],
      [200, 40, 47, 14],
      [200, 50, 40, 11],
      [200, 60, 37, 11],
      [200, 70, 33, 9],
      [200, 80, 33, 9],
      [200, 90, 33, 8],
      [200, 100, 31, 8],
      [200, 110, 27, 7],
      [200, 120, 28, 7],
      [200, 130, 24, 7],
      [200, 140, 25, 7],
      [200, 150, 25, 6],
      [200, 175, 23, 6],
      [200, 200, 21, 6],
      [200, 250, 21, 5],
      [200, 300, 21, 5],
      [200, 350, 20, 4],
      [200, 400, 15, 4],
      [200, 450, 13, 4],
      [200, 500, 13, 4],
      [200, 600, 9, 3],
      [200, 700, 9, 3],
      [200, 800, 9, 3],
    ])(
      "liquid combos - vol=%d, dissipate=%d -> max tiles=%d, turns=%d",
      async (volume, dissipate, maxTiles, turns) => {
        const liquid = new Map.tile.Tile({
          id: "RED_LIQUID",
          name: "red liquid",
          depth: "LIQUID",
          dissipate: dissipate * 100,
        });

        expect(liquid.dissipate).toEqual(dissipate * 100);
        GW.random.seed(12345);

        const map: Map.map.Map = GW.make.map(21, 21, "FLOOR");
        expect(map.count((cell) => cell.liquidVolume > 0)).toEqual(0);

        map.setTile(10, 10, liquid, volume);
        expect(map.flags & Map.map.Flags.MAP_NO_LIQUID).toBeFalsy();
        expect(map.count((cell) => cell.liquidVolume !== 0)).toEqual(1);

        // map.dump((c) => "" + c.gasVolume);

        let roundCount = 0;
        let maxSize = 0;
        let ok = true;
        let sameCount = 0;
        while (ok && sameCount < 20 && roundCount < 1000) {
          // console.log("ROUND", roundCount, UTILS.v);
          await map.tick();
          // updateGas(map);
          const size = map.count((cell) => cell.liquidVolume !== 0);
          if (size == maxSize) {
            ++sameCount;
          } else {
            // console.log("size = ", size, maxSize);
            sameCount = 0;
          }
          if (size < maxSize && !dissipate) {
            ok = false;
          }
          if (size == 0) {
            ok = false;
          }
          // if (size > maxSize) {
          //   map.dump((c) => "" + c.gasVolume);
          // }
          maxSize = Math.max(maxSize, size);
          ++roundCount;
        }

        // console.log(UTILS.counts);

        if (turns && dissipate) {
          expect(roundCount).toEqual(turns);
        }
        expect(maxSize).toEqual(maxTiles);
      }
    );
  });

  describe("gas", () => {
    let map: Map.map.Map;
    let cell: Map.cell.Cell;

    beforeAll(() => {
      const gas = Map.tile.install("RED_GAS", {
        name: "red gas",
        depth: "GAS",
      });

      expect(gas.dissipate).toEqual(20 * 100);

      GW.random.seed(12345);

      map = GW.make.map(10, 10, "FLOOR");
      expect(map.count((cell) => cell.gasVolume > 0)).toEqual(0);

      map.setTile(5, 5, "RED_GAS", 90);
      expect(map.flags & Map.map.Flags.MAP_NO_GAS).toBeFalsy();

      cell = map.cell(5, 5);
      expect(cell.gas).toEqual("RED_GAS");
      expect(cell.gasVolume).toEqual(90);
      expect(cell.hasTile("RED_GAS")).toBeTruthy();
      expect(cell.layerFlags() & Map.layer.Flags.L_BLOCKS_GAS).toBeFalsy();
      expect(map.count((cell) => cell.gasVolume !== 0)).toEqual(1);
      map.eachNeighbor(5, 5, (cell) => {
        expect(cell.gasVolume).toEqual(0);
      });
    });

    test.each([
      [10, 10, 9],
      [9, 7, 24],
      [6, 5, 34],
      [5, 4, 41],
      [4, 3, 43],
      [2, 2, 45],
      [3, 2, 40],
      [1, 2, 33],
      [1, 0, 24],
      [0, 0, 15],
      [0, 0, 7],
      [0, 0, 4],
      [0, 0, 2],
      [0, 0, 2],
      [0, 0, 1],
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
    ])("gas round - %d, %d, %d", async (center, left, count) => {
      await map.tick();
      expect(cell.gasVolume).toEqual(center);
      expect(map.cell(4, 5).gasVolume).toEqual(left);
      expect(map.count((cell) => cell.gasVolume > 0)).toEqual(count);

      if (center) {
        expect(cell.gas).not.toBeNull();
      } else {
        expect(cell.gas).toBeNull();
      }
    });

    afterAll(() => {
      delete Map.tiles.RED_GAS;
    });
  });

  test.each([
    [2, 4],
    [10, 7],
    [25, 10],
    [60, 12],
    [100, 15],
    [200, 20],
    [300, 25],
    [500, 37],
    [1000, 70],
    [2000, 127],
    [20000, 1195],
  ])("big gas - %d -> %d", async (size, turns) => {
    const gas = new Map.tile.Tile({
      id: "RED_GAS",
      name: "red gas",
      depth: "GAS",
    });

    expect(gas.dissipate).toEqual(20 * 100);

    GW.random.seed(12345);

    const map: Map.map.Map = GW.make.map(10, 10, "FLOOR");
    expect(map.count((cell) => cell.gasVolume > 0)).toEqual(0);

    map.setTile(5, 5, gas, size); // 20000 from brogue dewars
    expect(map.flags & Map.map.Flags.MAP_NO_GAS).toBeFalsy();
    expect(map.count((cell) => cell.gasVolume !== 0)).toEqual(1);

    let roundCount = 0;
    while (map.count((cell) => cell.gasVolume !== 0)) {
      await map.tick();
      ++roundCount;
    }
    expect(roundCount).toEqual(turns);
  });

  test.each([
    [2, 0, 10, 0],
    [5, 0, 7, 0],
    [10, 0, 11, 0],
    [15, 0, 18, 0],
    [25, 0, 36, 0],
    [50, 0, 49, 0],
    [75, 0, 52, 0],
    [100, 0, 86, 0],
    [125, 0, 133, 0],
    [150, 0, 120, 0],
    [175, 0, 166, 0],
    [200, 0, 270, 0],

    [5, 10, 5, 7],
    [5, 20, 5, 5],
    [5, 30, 4, 5],
    [5, 40, 4, 4],
    [5, 50, 3, 3],

    [10, 10, 10, 9],
    [15, 10, 15, 10],

    [25, 10, 21, 9],
    [25, 25, 18, 7],
    [25, 50, 11, 5],
    [25, 75, 9, 4],
    [25, 100, 9, 3],
    [25, 125, 9, 3],
    [25, 150, 9, 3],
    [25, 200, 8, 2],

    [50, 10, 25, 16],
    [75, 10, 38, 20],

    [100, 10, 50, 20],
    [100, 25, 37, 12],
    [100, 50, 26, 9],
    [100, 75, 22, 7],
    [100, 100, 21, 5],
    [100, 125, 20, 5],
    [100, 150, 18, 5],
    [100, 175, 18, 4],
    [100, 200, 13, 4],
    [100, 250, 10, 4],
    [100, 300, 9, 3],

    [125, 10, 60, 27],
    [150, 10, 67, 27],
    [175, 10, 79, 33],
    [200, 10, 76, 34],
    [200, 20, 57, 18],
    [200, 30, 52, 17],
    [200, 40, 47, 14],
    [200, 50, 40, 11],
    [200, 60, 37, 11],
    [200, 70, 33, 9],
    [200, 80, 33, 9],
    [200, 90, 33, 8],
    [200, 100, 31, 8],
    [200, 110, 27, 7],
    [200, 120, 28, 7],
    [200, 130, 24, 7],
    [200, 140, 25, 7],
    [200, 150, 25, 6],
    [200, 175, 23, 6],
    [200, 200, 21, 6],
    [200, 250, 21, 5],
    [200, 300, 21, 5],
    [200, 350, 20, 4],
    [200, 400, 15, 4],
    [200, 450, 13, 4],
    [200, 500, 13, 4],
    [200, 600, 9, 3],
    [200, 700, 9, 3],
    [200, 800, 9, 3],
  ])(
    "gas combos - vol=%d, dissipate=%d -> max tiles=%d, turns=%d",
    async (volume, dissipate, maxTiles, turns) => {
      const gas = new Map.tile.Tile({
        id: "RED_GAS",
        name: "red gas",
        depth: "GAS",
        dissipate: dissipate * 100,
      });

      expect(gas.dissipate).toEqual(dissipate * 100);
      GW.random.seed(12345);

      const map: Map.map.Map = GW.make.map(21, 21, "FLOOR");
      expect(map.count((cell) => cell.gasVolume > 0)).toEqual(0);

      map.setTile(10, 10, gas, volume);
      expect(map.flags & Map.map.Flags.MAP_NO_GAS).toBeFalsy();
      expect(map.count((cell) => cell.gasVolume !== 0)).toEqual(1);

      // map.dump((c) => "" + c.gasVolume);

      let roundCount = 0;
      let maxSize = 0;
      let ok = true;
      let sameCount = 0;
      while (ok && sameCount < 20 && roundCount < 1000) {
        // console.log("ROUND", roundCount, UTILS.v);
        await map.tick();
        // updateGas(map);
        const size = map.count((cell) => cell.gasVolume !== 0);
        if (size == maxSize) {
          ++sameCount;
        } else {
          // console.log("size = ", size, maxSize);
          sameCount = 0;
        }
        if (size < maxSize && !dissipate) {
          ok = false;
        }
        if (size == 0) {
          ok = false;
        }
        // if (size > maxSize) {
        //   map.dump((c) => "" + c.gasVolume);
        // }
        maxSize = Math.max(maxSize, size);
        ++roundCount;
      }

      // console.log(UTILS.counts);

      if (turns && dissipate) {
        expect(roundCount).toEqual(turns);
      }
      expect(maxSize).toEqual(maxTiles);
    }
  );

  test("chance", () => {
    GW.random.seed(12345);
    let count = 0;
    for (let i = 0; i < 1000; ++i) {
      if (GW.random.chance(1000, 10000)) {
        count += 1;
      }
    }
    expect(count).toBeWithin(90, 110);
  });
});
