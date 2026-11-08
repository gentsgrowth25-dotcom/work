import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync} from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {test} from 'node:test';
import {deflateSync} from 'node:zlib';
import {preflightRender} from '../scripts/preflight';
import {compositionIdFor, outputFilenameFor, resolveRenderKind} from '../scripts/render-request';
import {forceProductionProps, productionPilot, vintageVisualTest} from '../src/data/episodes/production';
import {developmentArtworkHashes, requiredPilotAssets} from '../src/data/required-assets';
import type {Episode} from '../src/types';

const expectedAssets = [
  'scenes/01_hotel_lobby.png', 'scenes/02_dressing_room.png', 'scenes/03_meeting_room.png',
  'scenes/04_jewelry_detail.png', 'scenes/05_executive_desk.png', 'scenes/06_penthouse.png',
  'scenes/07_final_portrait.png',
];
const sha = (bytes: Buffer) => createHash('sha256').update(bytes).digest('hex');
const crc32 = (bytes: Buffer) => {
  let crc = 0xffffffff;
  for (const byte of bytes) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit++) crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0);
  }
  return (crc ^ 0xffffffff) >>> 0;
};
const chunk = (type: string, bytes: Buffer) => {
  const label = Buffer.from(type), length = Buffer.alloc(4), checksum = Buffer.alloc(4);
  length.writeUInt32BE(bytes.length); checksum.writeUInt32BE(crc32(Buffer.concat([label, bytes])));
  return Buffer.concat([length, label, bytes, checksum]);
};
const pngCache = new Map<number, Buffer>();
/** Valid full-size RGB PNGs are synthetic validation fixtures, never exported artwork. */
const png = (seed: number) => {
  if (pngCache.has(seed)) return pngCache.get(seed)!;
  const width = 1080, height = 1920, stride = width * 3 + 1;
  const raw = Buffer.alloc(stride * height, seed);
  for (let row = 0; row < height; row++) raw[row * stride] = 0;
  const header = Buffer.alloc(13); header.writeUInt32BE(width); header.writeUInt32BE(height, 4);
  header[8] = 8; header[9] = 2;
  const bytes = Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk('IHDR', header), chunk('IDAT', deflateSync(raw, {level: 1})), chunk('IEND', Buffer.alloc(0))]);
  pngCache.set(seed, bytes); return bytes;
};

const fixture = () => {
  const projectDir = mkdtempSync(path.join(os.tmpdir(), 'pwt-pipeline-'));
  const publicDir = path.join(projectDir, 'public'); mkdirSync(publicDir);
  const put = (relative: string, bytes: Buffer | string) => {
    const filename = path.join(publicDir, relative); mkdirSync(path.dirname(filename), {recursive: true}); writeFileSync(filename, bytes);
    return filename;
  };
  const allArtwork = () => requiredPilotAssets.forEach((src, index) => put(src, png(index + 1)));
  const reviewFile = path.join(projectDir, 'config/visual-test-review.json');
  const writeReview = (overrides: Record<string, unknown> = {}) => {
    const videoPath = 'renders/pretty-wise-tips-vintage-test.mp4';
    const video = Buffer.from('Synthetic video bytes for receipt hashing only; no test video is rendered.');
    mkdirSync(path.join(projectDir, 'renders'), {recursive: true}); writeFileSync(path.join(projectDir, videoPath), video);
    const receipt = {
      status: 'passed', sceneSha256: sha(readFileSync(path.join(publicDir, requiredPilotAssets[0]))),
      testVideoPath: videoPath, testVideoSha256: sha(video), basis: 'written-brief',
      reviewedAt: '2026-11-08T14:00:00Z', notes: 'Synthetic preflight fixture only.', ...overrides,
    };
    mkdirSync(path.dirname(reviewFile), {recursive: true}); writeFileSync(reviewFile, JSON.stringify(receipt));
    return receipt;
  };
  const inspect = (episode: Episode, kind: 'final' | 'test' | 'development') => preflightRender(episode, {kind, publicDir, projectDir, silent: true});
  return {projectDir, publicDir, put, allArtwork, reviewFile, writeReview, inspect, cleanup: () => rmSync(projectDir, {recursive: true, force: true})};
};
const withFixture = (run: (value: ReturnType<typeof fixture>) => void) => {
  const value = fixture(); try {run(value);} finally {value.cleanup();}
};

test('render defaults to the fixed final composition; development always requires an explicit selection', () => {
  assert.equal(resolveRenderKind({}), 'final');
  assert.equal(resolveRenderKind({production: true}), 'final');
  assert.equal(resolveRenderKind({composition: 'CINEMATIC_PILOT_FINAL'}), 'final');
  assert.equal(resolveRenderKind({composition: 'test'}), 'test');
  assert.equal(resolveRenderKind({composition: 'VINTAGE_VISUAL_TEST'}), 'test');
  assert.equal(resolveRenderKind({composition: 'DEVELOPMENT_PREVIEW'}), 'development');
  assert.throws(() => resolveRenderKind({composition: 'unknown'}));
  assert.throws(() => resolveRenderKind({composition: 'test', production: true}));
  assert.equal(compositionIdFor('final'), 'CINEMATIC_PILOT_FINAL');
  assert.equal(compositionIdFor('test'), 'VINTAGE_VISUAL_TEST');
  assert.equal(compositionIdFor('development'), 'DEVELOPMENT_PREVIEW');
  assert.equal(path.basename(outputFilenameFor('test')), 'pretty-wise-tips-vintage-test.mp4');
  assert.equal(path.basename(outputFilenameFor('final')), 'pretty-wise-tips-cinematic-pilot-final.mp4');
});

