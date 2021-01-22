import * as GW from "gw-utils";
import { Layer as Flags, Depth } from "./flags";
import * as Light from "./light";
export { Flags, Depth };
export interface LayerConfig extends GW.canvas.SpriteConfig {
    priority: number;
    depth: Depth | keyof typeof Depth;
    light: Light.LightBase | null;
    layerFlags?: GW.flag.FlagBase;
    flags?: GW.flag.FlagBase;
    sprite?: GW.canvas.SpriteConfig;
}
export declare class Layer implements GW.types.LayerType {
    sprite: GW.types.SpriteType;
    priority: number;
    depth: number;
    light: Light.Light | null;
    flags: GW.types.LayerFlags;
    constructor(config: Partial<LayerConfig>);
    hasLayerFlag(flag: number): boolean;
}
export declare function make(config: Partial<LayerConfig>): Layer;
