import alignment from './sceneTimings/pilot.words.json';
import {originalVoiceover} from './required-assets';

/** Same-byte narration reuses verified ASR records; no synthetic voice or inferred lip sync. */
export const AudioAlignment = {
  source: originalVoiceover.src, sha256: originalVoiceover.sha256,
  duration: originalVoiceover.duration, status: 'asr-aligned' as const,
  method: alignment.method,
  words: alignment.words.map(({text, start, end, probability}) => ({word: text, start, end, confidence: probability})),
};
