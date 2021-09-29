import * as GWU from 'gw-utils';

import { Actor } from '../actor';
import { Item } from '../item';
import { Tile } from '../tile';
import { EffectCtx } from '../effect/types';
import { StatusDrawer } from '../entity/types';

export interface CellFlags {
    cell: number;
}

export interface MapFlags {
    map: number;
}

export interface SetOptions {
    superpriority: boolean;
    blockedByOtherLayers: boolean;
    blockedByActors: boolean;
    blockedByItems: boolean;
    volume: number;
    machine: number;
}

export type SetTileOptions = Partial<SetOptions>;

export type TileData = Tile | null;
export type TileArray = [Tile, ...TileData[]];

export interface CellInfoType {
    readonly flags: CellFlags;

    readonly chokeCount: number;
    readonly machineId: number;
    // keyId: number;
    readonly needsRedraw: boolean;
    readonly x: number;
    readonly y: number;
    readonly map: MapType;
    readonly tiles: TileArray;
    readonly actor: Actor | null;
    readonly item: Item | null;

    // Flags

    hasCellFlag(flag: number): boolean;
    hasTileFlag(flag: number): boolean;
    hasAllTileFlags(flags: number): boolean;
    hasEntityFlag(flag: number, withEntities?: boolean): boolean;
    hasAllEntityFlags(flags: number, withEntities?: boolean): boolean;
    hasTileMechFlag(flag: number): boolean;

    cellFlags(): number;
    entityFlags(): number;
    tileFlags(): number;
    tileMechFlags(): number;

    blocksVision(): boolean;
    blocksPathing(): boolean;
    blocksMove(): boolean;
    blocksEffects(): boolean;

    isWall(): boolean;
    isStairs(): boolean;
    isFloor(): boolean;
    isPassable(): boolean;
    isSecretlyPassable(): boolean;
    isNull(): boolean;
    isGateSite(): boolean;

    // Tiles

    depthPriority(depth: number): number;
    highestPriority(): number;
    blocksLayer(depth: number): boolean;
    depthTile(depth: number): Tile | null;
    hasTile(tile: string | number | Tile): boolean;
    eachTile(cb: GWU.types.EachCb<Tile>): void;

    hasDepthTile(depth: number): boolean;
    highestPriorityTile(): Tile;

    hasTileTag(tag: string): boolean;
    hasAllTileTags(tags: string[]): boolean;
    hasAnyTileTag(tags: string[]): boolean;

    // Items

    hasItem(): boolean;
    // readonly item: Item | null;

    // Actors

    hasActor(): boolean;
    hasPlayer(): boolean;
    // readonly actor: Actor | null;

    // Lights

    eachGlowLight(cb: (light: GWU.light.LightType) => any): void;

    // Info

    hasEffect(name: string): boolean;
    needsToFire(): boolean;
    willFire(name: string): boolean;

    readonly hasStableSnapshot: boolean;
    getSnapshot(mixer: GWU.sprite.Mixer): void;
    putSnapshot(mixer: GWU.sprite.Mixer): void;

    readonly hasStableMemory: boolean;

    drawStatus(sidebar: StatusDrawer): void;

    getDescription(): string;
    getFlavor(): string;
    getName(opts: any): string;
}

export interface CellType extends CellInfoType {
    // actor: Actor | null;
    // item: Item | null;
    chokeCount: number;
    machineId: number;

    setCellFlag(flag: number): void;
    clearCellFlag(flag: number): void;

    // @returns - whether or not the change results in a change to the cell lighting.
    setTile(tile: Tile, opts?: SetTileOptions): boolean;
    clear(tile?: number | string | Tile): void;
    clearDepth(depth: number): boolean;

    clearTiles(tile?: string | number | Tile): void;

    addItem(item: Item, withEffects?: boolean): void;
    removeItem(item: Item, withEffects?: boolean): boolean;

    addActor(actor: Actor, withEffects?: boolean): void;
    removeActor(actor: Actor, withEffects?: boolean): boolean;

    // Effects

    fireEvent(event: string, ctx?: Partial<EffectCtx>): Promise<boolean>;
    fireAll(): Promise<boolean>;
    clearEvents(): void;

    copy(other: CellInfoType): void;
    needsRedraw: boolean;
    readonly changed: boolean;
}

export type EachCellCb = (
    cell: CellType,
    x: number,
    y: number,
    map: MapType
) => any;

export type EachItemCb = (item: Item) => any;
export type EachActorCb = (actor: Actor) => any;

export type MapTestFn = (
    cell: CellType,
    x: number,
    y: number,
    map: MapType
) => boolean;

export interface MapType extends GWU.fov.FovSite {
    readonly width: number;
    readonly height: number;
    readonly rng: GWU.rng.Random;
    readonly id: string;
    actors: Actor[];
    items: Item[];

    light: GWU.light.LightSystemType;
    // fov: GWU.fov.FovSystemType;
    properties: Record<string, any>;

    hasXY(x: number, y: number): boolean;
    isBoundaryXY(x: number, y: number): boolean;

    // memory(x: number, y: number): CellInfoType;
    cell(x: number, y: number): CellType;
    get(x: number, y: number): CellType | undefined;
    eachCell(cb: EachCellCb): void;

    // Items

    // itemAt(x: number, y: number): Item | null;
    eachItem(cb: EachItemCb): void;

    addItem(
        x: number,
        y: number,
        item: Item,
        fireEffects: boolean
    ): boolean | Promise<boolean>;
    addItem(x: number, y: number, item: Item): boolean;

    removeItem(item: Item, fireEffects: boolean): boolean | Promise<boolean>;
    removeItem(item: Item): boolean;

    // moveItem(item: Item, dir: GWU.xy.Loc | number): Promise<boolean>;
    itemAt(x: number, y: number): Item | null;

    // Actors

    // actorAt(x: number, y: number): Actor | null;
    eachActor(cb: EachActorCb): void;

    addActor(
        x: number,
        y: number,
        actor: Actor,
        fireEffects: boolean
    ): boolean | Promise<boolean>;
    addActor(x: number, y: number, actor: Actor): boolean;

    removeActor(actor: Actor, fireEffects: boolean): boolean | Promise<boolean>;
    removeActor(actor: Actor): boolean;

    // moveActor(actor: Actor, dir: GWU.xy.Loc | number): Promise<boolean>;
    actorAt(x: number, y: number): Actor | null;

    // Information

    // isVisible(x: number, y: number): boolean;
    hasKey(x: number, y: number): boolean;

    // flags

    hasMapFlag(flag: number): boolean;
    setMapFlag(flag: number): void;
    clearMapFlag(flag: number): void;

    setCellFlag(x: number, y: number, flag: number): void;
    clearCellFlag(x: number, y: number, flag: number): void;

    fill(tile: string, boundary?: string): void;

    hasTile(x: number, y: number, tile: string | number | Tile): boolean;
    setTile(
        x: number,
        y: number,
        tile: string | number | Tile,
        opts?: SetTileOptions
    ): boolean;

    tick(dt: number): Promise<boolean>;
    fire(
        event: string,
        x: number,
        y: number,
        ctx?: Partial<EffectCtx>
    ): Promise<boolean>;
    fireAll(event: string, ctx?: Partial<EffectCtx>): Promise<boolean>;

    activateMachine(
        machineId: number,
        originX: number,
        originY: number,
        ctx?: Partial<EffectCtx>
    ): Promise<boolean>;

    count(cb: MapTestFn): number;
    dump(fmt?: (cell: CellType) => string): void;

    getAppearanceAt(x: number, y: number, dest: GWU.sprite.Mixer): void;
}
