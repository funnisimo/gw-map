import * as GW from 'gw-utils';
import { Entity as Flags, Layer } from './flags';
import * as Light from './light';
export { Flags, Layer };
export interface EntityConfig extends GW.sprite.SpriteConfig {
    priority: number;
    layer: Layer | keyof typeof Layer;
    light: Light.LightBase | null;
    layerFlags?: GW.flag.FlagBase;
    flags?: GW.flag.FlagBase;
    sprite?: GW.sprite.SpriteConfig;
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
