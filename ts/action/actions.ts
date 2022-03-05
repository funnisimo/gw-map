import * as GWU from 'gw-utils';
import { ActionOpts } from '.';
import { Action } from './action';

export type CancelFn = () => void;

export type NextFn = () => number;
export interface ActionFn {
    (action: Action): void;
    seen?: boolean;
}

interface ActionInfo {
    fn: ActionFn;
    ctx?: any;
    once?: boolean;
}

export type UnhandledFn = (ev: string, action: Action) => void;

export interface ActionObj {
    [key: string]: ActionFn | ActionFn[];
}

export class Actions {
    _handlers: Record<string, (null | ActionInfo)[]> = {};
    _ctx: any;

    onUnhandled: UnhandledFn | null = null;

    constructor(ctx?: any) {
        this._ctx = ctx;
    }

    copy(other: Actions) {
        Object.entries(other._handlers).forEach(([ev, fns]) => {
            if (!fns) return;
            this._handlers[ev] = Array.isArray(fns) ? fns.slice() : fns;
        });
    }

    has(ev: string): boolean {
        const events = this._handlers[ev];
        if (!events) return false;
        return events.some((e) => e && !!e.fn);
    }

    on(ev: string | string[], fn: ActionFn | ActionFn[]): CancelFn {
        if (Array.isArray(ev)) {
            const cleanup = ev.map((e) => this.on(e, fn));
            return () => {
                cleanup.forEach((c) => c());
            };
        }

        if (Array.isArray(fn)) {
            const cleanup = fn.map((cb) => this.on(ev, cb));
            return () => {
                cleanup.forEach((c) => c());
            };
        }

        let handlers = this._handlers[ev];
        if (!handlers) {
            handlers = this._handlers[ev] = [];
        }
        const info = { fn };
        handlers.unshift(info);
        return () => {
            const events = this._handlers[ev];
            if (Array.isArray(events)) {
                GWU.arrayNullify(events, info);
            }
        };
    }

    load(obj: ActionObj): void {
        Object.entries(obj).forEach(([ev, cfg]) => {
            this.on(ev, cfg);
        });
    }

    once(ev: string | string[], fn: ActionFn | ActionFn[]): CancelFn {
        if (Array.isArray(ev)) {
            const cleanup = ev.map((e) => this.once(e, fn));
            return () => {
                cleanup.forEach((c) => c());
            };
        }
        if (Array.isArray(fn)) {
            const cleanup = fn.map((cb) => this.on(ev, cb));
            return () => {
                cleanup.forEach((c) => c());
            };
        }

        let handlers = this._handlers[ev];
        if (!handlers) {
            handlers = this._handlers[ev] = [];
        }
        const info = { fn, once: true };
        handlers.unshift(info);
        return () => {
            const events = this._handlers[ev];
            if (Array.isArray(events)) {
                GWU.arrayNullify(events, info);
            }
        };
    }

    off(ev: string | string[], cb?: ActionFn): void {
        if (Array.isArray(ev)) {
            ev.forEach((e) => this.off(e, cb));
            return;
        }

        const events = this._handlers[ev];
        if (!events) return;

        if (cb) {
            const current = events.findIndex((i) => i && i.fn === cb);
            if (current > -1) {
                events[current] = null;
            }
        } else {
            for (let i = 0; i < events.length; ++i) {
                events[i] = null;
            }
        }
    }

    trigger(ev: string | string[], action: Action): boolean {
        if (!action) throw new Error('Need Action parameter.');
        if (Array.isArray(ev)) {
            let didSomething = false;
            for (let name of ev) {
                didSomething = this.trigger(name, action) || didSomething;
                if (action.isDone()) return didSomething;
            }
            return didSomething;
        }

        const handlers = this._handlers[ev];
        if (!handlers || handlers.length == 0) {
            return this._unhandled(ev, action);
        }

        for (let i = 0; i < handlers.length; ++i) {
            const info = handlers[i];
            if (info) {
                if (info.fn) {
                    // console.log('info.fn', info.fn);
                    info.fn.call(this._ctx, action);
                }
                if (info.once) {
                    handlers[i] = null;
                }
            }

            if (action.isDone()) break;
        }

        this._handlers[ev] = handlers.filter((i) => i);
        return true;
    }

    _unhandled(ev: string, action: Action): boolean {
        if (!this.onUnhandled) return false;
        this.onUnhandled(ev, action);
        return true;
    }

    clear() {
        this._handlers = {};
        this.onUnhandled = null;
    }

    restart() {
        Object.keys(this._handlers).forEach((ev) => {
            this._handlers[ev] = this._handlers[ev].filter((i) => i && !i.once);
        });
        // this.onUnhandled = null;
    }
}

const global = new Actions();

export function install(ev: string, fn: ActionFn) {
    fn.seen = false;
    global.on(ev, fn);
}

export function doAction(ev: string, action: Action | ActionOpts = {}): void {
    if (!(action instanceof Action)) {
        action = new Action(action);
    }

    if (action.actor) {
        if (!action.actor.canDoAction(ev)) {
            return action.fail();
        }
    }
    if (action.item) {
        if (!action.item.canDoAction(ev)) {
            return action.fail();
        }
    }

    action.map.trigger(ev, action);
    if (action.isDone()) return;

    if (action.item) {
        action.item.trigger(ev, action);
        if (action.isDone()) return;
    }

    action.actor && action.actor.trigger(ev, action);
    if (action.isDone()) return;

    action.game.trigger(ev, action);
    if (action.isDone()) return;

    global.trigger(ev, action);
}

export function defaultAction(ev: string, _action: Action): void {
    // if we get here then there was no action installed, this is a problem
    throw new Error('Unhandled action - ' + ev);
}

global.onUnhandled = defaultAction;
