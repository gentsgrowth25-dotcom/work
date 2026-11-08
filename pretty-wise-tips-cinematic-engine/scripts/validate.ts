import {parseArgs} from 'node:util';
import {resolve} from 'node:path';
import {loadEpisode} from './load-episode';
import {validateEpisode} from '../src/utils/validate';
const {values} = parseArgs({options: {episode: {type:'string'}, production:{type:'boolean'}, silent:{type:'boolean'}}});
try {
  const episode = loadEpisode(values.episode);
  const report = validateEpisode(episode, {publicDir: resolve('public'), production: values.production, silent: values.silent});
  report.warnings.forEach((message) => console.warn(`WARNING: ${message}`));
  report.errors.forEach((message) => console.error(`ERROR: ${message}`));
  if (report.errors.length) process.exitCode = 1;
  else console.log(`Valid ${values.production ? 'production' : 'development'} episode: ${episode.scenes.length} scenes; ${Math.round(episode.duration * episode.fps)} frames at ${episode.fps} fps. ${values.silent ? 'Silent mode; audio excluded.' : 'Configured audio checked.'}`);
} catch (error) {
  console.error(error instanceof Error ? error.message : error); process.exitCode = 1;
}
