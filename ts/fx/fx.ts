import * as GWU from 'gw-utils';
import { MapType } from '../map';
import { Actor } from '../actor';
import * as Entity from '../entity';
import * as Flags from '../flags';

export type FxCallback = (result?: any) => any;
export type FxStepFn = (x: number, y: number) => boolean;

export interface FxOptions {
    speed?: number;
    duration?: number;
    isRealTime?: boolean;
}

// export class FX {
//     map: Map;

//     tilNextTurn: number;
//     speed: number;
//     callback: FxCallback;
//     done: boolean;
//     isRealTime: boolean;

//     constructor(map: MapType, opts: FxOptions = {}) {
//         this.map = map;
//         this.isRealTime = opts.isRealTime || false;
//         this.tilNextTurn = opts.speed || opts.duration || 1000;
//         this.speed = opts.speed || opts.duration || 1000;
//         this.callback = GWU.NOOP;
//         this.done = false;
//     }

//     tick(dt: number) {
//         if (this.done) return;
//         this.tilNextTurn -= dt;
//         while (this.tilNextTurn < 0 && !this.done) {
//             this.step();
//             this.tilNextTurn += this.speed;
//         }
//     }

//     step() {
//         this.stop();
//     }

//     start() {}

//     stop(result?: any) {
//         if (this.done) return;
//         this.done = true;
//         this.callback(result);
//     }
// }

export interface SpriteFxOptions extends FxOptions {
    blink?: number;
}

// export class SpriteFX extends FX {
//     sprite: GWU.sprite.SpriteConfig;
//     stepCount: number;
//     x: number;
//     y: number;

//     constructor(
//         map: MapType,
//         sprite: string | GWU.sprite.SpriteConfig,
//         x: number,
//         y: number,
//         opts: SpriteFxOptions = {}
//     ) {
//         const count = opts.blink || 1;
//         const duration = opts.duration || 1000;
//         opts.speed = opts.speed || duration / (2 * count - 1);
//         super(map, opts);
//         if (typeof sprite === 'string') {
//             const name = sprite;
//             sprite = GWU.sprite.sprites[sprite];
//             if (!sprite) throw new Error('Cannot find sprite! ' + name);
//         }
//         this.sprite = sprite;
//         this.x = x || 0;
//         this.y = y || 0;
//         this.stepCount = 2 * count - 1;
//     }

//     start() {
//         this.map.addFx(this.x, this.y, this.sprite);
//         return super.start();
//     }

//     step() {
//         --this.stepCount;
//         if (this.stepCount <= 0) return this.stop();
//         if (this.stepCount % 2 == 0) {
//             this.map.removeFx(this);
//         } else {
//             this.map.addFx(this.x, this.y, this);
//         }
//     }

//     stop(result?: any) {
//         this.map.removeFx(this);
//         return super.stop(result);
//     }

//     moveDir(dx: number, dy: number) {
//         return this.moveTo(this.x + dx, this.y + dy);
//     }

//     moveTo(x: number, y: number) {
//         this.map.moveFx(x, y, this);
//         return true;
//     }
// }

export async function flashSprite(
    map: MapType,
    x: number,
    y: number,
    sprite: string | GWU.sprite.SpriteConfig,
    duration = 100,
    count = 1,
    animator?: GWU.tween.Animator
) {
    if (typeof sprite === 'string') {
        sprite = GWU.sprite.from(sprite);
    }
    const entity = Entity.make({ name: 'FX', sprite });
    map.addFx(x, y, entity);
    const tween = GWU.tween
        .make({ visible: true })
        .to({ visible: false })
        .repeat(count)
        .repeatDelay(duration)
        .duration(duration)
        .onUpdate((obj) => {
            if (obj.visible) {
                map.addFx(x, y, entity);
            } else {
                map.removeFx(entity);
            }
        });

    // realTime
    animator = animator || GWU.loop;
    animator.addAnimation(tween);
    return tween.start();
}

GWU.sprite.install('bump', 'white', 50);

