import assert from 'node:assert/strict';
import {test} from 'node:test';
import {easeProgress, sampleMotion} from '../src/utils/motion';
import {blinkSprite, currentExpression, currentMouth} from '../src/utils/timing';
import type {CharacterRig, MotionKeyframe} from '../src/types';

test('a camera interpolates its values and holds outside its shot without changing input data', () => {
  const track: MotionKeyframe[] = [{time: 0, x: -50, scale: 1}, {time: 4, x: 50, scale: 1.1, ease: 'linear'}];
  const original = structuredClone(track);
  assert.deepEqual(sampleMotion(track, -1), {x: -50, y: 0, scale: 1, rotation: 0, opacity: 1});
  assert.deepEqual(sampleMotion(track, 2), {x: 0, y: 0, scale: 1.05, rotation: 0, opacity: 1});
  assert.equal(sampleMotion(track, 20).scale, 1.1);
  assert.deepEqual(track, original);
});

test('sparse channels interpolate independently so a y-only key does not interrupt an x track', () => {
  const track: MotionKeyframe[] = [{time: 0, x: 0}, {time: 1, y: 24}, {time: 2, x: 100, ease: 'linear'}];
  assert.equal(sampleMotion(track, 1).x, 50);
  assert.equal(sampleMotion(track, 1).y, 24);
  assert.equal(sampleMotion(track, 1).scale, 1);
  assert.deepEqual(sampleMotion(undefined, 3), {x: 0, y: 0, scale: 1, rotation: 0, opacity: 1});
});

test('easing clamps to endpoints and produces deterministic restrained movement', () => {
  assert.equal(easeProgress(-1), 0);
  assert.equal(easeProgress(2), 1);
  assert.equal(easeProgress(0.5, 'linear'), 0.5);
  assert.equal(easeProgress(0.5, 'ease-in-out'), 0.5);
  assert.equal(easeProgress(0.5, 'ease-out'), 0.875);
  assert.ok(easeProgress(0.1, 'ease-in-out') < easeProgress(0.1, 'linear'));
  const track: MotionKeyframe[] = [{time: 0, rotation: 0}, {time: 1, rotation: 0.6}];
  assert.deepEqual(sampleMotion(track, 0.273), sampleMotion(track, 0.273));
});

test('blink replacements follow open/half/closed/half/open and do not fire between cues', () => {
  assert.equal(blinkSprite(0.9, [1]), 'open');
  assert.equal(blinkSprite(1.02, [1]), 'half');
  assert.equal(blinkSprite(1.06, [1]), 'closed');
  assert.equal(blinkSprite(1.14, [1]), 'half');
  assert.equal(blinkSprite(1.2, [1]), 'open');
  assert.equal(blinkSprite(4, []), 'open');
});

test('expressions hold explicit cues and narration does not invent mouth movement', () => {
  const rig: CharacterRig = {parts: [], expressionCues: [{time: 1, expression: 'thoughtful'}, {time: 2, expression: 'smile'}], mouths: {rest: 'rest.png', open: 'open.png'}};
  assert.equal(currentExpression(rig, 0), 'neutral');
  assert.equal(currentExpression(rig, 1.5), 'thoughtful');
  assert.equal(currentExpression(rig, 3), 'smile');
  assert.equal(currentMouth(rig, 1.5), undefined);
  rig.mouthCues = [{time: 1, shape: 'open'}, {time: 1.2, shape: 'rest'}];
  assert.equal(currentMouth(rig, 0.5), undefined);
  assert.equal(currentMouth(rig, 1.1), 'open');
  assert.equal(currentMouth(rig, 3), 'rest');
});
