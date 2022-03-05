import * as GWU from 'gw-utils';
import { Actor } from '../actor/actor';
import { Game } from '../game/game';
import { Item } from '../item/item';
import { Map } from '../map/map';

// Experiments in middleware based actions...
// Needs much more work...

export interface ActionOpts {
    game?: Game;
    map?: Map;
    item?: Item;
    actor?: Actor;
    target?: Actor;

    x?: number;
    y?: number;

    key?: boolean;
    force?: boolean;
    aware?: boolean;

    machine?: number;
}

export class Action {
    game: Game; // global game object
    map: Map;

    actor: Actor | null = null; // actor doing the acting
    item: Item | null = null; // item being acted upon (if any/known)

    x = 0;
    y = 0;

    key: boolean;
    target: Actor | null = null;

    dir: GWU.xy.Loc | null = null;

    aware = false;
    identified = false;
    machine = 0;

    try = false;
    force = false;
    good = false;
    seen = false;
    quiet = false;

    // nextAlways?: boolean;
    // nextEverywhere?: boolean;

    originX: number;
    originY: number;

    // TODO - move to Game
    // rng?: GWU.rng.Random;

    // time = 0; // turn time (-1 means dead, 0 means no action, >0 means did something)
    ok = false;
    failed = false;
    done = false;

    logged = false; // message was logged
    visible = false; // visible to player

    data: Record<string, any> = {};

    constructor(opts: ActionOpts) {
        this.map = opts.map!;

        this.actor = opts.actor || null;
        this.item = opts.item || null;
        this.target = opts.target || null;

        if (!this.map && this.actor) {
            this.map = this.actor.map!;
        }
        if (!this.map && this.item) {
            this.map = this.item.map!;
        }

        this.game = opts.game!;
        if (!this.game && this.map) {
            this.game = this.map.game;
        }

        if (opts.x !== undefined) {
            this.x = opts.x;
            this.y = opts.y!;
        } else if (this.actor) {
            this.x = this.actor.x;
            this.y = this.actor.y;
        } else if (this.item) {
            this.x = this.item.x;
            this.y = this.item.y;
        }

        this.originX = this.x;
        this.originY = this.y;

        this.key = !!opts.key;
        if (opts.force) this.force = true;
        if (opts.aware) this.aware = true;
        if (opts.machine) this.machine = opts.machine;
    }

    isSuccess(): boolean {
        return this.ok;
    }
    isFailed(): boolean {
        return this.failed;
    }

    didSomething(): void {
        this.ok = true;
    }
    didNothing(): void {}

    fail(): void {
        this.failed = true;
        this.done = true;
    }

    isDone(): boolean {
        return this.done;
    }
    stop(): void {
        this.done = true;
    }

    reset() {
        this.done = false;
        this.failed = false;
        this.ok = false;
    }
}

// export type ActionNext = () => boolean;

// export type ActionFn = (req: ActionCtx, next: ActionNext) => boolean;

// export type ActionAfterFn = (req: ActionCtx) => void;

// export enum Priority {
//     FIRST = 0,
//     EARLY = 25,
//     NORMAL = 50,
//     LATE = 75,
//     LAST = 100,
// }

// export interface Action {
//     fn: ActionFn;
//     priority: Priority;
// }

// interface ActionData {
//     fns: Action[];
//     afterFns: ActionAfterFn[];
// }

// export interface ActionObj {
//     [key: string]: ActionFn | ActionFn[] | null | false;
// }

// export type ActionBase = ActionFn | ActionFn[];

// export type ActionConfig = ActionBase | ActionObj;

// // function isActionObj(arg: any): arg is ActionObj {
// //     return typeof arg === 'object' && !Array.isArray(arg);
// // }

// export class ActionManager {
//     ACTIONS: Record<string, ActionData> = {};

//     has(name: string): boolean {
//         return name in this.ACTIONS;
//     }

//     load(obj: ActionObj) {
//         Object.entries(obj).forEach(([key, value]) => {
//             if (!value) {
//                 this.clear(key);
//             } else {
//                 this.use(key, value);
//             }
//         });
//     }

//     copy(other: ActionManager) {
//         Object.entries(other.ACTIONS).forEach(([name, data]) => {
//             this.ACTIONS[name] = {
//                 fns: data.fns.slice(),
//                 afterFns: data.afterFns.slice(),
//             };
//         });
//     }

//     clear(name: string) {
//         delete this.ACTIONS[name];
//     }

//     use(name: string, fn: ActionBase): void;
//     use(
//         name: string,
//         fn: ActionFn,
//         afterFn?: ActionAfterFn,
//         priority?: number | keyof typeof Priority
//     ): void;
//     use(
//         name: string,
//         fn: ActionFn,
//         priority?: number | keyof typeof Priority
//     ): void;
//     use(
//         name: string,
//         fn: ActionBase,
//         afterFn?: ActionAfterFn | number | keyof typeof Priority,
//         priority?: number | keyof typeof Priority
//     ): void {
//         if (Array.isArray(fn)) {
//             if (fn.length && !fn[0]) {
//                 this.clear(name);
//                 fn.shift();
//             }
//             fn = chain(...fn);
//         }

