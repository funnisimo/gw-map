import * as GWU from 'gw-utils';

import { installHandler } from '../effect';
import * as ACTION from '../action';

//////////////////////////////////////////////
// MESSAGE

export function msg(src: any): ACTION.ActionFn {
    if (Array.isArray(src)) src = src[0];
    if (typeof src !== 'string') {
        throw new Error('Need message for message effect.');
    }

    const info = {
        msg: src,
    };

    return messageAction.bind(undefined, info);
}

export function messageAction(
    info: { msg: string },
    action: ACTION.Action
): void {
    const seen = action.seen;
    const msg = info.msg;

    if (
        msg &&
        msg.length &&
        action.aware &&
        !seen
        // && map.isVisible(x, y)
    ) {
        GWU.message.addAt(action.x, action.y, msg, action);
        return action.didSomething();
    }
    return action.didNothing();
}

installHandler('msg', msg);
