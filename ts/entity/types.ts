import * as GWU from 'gw-utils';

export interface KeyInfoType {
    x: number;
    y: number;
    disposable: boolean;

    matches(x: number, y: number): boolean;
}

export interface FlagType {
    entity: number;
}

export interface EntityType extends GWU.xy.XY {
    readonly sprite: GWU.sprite.Sprite;
    depth: number;
    light: GWU.light.LightType | null;
    flags: FlagType;
    next: EntityType | null;
}

// export interface StatusDrawer {
//     // These are here in case you want to do something on your own...
//     readonly bounds: GWU.xy.Bounds;
//     readonly buffer: GWU.canvas.DataBuffer;
//     readonly mixer: GWU.sprite.Mixer;
//     currentY: number;

//     // These are the preferred methods
//     drawTitle(
//         cell: GWU.sprite.Mixer,
//         title: string,
//         fg?: GWU.color.ColorBase
//     ): void;
//     drawTextLine(text: string, fg?: GWU.color.ColorBase): void;
//     drawProgressBar(
//         val: number,
//         max: number,
//         text: string,
//         color?: GWU.color.ColorBase,
//         bg?: GWU.color.ColorBase,
//         fg?: GWU.color.ColorBase
//     ): void;
// }
