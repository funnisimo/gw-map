import * as GWU from 'gw-utils';
import { Actor } from '../actor';
import { Game } from '../game';

// Returns the time used by this action
export type CommandFn = (
    this: Game,
    actor: Actor,
    ev: GWU.io.Event
) => Promise<number>;

export type CommandBase = boolean | CommandFn;

export const actions: Record<string, CommandFn> = {};

export function install(name: string, fn: CommandFn) {
    actions[name] = fn;
}

export function get(name: string): CommandFn | undefined {
    return actions[name];
}
