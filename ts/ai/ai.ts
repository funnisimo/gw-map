import * as ACTION from '../action';

export interface AIOptions {
    fn?: ACTION.ActionFn | string;
    [field: string]: any;
}

export interface AIConfig {
    fn?: ACTION.ActionFn;
    [field: string]: any;
}

// AI functions
// actor is current actor
// returns time until next turn for this actor
// < 0 means do not requeue

export const ais: Record<string, ACTION.ActionFn> = {};

export function install(name: string, fn: ACTION.ActionFn) {
    ais[name] = fn;
}

export function make(opts: AIOptions | string | ACTION.ActionFn): AIConfig {
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
