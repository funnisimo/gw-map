import { installHandler } from '../effect';
import * as ACTION from '../action';
import * as EFFECT from '../effect';

//////////////////////////////////////////////
// chance

export function chance(opts: EFFECT.EffectConfig): ACTION.ActionFn {
    if (Array.isArray(opts)) {
        opts = opts[0];
    }
    if (typeof opts === 'object') {
        opts = opts.chance;
    }
    if (typeof opts === 'string') {
        if (opts.endsWith('%')) {
            opts = Number.parseFloat(opts) * 100;
        } else {
            opts = Number.parseInt(opts || '10000');
        }
    }
    if (typeof opts !== 'number') {
        throw new Error(
            'Chance effect config must be number or string that can be a number.'
        );
    }
    return chanceAction.bind(undefined, opts);
}

export function chanceAction(cfg: number, action: ACTION.Action): void {
    const map = action.map;
    if (!map.rng.chance(cfg)) return action.stop();
}

installHandler('chance', chance);
