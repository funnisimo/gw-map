import * as GWU from 'gw-utils';

export interface EffectInfo {
    flags: number;
    chance: number;
    next: EffectInfo | string | null;
    id: string;

    [id: string]: any; // other config from subtypes
}

export interface EffectCtx {
    // actor?: Types.ActorType | null;
    // target?: Types.ActorType | null;
    // item?: Types.ItemType | null;
    depth?: number;
    force?: boolean;
    grid: GWU.grid.NumGrid;

    [id: string]: any; // other config from subtypes
}

export interface EffectConfig {
    flags: GWU.flag.FlagBase;
    chance: number;
    next: Partial<EffectConfig> | string | null;

    [id: string]: any; // other config from subtypes
}

export type EffectBase = Partial<EffectConfig> | Function;
