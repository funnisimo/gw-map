import * as GWU from 'gw-utils';
import { Actor } from '../actor';
import { Game } from '../game';

export type ActionFn = (
    this: Game,
    actor: Actor,
    ev: GWU.io.Event
) => Promise<boolean>;

export type ActionBase = boolean | ActionFn;

export const actions: Record<string, ActionFn> = {};

export function install(name: string, fn: ActionFn) {
    actions[name] = fn;
}

export function get(name: string): ActionFn | undefined {
    return actions[name];
}
