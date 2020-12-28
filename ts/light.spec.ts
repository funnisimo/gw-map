import "jest-extended";
import "../test/matchers";

import * as Tile from "./tile";
import "./tiles";
import * as Cell from "./cell";
import * as Map from "./map";
import * as Light from "./light";
import * as GW from "gw-utils";

describe("light", () => {
  let light: Light.Light;

  test("will create lights", () => {
    light = GW.make.light({ color: "blue", radius: 3, fadeTo: 50 });
    expect(light.color).toEqual(GW.colors.blue);
    expect(light.radius).toMatchObject({ clumps: 1, hi: 3, lo: 3 });
    expect(light.fadeTo).toEqual(50);
    expect(light.passThroughActors).toBeFalsy();

    light = GW.make.light("blue", 3, 50);
    expect(light.color).toEqual(GW.colors.blue);
    expect(light.radius).toMatchObject({ clumps: 1, hi: 3, lo: 3 });
    expect(light.fadeTo).toEqual(50);
    expect(light.passThroughActors).toBeFalsy();

    light = GW.make.light(["blue", 3, 50]);
    expect(light.color).toEqual(GW.colors.blue);
    expect(light.radius).toMatchObject({ clumps: 1, hi: 3, lo: 3 });
    expect(light.fadeTo).toEqual(50);
    expect(light.passThroughActors).toEqual(false);

    light = GW.make.light("blue, 3, 50, true");
    expect(light.color).toEqual(GW.colors.blue);
    expect(light.radius).toMatchObject({ clumps: 1, hi: 3, lo: 3 });
    expect(light.fadeTo).toEqual(50);
    expect(light.passThroughActors).toBeTruthy();

    light = GW.make.light("blue, 3, 50, false");
    expect(light.color).toEqual(GW.colors.blue);
    expect(light.radius).toMatchObject({ clumps: 1, hi: 3, lo: 3 });
    expect(light.fadeTo).toEqual(50);
    expect(light.passThroughActors).toBe(false);
  });

  test("can add light kinds", () => {
    light = Light.install("TEST", { color: "blue", radius: 3, fadeTo: 50 });
    expect(light).toBe(Light.lights.TEST);
    expect(light.id).toEqual("TEST");
    expect(light.color).toEqual(GW.colors.blue);
    expect(light.radius).toMatchObject({ clumps: 1, hi: 3, lo: 3 });
    expect(light.fadeTo).toEqual(50);
    expect(light.passThroughActors).toBeFalsy();

    light = Light.install("TEST2", "blue", 3, 50);
    expect(light).toBe(Light.lights.TEST2);
    expect(light.id).toEqual("TEST2");
    expect(light.color).toEqual(GW.colors.blue);
    expect(light.radius).toMatchObject({ clumps: 1, hi: 3, lo: 3 });
    expect(light.fadeTo).toEqual(50);
    expect(light.passThroughActors).toBeFalsy();

    light = Light.install("TEST3", "blue, 3, 50");
    expect(light).toBe(Light.lights.TEST3);
    expect(light.id).toEqual("TEST3");
    expect(light.color).toEqual(GW.colors.blue);
    expect(light.radius).toMatchObject({ clumps: 1, hi: 3, lo: 3 });
    expect(light.fadeTo).toEqual(50);
    expect(light.passThroughActors).toBeFalsy();
  });

  describe("updateLighting", () => {
    let map: Map.Map;
    let cell: Cell.Cell;

    beforeEach(() => {
      map = Map.make(20, 20, "FLOOR", "WALL");
    });

    test("defaults to having white light", () => {
      expect(map.flags & Map.Flags.MAP_STABLE_GLOW_LIGHTS).toBeTruthy();
      expect(map.flags & Map.Flags.MAP_STABLE_LIGHTS).toBeTruthy();
      map.eachCell((cell) => {
        expect(cell.light).toEqual([100, 100, 100]);
        expect(cell.flags & Cell.Flags.IS_IN_SHADOW).toBeTruthy();
        expect(cell.flags & Cell.Flags.CELL_LIT).toBeFalsy();
        expect(cell.flags & Cell.Flags.CELL_DARK).toBeFalsy();
        expect(cell.flags & Cell.Flags.LIGHT_CHANGED).toBeFalsy();
      });
    });

    test("will return to default from stable glow lights", () => {
      map.flags &= ~Map.Flags.MAP_STABLE_LIGHTS;
      expect(map.flags & Map.Flags.MAP_STABLE_GLOW_LIGHTS).toBeTruthy();
      Light.updateLighting(map);

      expect(map.flags & Map.Flags.MAP_STABLE_GLOW_LIGHTS).toBeTruthy();
      expect(map.flags & Map.Flags.MAP_STABLE_LIGHTS).toBeTruthy();
      map.eachCell((cell) => {
        expect(cell.light).toEqual([100, 100, 100]);
        expect(cell.flags & Cell.Flags.IS_IN_SHADOW).toBeTruthy();
        expect(cell.flags & Cell.Flags.CELL_LIT).toBeFalsy();
        expect(cell.flags & Cell.Flags.CELL_DARK).toBeFalsy();
        expect(cell.flags & Cell.Flags.LIGHT_CHANGED).toBeFalsy();
      });
    });

    test("will set ambient light", () => {
      expect(map.ambientLight).toBeNull();

      map.ambientLight = GW.colors.blue;
      map.flags &= ~Map.Flags.MAP_STABLE_LIGHTS;

      // stable glow lights will keep ambient light change from taking hold
      expect(map.flags & Map.Flags.MAP_STABLE_GLOW_LIGHTS).toBeTruthy();
      Light.updateLighting(map);

      map.eachCell((cell) => {
        expect(cell.light).toEqual([100, 100, 100]);
      });

      map.flags &= ~(
        Map.Flags.MAP_STABLE_LIGHTS | Map.Flags.MAP_STABLE_GLOW_LIGHTS
      );
      Light.updateLighting(map);

      map.eachCell((cell) => {
        expect(cell.light).toEqual([0, 0, 100]);
      });
    });

    test("will add lights from tiles", () => {
      Light.install("TORCH", { color: "yellow", radius: 3, fadeTo: 50 });
      Tile.install("WALL_TORCH", {
        name: "wall with a torch",
        light: "TORCH",
        flags: "T_OBSTRUCTS_EVERYTHING",
      });

      expect(map.flags & Map.Flags.MAP_STABLE_LIGHTS).toBeTruthy();
      expect(map.flags & Map.Flags.MAP_STABLE_GLOW_LIGHTS).toBeTruthy();
      map.setTile(10, 10, "WALL_TORCH");

      expect(map.ambientLight).toBeNull();
      expect(map.flags & Map.Flags.MAP_STABLE_LIGHTS).toBeFalsy();
      expect(map.flags & Map.Flags.MAP_STABLE_GLOW_LIGHTS).toBeFalsy();

      Light.updateLighting(map);

      cell = map.cell(1, 1);
      expect(cell.light).toEqual([0, 0, 0]);

      cell = map.cell(10, 10);
      expect(cell.light).toEqual([100, 100, 0]);
    });

    test("will add lights from tiles to ambient light", () => {
      Light.install("TORCH", { color: "yellow", radius: 3, fadeTo: 50 });
      Tile.install("WALL_TORCH", {
        name: "wall with a torch",
        light: "TORCH",
        flags: "T_OBSTRUCTS_EVERYTHING",
      });

      map.ambientLight = GW.color.make(0x202020, true);
      expect(map.flags & Map.Flags.MAP_STABLE_LIGHTS).toBeTruthy();
      expect(map.flags & Map.Flags.MAP_STABLE_GLOW_LIGHTS).toBeTruthy();
      map.setTile(10, 10, "WALL_TORCH");

      expect(map.ambientLight.toString(true)).toEqual("#212121");
      expect(map.flags & Map.Flags.MAP_STABLE_LIGHTS).toBeFalsy();
      expect(map.flags & Map.Flags.MAP_STABLE_GLOW_LIGHTS).toBeFalsy();

      Light.updateLighting(map);

      cell = map.cell(1, 1);
      expect(cell.light).toEqual([13, 13, 13]); // ambient only

      cell = map.cell(10, 10);
      expect(cell.light).toEqual([113, 113, 13]); // ambient + 100% light

      cell = map.cell(9, 10);
      expect(cell.light).toEqual([96, 96, 13]); // ambient + 87% light

      cell = map.cell(8, 10);
      expect(cell.light).toEqual([79, 79, 13]); // ambient + 64% light

      cell = map.cell(7, 10);
      expect(cell.light).toEqual([63, 63, 13]); // ambient + 50% light

      cell = map.cell(6, 10);
      expect(cell.light).toEqual([13, 13, 13]); // ambient + 0% light
    });

    test("will handle static lights", () => {
      Light.install("TORCH", { color: "yellow", radius: 3, fadeTo: 50 });
      expect(map.flags & Map.Flags.MAP_STABLE_LIGHTS).toBeTruthy();
      expect(map.flags & Map.Flags.MAP_STABLE_GLOW_LIGHTS).toBeTruthy();

      map.ambientLight = GW.color.make(0x202020, true);
      map.addLight(10, 10, Light.from("TORCH"));
      expect(map.flags & Map.Flags.MAP_STABLE_LIGHTS).toBeFalsy();
      expect(map.flags & Map.Flags.MAP_STABLE_GLOW_LIGHTS).toBeFalsy();

      Light.updateLighting(map);

      cell = map.cell(1, 1);
      expect(cell.light).toEqual([13, 13, 13]); // ambient only

      cell = map.cell(10, 10);
      expect(cell.light).toEqual([113, 113, 13]); // ambient + 100% light

      cell = map.cell(9, 10);
      expect(cell.light).toEqual([96, 96, 13]); // ambient + 87% light

      cell = map.cell(8, 10);
      expect(cell.light).toEqual([79, 79, 13]); // ambient + 64% light

      cell = map.cell(7, 10);
      expect(cell.light).toEqual([63, 63, 13]); // ambient + 50% light

      cell = map.cell(6, 10);
      expect(cell.light).toEqual([13, 13, 13]); // ambient + 0% light
    });
  });
});
