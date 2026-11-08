import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import type {Episode} from '../src/types';
export const loadEpisode = (filename?: string): Episode => {
  const path = resolve(filename ?? 'src/data/episodes/pilot.json');
  return JSON.parse(readFileSync(path, 'utf8')) as Episode;
};
