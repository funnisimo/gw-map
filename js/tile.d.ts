import { color as Color, canvas as Canvas, types as Types } from "gw-utils";
import { Tile as Flags, TileMech as MechFlags, Layer } from "./flags";
import * as TileEvent from "./tileEvent";
import * as Light from "./light";
export { Flags, MechFlags, Layer };
export interface NameConfig {
    article?: boolean | string;
    color?: boolean | string | Color.ColorBase;
}
export declare type TileBase = TileConfig | string;
export interface FullTileConfig {
    Extends: string | Tile;
    flags: number | string | any[];
    mechFlags: number | string | any[];
    layer: Layer | keyof typeof Layer;
    priority: number;
    activates: any;
    light: Light.LightBase | null;
    flavor: string;
    desc: string;
    name: string;
    article: string;
    id: string;
    ch: string | null;
    fg: Color.ColorBase | null;
    bg: Color.ColorBase | null;
    opacity: number;
    dissipate: number;
}
declare type AtLeast<T, K extends keyof T> = Partial<T> & Pick<T, K>;
export declare type TileConfig = AtLeast<FullTileConfig, "id">;
/** Tile Class */
export declare class Tile implements Types.TileType {
    name: string;
    flags: number;
    mechFlags: number;
    layer: Layer;
    priority: number;
    sprite: Canvas.Sprite;
    activates: Record<string, TileEvent.TileEvent>;
    light: Light.Light | null;
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
    constructor(config: TileConfig, base?: Tile);
    /**
     * Returns the flags for the tile after the given event is fired.
     * @param {string} id - Name of the event to fire.
     * @returns {number} The flags from the Tile after the event.
     */
    successorFlags(id: string): number;
    /**
     * Returns whether or not this tile as the given flag.
     * Will return true if any bit in the flag is true, so testing with
     * multiple flags will return true if any of them is set.
     * @param {number} flag - The flag to check
     * @returns {boolean} Whether or not the flag is set
     */
    hasFlag(flag: number): boolean;
    hasMechFlag(flag: number): boolean;
    hasFlags(flags: number, mechFlags: number): number | true;
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
export declare function install(config: Partial<TileConfig>): Tile;
/**
 * Adds multiple tiles to the GW.tiles collection.
 * It extracts all the id:opts pairs from the config object and uses
 * them to call addTileKind.
 * @param {Object} config - The tiles to add in [id, config] pairs
 * @returns {void} Nothing
 * @see addTileKind
 */
export declare function installAll(config: Record<string, Partial<TileConfig>>): void;
