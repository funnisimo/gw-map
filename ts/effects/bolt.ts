// import * as GWU from 'gw-utils';
// import { EffectCtx, EffectFn, EffectConfig } from '../effect';
// import { BasicTypeInfo, EffectTypeFn, basicType } from './basic';
// import * as Flags from '../../flags';
// import * as Map from '../../map';
// import * as FX from '../../fx';

// export interface BoltTypeInfo extends BasicTypeInfo {
//     range: number;
//     bolt: string;
// }

// export function makeBoltType(config: EffectConfig): EffectTypeFn {
//     const type = config.type || 'bolt';
//     const parts = type.split(':').map((t) => t.trim());

//     const range = config.range || Number.parseInt(parts[1] || '0') || 99;
//     const flags = GWU.flag.from(Flags.Effect, config.flags || 0);

//     return boltType.bind(undefined, { range, flags });
// }

// export function boltType(
//     info: any,
//     effects: EffectFn[],
//     map: Map.MapType,
//     xy: GWU.xy.XY,
//     ctx: EffectCtx
// ): boolean {
//     // Need to determine target before invoking the effect function...
//     // x, y are target locations
//     // ctx.actor is actor, ctx.item is item used, originX, originY is source location
//     const source = ctx.actor || { x: ctx.originX || -1, y: ctx.originY || -1 };
//     FX.bolt(map, source, xy, info.bolt).then((dest) => {
//         if (!dest || dest.x < 0 || dest.y < 0) return false;
//         return basicType(info, effects, map, dest, ctx);
//     });

//     return true;
// }
