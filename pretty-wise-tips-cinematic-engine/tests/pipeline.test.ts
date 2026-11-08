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
  'scenes/4x5/01A_pearls_detail.png', 'scenes/4x5/01B_dressing_room.png',
  'scenes/4x5/02A_kitchen.png', 'scenes/4x5/02B_teacup_detail.png',
  'scenes/4x5/03A_city_street.png', 'scenes/4x5/03B_boutique_glance.png',
  'scenes/4x5/04A_jewelry_detail.png', 'scenes/4x5/04B_jewel_boutique.png',
  'scenes/4x5/05A_signing_detail.png', 'scenes/4x5/05B_executive_office.png',
  'scenes/4x5/06A_balcony_wide.png', 'scenes/4x5/06B_balcony_profile.png',
  'scenes/4x5/07A_hero_portrait.png', 'scenes/4x5/07B_final_portrait.png',
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
const pngCache = new Map<string, Buffer>();
/** Valid full-size RGB PNGs are synthetic validation fixtures, never exported artwork. */
const png = (seed: number, width = 1080, height = 1350) => {
  const key = `${seed}-${width}-${height}`;
  if (pngCache.has(key)) return pngCache.get(key)!;
  const stride = width * 3 + 1;
  const raw = Buffer.alloc(stride * height, seed);
  for (let row = 0; row < height; row++) raw[row * stride] = 0;
  const header = Buffer.alloc(13); header.writeUInt32BE(width); header.writeUInt32BE(height, 4);
  header[8] = 8; header[9] = 2;
  const bytes = Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk('IHDR', header), chunk('IDAT', deflateSync(raw, {level: 1})), chunk('IEND', Buffer.alloc(0))]);
  pngCache.set(key, bytes); return bytes;
};

const fixture = () => {
  const projectDir = mkdtempSync(path.join(os.tmpdir(), 'pwt-pipeline-'));
  const publicDir = path.join(projectDir, 'public'); mkdirSync(publicDir);
  const put = (relative: string, bytes: Buffer | string) => {
    const filename = path.join(publicDir, relative); mkdirSync(path.dirname(filename), {recursive: true}); writeFileSync(filename, bytes);
    return filename;
  };
  const voiceSrc = productionPilot.voiceover!.src;
  put(voiceSrc, readFileSync(new URL('../public/' + voiceSrc, import.meta.url)));
  // Keep the real separately illustrated secondary-motion assets in validation fixtures.
  for (const src of new Set(productionPilot.scenes.flatMap((scene) => (scene.layers ?? []).map((layer) => layer.src)))) {
    put(src, readFileSync(new URL('../public/' + src, import.meta.url)));
  }
  const allArtwork = () => requiredPilotAssets.forEach((src, index) => put(src, png(index + 1)));
  const firstShots = () => requiredPilotAssets.slice(0, 2).forEach((src, index) => put(src, png(index + 1)));
  const reviewFile = path.join(projectDir, 'config/visual-test-review.json');
  const writeReview = (overrides: Record<string, unknown> = {}) => {
    const videoPath = 'renders/pretty-wise-tips-vintage-test-4x5.mp4';
    const video = Buffer.from('Synthetic video bytes for receipt hashing only; no test video is rendered.');
    mkdirSync(path.join(projectDir, 'renders'), {recursive: true}); writeFileSync(path.join(projectDir, videoPath), video);
    const receipt = {
      status: 'passed', artworkSha256: Object.fromEntries(requiredPilotAssets.slice(0, 2).map((src) => [src, sha(readFileSync(path.join(publicDir, src)))])),
      testVideoPath: videoPath, testVideoSha256: sha(video), basis: 'supplied-reference',
      reviewedAt: '2026-11-08T14:00:00Z', notes: 'Synthetic preflight fixture only.', ...overrides,
    };
    mkdirSync(path.dirname(reviewFile), {recursive: true}); writeFileSync(reviewFile, JSON.stringify(receipt));
    return receipt;
  };
  const inspect = (episode: Episode, kind: 'final' | 'test' | 'development', silent = kind === 'test') => preflightRender(episode, {kind, publicDir, projectDir, silent});
  return {projectDir, publicDir, put, allArtwork, firstShots, reviewFile, writeReview, inspect, cleanup: () => rmSync(projectDir, {recursive: true, force: true})};
};
const withFixture = (run: (value: ReturnType<typeof fixture>) => void) => {
  const value = fixture(); try {run(value);} finally {value.cleanup();}
};

