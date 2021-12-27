import * as GWU from 'gw-utils';
import { Game } from '../game';
import { Item } from '../item';
import { Actor } from './actor';

export interface ActorActionCtx {
    actor?: Actor | null;
    item?: Item | null;
    dir?: GWU.xy.Loc | null;
    loc?: GWU.xy.Loc | null;

    try?: boolean;
    quiet?: boolean;
}

export type ActorActionFn = (
    game: Game,
    actor: Actor,
    ctx?: ActorActionCtx
) => Promise<number>;

export type ActorActionBase = boolean | ActorActionFn;
export type ActorActionResult = false | ActorActionFn;

export const installedActions: Record<string, ActorActionFn> = {};

export function installAction(name: string, fn: ActorActionFn) {
    installedActions[name.toLowerCase()] = fn;
}

export function getAction(name: string): ActorActionFn | null {
    return installedActions[name.toLowerCase()] || null;
}
