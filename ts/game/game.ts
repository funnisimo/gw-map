import * as GWU from 'gw-utils';

import * as MAP from '../map';
import { Player } from '../player/player';
import * as Command from '../command';
import * as Actor from '../actor';
import * as Viewport from './viewport';
import * as Message from './message';
import * as Flavor from './flavor';
import * as Sidebar from './sidebar';

export interface GameOptions extends GWU.ui.UIOptions {
    ui?: GWU.ui.UI;

    makeMap: MakeMapFn;
    makePlayer: MakePlayerFn;
    startMap?: StartMapFn;

    keymap: Record<string, string | Command.CommandFn>;

    mouse?: boolean;

    viewport?: Viewport.ViewportOptions;
    messages?: number | Message.MessageOptions;
    flavor?: boolean | Flavor.FlavorOptions;
    sidebar?: boolean | number | Sidebar.SidebarOptions;
    // fov?: boolean;
    // scent?: boolean; // draw scent
}

export interface GameInit extends GameOptions {
    viewport: Partial<Viewport.ViewportInit>;
    messages: Partial<Message.MessageInit>;
    flavor: Partial<Flavor.FlavorInit>;
    sidebar: Partial<Sidebar.SidebarInit>;
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
    messages?: Message.Messages;
    flavor?: Flavor.Flavor;
    sidebar?: Sidebar.Sidebar;

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

        if (!opts.makeMap || !opts.makePlayer) {
            throw new Error('Need funcitons for makeMap and makePlayer');
        }

        this._makeMap = opts.makeMap;
        this._makePlayer = opts.makePlayer;
        this._startMap = opts.startMap || GWU.NOOP;

        if (opts.keymap) {
            Object.assign(this.keymap, opts.keymap);
        }

        if (opts.mouse) {
            this.mouse = true;
        }

        if (typeof opts.messages === 'number') {
            opts.messages = { size: opts.messages };
        }
        if (opts.flavor === true) {
            opts.flavor = {};
        } else if (opts.flavor === false) {
            delete opts.flavor;
        }
        opts.viewport = opts.viewport || {};

        const _opts = opts as GameInit;
        _opts.viewport.x = 0;
        _opts.viewport.y = 0;
        _opts.viewport.width = this.ui.width;
        _opts.viewport.height = this.ui.height;

