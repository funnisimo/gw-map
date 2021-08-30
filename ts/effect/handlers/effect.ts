import * as EFFECT from '../install';
import * as TYPES from '../types';
import { Handler } from '../handler';
import { MapType } from '../../map/types';
import * as FIRE from '../fire';

//////////////////////////////////////////////
// EMIT

export class EffectEffect implements Handler {
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

    fireSync(
        config: TYPES.EffectInfo,
        map: MapType,
        x: number,
        y: number,
        ctx: TYPES.EffectCtx
    ) {
        if (config.effect) {
            return FIRE.fireSync(config.effect, map, x, y, ctx);
        }
        return false;
    }
}

EFFECT.installHandler('effect', new EffectEffect());
