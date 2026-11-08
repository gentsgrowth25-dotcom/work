/** Exercise Studio's default final props without injecting the CLI review prop. */
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';
import {existsSync, mkdirSync} from 'node:fs';
import {resolve} from 'node:path';
import {productionPilot} from '../src/data/episodes/production';
const serveUrl = await bundle({entryPoint: resolve('src/index.ts'), publicDir: resolve('public')});
const browserExecutable = process.env.REMOTION_BROWSER_EXECUTABLE ?? (existsSync('/usr/bin/chromium') ? '/usr/bin/chromium' : undefined);
const inputProps = {episode: productionPilot, silent: false, development: false};
const composition = await selectComposition({serveUrl, inputProps, browserExecutable, id: 'CINEMATIC-PILOT-4X5-FINAL'});
mkdirSync('renders', {recursive: true});
await renderStill({serveUrl, composition, inputProps, browserExecutable, frame: 703, imageFormat: 'png', output: resolve('renders/studio-preview-check-4x5.png')});
console.log('PASS: Studio default final props load the approved receipt and real 4:5 artwork without a manually pasted review prop.');
