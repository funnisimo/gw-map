import * as GWU from 'gw-utils';
import * as ObjectTypes from '../entity/types';
import { EffectInfo } from '../effect/types';

export interface TileFlags extends ObjectTypes.FlagType {
    tile: number;
    tileMech: number;
}

export interface NameConfig {
    article?: boolean | string;
    color?: boolean | string | GWU.color.ColorBase;
}

export interface TileType {
    readonly id: string;
    readonly index: number;
    readonly flags: TileFlags;

    readonly dissipate: number;
    readonly effects: Record<string, string | EffectInfo>;
    readonly groundTile: string | null;

    hasEntityFlag(flag: number): boolean;
    hasTileFlag(flag: number): boolean;
    hasTileMechFlag(flag: number): boolean;

    hasAllEntityFlags(flag: number): boolean;
    hasAllTileFlags(flag: number): boolean;
    hasAllTileMechFlags(flag: number): boolean;

    hasEffect(name: string): boolean;

    getName(): string;
    getName(config: NameConfig): string;
    getName(article: string): string;
    getName(article: boolean): string;

    getDescription(): string;
    getFlavor(): string;
}
