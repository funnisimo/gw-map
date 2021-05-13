import {
    utils as Utils,
    range as Range,
    grid as Grid,
    color as Color,
    data as DATA,
    config as CONFIG,
    types as Types,
    make as Make,
} from 'gw-utils';
import * as Flags from './mapFlags';
import * as Cell from './cell';
import * as Map from './map';

// const LIGHT_SMOOTHING_THRESHOLD = 150;       // light components higher than this magnitude will be toned down a little

export const config = (CONFIG.light = { INTENSITY_DARK: 20 }); // less than 20% for highest color in rgb

const LIGHT_COMPONENTS = Color.make();

export class Light implements Types.LightType {
    public color: Color.Color;
    public radius: Range.Range;
    public fadeTo = 0;
    public passThroughActors = false;
    public id: string | null = null;

    constructor(
        color: Color.ColorBase,
        range: string | Range.Range,
        fadeTo: number,
        pass = false
    ) {
        this.color = Color.from(color) || null; /* color */
        this.radius = Range.make(range || 1);
        this.fadeTo = fadeTo || 0;
        this.passThroughActors = pass; // generally no, but miner light does (TODO - string parameter?  'false' or 'true')
    }

    copy(other: Light) {
        this.color = other.color;
        this.radius.copy(other.radius);
        this.fadeTo = other.fadeTo;
        this.passThroughActors = other.passThroughActors;
    }

    get intensity() {
        return intensity(this.color);
    }

    // Returns true if any part of the light hit cells that are in the player's field of view.
    paint(
        map: Map.Map,
        x: number,
        y: number,
        maintainShadows = false,
        isMinersLight = false
    ) {
        if (!map) return false;

        let k;
        // let colorComponents = [0,0,0];
        let lightMultiplier;

        let radius = this.radius.value();
        let outerRadius = Math.ceil(radius);

        // calcLightComponents(colorComponents, this);
        LIGHT_COMPONENTS.copy(this.color).bake();

        // console.log('paint', LIGHT_COMPONENTS.toString(true), x, y, outerRadius);

        // the miner's light does not dispel IS_IN_SHADOW,
        // so the player can be in shadow despite casting his own light.
        const dispelShadows =
            !isMinersLight &&
            !maintainShadows &&
            intensity(LIGHT_COMPONENTS) > config.INTENSITY_DARK;
        const fadeToPercent = this.fadeTo;

        const grid = Grid.alloc(map.width, map.height, 0);
        map.calcFov(
            grid,
            x,
            y,
            outerRadius,
            this.passThroughActors ? 0 : Flags.Cell.HAS_ANY_ACTOR,
            Flags.Entity.L_BLOCKS_VISION
        );

        let overlappedFieldOfView = false;

        grid.forCircle(x, y, outerRadius, (v, i, j) => {
            if (!v) return;
            const cell = map.cell(i, j);

            lightMultiplier = Math.floor(
                100 -
                    (100 - fadeToPercent) *
                        (Utils.distanceBetween(x, y, i, j) / radius)
            );
            for (k = 0; k < 3; k++) {
                cell.light[k] += Math.floor(
                    (LIGHT_COMPONENTS[k] * lightMultiplier) / 100
                );
            }
            if (dispelShadows) {
                cell.flags.cell &= ~Flags.Cell.IS_IN_SHADOW;
            }
            if (
                cell.flags.cell &
                (Flags.Cell.IN_FOV | Flags.Cell.ANY_KIND_OF_VISIBLE)
            ) {
                overlappedFieldOfView = true;
            }

            // console.log(i, j, lightMultiplier, cell.light);
        });

        if (dispelShadows) {
            const cell = map.cell(x, y);
            cell.flags.cell &= ~Flags.Cell.IS_IN_SHADOW;
        }

        Grid.free(grid);
        return overlappedFieldOfView;
    }
}

export function intensity(color: Color.Color | [number, number, number]) {
    return Math.max(color[0], color[1], color[2]);
}

export interface LightConfig {
    color: Color.ColorBase;
    radius: number;
    fadeTo?: number;
    pass?: boolean;
}

export type LightBase = LightConfig | string | any[];

