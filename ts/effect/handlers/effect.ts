import * as TYPES from '../types';
import { Handler, installHandler } from '../handler';
import { MapType } from '../../map/types';
import * as FIRE from '../fire';

//////////////////////////////////////////////
// EMIT

export class EffectEffect extends Handler {
    constructor() {
        super();
    }

    make(src: Partial<TYPES.EffectConfig>, dest: TYPES.EffectInfo): boolean {
        if (!src.effect) return true;

        dest.effect = src.effect;
        return true;
    }

    async fire(
        config: any,
        map: MapType,
        x: number,
        y: number,
        ctx: TYPES.EffectCtx
    ) {
        if (config.effect) {
            return await FIRE.fire(config.effect, map, x, y, ctx);
        }
        return false;
    }
}

installHandler('effect', new EffectEffect());
