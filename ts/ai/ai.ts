import { Actor } from '../actor/actor';
import { Game } from '../game/game';

export interface AIOptions {
    fn?: ActorAiFn | string;
    [field: string]: any;
}

export interface AIConfig {
    fn?: ActorAiFn;
    [field: string]: any;
}

// AI functions
// actor is current actor
// returns time until next turn for this actor
// < 0 means do not requeue
export type ActorAiFn = (game: Game, actor: Actor) => Promise<number>;

export const ais: Record<string, ActorAiFn> = {};

export function install(name: string, fn: ActorAiFn) {
    ais[name] = fn;
}

export function make(opts: AIOptions | string | ActorAiFn): AIConfig {
    if (typeof opts === 'string') {
        opts = { fn: opts };
    }
    if (typeof opts === 'function') {
        opts = { fn: opts };
    }

    if (typeof opts.fn === 'string') {
        opts.fn = ais[opts.fn];
    }

    if (!opts.fn) {
        opts.fn = ais.default;
    }

    return opts as AIConfig;
}