//         if (typeof afterFn !== 'function') {
//             priority = afterFn;
//             afterFn = undefined;
//         }
//         if (priority === undefined) priority = Priority.NORMAL;

//         if (typeof priority === 'string') {
//             priority = Priority[priority] || 50;
//         }

//         if (name.startsWith('!') || name.startsWith('^')) {
//             name = name.substring(1);
//             priority = Priority.FIRST;
//         } else if (name.startsWith('-')) {
//             name = name.substring(1);
//             priority = Priority.EARLY;
//         } else if (name.startsWith('+')) {
//             name = name.substring(1);
//             priority = Priority.LATE;
//         } else if (name.startsWith('$')) {
//             name = name.substring(1);
//             priority = Priority.LAST;
//         }

//         if (!(name in this.ACTIONS)) {
//             this.ACTIONS[name] = { fns: [], afterFns: [] };
//         }

//         const data = this.ACTIONS[name];

//         const a = { fn, priority };

//         data.fns.unshift(a); // should go before others with same priority
//         data.fns.sort((a, b) => a.priority - b.priority);

//         if (afterFn) {
//             data.afterFns.push(afterFn);
//         }
//     }

//     useAfter(name: string, fn: ActionAfterFn) {
//         if (!(name in this.ACTIONS)) {
//             this.ACTIONS[name] = { fns: [], afterFns: [] };
//         }
//         const data = this.ACTIONS[name];
//         data.afterFns.push(fn);
//     }

//     trigger(action: string, req: ActionCtx, next?: ActionNext): boolean {
//         const data = this.ACTIONS[action];
//         if (data) {
//             return this._trigger(req, data.fns, data.afterFns, next);
//         }

//         return true;
//     }

//     _trigger(
//         req: ActionCtx,
//         fns: Action[],
//         afterFns: ActionAfterFn[] = [],
//         next?: ActionNext
//     ): boolean {
//         let index = -1;

//         function _next(): boolean {
//             index += 1;
//             if (index >= fns.length) {
//                 return next ? next() : true;
//             }
//             const result = fns[index].fn(req, _next);
//             return result;
//         }

//         const result = _next();

//         afterFns.forEach((fn) => fn(req));

//         return result;
//     }
// }

// export function chain(...fns: ActionFn[]): ActionFn {
//     return function (req: ActionCtx, next: ActionNext): boolean {
//         let index = -1;

//         function _next(): boolean {
//             index += 1;
//             if (index >= fns.length) {
//                 return next();
//             }
//             return fns[index](req, _next);
//         }

//         return _next();
//     };
// }

// export function each(...fns: ActionFn[]): ActionFn {
//     return function (req: ActionCtx, next: ActionNext): boolean {
//         for (let fn of fns) {
//             fn(req, GWU.TRUE);
//         }
//         return next();
//     };
// }

// export function make(opts?: ActionBase): ActionManager {

// }

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

/*

function TRUE() { return true; }

type ActionCtx = any;
type ActionNext = () => boolean | boolean;
type ActionFn = (ctx: ActionCtx, next: ActionNext) => boolean | boolean;

interface ActionObj {
  actions: Record<string, ActionFn[]>;
}

 function actionObj(ev: string, ctx: ActionCtx, obj: ActionObj, next: ActionNext=TRUE): boolean {

  const allActions = obj.actions;
  if (!(ev in allActions)) return next();
  const actions = allActions[ev];
  
  let index = -1;
   function _next() : boolean {
    ++index;
    if (index >= actions.length) return next();
    return actions[index](ctx, _next);
  }

  return _next();
}

// e.g. actionObj('test', {}, a, next);

 function actionObjs(ev: string, ctx: ActionCtx, objs: ActionObj[], next:ActionNext=TRUE): boolean {

  let index = -1;
   function _nextObj() {
    ++index;
    if (index >= objs.length) return next();
    const obj = objs[index];
    return actionObj(ev, ctx, obj, _nextObj);
  }

  return _nextObj();
}

// e.g. actionObjs('test', {}, a, b, c, next);

type ActionArg = ActionFn | { eg: string, obj: ActionObj };
type ChainList = [...ActionArg[], ActionNext] | ActionArg[];

 function actionChain(ctx: ActionCtx, ...args: ChainList) : boolean {



  return true;
}

// map move might include something like...
// e.g. actionChain({}, { ev: 'exit', obj: cell }, { ev: 'enter', obj: newCell }, next);
// enter - covers bump/collide
*/
