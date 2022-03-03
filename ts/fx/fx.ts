import * as GWU from 'gw-utils';
import { Map } from '../map';
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

export interface SpriteFxOptions extends FxOptions {
    blink?: number;
}

export function flashSprite(
    map: Map,
    x: number,
    y: number,
    sprite: string | GWU.sprite.SpriteConfig,
    duration = 100,
    count = 1
): GWU.tween.Tween {
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

    return tween;
}

GWU.sprite.install('bump', 'white', 50);

export function hit(
    map: Map,
    target: GWU.xy.XY,
    sprite?: string | GWU.sprite.SpriteConfig,
    duration?: number
): GWU.tween.Tween {
    sprite = sprite || 'hit';
    duration = duration || 200;
    return flashSprite(map, target.x, target.y, sprite, duration, 1);
}

GWU.sprite.install('hit', 'red', 50);

export function miss(
    map: Map,
    target: GWU.xy.XY,
    sprite?: string | GWU.sprite.SpriteConfig,
    duration?: number
): GWU.tween.Tween {
    sprite = sprite || 'miss';
    duration = duration || 200;
    return flashSprite(map, target.x, target.y, sprite, duration, 1);
}

GWU.sprite.install('miss', 'green', 50);

export function fadeInOut(
    map: Map,
    x: number,
    y: number,
    sprite: string | GWU.sprite.SpriteConfig,
    duration = 100
): GWU.tween.Tween {
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
    return tween;
}

export interface MoveOptions {
    speed?: number;
    duration?: number;

    stopBeforeWalls?: boolean;
    stepFn?: FxStepFn; // reeturn true to stop
}

export function moveSprite(
    map: Map,
    source: GWU.xy.XY | GWU.xy.Loc,
    target: GWU.xy.XY | GWU.xy.Loc,
    sprite: string | GWU.sprite.SpriteConfig,
    opts: MoveOptions = {}
): GWU.tween.Tween {
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

    return tween;
}

export function bolt(
    map: Map,
    source: GWU.xy.XY | GWU.xy.Loc,
    target: GWU.xy.XY | GWU.xy.Loc,
    sprite: string | GWU.sprite.SpriteConfig,
    opts: MoveOptions = {}
): GWU.tween.Tween {
    return moveSprite(map, source, target, sprite, opts);
}

export interface ProjectileOptions extends MoveOptions {}

export function projectile(
    map: Map,
    source: Actor,
    target: Actor,
    sprite: string | GWU.sprite.SpriteConfig,
    opts: ProjectileOptions = {}
): GWU.tween.Tween {
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

export interface BeamOptions {
    fade?: number;

    speed?: number;
    duration?: number;

    stopAtWalls?: boolean;
    stopBeforeWalls?: boolean;
    stepFn?: FxStepFn; // return true to stop line
}

export function beam(
    map: Map,
    from: GWU.xy.XY | GWU.xy.Loc,
    to: GWU.xy.XY | GWU.xy.Loc,
    sprite: string | GWU.sprite.SpriteConfig,
    opts: BeamOptions = {}
): GWU.tween.Tween {
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

    let lastIndex = -1;
    const tween = GWU.tween
        .make({ index: 0 })
        .to({ index: line.length - 1 })
        .duration(duration)
        .onUpdate((vals) => {
            while (lastIndex < vals.index) {
                ++lastIndex;
                const loc = line[lastIndex] || [-1, -1];
                tween.addChild(
                    fadeInOut(map, loc[0], loc[1], sprite, opts.fade)
                );
            }
        });

    return tween;
}

export type ExplosionShape = 'o' | 'x' | 'X' | '+' | '*';

export interface ExplosionOptions {
    speed?: number;
    duration?: number;

    fade?: number;

    shape?: ExplosionShape;
    center?: boolean;
    stepFn?: FxStepFn;
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
    map: Map,
    x: number,
    y: number,
    radius: number,
    sprite: string | GWU.sprite.SpriteConfig,
    opts: ExplosionOptions = {}
): GWU.tween.Tween {
    checkExplosionOpts(opts);

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
                            tween.addChild(
                                fadeInOut(map, x1, y1, sprite, opts.fade)
                            );
                        }
                    }
                }
            }
        })
        .onFinish(() => {
            GWU.grid.free(grid);
        });

    return tween;
}
