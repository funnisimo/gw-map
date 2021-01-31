import { color as Color, sprite as Sprite, types as Types } from 'gw-utils';
import { Tile } from './tile';
import * as Map from './map';
import * as Layer from './entity';
import { Cell as Flags, CellMech as MechFlags, TileMech as TileMechFlags, Tile as TileFlags, Layer as LayerFlags, Depth } from './flags';
export { Flags, MechFlags };
export declare class CellMemory {
    mixer: Sprite.Mixer;
    item: Types.ItemType | null;
    itemQuantity: number;
    actor: Types.ActorType | null;
    tile: Tile | null;
    cellFlags: number;
    cellMechFlags: number;
    layerFlags: number;
    tileFlags: number;
    tileMechFlags: number;
    constructor();
    clear(): void;
    copy(other: CellMemory): void;
}
export declare type TileBase = Tile | string;
interface LayerItem {
    layer: Types.EntityType;
    next: LayerItem | null;
}
declare type LayerTile = Tile | null;
export declare class Cell implements Types.CellType {
    _tiles: LayerTile[];
    layers: LayerItem | null;
    protected _actor: Types.ActorType | null;
    protected _item: Types.ItemType | null;
    data: any;
    flags: Flags;
    mechFlags: MechFlags;
    gasVolume: number;
    liquidVolume: number;
    machineNumber: number;
    memory: CellMemory;
    light: [number, number, number];
    oldLight: [number, number, number];
    glowLight: [number, number, number];
    constructor();
    copy(other: Cell): void;
    clear(): void;
    clearLayers(nullLiquid?: boolean, nullSurface?: boolean, nullGas?: boolean): void;
    get ground(): string | null;
    get liquid(): string | null;
    get surface(): string | null;
    get gas(): string | null;
    get groundTile(): Tile;
    get liquidTile(): Tile;
    get surfaceTile(): Tile;
    get gasTile(): Tile;
    dump(): string;
    get changed(): boolean;
    set changed(v: boolean);
    isVisible(): number;
    isAnyKindOfVisible(): number;
    isOrWasAnyKindOfVisible(): number;
    isRevealed(orMapped?: boolean): boolean;
    listInSidebar(): boolean;
    get needsRedraw(): boolean;
    set needsRedraw(v: boolean);
    hasVisibleLight(): boolean;
    isDark(darkColor?: Color.Color | [number, number, number]): boolean;
    get lightChanged(): boolean;
    set lightChanged(v: boolean);
    tile(layer?: Layer.Depth): Tile;
    volume(layer?: Layer.Depth): number;
    setVolume(layer: Depth, volume?: number): void;
    tiles(): Generator<Tile>;
    layerFlags(limitToPlayerKnowledge?: boolean): number;
    tileFlags(limitToPlayerKnowledge?: boolean): number;
    tileMechFlags(limitToPlayerKnowledge?: boolean): number;
    hasLayerFlag(flag: LayerFlags, limitToPlayerKnowledge?: boolean): boolean;
    hasAllLayerFlags(flag: LayerFlags, limitToPlayerKnowledge?: boolean): boolean;
    hasTileFlag(flagMask: TileFlags, limitToPlayerKnowledge?: boolean): boolean;
    hasAllTileFlags(flags: TileFlags, limitToPlayerKnowledge?: boolean): boolean;
    hasTileMechFlag(flagMask: TileMechFlags, limitToPlayerKnowledge?: boolean): boolean;
    hasAllTileMechFlags(flags: TileMechFlags, limitToPlayerKnowledge?: boolean): boolean;
    setFlags(cellFlag?: Flags, cellMechFlag?: MechFlags): void;
    clearFlags(cellFlag?: Flags, cellMechFlag?: MechFlags): void;
    hasFlag(flag: Flags, limitToPlayerKnowledge?: boolean): boolean;
    hasMechFlag(flag: MechFlags, limitToPlayerKnowledge?: boolean): boolean;
    hasTile(tile: string | Tile): boolean;
    topmostTile(skipGas?: boolean): Tile;
    tileWithLayerFlag(layerFlag: number): LayerTile;
    tileWithFlag(tileFlag: number): LayerTile;
    tileWithMechFlag(mechFlag: number): LayerTile;
    tileDesc(): string | null;
    tileFlavor(): string | null;
    getName(opts?: {}): string;
    isClear(): boolean;
    isEmpty(): boolean;
    isMoveableNow(limitToPlayerKnowledge?: boolean): boolean;
    isWalkableNow(limitToPlayerKnowledge?: boolean): boolean;
    canBeWalked(limitToPlayerKnowledge?: boolean): boolean;
    isWall(limitToPlayerKnowledge?: boolean): boolean;
    isObstruction(limitToPlayerKnowledge?: boolean): boolean;
    isDoorway(limitToPlayerKnowledge?: boolean): boolean;
    isSecretDoorway(limitToPlayerKnowledge?: boolean): boolean;
    blocksPathing(limitToPlayerKnowledge?: boolean): boolean;
    blocksVision(): boolean;
    isLiquid(limitToPlayerKnowledge?: boolean): boolean;
    hasGas(limitToPlayerKnowledge?: boolean): boolean;
    markRevealed(): boolean;
    obstructsLayer(depth: Depth): boolean;
    setTile(tileId?: TileBase | null, volume?: number, map?: Map.Map): true | void;
    clearLayer(depth: Depth): void;
    clearLayersExcept(except?: Depth, ground?: string | null): void;
    clearLayersWithFlags(tileFlags: number, tileMechFlags?: number): void;
    activate(name: string, ctx?: any): Promise<boolean>;
    activatesOn(name: string): boolean;
    get item(): Types.ItemType | null;
    set item(item: Types.ItemType | null);
    get actor(): Types.ActorType | null;
    set actor(actor: Types.ActorType | null);
    addLayer(layer: Types.EntityType): void;
    removeLayer(layer: Types.EntityType): boolean;
    storeMemory(): void;
}
export declare function make(tile?: string): Cell;
export declare function getAppearance(cell: Cell, dest: Sprite.Mixer): boolean;
