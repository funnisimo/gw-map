import {
  flag as Flag,
  utils as Utils,
  color as Color,
  canvas as Canvas,
  types as Types,
} from "gw-utils";

import { Tile as Flags, TileMech as MechFlags, Layer } from "./flags";
import * as Activation from "./activation";
import * as Light from "./light";

export { Flags, MechFlags, Layer };

export interface NameConfig {
  article?: boolean | string;
  color?: boolean | string | Color.ColorBase;
}

export type TileBase = TileConfig | string;

export interface FullTileConfig {
  Extends: string | Tile;

  flags: number | string | any[];
  mechFlags: number | string | any[];
  layer: Layer | keyof typeof Layer;
  priority: number;

  sprite: Canvas.SpriteConfig;
  activates: any;
  light: Light.LightBase | null;

  flavor: string;
  desc: string;
  name: string;
  article: string;
  id: string;

  ch: string | null;
  fg: Color.ColorBase | null;
  bg: Color.ColorBase | null;
  opacity: number;

  dissipate: number; // 20 * 100 = 20%
}

declare type AtLeast<T, K extends keyof T> = Partial<T> & Pick<T, K>;

export type TileConfig = AtLeast<FullTileConfig, "id">;

/** Tile Class */
export class Tile implements Types.TileType {
  public flags = 0;
  public mechFlags = 0;
  public layer: Layer = Layer.GROUND;
  public priority = -1;

  public sprite: Canvas.Sprite = {} as Canvas.Sprite;
  public activates: Record<string, Activation.Activation> = {};
  public light: Light.Light | null = null; // TODO - Light

  public flavor: string | null = null;
  public desc: string | null = null;
  public name: string;
  public article: string | null = null;
  public id: string;

  public dissipate = 2000; // 20 * 100 = 20%

  /**
   * Creates a new Tile object.
   * @param {Object} [config={}] - The configuration of the Tile
   * @param {String|Number|String[]} [config.flags=0] - Flags and MechFlags for the tile
   * @param {String} [config.layer=GROUND] - Name of the layer for this tile
   * @param {String} [config.ch] - The sprite character
   * @param {String} [config.fg] - The sprite foreground color
   * @param {String} [config.bg] - The sprite background color
   */
  constructor(config: TileConfig, base?: Tile) {
    if (base !== undefined) {
      Utils.assignOmitting(["activates"], this, base);
    }
    Utils.assignOmitting(
      [
        "Extends",
        "extends",
        "flags",
        "mechFlags",
        "sprite",
        "activates",
        "ch",
        "fg",
        "bg",
        "light",
      ],
      this,
      config
    );
    this.name = config.name || (base ? base.name : config.id);
    this.id = config.id;

    this.layer = this.layer || Layer.GROUND;
    if (typeof this.layer === "string") {
      this.layer = Layer[this.layer as keyof typeof Layer];
    }

    if (this.priority < 0) {
      this.priority = 50;
    }

    this.flags = Flag.from(Flags, this.flags, config.flags);
    this.mechFlags = Flag.from(
      MechFlags,
      this.mechFlags,
      config.mechFlags || config.flags
    );

    if (config.light) {
      // Light.from will throw an Error on invalid config
      this.light = Light.from(config.light);
    }

    if (config.sprite) {
      this.sprite = Canvas.makeSprite(config.sprite);
    } else if (config.ch || config.fg || config.bg) {
      this.sprite = Canvas.makeSprite(
        config.ch || null,
        config.fg || null,
        config.bg || null,
        config.opacity
      );
    }

    if (base && base.activates) {
      Object.assign(this.activates, base.activates);
    }
    if (config.activates) {
      Object.entries(config.activates).forEach(([key, info]) => {
        if (info) {
          const activation = Activation.make(info)!;
          this.activates[key] = activation;
        } else {
          delete this.activates[key];
        }
      });
    }
  }

  /**
   * Returns the flags for the tile after the given event is fired.
   * @param {string} id - Name of the event to fire.
   * @returns {number} The flags from the Tile after the event.
   */
  successorFlags(id: string): number {
    const e = this.activates[id];
    if (!e) return 0;
    const tileId = e.tile;
    if (!tileId) return 0;
    const tile = tiles[tileId];
    if (!tile) return 0;
    return tile.flags;
  }

