import "jest-extended";
import "../test/matchers";

import * as Map from "./gw";
import * as GW from "gw-utils";

describe("light", () => {
  let light: Map.light.Light;

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

  test("copy", () => {
    const a = GW.make.light("blue", 3, 0);
    const b = GW.make.light("red", 3, 0);

    expect(a).not.toMatchObject(b);
    a.copy(b);
    expect(a).toMatchObject(b);
  });

  // TODO -
  test("intensity", () => {
    const a = GW.make.light("white", 4, 0);
    expect(a.intensity).toEqual(100);

    const b = GW.make.light("green", 3, 0);
    expect(b.intensity).toEqual(100);

    const c = GW.make.light(0x888, 3, 0);
    expect(c.intensity).toEqual(53);

    const d = GW.make.light(0x000, 3, 0);
    expect(d.intensity).toEqual(0);
  });

  test("from", () => {
    light = Map.light.install("TEST", { color: "teal", radius: 2 });

    expect(Map.light.from("TEST")).toBe(light);
    expect(Map.light.from("red, 3, 0")).toMatchObject({
      color: GW.colors.red,
      radius: { clumps: 1, hi: 3, lo: 3 },
      fadeTo: 0,
    });
    // @ts-ignore
    expect(() => Map.light.from("teal", 3, 50)).toThrow();
  });

  test("can add light kinds", () => {
    light = Map.light.install("TEST", { color: "blue", radius: 3, fadeTo: 50 });
    expect(light).toBe(Map.lights.TEST);
    expect(light.id).toEqual("TEST");
    expect(light.color).toEqual(GW.colors.blue);
    expect(light.radius).toMatchObject({ clumps: 1, hi: 3, lo: 3 });
    expect(light.fadeTo).toEqual(50);
    expect(light.passThroughActors).toBeFalsy();

    light = Map.light.install("TEST2", "blue", 3, 50);
    expect(light).toBe(Map.lights.TEST2);
    expect(light.id).toEqual("TEST2");
    expect(light.color).toEqual(GW.colors.blue);
    expect(light.radius).toMatchObject({ clumps: 1, hi: 3, lo: 3 });
    expect(light.fadeTo).toEqual(50);
    expect(light.passThroughActors).toBeFalsy();

    light = Map.light.install("TEST3", "blue, 3, 50");
    expect(light).toBe(Map.lights.TEST3);
    expect(light.id).toEqual("TEST3");
    expect(light.color).toEqual(GW.colors.blue);
    expect(light.radius).toMatchObject({ clumps: 1, hi: 3, lo: 3 });
    expect(light.fadeTo).toEqual(50);
    expect(light.passThroughActors).toBeFalsy();
  });

  test("installAll", () => {
    Map.light.installAll({
      TEST4: { color: "blue", radius: 3, fadeTo: 50 },
      TEST5: "red, 4, 100",
      TEST6: ["green", 5, 0],
    });

    light = Map.lights.TEST4;
    expect(light.id).toEqual("TEST4");
    expect(light.color).toEqual(GW.colors.blue);
    expect(light.radius).toMatchObject({ clumps: 1, hi: 3, lo: 3 });
    expect(light.fadeTo).toEqual(50);
    expect(light.passThroughActors).toBeFalsy();

    light = Map.lights.TEST5;
    expect(light.id).toEqual("TEST5");
    expect(light.color).toEqual(GW.colors.red);
    expect(light.radius).toMatchObject({ clumps: 1, hi: 4, lo: 4 });
    expect(light.fadeTo).toEqual(100);
    expect(light.passThroughActors).toBeFalsy();

    light = Map.lights.TEST6;
    expect(light.id).toEqual("TEST6");
    expect(light.color).toEqual(GW.colors.green);
    expect(light.radius).toMatchObject({ clumps: 1, hi: 5, lo: 5 });
    expect(light.fadeTo).toEqual(0);
    expect(light.passThroughActors).toBeFalsy();
  });

  describe("updateLighting", () => {
    let map: Map.map.Map;
    let cell: Map.cell.Cell;

    beforeEach(() => {
      map = GW.make.map(20, 20, "FLOOR", "WALL");
    });

    test("defaults to having white light", () => {
      expect(map.flags & Map.map.Flags.MAP_STABLE_GLOW_LIGHTS).toBeTruthy();
      expect(map.flags & Map.map.Flags.MAP_STABLE_LIGHTS).toBeTruthy();
      map.eachCell((cell) => {
        expect(cell.light).toEqual([100, 100, 100]);
        expect(cell.flags & Map.cell.Flags.CELL_LIT).toBeFalsy();
        expect(cell.flags & Map.cell.Flags.CELL_DARK).toBeFalsy();
        expect(cell.flags & Map.cell.Flags.LIGHT_CHANGED).toBeFalsy();
      });
    });

    test("will return to default from stable glow lights", () => {
      map.flags &= ~Map.map.Flags.MAP_STABLE_LIGHTS;
      expect(map.flags & Map.map.Flags.MAP_STABLE_GLOW_LIGHTS).toBeTruthy();
      Map.light.updateLighting(map);

      expect(map.flags & Map.map.Flags.MAP_STABLE_GLOW_LIGHTS).toBeTruthy();
      expect(map.flags & Map.map.Flags.MAP_STABLE_LIGHTS).toBeTruthy();
      map.eachCell((cell) => {
        expect(cell.light).toEqual([100, 100, 100]);
        expect(cell.flags & Map.cell.Flags.IS_IN_SHADOW).toBeTruthy();
        expect(cell.flags & Map.cell.Flags.CELL_LIT).toBeFalsy();
        expect(cell.flags & Map.cell.Flags.CELL_DARK).toBeFalsy();
        expect(cell.flags & Map.cell.Flags.LIGHT_CHANGED).toBeFalsy();
      });
    });

    test("will set ambient light", () => {
      expect(map.ambientLight).toBeNull();

      map.ambientLight = GW.colors.blue;
      map.flags &= ~Map.map.Flags.MAP_STABLE_LIGHTS;

      // stable glow lights will keep ambient light change from taking hold
      expect(map.flags & Map.map.Flags.MAP_STABLE_GLOW_LIGHTS).toBeTruthy();
      Map.light.updateLighting(map);

      map.eachCell((cell) => {
        expect(cell.light).toEqual([100, 100, 100]);
      });

      map.flags &= ~(
        Map.map.Flags.MAP_STABLE_LIGHTS | Map.map.Flags.MAP_STABLE_GLOW_LIGHTS
      );
      Map.light.updateLighting(map);

      map.eachCell((cell) => {
        expect(cell.light).toEqual([0, 0, 100]);
      });
    });

    test("will add lights from tiles", () => {
      Map.light.install("TORCH", { color: "yellow", radius: 3, fadeTo: 50 });
      Map.tile.install("WALL_TORCH", {
        name: "wall with a torch",
        light: "TORCH",
        flags: "T_OBSTRUCTS_EVERYTHING",
      });

      expect(map.flags & Map.map.Flags.MAP_STABLE_LIGHTS).toBeTruthy();
      expect(map.flags & Map.map.Flags.MAP_STABLE_GLOW_LIGHTS).toBeTruthy();
      map.setTile(10, 10, "WALL_TORCH");

      expect(map.ambientLight).toBeNull();
      expect(map.flags & Map.map.Flags.MAP_STABLE_LIGHTS).toBeFalsy();
      expect(map.flags & Map.map.Flags.MAP_STABLE_GLOW_LIGHTS).toBeFalsy();

      Map.light.updateLighting(map);

      cell = map.cell(1, 1);
      expect(cell.light).toEqual([0, 0, 0]);

      cell = map.cell(10, 10);
      expect(cell.light).toEqual([100, 100, 0]);
    });

    test("will add lights from tiles to ambient light", () => {
      Map.light.install("TORCH", { color: "yellow", radius: 3, fadeTo: 50 });
      Map.tile.install("WALL_TORCH", {
        name: "wall with a torch",
        light: "TORCH",
        flags: "T_OBSTRUCTS_EVERYTHING",
      });

      map.ambientLight = GW.color.make(0x202020, true);
      expect(map.flags & Map.map.Flags.MAP_STABLE_LIGHTS).toBeTruthy();
      expect(map.flags & Map.map.Flags.MAP_STABLE_GLOW_LIGHTS).toBeTruthy();
      map.setTile(10, 10, "WALL_TORCH");

      expect(map.ambientLight.toString(true)).toEqual("#212121");
      expect(map.flags & Map.map.Flags.MAP_STABLE_LIGHTS).toBeFalsy();
      expect(map.flags & Map.map.Flags.MAP_STABLE_GLOW_LIGHTS).toBeFalsy();

      Map.light.updateLighting(map);

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
      Map.light.install("TORCH", { color: "yellow", radius: 3, fadeTo: 50 });
      expect(map.flags & Map.map.Flags.MAP_STABLE_LIGHTS).toBeTruthy();
      expect(map.flags & Map.map.Flags.MAP_STABLE_GLOW_LIGHTS).toBeTruthy();

      map.ambientLight = GW.color.make(0x202020, true);
      map.addStaticLight(10, 10, Map.light.from("TORCH"));
      expect(map.flags & Map.map.Flags.MAP_STABLE_LIGHTS).toBeFalsy();
      expect(map.flags & Map.map.Flags.MAP_STABLE_GLOW_LIGHTS).toBeFalsy();

      Map.light.updateLighting(map);

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

  test("dynamic lights", () => {
    const map = GW.make.map(10, 10, "FLOOR");
    map.ambientLight = [0, 0, 0];
    map.clearFlags(
      Map.map.Flags.MAP_STABLE_GLOW_LIGHTS | Map.map.Flags.MAP_STABLE_LIGHTS
    );
    Map.light.updateLighting(map);
    expect(map.cell(3, 3).light).toEqual([0, 0, 0]);

    const actor = ({
      x: 0,
      y: 0,
      light: GW.make.light("white, 3, 100"),
      flags: 0,
      isPlayer() {
        return true;
      },
    } as unknown) as GW.types.ActorType;

    map.addActor(3, 3, actor);
    expect(map.cell(3, 3).actor).toBe(actor);

    map.clearFlags(
      Map.map.Flags.MAP_STABLE_GLOW_LIGHTS | Map.map.Flags.MAP_STABLE_LIGHTS
    );
    Map.light.updateLighting(map);
    expect(map.cell(3, 3).light).toEqual([100, 100, 100]);
  });

  test("PLAYERS_LIGHT", () => {
    Map.light.install("PLAYERS_LIGHT", "white, 3, 100, true");

    const map = GW.make.map(10, 10, "FLOOR");
    map.ambientLight = [0, 0, 0];
    map.clearFlags(
      Map.map.Flags.MAP_STABLE_GLOW_LIGHTS | Map.map.Flags.MAP_STABLE_LIGHTS
    );
    Map.light.updateLighting(map);

    expect(map.cell(3, 3).light).toEqual([0, 0, 0]);
    GW.data.player = { x: 3, y: 3 };

    map.clearFlags(Map.map.Flags.MAP_STABLE_LIGHTS);
    Map.light.updateLighting(map);

    expect(map.cell(3, 3).light).toEqual([100, 100, 100]);
  });

  test("playerInDarkness", () => {
    const map = GW.make.map(10, 10, "FLOOR");
    const cell = map.cell(3, 3);
    expect(cell.light).toEqual([100, 100, 100]);
    expect(Map.light.playerInDarkness(map, { x: 3, y: 3 })).toBeFalsy();
    cell.light = [10, 10, 10];
    expect(Map.light.playerInDarkness(map, { x: 3, y: 3 })).toBeTruthy();
    expect(
      Map.light.playerInDarkness(map, { x: 3, y: 3 }, GW.colors.black)
    ).toBeFalsy();
  });
});
