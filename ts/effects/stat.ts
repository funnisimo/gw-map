import * as GWU from 'gw-utils';

import * as Effect from '../effect';
import { AdjustType, Stats } from '../actor/stat';
import * as ACTION from '../action';

export interface StatInfo {
    stat: string;
    type: AdjustType;
    amount: GWU.range.Range;
}

export function stat(opts: any): ACTION.ActionFn {
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

    return statAction.bind(undefined, info);
}

export function statAction(config: StatInfo, action: ACTION.Action): void {
    if (!config.amount) return action.didNothing();

    // who am I nourishing?
    const actor = action.actor || action.map.actorAt(action.x, action.y);
    if (!actor) {
        return action.didNothing();
    }

    // sustain?

    const stats: Stats = actor.stats;
    if (!stats.adjust(config.stat, config.type, config.amount))
        return action.didNothing();
    return action.didSomething();
}

Effect.installHandler('stat', stat);
