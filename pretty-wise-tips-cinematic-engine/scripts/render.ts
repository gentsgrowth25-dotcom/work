import {bundle} from '@remotion/bundler';
import {renderMedia, renderStill, selectComposition} from '@remotion/renderer';
import {existsSync, mkdirSync, writeFileSync} from 'node:fs';
import {dirname, resolve} from 'node:path';
import {parseArgs} from 'node:util';
import {developmentPilot, productionPilot, vintageVisualTest} from '../src/data/episodes/production';
import {loadEpisode} from './load-episode';
import {preflightRender} from './preflight';
import {compositionIdFor, outputFilenameFor, resolveRenderKind} from './render-request';

const {values} = parseArgs({options: {
  composition: {type: 'string'}, episode: {type: 'string'}, out: {type: 'string'}, production: {type: 'boolean'},
  silent: {type: 'boolean'}, still: {type: 'boolean'}, frame: {type: 'string'}, review: {type: 'string'},
}});
try {
  const kind = resolveRenderKind(values);
  const episode = values.episode ? loadEpisode(values.episode) : {final: productionPilot, test: vintageVisualTest, development: developmentPilot}[kind];
  const report = preflightRender(episode, {kind, publicDir: resolve('public'), projectDir: process.cwd(), reviewFile: values.review, silent: values.silent});
  report.warnings.forEach((message) => console.warn(`WARNING: ${message}`));
  if (report.errors.length) throw new Error(report.errors.join('\n'));
  // Studio's selected final composition can use the same receipt after authoritative Node preflight.
  if (kind === 'final' && report.review) writeFileSync(resolve('public/visual-test-review.json'), `${JSON.stringify(report.review, null, 2)}\n`);
  const inputProps = {episode, silent: !!values.silent, development: kind === 'development', artworkReview: report.review};
  const serveUrl = await bundle({entryPoint: resolve('src/index.ts'), publicDir: resolve('public')});
  const browserExecutable = process.env.REMOTION_BROWSER_EXECUTABLE ?? (existsSync('/usr/bin/chromium') ? '/usr/bin/chromium' : undefined);
  const common = {serveUrl, inputProps, browserExecutable};
  const composition = await selectComposition({...common, id: compositionIdFor(kind)});
  const stem = outputFilenameFor(kind).replace(/\.mp4$/, '');
  const defaultFilename = values.still ? `${stem}.png` : `${stem}${values.silent ? '-silent' : ''}.mp4`;
  const outputLocation = resolve(values.out ?? `renders/${defaultFilename}`);
  mkdirSync(dirname(outputLocation), {recursive: true});
  if (values.still) {
    const frame = Number(values.frame ?? (kind === 'test' ? 90 : 700));
    if (!Number.isInteger(frame) || frame < 0 || frame >= composition.durationInFrames) throw new Error('Still frame is outside the composition.');
    await renderStill({...common, composition, output: outputLocation, frame, imageFormat: 'png'});
  } else {
    let last = -1;
    await renderMedia({...common, composition, outputLocation, codec: 'h264', pixelFormat: 'yuv420p', crf: 18,
      concurrency: 2, imageFormat: 'jpeg', jpegQuality: 95, muted: !!values.silent,
      onProgress: ({progress}) => { const step = Math.floor(progress * 10); if (step !== last) { last = step; console.log(`Rendering ${Math.round(progress * 100)}%`); } },
    });
  }
  console.log(`Saved ${outputLocation}`);
} catch (error) {
  console.error(error instanceof Error ? error.message : error); process.exitCode = 1;
}
