import * as GWU from 'gw-utils';
import * as ACTION from '../action';
import * as EFFECT from '../effect';
import { Actor } from '../actor/actor';

import { Stats, AdjustType } from '../actor/stat';

export interface NoursihConfig {
    type: AdjustType;
    amount: GWU.range.RangeBase;
}

export interface NourishInfo {
    type: AdjustType;
    amount: GWU.range.Range;
}

export function nourish(opts: any): ACTION.ActionFn {
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

    return nourishAction.bind(undefined, info);
}

export function nourishAction(
    config: NourishInfo,
    action: ACTION.Action
): void {
    if (!config.amount) return action.didNothing();

    // who am I nourishing?
    const map = action.map;

    const actor = map.actorAt(action.x, action.y) as Actor;
    if (!actor) {
        return action.didNothing();
    }

    const stats: Stats = actor.stats;
    const c = stats.get('food');

    if (!stats.adjust('food', config.type, config.amount))
        return action.didNothing();

    const n = stats.get('food');
    if (n < c && n / stats.max('food') < 0.1) {
        GWU.message.addAt(actor.x, actor.y, nourishAction.default.pukeMsg, {
            actor,
        });
    }

    return action.didSomething();
}

nourishAction.default = {
    pukeMsg: '%you vomit.',
};

EFFECT.installHandler('nourish', nourish);
