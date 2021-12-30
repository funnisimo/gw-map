import * as GWU from 'gw-utils';

import * as MAP from '../map';
import { Player } from '../player/player';
import * as Command from '../command';
import * as Actor from '../actor';

export interface GameOptions extends GWU.ui.UIOptions {
    ui?: GWU.ui.UI;

    makeMap: MakeMapFn;
    makePlayer: MakePlayerFn;
    startMap: StartMapFn;

    keymap: Record<string, string | Command.CommandFn>;

    mouse?: boolean;
    fov?: boolean;
}

export type MakeMapFn = (id: number) => MAP.Map;
export type MakePlayerFn = () => Player;
export type StartMapFn = (map: MAP.Map, player: Player) => void;

export class Game {
    ui: GWU.ui.UI;
    layer!: GWU.ui.Layer;
    buffer!: GWU.canvas.Buffer;
    io!: GWU.io.Handler;

    scheduler!: GWU.scheduler.Scheduler;
    player!: Player;
    map!: MAP.Map;

    _makeMap: MakeMapFn;
    _makePlayer: MakePlayerFn;
    _startMap: StartMapFn;
    result: any = undefined;

    mouse = false;
    fov = false;

    running = false;
    keymap: Record<string, string | Command.CommandFn> = {};

    constructor(opts: GameOptions) {
        this.ui = opts.ui || new GWU.ui.UI(opts);

        this._makeMap = opts.makeMap;
        this._makePlayer = opts.makePlayer;
        this._startMap = opts.startMap;

        if (opts.keymap) {
            Object.assign(this.keymap, opts.keymap);
        }

        if (opts.mouse) {
            this.mouse = true;
        }
        if (opts.fov) {
            this.fov = true;
        }
    }

    async start() {
        this.layer = new GWU.ui.Layer(this.ui);
        this.buffer = this.layer.buffer;
        this.io = this.layer.io;

        this.running = true;
        this.scheduler = new GWU.scheduler.Scheduler();

        this.player = this._makePlayer();

        this.map = this._makeMap(0);
        this._startMap(this.map, this.player);

        this.map.actors.forEach((a) => {
            this.scheduler.push(a, a.moveSpeed());
        });

        this.draw();

        while (this.running) {
            await this.animate();
            await this.runTurn();
        }

        return this.result;
    }

    draw() {
        const memory = this.player.memory;
        if (this.fov && memory) {
            memory.drawInto(this.buffer, { fov: this.player.fov });
            this.buffer.render();
            return;
        }

        if (this.map && this.map.needsRedraw) {
            this.map.drawInto(this.buffer);
            this.buffer.render();
        }
    }

    finish(result?: any) {
        this.running = false;
        this.layer.finish();
        this.result = result;
    }

    async runTurn() {
        const actor = this.scheduler.pop();
        if (!actor) {
            this.finish();
            return;
        }

        let nextTime = 0;
        while (nextTime === 0) {
            if (actor === this.player) {
                nextTime = await this.playerTurn(actor);
            } else if ('act' in actor) {
                nextTime = await actor.act(this);
            } else if ('tick' in actor) {
                nextTime = await actor.tick(); // dt === 100 -- TODO
            }
            this.draw();
        }
        if (nextTime >= 0) {
            this.scheduler.push(actor, nextTime);
        }
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

    async playerTurn(player: Player): Promise<number> {
        let done = 0;

        const timer = setInterval(() => {
            const tick = GWU.io.makeTickEvent(16);
            // console.log('-tick', Date.now());
            this.layer.io.enqueue(tick);
        }, 16);

        let elapsed = 0;
        while (!done && this.running) {
            const ev = await this.layer.io.nextEvent(-1);

            if (ev) {
                if (ev.type === GWU.io.KEYPRESS) {
                    this.map.clearPath();
                    if (this.player.hasGoal()) {
                        this.player.clearGoal();
                    } else {
                        const handler = GWU.io.handlerFor(ev, this.keymap);
                        if (handler) {
                            if (typeof handler === 'string') {
                                const action = Command.getCommand(handler);
                                if (action) {
                                    done = await action.call(this, player, ev);
                                }
                            } else if (typeof handler === 'function') {
                                done = await handler.call(this, player, ev);
                            }
                        }
                    }
                } else if (ev.type === GWU.io.TICK) {
                    this.layer.tick(ev); // timeouts
                    elapsed += ev.dt || 16;
                    // console.log('-- event', elapsed);
                } else if (this.mouse && ev.type === GWU.io.MOUSEMOVE) {
                    if (!this.player.hasGoal()) {
                        // console.log('mouse', ev.x, ev.y);
                        const mapToPlayer = this.player.mapToMe();
                        const path = GWU.path.getPath(
                            mapToPlayer,
                            ev.x,
                            ev.y,
                            GWU.FALSE
                        );
                        if (path) {
                            this.map.highlightPath(path, true);
                        } else {
                            this.map.clearPath();
                        }
                        this.draw();
                    }
                } else if (this.mouse && ev.type === GWU.io.CLICK) {
                    console.log('click', ev.x, ev.y);
                    if (this.player.hasGoal()) {
                        this.player.clearGoal();
                    } else {
                        this.player.setGoal(ev.x, ev.y);
                    }
                }
            }

            if (elapsed < 50) {
                continue;
            }
            elapsed -= 50;

            if (this.player.hasGoal()) {
                const goalMap = this.player.goalMap!;
                const step = GWU.path.nextStep(
                    goalMap,
                    this.player.x,
                    this.player.y,
                    (x, y) =>
                        this.map.hasActor(x, y) &&
                        this.map.actorAt(x, y) !== this.player
                );
                if (!step) {
                    this.player.clearGoal();
                } else {
                    const action = Actor.getAction('moveDir');
                    if (!action)
                        throw new Error('Failed to find moveDir action.');

                    done = await action(this, this.player, { dir: step });

                    if (done) {
                        const mapToPlayer = this.player.mapToMe();
                        const path = GWU.path.getPath(
                            mapToPlayer,
                            goalMap.x!,
                            goalMap.y!,
                            GWU.FALSE
                        );
                        if (path && path.length) {
                            // path.shift(); //remove player location
                            this.map.highlightPath(path, true);
                        } else {
                            this.map.clearPath();
                        }
                    }
                }
            }
        }

        clearInterval(timer);

        return done;
    }
}