        this._initMenu(_opts);
        if (opts.sidebar) this._initSidebar(_opts);
        if (opts.messages) this._initMessages(_opts);
        if (opts.flavor) this._initFlavor(_opts);
        this._initViewport(_opts);
    }

    get width() {
        return this.viewport.bounds.width;
    }
    get height() {
        return this.viewport.bounds.height;
    }

    _initMenu(_opts: GameInit) {}
    _initSidebar(opts: GameInit) {
        if (typeof opts.sidebar === 'number') {
            opts.sidebar = { width: opts.sidebar };
        } else if (opts.sidebar === true) {
            opts.sidebar = {};
        }

        const sideOpts = opts.sidebar;

        sideOpts.width = sideOpts.width || -20; // on right side

        const viewInit = opts.viewport!;
        if (sideOpts.width < 0) {
            sideOpts.width *= -1;
            sideOpts.x = viewInit.x! + viewInit.width! - sideOpts.width;
            sideOpts.y = viewInit.y;
            sideOpts.height = viewInit.height;

            viewInit.width! -= sideOpts.width;
        } else {
            sideOpts.x = 0;
            sideOpts.height = viewInit.height;
            sideOpts.y = viewInit.y;

            viewInit.x = sideOpts.width;
            viewInit.width! -= sideOpts.width;
        }

        this.sidebar = new Sidebar.Sidebar(sideOpts as Sidebar.SidebarInit);
    }

    _initMessages(opts: GameInit) {
        if (opts.messages === false) return;
        if (opts.messages === true) {
            opts.messages = { size: -4 };
        }

        const messOpts = opts.messages || { size: -4 };
        messOpts.size = messOpts.size || messOpts.y || -4;

        if (messOpts.size < 0) {
            // bottom
            const viewInit = opts.viewport!;
            messOpts.x = viewInit.x;
            messOpts.y = this.ui.height + messOpts.size; // length < 0
            messOpts.width = viewInit.width;
            messOpts.height = -messOpts.size;

            opts.viewport!.height! -= messOpts.height;
        } else {
            // top
            const viewInit = opts.viewport!;
            messOpts.x = viewInit.x;
            messOpts.y = viewInit.y;
            messOpts.width = viewInit.width;
            messOpts.height = messOpts.size;

            viewInit.y! += messOpts.size;
            viewInit.height! -= messOpts.size;
        }

        this.messages = new Message.Messages(messOpts as Message.MessageInit);
    }

    _initFlavor(opts: GameInit) {
        const flavOpts = opts.flavor || {};
        const viewOpts = opts.viewport;

        if (viewOpts.y === 0) {
            // messages must be on bottom (or not there)
            flavOpts.x = viewOpts.x;
            flavOpts.y = viewOpts.height! - 1;
            flavOpts.width = viewOpts.width;

            viewOpts.height! -= 1;
        } else {
            // messages on top
            flavOpts.x = viewOpts.x;
            flavOpts.y = viewOpts.y;
            flavOpts.width = viewOpts.width;

            viewOpts.y! += 1;
            viewOpts.height! -= 1;
        }

        this.flavor = new Flavor.Flavor(flavOpts as Flavor.FlavorInit);
    }

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

        if (this.messages) this.messages.clear();

        this.player = this._makePlayer.call(this);
        this.viewport.subject = this.player;
        if (this.sidebar) this.sidebar.subject = this.player;

        this.startNewMap(0);
        this.scheduler.push(this.player, 0);

        while (this.running) {
            await this.animate();
            await this.runTurn();
        }

        return this.result;
    }

    startNewMap(id: number, _location = 'start') {
        this.scheduler.clear();

        this.map = this._makeMap.call(this, id);
        this.map.setPlayer(this.player);
        this.map.id = id;
        this._startMap.call(this, this.map, this.player);

        // make sure player is on map
        if (this.player.map !== this.map) {
            // if not, add them (where?)
            const loc = this.map.locations.start || [0, 0]; // Is top left fallback any good?
            this.map.addActorNear(loc[0], loc[1], this.player);
        }

        if (this.scent) {
            this.map.drawer.scent = this.scent;
        }
        this.map.actors.forEach((a) => {
            if (!a.isPlayer()) {
                this.scheduler.push(a, a.moveSpeed());
            }
        });

        this.map.fov.update();
        this.draw();
    }

    draw() {
        this.viewport.draw(this.buffer);
        if (this.messages) this.messages.draw(this.buffer);
        if (this.flavor) this.flavor.draw(this.buffer);
        if (this.sidebar) this.sidebar.draw(this.buffer);

        if (this.buffer.changed) {
            this.buffer.render();
        }
        this.buffer.changed = false;
        this.map.actors.forEach((a) => (a.changed = false));
        this.map.items.forEach((i) => (i.changed = false));
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
        if (!this.io._tweens.length) return;

        const timer = setInterval(() => {
            const tick = GWU.io.makeTickEvent(16);
            this.io.enqueue(tick);
        }, 16);

        while (this.io._tweens.length) {
            const ev = await this.io.nextTick();
            if (ev && ev.dt) {
                this.io._tweens.forEach((a) => a && a.tick(ev.dt));
                this.io._tweens = this.io._tweens.filter(
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
            this.io.enqueue(tick);
        }, 16);

        let elapsed = 0;
        while (!done && this.running) {
            const ev = await this.io.nextEvent(-1);

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
                        const x = this.viewport.toInnerX(ev.x);
                        const y = this.viewport.toInnerY(ev.y);
                        if (this.flavor) {
                            const text = this.flavor.getFlavorText(
                                this.map,
                                x,
                                y,
                                this.map.fov
                            );
                            this.flavor.showText(text);
                        }
                        if (this.sidebar) {
                            this.sidebar.highlightAt(x, y);
                        }
                        this.draw();
                    } else if (this.sidebar && this.sidebar.mousemove(ev)) {
                        this.draw();
                    }
                } else if (this.mouse && ev.type === GWU.io.CLICK) {
                    // console.log('click', ev.x, ev.y);
                    if (this.viewport.contains(ev)) {
                        this.viewport.click(ev);
                    } else if (this.messages && this.messages.contains(ev)) {
                        await this.messages.showArchive(this);
                    } else if (this.sidebar && this.sidebar.contains(ev)) {
                        await this.sidebar.click(ev);
                    }
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
