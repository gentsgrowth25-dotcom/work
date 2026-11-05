import timing from '../public/episode05/narrationTiming.json';
export const episode05=timing;
export const gymCue=(name:keyof typeof timing.cues)=>timing.cues[name].frame;
