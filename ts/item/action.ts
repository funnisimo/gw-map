import { Item } from './item';
import { Actor } from '../actor/actor';
import { Game } from '../game';

export type ItemActionFn = (
    game: Game,
    actor: Actor,
    item: Item
) => Promise<number>;
export type ItemActionBase = boolean | ItemActionFn;

export const actions: Record<string, ItemActionFn> = {};

export function installAction(name: string, fn: ItemActionFn) {
    actions[name] = fn;
}

export function getAction(name: string): ItemActionFn | null {
    return actions[name] || null;
}