export async function hit(
    map: MapType,
    target: GWU.xy.XY,
    sprite?: string | GWU.sprite.SpriteConfig,
    duration?: number,
    animator?: GWU.tween.Animator
) {
    sprite = sprite || 'hit';
    duration = duration || 200;
    await flashSprite(map, target.x, target.y, sprite, duration, 1, animator);
}

GWU.sprite.install('hit', 'red', 50);

export async function miss(
    map: MapType,
    target: GWU.xy.XY,
    sprite?: string | GWU.sprite.SpriteConfig,
    duration?: number,
    animator?: GWU.tween.Animator
) {
    sprite = sprite || 'miss';
    duration = duration || 200;
    await flashSprite(map, target.x, target.y, sprite, duration, 1, animator);
}

GWU.sprite.install('miss', 'green', 50);

export async function fadeInOut(
    map: MapType,
    x: number,
    y: number,
    sprite: string | GWU.sprite.SpriteConfig,
    duration = 100,
    animator?: GWU.tween.Animator
) {
    if (typeof sprite === 'string') {
        sprite = GWU.sprite.from(sprite).clone();
    } else {
        sprite = GWU.sprite.make(sprite);
    }

    const entity = Entity.make({ name: 'FX', sprite });
    map.addFx(x, y, entity);
    const tween = GWU.tween
        .make({ opacity: 0 })
        .to({ opacity: 100 })
        .repeat(2)
        .yoyo(true)
        .duration(Math.floor(duration / 2))
        .onUpdate((obj) => {
            entity.sprite.opacity = obj.opacity;
            map.cell(x, y).needsRedraw = true; // we changed the sprite so redraw
        })
        .onFinish(() => {
            map.removeFx(entity);
        });

    // realTime
    animator = animator || GWU.loop;
    animator.addAnimation(tween);
    return tween.start();
}

// export class MovingSpriteFX extends SpriteFX {
//     target: Actor;
//     path: GWU.xy.Loc[];
//     stepFn: FxStepFn;

//     constructor(
//         map: MapType,
//         source: Actor,
//         target: Actor,
//         sprite: string | GWU.sprite.SpriteConfig,
//         speed: number,
//         stepFn?: FxStepFn
//     ) {
//         super(map, sprite, source.x, source.y, { speed });
//         this.target = target;
//         this.path = GWU.xy.getLine(
//             source.x,
//             source.y,
//             this.target.x,
//             this.target.y
//         );
//         this.stepFn = stepFn || this._stopAtObstruction.bind(this);
//     }

//     _stopAtObstruction(x: number, y: number): number {
//         if (this.map.hasEntityFlag(x, y, Flags.Entity.L_BLOCKS_MOVE)) {
//             return -1;
//         }
//         return 1;
//     }

//     step() {
//         if (this.x == this.target.x && this.y == this.target.y)
//             return this.stop(this);
//         if (
//             !this.path.find(
//                 (loc) => loc[0] == this.target.x && loc[1] == this.target.y
//             )
//         ) {
//             this.path = GWU.xy.getLine(
//                 this.x,
//                 this.y,
//                 this.target.x,
//                 this.target.y
//             );
//         }
//         const next: GWU.xy.Loc = this.path.shift() || [-1, -1];
//         const r = this.stepFn(next[0], next[1]);
//         if (r < 0) {
//             return this.stop(this);
//         } else if (r) {
//             return this.moveTo(next[0], next[1]);
//         } else {
//             this.moveTo(next[0], next[1]);
//             this.target.x = this.x;
//             this.target.y = this.y;
//         }
//     }
// }

export interface MoveOptions {
    speed?: number;
    duration?: number;

    stopBeforeWalls?: boolean;
    stepFn?: FxStepFn; // reeturn true to stop

    animator?: GWU.tween.Animator;
}

