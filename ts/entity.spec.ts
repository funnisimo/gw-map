import * as Map from "./gw";
import * as GW from "gw-utils";

describe("Layer", () => {
  test("constructor", () => {
    const layer = new Map.layer.Entity({
      ch: "@",
      fg: "white",
      flags: "L_BLOCKS_MOVE",
      layer: "SURFACE",
    });

    expect(layer.sprite).toMatchObject({
      ch: "@",
      fg: GW.colors.white,
      bg: -1,
    });
    expect(layer.flags.layer).toEqual(Map.layer.Flags.L_BLOCKS_MOVE);
    expect(layer.layer).toEqual(Map.layer.Depth.SURFACE);
    expect(layer.priority).toEqual(50);
  });

  test("priority=0", () => {
    const layer = new Map.layer.Entity({
      ch: "@",
      fg: "white",
      priority: 0,
    });

    expect(layer.priority).toEqual(0);
  });

  test("make from sprite", () => {
    const layer = new Map.layer.Entity(
      GW.make.sprite({ ch: "!", fg: "white" })
    );
    expect(layer.sprite.ch).toEqual("!");
    expect(layer.sprite.fg).toEqual(GW.colors.white);
    expect(layer.layer).toEqual(0);
    expect(layer.priority).toEqual(50);
    expect(layer.flags.layer).toEqual(0);
  });

  test("make with sprite", () => {
    const layer = new Map.layer.Entity({
      sprite: GW.make.sprite({ ch: "!", fg: "white" }),
    });
    expect(layer.sprite.ch).toEqual("!");
    expect(layer.sprite.fg).toEqual(GW.colors.white);
    expect(layer.layer).toEqual(0);
    expect(layer.priority).toEqual(50);
    expect(layer.flags.layer).toEqual(0);
  });
});
