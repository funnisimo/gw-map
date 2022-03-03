// import * as GWU from 'gw-utils';

// export type AnimationCallback = (v?: any) => any;

// export interface Animation {
//     start(): void;
//     stop(): void;
//     tick(dt: number): void;
//     step(): void;
//     isRunning(): boolean;

//     readonly speed: number;
//     callback(v: AnimationCallback): void;
// }

// let ANIMATIONS: Animation[] = [];

// export function busy(): boolean {
//     return ANIMATIONS.some((a) => a);
// }

// export async function playAll() {
//     while (busy()) {
//         const e = await GWU.app.nextEvent();
//         if (e && e.dt > 0) {
//             ANIMATIONS.forEach((a) => a && a.tick(e.dt));
//             ANIMATIONS = ANIMATIONS.filter((a) => a && a.isRunning());
//         }
//     }
// }

// export function tick(dt: number): boolean {
//     if (!ANIMATIONS.length) return false;

//     ANIMATIONS.forEach((a) => a && a.tick(dt));
//     ANIMATIONS = ANIMATIONS.filter((a) => a && a.isRunning());
//     // if (ANIMATIONS.length == 0) {
//     //   IO.resumeEvents();
//     // }
//     return true;
// }

// // let BUSY = false;

// // export type FxPlayFn = (animation: FX) => Promise<any>;

// export async function playRealTime(animation: Animation) {
//     // animation.playFx = playRealTime;

//     // IO.pauseEvents();
//     animation.start();
//     ANIMATIONS.push(animation);
//     return new Promise((resolve) => animation.callback(resolve));
// }

// export async function playGameTime(anim: Animation) {
//     // anim.playFx = playGameTime;

//     anim.start();
//     // scheduler.push(() => {
//     //     anim.step();
//     //     GW.ui.requestUpdate(1);
//     //     return anim.isRunning() ? anim.speed : 0;
//     // }, anim.speed);

//     return new Promise((resolve) => anim.callback(resolve));
// }