test('render defaults to the fixed final composition; development always requires an explicit selection', () => {
  assert.equal(resolveRenderKind({}), 'final');
  assert.equal(resolveRenderKind({production: true}), 'final');
  assert.equal(resolveRenderKind({composition: 'CINEMATIC_PILOT_4X5_FINAL'}), 'final');
  assert.equal(resolveRenderKind({composition: 'test'}), 'test');
  assert.equal(resolveRenderKind({composition: 'VINTAGE_VISUAL_TEST_4X5'}), 'test');
  assert.equal(resolveRenderKind({composition: 'DEVELOPMENT_PREVIEW'}), 'development');
  assert.throws(() => resolveRenderKind({composition: 'unknown'}));
  assert.throws(() => resolveRenderKind({composition: 'test', production: true}));
  assert.equal(compositionIdFor('final'), 'CINEMATIC-PILOT-4X5-FINAL');
  assert.equal(compositionIdFor('test'), 'VINTAGE-VISUAL-TEST-4X5');
  assert.equal(compositionIdFor('development'), 'DEVELOPMENT-PREVIEW');
  assert.equal(path.basename(outputFilenameFor('test')), 'pretty-wise-tips-vintage-test-4x5.mp4');
  assert.equal(path.basename(outputFilenameFor('final')), 'pretty-wise-tips-cinematic-pilot-4x5-final.mp4');
});

test('all registered composition IDs use Remotion-supported characters and match CLI mappings', () => {
  const root = readFileSync(new URL('../src/Root.tsx', import.meta.url), 'utf8');
  const registered = [...root.matchAll(/<Composition\s+id="([^"]+)"/g)].map((match) => match[1]);
  assert.deepEqual(registered, ['final', 'test', 'development'].map((kind) => compositionIdFor(kind as 'final' | 'test' | 'development')));
  for (const id of registered) {
    assert.match(id, /^[a-zA-Z0-9-]+$/);
    assert.ok(['final', 'test', 'development'].includes(resolveRenderKind({composition: id})));
  }
});

