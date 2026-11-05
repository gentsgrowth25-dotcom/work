import timing from '../public/episode04/narrationTiming.json';
export const episode04=timing;
export const cue=(name:keyof typeof timing.cues)=>timing.cues[name].frame;
