/** Real Chromium pixel/layout tests. Synthetic rectangles are test fixtures, not scene art. */
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {existsSync, mkdirSync, mkdtempSync, rmSync, writeFileSync} from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {deflateSync} from 'node:zlib';
import {bundle} from '@remotion/bundler';
import {openBrowser, renderStill, selectComposition} from '@remotion/renderer';
import type {CompositionProps, Episode} from '../src/types';
import {pilot} from '../src/data/episodes/pilot';
import {validateEpisode} from '../src/utils/validate';

const width = 1080, height = 1920;
const tempDir = mkdtempSync(path.join(os.tmpdir(), 'pwt-render-smoke-'));
const fixtureRelative = `test-fixtures/smoke-${process.pid}`;
const fixtureDir = path.resolve('public', fixtureRelative);
mkdirSync(fixtureDir, {recursive: true});
type RGB = [number, number, number];
type Rect = {x: number; y: number; width: number; height: number; color: RGB};
const color = {background: [12, 16, 22], cyan: [0, 200, 200], green: [0, 200, 0], red: [200, 0, 0], yellow: [240, 220, 0], orange: [230, 130, 0], purple: [140, 0, 200], blue: [0, 50, 240], white: [255, 255, 255]} satisfies Record<string, RGB>;

// Minimal deterministic PNG encoder keeps fixture creation independent of graphics packages.
const crc32 = (data: Buffer) => {
  let crc = 0xffffffff;
  for (const byte of data) {crc ^= byte; for (let bit = 0; bit < 8; bit++) crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0);}
  return (crc ^ 0xffffffff) >>> 0;
};
const pngChunk = (type: string, data: Buffer) => {
  const label = Buffer.from(type); const size = Buffer.alloc(4); size.writeUInt32BE(data.length);
  const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(Buffer.concat([label, data])));
  return Buffer.concat([size, label, data, crc]);
};
const png = (filename: string, rects: Rect[], fill?: RGB) => {
  const rgba = Buffer.alloc(width * height * 4);
  const draw = ({x, y, width: w, height: h, color: c}: Rect) => {
    for (let row = y; row < y + h; row++) for (let col = x; col < x + w; col++) {
      const offset = (row * width + col) * 4; rgba[offset] = c[0]; rgba[offset + 1] = c[1]; rgba[offset + 2] = c[2]; rgba[offset + 3] = 255;
    }
  };
  if (fill) draw({x: 0, y: 0, width, height, color: fill}); rects.forEach(draw);
  const rows = Buffer.alloc((width * 4 + 1) * height);
  for (let row = 0; row < height; row++) rgba.copy(rows, row * (width * 4 + 1) + 1, row * width * 4, (row + 1) * width * 4);
  const header = Buffer.alloc(13); header.writeUInt32BE(width, 0); header.writeUInt32BE(height, 4); header[8] = 8; header[9] = 6;
  writeFileSync(path.join(fixtureDir, filename), Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), pngChunk('IHDR', header), pngChunk('IDAT', deflateSync(rows)), pngChunk('IEND', Buffer.alloc(0))]));
  return `${fixtureRelative}/${filename}`;
};
const rectangle = (x: number, y: number, w: number, h: number, c: RGB): Rect => ({x, y, width: w, height: h, color: c});
const background = png('background.png', [], color.background);
const backdrop = png('backdrop.png', [rectangle(150, 400, 300, 300, color.cyan)]);
const body = png('body.png', [rectangle(200, 450, 400, 450, color.green)]);
const head = png('head.png', [rectangle(250, 300, 250, 300, color.red)]);
const open = png('open.png', [rectangle(300, 360, 40, 40, color.yellow)]);
const half = png('half.png', [rectangle(300, 360, 40, 40, color.orange)]);
const closed = png('closed.png', [rectangle(300, 360, 40, 40, color.purple)]);
const mouth = png('mouth.png', [rectangle(320, 470, 40, 30, color.blue)]);
const foreground = png('foreground.png', [rectangle(400, 400, 20, 600, color.white)]);

