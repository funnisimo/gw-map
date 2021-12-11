import * as GWU from 'gw-utils';

import * as MAP from '../map';
import { Player } from '../player/player';
import { Actor } from '../actor/actor';
import * as Action from '../action';

export interface GameOptions extends GWU.ui.UIOptions {
    makeMap: MakeMapFn;
    makePlayer: MakePlayerFn;
    startMap: StartMapFn;

    keymap: Record<string, string | Action.ActionFn>;
}

export type MakeMapFn = (id: number) => MAP.Map;
export type MakePlayerFn = () => Player;
export type StartMapFn = (map: MAP.Map, player: Player) => void;

export class Game {
    ui: GWU.ui.UI;
    layer: GWU.ui.Layer;
    buffer: GWU.canvas.Buffer;
    io: GWU.io.Handler;

    player!: Player;
    map!: MAP.Map;

    makeMap: MakeMapFn;
    makePlayer: MakePlayerFn;
    startMap: StartMapFn;

    running = false;
    keymap: Record<string, string | Action.ActionFn> = {};

    constructor(opts: GameOptions) {
        this.ui = new GWU.ui.UI(opts);

        this.makeMap = opts.makeMap;
        this.makePlayer = opts.makePlayer;
        this.startMap = opts.startMap;

        if (opts.keymap) {
            Object.assign(this.keymap, opts.keymap);
        }

        this.layer = new GWU.ui.Layer(this.ui);
        this.buffer = this.layer.buffer;
        this.io = this.layer.io;
    }

    async start() {
        this.player = this.makePlayer();
        this.map = this.makeMap(0);
        this.startMap(this.map, this.player);

        this.running = true;

        while (this.running) {
            await this.runTurn();
        }
    }

    draw() {
        if (this.map && this.map.needsRedraw) {
            this.map.drawInto(this.buffer);
            this.buffer.render();
        }
    }

    finish() {
        this.running = false;
        this.layer.finish();
    }

    async runTurn() {
        const actors = this.map.actors.slice() as Actor[];
        for (let actor of actors) {
            this.draw();

            if (actor === this.player) {
                await this.playerTurn(this.player);
            } else {
                await actor.act();
            }

            await this.animate();
        }

        this.map.tick(50); // turn time
    }

    async animate() {
        if (!this.layer.io._tweens.length) return;

        const timer = setInterval(() => {
            const tick = GWU.io.makeTickEvent(16);
            this.layer.io.enqueue(tick);
        }, 16);

        while (this.layer.io._tweens.length) {
            const ev = await this.layer.io.nextTick();
            if (ev && ev.dt) {
                this.layer.io._tweens.forEach((a) => a && a.tick(ev.dt));
                this.layer.io._tweens = this.layer.io._tweens.filter(
                    (a) => a && a.isRunning()
                );
            }

            this.draw();
        }

        clearInterval(timer);
    }

    async playerTurn(player: Player) {
        let done = false;

        const timer = setInterval(() => {
            const tick = GWU.io.makeTickEvent(16);
            this.layer.io.enqueue(tick);
        }, 16);

        while (!done) {
            const ev = await this.layer.io.nextEvent(-1);

            if (ev) {
                if (ev.type === GWU.io.KEYPRESS) {
                    const handler = GWU.io.handlerFor(ev, this.keymap);
                    if (handler) {
                        if (typeof handler === 'string') {
                            const action = Action.get(handler);
                            if (action) {
                                await action.call(this, player, ev);
                                done = true;
                            }
                        } else if (typeof handler === 'function') {
                            await handler.call(this, player, ev);
                            done = true;
                        }
                    }
                } else if (ev.type === GWU.io.TICK) {
                    this.layer.tick(ev); // timeouts
                }
            }
        }

        clearInterval(timer);
    }
}
