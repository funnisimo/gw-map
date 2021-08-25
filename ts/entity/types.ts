import * as GWU from 'gw-utils';

export interface FlagType {
    entity: number;
}

export interface EntityType
    extends GWU.utils.Chainable<EntityType>,
        GWU.utils.XY {
    sprite: GWU.sprite.Sprite;
    depth: number;
    light: GWU.light.LightType | null;
    flags: FlagType;
}
