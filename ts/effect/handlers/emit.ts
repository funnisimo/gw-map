import * as GWU from 'gw-utils';

import * as EFFECT from '../install';
import * as TYPES from '../types';
import { Handler } from '../handler';
import { MapType } from '../../map/types';

//////////////////////////////////////////////
// EMIT

export class EmitEffect implements Handler {
    make(src: Partial<TYPES.EffectConfig>, dest: TYPES.EffectInfo): boolean {
        if (!src.emit) return true;

        if (typeof src.emit !== 'string') {
            throw new Error(
                'emit effects must be string name to emit: { emit: "EVENT" }'
            );
        }
        dest.emit = src.emit;
        return true;
    }

    async fire(
        config: any,
        _map: MapType,
        x: number,
        y: number,
        ctx: TYPES.EffectCtx
    ) {
        if (config.emit) {
            await GWU.events.emit(config.emit, x, y, ctx);
            return true;
        }
        return false;
    }

    fireSync(
        config: TYPES.EffectInfo,
        _map: MapType,
        _x: number,
        _y: number,
        _ctx: TYPES.EffectCtx
    ) {
        if (!config.emit) return false;
        throw new Error('Cannot use "emit" effects in build steps.');
    }
}

EFFECT.installHandler('emit', new EmitEffect());
