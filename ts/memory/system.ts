// import { Actor } from '../actor/actor';
// import { MapType } from '../map/types';
// import { Memory } from './memory';

// type MemoryRecord = Record<string, Memory>;
// const cache: Record<string, MemoryRecord> = {};

// export function store(actor: Actor, map: MapType, memory: Memory) {
//     let actorMemory = cache[actor.id];
//     if (!actorMemory) {
//         cache[actor.id] = actorMemory = {};
//     }
//     actorMemory[map.properties.id] = memory;
// }

// export function get(actor: Actor, map: MapType): Memory {
//     let actorMemory = cache[actor.id];
//     if (actorMemory) {
//         const memory = actorMemory[map.properties.id];
//         if (memory) return memory;
//     }
//     return new Memory(map);
// }
