import assert from 'node:assert/strict';
import {mkdtempSync, mkdirSync, writeFileSync, rmSync} from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {after, test} from 'node:test';
import type {Episode} from '../src/types';
import {collectAssetPaths, validateEpisode} from '../src/utils/validate';

const publicDir = mkdtempSync(path.join(os.tmpdir(), 'pwt-validation-'));
for (const filename of ['scenes/a.png', 'development/a.png', 'audio/voice.mp3', 'characters/body.png', 'characters/open.png', 'characters/half.png', 'characters/closed.png']) {
  const filenamePath = path.join(publicDir, filename);
  mkdirSync(path.dirname(filenamePath), {recursive: true}); writeFileSync(filenamePath, 'fixture');
}
after(() => rmSync(publicDir, {recursive: true, force: true}));
const episode = (): Episode => ({
  id: 'fixture', title: 'Fixture', width: 1080, height: 1920, fps: 30, duration: 2,
  artworkStatus: 'production', captionTiming: 'reviewed',
  film: {enabled: false, grain: 0, softness: 0, muted: 0, colorBleed: 0, vignette: 0},
  scenes: [{id: 'a', title: 'A', start: 0, duration: 2, mode: 'flattened', image: 'scenes/a.png', camera: [{time: 0, scale: 1}, {time: 2, scale: 1.05}], development: {src: 'development/a.png', description: 'placeholder', palette: []}}],
  captions: [{id: 'one', start: 0.1, end: 1.8, text: 'I choose.', words: [{word: 'I', start: 0.1, end: 0.5}, {word: 'choose.', start: 0.5, end: 1.8}]}],
  voiceover: {src: 'audio/voice.mp3', duration: 1.9, volume: 1, fadeIn: 0, fadeOut: 0.1},
});
const validate = (value: Episode, production = true, silent = false) => validateEpisode(value, {publicDir, production, silent});

