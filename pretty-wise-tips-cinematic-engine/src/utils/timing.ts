import type {CharacterRig} from '../types';

/** Deterministic half/closed/half replacement: no face deformation or random timers. */
export const blinkSprite = (time: number, blinkTimes: number[], duration = 0.16): 'open' | 'half' | 'closed' => {
  for (const start of blinkTimes) {
    const progress = (time - start) / duration;
    if (progress >= 0 && progress < 1) return progress < 0.25 || progress >= 0.75 ? 'half' : 'closed';
  }
  return 'open';
};

export const currentExpression = (rig: CharacterRig, time: number) => {
  let expression: NonNullable<CharacterRig['expressionCues']>[number]['expression'] = 'neutral';
  for (const cue of rig.expressionCues ?? []) if (time >= cue.time) expression = cue.expression;
  return expression;
};

export const currentMouth = (rig: CharacterRig, time: number): string | undefined => {
  let shape: string | undefined;
  for (const cue of rig.mouthCues ?? []) if (time >= cue.time) shape = cue.shape;
  return shape;
};
