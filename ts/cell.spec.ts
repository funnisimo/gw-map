import 'jest-extended';
import '../test/matchers';
import * as UTILS from '../test/utils';
import * as Map from './gw';
import * as GW from 'gw-utils';
import { Tile } from './tile';

describe('Cell', () => {
    beforeAll(() => {
        Map.tile.install('TEST_FLOOR', {
            name: 'floor',
            ch: '.',
            fg: [80, 80, 80],
            bg: [20, 20, 20],
        });
        Map.tile.install('RED_LIQUID', {
            name: 'red liquid',
            article: 'some',
            bg: 'red',
            flags: 'T_EXTINGUISHES_FIRE, T_DEEP_WATER, TM_EXPLOSIVE_PROMOTE',
            layer: 'LIQUID',
        });
        Map.tile.install('BLUE_LIQUID', {
            name: 'blue liquid',
            article: 'some',
            bg: 'blue',
            flags: 'TM_STAND_IN_TILE',
            layer: 'LIQUID',
        });
        Map.tile.install('RED_GAS', {
            name: 'red gas',
            article: 'some',
            bg: 'red',
            flags:
                'T_SPONTANEOUSLY_IGNITES, T_IS_FLAMMABLE, T_CAUSES_EXPLOSIVE_DAMAGE, T_GAS',
            layer: 'GAS',
        });
        Map.tile.install('BLUE_GAS', {
            name: 'blue gas',
            article: 'some',
            bg: 'blue',
            flags: 'T_IS_FLAMMABLE, T_GAS',
            layer: 'GAS',
        });
        Map.tile.install({
            id: 'ENTER',
            ch: '!',
            fg: 'red',
            activates: {
                enter: 'FLOOR',
            },
        });
        Map.tile.install({
            id: 'LOW_CHANCE',
            ch: '!',
            fg: 'red',
            activates: {
                enter: { tile: 'FLOOR', chance: 1 },
            },
        });
    });

    afterAll(() => {
        delete Map.tiles.TEST_FLOOR;
        delete Map.tiles.RED_LIQUID;
        delete Map.tiles.BLUE_LIQUID;
        delete Map.tiles.RED_GAS;
        delete Map.tiles.BLUE_GAS;
        delete Map.tiles.ENTER;
        delete Map.tiles.LOW_CHANCE;
    });

    test('dump', () => {
        const cell = GW.make.cell('WALL');
        expect(cell.dump()).toEqual('#');

        cell.item = UTILS.makeItem();
        expect(cell.dump()).toEqual('!');

        cell.actor = UTILS.makeActor();
        expect(cell.dump()).toEqual('@');

        const empty = GW.make.cell();
        expect(empty.dump()).toEqual(Map.tiles.NULL.sprite.ch);
    });

    test('description + flavor + name', () => {
        const cell = GW.make.cell('WALL');
        expect(cell.tileDesc()).toEqual('A wall made from rough cut stone.');
        expect(cell.tileFlavor()).toEqual('a rough stone wall');
        expect(cell.getName()).toEqual('stone wall');
        expect(cell.getName(true)).toEqual('a stone wall');
        expect(cell.getName('the')).toEqual('the stone wall');
    });

    test('changed', () => {
        const cell = GW.make.cell('FLOOR');
        expect(cell.changed).toBeTruthy();
        expect(cell.flags & Map.cell.Flags.CELL_CHANGED).toBeTruthy();
        cell.changed = false;
        expect(cell.changed).toBeFalsy();
        expect(cell.flags & Map.cell.Flags.CELL_CHANGED).toBeFalsy();
        cell.changed = true;
        expect(cell.changed).toBeTruthy();
        expect(cell.flags & Map.cell.Flags.CELL_CHANGED).toBeTruthy();
    });

    test('copy + clear', () => {
        const cell = GW.make.cell('LAKE');
        cell.setTile('BRIDGE');
        cell.storeMemory();

        const other = GW.make.cell();
        expect(other.memory.mixer.ch).toEqual(-1);
        expect(other.memory.tileFlags).toEqual(0);

        other.copy(cell);
        expect(other.hasTile('LAKE')).toBeTruthy();
        expect(other.hasTile('BRIDGE')).toBeTruthy();
        expect(other.isClear()).toBeFalsy();
        expect(other.memory.mixer).not.toBe(cell.memory.mixer);
        expect(other.memory.mixer.ch).toEqual(cell.memory.mixer.ch);
        expect(other.memory.tileFlags).toEqual(cell.memory.tileFlags);

        other.clear();
        expect(other.hasTile('LAKE')).toBeFalsy();
        expect(other.isClear()).toBeTruthy();
    });

    test('isRevealed', () => {
        const cell = GW.make.cell();
        expect(cell.isRevealed()).toBeFalsy();
        expect(cell.isRevealed(true)).toBeFalsy();
        cell.setFlags(Map.cell.Flags.MAGIC_MAPPED);
        expect(cell.isRevealed()).toBeFalsy();
        expect(cell.isRevealed(true)).toBeTruthy();
        cell.markRevealed();
        expect(cell.isRevealed()).toBeTruthy();
        expect(cell.isRevealed(true)).toBeTruthy();
    });

    test('listInSidebar', () => {
        const cell = GW.make.cell('UP_STAIRS');
        expect(cell.isAnyKindOfVisible()).toBeTruthy();
        expect(cell.listInSidebar()).toBeTruthy();
        cell.clearFlags(Map.cell.Flags.ANY_KIND_OF_VISIBLE);
        expect(cell.listInSidebar()).toBeFalsy(); // remembers clear cell
        cell.storeMemory();
        expect(cell.listInSidebar()).toBeTruthy();
    });

    test('hasVisibleLight', () => {
        const cell = GW.make.cell('FLOOR');
        expect(cell.light).toEqual([100, 100, 100]);
        expect(cell.hasVisibleLight()).toBeTruthy();
        cell.light = [0, 0, 0];
        expect(cell.hasVisibleLight()).toBeFalsy();
    });

    test('isDark', () => {
        const cell = GW.make.cell('FLOOR');
        expect(cell.light).toEqual([100, 100, 100]);
        expect(cell.isDark()).toBeFalsy();
        cell.light = [0, 0, 0];
        expect(cell.isDark()).toBeTruthy();
    });

    test('lightChanged', () => {
        const cell = GW.make.cell('FLOOR');
        expect(cell.flags & Map.cell.Flags.LIGHT_CHANGED).toBeFalsy();
        expect(cell.lightChanged).toBeFalsy();
        cell.lightChanged = true;
        expect(cell.flags & Map.cell.Flags.LIGHT_CHANGED).toBeTruthy();
        expect(cell.lightChanged).toBeTruthy();
        cell.lightChanged = false;
        expect(cell.flags & Map.cell.Flags.LIGHT_CHANGED).toBeFalsy();
        expect(cell.lightChanged).toBeFalsy();
    });

    test('layerFlags', () => {
        const cell = GW.make.cell('WALL');

        cell.clearFlags(Map.cell.Flags.ANY_KIND_OF_VISIBLE);
        expect(cell.layerFlags()).toEqual(Map.layer.Flags.L_BLOCKS_EVERYTHING);
        expect(cell.layerFlags(true)).toEqual(0);
        cell.storeMemory();
        expect(cell.layerFlags()).toEqual(Map.layer.Flags.L_BLOCKS_EVERYTHING);
        expect(cell.layerFlags(true)).toEqual(
            Map.layer.Flags.L_BLOCKS_EVERYTHING
        );
    });

    test('tileFlags', () => {
        const tile = GW.make.tile({
            id: 'FIRE_TRAP',
            flags: 'T_SPONTANEOUSLY_IGNITES, T_IS_FLAMMABLE',
            ch: '.',
            fg: 'gray',
        });

        expect(tile.flags.tile).toEqual(
            Map.tile.Flags.T_SPONTANEOUSLY_IGNITES |
                Map.tile.Flags.T_IS_FLAMMABLE
        );
        const cell = GW.make.cell(tile);

        cell.clearFlags(Map.cell.Flags.ANY_KIND_OF_VISIBLE);
        expect(cell.tileFlags()).toEqual(
            Map.tile.Flags.T_SPONTANEOUSLY_IGNITES |
                Map.tile.Flags.T_IS_FLAMMABLE
        );
        expect(cell.tileFlags(true)).toEqual(0);
        cell.storeMemory();
        expect(cell.tileFlags()).toEqual(
            Map.tile.Flags.T_SPONTANEOUSLY_IGNITES |
                Map.tile.Flags.T_IS_FLAMMABLE
        );
        expect(cell.tileFlags(true)).toEqual(
            Map.tile.Flags.T_SPONTANEOUSLY_IGNITES |
                Map.tile.Flags.T_IS_FLAMMABLE
        );
    });

    test.skip('tileMechFlags', () => {
        // const cell = GW.make.cell("UP_STAIRS");
        // cell.clearFlags(Map.cell.Flags.ANY_KIND_OF_VISIBLE);
        // expect(cell.tileMechFlags()).toEqual(
        //   Map.tile.MechFlags.TM_VISUALLY_DISTINCT |
        //     Map.tile.MechFlags.TM_LIST_IN_SIDEBAR
        // );
        // expect(cell.tileMechFlags(true)).toEqual(0);
        // cell.storeMemory();
        // expect(cell.tileMechFlags()).toEqual(
        //   Map.tile.MechFlags.TM_VISUALLY_DISTINCT |
        //     Map.tile.MechFlags.TM_LIST_IN_SIDEBAR
        // );
        // expect(cell.tileMechFlags(true)).toEqual(
        //   Map.tile.MechFlags.TM_VISUALLY_DISTINCT |
        //     Map.tile.MechFlags.TM_LIST_IN_SIDEBAR
        // );
    });

    test('hasLayerFlag + hasAllLayerFlags', () => {
        const cell = GW.make.cell('WALL');
        expect(
            cell.hasLayerFlag(Map.layer.Flags.L_SECRETLY_PASSABLE)
        ).toBeFalsy();
        expect(cell.hasLayerFlag(Map.layer.Flags.L_BLOCKS_MOVE)).toBeTruthy();
        expect(
            cell.hasAllLayerFlags(
                Map.layer.Flags.L_SECRETLY_PASSABLE |
                    Map.layer.Flags.L_BLOCKS_MOVE
            )
        ).toBeFalsy();
        expect(
            cell.hasAllLayerFlags(
                Map.layer.Flags.L_BLOCKS_VISION | Map.layer.Flags.L_BLOCKS_MOVE
            )
        ).toBeTruthy();
    });

    test('hasTileFlag + hasAllTileFlags', () => {
        const tile = GW.make.tile({
            id: 'FIRE_TRAP',
            flags: 'T_SPONTANEOUSLY_IGNITES, T_IS_FLAMMABLE',
            ch: '.',
            fg: 'gray',
        });

        expect(tile.flags.tile).toEqual(
            Map.tile.Flags.T_SPONTANEOUSLY_IGNITES |
                Map.tile.Flags.T_IS_FLAMMABLE
        );
        const cell = GW.make.cell(tile);
        expect(
            cell.hasTileFlag(Map.tile.Flags.T_SPONTANEOUSLY_IGNITES)
        ).toBeTruthy();
        expect(cell.hasTileFlag(Map.tile.Flags.T_AUTO_DESCENT)).toBeFalsy();
        expect(
            cell.hasAllTileFlags(
                Map.tile.Flags.T_SPONTANEOUSLY_IGNITES |
                    Map.tile.Flags.T_AUTO_DESCENT
            )
        ).toBeFalsy();
        expect(
            cell.hasAllTileFlags(
                Map.tile.Flags.T_SPONTANEOUSLY_IGNITES |
                    Map.tile.Flags.T_IS_FLAMMABLE
            )
        ).toBeTruthy();
    });

    test.skip('hasTileMechFlag + hasAllTileMechFlags', () => {
        // const cell = GW.make.cell("UP_STAIRS");
        // expect(
        //   cell.hasTileMechFlag(Map.tile.MechFlags.TM_ALLOWS_SUBMERGING)
        // ).toBeFalsy();
        // expect(
        //   cell.hasTileMechFlag(Map.tile.MechFlags.TM_VISUALLY_DISTINCT)
        // ).toBeTruthy();
        // expect(
        //   cell.hasAllTileMechFlags(
        //     Map.tile.MechFlags.TM_ALLOWS_SUBMERGING |
        //       Map.tile.MechFlags.TM_VISUALLY_DISTINCT
        //   )
        // ).toBeFalsy();
        // expect(
        //   cell.hasAllTileMechFlags(
        //     Map.tile.MechFlags.TM_LIST_IN_SIDEBAR |
        //       Map.tile.MechFlags.TM_VISUALLY_DISTINCT
        //   )
        // ).toBeTruthy();
    });

    test('hasFlag', () => {
        const cell = GW.make.cell('FLOOR');
        expect(cell.hasFlag(Map.cell.Flags.HAS_DORMANT_MONSTER)).toBeFalsy();
        expect(
            cell.hasFlag(Map.cell.Flags.HAS_DORMANT_MONSTER, true)
        ).toBeFalsy();
        cell.flags |= Map.cell.Flags.HAS_DORMANT_MONSTER;
        expect(cell.hasFlag(Map.cell.Flags.HAS_DORMANT_MONSTER)).toBeTruthy();
        expect(
            cell.hasFlag(Map.cell.Flags.HAS_DORMANT_MONSTER, true)
        ).toBeTruthy();

        cell.clearFlags(Map.cell.Flags.ANY_KIND_OF_VISIBLE);
        expect(cell.hasFlag(Map.cell.Flags.HAS_DORMANT_MONSTER)).toBeTruthy();
        expect(
            cell.hasFlag(Map.cell.Flags.HAS_DORMANT_MONSTER, true)
        ).toBeFalsy();
        cell.storeMemory();
        expect(cell.hasFlag(Map.cell.Flags.HAS_DORMANT_MONSTER)).toBeTruthy();
        expect(
            cell.hasFlag(Map.cell.Flags.HAS_DORMANT_MONSTER, true)
        ).toBeTruthy();
    });

    test('hasMechFlag', () => {
        const cell = GW.make.cell('FLOOR');
        expect(cell.hasMechFlag(Map.cell.MechFlags.IS_IN_LOOP)).toBeFalsy();
        expect(
            cell.hasMechFlag(Map.cell.MechFlags.IS_IN_LOOP, true)
        ).toBeFalsy();
        cell.mechFlags |= Map.cell.MechFlags.IS_IN_LOOP;
        expect(cell.hasMechFlag(Map.cell.MechFlags.IS_IN_LOOP)).toBeTruthy();
        expect(
            cell.hasMechFlag(Map.cell.MechFlags.IS_IN_LOOP, true)
        ).toBeTruthy();

        cell.clearFlags(Map.cell.Flags.ANY_KIND_OF_VISIBLE);
        expect(cell.hasMechFlag(Map.cell.MechFlags.IS_IN_LOOP)).toBeTruthy();
        expect(
            cell.hasMechFlag(Map.cell.MechFlags.IS_IN_LOOP, true)
        ).toBeFalsy();
        cell.storeMemory();
        expect(cell.hasMechFlag(Map.cell.MechFlags.IS_IN_LOOP)).toBeTruthy();
        expect(
            cell.hasMechFlag(Map.cell.MechFlags.IS_IN_LOOP, true)
        ).toBeTruthy();
    });

    test('hasTile', () => {
        const cell = GW.make.cell('BRIDGE');
        expect(cell.hasTile('WALL')).toBeFalsy();
        expect(cell.hasTile('LAKE')).toBeTruthy();
        expect(cell.hasTile(Map.tiles.BRIDGE)).toBeTruthy();
    });

    test('tileWithFlag', () => {
        const cell = GW.make.cell('FLOOR');
        expect(cell.tileWithFlag(Map.tile.Flags.T_BRIDGE)).toBeNull();
        cell.setTile('BRIDGE');
        expect(cell.tileWithFlag(Map.tile.Flags.T_BRIDGE)).toBe(
            Map.tiles.BRIDGE
        );
    });

    test.skip('tileWithMechFlag', () => {
        // const cell = GW.make.cell("FLOOR");
        // expect(
        //   cell.tileWithMechFlag(Map.tile.MechFlags.TM_VISUALLY_DISTINCT)
        // ).toBeNull();
        // cell.setTile("BRIDGE");
        // expect(cell.tileWithMechFlag(Map.tile.MechFlags.TM_VISUALLY_DISTINCT)).toBe(
        //   Map.tiles.BRIDGE
        // );
    });

    test('isEmpty', () => {
        const cell = GW.make.cell('FLOOR');
        expect(cell.isEmpty()).toBeTruthy();

        cell.actor = UTILS.makeActor();
        expect(cell.isEmpty()).toBeFalsy();

        cell.item = UTILS.makeItem();
        expect(cell.isEmpty()).toBeFalsy();

        cell.actor = null;
        expect(cell.isEmpty()).toBeFalsy();

        cell.item = null;
        expect(cell.isEmpty()).toBeTruthy();
    });

    test('isWalkableNow + isMoveableNow - Bridge', () => {
        const cell = GW.make.cell('LAKE');
        expect(cell.isAnyKindOfVisible()).toBeTruthy();
        expect(cell.isWalkableNow()).toBeFalsy();
        expect(cell.isWalkableNow(true)).toBeFalsy();
        expect(cell.isMoveableNow()).toBeTruthy();
        expect(cell.isMoveableNow(true)).toBeTruthy();
        cell.clearFlags(Map.cell.Flags.ANY_KIND_OF_VISIBLE);
        expect(cell.isAnyKindOfVisible()).toBeFalsy();
        expect(cell.isWalkableNow()).toBeFalsy();
        expect(cell.isWalkableNow(true)).toBeTruthy(); // remembers before 'LAKE' (clear cell)
        expect(cell.isMoveableNow()).toBeTruthy();
        expect(cell.isMoveableNow(true)).toBeTruthy();
        cell.storeMemory();
        expect(cell.isWalkableNow()).toBeFalsy();
        expect(cell.isWalkableNow(true)).toBeFalsy();
        expect(cell.isMoveableNow()).toBeTruthy();
        expect(cell.isMoveableNow(true)).toBeTruthy();

        cell.flags |= Map.cell.Flags.VISIBLE;
        cell.setTile('BRIDGE');
        expect(cell.isAnyKindOfVisible()).toBeTruthy();
        expect(cell.isWalkableNow()).toBeTruthy();
        expect(cell.isWalkableNow(true)).toBeTruthy();
        expect(cell.isMoveableNow()).toBeTruthy();
        expect(cell.isMoveableNow(true)).toBeTruthy();
        cell.clearFlags(Map.cell.Flags.ANY_KIND_OF_VISIBLE);
        expect(cell.isAnyKindOfVisible()).toBeFalsy();
        expect(cell.isWalkableNow()).toBeTruthy();
        expect(cell.isWalkableNow(true)).toBeFalsy(); // remembers LAKE only
        expect(cell.isMoveableNow()).toBeTruthy();
        expect(cell.isMoveableNow(true)).toBeTruthy();
        cell.storeMemory();
        expect(cell.isWalkableNow()).toBeTruthy();
        expect(cell.isWalkableNow(true)).toBeTruthy();
        expect(cell.isMoveableNow()).toBeTruthy();
        expect(cell.isMoveableNow(true)).toBeTruthy();
    });

    test('isWalkableNow + canBeWalked', () => {
        const cell = GW.make.cell('FLOOR');
        expect(cell.isAnyKindOfVisible()).toBeTruthy();
        expect(cell.isWalkableNow()).toBeTruthy();
        expect(cell.isWalkableNow(true)).toBeTruthy();
        expect(cell.canBeWalked()).toBeTruthy();
        expect(cell.canBeWalked(true)).toBeTruthy();
        cell.clearFlags(Map.cell.Flags.ANY_KIND_OF_VISIBLE);
        expect(cell.isAnyKindOfVisible()).toBeFalsy();
        expect(cell.isWalkableNow()).toBeTruthy();
        expect(cell.isWalkableNow(true)).toBeTruthy();
        expect(cell.canBeWalked()).toBeTruthy();
        expect(cell.canBeWalked(true)).toBeTruthy();
        cell.storeMemory();
        expect(cell.isWalkableNow()).toBeTruthy();
        expect(cell.isWalkableNow(true)).toBeTruthy();
        expect(cell.canBeWalked()).toBeTruthy();
        expect(cell.canBeWalked(true)).toBeTruthy();

        cell.flags |= Map.cell.Flags.VISIBLE;
        cell.setTile('WALL');
        expect(cell.isAnyKindOfVisible()).toBeTruthy();
        expect(cell.isWalkableNow()).toBeFalsy();
        expect(cell.isWalkableNow(true)).toBeFalsy();
        expect(cell.canBeWalked()).toBeFalsy();
        expect(cell.canBeWalked(true)).toBeFalsy();
        cell.clearFlags(Map.cell.Flags.ANY_KIND_OF_VISIBLE);
        expect(cell.isAnyKindOfVisible()).toBeFalsy();
        expect(cell.isWalkableNow()).toBeFalsy();
        expect(cell.isWalkableNow(true)).toBeTruthy(); // remembers FLOOR
        expect(cell.canBeWalked()).toBeFalsy();
        expect(cell.canBeWalked(true)).toBeTruthy();
        cell.storeMemory();
        expect(cell.isWalkableNow()).toBeFalsy();
        expect(cell.isWalkableNow(true)).toBeFalsy();
        expect(cell.canBeWalked()).toBeFalsy();
        expect(cell.canBeWalked(true)).toBeFalsy();

        const SECRET_DOOR = new Tile({
            id: 'SECRET_DOOR',
            Extends: 'DOOR',
            flags: 'L_SECRETLY_PASSABLE, L_BLOCKS_MOVE, L_BLOCKS_VISION',
            activates: {
                discover: { tile: 'DOOR' },
                open: false,
                enter: false,
            },
        });

        cell.flags |= Map.cell.Flags.VISIBLE;
        cell.setTile(SECRET_DOOR);
        expect(cell.isAnyKindOfVisible()).toBeTruthy();
        expect(cell.isWalkableNow()).toBeFalsy();
        expect(cell.isWalkableNow(true)).toBeFalsy();
        expect(cell.canBeWalked()).toBeTruthy();
        expect(cell.canBeWalked(true)).toBeTruthy();
        cell.clearFlags(Map.cell.Flags.ANY_KIND_OF_VISIBLE);
        expect(cell.isAnyKindOfVisible()).toBeFalsy();
        expect(cell.isWalkableNow()).toBeFalsy();
        expect(cell.isWalkableNow(true)).toBeFalsy(); // Remembers WALL
        expect(cell.canBeWalked()).toBeTruthy();
        expect(cell.canBeWalked(true)).toBeFalsy(); // Remembers WALL
        cell.storeMemory();
        expect(cell.isWalkableNow()).toBeFalsy();
        expect(cell.isWalkableNow(true)).toBeFalsy();
        expect(cell.canBeWalked()).toBeTruthy();
        expect(cell.canBeWalked(true)).toBeTruthy();
    });

    test('isWall', () => {
        const cell = GW.make.cell('FLOOR');
        expect(cell.isAnyKindOfVisible()).toBeTruthy();
        expect(cell.isWall()).toBeFalsy();
        expect(cell.isWall(true)).toBeFalsy();
        cell.clearFlags(Map.cell.Flags.ANY_KIND_OF_VISIBLE);
        expect(cell.isAnyKindOfVisible()).toBeFalsy();
        expect(cell.isWall()).toBeFalsy();
        expect(cell.isWall(true)).toBeFalsy();
        cell.storeMemory();
        expect(cell.isWall()).toBeFalsy();
        expect(cell.isWall(true)).toBeFalsy();

        cell.flags |= Map.cell.Flags.VISIBLE;
        cell.setTile('WALL');
        expect(cell.isAnyKindOfVisible()).toBeTruthy();
        expect(cell.isWall()).toBeTruthy();
        expect(cell.isWall(true)).toBeTruthy();
        cell.clearFlags(Map.cell.Flags.ANY_KIND_OF_VISIBLE);
        expect(cell.isAnyKindOfVisible()).toBeFalsy();
        expect(cell.isWall()).toBeTruthy();
        expect(cell.isWall(true)).toBeFalsy(); // remembers a FLOOR
        cell.storeMemory();
        expect(cell.isWall()).toBeTruthy();
        expect(cell.isWall(true)).toBeTruthy();

        cell.flags |= Map.cell.Flags.VISIBLE;
        cell.setTile('DOOR');
        expect(cell.isAnyKindOfVisible()).toBeTruthy();
        expect(cell.isWall()).toBeFalsy();
        expect(cell.isWall(true)).toBeFalsy();
        cell.clearFlags(Map.cell.Flags.ANY_KIND_OF_VISIBLE);
        expect(cell.isAnyKindOfVisible()).toBeFalsy();
        expect(cell.isWall()).toBeFalsy();
        expect(cell.isWall(true)).toBeTruthy(); // remembers a WALL
        cell.storeMemory();
        expect(cell.isWall()).toBeFalsy();
        expect(cell.isWall(true)).toBeFalsy();
    });

    test('isObstruction', () => {
        const cell = GW.make.cell('FLOOR');
        expect(cell.isAnyKindOfVisible()).toBeTruthy();
        expect(cell.isObstruction()).toBeFalsy();
        expect(cell.isObstruction(true)).toBeFalsy();
        cell.clearFlags(Map.cell.Flags.ANY_KIND_OF_VISIBLE);
        expect(cell.isAnyKindOfVisible()).toBeFalsy();
        expect(cell.isObstruction()).toBeFalsy();
        expect(cell.isObstruction(true)).toBeFalsy();
        cell.storeMemory();
        expect(cell.isObstruction()).toBeFalsy();
        expect(cell.isObstruction(true)).toBeFalsy();

        cell.flags |= Map.cell.Flags.VISIBLE;
        cell.setTile('WALL');
        expect(cell.isAnyKindOfVisible()).toBeTruthy();
        expect(cell.isObstruction()).toBeTruthy();
        expect(cell.isObstruction(true)).toBeTruthy();
        cell.clearFlags(Map.cell.Flags.ANY_KIND_OF_VISIBLE);
        expect(cell.isAnyKindOfVisible()).toBeFalsy();
        expect(cell.isObstruction()).toBeTruthy();
        expect(cell.isObstruction(true)).toBeFalsy(); // remembers a FLOOR
        cell.storeMemory();
        expect(cell.isObstruction()).toBeTruthy();
        expect(cell.isObstruction(true)).toBeTruthy();
    });

    test('isDoorway', () => {
        const cell = GW.make.cell('FLOOR');
        expect(cell.isAnyKindOfVisible()).toBeTruthy();
        expect(cell.isDoorway()).toBeFalsy();
        expect(cell.isDoorway(true)).toBeFalsy();
        cell.clearFlags(Map.cell.Flags.ANY_KIND_OF_VISIBLE);
        expect(cell.isAnyKindOfVisible()).toBeFalsy();
        expect(cell.isDoorway()).toBeFalsy();
        expect(cell.isDoorway(true)).toBeFalsy();
        cell.storeMemory();
        expect(cell.isDoorway()).toBeFalsy();
        expect(cell.isDoorway(true)).toBeFalsy();

        cell.flags |= Map.cell.Flags.VISIBLE;
        cell.setTile('DOOR');
        expect(cell.isAnyKindOfVisible()).toBeTruthy();
        expect(cell.isDoorway()).toBeTruthy();
        expect(cell.isDoorway(true)).toBeTruthy();
        cell.clearFlags(Map.cell.Flags.ANY_KIND_OF_VISIBLE);
        expect(cell.isAnyKindOfVisible()).toBeFalsy();
        expect(cell.isDoorway()).toBeTruthy();
        expect(cell.isDoorway(true)).toBeFalsy(); // remembers a FLOOR
        cell.storeMemory();
        expect(cell.isDoorway()).toBeTruthy();
        expect(cell.isDoorway(true)).toBeTruthy();
    });

    test('isSecretDoorway', () => {
        const cell = GW.make.cell('FLOOR');

        expect(cell.isAnyKindOfVisible()).toBeTruthy();
        expect(cell.isSecretDoorway()).toBeFalsy();
        expect(cell.isSecretDoorway(true)).toBeFalsy();

        cell.storeMemory();
        cell.clearFlags(Map.cell.Flags.ANY_KIND_OF_VISIBLE);

        expect(cell.isAnyKindOfVisible()).toBeFalsy();
        expect(cell.isSecretDoorway()).toBeFalsy();
        expect(cell.isSecretDoorway(true)).toBeFalsy();

        const SECRET_DOOR = new Tile({
            id: 'SECRET_DOOR',
            Extends: 'DOOR',
            flags: 'L_SECRETLY_PASSABLE, L_BLOCKS_MOVE, L_BLOCKS_VISION',
            activates: {
                discover: { tile: 'DOOR' },
                open: false,
                enter: false,
            },
        });

        expect(
            SECRET_DOOR.flags.layer & Map.layer.Flags.L_SECRETLY_PASSABLE
        ).toBeTruthy();

        cell.setTile(SECRET_DOOR);
        cell.setFlags(Map.cell.Flags.VISIBLE);
        expect(cell.isAnyKindOfVisible()).toBeTruthy();
        expect(cell.isSecretDoorway()).toBeTruthy();
        expect(cell.isSecretDoorway(true)).toBeFalsy(); // memory is of 'FLOOR'

        cell.storeMemory();
        cell.clearFlags(Map.cell.Flags.ANY_KIND_OF_VISIBLE);

        expect(
            cell.memory.layerFlags & Map.layer.Flags.L_SECRETLY_PASSABLE
        ).toBeTruthy();

        expect(cell.isAnyKindOfVisible()).toBeFalsy();
        expect(cell.isSecretDoorway()).toBeTruthy();
        expect(cell.isSecretDoorway(true)).toBeFalsy(); // If you know it is a secret door then you have discovered it and it is no longer a secret door!
    });

    test('blocksPathing', () => {
        const cell = GW.make.cell('FLOOR');
        expect(cell.blocksPathing()).toBeFalsy();
        expect(cell.blocksPathing(true)).toBeFalsy();
        cell.setTile('WALL');
        expect(
            Map.tiles.WALL.flags.layer & Map.layer.Flags.L_BLOCKS_MOVE
        ).toBeTruthy();
        expect(cell.blocksPathing()).toBeTruthy();
        expect(cell.blocksPathing(true)).toBeTruthy();

        cell.flags &= ~Map.cell.Flags.IS_WAS_ANY_KIND_OF_VISIBLE;
        expect(cell.blocksPathing()).toBeTruthy();
        expect(cell.blocksPathing(true)).toBeFalsy();

        cell.storeMemory();
        expect(cell.blocksPathing()).toBeTruthy();
        expect(cell.blocksPathing(true)).toBeTruthy();
    });

    test('blocksVision', () => {
        const cell = GW.make.cell('FLOOR');
        expect(cell.blocksVision()).toBeFalsy();
        cell.setTile('WALL');
        expect(cell.blocksVision()).toBeTruthy();
    });

    test('isLiquid', () => {
        const cell = GW.make.cell('FLOOR');

        expect(cell.isLiquid()).toBeFalsy();
        expect(cell.isLiquid(true)).toBeFalsy();

        cell.setTile('BLUE_LIQUID', 100);
        expect(
            Map.tiles.BLUE_LIQUID.flags.tile & Map.tile.Flags.T_IS_DEEP_LIQUID
        ).toBeFalsy();
        expect(cell.isAnyKindOfVisible()).toBeTruthy();
        expect(cell.isLiquid()).toBeFalsy();
        expect(cell.isLiquid(true)).toBeFalsy();

        cell.setTile('LAKE');
        expect(
            Map.tiles.LAKE.flags.tile & Map.tile.Flags.T_IS_DEEP_LIQUID
        ).toBeTruthy();
        expect(cell.isLiquid()).toBeTruthy();
        expect(cell.isLiquid(true)).toBeTruthy();

        cell.flags &= ~Map.cell.Flags.ANY_KIND_OF_VISIBLE;
        expect(cell.isAnyKindOfVisible()).toBeFalsy();
        expect(cell.isLiquid()).toBeTruthy();
        expect(cell.isLiquid(true)).toBeFalsy();

        cell.storeMemory();
        expect(cell.isLiquid()).toBeTruthy();
        expect(cell.isLiquid(true)).toBeTruthy();
    });

    test('hasGas', () => {
        const cell = GW.make.cell('FLOOR');

        expect(cell.hasGas()).toBeFalsy();
        expect(cell.hasGas(true)).toBeFalsy();

        cell.setTile('RED_GAS', 100);
        expect(cell.isAnyKindOfVisible()).toBeTruthy();
        expect(cell.hasGas()).toBeTruthy();
        expect(cell.hasGas(true)).toBeTruthy();

        cell.flags &= ~Map.cell.Flags.ANY_KIND_OF_VISIBLE;
        expect(cell.isAnyKindOfVisible()).toBeFalsy();
        expect(cell.hasGas()).toBeTruthy();
        expect(cell.hasGas(true)).toBeFalsy();

        cell.storeMemory();
        expect(cell.hasGas()).toBeTruthy();
        expect(cell.hasGas(true)).toBeTruthy();
    });

    test('markRevealed', () => {
        const cell = GW.make.cell('FLOOR');
        expect(cell.flags & Map.cell.Flags.REVEALED).toBeFalsy();
        expect(cell.markRevealed()).toBeTruthy();
        expect(cell.flags & Map.cell.Flags.REVEALED).toBeTruthy();

        cell.flags |= Map.cell.Flags.STABLE_MEMORY;
        expect(cell.markRevealed()).toBeFalsy();
        expect(cell.flags & Map.cell.Flags.STABLE_MEMORY).toBeFalsy();

        cell.setTile('WALL');
        cell.flags = 0;
        expect(cell.flags & Map.cell.Flags.REVEALED).toBeFalsy();
        expect(cell.markRevealed()).toBeFalsy(); // no open space revealed
        expect(cell.flags & Map.cell.Flags.REVEALED).toBeTruthy();
    });

    test('setTile(null) - can clear tile', () => {
        const c = GW.make.cell();
        expect(c.ground).toBeNull();
        c.needsRedraw = false;

        c.setTile('FLOOR');
        expect(c.ground).toEqual('FLOOR');
        expect(c.needsRedraw).toBeTruthy();
        c.needsRedraw = false;

        c.setTile(null);
        expect(c.ground).toEqual(null);
        expect(c.needsRedraw).toBeTruthy();
    });

    test('setTile(BRIDGE) will also set ground if null', () => {
        const cell = GW.make.cell();
        expect(cell.isClear()).toBeTruthy();
        expect(cell.ground).toBeNull();
        expect(cell.surface).toBeNull();

        cell.setTile('BRIDGE');
        expect(cell.ground).toEqual('LAKE');
        expect(cell.surface).toEqual('BRIDGE');
        expect(cell.isClear()).toBeFalsy();
    });

    test('setTile(FIRE) - sets caught fire flag', () => {
        const fire = GW.make.tile({
            id: 'FIRE',
            flags: 'T_IS_FIRE',
            ch: '^',
            fg: 'red',
        });

        const cell = GW.make.cell('FLOOR');
        cell.setTile(fire);
        expect(
            cell.mechFlags & Map.cell.MechFlags.CAUGHT_FIRE_THIS_TURN
        ).toBeTruthy();
    });

    test('setTile(UNKNOWN) - will throw', () => {
        const cell = GW.make.cell('FLOOR');
        expect(() => cell.setTile('UNKNOWN')).toThrow();
    });

    test('setTile', () => {
        const c = GW.make.cell();

        expect(Map.tiles.FLOOR.priority).toBeLessThan(Map.tiles.DOOR.priority);

        const floor = 'FLOOR';
        const wall = 'WALL';

        expect(c.ground).toEqual(null);
        c.setTile(floor);
        expect(c.ground).toEqual(floor);
        c.setTile(wall);
        expect(c.ground).toEqual(wall);
        // c.setTile(floor, true); // checks priority
        // expect(c.ground).toEqual(wall);  // 2 has better priority
        c.setTile(floor);
        expect(c.ground).toEqual(floor); // ignored priority
    });

    test('CellMemory - will copy another memory object', () => {
        const a = new Map.cell.CellMemory();
        const b = new Map.cell.CellMemory();

        a.mixer.draw('a');
        a.tileFlags = 1;
        a.cellFlags = 1;

        b.mixer.draw('b');
        b.tileFlags = 2;
        b.cellFlags = 2;

        expect(a.mixer).not.toBe(b.mixer);
        a.copy(b);
        expect(a.mixer).not.toBe(b.mixer);
        expect(a.mixer.ch).toEqual('b');
        expect(a.tileFlags).toEqual(2);
        expect(a.tileFlags).toEqual(2);

        a.clear();
        expect(a.mixer.ch).toEqual(-1);
        expect(a.mixer.fg.isNull()).toBeTruthy();
        expect(a.tileFlags).toEqual(0);
        expect(a.cellFlags).toEqual(0);
    });

    test('item', () => {
        const cell = GW.make.cell('FLOOR');
        expect(cell.item).toBeNull();

        const item = UTILS.makeItem();

        cell.changed = false;
        expect(cell.flags & Map.cell.Flags.HAS_ITEM).toBeFalsy();

        cell.item = item;
        expect(cell.flags & Map.cell.Flags.HAS_ITEM).toBeTruthy();
        expect(cell.flags & Map.cell.Flags.CELL_CHANGED).toBeTruthy();
        expect(cell.changed).toBeTruthy();

        cell.changed = false;
        cell.item = null;
        expect(cell.flags & Map.cell.Flags.HAS_ITEM).toBeFalsy();
        expect(cell.flags & Map.cell.Flags.CELL_CHANGED).toBeTruthy();
        expect(cell.changed).toBeTruthy();
    });

    test('actor', () => {
        const cell = GW.make.cell('FLOOR');
        expect(cell.actor).toBeNull();

        const actor = UTILS.makeActor();
        cell.changed = false;
        expect(cell.flags & Map.cell.Flags.HAS_ANY_ACTOR).toBeFalsy();

        cell.actor = actor;
        expect(cell.flags & Map.cell.Flags.HAS_ANY_ACTOR).toBeTruthy();
        expect(cell.flags & Map.cell.Flags.CELL_CHANGED).toBeTruthy();
        expect(cell.changed).toBeTruthy();

        cell.changed = false;
        cell.actor = null;
        expect(cell.flags & Map.cell.Flags.HAS_ANY_ACTOR).toBeFalsy();
        expect(cell.flags & Map.cell.Flags.CELL_CHANGED).toBeTruthy();
        expect(cell.changed).toBeTruthy();
    });

    test('will keep layers in sorted order by layer, priority increasing', () => {
        const c = GW.make.cell();

        c.addLayer({ sprite: GW.make.sprite('@'), layer: 6 });
        expect(c.layers).toMatchObject({
            layer: {
                layer: 6,
                sprite: { ch: '@', fg: GW.colors.white, bg: -1 },
            },
            next: null,
        });

        c.addLayer({ sprite: GW.make.sprite('i'), layer: 4 });
        expect(c.layers).toMatchObject({
            layer: {
                layer: 4,
                sprite: { ch: 'i', fg: GW.colors.white, bg: -1 },
            },
        });
        expect(c.layers!.next).toMatchObject({
            layer: {
                layer: 6,
                sprite: { ch: '@', fg: GW.colors.white, bg: -1 },
            },
            next: null,
        });
    });

    test('can support many layers', () => {
        const c = GW.make.cell();
        c.setTile('FLOOR');

        const a = GW.sprite.make('@', 'white', 'blue');
        const b = GW.sprite.make(null, null, 'red');

        c.addLayer({ sprite: a, layer: Map.layer.Depth.FX });
        c.addLayer({ sprite: b, layer: Map.layer.Depth.UI, priority: 100 });

        expect(c.layers).not.toBeNull();
        expect(c.layers!.layer.sprite).toBe(Map.tiles.FLOOR.sprite);
        expect(c.layers!.next!.layer.sprite).toBe(a);
        expect(c.layers!.next!.next!.layer.sprite).toBe(b);

        const app = new GW.sprite.Mixer();
        Map.cell.getAppearance(c, app);

        const ex = GW.sprite.make('@', 'white', 'red');
        expect(app).toEqual(ex);
    });

    test('layers will blend opacities', () => {
        GW.cosmetic.seed(12345);
        const c = GW.make.cell();
        c.setTile('FLOOR');

        const a = GW.make.layer({
            ch: '@',
            fg: 'white',
            bg: 'blue',
            layer: Map.layer.Depth.FX,
        });
        const b = GW.make.layer({
            bg: 'red',
            opacity: 50,
            layer: Map.layer.Depth.UI,
            priority: 100,
        });
        expect(b.sprite.opacity).toEqual(50);

        c.clearFlags(Map.cell.Flags.CELL_CHANGED);
        c.addLayer(a);
        expect(c.flags & Map.cell.Flags.CELL_CHANGED).toBeTruthy();
        c.addLayer(b);

        expect(c.layers).not.toBeNull();
        expect(c.layers!.next!.layer).toBe(a);
        expect(c.layers!.next!.next!.layer).toBe(b);

        const app = new GW.sprite.Mixer();
        Map.cell.getAppearance(c, app);

        const ex = GW.sprite.make('@', 'white', [50, 0, 50]);
        expect(app.ch).toEqual(ex.ch);
        expect(app.fg).toEqual(ex.fg);
        expect(app.bg).toEqual(ex.bg);

        c.clearFlags(Map.cell.Flags.CELL_CHANGED);
        c.removeLayer(a);
        expect(c.flags & Map.cell.Flags.CELL_CHANGED).toBeTruthy();
        c.removeLayer(b);

        app.blackOut();
        Map.cell.getAppearance(c, app);
        const FLOOR = Map.tiles.FLOOR.sprite;
        expect(app.ch).toEqual(FLOOR.ch);
        expect(app.fg).toBakeFrom(FLOOR.fg);
        expect(app.bg).toBakeFrom(FLOOR.bg);
    });

    test('getAppearance', () => {
        const cell: Map.cell.Cell = GW.make.cell();
        cell.setTile('UP_STAIRS');
        const app: GW.sprite.Mixer = GW.make.mixer();

        Map.cell.getAppearance(cell, app);
        const UP_STAIRS = Map.tiles.UP_STAIRS.sprite;
        expect(app.ch).toEqual(UP_STAIRS.ch);
        expect(app.fg).toBakeFrom(UP_STAIRS.fg);
        expect(app.bg).toBakeFrom(UP_STAIRS.bg);

        const memory = cell.memory.mixer;
        expect(memory.ch).toEqual(UP_STAIRS.ch);
        expect(memory.fg).toBakeFrom(UP_STAIRS.fg);
        expect(memory.bg).toBakeFrom(UP_STAIRS.bg);
    });

    test('memory', () => {
        const c = GW.make.cell('FLOOR');
        c.storeMemory();
        expect(c.memory.item).toBeNull();
        expect(c.memory.itemQuantity).toEqual(0);
        expect(c.memory.actor).toBeNull();
        expect(c.memory.tile).toBe(Map.tiles.FLOOR);
        expect(c.memory.cellFlags).toEqual(
            Map.cell.Flags.VISIBLE |
                Map.cell.Flags.IN_FOV |
                Map.cell.Flags.NEEDS_REDRAW |
                Map.cell.Flags.CELL_CHANGED
        );
        expect(c.memory.cellMechFlags).toEqual(0);
        expect(c.memory.tileFlags).toEqual(0);
        expect(c.memory.tileMechFlags).toEqual(0);
        const FLOOR = Map.tiles.FLOOR.sprite;
        expect(c.memory.mixer.ch).toEqual(FLOOR.ch);
        expect(c.memory.mixer.fg).toBakeFrom(FLOOR.fg);
        expect(c.memory.mixer.bg).toBakeFrom(FLOOR.bg);

        const item = UTILS.makeItem();

        const actor = UTILS.makeActor();

        c.item = item;
        c.actor = actor;

        c.storeMemory();
        expect(c.memory.item).toBe(item);
        expect(c.memory.itemQuantity).toEqual(item.quantity);
        expect(c.memory.actor).toBe(actor);
        expect(c.memory.tile).toBe(Map.tiles.FLOOR);
        expect(c.memory.cellFlags).toEqual(
            Map.cell.Flags.VISIBLE |
                Map.cell.Flags.IN_FOV |
                Map.cell.Flags.NEEDS_REDRAW |
                Map.cell.Flags.CELL_CHANGED |
                Map.cell.Flags.HAS_ANY_ACTOR |
                Map.cell.Flags.HAS_ITEM
        );
        expect(c.memory.cellMechFlags).toEqual(0);
        expect(c.memory.tileFlags).toEqual(0);
        expect(c.memory.tileMechFlags).toEqual(0);
        expect(c.memory.mixer.ch).toEqual(actor.sprite.ch);
        expect(c.memory.mixer.fg).toBakeFrom(actor.sprite.fg);
        expect(c.memory.mixer.bg).toBakeFrom(Map.tiles.FLOOR.sprite.bg);

        const otherCell = ({
            storeMemory: jest.fn().mockReturnValue(undefined),
            flags: 0,
        } as unknown) as GW.types.CellType;

        actor.rememberedInCell = otherCell;
        c.storeMemory();
        expect(otherCell.storeMemory).toHaveBeenCalled();
        expect(otherCell.flags).toBeGreaterThan(0);
    });

    test('will set liquid with volume', () => {
        GW.cosmetic.seed(12345);
        const FLOOR = Map.tiles.TEST_FLOOR;
        const c = GW.make.cell();
        c.setTile('TEST_FLOOR');

        const app = new GW.sprite.Mixer();
        Map.cell.getAppearance(c, app);
        expect(app.ch).toEqual(FLOOR.sprite.ch);
        expect(app.bg).toEqual([20, 20, 20, 0, 0, 0, 0]);
        expect(app.fg).toEqual([80, 80, 80, 0, 0, 0, 0]);

        expect(Map.tiles.RED_LIQUID).toBeObject();
        expect(Map.tiles.RED_LIQUID.layer).toEqual(Map.layer.Depth.LIQUID);

        c.setTile('RED_LIQUID', 100);
        expect(c.liquid).toEqual('RED_LIQUID');
        expect(c.liquidVolume).toEqual(100);
        Map.cell.getAppearance(c, app);
        expect(app.ch).toEqual(FLOOR.sprite.ch);
        expect(app.bg).toEqual([100, 0, 0, 0, 0, 0, 0]);
        expect(app.fg).toEqual([80, 80, 80, 0, 0, 0, 0]);

        c.clearLayer(Map.layer.Depth.LIQUID);
        expect(c.liquid).toEqual(null);
        expect(c.liquidVolume).toEqual(0);
        Map.cell.getAppearance(c, app);
        expect(app.ch).toEqual(FLOOR.sprite.ch);
        expect(app.bg).toEqual([20, 20, 20, 0, 0, 0, 0]);
        expect(app.fg).toEqual([80, 80, 80, 0, 0, 0, 0]);

        c.setTile('RED_LIQUID', 50);
        expect(c.liquid).toEqual('RED_LIQUID');
        expect(c.liquidVolume).toEqual(50);
        Map.cell.getAppearance(c, app);
        expect(app.ch).toEqual(FLOOR.sprite.ch);
        expect(app.bg).toEqual([100, 0, 0, 0, 0, 0, 0]);
        expect(app.fg).toEqual([80, 80, 80, 0, 0, 0, 0]);

        c.setTile('BLUE_LIQUID', 10);
        expect(c.liquid).toEqual('BLUE_LIQUID');
        expect(c.liquidVolume).toEqual(10);
        Map.cell.getAppearance(c, app);
        expect(app.ch).toEqual(FLOOR.sprite.ch);
        expect(app.bg).toEqual([0, 0, 100, 0, 0, 0, 0]);
        expect(app.fg).toEqual([80, 80, 80, 0, 0, 0, 0]);
    });

    test('will add liquid volumes', () => {
        GW.cosmetic.seed(12345);
        const FLOOR = Map.tiles.TEST_FLOOR;
        const c = GW.make.cell();
        c.setTile('TEST_FLOOR');

        const app = new GW.sprite.Mixer();
        Map.cell.getAppearance(c, app);
        expect(app.ch).toEqual(FLOOR.sprite.ch);
        expect(app.bg).toEqual([20, 20, 20, 0, 0, 0, 0]);
        expect(app.fg).toEqual([80, 80, 80, 0, 0, 0, 0]);

        c.setTile('RED_LIQUID', 10);
        expect(c.liquid).toEqual('RED_LIQUID');
        expect(c.liquidVolume).toEqual(10);

        c.setTile('RED_LIQUID', 10);
        expect(c.liquid).toEqual('RED_LIQUID');
        expect(c.liquidVolume).toEqual(20);

        c.setTile('RED_LIQUID', 10);
        expect(c.liquid).toEqual('RED_LIQUID');
        expect(c.liquidVolume).toEqual(30);

        c.setTile('BLUE_LIQUID', 10);
        expect(c.liquid).toEqual('BLUE_LIQUID');
        expect(c.liquidVolume).toEqual(10);

        c.clearLayer(Map.layer.Depth.LIQUID);
        expect(c.liquid).toEqual(null);
        expect(c.liquidVolume).toEqual(0);
    });

    test('will add gas volumes', () => {
        GW.cosmetic.seed(12345);
        const FLOOR = Map.tiles.TEST_FLOOR;
        const c = GW.make.cell();
        c.setTile('TEST_FLOOR');

        const app = new GW.sprite.Mixer();
        Map.cell.getAppearance(c, app);
        expect(app.ch).toEqual(FLOOR.sprite.ch);
        expect(app.bg).toEqual([20, 20, 20, 0, 0, 0, 0]);
        expect(app.fg).toEqual([80, 80, 80, 0, 0, 0, 0]);

        c.setTile('RED_GAS', 10);
        expect(c.gas).toEqual('RED_GAS');
        expect(c.gasVolume).toEqual(10);
        Map.cell.getAppearance(c, app);
        expect(app.ch).toEqual(FLOOR.sprite.ch);
        expect(app.bg).toEqual([100, 0, 0, 0, 0, 0, 0]);
        expect(app.fg).toEqual([80, 80, 80, 0, 0, 0, 0]);

        c.setTile('RED_GAS', 10);
        expect(c.gas).toEqual('RED_GAS');
        expect(c.gasVolume).toEqual(20);

        c.setTile('RED_GAS', 10);
        expect(c.gas).toEqual('RED_GAS');
        expect(c.gasVolume).toEqual(30);

        c.setTile('BLUE_GAS', 10);
        expect(c.gas).toEqual('BLUE_GAS');
        expect(c.gasVolume).toEqual(10);

        c.clearLayer(Map.layer.Depth.GAS);
        expect(c.gas).toEqual(null);
        expect(c.gasVolume).toEqual(0);
    });

    test('layers', () => {
        const cell = GW.make.cell('FLOOR');
        const mixer = new GW.make.mixer();
        const a = GW.make.layer({
            layer: Map.layer.Depth.FX,
            bg: 'blue',
            _n: 'a',
        });
        const b = GW.make.layer({
            layer: Map.layer.Depth.UI,
            ch: '!',
            fg: 'green',
            _n: 'b',
        });
        const c = GW.make.layer({
            layer: Map.layer.Depth.GROUND,
            ch: null,
            fg: 'red',
            _n: 'c',
        });
        const d = GW.make.layer({
            layer: Map.layer.Depth.UI,
            bg: 'yellow',
            _n: 'd',
        });
        const e = GW.make.layer({
            layer: Map.layer.Depth.FX,
            bg: 'orange',
            _n: 'e',
        });

        const FLOOR = Map.tiles.FLOOR.sprite;
        Map.cell.getAppearance(cell, mixer);
        expect(mixer.ch).toEqual(FLOOR.ch);
        expect(mixer.fg).toBakeFrom(FLOOR.fg);
        expect(mixer.bg).toBakeFrom(FLOOR.bg);

        cell.addLayer(a);
        Map.cell.getAppearance(cell, mixer);
        expect(mixer.ch).toEqual(FLOOR.ch);
        expect(mixer.fg).toBakeFrom(FLOOR.fg);
        expect(mixer.bg).toBakeFrom(GW.colors.blue);

        cell.addLayer(b);
        Map.cell.getAppearance(cell, mixer);
        expect(mixer.ch).toEqual(b.sprite.ch);
        expect(mixer.fg).toBakeFrom(GW.colors.green);
        expect(mixer.bg).toBakeFrom(GW.colors.blue);

        cell.addLayer(c);
        cell.addLayer(d);
        Map.cell.getAppearance(cell, mixer);
        expect(mixer.ch).toEqual(b.sprite.ch);
        expect(mixer.fg).toBakeFrom(GW.colors.green);
        expect(mixer.bg).toBakeFrom(GW.colors.yellow);

        expect(cell.removeLayer(e)).toBeFalsy();

        cell.removeLayer(d);
        Map.cell.getAppearance(cell, mixer);
        expect(mixer.ch).toEqual(b.sprite.ch);
        expect(mixer.fg).toBakeFrom(GW.colors.green);
        expect(mixer.bg).toBakeFrom(GW.colors.blue);

        cell.removeLayer(c);
        cell.removeLayer(a);
        Map.cell.getAppearance(cell, mixer);
        expect(mixer.ch).toEqual(b.sprite.ch);
        expect(mixer.fg).toBakeFrom(GW.colors.green);
        expect(mixer.bg).toBakeFrom(FLOOR.bg);

        cell.removeLayer(b);
        Map.cell.getAppearance(cell, mixer);
        expect(mixer.ch).toEqual(FLOOR.ch);
        expect(mixer.fg).toBakeFrom(FLOOR.fg);
        expect(mixer.bg).toBakeFrom(FLOOR.bg);

        cell.addLayer(b); // { sprite: b, layer: Map.layer.Depth.FX });
        cell.addLayer(a); // { sprite: a, layer: Map.layer.Depth.UI });
        Map.cell.getAppearance(cell, mixer);
        expect(mixer.ch).toEqual(b.sprite.ch);
        expect(mixer.fg).toBakeFrom(GW.colors.green);
        expect(mixer.bg).toBakeFrom(GW.colors.blue);

        cell.removeLayer(b);
        cell.removeLayer(a);
        Map.cell.getAppearance(cell, mixer);
        expect(mixer.ch).toEqual(FLOOR.ch);
        expect(mixer.fg).toBakeFrom(FLOOR.fg);
        expect(mixer.bg).toBakeFrom(FLOOR.bg);
    });

    test('activatesOn', () => {
        const cell = GW.make.cell('ENTER');
        expect(cell.activatesOn('enter')).toBeTruthy();
        expect(cell.activatesOn('fire')).toBeFalsy();
    });

    test('activate', async () => {
        const cell = GW.make.cell('LOW_CHANCE');
        UTILS.mockRandom();
        expect(await cell.activate('enter', {})).toBeFalsy();
    });

    test('clearLayer', () => {
        const cell = GW.make.cell('FLOOR');
        cell.setTile('RED_LIQUID', 100);
        expect(cell.ground).toEqual('FLOOR');
        expect(cell.liquid).toEqual('RED_LIQUID');
        expect(cell.liquidVolume).toEqual(100);
        cell.clearLayer(Map.layer.Depth.LIQUID);
        expect(cell.ground).toEqual('FLOOR');
        expect(cell.liquid).toBeNull();
        expect(cell.liquidVolume).toEqual(0);

        cell.setTile('RED_GAS', 100);
        expect(cell.gas).toEqual('RED_GAS');
        expect(cell.gasVolume).toEqual(100);
        cell.clearLayer(Map.layer.Depth.GAS);
        expect(cell.ground).toEqual('FLOOR');
        expect(cell.gas).toBeNull();
        expect(cell.gasVolume).toEqual(0);
    });

    test('clearLayersExcept', () => {
        const cell = GW.make.cell('ENTER');
        cell.setTile('BRIDGE');
        cell.setTile('RED_LIQUID', 100);
        cell.setTile('RED_GAS', 100);

        expect(cell.groundTile).toBe(Map.tiles.ENTER);
        expect(cell.surfaceTile).toBe(Map.tiles.BRIDGE);
        expect(cell.liquidTile).toBe(Map.tiles.RED_LIQUID);
        expect(cell.gasTile).toBe(Map.tiles.RED_GAS);

        cell.clearLayersExcept(); // does not clear gas
        expect(cell.ground).toBe('ENTER');
        expect(cell.surface).toBeNull();
        expect(cell.liquid).toBeNull();
        expect(cell.gas).toEqual('RED_GAS');

        cell.setTile('BRIDGE');
        cell.setTile('RED_LIQUID', 100);
        cell.setTile('RED_GAS', 100);
        expect(cell.groundTile).toBe(Map.tiles.ENTER);
        expect(cell.surfaceTile).toBe(Map.tiles.BRIDGE);
        expect(cell.liquidTile).toBe(Map.tiles.RED_LIQUID);
        expect(cell.gasTile).toBe(Map.tiles.RED_GAS);

        cell.clearLayersExcept(Map.layer.Depth.SURFACE, 'FLOOR');
        expect(cell.groundTile).toBe(Map.tiles.FLOOR);
        expect(cell.surfaceTile).toBe(Map.tiles.BRIDGE);
        expect(cell.liquid).toBeNull();
        expect(cell.gasTile).toBe(Map.tiles.RED_GAS);
    });

    test('clarLayerWithFlags', () => {
        const cell = GW.make.cell('ENTER');
        cell.setTile('BRIDGE');
        cell.setTile('RED_LIQUID', 100);
        cell.setTile('RED_GAS', 100);

        expect(cell.groundTile).toBe(Map.tiles.ENTER);
        expect(cell.surfaceTile).toBe(Map.tiles.BRIDGE);
        expect(cell.liquidTile).toBe(Map.tiles.RED_LIQUID);
        expect(cell.gasTile).toBe(Map.tiles.RED_GAS);

        cell.clearLayersWithFlags(Map.tile.Flags.T_BRIDGE);
        expect(cell.groundTile).toBe(Map.tiles.ENTER);
        expect(cell.surface).toBeNull();
        expect(cell.liquidTile).toBe(Map.tiles.RED_LIQUID);
        expect(cell.gasTile).toBe(Map.tiles.RED_GAS);

        cell.setTile('BRIDGE');
        cell.clearLayersWithFlags(
            Map.tile.Flags.T_DEEP_WATER,
            Map.tile.MechFlags.TM_EXPLOSIVE_PROMOTE
        );
        expect(cell.groundTile).toBe(Map.tiles.ENTER);
        expect(cell.surfaceTile).toBe(Map.tiles.BRIDGE);
        expect(cell.liquid).toBeNull();
        expect(cell.gasTile).toBe(Map.tiles.RED_GAS);

        cell.setTile('RED_LIQUID', 100);
        cell.clearLayersWithFlags(0, Map.tile.MechFlags.TM_EXPLOSIVE_PROMOTE);
        expect(cell.groundTile).toBe(Map.tiles.ENTER);
        expect(cell.surfaceTile).toBe(Map.tiles.BRIDGE);
        expect(cell.liquid).toBeNull();
        expect(cell.gasTile).toBe(Map.tiles.RED_GAS);
    });
});
