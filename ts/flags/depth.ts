export enum Depth {
    ALL_LAYERS = -1,
    GROUND = 0,
    SURFACE,
    ITEM,
    ACTOR,
    LIQUID,
    GAS,
    FX,
    UI,
}

export type DepthString = keyof typeof Depth;
