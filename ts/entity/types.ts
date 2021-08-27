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

export interface EntityType extends GWU.utils.XY {
    readonly sprite: GWU.sprite.Sprite;
    depth: number;
    light: GWU.light.LightType | null;
    flags: FlagType;
    next: EntityType | null;
}
