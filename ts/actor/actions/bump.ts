import { Actor } from '..';
// import * as Item from '../../item';
import { Game } from '../../game';
import { ActorActionCtx, installAction } from '../action';

// BUMP
//
// prefixes:
// @ = only for player
// + = only for ally
// - = only for opposed
// = = only for same kind
// $ = use my action (if used with one of the above, this comes last)
//
export async function bump(
    game: Game,
    actor: Actor,
    ctx: ActorActionCtx = {}
): Promise<number> {
    const other = ctx.actor;
    if (other) {
        const bumpActions = other.getBumpActions();

        for (let action of bumpActions) {
            if (typeof action === 'string') {
                if (action.startsWith('$')) {
                    const selfName = action.substring(1);
                    let selfAction = other.getAction(selfName);
                    if (selfAction === false) {
                        throw new Error(
                            'Cannot have bump action for self action that actor cannot do: ' +
                                action
                        );
                    }

                    const ctx2 = Object.assign({}, ctx, { actor });
                    const result = await selfAction(game, other, ctx2);
                    if (result) return result;
                } else {
                    const config = actor.getAction(action);
                    if (config === false) {
                        throw new Error(
                            'Cannot configure actor with bump action they cannot do: ' +
                                action
                        );
                    } else {
                        action = config;
                    }
                    const result = await action(game, actor, ctx);
                    if (result) return result;
                }
            } else {
                const result = await action(game, actor, ctx);
                if (result) return result;
            }
        }
    }

    const item = ctx.item;
    if (item) {
        // TODO - Item Actions
    }

    return 0;
}

installAction('bump', bump);
