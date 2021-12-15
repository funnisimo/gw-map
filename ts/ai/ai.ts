import { Actor } from '../actor/actor';
import { Game } from '../game/game';

// AI functions
// called as this===Game
// actor is current actor
// returns time until next turn for this actor
// < 0 means do not requeue
export type ActorAiFn = (game: Game, actor: Actor) => Promise<number>;

export const ais: Record<string, ActorAiFn> = {};

export function install(name: string, fn: ActorAiFn) {
    ais[name] = fn;
}
