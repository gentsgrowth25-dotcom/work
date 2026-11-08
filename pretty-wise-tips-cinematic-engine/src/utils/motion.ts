import type {Ease, MotionKeyframe} from '../types';

export type Motion = {x: number; y: number; scale: number; rotation: number; opacity: number};
const defaults: Motion = {x: 0, y: 0, scale: 1, rotation: 0, opacity: 1};
export const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));

export const easeProgress = (progress: number, ease: Ease = 'ease-in-out'): number => {
  const p = clamp(progress);
  if (ease === 'linear') return p;
  if (ease === 'ease-out') return 1 - (1 - p) ** 3;
  return p * p * (3 - 2 * p);
};

/** Each sparse channel interpolates only between its own explicit values, and holds at the ends. */
export const sampleMotion = (keyframes: MotionKeyframe[] | undefined, time: number): Motion => {
  if (!keyframes?.length) return {...defaults};
  return Object.fromEntries(Object.keys(defaults).map((key) => {
    const property = key as keyof Motion;
    const track = keyframes.filter((keyframe) => keyframe[property] !== undefined);
    if (!track.length) return [property, defaults[property]];
    if (time <= track[0].time) return [property, track[0][property]];
    const nextIndex = track.findIndex((point) => point.time > time);
    if (nextIndex === -1) return [property, track[track.length - 1][property]];
    const from = track[nextIndex - 1];
    const to = track[nextIndex];
    const progress = easeProgress((time - from.time) / Math.max(0.0001, to.time - from.time), to.ease);
    const startValue = from[property]!;
    return [property, startValue + (to[property]! - startValue) * progress];
  })) as Motion;
};

export const motionTransform = (motion: Motion) =>
  `translate3d(${motion.x}px, ${motion.y}px, 0) rotate(${motion.rotation}deg) scale(${motion.scale})`;