export async function moveSprite(
    map: MapType,
    source: GWU.xy.XY | GWU.xy.Loc,
    target: GWU.xy.XY | GWU.xy.Loc,
    sprite: string | GWU.sprite.SpriteConfig,
    opts: MoveOptions = {}
): Promise<GWU.xy.XY> {
    if (typeof sprite === 'string') {
        sprite = GWU.sprite.from(sprite);
    }
    const entity = Entity.make({ name: 'FX', sprite });
    const from = { x: GWU.xy.x(source), y: GWU.xy.y(source) };
    map.addFx(from.x, from.y, entity);

    let duration =
        opts.duration ||
        Math.ceil(
            16 * (GWU.xy.maxAxisFromTo(source, target) / (opts.speed || 8))
        );

    if (GWU.xy.isLoc(target)) {
        target = { x: target[0], y: target[1] };
    }

    const tween = GWU.tween
        .make(from)
        .to(target)
        .duration(duration)
        .onUpdate((vals) => {
            // tweens dont update every step, so...
            // draw line from current pos to vals pos
            // check each step for blocking...
            // end at either vals or last blocking spot
            const dest = { x: entity.x, y: entity.y };
            const ok = GWU.xy.forLineBetween(
                dest.x,
                dest.y,
                vals.x,
                vals.y,
                (x, y) => {
                    if (opts.stepFn) {
                        if (opts.stepFn(x, y)) {
                            if (!opts.stopBeforeWalls) {
                                dest.x = x;
                                dest.y = y;
                            }
                            return false;
                        }
                    } else if (
                        map.hasEntityFlag(x, y, Flags.Entity.L_BLOCKS_MOVE)
                    ) {
                        if (!opts.stopBeforeWalls) {
                            dest.x = x;
                            dest.y = y;
                        }
                        return false;
                    }
                    dest.x = x;
                    dest.y = y;
                }
            );

            map.moveFx(entity, dest.x, dest.y);
            if (!ok) {
                tween.stop();
            }
        })
        .onFinish(() => {
            map.removeFx(entity);
            return entity;
        });

    const animator = opts.animator || map;
    animator.addAnimation(tween);
    return tween.start();
}

export function bolt(
    map: MapType,
    source: GWU.xy.XY | GWU.xy.Loc,
    target: GWU.xy.XY | GWU.xy.Loc,
    sprite: string | GWU.sprite.SpriteConfig,
    opts: MoveOptions = {}
): Promise<GWU.xy.XY> {
    return moveSprite(map, source, target, sprite, opts);
}

export interface ProjectileOptions extends MoveOptions {}

export async function projectile(
    map: MapType,
    source: Actor,
    target: Actor,
    sprite: string | GWU.sprite.SpriteConfig,
    opts: ProjectileOptions = {}
): Promise<GWU.xy.XY> {
    if (typeof sprite === 'string') {
        sprite = GWU.sprite.from(sprite);
    }
    if (sprite.ch && sprite.ch.length == 4) {
        const dir = GWU.xy.dirFromTo(source, target);
        let index = 0;
        if (dir[0] && dir[1]) {
            index = 2;
            if (dir[0] != dir[1]) {
                // remember up is -y
                index = 3;
            }
        } else if (dir[0]) {
            index = 1;
        }
        const ch = sprite.ch[index];
        sprite = GWU.sprite.make(ch, sprite.fg, sprite.bg);
    } else if (sprite.ch && sprite.ch.length !== 1) {
        throw new Error(
            'projectile requires 4 chars - vert,horiz,diag-left,diag-right (e.g: "|-\\/")'
        );
    }

    return moveSprite(map, source, target, sprite, opts);
}

//
// RUT.Animations.projectileToTarget = function projectileTo(map, from, target, callback, opts) {
//   if (typeof callback != 'function' && opts === undefined) {
//     opts = callback;
//     callback = RUT.NOOP;
//   }
//   if (opts === true) opts = {};
//   if (opts === false) return;
//   opts = opts || {};
//   if (typeof opts === 'string') opts = { sprite: opts };
//
//   Object.defaults(opts, RUT.Config.Animations.projectile);
//   // if (!RUT.FOV.isVisible(shooter) && !RUT.FOV.isVisible(to)) { return Promise.resolve(); }
//   const sprite = opts.sprite;
//   let anim = new RUT.Animations.XYAnimation(map, sprite, from, () => target.xy, callback, opts.speed);
//   anim.start(); // .then( () => target.xy );
//   return anim;
// }
//

