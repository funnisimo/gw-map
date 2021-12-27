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

export function installCommand(name: string, fn: CommandFn) {
    actions[name] = fn;
}

export function getCommand(name: string): CommandFn | undefined {
    return actions[name];
}
