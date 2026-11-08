import {parseArgs} from 'node:util';
import {resolve} from 'node:path';
import {developmentPilot, productionPilot, vintageVisualTest} from '../src/data/episodes/production';
import {loadEpisode} from './load-episode';
import {preflightRender} from './preflight';
import {compositionIdFor, resolveRenderKind} from './render-request';

const {values} = parseArgs({options: {
  composition: {type: 'string'}, episode: {type: 'string'}, production: {type: 'boolean'},
  silent: {type: 'boolean'}, review: {type: 'string'},
}});
try {
  const kind = resolveRenderKind(values);
  const episode = values.episode ? loadEpisode(values.episode) : {final: productionPilot, test: vintageVisualTest, development: developmentPilot}[kind];
  const report = preflightRender(episode, {kind, publicDir: resolve('public'), projectDir: process.cwd(), reviewFile: values.review, silent: values.silent});
  report.warnings.forEach((message) => console.warn(`WARNING: ${message}`));
  report.errors.forEach((message) => console.error(`ERROR: ${message}`));
  if (report.errors.length) process.exitCode = 1;
  else console.log(`Preflight passed for ${compositionIdFor(kind)}: ${episode.scenes.length} scene(s), ${Math.round(episode.duration * episode.fps)} frames. Illustration aesthetics still require visual review.`);
} catch (error) {console.error(error instanceof Error ? error.message : error); process.exitCode = 1;}
