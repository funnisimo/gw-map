import { canvas as Canvas, types as Types } from "gw-utils";
import { Tile, Layer } from "./tile";
import { Map } from "./map";
import { Cell as Flags, CellMech as MechFlags } from "./flags";
export { Flags, MechFlags };
export declare class CellMemory {
    mixer: Canvas.Mixer;
    item: Types.ItemType | null;
    itemQuantity: number;
    actor: Types.ActorType | null;
    tile: Tile | null;
    cellFlags: number;
    cellMechFlags: number;
    tileFlags: number;
    tileMechFlags: number;
    constructor();
    nullify(): void;
    copy(other: CellMemory): void;
}
interface SpriteData {
    layer: Layer;
    priority: number;
    sprite: Canvas.SpriteType;
    next: SpriteData | null;
}
export declare class Cell implements Types.CellType {
    layers: [
        string | null,
        string | null,
        string | null,
        string | null
    ];
    sprites: SpriteData | null;
    actor: Types.ActorType | null;
    item: Types.ItemType | null;
    data: any;
    flags: number;
    mechFlags: number;
    gasVolume: number;
    liquidVolume: number;
    machineNumber: number;
    memory: CellMemory;
    light: [number, number, number];
    oldLight: [number, number, number];
    glowLight: [number, number, number];
    constructor();
    copy(other: Cell): void;
    nullify(): void;
    nullifyLayers(nullLiquid?: boolean, nullSurface?: boolean, nullGas?: boolean): void;
    get ground(): string | null;
    get liquid(): string | null;
    get surface(): string | null;
    get gas(): string | null;
    get groundTile(): Tile;
    get liquidTile(): Tile;
    get surfaceTile(): Tile;
    get gasTile(): Tile;
    dump(): string;
    changed(): number;
    isVisible(): number;
    isAnyKindOfVisible(): number;
    isOrWasAnyKindOfVisible(): number;
    isRevealed(orMapped?: boolean): number;
    listInSidebar(): boolean;
    _needsRedraw(): void;
    hasVisibleLight(): boolean;
    isDark(): boolean;
    lightChanged(): number;
    tile(layer?: number): Tile;
    tiles(): Generator<Tile, void, unknown>;
    tileFlags(limitToPlayerKnowledge?: boolean): number;
    tileMechFlags(limitToPlayerKnowledge?: boolean): number;
    hasTileFlag(flagMask?: number, limitToPlayerKnowledge?: boolean): boolean;
    hasAllTileFlags(flags?: number): boolean;
    hasTileMechFlag(flagMask?: number, limitToPlayerKnowledge?: boolean): boolean;
    hasAllTileMechFlags(flags?: number): boolean;
    setFlags(cellFlag?: number, cellMechFlag?: number): void;
    clearFlags(cellFlag?: number, cellMechFlag?: number): void;
    hasFlag(flag?: number, limitToPlayerKnowledge?: boolean): boolean;
    hasMechFlag(flag?: number, limitToPlayerKnowledge?: boolean): boolean;
    hasTile(tile: string | Tile): boolean;
    successorTileFlags(id: string): number;
    promotedTileFlags(): number;
    discoveredTileFlags(): number;
    hasDiscoveredTileFlag(flag: number): number;
    highestPriorityTile(skipGas?: boolean): Tile;
    tileWithFlag(tileFlag: number): Tile | null;
    tileWithMechFlag(mechFlag: number): Tile | null;
    tileDesc(): string | null;
    tileFlavor(): string | null;
    getName(opts?: {}): string;
    isNull(): boolean;
    isEmpty(): boolean;
    isPassableNow(limitToPlayerKnowledge?: boolean): boolean;
    canBePassed(limitToPlayerKnowledge?: boolean): boolean;
    isWall(limitToPlayerKnowledge?: boolean): boolean;
    isObstruction(limitToPlayerKnowledge?: boolean): boolean;
    isDoor(limitToPlayerKnowledge?: boolean): boolean;
    isSecretDoor(limitToPlayerKnowledge?: boolean): boolean;
    blocksPathing(limitToPlayerKnowledge?: boolean): boolean;
    blocksVision(): boolean;
    isLiquid(limitToPlayerKnowledge?: boolean): boolean;
    hasGas(limitToPlayerKnowledge?: boolean): boolean;
    markRevealed(): boolean;
    obstructsLayer(layer: Layer): boolean;
    _setTile(tileId?: Tile | string | null, volume?: number, map?: Map): boolean;
    clearLayer(layer: Layer): void;
    clearLayers(except: Layer, floorTile?: string | null): void;
    nullifyTileWithFlags(tileFlags: number, tileMechFlags?: number): void;
    activate(name: string, ctx?: any): Promise<boolean>;
    activatesOn(name: string): boolean;
    addSprite(layer: Layer, sprite: Canvas.SpriteType, priority?: number): void;
    removeSprite(sprite: Canvas.SpriteType): boolean;
    storeMemory(): void;
}
export declare function make(): Cell;
export declare function getAppearance(cell: Cell, dest: Canvas.Mixer): boolean;