export function make(
    color: Color.ColorBase,
    radius: Range.RangeBase,
    fadeTo?: number,
    pass?: boolean
): Light;
export function make(light: LightBase): Light;
export function make(...args: any[]) {
    if (args.length == 1) {
        const config = args[0];
        if (typeof config === 'string') {
            const cached = lights[config];
            if (cached) return cached;

            const [color, radius, fadeTo, pass] = config
                .split(/[,|]/)
                .map((t) => t.trim());
            return new Light(
                Color.from(color),
                Range.from(radius || 1),
                Number.parseInt(fadeTo || '0'),
                !!pass && pass !== 'false'
            );
        } else if (Array.isArray(config)) {
            const [color, radius, fadeTo, pass] = config;
            return new Light(color, radius, fadeTo, pass);
        } else if (config && config.color) {
            return new Light(
                Color.from(config.color),
                Range.from(config.radius),
                Number.parseInt(config.fadeTo || '0'),
                config.pass
            );
        } else {
            throw new Error('Unknown Light config - ' + config);
        }
    } else {
        const [color, radius, fadeTo, pass] = args;
        return new Light(color, radius, fadeTo, pass);
    }
}

Make.light = make;

export const lights: Record<string, Light> = {};

export function from(light: LightBase | Light): Light;
export function from(...args: any[]) {
    if (args.length != 1)
        Utils.ERROR('Unknown Light config: ' + JSON.stringify(args));
    const arg = args[0];
    if (arg instanceof Light) return arg;
    if (typeof arg === 'string') {
        const cached = lights[arg];
        if (cached) return cached;
    }
    return make(arg);
}

// TODO - USE STRINGS FOR LIGHT SOURCE IDS???
//      - addLightKind(id, source) { LIIGHT_SOURCES[id] = source; }
//      - lights = {};
export function install(
    id: string,
    color: Color.ColorBase,
    radius: Range.RangeBase,
    fadeTo?: number,
    pass?: boolean
): Light;
export function install(id: string, base: LightBase): Light;
export function install(id: string, config: LightConfig): Light;
export function install(id: string, ...args: any[]) {
    let source;
    if (args.length == 1) {
        source = make(args[0]);
    } else {
        source = make(args[0], args[1], args[2], args[3]);
    }
    lights[id] = source;
    if (source) source.id = id;
    return source;
}

export function installAll(
    config: Record<string, LightConfig | LightBase> = {}
) {
    const entries = Object.entries(config);
    entries.forEach(([name, info]) => {
        install(name, info);
    });
}

// export function calcLightComponents(colorComponents, theLight) {
// 	const randComponent = cosmetic.range(0, theLight.color.rand);
// 	colorComponents[0] = randComponent + theLight.color.red + cosmetic.range(0, theLight.color.redRand);
// 	colorComponents[1] = randComponent + theLight.color.green + cosmetic.range(0, theLight.color.greenRand);
// 	colorComponents[2] = randComponent + theLight.color.blue + cosmetic.range(0, theLight.color.blueRand);
// }

function updateDisplayDetail(map: Map.Map) {
    map.eachCell((cell: Cell.Cell, _i: number, _j: number) => {
        // clear light flags
        cell.flags.cell &= ~(Flags.Cell.CELL_LIT | Flags.Cell.CELL_DARK);

        if (cell.light.some((v, i) => v !== cell.oldLight[i])) {
            cell.lightChanged = true;
        }

        if (cell.isDark()) {
            cell.flags.cell |= Flags.Cell.CELL_DARK;
        } else if (!(cell.flags.cell & Flags.Cell.IS_IN_SHADOW)) {
            cell.flags.cell |= Flags.Cell.CELL_LIT;
        }
    });
}

export type LightData = [number, number, number];
export type LightDataGrid = Grid.Grid<LightData>;

// export function backUpLighting(map: Map.Map, lights: LightDataGrid) {
//   let k;
//   map.eachCell((cell, i, j) => {
//     for (k = 0; k < 3; k++) {
//       lights[i][j][k] = cell.light[k];
//     }
//   });
// }

// export function restoreLighting(map: Map.Map, lights: LightDataGrid) {
//   let k;
//   map.eachCell((cell, i, j) => {
//     for (k = 0; k < 3; k++) {
//       cell.light[k] = lights[i][j][k];
//     }
//   });
// }