// export class DirAnimation extends FX {
//   constructor(sprite, from, dir, callback, opts={}) {
//     const speed = opts.speed || 10;
//     super(callback, { sprite, speed });
//     this.from = from;
//     this.dir = dir;
//     this.stopCell = opts.stopCell;
//     this.stopTile = opts.stopTile;
//     this.stepFn = opts.stepFn || TRUE;
//     this.range = opts.range || 99;
//   }
//
//   start() {
//     return super.start(this.from.x, this.from.y);
//   }
//
//   step() {
//     let dist = distanceFromTo(this.from, this.xy);
//     if (dist >= this.range) {
//       return this.stop(this.xy);
//     }
//
//     const newXy = this.xy.plus(this.dir);
//
//     const cell = DATA.map.cell(newXy.x, newXy.y);
//     if (!cell) {
//       return this.stop(this.xy);
//     }
//     else if (this.stopCell && RUT.Cell.hasAllFlags(cell, this.stopCell)) {
//       return this.stop(this.xy);
//     }
//     else if (this.stopTile && RUT.Cell.hasTileFlag(cell, this.stopTile)) {
//       return this.stop(this.xy);
//     }
//
//     DATA.map.moveAnimation(this.map, newXy.x, newXy.y, this);
//     if (this.stepFn(this.map, this.xy.x, this.xy.y)) {
//       return this.stop(this.xy);
//     }
//   }
// }

//
// RUT.Animations.projectileDir = function projectileTo(map, xy, dir, callback, opts) {
//   if (typeof callback != 'function' && opts === undefined) {
//     opts = callback;
//     callback = RUT.NOOP;
//   }
//   if (opts === true) opts = {};
//   if (opts === false) return;
//   opts = opts || {};
//   if (typeof opts === 'string') opts = { sprite: opts };
//   if (opts.sprite === true) opts.sprite = RUT.Config.Animations.projectile.sprite;
//
//   Object.defaults(opts, RUT.Config.Animations.projectile);
//   let anim = new RUT.Animations.DirAnimation(map, opts.sprite, xy, dir, callback, opts);
//   anim.start(); // .then( () => anim.xy );
//   return anim;
// }
//

export interface BeamOptions {
    fade?: number;

    speed?: number;
    duration?: number;

    stopAtWalls?: boolean;
    stopBeforeWalls?: boolean;
    stepFn?: FxStepFn; // return true to stop line

    animator?: GWU.tween.Animator;
}

export function beam(
    map: MapType,
    from: GWU.xy.XY | GWU.xy.Loc,
    to: GWU.xy.XY | GWU.xy.Loc,
    sprite: string | GWU.sprite.SpriteConfig,
    opts: BeamOptions = {}
): Promise<GWU.xy.XY> {
    opts.fade = opts.fade || 100;
    if (opts.stopAtWalls === undefined) opts.stopAtWalls = true;

    const line: GWU.xy.Loc[] = [];

    GWU.xy.forLineFromTo(from, to, (x, y) => {
        if (!map.hasXY(x, y)) return false;

        if (opts.stepFn && opts.stepFn(x, y)) return false;

        if (opts.stopAtWalls || opts.stopBeforeWalls) {
            if (map.hasEntityFlag(x, y, Flags.Entity.L_BLOCKS_MOVE)) {
                if (opts.stopBeforeWalls) return false;
                line.push([x, y]);
                return false;
            }
        }
        line.push([x, y]);
        return true;
    });

    const duration =
        opts.duration || Math.ceil(16 * (line.length / (opts.speed || 8)));
    const animator = opts.animator || map;

    const promises: Promise<any>[] = [];
    let lastIndex = -1;
    const tween = GWU.tween
        .make({ index: 0 })
        .to({ index: line.length - 1 })
        .duration(duration)
        .onUpdate((vals) => {
            while (lastIndex < vals.index) {
                ++lastIndex;
                const loc = line[lastIndex] || [-1, -1];
                promises.push(
                    fadeInOut(map, loc[0], loc[1], sprite, opts.fade, animator)
                );
            }
        })
        .onFinish(async () => {
            await Promise.all(promises);
            const loc = line[line.length - 1];
            return { x: loc[0], y: loc[1] };
        });

    animator.addAnimation(tween);
    return tween.start();
}