const fixture: Episode = {
  id: 'synthetic-layer-test', title: 'SYNTHETIC TEST FIXTURES — NOT FINISHED ARTWORK', width, height, fps: 30, duration: 1,
  artworkStatus: 'production', captionTiming: 'reviewed', captions: [], film: {enabled: false, grain: 0, softness: 0, muted: 0, colorBleed: 0, vignette: 0},
  scenes: [{id: 'fixture', title: 'Layer registration test', mode: 'layered', start: 0, duration: 1, image: background,
    development: {src: background, palette: ['#0c1016'], description: 'Synthetic test data only.'},
    camera: [{time: 0, x: 0}, {time: 1, x: 30, ease: 'linear'}],
    layers: [{id: 'backdrop', src: backdrop, plane: 'background', depth: 0.5}, {id: 'foreground', src: foreground, plane: 'foreground', depth: 1}],
    character: {parts: [{id: 'body', src: body, role: 'body', keyframes: [{time: 0, x: 0}, {time: 1, x: 60, ease: 'linear'}]}, {id: 'head', src: head, role: 'head'}],
      headPivot: [375, 500], headKeyframes: [{time: 0, x: 0}, {time: 1, x: 30, ease: 'linear'}],
      eyes: {open, half, closed, blinkTimes: [0.4], duration: 0.4}, mouths: {test: mouth}},
  }],
};
assert.deepEqual(validateEpisode(fixture, {publicDir: path.resolve('public'), production: true}).errors, []);
const browserExecutable = process.env.REMOTION_BROWSER_EXECUTABLE ?? (existsSync('/usr/bin/chromium') ? '/usr/bin/chromium' : undefined);
const browser = await openBrowser('chrome', {browserExecutable, chromiumOptions: {gl: 'swangle'}});
const serveUrl = await bundle({entryPoint: path.resolve('tests/render-entry.tsx'), publicDir: path.resolve('public'), outDir: path.join(tempDir, 'bundle')});
try {
  const render = async (episode: Episode, frame: number, development: boolean) => {
    const inputProps: CompositionProps = {episode, silent: true, development};
    const common = {serveUrl, inputProps, puppeteerInstance: browser};
    const composition = await selectComposition({...common, id: 'RenderSmoke'});
    const output = path.join(tempDir, `frame-${frame}.png`);
    const probes: {frame: number; measurements: {id: string; scrollHeight: number; clientHeight: number; lineCount: number; fontLoaded: boolean}[]}[] = [];
    await renderStill({...common, composition, frame, scale: 0.5, imageFormat: 'png', output,
      onBrowserLog: ({text}) => {if (text.startsWith('PWT_CAPTION_PROBE:')) probes.push(JSON.parse(text.slice('PWT_CAPTION_PROBE:'.length)));},
    });
    return {output, probes};
  };
  const readPixels = (filename: string) => execFileSync('ffmpeg', ['-v', 'error', '-i', filename, '-f', 'rawvideo', '-pix_fmt', 'rgb24', 'pipe:1'], {maxBuffer: 8 * 1024 * 1024});
  const assertPixel = (pixels: Buffer, x: number, y: number, expected: RGB, label: string) => {
    const offset = (Math.floor(y / 2) * (width / 2) + Math.floor(x / 2)) * 3;
    const actual = [...pixels.subarray(offset, offset + 3)];
    assert.ok(actual.every((value, channel) => Math.abs(value - expected[channel]) <= 2), `${label}: pixel (${x},${y}) expected ${expected}, got ${actual}`);
  };
  const initial = readPixels((await render(fixture, 0, false)).output);
  assertPixel(initial, 410, 700, color.white, 'Foreground covers body');
  assertPixel(initial, 300, 700, color.green, 'Body remains separate');
  assertPixel(initial, 220, 420, color.cyan, 'Background remains behind character');
  assertPixel(initial, 320, 380, color.yellow, 'Initial open-eye sprite');
  assertPixel(initial, 330, 480, color.red, 'Uncued mouth sprite is absent');
  const midpoint = readPixels((await render(fixture, 16, false)).output);
  assertPixel(midpoint, 442, 700, color.white, 'Foreground camera/depth interpolation');
  assertPixel(midpoint, 410, 700, color.green, 'Foreground has moved off original sample');
  assertPixel(midpoint, 352, 380, color.purple, 'Blink follows registered head and camera movement');
  assertPixel(midpoint, 362, 480, color.red, 'Uncued mouth remains absent after motion');
  const cuedFixture = structuredClone(fixture); cuedFixture.scenes[0].character!.mouthCues = [{time: 0.2, shape: 'test'}];
  const cued = readPixels((await render(cuedFixture, 16, false)).output);
  assertPixel(cued, 362, 480, color.blue, 'Explicit mouth cue selects its registered sprite');
  console.log('PASS: Mode B raster layer order, independent transforms, registered blink and uncued mouth checks.');

  const captionEpisode = structuredClone(pilot); captionEpisode.film.enabled = false;
  for (const caption of captionEpisode.captions) {
    const frame = Math.min(Math.round(captionEpisode.duration * captionEpisode.fps) - 1, Math.ceil((caption.start + Math.min(0.2, (caption.end - caption.start) / 2)) * captionEpisode.fps));
    const result = await render(captionEpisode, frame, true);
    const measurement = result.probes.filter((probe) => probe.frame === frame).flatMap((probe) => probe.measurements).find((probe) => probe.id === caption.id);
    assert.ok(measurement, `No browser caption measurement for ${caption.id} at frame ${frame}.`);
    assert.equal(measurement.fontLoaded, true, `${caption.id} bundled serif font failed to load.`);
    assert.ok(measurement.scrollHeight <= measurement.clientHeight + 1, `${caption.id} clips overflowing caption text (${measurement.scrollHeight} > ${measurement.clientHeight}).`);
    assert.ok(measurement.lineCount <= 2, `${caption.id} has ${measurement.lineCount} lines.`);
  }
  console.log(`PASS: ${captionEpisode.captions.length} actual pilot captions load bundled fonts, fit without clipping and stay within two lines.`);
  const multiline = structuredClone(fixture); multiline.captions = [{id: 'explicit-two-lines', start: 0.1, end: 0.9, text: 'FIRST LINE\nSECOND LINE'}];
  const multilineResult = await render(multiline, 15, false);
  const multilineMeasurement = multilineResult.probes.filter((probe) => probe.frame === 15).flatMap((probe) => probe.measurements).find((probe) => probe.id === 'explicit-two-lines');
  assert.equal(multilineMeasurement?.lineCount, 2, 'Explicit caption line breaks must survive tokenization.');
  console.log('PASS: Explicit two-line captions preserve the configured line break.');
} finally {
  await browser.close({silent: true});
  rmSync(fixtureDir, {recursive: true, force: true});
  rmSync(tempDir, {recursive: true, force: true});
}
