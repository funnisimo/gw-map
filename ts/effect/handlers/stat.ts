import * as GWU from 'gw-utils';

import * as Effect from '../effect';
import { Actor } from '../../actor/actor';
import { AdjustType, Stats } from '../../actor/stat';

export interface StatConfig {
    stat: string;
    type?: AdjustType;
    amount?: GWU.range.RangeBase;
}

export interface StatInfo {
    stat: string;
    type: AdjustType;
    amount: GWU.range.Range;
}

export function makeStatEffect(opts: any): Effect.EffectFn {
    if (!opts) throw new Error('Invalid Stat config.');

    const info = {} as StatInfo;

    if (typeof opts === 'string') {
        opts = opts.split(':').map((t) => t.trim());
    }
    if (Array.isArray(opts)) {
        info.stat = opts[0];
        info.type = opts[1] || 'inc';
        info.amount = GWU.range.make(opts[2] || 1);
    } else if (opts.type || opts.amount) {
        info.stat = opts.stat;
        info.type = opts.type || 'inc';
        info.amount = GWU.range.make(info.amount || 1);
    } else {
        throw new Error(
            'Invalid stat effect configuration: ' + JSON.stringify(opts)
        );
    }

    return statEffect.bind(undefined, info);
}

export function statEffect(
    config: StatInfo,
    loc: Effect.MapXY,
    _ctx?: Effect.EffectCtx
): boolean {
    if (!config.amount) return false;

    // who am I nourishing?
    const actor = loc.map.actorAt(loc.x, loc.y) as Actor;
    if (!actor) {
        return false;
    }

    // sustain?

    const stats: Stats = actor.stats;
    if (!stats.adjust('food', config.type, config.amount)) return false;
    return true;
}

Effect.installHandler('stat', makeStatEffect);
