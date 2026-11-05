import timing from '../public/episode06/narrationTiming.json';
export const episode06=timing;
export const routineCue=(name:keyof typeof timing.cues)=>timing.cues[name].frame;
