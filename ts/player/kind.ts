import * as Actor from '../actor';
import * as Skills from './skill';
import * as Attributes from './attribute';
import { Player } from './player';
import * as Flags from '../flags';

export interface KindOptions extends Actor.KindOptions {
    attributes?: Record<string, number>;
    skills?: Record<string, number | boolean>;
    stats?: Record<string, number>;
}

export class PlayerKind extends Actor.ActorKind {
    attributes: Attributes.Attributes;
    skills: Skills.Skills;

    constructor(opts: Partial<KindOptions> = {}) {
        super(
            (() => {
                if (!opts.sprite) {
                    opts.ch = opts.ch || Player.default.ch;
                    opts.fg = opts.fg || Player.default.fg;
                }
                if (!opts.name) {
                    opts.name = Player.default.name;
                }
                return opts as KindOptions;
            })()
        );
        this.flags.actor |= Flags.Actor.IS_PLAYER;
        this.attributes = new Attributes.Attributes(opts.attributes || {});
        this.skills = new Skills.Skills(opts.skills || {});
    }

    make(options?: Actor.MakeOptions): Player {
        const actor = new Player(this);
        this.init(actor, options);
        return actor;
    }
}
