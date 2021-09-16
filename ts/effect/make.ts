import * as GWU from 'gw-utils';

import { EffectInfo, EffectBase, EffectConfig } from './types';
import { Handler, handlers } from './handler';
import { Effect as Flags } from '../flags';

export function make(opts: EffectBase): EffectInfo {
    if (!opts) throw new Error('opts required to make effect.');

    if (typeof opts === 'string') {
        throw new Error('Cannot make effect from string: ' + opts);
    }

    if (typeof opts === 'function') {
        opts = { fn: opts };
    }

    // now make base effect stuff
    const info: EffectInfo = {
        flags: GWU.flag.from(Flags, opts.flags),
        chance: opts.chance ?? 0, // 0 means always fire
        next: null,
        id: opts.id || 'n/a',
    };

    if (opts.next) {
        if (typeof opts.next === 'string') {
            info.next = opts.next;
        } else {
            info.next = make(opts.next);
        }
    }

    // and all the handlers
    Object.values(handlers).forEach((v: Handler) => v.make(opts, info));

    return info;
}

export function from(opts: EffectBase | string): EffectInfo {
    if (!opts) throw new Error('Cannot make effect from null | undefined');
    if (typeof opts === 'string') {
        const effect = effects[opts];
        if (effect) return effect;
        throw new Error('Unknown effect - ' + opts);
    }
    return make(opts);
}

// resetMessageDisplayed
export function reset(effect: EffectInfo) {
    effect.flags &= ~Flags.E_FIRED;
}

export function resetAll() {
    Object.values(effects).forEach((e) => reset(e));
}

export const effects: Record<string, EffectInfo> = {};

export function install(id: string, config: Partial<EffectConfig>): EffectInfo {
    const effect = make(config);
    effects[id] = effect;
    effect.id = id;
    return effect;
}

export function installAll(effects: Record<string, Partial<EffectConfig>>) {
    Object.entries(effects).forEach(([id, config]) => {
        install(id, config);
    });
}