test('a completed flat episode validates and does not require unused development fallback files', () => {
  const value = episode(); value.scenes[0].development.src = 'development/absent.png';
  assert.deepEqual(validate(value), {errors: [], warnings: []});
});
test('development fallback is explicit, labelled and blocked in production', () => {
  const value = episode(); value.artworkStatus = 'development'; delete value.scenes[0].image;
  assert.equal(validate(value, false).errors.length, 0);
  assert.match(validate(value, false).warnings.join(' '), /placeholder/);
  assert.match(validate(value).errors.join(' '), /Production render requires/);
  assert.match(validate(value).errors.join(' '), /scene image is missing/);
});
test('supplied but missing images fail instead of silently falling back', () => {
  const value = episode(); value.scenes[0].image = 'scenes/missing.png';
  assert.match(validate(value, false).errors.join(' '), /Missing asset: public\/scenes\/missing.png/);
});
test('asset paths cannot traverse public, use absolute paths or fetch remote artwork', () => {
  for (const src of ['../secret.png', '/tmp/a.png', 'https://example.com/a.png', 'C:\\temp\\a.png', '', 'scenes/../../a.png']) {
    const value = episode(); value.scenes[0].image = src;
    assert.match(validate(value).errors.join(' '), /Invalid asset path/, src);
  }
});
test('scene gaps, overlaps and incomplete duration fail', () => {
  const gap = episode(); gap.scenes[0].start = 1 / 30;
  assert.match(validate(gap).errors.join(' '), /contiguous/);
  const end = episode(); end.scenes[0].duration = 1.5;
  assert.match(validate(end).errors.join(' '), /exactly cover/);
});
test('subframe rounding that would introduce a blank rendered frame fails', () => {
  const value = episode(); value.scenes[0].duration = 1.02;
  value.scenes[0].camera = [{time: 0, scale: 1}];
  value.scenes.push({...structuredClone(value.scenes[0]), id: 'b', start: 1.02, duration: 0.98});
  assert.equal(validate(value).errors.length, 0);
  value.scenes[1].start = 1.052;
  assert.match(validate(value).errors.join(' '), /contiguous/);
});
test('contiguous subframe endpoints match the renderer rather than summing rounded durations', () => {
  const value = episode(); value.duration = 31.8 / 30; value.voiceover = undefined; value.captions = [];
  value.scenes[0].duration = 30.4 / 30; value.scenes[0].camera = [{time: 0}];
  value.scenes.push({...structuredClone(value.scenes[0]), id: 'b', start: 30.4 / 30, duration: 1.4 / 30});
  assert.equal(validate(value).errors.length, 0);
});
test('flat assets cannot claim independent character or parallax motion', () => {
  const value = episode(); value.scenes[0].layers = [{id: 'layer', src: 'scenes/a.png'}];
  assert.match(validate(value).errors.join(' '), /flattened artwork cannot/);
});
test('foreground-only layered scenes still require a backdrop and validate development fallback', () => {
  const value = episode(); value.scenes[0].mode = 'layered'; delete value.scenes[0].image;
  value.scenes[0].layers = [{id: 'foreground', src: 'scenes/a.png', plane: 'foreground'}];
  assert.match(validate(value).errors.join(' '), /foreground alone cannot supply a backdrop/);
  value.scenes[0].development.src = 'development/absent.png';
  assert.match(validate(value, false).errors.join(' '), /Missing asset: public\/development\/absent.png/);
});
test('layered rig requires replacement sprites referenced by cues and complete blinks', () => {
  const value = episode(); value.scenes[0].mode = 'layered';
  value.scenes[0].character = {parts: [{id: 'body', src: 'characters/body.png', role: 'body'}], eyes: {open: 'characters/open.png', half: 'characters/half.png', closed: 'characters/closed.png', blinkTimes: [0.5]}, expressionCues: [{time: 1, expression: 'smile'}]};
  assert.match(validate(value).errors.join(' '), /no replacement sprite/);
  value.scenes[0].character.expressions = {smile: 'characters/open.png'};
  assert.equal(validate(value).errors.length, 0);
  value.scenes[0].character.eyes!.closed = 'characters/missing.png';
  assert.match(validate(value).errors.join(' '), /Missing asset/);
});
test('captions reject overlap, out-of-range words, unsafe placement and over two lines', () => {
  const value = episode(); value.captions[0].position = {left: 10, width: 1000, top: 1800};
  value.captions[0].words![0].start = -1;
  value.captions[0].text = 'one\ntwo\nthree';
  value.captions.push({id: 'two', start: 1, end: 2, text: 'Overlap'});
  const errors = validate(value).errors.join(' ');
  assert.match(errors, /Instagram-safe/); assert.match(errors, /word timestamps/); assert.match(errors, /two explicit/); assert.match(errors, /cannot overlap/);
});
test('head replacement sprites cannot detach through head-local transforms', () => {
  const value = episode(); value.scenes[0].mode = 'layered';
  value.scenes[0].character = {parts: [{id: 'head', src: 'characters/body.png', role: 'head', keyframes: [{time: 0, x: 1}]}], mouths: {rest: 'characters/open.png'}};
  assert.match(validate(value).errors.join(' '), /use rig.headKeyframes/);
  delete value.scenes[0].character.parts[0].keyframes;
  value.scenes[0].character.headKeyframes = [{time: 0, x: 1}];
  assert.equal(validate(value).errors.length, 0);
});
test('production rejects estimated captions while ASR alignment remains an explicit warning', () => {
  const value = episode(); value.captionTiming = 'provisional';
  assert.match(validate(value).errors.join(' '), /provisional/);
  value.captionTiming = 'asr-aligned';
  assert.equal(validate(value).errors.length, 0);
  assert.match(validate(value).warnings.join(' '), /not human verified/);
});
test('silent mode explicitly skips configured audio and otherwise catches missing or truncated narration', () => {
  const value = episode(); value.voiceover!.src = 'audio/missing.mp3'; value.voiceover!.duration = 4;
  assert.match(validate(value).errors.join(' '), /narration truncation/);
  assert.match(validate(value).errors.join(' '), /Missing asset/);
  assert.equal(validate(value, true, true).errors.length, 0);
  assert.match(validate(value, true, true).warnings.join(' '), /Silent preview explicitly/);
  assert.deepEqual(collectAssetPaths(value, {silent: true}), ['scenes/a.png']);
});
test('non-finite keyframes, bad scales, unordered motion and excessive rig motion fail', () => {
  const value = episode(); value.scenes[0].camera = [{time: 1, scale: -1}, {time: 0, x: NaN}];
  value.scenes[0].mode = 'layered'; value.scenes[0].character = {parts: [{id: 'body', src: 'characters/body.png', role: 'body', motion: {type: 'breathing', amplitude: 50, period: 0}}]};
  const errors = validate(value).errors.join(' ');
  assert.match(errors, /scale must be positive/); assert.match(errors, /strictly increasing/); assert.match(errors, /x must be finite/); assert.match(errors, /subtle amplitude/);
});
