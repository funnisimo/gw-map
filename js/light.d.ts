import { utils as Utils, range as Range, grid as Grid, color as Color, types as Types } from "gw-utils";
import { Map } from "./map";
export declare const config: {
    INTENSITY_DARK: number;
};
export declare class Light implements Types.LightType {
    color: Color.Color;
    radius: Range.Range;
    fadeTo: number;
    passThroughActors: boolean;
    id: string | null;
    constructor(color: Color.ColorBase, range: string | Range.Range, fadeTo: number, pass?: boolean);
    copy(other: Light): void;
    get intensity(): number;
    paint(map: Map, x: number, y: number, maintainShadows?: boolean, isMinersLight?: boolean): false | undefined;
}
export declare function intensity(color: Color.Color | [number, number, number]): number;
export interface LightConfig {
    color: Color.ColorBase;
    radius: number;
    fadeTo?: number;
    pass?: boolean;
}
export declare type LightBase = LightConfig | string | any[];
export declare function make(color: Color.ColorBase, radius: Range.RangeBase, fadeTo?: number, pass?: boolean): Light;
export declare function make(light: LightBase): Light;
export declare const lights: Record<string, Light>;
export declare function from(light: LightBase): Light;
export declare function install(id: string, color: Color.ColorBase, radius: Range.RangeBase, fadeTo?: number, pass?: boolean): Light;
export declare function install(id: string, config: LightConfig): Light;
export declare function installAll(config?: Record<string, LightConfig>): void;
export declare type LightData = [number, number, number];
export declare type LightDataGrid = Grid.Grid<LightData>;
export declare function backUpLighting(map: Map, lights: LightDataGrid): void;
export declare function restoreLighting(map: Map, lights: LightDataGrid): void;
export declare function recordOldLights(map: Map): void;
export declare function zeroOutLights(map: Map): void;
export declare function recordGlowLights(map: Map): void;
export declare function restoreGlowLights(map: Map): void;
export declare function updateLighting(map: Map): boolean;
export declare function playerInDarkness(map: Map, PLAYER: Utils.XY, darkColor: Color.Color): boolean;
