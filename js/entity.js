import * as GW from 'gw-utils';
import { Layer as Flags, Depth } from './flags';
import * as Light from './light';
export { Flags, Depth };
export class Entity {
    constructor(config) {
        this.priority = 50;
        this.layer = 0;
        this.light = null;
        this.flags = { layer: 0 };
        this.sprite = GW.make.sprite(config.sprite || config);
        this.light = config.light ? Light.make(config.light) : null;
        this.priority = GW.utils.first(config.priority, 50);
        this.layer =
            (config.layer && typeof config.layer !== 'number'
                ? Depth[config.layer]
                : config.layer) || 0;
        // @ts-ignore
        this.flags.layer = GW.flag.from(Flags, config.layerFlags, config.flags, 0);
    }
    hasLayerFlag(flag) {
        return (this.flags.layer & flag) > 0;
    }
}
export function make(config) {
    return new Entity(config);
}
GW.make.layer = make;
