import * as ACTION from '../action';
// import * as ACTOR from '../actor';

// BUMP
//
// prefixes:
// @ : only for player
// + : only for ally
// - : only for opposed
// = : only for same kind
// $ : use my action (if used with one of the above, this comes last)
//
export function bump(action: ACTION.Action): void {
    const other = action.target;
    const actor = action.actor;
    if (!actor) throw new Error('Actor is required for bump.');

    if (other) {
        const bumpActions = other.getBumpActions();

        for (let actionName of bumpActions) {
            if (typeof actionName === 'string') {
                if (actionName.startsWith('@')) {
                    if (!actor.isPlayer()) continue;
                    actionName = actionName.substring(1);
                    // } else if (actionName.startsWith('+')) {
                    //     if (!actor.isAllyWith(other)) continue;
                    //     actionName = actionName.substring(1);
                    // } else if (actionName.startsWith('-')) {
                    //     if (actor.isAllyWith(other)) continue;
                    //     actionName = actionName.substring(1);
                } else if (actionName.startsWith('=')) {
                    if (actor.kind !== other.kind) continue;
                    actionName = actionName.substring(1);
                }

                if (actionName.startsWith('$')) {
                    const selfName = actionName.substring(1);
                    if (!other.canDoAction(selfName))
                        throw new Error('Invalid bump choice - ' + actionName);
                    other.trigger(selfName, action);
                    if (action.isDone()) return;

                    // let selfAction: ACTOR.ActorActionResult =
                    //     other.getAction(selfName);
                    // if (selfAction === false) {
                    //     throw new Error(
                    //         'Cannot have bump action for self action that actor cannot do: ' +
                    //             action
                    //     );
                    // }
                    // const ctx2 = Object.assign({}, ctx, { actor });
                    // const result = selfAction(game, other, ctx2);
                    // if (result) return result;
                } else {
                    ACTION.doAction(actionName, action);
                    if (action.isDone()) return;
                    // const config = actor.getAction(actionName);
                    // if (config === false) {
                    //     throw new Error(
                    //         'Cannot configure actor with bump action they cannot do: ' +
                    //             action
                    //     );
                    // } else {
                    //     action = config;
                    // }
                    // const result = action(game, actor, ctx);
                    // if (result) return result;
                }
            } else {
                actionName(action);
                if (action.isDone()) return;
            }
        }
    }

    const item = action.item;
    if (item) {
        // TODO - Item Actions
    }
}

ACTION.install('bump', bump);
