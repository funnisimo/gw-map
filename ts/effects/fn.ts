import * as ACTION from '../action';
import { installHandler } from '../effect';

export function fn(cfg: ACTION.ActionFn | ACTION.ActionFn[]): ACTION.ActionFn {
    if (typeof cfg === 'function') return cfg;
    return (a: ACTION.Action) => {
        for (let fn of cfg) {
            fn(a);
            if (a.isDone()) return;
        }
    };
}

installHandler('fn', fn);
