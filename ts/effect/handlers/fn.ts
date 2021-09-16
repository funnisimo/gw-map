import * as TYPES from '../types';
import { Handler, installHandler } from '../handler';
import { MapType } from '../../map/types';

//////////////////////////////////////////////
// FN

export class FnEffect extends Handler {
    constructor() {
        super();
    }

    make(src: Partial<TYPES.EffectConfig>, dest: TYPES.EffectInfo): boolean {
        if (!src.fn) return true;

        if (typeof src.fn !== 'function') {
            throw new Error('fn effects must be functions.');
        }
        dest.fn = src.fn;
        return true;
    }

    async fire(
        config: any,
        map: MapType,
        x: number,
        y: number,
        ctx: Partial<TYPES.EffectCtx>
    ) {
        if (config.fn) {
            return await config.fn(config, map, x, y, ctx);
        }
        return false;
    }
}

installHandler('fn', new FnEffect());
