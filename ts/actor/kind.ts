import * as Entity from '../entity';

export interface KindOptions extends Entity.KindOptions {}

export class ActorKind extends Entity.EntityKind {
    constructor(opts: KindOptions) {
        super(opts);
    }
}
