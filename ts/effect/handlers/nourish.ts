import * as GWU from 'gw-utils';
import * as Effect from '../effect';
import { Actor } from '../../actor/actor';

import { Stats, AdjustType } from '../../actor/stat';

export interface NoursihConfig {
    type: AdjustType;
    amount: GWU.range.RangeBase;
}

export interface NourishInfo {
    type: AdjustType;
    amount: GWU.range.Range;
}

export function makeNourishEffect(opts: any): Effect.EffectFn {
    if (!opts) throw new Error('Invalid Nourish config.');

    let info = {} as NourishInfo;

    if (typeof opts === 'string') {
        opts = opts.split(':').map((t) => t.trim());
    }
    if (Array.isArray(opts)) {
        info.type = opts[0] || 'inc';
        info.amount = GWU.range.make(opts[1] || 1);
    } else if (opts.type || opts.amount) {
        info.type = opts.type || 'inc';
        info.amount = GWU.range.make(opts.amount || 1);
    } else {
        throw new Error('Invalid Nourish config: ' + JSON.stringify(opts));
    }

    return nourishEffect.bind(undefined, info);
}

export function nourishEffect(
    config: NourishInfo,
    loc: Effect.MapXY,
    _ctx?: Effect.EffectCtx
): boolean {
    if (!config.amount) return false;

    // who am I nourishing?
    const actor = loc.map.actorAt(loc.x, loc.y) as Actor;
    if (!actor) {
        return false;
    }

    const stats: Stats = actor.stats;
    const c = stats.get('food');

    if (!stats.adjust('food', config.type, config.amount)) return false;

    const n = stats.get('food');
    if (n < c && n / stats.max('food') < 0.1) {
        GWU.message.addAt(actor.x, actor.y, nourishEffect.default.pukeMsg, {
            actor,
        });
    }

    return true;
}

nourishEffect.default = {
    pukeMsg: '%you vomit.',
};

Effect.installHandler('nourish', makeNourishEffect);