test('production data uses the exact seven illustration slots and the visual test stops before the second sentence', () => {
  assert.deepEqual(Array.from(requiredPilotAssets), expectedAssets);
  assert.equal(productionPilot.artworkStatus, 'production');
  assert.deepEqual(productionPilot.scenes.map((scene) => scene.image), expectedAssets);
  assert.equal(productionPilot.duration * productionPilot.fps, 720);
  assert.equal(vintageVisualTest.duration * vintageVisualTest.fps, 150);
  assert.equal(vintageVisualTest.scenes.length, 1);
  assert.equal(vintageVisualTest.scenes[0].image, expectedAssets[0]);
  assert.equal(vintageVisualTest.artworkStatus, 'production');
  assert.equal(vintageVisualTest.voiceover?.duration, 4.4);
  assert.equal(vintageVisualTest.captions.length, 3);
  assert.ok(vintageVisualTest.captions.every((caption) => caption.end <= 4.4 && !caption.final));
});

test('fixed production props ignore development:true without mutating caller input or approving its artwork', () => {
  const input = {episode: productionPilot, development: true, silent: true};
  const result = forceProductionProps(input);
  assert.equal(result.development, false);
  assert.equal(result.silent, true);
  assert.equal(result.episode, productionPilot);
  assert.equal(input.development, true);
});

test('final preflight enumerates every missing required illustration instead of selecting a fallback', () => withFixture((f) => {
  const result = f.inspect(structuredClone(productionPilot), 'final');
  for (const src of expectedAssets) assert.ok(result.errors.some((error) => error.includes(src)), `Missing file is not named: ${src}`);
}));

test('five-second test requires only the first completed scene and does not need a full-episode review receipt', () => withFixture((f) => {
  f.put(requiredPilotAssets[0], png(1));
  assert.deepEqual(f.inspect(structuredClone(vintageVisualTest), 'test').errors, []);
}));

test('a development card renamed to the mandatory scene filename is rejected by its image hash', () => withFixture((f) => {
  const original = readFileSync(new URL('../public/development/scene-01.png', import.meta.url));
  assert.ok((developmentArtworkHashes as readonly string[]).includes(sha(original)));
  f.put(requiredPilotAssets[0], original);
  assert.match(f.inspect(structuredClone(vintageVisualTest), 'test').errors.join(' '), /development|placeholder|storyboard/i);
}));

test('production and test episode props cannot substitute a different path for a registered scene', () => withFixture((f) => {
  f.put(requiredPilotAssets[0], png(1)); f.put('scenes/unregistered.png', png(2));
  const episode = structuredClone(vintageVisualTest); episode.scenes[0].image = 'scenes/unregistered.png';
  assert.match(f.inspect(episode, 'test').errors.join(' '), /registered|required|01_hotel_lobby/i);
}));

test('non-PNG data at an existing required filename fails before bundling', () => withFixture((f) => {
  f.put(requiredPilotAssets[0], 'not an image');
  assert.match(f.inspect(structuredClone(vintageVisualTest), 'test').errors.join(' '), /PNG|image|signature/i);
}));

test('PNG checksum corruption fails before bundling even when the signature and dimensions are present', () => withFixture((f) => {
  const bytes = Buffer.from(png(1)); bytes[45] ^= 1;
  f.put(requiredPilotAssets[0], bytes);
  assert.match(f.inspect(structuredClone(vintageVisualTest), 'test').errors.join(' '), /checksum|Invalid required scene/i);
}));

test('duplicating the same artwork into seven scene filenames is rejected', () => withFixture((f) => {
  for (const src of requiredPilotAssets) f.put(src, png(1));
  f.writeReview();
  assert.match(f.inspect(structuredClone(productionPilot), 'final').errors.join(' '), /duplicate|identical|same artwork/i);
}));

test('the full episode remains blocked after all images arrive until the visual-test receipt passes', () => withFixture((f) => {
  f.allArtwork();
  assert.match(f.inspect(structuredClone(productionPilot), 'final').errors.join(' '), /review|five.second|visual.test/i);
  f.writeReview({status: 'pending'});
  assert.match(f.inspect(structuredClone(productionPilot), 'final').errors.join(' '), /passed|review/i);
}));

test('a valid visual-test receipt is tied to the exact current illustration and test-video bytes', () => withFixture((f) => {
  f.allArtwork(); f.writeReview();
  assert.deepEqual(f.inspect(structuredClone(productionPilot), 'final').errors, []);
  f.put(requiredPilotAssets[0], png(99));
  assert.match(f.inspect(structuredClone(productionPilot), 'final').errors.join(' '), /review|hash|SHA|stale/i);
}));

test('changing the reviewed test video invalidates the final-render gate', () => withFixture((f) => {
  f.allArtwork(); f.writeReview();
  writeFileSync(path.join(f.projectDir, 'renders/pretty-wise-tips-vintage-test.mp4'), 'changed test video');
  assert.match(f.inspect(structuredClone(productionPilot), 'final').errors.join(' '), /video|hash|SHA|review/i);
}));
