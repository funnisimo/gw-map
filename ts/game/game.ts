import * as GWU from 'gw-utils';

import * as MAP from '../map';
import { Player } from '../player/player';
import * as Actor from '../actor';
import * as Viewport from './viewport';
import * as Message from './message';
import * as Flavor from './flavor';
import * as Sidebar from './sidebar';

export type MakeMapFn = (this: Game, opts: MakeMapOpts) => MAP.Map;
export type MakePlayerFn = (this: Game) => Player;
export type StartMapFn = (
    this: Game,
    map: MAP.Map,
    player: Player,
    opts: StartMapOpts
) => void;

export interface GameOptions extends GWU.app.CreateOpts {
    makeMap: MakeMapFn;
    makePlayer: MakePlayerFn;
    startMap?: StartMapFn;

    keymap: Record<string, string>;

    mouse?: boolean;

    viewport?: true | Viewport.ViewportOptions;
    messages?: boolean | number | Message.MessageOptions;
    flavor?: boolean | Flavor.FlavorOptions;
    sidebar?: boolean | number | Sidebar.SidebarOptions;
    // fov?: boolean;
    // scent?: boolean; // draw scent
}

export interface StartOpts {
    map?: number;
    player?: Player;
}

export interface MakeMapOpts {
    id?: number;
}

export interface StartMapOpts {
    id?: number;
    up?: boolean;
    down?: boolean;

    location?: string;
}

export class Game extends GWU.app.Scene {
    viewport!: Viewport.Viewport;
    messages?: Message.Messages;
    flavor?: Flavor.Flavor;
    sidebar?: Sidebar.Sidebar;

    scheduler!: GWU.scheduler.Scheduler;
    player!: Player;
    map!: MAP.Map;

    _makeMap!: MakeMapFn;
    _makePlayer!: MakePlayerFn;
    _startMap!: StartMapFn;
    result: any = undefined;

    mouse = false;
    fov = false;
    scent = false;

    running = false;
    keymap: Record<string, string> = {};

    constructor(id: string, app: GWU.app.App) {
        super(id, app);
    }

    get viewWidth() {
        return this.viewport.bounds.width;
    }
    get viewHeight() {
        return this.viewport.bounds.height;
    }

    _initMenu(_opts: GameOptions) {}
    _initSidebar(opts: GameOptions) {
        if (typeof opts.sidebar === 'number') {
            opts.sidebar = { width: opts.sidebar };
        } else if (opts.sidebar === true) {
            opts.sidebar = {};
        } else if (!opts.sidebar) {
            return;
        }

        const sideOpts = opts.sidebar;

        sideOpts.width = sideOpts.width || -20; // on right side

        const viewInit = opts.viewport as Viewport.ViewportOptions;
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

        sideOpts.scene = this;

        this.sidebar = new Sidebar.Sidebar(sideOpts);
    }

    _initMessages(opts: GameOptions) {
        if (opts.messages === false) return;
        if (opts.messages === true) {
            opts.messages = { archive: -4 };
        } else if (typeof opts.messages === 'number') {
            opts.messages = { archive: opts.messages };
        }

        const messOpts = opts.messages || { archive: -4 };
        messOpts.archive = messOpts.archive || messOpts.y || -4;

        if (messOpts.archive < 0) {
            // bottom
            const viewInit = opts.viewport as Viewport.ViewportOptions;
            messOpts.x = viewInit.x;
            messOpts.y = viewInit.height! + messOpts.archive; // length < 0
            messOpts.width = viewInit.width;
            messOpts.height = -messOpts.archive;

            viewInit.height! -= messOpts.height;
        } else {
            // top
            const viewInit = opts.viewport as Viewport.ViewportOptions;
            messOpts.x = viewInit.x;
            messOpts.y = viewInit.y;
            messOpts.width = viewInit.width;
            messOpts.height = messOpts.archive;

            viewInit.y! += messOpts.archive;
            viewInit.height! -= messOpts.archive;
        }

        messOpts.scene = this;

        this.messages = new Message.Messages(messOpts);
    }

    _initFlavor(opts: GameOptions) {
        if (opts.flavor === false) return;
        if (opts.flavor === true) {
            opts.flavor = {};
        }

        const flavOpts = opts.flavor || {};
        const viewOpts = opts.viewport as Viewport.ViewportOptions;

        const y = viewOpts.y || 0;
        if (y === 0) {
            // messages must be on bottom (or not there)
            flavOpts.x = viewOpts.x || 0;
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

        flavOpts.scene = this;

        this.flavor = new Flavor.Flavor(flavOpts);
    }

    _initViewport(opts: GameOptions) {
        if (opts.viewport === true) {
            opts.viewport = {};
        }
        const viewOpts = (opts.viewport || {}) as Viewport.ViewportOptions;
        viewOpts.lock = true;
        viewOpts.x = viewOpts.x || 0;
        viewOpts.y = viewOpts.y || 0;
        viewOpts.width = viewOpts.width || this.app.width - viewOpts.x;
        viewOpts.height = viewOpts.height || this.app.height - viewOpts.y;
        this.viewport = new Viewport.Viewport(viewOpts);
    }

    create(opts: GameOptions) {
        super.create(opts);

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
            opts.messages = { archive: opts.messages };
        }
        if (opts.flavor === true) {
            opts.flavor = {};
        } else if (opts.flavor === false) {
            delete opts.flavor;
        }

        if (opts.viewport === true) {
            opts.viewport = {};
        }
        const viewOpts = (opts.viewport = opts.viewport || {});
        viewOpts.x = viewOpts.x || 0;
        viewOpts.y = viewOpts.y || 0;
        viewOpts.width = viewOpts.width || this.app.width - viewOpts.x;
        viewOpts.height = viewOpts.height || this.app.height - viewOpts.y;

        this._initMenu(opts);
        if (opts.sidebar) this._initSidebar(opts);
        if (opts.messages) this._initMessages(opts);
        if (opts.flavor) this._initFlavor(opts);
        this._initViewport(opts);

        this.scheduler = new GWU.scheduler.Scheduler();
    }

