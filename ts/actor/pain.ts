import * as GWU from 'gw-utils';

export class PainMessages {
    _msgs: string[] = [];
    constructor(msgs: string[] = []) {
        msgs.forEach((m) => this.add(m));
    }

    add(msg: string): this {
        this._msgs.push(msg);
        return this;
    }

    get(pct: number, singular = true): string {
        const index = GWU.clamp(
            Math.floor(pct * this._msgs.length),
            0,
            this._msgs.length - 1
        );
        const msg = this._msgs[index];
        return this._format(msg, singular);
    }

    _format(msg: string, singular = true): string {
        return msg.replace(/\[(\w+)\|?(\w*)\]/g, singular ? '$1' : '$2');
    }
}

export const painMessages: Record<string, PainMessages> = {};

export function installPain(id: string, pain: PainMessages | string[]) {
    if (Array.isArray(pain)) {
        pain = new PainMessages(pain);
    }
    painMessages[id] = pain;
}

export function getPain(id: string): PainMessages {
    const m = painMessages[id];
    if (!m) throw new Error('No such pain message index: ' + id);
    return m;
}
