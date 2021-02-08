import * as GW from 'gw-utils';
import * as Map from './map';
import * as Tile from './tile';
export declare function makeTileEffect(config: any): GW.effect.EffectFn | null;
export interface TileEffectConfig {
    id: string;
    spread: number;
    decrement: number;
    matchTile?: string | null;
    volume: number;
}
export declare function tileEffect(this: TileEffectConfig, effect: GW.effect.Effect, x: number, y: number): Promise<boolean>;
export declare function fireAll(map: Map.Map, event: string): Promise<void>;
export declare function spawnTiles(flags: GW.effect.Flags, spawnMap: GW.grid.NumGrid, map: Map.Map, tile: Tile.Tile, volume?: number): boolean;
export declare function computeSpawnMap(config: TileEffectConfig, effect: GW.effect.Effect, x: number, y: number): boolean;
export declare function clearCells(map: Map.Map, spawnMap: GW.grid.NumGrid): boolean;
export declare function evacuateCreatures(map: Map.Map, blockingMap: GW.grid.NumGrid): boolean;
export declare function evacuateItems(map: Map.Map, blockingMap: GW.grid.NumGrid): boolean;
