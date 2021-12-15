import * as GWU from 'gw-utils';

import { Actor } from '../actor';
import { Item } from '../item';
import { Tile } from '../tile';
import { EffectCtx } from '../effect/effect';
import { Entity } from '../entity';

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
    canAddItem(item: Item): boolean;
    canRemoveItem(item: Item): boolean;

    // Actors

    hasActor(): boolean;
    hasPlayer(): boolean;
    // readonly actor: Actor | null;
    canAddActor(actor: Actor): boolean;
    canRemoveActor(actor: Actor): boolean;

    hasFx(): boolean;

    // Lights

    eachGlowLight(cb: (light: GWU.light.LightType) => any): void;

    // Info

    hasEffect(name: string): boolean;

    readonly hasStableSnapshot: boolean;
    getSnapshot(mixer: GWU.sprite.Mixer): void;
    putSnapshot(mixer: GWU.sprite.Mixer): void;

    readonly hasStableMemory: boolean;

    drawStatus(buffer: GWU.buffer.Buffer, bounds: GWU.xy.Bounds): number;

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

    // addItem(item: Item, withEffects?: boolean): boolean;
    // removeItem(item: Item, withEffects?: boolean): boolean;

    // addActor(actor: Actor, withEffects?: boolean): boolean;
    // removeActor(actor: Actor, withEffects?: boolean): boolean;

    // Effects

    fireEvent(event: string, ctx?: Partial<EffectCtx>): boolean;

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

export interface MapEvents extends GWU.events.Events {
    // add or remove actor
    actor: (map: MapType, actor: Actor, isNew: boolean) => void;

    // add or remove item
    item: (map: MapType, item: Item, isNew: boolean) => void;

    // add or remove fx
    fx: (map: MapType, fx: Entity, isNew: boolean) => void;

    // change cell tiles
    cell: (map: MapType, cell: CellType) => void;
}

export interface MapType extends GWU.fov.FovSite, GWU.tween.Animator {
    readonly width: number;
    readonly height: number;
    readonly rng: GWU.rng.Random;
    readonly properties: Record<string, any>;
    readonly events: GWU.events.EventEmitter<MapEvents>;

    needsRedraw: boolean;

    actors: Actor[];
    items: Item[];

    light: GWU.light.LightSystemType;
    // fov: GWU.fov.FovSystemType;

    hasXY(x: number, y: number): boolean;
    isBoundaryXY(x: number, y: number): boolean;

    // memory(x: number, y: number): CellInfoType;
    cell(x: number, y: number): CellType;
    get(x: number, y: number): CellType | undefined;
    eachCell(cb: EachCellCb): void;

    // Items

    // itemAt(x: number, y: number): Item | null;
    eachItem(cb: EachItemCb): void;

    addItem(x: number, y: number, item: Item, fireEffects?: boolean): boolean;
    removeItem(item: Item, fireEffects?: boolean): boolean;
    moveItem(item: Item, x: number, y: number, fireEffects?: boolean): boolean;

    // moveItem(item: Item, dir: GWU.xy.Loc | number): boolean;
    itemAt(x: number, y: number): Item | null;
    hasItem(x: number, y: number): boolean;

    // Actors

    // actorAt(x: number, y: number): Actor | null;
    eachActor(cb: EachActorCb): void;

    addActor(
        x: number,
        y: number,
        actor: Actor,
        fireEffects?: boolean
    ): boolean;
    removeActor(actor: Actor, fireEffects?: boolean): boolean;
    moveActor(
        actor: Actor,
        x: number,
        y: number,
        fireEffects?: boolean
    ): boolean;

    // moveActor(actor: Actor, dir: GWU.xy.Loc | number): boolean;
    actorAt(x: number, y: number): Actor | null;
    hasActor(x: number, y: number): boolean;

    fxAt(x: number, y: number): Entity | null;
    addFx(x: number, y: number, fx: Entity): boolean;
    removeFx(fx: Entity): boolean;
    moveFx(fx: Entity, x: number, y: number): boolean;

    // Information

    // isVisible(x: number, y: number): boolean;
    hasKey(x: number, y: number): boolean;

    // flags

    hasMapFlag(flag: number): boolean;
    setMapFlag(flag: number): void;
    clearMapFlag(flag: number): void;

    setCellFlag(x: number, y: number, flag: number): void;
    clearCellFlag(x: number, y: number, flag: number): void;

    hasEntityFlag(x: number, y: number, flag: number): boolean;

    fill(tile: string, boundary?: string): void;

    hasTile(x: number, y: number, tile: string | number | Tile): boolean;
    setTile(
        x: number,
        y: number,
        tile: string | number | Tile,
        opts?: SetTileOptions
    ): boolean;

    tick(dt: number): boolean;
    fire(
        event: string,
        x: number,
        y: number,
        ctx?: Partial<EffectCtx>
    ): boolean;
    fireAll(event: string, ctx?: Partial<EffectCtx>): boolean;

    activateMachine(
        machineId: number,
        originX: number,
        originY: number,
        ctx?: Partial<EffectCtx>
    ): boolean;

    count(cb: MapTestFn): number;
    dump(fmt?: (cell: CellType) => string): void;

    getAppearanceAt(x: number, y: number, dest: GWU.sprite.Mixer): void;
}
