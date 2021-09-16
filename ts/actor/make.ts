import * as GWU from 'gw-utils';
import { ActorKind, KindOptions } from './kind';
import { Actor } from './actor';

export function make(id: string | ActorKind, makeOptions?: any): Actor {
    const kind = get(id);
    if (!kind) throw new Error('Failed to find item kind - ' + id);
    return kind.make(makeOptions);
}

export function makeRandom(
    opts: Partial<MatchOptions> | string,
    makeOptions?: any
): Actor {
    const kind = randomKind(opts);
    if (!kind)
        throw new Error(
            'Failed to find item kind matching - ' + JSON.stringify(opts)
        );
    return kind.make(makeOptions);
}

export function from(
    info: string | ActorKind | KindOptions,
    makeOptions?: any
): Actor {
    let kind: ActorKind;
    if (typeof info === 'string') {
        // @ts-ignore
        kind = get(info);
        if (!kind) throw new Error('Failed to find item kind - ' + info);
    } else if (info instanceof ActorKind) {
        kind = info;
    } else {
        kind = makeKind(info);
    }
    return kind.make(makeOptions);
}

export const kinds: Record<string, ActorKind> = {};

export function install(id: string, kind: ActorKind | KindOptions): ActorKind {
    if (kind instanceof ActorKind) {
        kinds[id] = kind;
        return kind;
    }
    const made = makeKind(kind);
    made.id = id;
    kinds[id] = made;
    return made;
}

export function get(id: string | ActorKind): ActorKind | null {
    if (id instanceof ActorKind) return id;
    return kinds[id];
}

export function makeKind(info: KindOptions): ActorKind {
    const config: KindOptions = Object.assign({}, info);

    return new ActorKind(config);
}

export interface MatchOptions {
    tags: string | string[];
    forbidTags: string | string[];
    rng: GWU.rng.Random;
}

export function randomKind(
    opts: Partial<MatchOptions> | string = {}
): ActorKind | null {
    const match = {
        tags: [] as string[],
        forbidTags: [] as string[],
    };
    if (typeof opts === 'string') {
        opts = {
            tags: opts,
        } as Partial<MatchOptions>;
    }

    if (typeof opts.tags === 'string') {
        opts.tags
            .split(/[,|&]/)
            .map((t) => t.trim())
            .forEach((t) => {
                if (t.startsWith('!')) {
                    match.forbidTags.push(t.substring(1).trim());
                } else {
                    match.tags.push(t);
                }
            });
    } else if (Array.isArray(opts.tags)) {
        match.tags = opts.tags.slice();
    }
    if (typeof opts.forbidTags === 'string') {
        match.forbidTags = opts.forbidTags.split(/[,|&]/).map((t) => t.trim());
    } else if (Array.isArray(opts.forbidTags)) {
        match.forbidTags = opts.forbidTags.slice();
    }

    const matches = Object.values(kinds).filter((k) => {
        if (match.tags.length && !GWU.arraysIntersect(match.tags, k.tags))
            return false;
        if (match.forbidTags && GWU.arraysIntersect(match.forbidTags, k.tags))
            return false;
        return true;
    });

    const rng = opts.rng || GWU.rng.random;
    return rng.item(matches) || null;
}
