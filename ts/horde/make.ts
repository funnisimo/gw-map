import * as GWU from 'gw-utils';
import { Horde, HordeConfig } from './horde';
import { Horde as Flags } from '../flags/horde';

export const hordes: Record<string, Horde> = {};

export function install(
    id: string,
    horde: string | Horde | HordeConfig
): Horde {
    if (typeof horde === 'string') {
        horde = { leader: horde };
    }
    if (!(horde instanceof Horde)) {
        horde = new Horde(horde);
    }

    hordes[id] = horde;
    return horde;
}

export function installAll(
    hordes: Record<string, string | Horde | HordeConfig>
) {
    Object.entries(hordes).forEach(([id, config]) => {
        install(id, config);
    });
}

export function from(id: string | Horde | HordeConfig): Horde {
    if (id instanceof Horde) {
        return id;
    }
    if (typeof id === 'string') {
        return hordes[id];
    }
    return new Horde(id);
}

export interface MatchOptions {
    tags: string | string[];
    forbidTags: string | string[];
    flags: GWU.flag.FlagBase;
    forbidFlags: GWU.flag.FlagBase;
    depth: number;
    oodChance: number;
    rng: GWU.rng.Random;
}

export function random(
    opts: Partial<MatchOptions> | string = {}
): Horde | null {
    const match = {
        tags: [] as string[],
        forbidTags: [] as string[],
        flags: 0,
        forbidFlags: 0,
        depth: 0,
    };

    if (typeof opts === 'string') {
        opts = {
            tags: opts,
        } as Partial<MatchOptions>;
    }

    const rng = opts.rng || GWU.rng.random;

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

    if (opts.flags) {
        if (typeof opts.flags === 'string') {
            opts.flags
                .split(/[,|]/)
                .map((t) => t.trim())
                .forEach((flag) => {
                    if (flag.startsWith('!')) {
                        const key = flag.substring(1) as keyof typeof Flags;
                        match.forbidFlags |= Flags[key];
                    } else {
                        match.flags |= Flags[flag as keyof typeof Flags];
                    }
                });
        }
    }
    if (opts.forbidFlags) {
        match.forbidFlags = GWU.flag.from(Flags, opts.forbidFlags);
    }

    if (opts.depth) {
        match.depth = opts.depth;
    }
    if (match.depth && opts.oodChance) {
        while (rng.chance(opts.oodChance)) {
            match.depth += 1;
        }
        match.forbidFlags |= Flags.HORDE_NEVER_OOD;
    }

    const matches = Object.values(hordes).filter((k) => {
        if (match.tags.length && !GWU.arraysIntersect(match.tags, k.tags))
            return false;
        if (match.forbidTags && GWU.arraysIntersect(match.forbidTags, k.tags))
            return false;
        if (match.flags && !(k.flags.horde & match.flags)) {
            return false;
        }
        if (match.forbidFlags && k.flags.horde & match.forbidFlags) {
            return false;
        }
        return true;
    });

    if (match.depth) {
        return rng.item(matches) || null;
    }

    const depth = match.depth;
    const weights = matches.map((h) => h.frequency(depth));
    const index = rng.weighted(weights);
    if (index < 0) return null;
    return matches[index];
}
