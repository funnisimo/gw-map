import { utils as Utils, grid as Grid, color as Color, canvas as Canvas, types as Types, buffer as Buffer } from "gw-utils";
import * as Cell from "./cell";
import * as Tile from "./tile";
import { Map as Flags, Cell as CellFlags, Tile as TileFlags, CellMech as CellMechFlags, TileMech as TileMechFlags, Depth as TileLayer, Layer as LayerFlags } from "./flags";
import * as Light from "./light";
export { Flags };
export interface MapDrawOptions {
    x: number;
    y: number;
    width: number;
    height: number;
    mapOffsetX: number;
    mapOffsetY: number;
    force: boolean;
}
export declare type MapEachFn = (cell: Cell.Cell, x: number, y: number, map: Map) => void;
export declare type MapMatchFn = (cell: Cell.Cell, x: number, y: number, map: Map) => boolean;
export declare type MapCostFn = (cell: Cell.Cell, x: number, y: number, map: Map) => number;
export interface MapMatchOptions {
    hallways: boolean;
    blockingMap: Grid.NumGrid;
    liquids: boolean;
    match: MapMatchFn;
    forbidCellFlags: number;
    forbidTileFlags: number;
    forbidTileMechFlags: number;
    tile: Tile.Tile;
    deterministic: boolean;
}
interface LightInfo extends Utils.Chainable {
    light: Types.LightType;
    x: number;
    y: number;
    next: LightInfo | null;
}
export declare type MapLightFn = (light: Types.LightType, x: number, y: number) => void;
export interface DisruptsOptions {
    gridOffsetX: number;
    gridOffsetY: number;
    bounds: Types.Bounds | null;
}
export declare class Map implements Types.MapType {
    protected _width: number;
    protected _height: number;
    cells: Grid.Grid<Cell.Cell>;
    locations: any;
    config: any;
    protected _actors: any | null;
    protected _items: any | null;
    flags: number;
    ambientLight: Color.Color;
    lights: LightInfo | null;
    id: string;
    events: any;
    constructor(w: number, h: number, opts?: any);
    get width(): number;
    get height(): number;
    start(): Promise<void>;
    clear(): void;
    dump(fmt?: (cell: Cell.Cell) => string): void;
    cell(x: number, y: number): Cell.Cell;
    eachCell(fn: MapEachFn): void;
    forEach(fn: MapEachFn): void;
    forRect(x: number, y: number, w: number, h: number, fn: MapEachFn): void;
    eachNeighbor(x: number, y: number, fn: MapEachFn, only4dirs?: boolean): void;
    count(fn: MapMatchFn): number;
    hasXY(x: number, y: number): boolean;
    isBoundaryXY(x: number, y: number): boolean;
    get changed(): boolean;
    set changed(v: boolean);
    hasCellFlag(x: number, y: number, flag: CellFlags): number;
    hasCellMechFlag(x: number, y: number, flag: CellMechFlags): number;
    hasLayerFlag(x: number, y: number, flag: LayerFlags): boolean;
    hasTileFlag(x: number, y: number, flag: TileFlags): boolean;
    hasTileMechFlag(x: number, y: number, flag: TileMechFlags): boolean;
    redrawCell(cell: Cell.Cell): void;
    redrawXY(x: number, y: number): void;
    redrawAll(): void;
    drawInto(canvas: Canvas.Canvas | Buffer.DataBuffer, opts?: Partial<MapDrawOptions> | boolean): void;
    revealAll(): void;
    markRevealed(x: number, y: number): void;
    isVisible(x: number, y: number): number;
    isAnyKindOfVisible(x: number, y: number): number;
    isOrWasAnyKindOfVisible(x: number, y: number): number;
    get anyLightChanged(): boolean;
    set anyLightChanged(v: boolean);
    get ambientLightChanged(): boolean;
    set ambientLightChanged(v: boolean);
    get staticLightChanged(): boolean;
    set staticLightChanged(v: boolean);
    setFlag(flag: number): void;
    setFlags(mapFlag?: number, cellFlag?: number, cellMechFlag?: number): void;
    clearFlag(flag: number): void;
    clearFlags(mapFlag?: number, cellFlag?: number, cellMechFlag?: number): void;
    setCellFlags(x: number, y: number, cellFlag?: number, cellMechFlag?: number): void;
    clearCellFlags(x: number, y: number, cellFlags?: number, cellMechFlags?: number): void;
    hasTile(x: number, y: number, tile: string): boolean;
    layerFlags(x: number, y: number, limitToPlayerKnowledge?: boolean): number;
    tileFlags(x: number, y: number, limitToPlayerKnowledge?: boolean): number;
    tileMechFlags(x: number, y: number, limitToPlayerKnowledge?: boolean): number;
    tileWithFlag(x: number, y: number, flag?: number): Tile.Tile | null;
    tileWithMechFlag(x: number, y: number, mechFlag?: number): Tile.Tile | null;
    hasKnownTileFlag(x: number, y: number, flagMask?: number): number;
    isClear(x: number, y: number): boolean;
    isEmpty(x: number, y: number): boolean;
    isObstruction(x: number, y: number, limitToPlayerKnowledge?: boolean): boolean;
    isDoorway(x: number, y: number, limitToPlayerKnowledge?: boolean): boolean;
    isSecretDoorway(x: number, y: number, limitToPlayerKnowledge?: boolean): boolean;
    isLiquid(x: number, y: number, limitToPlayerKnowledge?: boolean): boolean;
    hasGas(x: number, y: number, limitToPlayerKnowledge?: boolean): boolean;
    blocksPathing(x: number, y: number, limitToPlayerKnowledge?: boolean): boolean;
    blocksVision(x: number, y: number): boolean;
    isMoveableNow(x: number, y: number, limitToPlayerKnowledge?: boolean): boolean;
    isWalkableNow(x: number, y: number, limitToPlayerKnowledge?: boolean): boolean;
    canBeWalked(x: number, y: number, limitToPlayerKnowledge?: boolean): boolean;
    topmostTile(x: number, y: number, skipGas?: boolean): Tile.Tile;
    tileFlavor(x: number, y: number): string | null;
    setTile(x: number, y: number, tileId: Cell.TileBase | null, volume?: number): true | void;
    clearCell(x: number, y: number): void;
    clearCellLayersWithFlags(x: number, y: number, tileFlags: TileFlags, tileMechFlags?: TileMechFlags): void;
    clearCellLayers(x: number, y: number, nullLiquid?: boolean, nullSurface?: boolean, nullGas?: boolean): void;
    fill(tileId: string | null, boundaryTile?: string | null): void;
    neighborCount(x: number, y: number, matchFn: MapMatchFn, only4dirs?: boolean): number;
    walkableArcCount(x: number, y: number): number;
    diagonalBlocked(x1: number, y1: number, x2: number, y2: number, limitToPlayerKnowledge?: boolean): boolean;
    fillCostGrid(costGrid: Grid.NumGrid, costFn?: MapCostFn): void;
    matchingNeighbor(x: number, y: number, matcher: MapMatchFn, only4dirs?: boolean): Utils.Loc;
    matchingLocNear(x: number, y: number, opts: Partial<MapMatchOptions>): Utils.Loc;
    matchingLocNear(x: number, y: number, matcher: MapMatchFn, opts?: Partial<MapMatchOptions>): Utils.Loc;
    randomMatchingLoc(opts: Partial<MapMatchOptions>): Utils.Loc;
    randomMatchingLoc(match: MapMatchFn): Utils.Loc;
    hasVisibleLight(x: number, y: number): boolean;
    addStaticLight(x: number, y: number, light: Light.Light): LightInfo;
    removeStaticLight(x: number, y: number, light?: Light.Light): void;
    eachStaticLight(fn: MapLightFn): void;
    eachDynamicLight(fn: MapLightFn): void;
    addFx(x: number, y: number, anim: Types.FxType): boolean;
    moveFx(x: number, y: number, anim: Types.FxType): boolean;
    removeFx(anim: Types.FxType): boolean;
    actorAt(x: number, y: number): Types.ActorType | null;
    addActor(x: number, y: number, theActor: Types.ActorType): boolean;
    addActorNear(x: number, y: number, theActor: Types.ActorType): boolean;
    moveActor(x: number, y: number, actor: Types.ActorType): boolean;
    removeActor(actor: Types.ActorType): boolean;
    deleteActorAt(x: number, y: number): boolean;
    itemAt(x: number, y: number): Types.ItemType | null;
    addItem(x: number, y: number, theItem: Types.ItemType): boolean;
    addItemNear(x: number, y: number, theItem: Types.ItemType): boolean;
    removeItem(theItem: Types.ItemType): boolean;
    gridDisruptsWalkability(blockingGrid: Grid.NumGrid, opts?: Partial<DisruptsOptions>): boolean;
    calcFov(grid: Grid.NumGrid, x: number, y: number, maxRadius: number, forbiddenCellFlags?: number, forbiddenLayerFlags?: LayerFlags): void;
    losFromTo(a: Utils.XY, b: Utils.XY): boolean;
    storeMemory(x: number, y: number): void;
    storeMemories(): void;
    tick(): Promise<void>;
    resetCellEvents(): void;
}
export declare function make(w: number, h: number, floor: string, wall: string): Map;
export declare function make(w: number, h: number, floor: string): Map;
export declare function make(w: number, h: number, opts?: any): Map;
export declare function from(prefab: string | string[], charToTile: Record<string, Cell.TileBase | null>): Map;
export declare function getCellAppearance(map: Map, x: number, y: number, dest: Canvas.Mixer): void;
export declare function addText(map: Map, x: number, y: number, text: string, fg: Color.ColorBase | null, bg: Color.ColorBase | null, layer?: TileLayer): void;
export declare function updateGas(map: Map): void;
export declare function updateLiquid(map: Map): void;
