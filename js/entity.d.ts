import * as GW from "gw-utils";
import { Layer as Flags, Depth } from "./flags";
import * as Light from "./light";
export { Flags, Depth };
export interface EntityConfig extends GW.canvas.SpriteConfig {
    priority: number;
    layer: Depth | keyof typeof Depth;
    light: Light.LightBase | null;
    layerFlags?: GW.flag.FlagBase;
    flags?: GW.flag.FlagBase;
    sprite?: GW.canvas.SpriteConfig;
}
export declare class Entity implements GW.types.EntityType {
    sprite: GW.types.SpriteType;
    priority: number;
    layer: number;
    light: Light.Light | null;
    flags: GW.types.LayerFlags;
    constructor(config: Partial<EntityConfig>);
    hasLayerFlag(flag: number): boolean;
}
export declare function make(config: Partial<EntityConfig>): Entity;
