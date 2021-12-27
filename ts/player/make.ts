import { PlayerKind, KindOptions } from './kind';
import { Player } from './player';

import * as Actor from '../actor';

export function make(
    id: string | PlayerKind | KindOptions,
    makeOptions?: any
): Player {
    let kind: PlayerKind;
    if (typeof id === 'string') {
        // @ts-ignore
        kind = Actor.get(id);
        if (!kind) throw new Error('Failed to find item kind - ' + id);
        if (!(kind instanceof PlayerKind))
            throw new Error('Not a player kind.');
    } else if (id instanceof PlayerKind) {
        kind = id;
    } else {
        kind = makeKind(id);
    }
    return kind.make(makeOptions);
}

export function install(
    id: string,
    kind: PlayerKind | KindOptions
): PlayerKind {
    if (kind instanceof PlayerKind) {
        Actor.kinds[id] = kind;
        return kind;
    }
    const made = makeKind(kind);
    made.id = id;
    Actor.kinds[id] = made;
    return made;
}

export function get(id: string | PlayerKind): PlayerKind | null {
    if (id instanceof PlayerKind) return id;
    const k = Actor.kinds[id];
    if (k && !(k instanceof PlayerKind)) {
        throw new Error('No a player kind.');
    }
    return k;
}

export function makeKind(info: KindOptions): PlayerKind {
    const config: KindOptions = Object.assign({}, info);
    return new PlayerKind(config);
}
