import 'jest-extended';
import '../test/matchers';
import * as UTILS from '../test/utils';
import * as Map from './gw';
import * as GW from 'gw-utils';

describe('Map', () => {
    beforeEach(() => {
        UTILS.mockRandom();
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    test('constructor', () => {
        const map = GW.make.map(10, 10);
        expect(map.width).toEqual(10);
        expect(map.height).toEqual(10);
        expect(map.id).toBeUndefined();

        expect(map.hasXY(3, 3)).toBeTruthy();
        expect(map.hasXY(30, 3)).toBeFalsy();

        // You need to validate the XY before getting the cell
        expect(map.cell(3, 3)).toBeDefined();
        expect(() => map.cell(30, 3)).toThrow();
    });

    test('constructor with id', () => {
        const map = GW.make.map(10, 10, { id: 1 });
        expect(map.width).toEqual(10);
        expect(map.height).toEqual(10);
        expect(map.id).toEqual(1);
    });

    test('setTile', () => {
        GW.cosmetic.seed(12345);

        const map = GW.make.map(10, 10, { fov: false });
        expect(Map.tiles.FLOOR).toBeDefined();

        map.setTile(2, 2, 'FLOOR');

        const sprite = new GW.sprite.Mixer();
        Map.map.getCellAppearance(map, 2, 2, sprite);
        expect(sprite.ch).toEqual(Map.tiles.FLOOR.sprite.ch);
        expect(sprite.fg).toBakeFrom(Map.tiles.FLOOR.sprite.fg);
        expect(sprite.bg).toBakeFrom(Map.tiles.FLOOR.sprite.bg);

        map.setTile(2, 2, 'DOOR'); // can use tile name too (slower)

        Map.map.getCellAppearance(map, 2, 2, sprite);
        expect(sprite.ch).toEqual(Map.tiles.DOOR.sprite.ch);
        expect(sprite.fg).toBakeFrom(Map.tiles.DOOR.sprite.fg);
        expect(sprite.bg).toBakeFrom(Map.tiles.DOOR.sprite.bg);
    });

    test('getLine', () => {
        const map = GW.make.map(10, 10);
        const line = GW.utils.getLineThru(1, 1, 7, 8, map.width, map.height);
        expect(line).not.toContainEqual([1, 1]);
        expect(line).toContainEqual([7, 8]);
        expect(line).toEqual([
            [2, 2],
            [3, 3],
            [4, 4],
            [4, 5],
            [5, 6],
            [6, 7],
            [7, 8],
            [8, 9],
        ]);
        expect(line.length).toEqual(8);
    });

    test('make - ambient light', () => {
        const a = GW.make.map(10, 10, 'FLOOR');
        expect(a.ambientLight).toEqual(GW.colors.white);

        const b = GW.make.map(10, 10, { tile: 'FLOOR', light: 0xfff });
        expect(b.ambientLight).toEqual(GW.colors.white);

        const c = GW.make.map(10, 10, { tile: 'FLOOR', ambient: 0xf00 });
        expect(c.ambientLight).toEqual(GW.colors.red);

        const d = GW.make.map(10, 10, { tile: 'FLOOR', ambientLight: 0x0f0 });
        expect(d.ambientLight).toEqual(GW.colors.green);
    });

    test('clear', () => {
        const map = GW.make.map(10, 10, 'FLOOR', 'WALL');
        expect(map.hasTile(3, 3, 'FLOOR')).toBeTruthy();
        map.clear();
        expect(map.hasTile(3, 3, 'FLOOR')).toBeTruthy();
        expect(map.changed).toBeTruthy();
        map.changed = false;

        map.clear('WALL');
        expect(map.hasTile(3, 3, 'FLOOR')).toBeFalsy();
        expect(map.changed).toBeTruthy();
    });

    test('dump', () => {
        jest.spyOn(console, 'log').mockReturnValue(undefined);

        const map = GW.make.map(10, 10, 'WALL');
        map.dump();
        expect(console.log).toHaveBeenCalled();

        // @ts-ignore
        console.log.mockClear();
        const fmt = jest.fn().mockReturnValue(' ');
        map.dump(fmt);
        expect(fmt).toHaveBeenCalledTimes(100);
        expect(console.log).toHaveBeenCalled();
    });

    test('changed', () => {
        const map = GW.make.map(10, 10, 'FLOOR');
        expect(map.changed).toBeFalsy();
        expect(map.flags.map & Map.map.Flags.MAP_CHANGED).toBeFalsy();
        map.changed = true;
        expect(map.changed).toBeTruthy();
        expect(map.flags.map & Map.map.Flags.MAP_CHANGED).toBeTruthy();
        map.changed = false;
        expect(map.changed).toBeFalsy();
        expect(map.flags.map & Map.map.Flags.MAP_CHANGED).toBeFalsy();
    });

    test('has-XXX-Flag', () => {
        const map = GW.make.map(10, 10, 'FLOOR', 'WALL');
        map.setTile(3, 3, 'UP_STAIRS');
        map.setCellFlags(3, 3, 0, Map.cell.MechFlags.IS_CHOKEPOINT);

        expect(map.hasCellFlag(3, 3, Map.cell.Flags.CELL_CHANGED)).toBeTruthy();
        expect(
            map.hasCellMechFlag(3, 3, Map.cell.MechFlags.IS_CHOKEPOINT)
        ).toBeTruthy();

        expect(
            map.hasLayerFlag(3, 3, Map.entity.Flags.L_BLOCKS_SURFACE)
        ).toBeTruthy();
        expect(map.hasTileFlag(3, 3, Map.tile.Flags.T_HAS_STAIRS)).toBeTruthy();
        // expect(
        //   map.hasTileMechFlag(3, 3, Map.tile.MechFlags.TM_LIST_IN_SIDEBAR)
        // ).toBeTruthy();
    });

    test('redrawCell', () => {
        const map = GW.make.map(10, 10, 'FLOOR');
        expect(map.cell(3, 3).needsRedraw).toBeTruthy();
        map.cell(3, 3).needsRedraw = false;

        map.redrawXY(3, 3);
        expect(map.cell(3, 3).needsRedraw).toBeTruthy();

        map.cell(3, 3).needsRedraw = false;
        map.redrawCell(map.cell(3, 3));
        expect(map.cell(3, 3).needsRedraw).toBeTruthy();
    });

    test('redrawAll', () => {
        const map: Map.map.Map = GW.make.map(10, 10, 'FLOOR');
        map.clearFlags(0, Map.cell.Flags.NEEDS_REDRAW);
        map.eachCell((c: Map.cell.Cell) => {
            expect(c.needsRedraw).toBeFalsy();
        });

        map.redrawAll();
        map.eachCell((c: Map.cell.Cell) => {
            expect(c.needsRedraw).toBeTruthy();
        });
    });

    test('revealAll + markRevealed', () => {
        // const player = (GW.data.player = {
        //     invalidateCostMap: jest.fn(),
        // });

        const map: Map.map.Map = GW.make.map(10, 10, {
            tile: 'FLOOR',
            fov: true,
        });
        map.eachCell((c) =>
            expect(c.flags.cell & Map.cell.Flags.REVEALED).toBeFalsy()
        );
        map.markRevealed(3, 3);
        expect(
            map.cell(3, 3).flags.cell & Map.cell.Flags.REVEALED
        ).toBeTruthy();
        // expect(player.invalidateCostMap).toHaveBeenCalled();
        // player.invalidateCostMap.mockClear();

        map.revealAll();
        map.eachCell((c) =>
            expect(c.flags.cell & Map.cell.Flags.REVEALED).toBeTruthy()
        );
        // expect(player.invalidateCostMap).toHaveBeenCalled();
    });

    test('visibility', () => {
        const map: Map.map.Map = GW.make.map(10, 10, 'FLOOR');

        // defaults to a visible map
        expect(map.isVisible(3, 3)).toBeTruthy();
        expect(map.isAnyKindOfVisible(3, 3)).toBeTruthy();
        expect(map.isOrWasAnyKindOfVisible(3, 3)).toBeTruthy();

        map.clearFlags(0, Map.cell.Flags.IS_WAS_ANY_KIND_OF_VISIBLE);
        expect(map.isVisible(3, 3)).toBeFalsy();
        expect(map.isAnyKindOfVisible(3, 3)).toBeFalsy();
        expect(map.isOrWasAnyKindOfVisible(3, 3)).toBeFalsy();

        map.setCellFlags(3, 3, Map.cell.Flags.VISIBLE);
        expect(map.isVisible(3, 3)).toBeTruthy();
        expect(map.isAnyKindOfVisible(3, 3)).toBeTruthy();
        expect(map.isOrWasAnyKindOfVisible(3, 3)).toBeTruthy();

        // Magic Map is not "visible"
        map.clearFlags(0, Map.cell.Flags.IS_WAS_ANY_KIND_OF_VISIBLE);
        map.setCellFlags(3, 3, Map.cell.Flags.MAGIC_MAPPED);
        expect(map.isVisible(3, 3)).toBeFalsy();
        expect(map.isAnyKindOfVisible(3, 3)).toBeFalsy();
        expect(map.isOrWasAnyKindOfVisible(3, 3)).toBeFalsy();

        map.clearFlags(
            0,
            Map.cell.Flags.IS_WAS_ANY_KIND_OF_VISIBLE |
                Map.cell.Flags.MAGIC_MAPPED
        );
        map.setCellFlags(3, 3, Map.cell.Flags.CLAIRVOYANT_VISIBLE);
        expect(map.isVisible(3, 3)).toBeFalsy();
        expect(map.isAnyKindOfVisible(3, 3)).toBeTruthy();
        expect(map.isOrWasAnyKindOfVisible(3, 3)).toBeTruthy();

        map.clearFlags(0, Map.cell.Flags.IS_WAS_ANY_KIND_OF_VISIBLE);
        map.setCellFlags(3, 3, Map.cell.Flags.TELEPATHIC_VISIBLE);
        expect(map.isVisible(3, 3)).toBeFalsy();
        expect(map.isAnyKindOfVisible(3, 3)).toBeTruthy();
        expect(map.isOrWasAnyKindOfVisible(3, 3)).toBeTruthy();

        map.clearFlags(0, Map.cell.Flags.IS_WAS_ANY_KIND_OF_VISIBLE);
        map.setCellFlags(3, 3, Map.cell.Flags.WAS_VISIBLE);
        expect(map.isVisible(3, 3)).toBeFalsy();
        expect(map.isAnyKindOfVisible(3, 3)).toBeFalsy();
        expect(map.isOrWasAnyKindOfVisible(3, 3)).toBeTruthy();

        map.clearFlags(0, Map.cell.Flags.IS_WAS_ANY_KIND_OF_VISIBLE);
        map.setCellFlags(3, 3, Map.cell.Flags.WAS_TELEPATHIC_VISIBLE);
        expect(map.isVisible(3, 3)).toBeFalsy();
        expect(map.isAnyKindOfVisible(3, 3)).toBeFalsy();
        expect(map.isOrWasAnyKindOfVisible(3, 3)).toBeTruthy();

        map.clearFlags(0, Map.cell.Flags.IS_WAS_ANY_KIND_OF_VISIBLE);
        map.setCellFlags(3, 3, Map.cell.Flags.WAS_CLAIRVOYANT_VISIBLE);
        expect(map.isVisible(3, 3)).toBeFalsy();
        expect(map.isAnyKindOfVisible(3, 3)).toBeFalsy();
        expect(map.isOrWasAnyKindOfVisible(3, 3)).toBeTruthy();
    });

    test('clearFlag', () => {
        const map: Map.map.Map = GW.make.map(10, 10, 'FLOOR');

        expect(map.flags.map).toEqual(
            Map.map.Flags.MAP_STABLE_LIGHTS |
                Map.map.Flags.MAP_STABLE_GLOW_LIGHTS
        );

        map.clearFlag(Map.map.Flags.MAP_STABLE_LIGHTS);
        expect(map.flags.map).toEqual(
            Map.map.Flags.MAP_STABLE_GLOW_LIGHTS | Map.map.Flags.MAP_CHANGED
        );

        // cannot undo changed b/c clearing flags sets changed!  must do 'changed = false'
        map.clearFlags(Map.map.Flags.MAP_CHANGED);
        expect(map.flags.map).toEqual(
            Map.map.Flags.MAP_STABLE_GLOW_LIGHTS | Map.map.Flags.MAP_CHANGED
        );

        map.changed = false;
        expect(map.flags.map).toEqual(Map.map.Flags.MAP_STABLE_GLOW_LIGHTS);

        expect(
            map.hasCellFlag(3, 3, Map.cell.Flags.TELEPATHIC_VISIBLE)
        ).toBeFalsy();
        map.setFlags(
            Map.map.Flags.MAP_ALWAYS_LIT,
            Map.cell.Flags.TELEPATHIC_VISIBLE
        );
        expect(
            map.hasCellFlag(3, 3, Map.cell.Flags.TELEPATHIC_VISIBLE)
        ).toBeTruthy();
        expect(map.flags.map & Map.map.Flags.MAP_ALWAYS_LIT).toBeTruthy();

        map.clearFlags(
            Map.map.Flags.MAP_ALWAYS_LIT,
            Map.cell.Flags.TELEPATHIC_VISIBLE
        );
        expect(
            map.hasCellFlag(3, 3, Map.cell.Flags.TELEPATHIC_VISIBLE)
        ).toBeFalsy();
        expect(map.flags.map & Map.map.Flags.MAP_ALWAYS_LIT).toBeFalsy();

        map.setCellFlags(3, 3, Map.cell.Flags.CLAIRVOYANT_VISIBLE);
        expect(
            map.hasCellFlag(3, 3, Map.cell.Flags.CLAIRVOYANT_VISIBLE)
        ).toBeTruthy();
        map.clearCellFlags(3, 3, Map.cell.Flags.CLAIRVOYANT_VISIBLE);
        expect(
            map.hasCellFlag(3, 3, Map.cell.Flags.CLAIRVOYANT_VISIBLE)
        ).toBeFalsy();
    });

    test('flags', () => {
        const map: Map.map.Map = GW.make.map(3, 3, 'FLOOR');
        map.setTile(1, 1, 'UP_STAIRS');
        map.storeMemories();
        expect(map.layerFlags(1, 1)).toEqual(
            Map.entity.Flags.L_BLOCKED_BY_STAIRS |
                Map.entity.Flags.L_LIST_IN_SIDEBAR |
                Map.entity.Flags.L_VISUALLY_DISTINCT
        );
        expect(map.layerFlags(1, 1, true)).toEqual(
            Map.entity.Flags.L_BLOCKED_BY_STAIRS |
                Map.entity.Flags.L_LIST_IN_SIDEBAR |
                Map.entity.Flags.L_VISUALLY_DISTINCT
        );
        expect(map.tileFlags(1, 1)).toEqual(Map.tile.Flags.T_UP_STAIRS);
        expect(map.tileFlags(1, 1, true)).toEqual(Map.tile.Flags.T_UP_STAIRS);

        expect(map.tileWithFlag(1, 1, Map.tile.Flags.T_UP_STAIRS)).toBe(
            Map.tiles.UP_STAIRS
        );
        expect(map.tileWithFlag(1, 1, Map.tile.Flags.T_BRIDGE)).toBeNull();

        expect(
            map.tileWithLayerFlag(1, 1, Map.entity.Flags.L_VISUALLY_DISTINCT)
        ).toBe(Map.tiles.UP_STAIRS);
        expect(
            map.tileWithLayerFlag(1, 1, Map.entity.Flags.L_BRIGHT_MEMORY)
        ).toBeNull();

        expect(map.hasTileFlag(1, 1, Map.tile.Flags.T_UP_STAIRS)).toBeTruthy();
        expect(map.hasTileFlag(1, 1, Map.tile.Flags.T_DOWN_STAIRS)).toBeFalsy();
    });

    test.each([
        // prettier-ignore
        [null,true,true,false,false,false,false,false,false,false,true,true,true],
        // prettier-ignore
        ["FLOOR",true,true,false,false,false,false,false,false,false,true,true,true],
        // prettier-ignore
        ["WALL",true,true,true,false,false,false,false,true,true,false,false,false],
        // prettier-ignore
        ["DOOR",true,true,false,true,false,false,false,false,true,true,true,true],
        // prettier-ignore
        ["LAKE",true,true,false,false,false,true,false,true,false,true,false,false],
    ])(
        'passthroughs - %s',
        // prettier-ignore
        (tile,clear,empty,obstruction,doorway,secret,liquid,gas,pathing,vision,move,walk,canWalk
    ) => {
      const map: Map.map.Map = GW.make.map(3, 3, "FLOOR");
      map.setTile(1, 1, tile);
      map.storeMemory(1, 1);
      expect(map.isClear(1, 1)).toEqual(clear);
      expect(map.isEmpty(1, 1)).toEqual(empty);
      expect(map.isObstruction(1, 1)).toEqual(obstruction);
      expect(map.isDoorway(1, 1)).toEqual(doorway);
      expect(map.isSecretDoorway(1, 1)).toEqual(secret);
      expect(map.isLiquid(1, 1)).toEqual(liquid);
      expect(map.hasGas(1, 1)).toEqual(gas);
      expect(map.blocksPathing(1, 1)).toEqual(pathing);
      expect(map.blocksVision(1, 1)).toEqual(vision);

      expect(map.isMoveableNow(1, 1)).toEqual(move);
      expect(map.isWalkableNow(1, 1)).toEqual(walk);
      expect(map.canBeWalked(1, 1)).toEqual(canWalk);

      expect(map.isMoveableNow(1, 1, true)).toEqual(move);
      expect(map.isWalkableNow(1, 1, true)).toEqual(walk);
      expect(map.canBeWalked(1, 1, true)).toEqual(canWalk);

      map.clearCell(1, 1);
      expect(map.isClear(1, 1)).toBeTruthy();
    }
    );

    test('topmostTile', () => {
        const map: Map.map.Map = GW.make.map(3, 3, 'FLOOR');

        map.setTile(1, 1, 'BRIDGE');
        expect(map.topmostTile(1, 1)).toBe(Map.tiles.BRIDGE);
        expect(map.topmostTile(0, 0)).toBe(Map.tiles.FLOOR);
    });

    test('tileFlavor', () => {
        const map: Map.map.Map = GW.make.map(3, 3, 'WALL');
        expect(map.tileFlavor(1, 1)).toEqual('a rough stone wall');
    });

    test('clearCellLayersWithFlags', () => {
        const map: Map.map.Map = GW.make.map(3, 3, 'FLOOR');

        map.setTile(1, 1, 'UP_STAIRS');
        expect(map.hasTileFlag(1, 1, Map.tile.Flags.T_HAS_STAIRS)).toBeTruthy();

        expect(map.hasTile(1, 1, 'FLOOR')).toBeFalsy();
        map.clearCellLayersWithFlags(1, 1, Map.tile.Flags.T_HAS_STAIRS);
        expect(map.hasTile(1, 1, 'FLOOR')).toBeTruthy();
        expect(map.hasTile(1, 1, 'UP_STAIRS')).toBeFalsy();
    });

    // test('clearCellLayers', () => {
    //     const map: Map.map.Map = GW.make.map(3, 3, 'LAKE');

    //     map.setTile(1, 1, 'BRIDGE');
    //     expect(map.isWalkableNow(1, 1)).toBeTruthy();
    //     map.clearCellLayers(1, 1, false, true, false);
    //     expect(map.isWalkableNow(1, 1)).toBeFalsy();
    // });

    test('neighborCount', () => {
        const map: Map.map.Map = GW.make.map(5, 5, 'FLOOR');

        map.setTile(3, 3, 'WALL');
        expect(map.neighborCount(2, 2, (c) => c.isWall())).toEqual(1);
        expect(map.neighborCount(2, 2, (c) => c.isWall(), true)).toEqual(0);
    });

    function mapFrom(
        template: string[],
        tileMap: Record<string, string | null>
    ) {
        return Map.map.from(template, tileMap);
    }

    function isWall(cell: Map.cell.Cell) {
        return cell.isWall();
    }

    function isDoor(cell: Map.cell.Cell) {
        return cell.isDoorway();
    }

    test('walkableArcCount', () => {
        const tiles = { '#': 'WALL', '~': 'LAKE' };
        let map = mapFrom(['   ', '   ', '   '], tiles);
        expect(map.walkableArcCount(1, 1)).toEqual(1);

        map = mapFrom(['###', '   ', '   '], tiles);
        expect(map.walkableArcCount(1, 1)).toEqual(1);

        map = mapFrom(['###', '   ', '###'], tiles);
        expect(map.walkableArcCount(1, 1)).toEqual(2);

        map = mapFrom(['~~~', '# #', '###'], tiles);
        expect(map.walkableArcCount(1, 1)).toEqual(0);

        map = mapFrom(['###', '   ', '# #'], tiles);
        expect(map.walkableArcCount(1, 1)).toEqual(3);

        map = mapFrom(['# #', '   ', '~ ~'], tiles);
        expect(map.walkableArcCount(1, 1)).toEqual(4);
    });

    test('diagonalBlocked', () => {
        const map: Map.map.Map = GW.make.map(10, 10, 'FLOOR');
        map.clearFlags(0, Map.cell.Flags.ANY_KIND_OF_VISIBLE);
        expect(map.cell(3, 3).isObstruction(true)).toBeFalsy();

        expect(map.diagonalBlocked(1, 1, 1, 2)).toBeFalsy();
        expect(map.diagonalBlocked(1, 1, 2, 2)).toBeFalsy();

        map.setTile(3, 3, 'WALL');
        expect(map.diagonalBlocked(2, 3, 3, 4)).toBeTruthy();
        expect(map.diagonalBlocked(3, 4, 2, 3)).toBeTruthy();

        // remembers clear cell...
        expect(map.cell(3, 3).isObstruction(true)).toBeFalsy();
        expect(map.diagonalBlocked(2, 3, 3, 4, true)).toBeFalsy();
        expect(map.diagonalBlocked(3, 4, 2, 3, true)).toBeFalsy();

        map.storeMemories();
        expect(map.diagonalBlocked(2, 3, 3, 4)).toBeTruthy();
        expect(map.diagonalBlocked(3, 4, 2, 3)).toBeTruthy();
    });

    test('fillCostGrid', () => {
        const tiles = { '#': 'WALL', '0': 'NULL' };
        const map = mapFrom(
            ['     ', ' ### ', '     ', ' ### ', '00000'],
            tiles
        );

        const costGrid = GW.grid.alloc(map.width, map.height);
        map.fillCostGrid(costGrid);
        expect(costGrid[0][0]).toEqual(1);
        expect(costGrid[1][1]).toEqual(GW.path.OBSTRUCTION); // wall
        expect(costGrid[0][4]).toEqual(GW.path.OBSTRUCTION); // null
    });

    test('matchingNeighbor', () => {
        const tiles = { '#': 'WALL', '0': null };
        const map = mapFrom(
            ['     ', ' ### ', '     ', ' ### ', '00000'],
            tiles
        );

        expect(map.matchingNeighbor(0, 0, isWall, true)).toEqual([-1, -1]);
        expect(map.matchingNeighbor(0, 0, isWall)).toEqual([1, 1]);
    });

    test('matchingLocNear', () => {
        const map: Map.map.Map = GW.make.map(10, 10, 'FLOOR');

        map.setTile(9, 8, 'WALL');
        expect(isWall(map.cell(9, 8))).toBeTruthy();

        expect(map.matchingLocNear(3, 3, isWall)).toEqual([9, 8]);
        expect(map.matchingLocNear(3, 3, { match: isWall })).toEqual([9, 8]);
        expect(
            map.matchingLocNear(3, 3, { match: isWall, deterministic: true })
        ).toEqual([9, 8]);

        expect(map.matchingLocNear(3, 3, isDoor)).toEqual([-1, -1]);

        expect(map.matchingLocNear(3, 3, 'WALL')).toEqual([9, 8]);
    });

    describe('randomMatchingLoc', () => {
        test('finds one', () => {
            const map: Map.map.Map = GW.make.map(10, 10, 'FLOOR');
            map.setTile(9, 8, 'WALL');
            expect(map.randomMatchingLoc(isWall)).toEqual([9, 8]);
        });

        test('fails to find one', () => {
            const map: Map.map.Map = GW.make.map(10, 10, 'FLOOR');
            expect(map.randomMatchingLoc(isWall)).toEqual([-1, -1]);
        });
    });

    test('hasVisibleLight', () => {
        const map: Map.map.Map = GW.make.map(5, 5, 'FLOOR');
        const cell = map.cell(3, 3);
        expect(cell.light).toEqual([100, 100, 100]);
        expect(map.hasVisibleLight(3, 3)).toBeTruthy();
        cell.light = [5, 5, 5];
        expect(map.hasVisibleLight(3, 3)).toBeFalsy();
    });

    test('add/remove Light', () => {
        const map: Map.map.Map = GW.make.map(10, 10, 'FLOOR');
        const light = GW.make.light('blue, 3, 0');
        const other = GW.make.light('green', 3, 0);
        const also = GW.make.light('blue', 3, 0);
        const eachFn = jest.fn();

        map.eachStaticLight(eachFn);
        expect(eachFn).toHaveBeenCalledTimes(0);

        map.addStaticLight(3, 3, light);
        map.eachStaticLight(eachFn);
        expect(eachFn).toHaveBeenCalledTimes(1);
        eachFn.mockClear();

        map.removeStaticLight(3, 3, light);
        map.eachStaticLight(eachFn);
        expect(eachFn).toHaveBeenCalledTimes(0);

        map.addStaticLight(3, 3, light);
        map.addStaticLight(3, 3, other);
        map.eachStaticLight(eachFn);
        expect(eachFn).toHaveBeenCalledTimes(2);
        eachFn.mockClear();

        map.removeStaticLight(3, 3);
        map.eachStaticLight(eachFn);
        expect(eachFn).toHaveBeenCalledTimes(0);
        expect(map.lights).toBeNull();
        eachFn.mockClear();

        map.addStaticLight(5, 5, also);
        map.addStaticLight(3, 3, light);
        map.addStaticLight(4, 4, other);

        map.removeStaticLight(3, 3, light);
        map.eachStaticLight(eachFn);
        expect(eachFn).toHaveBeenCalledTimes(2);
    });

    test('FX', () => {
        const fx: GW.types.FxType = GW.make.layer({ ch: '!' });
        const map: Map.map.Map = GW.make.map(10, 10, 'FLOOR');
        const mixer: GW.sprite.Mixer = GW.make.mixer();
        const cell = map.cell(3, 3);
        Map.cell.getAppearance(cell, mixer);
        expect(mixer.ch).not.toEqual(fx.sprite.ch);

        map.addFx(3, 3, fx);
        Map.cell.getAppearance(cell, mixer);
        expect(mixer.ch).toEqual(fx.sprite.ch);
        expect(fx).toBeAtXY(3, 3);

        map.moveFx(4, 4, fx);
        Map.cell.getAppearance(cell, mixer);
        expect(mixer.ch).not.toEqual(fx.sprite.ch);
        expect(fx).toBeAtXY(4, 4);

        map.moveFx(3, 3, fx);
        Map.cell.getAppearance(cell, mixer);
        expect(mixer.ch).toEqual(fx.sprite.ch);
        expect(fx).toBeAtXY(3, 3);

        map.removeFx(fx);
        Map.cell.getAppearance(cell, mixer);
        expect(mixer.ch).not.toEqual(fx.sprite.ch);
        expect(fx).toBeAtXY(3, 3); // leaves last pos
    });

    test('Actor', () => {
        const player = UTILS.makePlayer();
        expect(player.isPlayer()).toBeTruthy();
        const map: Map.map.Map = GW.make.map(10, 10, 'FLOOR');
        map.anyLightChanged = false;

        map.addActor(3, 3, player);
        expect(map.actorAt(3, 3)).toBe(player);
        expect(map.hasCellFlag(3, 3, Map.cell.Flags.HAS_PLAYER)).toBeTruthy();
        expect(map.flags.map & Map.map.Flags.MAP_FOV_CHANGED).toBeTruthy();
        expect(map.anyLightChanged).toBeFalsy();
        expect(map.cell(3, 3).needsRedraw).toBeTruthy();

        const other = UTILS.makeActor();
        // @ts-ignore
        other.light = GW.make.light('blue, 3, 0');
        expect(map.addActor(3, 3, other)).toBeFalsy();
        expect(map.actorAt(3, 3)).toBe(player);

        map.clearFlag(Map.map.Flags.MAP_FOV_CHANGED);
        map.moveActor(4, 4, player);
        expect(map.actorAt(3, 3)).toBeNull();
        expect(map.hasCellFlag(3, 3, Map.cell.Flags.HAS_ANY_ACTOR)).toBeFalsy();
        expect(map.flags.map & Map.map.Flags.MAP_FOV_CHANGED).toBeTruthy();

        map.addActor(3, 3, other);
        expect(map.anyLightChanged).toBeTruthy();
        expect(map.actorAt(3, 3)).toBe(other);
        expect(map.moveActor(3, 3, player)).toBeFalsy();
        expect(map.actorAt(3, 3)).toBe(other);
        expect(map.actorAt(4, 4)).toBe(player);

        map.anyLightChanged = false;
        map.moveActor(5, 5, other);
        expect(map.anyLightChanged).toBeTruthy();

        map.anyLightChanged = false;
        map.removeActor(other);
        expect(map.anyLightChanged).toBeTruthy();

        expect(map.removeActor(other)).toBeFalsy();

        map.removeActor(player);
        expect(map.actorAt(4, 4)).toBeNull();
        expect(map.hasCellFlag(4, 4, Map.cell.Flags.HAS_ANY_ACTOR)).toBeFalsy();
        expect(map.flags.map & Map.map.Flags.MAP_FOV_CHANGED).toBeTruthy();

        // @ts-ignore
        other.avoidsCell.mockReturnValue(true);
        expect(map.addActorNear(3, 3, other)).toBeFalsy();
        expect(map.actorAt(3, 3)).toBeNull();

        expect(map.addActorNear(3, 3, player)).toBeTruthy();
        expect(map.actorAt(3, 3)).toBe(player);
        expect(map.hasCellFlag(3, 3, Map.cell.Flags.HAS_PLAYER)).toBeTruthy();
        expect(map.flags.map & Map.map.Flags.MAP_FOV_CHANGED).toBeTruthy();

        map.deleteActorAt(3, 3);
        expect(map.actorAt(3, 3)).toBeNull();
        expect(player.delete).toHaveBeenCalled();
    });

    test('Item', () => {
        const item = UTILS.makeItem();
        const map: Map.map.Map = GW.make.map(10, 10, 'FLOOR');
        map.anyLightChanged = false;

        map.addItem(3, 3, item);
        expect(map.itemAt(3, 3)).toBe(item);
        expect(map.hasCellFlag(3, 3, Map.cell.Flags.HAS_ITEM)).toBeTruthy();
        expect(map.anyLightChanged).toBeFalsy();
        expect(map.cell(3, 3).needsRedraw).toBeTruthy();

        const other = UTILS.makeItem();
        // @ts-ignore
        other.light = GW.make.light('blue, 3, 0');
        // @ts-ignore
        other.isDetected.mockReturnValue(true);
        expect(map.addItem(3, 3, other)).toBeFalsy();
        expect(map.itemAt(3, 3)).toBe(item);

        map.addItem(5, 5, other);
        expect(map.anyLightChanged).toBeTruthy();
        expect(
            map.hasCellFlag(5, 5, Map.cell.Flags.ITEM_DETECTED)
        ).toBeTruthy();
        expect(map.itemAt(5, 5)).toBe(other);

        map.anyLightChanged = false;
        map.removeItem(other);
        expect(map.hasCellFlag(5, 5, Map.cell.Flags.ITEM_DETECTED)).toBeFalsy();
        expect(map.anyLightChanged).toBeTruthy();
        expect(map.itemAt(5, 5)).toBeNull();

        expect(map.removeItem(other)).toBeFalsy();

        map.removeItem(item);
        expect(map.itemAt(3, 3)).toBeNull();
        expect(map.hasCellFlag(3, 3, Map.cell.Flags.HAS_ITEM)).toBeFalsy();

        // // @ts-ignore
        // other.forbidsCell.mockReturnValue(true);
        // expect(map.addItemNear(3, 3, other)).toBeFalsy();
        // expect(map.itemAt(3, 3)).toBeNull();

        // expect(map.addItemNear(3, 3, item)).toBeTruthy();
        // expect(map.itemAt(3, 3)).toBe(item);
        // expect(map.hasCellFlag(3, 3, Map.cell.Flags.HAS_ITEM)).toBeTruthy();
    });

    test('gridDisruptsWalkability', () => {
        const map = mapFrom(['     ', ' ####', '     ', ' ### ', ' ~~  '], {
            '#': 'WALL',
            '~': 'LAKE',
            '>': 'UP_STAIRS',
            ' ': 'FLOOR',
        });

        const grid = GW.make.grid(5, 5);
        expect(map.gridDisruptsWalkability(grid)).toBeFalsy();

        // block off section
        grid[0][1] = 1;
        expect(map.gridDisruptsWalkability(grid)).toBeTruthy();
        grid.fill(0);

        // stairs - automatic disruption if you block/remove stairs
        grid[0][4] = 1;
        expect(map.gridDisruptsWalkability(grid)).toBeFalsy();
        map.setTile(0, 4, 'UP_STAIRS');
        expect(map.hasTileFlag(0, 4, Map.tile.Flags.T_HAS_STAIRS)).toBeTruthy();
        expect(map.cell(0, 4).canBeWalked()).toBeTruthy();
        grid[0][4] = 1;
        expect(map.gridDisruptsWalkability(grid)).toBeTruthy();
        grid.fill(0);

        // clear cells are not walkable
        grid[3][0] = 1; // separate 1 cell
        expect(map.gridDisruptsWalkability(grid)).toBeTruthy();
        map.nullifyCell(4, 0); // clear that cell
        expect(map.gridDisruptsWalkability(grid)).toBeFalsy();
        grid.fill(0);
    });

    test('losFromTo', () => {
        const map: Map.map.Map = GW.make.map(10, 10, 'FLOOR');

        expect(map.losFromTo({ x: 0, y: 0 }, { x: 0, y: 0 })).toBeTruthy();
        expect(map.losFromTo({ x: 0, y: 0 }, { x: 3, y: 4 })).toBeTruthy();
        map.setTile(1, 1, 'WALL');
        expect(map.losFromTo({ x: 0, y: 0 }, { x: 3, y: 4 })).toBeFalsy();
    });

    test('resetCellEvents', () => {
        const map: Map.map.Map = GW.make.map(10, 10, 'FLOOR');

        map.setCellFlags(2, 2, 0, Map.cell.MechFlags.EVENT_FIRED_THIS_TURN);
        map.setCellFlags(3, 3, 0, Map.cell.MechFlags.EVENT_PROTECTED);

        map.resetCellEvents();
        expect(
            map.hasCellMechFlag(2, 2, Map.cell.MechFlags.EVENT_FIRED_THIS_TURN)
        ).toBeFalsy();
        expect(
            map.hasCellMechFlag(3, 3, Map.cell.MechFlags.EVENT_PROTECTED)
        ).toBeFalsy();
    });

    test('storeMemories', () => {
        const map: Map.map.Map = GW.make.map(10, 10, 'FLOOR', 'WALL');

        expect(map.hasTile(0, 0, 'WALL')).toBeTruthy();
        expect(map.cell(0, 0).memory.flags.layer).toEqual(0);
        expect(map.isAnyKindOfVisible(0, 0)).toBeTruthy();

        map.storeMemories();
        expect(map.cell(0, 0).memory.flags.layer).toBeGreaterThan(0);
    });

    test('addText', () => {
        const map: Map.map.Map = GW.make.map(10, 10, 'FLOOR', 'WALL');
        const mixer: GW.sprite.Mixer = GW.make.mixer();

        Map.map.getCellAppearance(map, 1, 1, mixer);
        expect(mixer.ch).not.toEqual('T');

        Map.map.addText(map, 1, 1, 'Text', 'red', null);
        Map.map.getCellAppearance(map, 1, 1, mixer);

        expect(mixer.ch).toEqual('T');
        expect(mixer.fg).toEqual(GW.colors.red);
    });

    test.each([
        // redraw, changed, visible, revealed, anyVisible, cursor, path, ch, fg, bg
        [true, true, false, false, false, false, false, 0, 0, 0],

        // visible && revealed
        // prettier-ignore
        [true, true, true, true, false, false, false, "<", [100, 50, 50], [40, 20, 20]],
        // prettier-ignore
        [false, true, true, true, false, false, false, "<", [100, 50, 50], [40, 20, 20]],
        // prettier-ignore
        [true, false, true, true, false, false, false, "<", [100, 50, 50], [40, 20, 20]],
        // prettier-ignore
        [false, false, true, true, false, false, false, "<", [100, 50, 50], [40, 20, 20]],

        // visible and !revealed => for super simple games that do not deal with reveal mechanics
        // prettier-ignore
        [true, true, true, false, false, false, false, "<", [100, 50, 50], [40, 20, 20]],
        // prettier-ignore
        [true, true, true, true, false, false, false, "<", [100, 50, 50], [40, 20, 20]],
        // prettier-ignore
        [false, true, true, true, false, false, false, "<", [100, 50, 50], [40, 20, 20]],
        // prettier-ignore
        [true, false, true, true, false, false, false, "<", [100, 50, 50], [40, 20, 20]],
        // prettier-ignore
        [false, true, true, true, false, false, false, "<", [100, 50, 50], [40, 20, 20]],

        // ! visible && revealed
        // prettier-ignore
        [true, true, false, true, false, false, false, "<", [70, 35, 35], [28, 14, 14]],
        // prettier-ignore
        [true, false, false, true, false, false, false, "<", [70, 35, 35], [28, 14, 14]],
        // prettier-ignore
        [false, true, false, true, false, false, false, "<", [70, 35, 35], [28, 14, 14]],
        // prettier-ignore
        [false, false, false, true, false, false, false, "<", [70, 35, 35], [28, 14, 14]],

        // telepathy && revealed
        // prettier-ignore
        [true, true, false, true, true, false, false, "<", [100, 50, 50], [40, 20, 20]],
        // prettier-ignore
        [true, false, false, true, true, false, false, "<", [100, 50, 50], [40, 20, 20]],
        // prettier-ignore
        [false, true, false, true, true, false, false, "<", [100, 50, 50], [40, 20, 20]],
        // prettier-ignore
        [false, false, false, true, true, false, false, "<", [100, 50, 50], [40, 20, 20]],

        // telepathy && !revealed
        // prettier-ignore
        [true, true, false, false, true, false, false, "<", [100, 50, 50], [40, 20, 20]],
        // prettier-ignore
        [true, false, false, false, true, false, false, "<", [100, 50, 50], [40, 20, 20]],
        // prettier-ignore
        [false, true, false, false, true, false, false, "<", [100, 50, 50], [40, 20, 20]],
        // prettier-ignore
        [false, false, false, false, true, false, false, "<", [100, 50, 50], [40, 20, 20]],

        // cursor
        // prettier-ignore
        [true,true,true,true,false,true,false,"<",[100, 50, 50],GW.color.from([40, 20, 20]).mix(GW.colors.cursor, 50),],
        // prettier-ignore
        [false,false,false,true,false,true,false,"<",[70, 35, 35],GW.color.from([28, 14, 14]).mix(GW.colors.cursor, 50),],

        // path
        // prettier-ignore
        [true,true,true,true,false,false,true,"<",[43, 23, 23],[88, 79, 62],], // lots of separation change here
        // prettier-ignore
        [false,false,false,true,false,false,true,"<",[70, 35, 35],GW.color.from([28, 14, 14]).mix(GW.colors.path, 50),],
    ])(
        'getCellAppearance - changed=%s|%s, visible=%s, revealed=%s, any=%s, cursor=%s, path=%s',
        // prettier-ignore
        (redraw,changed,visible,revealed,anyVisible,cursor,path,ch,fg,bg
    ) => {
      const map: Map.map.Map = GW.make.map(3, 3, "FLOOR");
      map.setTile(1, 1, "UP_STAIRS");
      // const stairs = GW.make.mixer(Map.tiles.UP_STAIRS.sprite);
      const cell = map.cell(1, 1);
      const app: GW.sprite.Mixer = GW.make.mixer();

      cell.needsRedraw = redraw;
      cell.changed = changed;

      if (revealed || visible || anyVisible) {
        // need to have drawn in past...
        Map.cell.getAppearance(cell, app);
      }

      if (visible) {
        cell.flags.cell |= Map.cell.Flags.VISIBLE;
      } else {
        cell.clearFlags(Map.cell.Flags.ANY_KIND_OF_VISIBLE);
      }
      if (revealed) {
        cell.markRevealed();
      } else {
        cell.clearFlags(Map.cell.Flags.REVEALED);
      }

      if (anyVisible) {
        cell.flags.cell |= Map.cell.Flags.CLAIRVOYANT_VISIBLE;
      } else {
        cell.clearFlags(
          Map.cell.Flags.CLAIRVOYANT_VISIBLE | Map.cell.Flags.TELEPATHIC_VISIBLE
        );
      }

      if (cursor) {
        cell.flags.cell |= Map.cell.Flags.IS_CURSOR;
      } else {
        cell.clearFlags(Map.cell.Flags.IS_CURSOR);
      }

      if (path) {
        cell.flags.cell |= Map.cell.Flags.IS_IN_PATH;
      } else {
        cell.clearFlags(Map.cell.Flags.IS_IN_PATH);
      }

      const expected: GW.sprite.Mixer = GW.make.mixer({ ch, fg, bg });
      Map.map.getCellAppearance(map, 1, 1, app);
      expect(app.ch).toEqual(expected.ch);
      expect(app.fg).toEqual(expected.fg);
      expect(app.bg).toEqual(expected.bg);
    }
    );

    test('getCellAppearance - inverted', () => {
        const tile: Map.tile.Tile = GW.make.tile({
            id: 'INVERT',
            name: 'invert',
            flags: 'L_INVERT_WHEN_HIGHLIGHTED',
            fg: 'blue',
            bg: 'red',
            ch: '!',
        });

        const map: Map.map.Map = GW.make.map(3, 3, 'FLOOR');
        map.setTile(1, 1, tile);
        map.setCellFlags(1, 1, Map.cell.Flags.IS_CURSOR);

        const app: GW.sprite.Mixer = GW.make.mixer();
        Map.map.getCellAppearance(map, 1, 1, app);
        expect(app.ch).toEqual('!');
        expect(app.fg).toEqual(GW.colors.red);
        expect(app.bg).toEqual(GW.colors.blue);

        map.clearCellFlags(1, 1, Map.cell.Flags.IS_CURSOR);
        map.setCellFlags(1, 1, Map.cell.Flags.IS_IN_PATH);
        Map.map.getCellAppearance(map, 1, 1, app);
        expect(app.ch).toEqual('!');
        expect(app.fg).toEqual(GW.colors.red);
        expect(app.bg).toEqual(GW.colors.blue);

        map.clearCellFlags(1, 1, Map.cell.Flags.IS_IN_PATH);
        Map.map.getCellAppearance(map, 1, 1, app);
        expect(app.ch).toEqual('!');
        expect(app.fg).toEqual(GW.colors.blue);
        expect(app.bg).toEqual(GW.colors.red);
    });

    describe('liquids', () => {
        beforeAll(() => {
            Map.tile.install('RED_LIQUID', {
                name: 'red liquid',
                layer: 'LIQUID',
            });
        });

        afterAll(() => {
            delete Map.tiles.RED_LIQUID;
        });

        test('liquids can dissipate', async () => {
            GW.random.seed(12345);
            const map = GW.make.map(10, 10);
            expect(Map.tiles.RED_LIQUID.dissipate).toBeGreaterThan(0);
            map.setTile(5, 5, 'RED_LIQUID', 20);
            const cell = map.cell(5, 5);
            expect(cell.liquidVolume).toEqual(20);
            expect(map.cell(4, 5).liquidVolume).toEqual(0);
            expect(map.flags.map & Map.map.Flags.MAP_NO_LIQUID).toBeFalsy();

            await map.tick();
            expect(cell.liquidVolume).toEqual(5);
            expect(map.cell(4, 5).liquidVolume).toEqual(1);

            await map.tick();
            expect(cell.liquidVolume).toEqual(1);
            expect(map.cell(4, 5).liquidVolume).toEqual(1);

            UTILS.rnd.mockReturnValue(0); // force dissipate
            expect(cell.liquidTile.dissipate).toBeGreaterThan(0);
            while (cell.liquidVolume > 0) {
                await map.tick();
            }

            expect(cell.liquid).toEqual(null);
        });

        test.each([
            [2, 0, 2, 0],
            [5, 0, 5, 0],
            [10, 0, 10, 0],
            [25, 0, 25, 0],
            [50, 0, 50, 0],
            [100, 0, 100, 0],
            [200, 0, 200, 0],

            [5, 10, 5, 43],
            [5, 20, 4, 6],
            [5, 30, 4, 5],
            [5, 40, 4, 5],
            [5, 50, 4, 5],
            [5, 75, 4, 3],
            [5, 100, 4, 2],

            [10, 10, 10, 27],
            [10, 25, 9, 12],
            [10, 50, 9, 3],
            [10, 75, 9, 3],
            [10, 100, 9, 2],

            [25, 10, 22, 49],
            [25, 25, 19, 20],
            [25, 50, 16, 6],
            [25, 75, 16, 5],
            [25, 100, 15, 3],
            [25, 150, 16, 3],
            [25, 200, 15, 3],
            [25, 300, 14, 3],

            [50, 10, 40, 38],
            [50, 25, 32, 15],
            [50, 50, 30, 10],
            [50, 75, 27, 6],
            [50, 100, 21, 4],
            [50, 200, 19, 4],
            [50, 300, 17, 3],
            [50, 400, 17, 3],
            [50, 500, 17, 3],
            [50, 600, 17, 3],
            [50, 700, 17, 3],
            [50, 800, 17, 3],

            [100, 10, 73, 50],
            [100, 25, 53, 23],
            [100, 50, 36, 10],
            [100, 75, 33, 7],
            [100, 100, 28, 6],
            [100, 200, 27, 5],
            [100, 300, 25, 4],
            [100, 400, 21, 4],
            [100, 500, 20, 4],
            [100, 600, 20, 4],
            [100, 700, 20, 3],
            [100, 800, 20, 3],

            [200, 10, 115, 52],
            [200, 25, 80, 28],
            [200, 50, 63, 12],
            [200, 75, 47, 10],
            [200, 100, 42, 8],
            [200, 200, 38, 6],
            [200, 300, 35, 5],
            [200, 400, 33, 5],
            [200, 500, 32, 5],
            [200, 600, 30, 4],
            [200, 700, 29, 4],
            [200, 800, 28, 4],
            [200, 900, 26, 4],
            [200, 1000, 25, 4],
            [200, 1100, 25, 4],
            [200, 1200, 25, 4],
            [200, 1300, 25, 4],
        ])(
            'liquid combos - vol=%d, dissipate=%d -> max tiles=%d, turns=%d',
            async (volume, dissipate, maxTiles, turns) => {
                const liquid = new Map.tile.Tile({
                    id: 'RED_LIQUID',
                    name: 'red liquid',
                    layer: 'LIQUID',
                    dissipate: dissipate * 100,
                });

                expect(liquid.dissipate).toEqual(dissipate * 100);
                GW.random.seed(12345);

                const map: Map.map.Map = GW.make.map(21, 21, 'FLOOR');
                expect(map.count((cell) => cell.liquidVolume > 0)).toEqual(0);

                map.setTile(10, 10, liquid, volume);
                expect(map.flags.map & Map.map.Flags.MAP_NO_LIQUID).toBeFalsy();
                expect(map.count((cell) => cell.liquidVolume !== 0)).toEqual(1);

                // map.dump((c) => "" + c.liquidVolume);

                let roundCount = 0;
                let maxSize = 0;
                let ok = true;
                let sameCount = 0;
                while (ok && sameCount < 20 && roundCount < 1000) {
                    // console.log("ROUND", roundCount, UTILS.v);
                    await map.tick();
                    // updateGas(map);
                    const size = map.count((cell) => cell.liquidVolume !== 0);
                    if (size == maxSize) {
                        ++sameCount;
                    } else {
                        // console.log("size = ", size, maxSize);
                        sameCount = 0;
                    }
                    if (size < maxSize && !dissipate) {
                        ok = false;
                    }
                    if (size == 0) {
                        ok = false;
                    }
                    // if (size > maxSize) {
                    //   map.dump((c) => "" + c.gasVolume);
                    // }
                    maxSize = Math.max(maxSize, size);
                    ++roundCount;
                }

                // console.log(UTILS.counts);

                if (turns && dissipate) {
                    expect(roundCount).toEqual(turns);
                }
                expect(maxSize).toEqual(maxTiles);
            }
        );
    });

    describe('gas', () => {
        let map: Map.map.Map;
        let cell: Map.cell.Cell;

        beforeAll(() => {
            const gas = Map.tile.install('RED_GAS', {
                name: 'red gas',
                layer: 'GAS',
            });

            expect(gas.dissipate).toEqual(20 * 100);

            GW.random.seed(12345);

            map = GW.make.map(10, 10, 'FLOOR');
            expect(map.count((cell) => cell.gasVolume > 0)).toEqual(0);

            map.setTile(5, 5, 'RED_GAS', 90);
            expect(map.flags.map & Map.map.Flags.MAP_NO_GAS).toBeFalsy();

            cell = map.cell(5, 5);
            expect(cell.gas).toEqual('RED_GAS');
            expect(cell.gasVolume).toEqual(90);
            expect(cell.hasTile('RED_GAS')).toBeTruthy();
            expect(
                cell.layerFlags() & Map.entity.Flags.L_BLOCKS_GAS
            ).toBeFalsy();
            expect(map.count((cell) => cell.gasVolume !== 0)).toEqual(1);
            map.eachNeighbor(5, 5, (cell) => {
                expect(cell.gasVolume).toEqual(0);
            });
        });

        test.each([
            [18, 18, 5],
            [18, 7, 13],
            [10, 8, 23],
            [7, 6, 27],
            [5, 5, 28],
            [5, 4, 31],
            [4, 3, 33],
            [3, 2, 31],
            [2, 2, 32],
            [1, 2, 31],
            [1, 1, 27],
            [1, 2, 22],
            [1, 1, 18],
            [1, 1, 14],
            [1, 1, 11],
            [1, 1, 9],
            [1, 1, 7],
            [1, 1, 5],
            [1, 1, 3],
            [1, 0, 2],
            [0, 0, 1],
            [0, 0, 0],
        ])('gas round - %d, %d, %d', async (center, left, count) => {
            await map.tick();

            // map.dump((c) => c.gasVolume.toString(16));

            expect(cell.gasVolume).toEqual(center);
            expect(map.cell(4, 5).gasVolume).toEqual(left);
            expect(map.count((cell) => cell.gasVolume > 0)).toEqual(count);

            if (center) {
                expect(cell.gas).not.toBeNull();
            } else {
                expect(cell.gas).toBeNull();
            }
        });

        afterAll(() => {
            delete Map.tiles.RED_GAS;
        });
    });

    test.each([
        [2, 4],
        [10, 14],
        [25, 17],
        [60, 30],
        [100, 29],
        [200, 38],
        [300, 45],
        [500, 60],
        [1000, 79],
        [2000, 121],
        [20000, 1021],
    ])('big gas - %d -> %d', async (size, turns) => {
        const gas = new Map.tile.Tile({
            id: 'RED_GAS',
            name: 'red gas',
            layer: 'GAS',
        });

        expect(gas.dissipate).toEqual(20 * 100);

        GW.random.seed(12345);

        const map: Map.map.Map = GW.make.map(10, 10, 'FLOOR');
        expect(map.count((cell) => cell.gasVolume > 0)).toEqual(0);

        map.setTile(5, 5, gas, size); // 20000 from brogue dewars
        expect(map.flags.map & Map.map.Flags.MAP_NO_GAS).toBeFalsy();
        expect(map.count((cell) => cell.gasVolume !== 0)).toEqual(1);

        let roundCount = 0;
        while (map.count((cell) => cell.gasVolume !== 0)) {
            await map.tick();
            ++roundCount;
        }
        expect(roundCount).toEqual(turns);
    });

    test.each([
        [2, 0, 2, 0],
        [5, 0, 5, 0],
        [10, 0, 10, 0],
        [15, 0, 15, 0],
        [25, 0, 25, 0],
        [50, 0, 49, 0],
        [75, 0, 69, 0],
        [100, 0, 87, 0],
        [125, 0, 103, 0],
        [150, 0, 117, 0],
        [175, 0, 132, 0],
        [200, 0, 142, 0],

        [5, 10, 5, 17],
        [5, 20, 4, 9],
        [5, 30, 4, 7],
        [5, 40, 4, 8],
        [5, 50, 4, 5],
        [5, 75, 4, 3],

        [10, 10, 9, 31],
        [10, 25, 7, 11],
        [10, 50, 5, 5],
        [10, 75, 5, 5],
        [10, 100, 5, 3],
        [10, 125, 5, 3],

        [25, 10, 16, 55],
        [25, 25, 14, 15],
        [25, 50, 11, 8],
        [25, 75, 11, 6],
        [25, 100, 12, 5],
        [25, 125, 10, 4],
        [25, 150, 9, 4],
        [25, 200, 9, 4],
        [25, 250, 7, 3],
        [25, 300, 6, 3],

        [50, 10, 26, 42],
        [50, 50, 18, 11],
        [50, 100, 15, 6],
        [50, 150, 13, 5],
        [50, 200, 13, 4],
        [50, 300, 13, 4],
        [50, 400, 13, 4],
        [50, 500, 12, 3],

        [100, 50, 26, 14],
        [100, 100, 23, 8],
        [100, 200, 20, 6],
        [100, 300, 16, 5],
        [100, 400, 13, 4],
        [100, 500, 13, 4],
        [100, 600, 13, 4],

        [200, 50, 37, 19],
        [200, 100, 31, 11],
        [200, 200, 25, 8],
        [200, 300, 24, 7],
        [200, 400, 23, 6],
        [200, 500, 22, 6],
        [200, 600, 21, 5],
        [200, 700, 21, 5],
        [200, 800, 19, 4],
        [200, 900, 15, 4],
        [200, 1000, 13, 4],
    ])(
        'gas combos - vol=%d, dissipate=%d -> max tiles=%d, turns=%d',
        async (volume, dissipate, maxTiles, turns) => {
            const gas = new Map.tile.Tile({
                id: 'RED_GAS',
                name: 'red gas',
                layer: 'GAS',
                dissipate: dissipate * 100,
            });

            expect(gas.dissipate).toEqual(dissipate * 100);
            GW.random.seed(12345);

            const map: Map.map.Map = GW.make.map(21, 21, 'FLOOR');
            expect(map.count((cell) => cell.gasVolume > 0)).toEqual(0);

            map.setTile(10, 10, gas, volume);
            expect(map.flags.map & Map.map.Flags.MAP_NO_GAS).toBeFalsy();
            expect(map.count((cell) => cell.gasVolume !== 0)).toEqual(1);

            // map.dump((c) => "" + c.gasVolume);

            let roundCount = 0;
            let maxSize = 0;
            let ok = true;
            let sameCount = 0;
            while (ok && sameCount < 20 && roundCount < 1000) {
                // console.log("ROUND", roundCount, UTILS.v);
                await map.tick();
                // updateGas(map);
                const size = map.count((cell) => cell.gasVolume !== 0);
                if (size == maxSize) {
                    ++sameCount;
                } else {
                    // console.log("size = ", size, maxSize);
                    sameCount = 0;
                }
                if (size < maxSize && !dissipate) {
                    ok = false;
                }
                if (size == 0) {
                    ok = false;
                }
                // if (size > maxSize) {
                //   map.dump((c) => "" + c.gasVolume);
                // }
                maxSize = Math.max(maxSize, size);
                ++roundCount;
            }

            // console.log(UTILS.counts);

            if (turns && dissipate) {
                expect(roundCount).toEqual(turns);
            }
            expect(maxSize).toEqual(maxTiles);
        }
    );

    test('chance', () => {
        GW.random.seed(12345);
        let count = 0;
        for (let i = 0; i < 1000; ++i) {
            if (GW.random.chance(1000, 10000)) {
                count += 1;
            }
        }
        expect(count).toBeWithin(90, 110);
    });
});
