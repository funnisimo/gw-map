import * as GWU from 'gw-utils';
import { Actor } from '../actor/actor';
import { Cell } from '../map/cell';
import { Item } from '../item/item';
import * as Flags from '../flags';

export function messageYou(
    this: GWU.text.HelperObj,
    name: string,
    view: GWU.text.View,
    args: string[]
): string {
    const field = args[0] || 'actor';
    const actor: Actor | undefined = this.get(view, field);
    if (actor && actor instanceof Actor) {
        if (actor.isPlayer()) {
            return 'you';
        } else {
            return 'the ' + actor.getName();
        }
    }

    return actor || name;
}

GWU.text.addHelper('you', messageYou);

export function messageThe(
    this: GWU.text.HelperObj,
    name: string,
    view: GWU.text.View,
    args: string[]
): string {
    const value = args[0]
        ? this.get(view, args[0])
        : view.item || view.cell || view.target || view.actor;

    if (value) {
        if (value instanceof Cell) {
            return value.getFlavor();
        } else if (value instanceof Actor) {
            if (value.isPlayer()) {
                return 'you';
            } else {
                return 'the ' + value.getName();
            }
        } else if (value instanceof Item) {
            return 'the ' + value.getName();
        }
    }

    return name;
}

GWU.text.addHelper('the', messageThe);

export function messageA(
    this: GWU.text.HelperObj,
    name: string,
    view: GWU.text.View,
    args: string[]
): string {
    const value = args[0]
        ? this.get(view, args[0])
        : view.item || view.cell || view.target || view.actor;

    if (value) {
        if (value instanceof Cell) {
            return value.getFlavor();
        } else if (value instanceof Actor) {
            if (value.isPlayer()) {
                return 'you';
            } else if (value.hasEntityFlag(Flags.Entity.L_FORMAL_NAME)) {
                return value.getName();
            }
        }
        if ('getName' in value) {
            const name = value.getName();
            const char = GWU.text.firstChar(name);
            const ana = /[aeiouy]/i.exec(char) ? 'an ' : 'a ';

            return ana + name;
        }
    }

    return name;
}

GWU.text.addHelper('a', messageA);
GWU.text.addHelper('an', messageA);

export function messageVerb(
    this: GWU.text.HelperObj,
    _name: string,
    view: GWU.text.View,
    args: string[]
): string {
    const verb = args[0] || 'verb';
    const value = args[1]
        ? this.get(view, args[1])
        : view.actor || view.target || view.item || view.cell;

    let plural = false;

    if (value) {
        if (value instanceof Cell) {
            plural = false;
        } else if (value instanceof Actor) {
            plural = value.isPlural();
        } else if (value instanceof Item) {
            plural = value.isPlural();
        }
    }

    return plural ? GWU.text.toPluralVerb(verb) : GWU.text.toSingularVerb(verb);
}

GWU.text.addHelper('verb', messageVerb);
