import { color as Color, types as Types } from "gw-utils";
import { Tile as Flags, TileMech as MechFlags } from "./flags";
import * as TileEvent from "./tileEvent";
import * as Layer from "./layer";
export { Flags, MechFlags };
export interface NameConfig {
    article?: boolean | string;
    color?: boolean | string | Color.ColorBase;
}
export declare type TileBase = TileConfig | string;
export interface FullTileConfig extends Layer.LayerConfig {
    Extends: string | Tile;
    flags: number | string | any[];
    mechFlags: number | string | any[];
    priority: number;
    activates: any;
    flavor: string;
    desc: string;
    name: string;
    article: string;
    id: string;
    dissipate: number;
}
declare type AtLeast<T, K extends keyof T> = Partial<T> & Pick<T, K>;
export declare type TileConfig = AtLeast<FullTileConfig, "id">;
/** Tile Class */
export declare class Tile extends Layer.Layer implements Types.TileType {
    name: string;
    flags: Types.TileFlags;
    activates: Record<string, TileEvent.TileEvent>;
    flavor: string | null;
    desc: string | null;
    article: string | null;
    id: string;
    dissipate: number;
    /**
     * Creates a new Tile object.
     * @param {Object} [config={}] - The configuration of the Tile
     * @param {String|Number|String[]} [config.flags=0] - Flags and MechFlags for the tile
     * @param {String} [config.layer=GROUND] - Name of the layer for this tile
     * @param {String} [config.ch] - The sprite character
     * @param {String} [config.fg] - The sprite foreground color
     * @param {String} [config.bg] - The sprite background color
     */
    constructor(config: TileConfig);
    /**
     * Returns whether or not this tile as the given flag.
     * Will return true if any bit in the flag is true, so testing with
     * multiple flags will return true if any of them is set.
     * @param {number} flag - The flag to check
     * @returns {boolean} Whether or not the flag is set
     */
    hasAllFlags(flag: number): boolean;
    hasAllLayerFlags(flag: number): boolean;
    hasAllMechFlags(flag: number): boolean;
    blocksPathing(): number;
    activatesOn(name: string): boolean;
    getName(): string;
    getName(opts: NameConfig): string;
    getName(article: string): string;
    getName(article: boolean): string;
    getDescription(opts?: any): string;
}
export declare function make(config: TileConfig): Tile;
export declare const tiles: Record<string, Tile>;
/**
 * Adds a new Tile into the GW.tiles collection.
 * @param {String} [id] - The identifier for this Tile
 * @param {Tile|string} [base] - The base tile from which to extend (id or object)
 * @param {Object} config - The tile configuration
 * @returns {Tile} The newly created tile
 */
export declare function install(id: string, base: string | Tile, config: Partial<TileConfig>): Tile;
export declare function install(id: string, config: Partial<TileConfig>): Tile;
export declare function install(config: TileConfig): Tile;
/**
 * Adds multiple tiles to the GW.tiles collection.
 * It extracts all the id:opts pairs from the config object and uses
 * them to call addTileKind.
 * @param {Object} config - The tiles to add in [id, config] pairs
 * @returns {void} Nothing
 * @see addTileKind
 */
export declare function installAll(config: Record<string, Partial<TileConfig>>): void;
