import * as GWU from 'gw-utils';
import { Actor } from '../actor/actor';
import { Cell } from '../map/cell';
import { Item } from '../item/item';

export function messageYou(name: string, args: any): string {
    const actor: Actor | undefined = args.actor;
    if (actor) {
        if (actor.isPlayer()) {
            return 'you';
        } else {
            return 'the ' + actor.getName();
        }
    }

    return name;
}

GWU.text.addHelper('you', messageYou);

export function messageThe(name: string, args: any, value?: any): string {
    value = value || args.item || args.cell || args.actor;
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

export function messageA(name: string, args: any, value?: any): string {
    value = value || args.item || args.cell || args.actor;
    if (value) {
        if (value instanceof Cell) {
            return value.getFlavor();
        } else if (value instanceof Actor) {
            if (value.isPlayer()) {
                return 'you';
            } else {
                return 'a ' + value.getName();
            }
        } else if (value instanceof Item) {
            return 'a ' + value.getName();
        }
    }

    return name;
}

GWU.text.addHelper('a', messageA);
GWU.text.addHelper('an', messageA);
