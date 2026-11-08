import {bundle} from '@remotion/bundler';
import {renderMedia, renderStill, selectComposition} from '@remotion/renderer';
import {existsSync, mkdirSync} from 'node:fs';
import {dirname, resolve} from 'node:path';
import {parseArgs} from 'node:util';
import {loadEpisode} from './load-episode';
import {validateEpisode} from '../src/utils/validate';

const {values} = parseArgs({options: {
  episode: {type: 'string'}, out: {type: 'string'}, production: {type: 'boolean'},
  silent: {type: 'boolean'}, still: {type: 'boolean'}, frame: {type: 'string'},
}});
try {
  const episode = loadEpisode(values.episode);
  const report = validateEpisode(episode, {publicDir: resolve('public'), production: values.production, silent: values.silent});
  report.warnings.forEach((message) => console.warn(`WARNING: ${message}`));
  if (report.errors.length) throw new Error(report.errors.join('\n'));
  const inputProps = {episode, silent: !!values.silent, development: !values.production};
  const serveUrl = await bundle({entryPoint: resolve('src/index.ts'), publicDir: resolve('public')});
  const browserExecutable = process.env.REMOTION_BROWSER_EXECUTABLE ?? (existsSync('/usr/bin/chromium') ? '/usr/bin/chromium' : undefined);
  const common = {serveUrl, inputProps, browserExecutable};
  const composition = await selectComposition({...common, id: 'PrettyWisePilot'});
  const outputLocation = resolve(values.out ?? (values.still ? 'renders/pilot-development.png' : values.silent ? 'renders/pilot-development-silent.mp4' : values.production ? 'renders/pilot.mp4' : 'renders/pilot-development.mp4'));
  mkdirSync(dirname(outputLocation), {recursive: true});
  if (values.still) {
    const frame = Number(values.frame ?? 700);
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
