import * as GWU from 'gw-utils';

import { ObjectFlags, ObjectType } from './types';
import * as Flags from './flags';

export class GameObject implements ObjectType {
    sprite: GWU.sprite.Sprite;
    depth: number;
    light: GWU.light.LightType | null;
    flags: ObjectFlags;
    next: GameObject | null;
    x: number;
    y: number;

    constructor() {
        this.sprite = new GWU.sprite.Sprite();
        this.depth = 1; // default - TODO - enum/const
        this.light = null;
        this.flags = { object: 0 };
        this.next = null;
        this.x = -1;
        this.y = -1;
    }

    hasObjectFlag(flag: number) {
        return !!(this.flags.object & flag);
    }
    hasAllObjectFlags(flags: number) {
        return (this.flags.object & flags) === flags;
    }

    blocksMove(): boolean {
        return this.hasObjectFlag(Flags.GameObject.L_BLOCKS_MOVE);
    }
    blocksVision(): boolean {
        return this.hasObjectFlag(Flags.GameObject.L_BLOCKS_VISION);
    }
    blocksPathing(): boolean {
        return this.hasObjectFlag(Flags.GameObject.L_BLOCKS_MOVE);
    }
    blocksEffects(): boolean {
        return this.hasObjectFlag(Flags.GameObject.L_BLOCKS_EFFECTS);
    }

    itemFlags(): number {
        return 0;
    }
    actorFlags(): number {
        return 0;
    }
}