export type ExplosionShape = 'o' | 'x' | 'X' | '+' | '*';

/*
class ExplosionFX extends FX {
    map: Map;
    grid: GWU.grid.NumGrid;
    x: number;
    y: number;
    radius: number;
    maxRadius: number;
    sprite: string | GWU.sprite.SpriteConfig;
    fade: number;
    shape: ExplosionShape;
    center: boolean;
    stepFn: FxStepFn;
    count: number;

    // TODO - take opts instead of individual params (do opts setup here)
    constructor(
        map: MapType,
        fovGrid: GWU.grid.NumGrid | null,
        x: number,
        y: number,
        radius: number,
        sprite: string | GWU.sprite.SpriteConfig,
        speed?: number,
        fade?: number,
        shape?: ExplosionShape,
        center?: boolean,
        stepFn?: FxStepFn
    ) {
        speed = speed || 20;
        super({ speed });
        this.map = map;
        this.grid = GWU.grid.alloc(map.width, map.height);
        if (fovGrid) {
            this.grid.copy(fovGrid);
        } else {
            this.grid.fill(1);
        }
        this.x = x;
        this.y = y;
        this.radius = 0;
        this.maxRadius = radius;
        this.sprite = sprite;
        this.fade = fade || 100;
        this.shape = shape || 'o';
        this.center = center === undefined ? true : center;
        this.stepFn = stepFn || GWU.TRUE;
        this.count = 0;
    }

    start() {
        if (this.center) {
            this.visit(this.x, this.y);
        } else {
            this.step();
        }
    }

    step() {
        if (this.radius >= this.maxRadius) return false;

        this.radius = Math.min(this.radius + 1, this.maxRadius);

        let done = true;
        let x = Math.max(0, Math.floor(this.x - this.maxRadius));
        const maxX = Math.min(
            this.grid.width - 1,
            Math.ceil(this.x + this.maxRadius)
        );
        let minY = Math.max(0, Math.floor(this.y - this.maxRadius));
        const maxY = Math.min(
            this.grid.height - 1,
            Math.ceil(this.y + this.maxRadius)
        );
        let col;
        let dist;

        for (; x <= maxX; ++x) {
            col = this.grid[x];
            for (let y = minY; y <= maxY; ++y) {
                if (col[y] != 1) continue; // not in FOV
                dist = GWU.xy.distanceBetween(this.x, this.y, x, y);
                if (dist <= this.radius) {
                    this.visit(x, y);
                } else if (dist <= this.maxRadius) {
                    done = false;
                }
            }
        }
        GWU.ui.requestUpdate(48);

        // fx.debug('returning...', done);
        if (done && this.count == 0) {
            return this.stop(this); // xy of explosion is callback value
        }
        return false;
    }

    visit(x: number, y: number) {
        if (this.isInShape(x, y) && this.stepFn(x, y)) {
            this.count += 1;
            const anim = new SpriteFX(this.map, this.sprite, x, y, {
                duration: this.fade,
            });
            this.playFx(anim).then(() => {
                --this.count;
                if (this.count == 0) {
                    this.stop(this);
                }
            });
            // flashSprite(this.map, x, y, this.sprite, this.fade);
        }
        this.grid[x][y] = 2;
    }

    isInShape(x: number, y: number) {
        const sx = Math.abs(x - this.x);
        const sy = Math.abs(y - this.y);
        if (sx == 0 && sy == 0 && !this.center) return false;
        switch (this.shape) {
            case '+':
                return sx == 0 || sy == 0;
            case 'x':
            case 'X':
                return sx == sy;
            case '*':
                return sx == 0 || sy == 0 || sx == sy;
            default:
                return true;
        }
    }

    stop(result?: any) {
        GWU.grid.free(this.grid);
        return super.stop(result);
    }
}
*/

