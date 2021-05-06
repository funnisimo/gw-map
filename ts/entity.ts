import * as GW from 'gw-utils';
import { Entity as Flags, Layer } from './mapFlags';
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

export class Entity implements GW.types.EntityType {
    sprite: GW.types.SpriteType;
    priority = 50;
    layer = 0;
    light: Light.Light | null = null;
    flags: GW.types.LayerFlags = { layer: 0 };

    constructor(config: Partial<EntityConfig>) {
        this.sprite = GW.make.sprite(config.sprite || config);
        this.light = config.light ? Light.make(config.light) : null;
        this.priority = GW.utils.first(config.priority, 50);
        this.layer =
            (config.layer && typeof config.layer !== 'number'
                ? Layer[config.layer]
                : config.layer) || 0;
        // @ts-ignore
        this.flags.layer = GW.flag.from(
            Flags,
            config.layerFlags,
            config.flags,
            0
        );
    }

    hasLayerFlag(flag: number): boolean {
        return (this.flags.layer & flag) > 0;
    }
}

export function make(config: Partial<EntityConfig>) {
    return new Entity(config);
}

GW.make.layer = make;
