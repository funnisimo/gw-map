import * as GWU from 'gw-utils';
import { Actor } from '../actor/actor';
import { Game } from '../game/game';
import { Item } from '../item';

// Experiments in middleware based actions...
// Needs much more work...

export interface ActionRequest {
    action: string; // name of the action e.g. 'pickup'
    game: Game; // global game object
    actor: Actor; // actor doing the acting

    item?: Item; // item being acted upon (if any/known)
    target?: Actor;

    dir?: GWU.xy.Loc;

    [key: string]: any; // add anything you want
}

export interface ActionResult {
    time: number; // turn time (-1 means dead, 0 means no action, >0 means did something)
    success: boolean;
    fail: boolean;
    logged?: boolean; // message was logged

    [key: string]: any; // add anything you want
}

export type ActionNext = () => void;

export type ActionFn = (
    req: ActionRequest,
    res: ActionResult,
    next: ActionNext
) => void;

export type ActionAfterFn = (req: ActionRequest, res: ActionResult) => void;

export enum Priority {
    FIRST = 0,
    EARLY = 25,
    NORMAL = 50,
    LATE = 75,
    LAST = 100,
}

export interface Action {
    fn: ActionFn;
    priority: Priority;
}

interface ActionData {
    fns: Action[];
    afterFns: ActionAfterFn[];
}

const ACTIONS: Record<string, ActionData> = {};

export function use(
    name: string,
    fn: ActionFn,
    afterFn?: ActionAfterFn,
    priority?: number | keyof typeof Priority
): void;
export function use(
    name: string,
    fn: ActionFn,
    priority?: number | keyof typeof Priority
): void;
export function use(
    name: string,
    fn: ActionFn,
    afterFn?: ActionAfterFn | number | keyof typeof Priority,
    priority?: number | keyof typeof Priority
): void {
    if (typeof afterFn !== 'function') {
        priority = afterFn;
        afterFn = undefined;
    }
    if (priority === undefined) priority = Priority.NORMAL;

    if (typeof priority === 'string') {
        priority = Priority[priority] || 50;
    }

    if (name.startsWith('!') || name.startsWith('^')) {
        name = name.substring(1);
        priority = Priority.FIRST;
    } else if (name.startsWith('-')) {
        name = name.substring(1);
        priority = Priority.EARLY;
    } else if (name.startsWith('+')) {
        name = name.substring(1);
        priority = Priority.LATE;
    } else if (name.startsWith('$')) {
        name = name.substring(1);
        priority = Priority.LAST;
    }

    if (!(name in ACTIONS)) {
        ACTIONS[name] = { fns: [], afterFns: [] };
    }

    const data = ACTIONS[name];

    const a = { fn, priority };

    data.fns.unshift(a); // should go before others with same priority
    data.fns.sort((a, b) => a.priority - b.priority);

    if (afterFn) {
        data.afterFns.push(afterFn);
    }
}

export function useAfter(name: string, fn: ActionAfterFn) {
    if (!(name in ACTIONS)) {
        ACTIONS[name] = { fns: [], afterFns: [] };
    }
    const data = ACTIONS[name];
    data.afterFns.push(fn);
}

export function exec(action: string, req: ActionRequest): ActionResult {
    const res = { success: false, fail: false, time: 0 } as ActionResult;
    const data = ACTIONS[action];
    if (data) {
        _exec(req, res, data.fns, data.afterFns);
    }

    return res;
}

export function _exec(
    req: ActionRequest,
    res: ActionResult,
    fns: Action[],
    afterFns: ActionAfterFn[] = []
) {
    let index = -1;

    function next() {
        index += 1;
        if (index >= fns.length) {
            return;
            // const actor = req.actor;
            // return actor.exec(action, req, res);
        }
        fns[index].fn(req, res, next);
    }

    next();

    afterFns.forEach((fn) => fn(req, res));
}

/*
    ActorKind
        actions: Record<string,ActionFn[]>={};
        use(action, fn, priority) {
            // push
            // sort
        }
        exec(action,req, res) {
            // see exec
        }
*/
