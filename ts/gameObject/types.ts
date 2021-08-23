import * as GWU from 'gw-utils';

export interface ObjectFlags {
    object: number;
}

export interface ObjectType
    extends GWU.utils.Chainable<ObjectType>,
        GWU.utils.XY {
    sprite: GWU.sprite.Sprite;
    depth: number;
    light: GWU.light.LightType | null;
    flags: ObjectFlags;
}
