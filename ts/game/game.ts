import * as GWU from 'gw-utils';

import * as MAP from '../map';
import { Player } from '../player/player';
import * as Command from '../command';
import * as Actor from '../actor';
import * as Viewport from './viewport';
import * as Message from './message';

export interface GameOptions extends GWU.ui.UIOptions {
    ui?: GWU.ui.UI;

    makeMap: MakeMapFn;
    makePlayer: MakePlayerFn;
    startMap: StartMapFn;

    keymap: Record<string, string | Command.CommandFn>;

    mouse?: boolean;

    viewport?: Viewport.ViewportOptions;
    messages?: number | Message.MessageOptions;
    // fov?: boolean;
    // scent?: boolean; // draw scent
}

export interface GameInit extends GameOptions {
    viewport: Partial<Viewport.ViewportInit>;
    messages: Partial<Message.MessageInit>;
}

export type MakeMapFn = (id: number) => MAP.Map;
export type MakePlayerFn = () => Player;
export type StartMapFn = (map: MAP.Map, player: Player) => void;

export class Game {
    ui: GWU.ui.UI;
    layer!: GWU.ui.Layer;
    buffer!: GWU.canvas.Buffer;
    io!: GWU.io.Handler;

    viewport!: Viewport.Viewport;
    messages!: Message.Messages;

    scheduler!: GWU.scheduler.Scheduler;
    player!: Player;
    map!: MAP.Map;

    _makeMap: MakeMapFn;
    _makePlayer: MakePlayerFn;
    _startMap: StartMapFn;
    result: any = undefined;

    mouse = false;
    fov = false;
    scent = false;

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

        if (typeof opts.messages === 'number') {
            opts.messages = { length: opts.messages };
        }
        opts.viewport = opts.viewport || {};

        const _opts = opts as GameInit;
        _opts.viewport.x = 0;
        _opts.viewport.y = 0;
        _opts.viewport.width = this.ui.width;
        _opts.viewport.height = this.ui.height;

        this._initMenu(_opts);
        this._initSidebar(_opts);
        if (opts.messages !== undefined) this._initMessages(_opts);
        this._initFlavor(_opts);
        this._initViewport(_opts);
    }

    _initMenu(_opts: GameInit) {}
    _initSidebar(_opts: GameInit) {}

    _initMessages(opts: GameInit) {
        const messOpts = opts.messages || {};
        messOpts.length = messOpts.length || messOpts.y || 4;

        if (messOpts.length < 0) {
            // bottom
            const viewInit = opts.viewport!;
            messOpts.x = viewInit.x;
            messOpts.y = this.ui.height + messOpts.length; // length < 0
            messOpts.width = viewInit.width;
            messOpts.height = -messOpts.length;

            opts.viewport!.height! -= messOpts.height;
        } else {
            // top
            const viewInit = opts.viewport!;
            messOpts.x = viewInit.x;
            messOpts.y = viewInit.y;
            messOpts.width = viewInit.width;
            messOpts.height = messOpts.length;

            viewInit.y! += messOpts.length;
            viewInit.height! -= messOpts.length;
        }

        this.messages = new Message.Messages(messOpts as Message.MessageInit);
    }

    _initFlavor(_opts: GameInit) {}

    _initViewport(opts: GameInit) {
        const viewOpts = opts.viewport || {};
        const viewInit = viewOpts as Viewport.ViewportInit;
        viewInit.lock = true;
        this.viewport = new Viewport.Viewport(viewInit);
    }

    async start() {
        this.layer = new GWU.ui.Layer(this.ui);
        this.buffer = this.layer.buffer;
        this.io = this.layer.io;

        this.running = true;
        this.scheduler = new GWU.scheduler.Scheduler();

        this.messages.clear();

        this.map = this._makeMap.call(this, 0);
        this.player = this._makePlayer.call(this);

        this.map.setPlayer(this.player);
        this.viewport.subject = this.player;

        this._startMap.call(this, this.map, this.player);

        if (this.scent) {
            this.map.drawer.scent = this.scent;
        }
        this.map.actors.forEach((a) => {
            this.scheduler.push(a, a.moveSpeed());
        });

        this.map.fov.update();

        this.draw();

        while (this.running) {
            await this.animate();
            await this.runTurn();
        }

        return this.result;
    }

    draw() {
        let needRender = false;
        needRender = this.viewport.draw(this.buffer);
        needRender = this.messages.draw(this.buffer) || needRender;
        if (needRender) {
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

                    if (this.viewport.tick(ev.dt)) {
                        this.draw();
                    }
                    // console.log('-- event', elapsed);
                } else if (this.mouse && ev.type === GWU.io.MOUSEMOVE) {
                    if (this.viewport.mousemove(ev)) {
                        this.draw();
                    }
                } else if (this.mouse && ev.type === GWU.io.CLICK) {
                    // console.log('click', ev.x, ev.y);
                    this.viewport.click(ev);
                }
            }

            if (elapsed < 50) {
                continue;
            }
            elapsed -= 50;

            if (this.player.hasGoal()) {
                const step = this.player.nextGoalStep();
                if (!step) {
                    this.player.clearGoal();
                } else {
                    const action = Actor.getAction('moveDir');
                    if (!action)
                        throw new Error('Failed to find moveDir action.');

                    done = await action(this, this.player, { dir: step });
                    if (done && this.player.hasGoal()) {
                        const goalMap = this.player.goalMap!;
                        this.viewport.showPath(goalMap.x!, goalMap.y!);
                    }
                }
            }
        }

        clearInterval(timer);

        return done;
    }
}