    start(opts: StartOpts = {}) {
        if (this.messages) this.messages.clear();

        // move to create?
        this.player = opts.player || this._makePlayer.call(this);
        this.viewport.subject = this.player;
        if (this.sidebar) this.sidebar.subject = this.player;

        const id = opts.map || 0;
        this.startNewMap({ id });
        this.scheduler.push(this.player, 0);

        super.start(opts);
    }

    startNewMap(opts: StartMapOpts = { id: 0 }) {
        this.scheduler.clear();

        if (opts.id === undefined) {
            opts.id = this.map.id;
        }

        this.map = this._makeMap.call(this, opts);
        this.map.setPlayer(this.player);
        this._startMap.call(this, this.map, this.player, opts);

        // make sure player is on map
        if (this.player.map !== this.map) {
            // if not, add them (where?)
            const loc = this.map.locations.start || [0, 0]; // Is top left fallback any good?
            if (!this.map.addActorNear(loc[0], loc[1], this.player)) {
                throw new Error('Failed to find starting spot for player!');
            }
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
        // this.draw();
    }

    // draw() {
    //     this.viewport.draw(this.buffer);
    //     if (this.messages) this.messages.draw(this.buffer);
    //     if (this.flavor) this.flavor.draw(this.buffer);
    //     if (this.sidebar) this.sidebar.draw(this.buffer);

    //     if (this.buffer.changed) {
    //         this.buffer.render();
    //     }
    //     this.buffer.changed = false;
    //     this.map.actors.forEach((a) => (a.changed = false));
    //     this.map.items.forEach((i) => (i.changed = false));
    // }

    // finish(result?: any) {
    //     this.running = false;
    //     this.layer.finish();
    //     this.result = result;
    // }

    update(dt: number) {
        super.update(dt);
        if (this.tweens.length) return;

        let actor = this.scheduler.pop() as Actor.Actor;
        if (!actor) {
            this.stop();
            return;
        }

        let nextTime = 99;
        while (nextTime > 0 && actor) {
            nextTime = actor.act(this);
            if (nextTime >= 0) {
                this.scheduler.push(actor, nextTime);
                actor = this.scheduler.pop();
            }
            // stop every time the player acts so we can draw the screen
            if (actor === this.player) {
                nextTime = 0;
            }
        }
    }

    // playerTurn(player: Player): number {
    //     let done = 0;

    //     const timer = setInterval(() => {
    //         const tick = GWU.app.makeTickEvent(16);
    //         // console.log('-tick', Date.now());
    //         this.io.enqueue(tick);
    //     }, 16);

    //     let elapsed = 0;
    //     while (!done && this.running) {
    //         const ev = await this.io.nextEvent(-1);

    //         if (ev) {
    //             if (ev.type === GWU.app.KEYPRESS) {
    //             }
    //         }

    //         if (elapsed < 50) {
    //             continue;
    //         }
    //         elapsed -= 50;
    //     }

    //     clearInterval(timer);

    //     return done;
    // }

    input(ev: GWU.app.Event) {
        super.input(ev);
        if (ev.defaultPrevented || ev.propagationStopped) return;
        if (ev.type === GWU.app.MOUSEMOVE) {
            this.mousemove(ev);
        } else if (ev.type === GWU.app.CLICK) {
            this.click(ev);
        } else if (ev.type === GWU.app.KEYPRESS) {
            this.keypress(ev);
        }
    }

    mousemove(ev: GWU.app.Event) {
        if (this.viewport.contains(ev)) {
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
        }
    }

    click(_ev: GWU.app.Event) {}

    keypress(ev: GWU.app.Event) {
        this.map.clearPath();
        if (this.player.hasGoal()) {
            this.player.clearGoal();
        } else {
            const action = this._actionFor(this.keymap, ev);
            if (action) {
                this.player.setAction(action);
            }
        }
    }

    _actionFor(
        keymap: Record<string, string>,
        ev: GWU.app.Event
    ): string | null {
        if (ev.dir && keymap.dir) return keymap.dir;
        return (
            keymap[ev.key] ||
            keymap[ev.code] ||
            keymap.keypress ||
            keymap.default ||
            null
        );
    }
}

GWU.app.installScene(
    'game',
    (id: string, app: GWU.app.App) => new Game(id, app)
);