export function recordOldLights(map: Map.Map) {
    let k;
    map.eachCell((cell) => {
        for (k = 0; k < 3; k++) {
            cell.oldLight[k] = cell.light[k];
            cell.lightChanged = false;
        }
    });
}

export function zeroOutLights(map: Map.Map) {
    let k;
    const light = map.ambientLight ? map.ambientLight : [0, 0, 0];
    map.eachCell((cell, _i, _j) => {
        for (k = 0; k < 3; k++) {
            cell.light[k] = light[k];
        }
        cell.flags.cell |= Flags.Cell.IS_IN_SHADOW;
    });
}

export function recordGlowLights(map: Map.Map) {
    let k;
    map.eachCell((cell) => {
        for (k = 0; k < 3; k++) {
            cell.glowLight[k] = cell.light[k];
        }
    });
}

export function restoreGlowLights(map: Map.Map) {
    let k;
    map.eachCell((cell) => {
        for (k = 0; k < 3; k++) {
            cell.light[k] = cell.glowLight[k];
        }
    });
}

export function updateLighting(map: Map.Map) {
    if (!map.anyLightChanged) return false;
    // Copy Light over oldLight
    recordOldLights(map);

    // and then zero out Light.
    zeroOutLights(map);

    if (!map.staticLightChanged) {
        restoreGlowLights(map);
    } else {
        // GW.debug.log('painting glow lights.');
        // Paint all glowing tiles.
        map.eachStaticLight((light, x, y) => {
            //   const light = lights[id];
            if (light) {
                light.paint(map, x, y);
            }
        });

        recordGlowLights(map);
        map.staticLightChanged = false;
    }

    // Cycle through monsters and paint their lights:
    map.eachDynamicLight((light: Types.LightType, x: number, y: number) => {
        light.paint(map, x, y);
        // if (monst.mutationIndex >= 0 && mutationCatalog[monst.mutationIndex].light != lights['NO_LIGHT']) {
        //     paint(map, mutationCatalog[monst.mutationIndex].light, actor.x, actor.y, false, false);
        // }
        // if (actor.isBurning()) { // monst.status.burning && !(actor.kind.flags & Flags.Actor.AF_FIERY)) {
        // 	paint(map, lights.BURNING_CREATURE, actor.x, actor.y, false, false);
        // }
        // if (actor.isTelepathicallyRevealed()) {
        // 	paint(map, lights['TELEPATHY_LIGHT'], actor.x, actor.y, false, true);
        // }
    });

    // Also paint telepathy lights for dormant monsters.
    // for (monst of map.dormantMonsters) {
    //     if (monsterTelepathicallyRevealed(monst)) {
    //         paint(map, lights['TELEPATHY_LIGHT'], monst.xLoc, monst.yLoc, false, true);
    //     }
    // }

    updateDisplayDetail(map);

    // Miner's light:
    const PLAYER = DATA.player;
    if (PLAYER) {
        const PLAYERS_LIGHT = lights.PLAYERS_LIGHT;
        if (PLAYERS_LIGHT && PLAYERS_LIGHT.radius) {
            PLAYERS_LIGHT.paint(map, PLAYER.x, PLAYER.y, true, true);
        }
    }

    map.anyLightChanged = false;

    // if (PLAYER.status.invisible) {
    //     PLAYER.info.foreColor = playerInvisibleColor;
    // } else if (playerInDarkness()) {
    // 	PLAYER.info.foreColor = playerInDarknessColor;
    // } else if (pmap[PLAYER.xLoc][PLAYER.yLoc].flags & IS_IN_SHADOW) {
    // 	PLAYER.info.foreColor = playerInShadowColor;
    // } else {
    // 	PLAYER.info.foreColor = playerInLightColor;
    // }

    return true;
}

// TODO - Move?
export function playerInDarkness(
    map: Map.Map,
    PLAYER: Utils.XY,
    darkColor?: Color.Color
) {
    const cell = map.cell(PLAYER.x, PLAYER.y);
    return cell.isDark(darkColor);
    // return (
    //   cell.light[0] + 10 < darkColor.r &&
    //   cell.light[1] + 10 < darkColor.g &&
    //   cell.light[2] + 10 < darkColor.b
    // );
}
