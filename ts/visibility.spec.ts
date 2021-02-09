import "jest-extended";
import "../test/matchers";
// import * as UTILS from "../test/utils";
import * as Map from "./gw";
// import * as GW from "gw-utils";

describe("visibility", () => {
  test("default", () => {
    const map: Map.map.Map = Map.map.make(10, 10, "FLOOR", "WALL");
    expect(map.flags & Map.map.Flags.MAP_CALC_FOV).toBeFalsy();
    expect(map.isVisible(3, 3)).toBeTruthy();
    expect(map.isRevealed(3, 3)).toBeTruthy();

    expect(Map.visibility.update(map, 3, 3, 5)).toBeFalsy();
  });

  test("fov on", () => {
    const map: Map.map.Map = Map.map.make(10, 10, {
      tile: "FLOOR",
      wall: "WALL",
      fov: true,
    });
    expect(map.flags & Map.map.Flags.MAP_CALC_FOV).toBeTruthy();
    expect(map.isVisible(3, 3)).toBeFalsy();
    expect(map.isRevealed(3, 3)).toBeFalsy();
  });

  test("fov update", () => {
    const map: Map.map.Map = Map.map.make(10, 10, {
      tile: "FLOOR",
      wall: "WALL",
      fov: true,
    });
    expect(map.flags & Map.map.Flags.MAP_CALC_FOV).toBeTruthy();
    expect(map.isVisible(3, 3)).toBeFalsy();
    expect(map.isRevealed(3, 3)).toBeFalsy();

    expect(Map.visibility.update(map, 3, 3, 5)).toBeTruthy();
    expect(map.isVisible(3, 3)).toBeTruthy();
    expect(map.isRevealed(3, 3)).toBeTruthy();

    expect(map.isVisible(9, 9)).toBeFalsy();
    expect(map.isRevealed(9, 9)).toBeFalsy();
  });
});