export interface ExplosionOptions {
    speed?: number;
    duration?: number;

    fade?: number;

    shape?: ExplosionShape;
    center?: boolean;
    stepFn?: FxStepFn;

    animator?: GWU.tween.Animator;
}

function isInShape(
    shape: string,
    cx: number,
    cy: number,
    allowCenter: boolean,
    x: number,
    y: number
) {
    const sx = Math.abs(x - cx);
    const sy = Math.abs(y - cy);
    if (sx == 0 && sy == 0 && !allowCenter) return false;
    switch (shape) {
        case '+':
            return sx == 0 || sy == 0;
        case 'x':
        case 'X':
            return sx == sy;
        case '*':
            return sx == 0 || sy == 0 || sx == sy;
        default:
            return true;
    }
}

function checkExplosionOpts(opts: ExplosionOptions) {
    opts.speed = opts.speed || 2;
    opts.fade = opts.fade || 100;
    opts.shape = opts.shape || 'o';
    if (opts.center === undefined) {
        opts.center = true;
    }
}

export function explosion(
    map: MapType,
    x: number,
    y: number,
    radius: number,
    sprite: string | GWU.sprite.SpriteConfig,
    opts: ExplosionOptions = {}
) {
    checkExplosionOpts(opts);
    opts.animator = opts.animator || map;

    // opts.stepFn = opts.stepFn || ((x, y) => !map.isObstruction(x, y));

    if (typeof sprite === 'string') {
        sprite = GWU.sprite.from(sprite);
    }

    const grid = GWU.grid.alloc(map.width, map.height);

    const fov = new GWU.fov.FOV({
        isBlocked(x: number, y: number): boolean {
            return map.hasEntityFlag(x, y, Flags.Entity.L_BLOCKS_MOVE);
        },
        hasXY(x: number, y: number): boolean {
            return map.hasXY(x, y);
        },
    });

    fov.calculate(x, y, radius, (x1, y1) => {
        grid[x1][y1] = 1;
    });

    const duration = opts.duration || 32 * (radius / opts.speed!);
    const promises: Promise<any>[] = [];

    const tween = GWU.tween
        .make({ r: 0 })
        .to({ r: radius })
        .duration(duration)
        .onUpdate((vals) => {
            const minX = Math.max(0, x - vals.r);
            const minY = Math.max(0, y - vals.r);
            const maxX = Math.min(map.width - 1, x + vals.r);
            const maxY = Math.min(map.height - 1, y + vals.r);

            for (let x1 = minX; x1 <= maxX; ++x1) {
                for (let y1 = minY; y1 <= maxY; ++y1) {
                    if (
                        grid[x1][y1] &&
                        GWU.xy.distanceBetween(x, y, x1, y1) <= vals.r
                    ) {
                        grid[x1][y1] = 0;
                        if (
                            isInShape(opts.shape!, x, y, opts.center!, x1, y1)
                        ) {
                            promises.push(
                                fadeInOut(
                                    map,
                                    x1,
                                    y1,
                                    sprite,
                                    opts.fade,
                                    opts.animator
                                )
                            );
                        }
                    }
                }
            }
        })
        .onFinish(async (_obj: any, success: boolean) => {
            GWU.grid.free(grid);
            await Promise.all(promises);
            return success;
        });

    opts.animator.addAnimation(tween);
    return tween.start();
}

/*
export function explosionFor(
    map: MapType,
    grid: GWU.grid.NumGrid,
    x: number,
    y: number,
    radius: number,
    sprite: string | GWU.sprite.SpriteConfig,
    opts: ExplosionOptions = {}
) {
    checkExplosionOpts(opts);
    // opts.stepFn = opts.stepFn || ((x, y) => !map.isObstruction(x, y));
    const animation = new ExplosionFX(
        map,
        grid,
        x,
        y,
        radius,
        sprite,
        opts.speed,
        opts.fade,
        opts.shape,
        opts.center,
        opts.stepFn
    );
    return opts.playFn!(animation);
}
*/