  /**
   * Returns whether or not this tile as the given flag.
   * Will return true if any bit in the flag is true, so testing with
   * multiple flags will return true if any of them is set.
   * @param {number} flag - The flag to check
   * @returns {boolean} Whether or not the flag is set
   */
  hasFlag(flag: number): boolean {
    return (this.flags & flag) > 0;
  }

  hasMechFlag(flag: number) {
    return (this.mechFlags & flag) > 0;
  }

  hasFlags(flags: number, mechFlags: number) {
    return (
      (!flags || this.flags & flags) &&
      (!mechFlags || this.mechFlags & mechFlags)
    );
  }

  activatesOn(name: string) {
    return !!this.activates[name];
  }

  getName(): string;
  getName(opts: NameConfig): string;
  getName(article: string): string;
  getName(article: boolean): string;
  getName(arg?: any) {
    let opts: NameConfig = {};
    if (arg === true || arg === false) {
      opts.article = arg;
    } else if (typeof arg === "string") {
      opts.article = arg;
    } else if (arg) {
      opts = arg;
    }

    if (!opts.article && !opts.color) return this.name;

    let result = this.name;
    if (opts.color) {
      let color: Color.ColorBase = opts.color as Color.ColorBase;
      if (opts.color === true) {
        color = this.sprite.fg;
      }
      if (typeof color !== "string") {
        color = Color.from(color).toString();
      }
      result = `Ω${color}Ω${this.name}∆`;
    }

    if (opts.article) {
      let article =
        typeof opts.article === "string" ? opts.article : this.article || "a";
      result = article + " " + result;
    }
    return result;
  }

  getDescription(opts: any = {}) {
    return this.getName(opts);
  }

  //   getFlavor() {
  //     return this.flavor || this.getName(true);
  //   }

  //   async applyInstantEffects(map, x, y, cell) {
  //     const actor = cell.actor;
  //     const isPlayer = actor ? actor.isPlayer() : false;

  //     if (this.flags & Flags.Tile.T_LAVA && actor) {
  //       if (!cell.hasTileFlag(Flags.Tile.T_BRIDGE) && !actor.status.levitating) {
  //         actor.kill();
  //         await Game.gameOver(false, "ΩredΩyou fall into lava and perish.");
  //         return true;
  //       }
  //     }

  //     return false;
  //   }
}

// Types.Tile = Tile;

export const tiles: Record<string, Tile> = {};

/**
 * Adds a new Tile into the GW.tiles collection.
 * @param {String} [id] - The identifier for this Tile
 * @param {Tile|string} [base] - The base tile from which to extend (id or object)
 * @param {Object} config - The tile configuration
 * @returns {Tile} The newly created tile
 */
export function install(
  id: string,
  base: string | Tile,
  config: Partial<TileConfig>
): Tile;
export function install(id: string, config: Partial<TileConfig>): Tile;
export function install(config: Partial<TileConfig>): Tile;
export function install(...args: any[]) {
  let id = args[0];
  let base = args[1];
  let config = args[2];

  if (arguments.length == 1) {
    config = args[0];
    base = config.Extends || {};
    id = config.id;
  } else if (arguments.length == 2) {
    config = base;
    base = config.Extends || config.extends || {};
  }

  if (typeof base === "string") {
    base = tiles[base] || Utils.ERROR("Unknown base tile: " + base);
  }

  // config.name = config.name || base.name || id.toLowerCase();
  config.id = id;
  const tile = new Tile(config, base);
  tiles[id] = tile;
  return tile;
}

/**
 * Adds multiple tiles to the GW.tiles collection.
 * It extracts all the id:opts pairs from the config object and uses
 * them to call addTileKind.
 * @param {Object} config - The tiles to add in [id, config] pairs
 * @returns {void} Nothing
 * @see addTileKind
 */
export function installAll(config: Record<string, Partial<TileConfig>>): void {
  Object.entries(config).forEach(([id, opts]) => {
    opts.id = id;
    install(id, opts);
  });
}
