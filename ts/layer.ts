import * as GW from "gw-utils";
import { Layer as Flags, Depth } from "./flags";
import * as Light from "./light";

export { Flags, Depth };

export interface LayerConfig extends GW.canvas.SpriteConfig {
  priority: number;
  depth: Depth | keyof typeof Depth;
  light: Light.LightBase;
  layerFlags?: GW.flag.FlagBase;
  flags?: GW.flag.FlagBase;
  sprite?: GW.canvas.SpriteConfig;
}

export class Layer implements GW.types.LayerType {
  sprite: GW.types.SpriteType;
  priority = 50;
  depth = 0;
  light: Light.Light | null = null;
  flags: GW.types.LayerFlags = { layer: 0 };

  constructor(config: Partial<LayerConfig>) {
    this.sprite = GW.make.sprite(config.sprite || config);
    this.light = config.light ? Light.make(config.light) : null;
    this.priority = GW.utils.first(config.priority, 50);
    this.depth =
      (config.depth && typeof config.depth !== "number"
        ? Depth[config.depth]
        : config.depth) || 0;
    // @ts-ignore
    this.flags.layer = GW.flag.from(Flags, config.layerFlags, config.flags, 0);
  }
}

export function make(config: Partial<LayerConfig>) {
  return new Layer(config);
}

GW.make.layer = make;