test('native 4:5 production has fourteen distinct shots grouped into seven scenes and a two-shot visual test', () => {
  assert.deepEqual(Array.from(requiredPilotAssets), expectedAssets);
  assert.equal(requiredPilotAssets.length, 14);
  assert.equal(new Set(requiredPilotAssets).size, 14);
  assert.ok(requiredPilotAssets.every((src) => src.startsWith('scenes/') && src.endsWith('.png')));
  assert.equal(productionPilot.artworkStatus, 'production');
  assert.deepEqual(productionPilot.scenes.map((scene) => scene.image), expectedAssets);
  assert.equal(productionPilot.width, 1080);
  assert.equal(productionPilot.height, 1350);
  assert.equal(productionPilot.duration * productionPilot.fps, 716);
  assert.deepEqual(productionPilot.scenes.map((scene) => scene.groupId), ['01','01','02','02','03','03','04','04','05','05','06','06','07','07']);
  const boundaries = [0,42,137,172,228,256,323,359,404,473,533,570,617,690,716];
  assert.deepEqual(productionPilot.scenes.map((scene) => Math.round(scene.start * productionPilot.fps)), boundaries.slice(0, -1));
  assert.deepEqual(productionPilot.scenes.map((scene) => Math.round((scene.start + scene.duration) * productionPilot.fps)), boundaries.slice(1));
  assert.equal(vintageVisualTest.duration * vintageVisualTest.fps, 150);
  assert.equal(vintageVisualTest.scenes.length, 2);
  assert.equal(vintageVisualTest.width, 1080);
  assert.equal(vintageVisualTest.height, 1350);
  assert.deepEqual(vintageVisualTest.scenes.map((scene) => scene.image), expectedAssets.slice(0, 2));
  assert.deepEqual(vintageVisualTest.scenes.map((scene) => Math.round(scene.duration * vintageVisualTest.fps)), [38, 112]);
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

test('five-second test requires only its two completed illustrations and no full-episode review receipt', () => withFixture((f) => {
  f.firstShots();
  assert.deepEqual(f.inspect(structuredClone(vintageVisualTest), 'test').errors, []);
}));

test('one missing illustration in the two-shot visual test is a hard failure', () => withFixture((f) => {
  f.put(requiredPilotAssets[0], png(1));
  assert.ok(f.inspect(structuredClone(vintageVisualTest), 'test').errors.some((error) => error.includes(requiredPilotAssets[1])));
}));

test('4:5 output rejects artwork composed for the earlier 9:16 frame', () => withFixture((f) => {
  f.firstShots(); f.put(requiredPilotAssets[0], png(99, 1080, 1920));
  assert.match(f.inspect(structuredClone(vintageVisualTest), 'test').errors.join(' '), /4:5|native|aspect/i);
}));

test('the final master cannot be silently exported without its authoritative voiceover', () => withFixture((f) => {
  f.allArtwork(); f.writeReview();
  assert.match(f.inspect(structuredClone(productionPilot), 'final', true).errors.join(' '), /silent|audio|voice|narration/i);
}));

test('the actual supplied voice file is required even for a silent visual-test render', () => withFixture((f) => {
  f.firstShots();
  const episode = structuredClone(vintageVisualTest);
  rmSync(path.join(f.publicDir, episode.voiceover!.src));
  assert.match(f.inspect(episode, 'test', true).errors.join(' '), /voice|audio|narration|mp3/i);
  delete episode.voiceover;
  assert.match(f.inspect(episode, 'test', true).errors.join(' '), /voice|audio|narration/i);
}));

test('a replacement MP3 cannot pass by keeping the original voice filename', () => withFixture((f) => {
  f.firstShots();
  f.put(vintageVisualTest.voiceover!.src, 'Different audio under the original filename');
  assert.match(f.inspect(structuredClone(vintageVisualTest), 'test').errors.join(' '), /SHA|original|authoritative/i);
}));

test('the final contract preserves the complete source recording at source volume without fades', () => withFixture((f) => {
  f.allArtwork(); f.writeReview();
  for (const patch of [{duration: 23}, {volume: 1.15}, {fadeOut: 0.15}, {start: 0.2}]) {
    const episode = structuredClone(productionPilot);
    Object.assign(episode.voiceover!, patch);
    assert.match(f.inspect(episode, 'final').errors.join(' '), /narration|voice|source|original/i);
  }
}));

test('a development card renamed to the mandatory scene filename is rejected by its image hash', () => withFixture((f) => {
  const original = readFileSync(new URL('../public/development/scene-01.png', import.meta.url));
  assert.ok((developmentArtworkHashes as readonly string[]).includes(sha(original)));
  f.firstShots(); f.put(requiredPilotAssets[0], original);
  assert.match(f.inspect(structuredClone(vintageVisualTest), 'test').errors.join(' '), /development|placeholder|storyboard/i);
}));

test('production and test episode props cannot substitute a different path for a registered scene', () => withFixture((f) => {
  f.firstShots(); f.put('scenes/unregistered.png', png(99));
  const episode = structuredClone(vintageVisualTest); episode.scenes[0].image = 'scenes/unregistered.png';
  assert.match(f.inspect(episode, 'test').errors.join(' '), /registered|required|artwork/i);
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

test('duplicating the same artwork into fourteen shot filenames is rejected', () => withFixture((f) => {
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

test('the visual-test receipt locks both reviewed shot hashes and the current video bytes', () => withFixture((f) => {
  f.allArtwork(); f.writeReview();
  assert.deepEqual(f.inspect(structuredClone(productionPilot), 'final').errors, []);
  for (const index of [0, 1]) {
    f.put(requiredPilotAssets[index], png(99 + index));
    assert.match(f.inspect(structuredClone(productionPilot), 'final').errors.join(' '), /review|hash|SHA|stale/i);
    f.put(requiredPilotAssets[index], png(index + 1));
  }
}));

test('changing the reviewed test video invalidates the final-render gate', () => withFixture((f) => {
  f.allArtwork(); f.writeReview();
  writeFileSync(path.join(f.projectDir, 'renders/pretty-wise-tips-vintage-test-4x5.mp4'), 'changed test video');
  assert.match(f.inspect(structuredClone(productionPilot), 'final').errors.join(' '), /video|hash|SHA|review/i);
}));
