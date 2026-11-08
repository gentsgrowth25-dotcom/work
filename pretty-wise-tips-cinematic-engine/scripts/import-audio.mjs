import {execFileSync} from 'node:child_process';
import {copyFileSync, existsSync, mkdirSync} from 'node:fs';
import {basename, resolve} from 'node:path';
const args = process.argv.slice(2);
const filename = args.find((arg) => !arg.startsWith('--'));
if (!filename) {
  console.log('Usage: npm run audio:inspect -- /path/to/ElevenLabs.mp3 [--copy]\nRequires FFmpeg/ffprobe on PATH. Reports metadata; caption alignment must be imported separately.');
  process.exit(0);
}
try {
  const source = resolve(filename);
  if (!existsSync(source)) throw new Error('Audio file does not exist.');
  const metadata = JSON.parse(execFileSync('ffprobe', ['-v','error','-show_format','-show_streams','-of','json',source], {encoding:'utf8'}));
  if (!metadata.streams.some((s) => s.codec_type === 'audio')) throw new Error('Input contains no audio stream.');
  const duration = Number(metadata.format.duration);
  const name = basename(source).replace(/[^a-zA-Z0-9._-]/g, '-');
  const src = `audio/${name}`;
  if (args.includes('--copy')) {
    const target = resolve('public', src);
    mkdirSync(resolve('public/audio'), {recursive:true});
    if (target !== source && existsSync(target)) throw new Error(`Destination exists: ${target}. Choose a new filename to preserve the previous narration.`);
    if (target !== source) copyFileSync(source,target);
    console.log(`Copied to public/${src}`);
  }
  console.log(JSON.stringify({voiceover:{src,duration,start:0,volume:1,fadeIn:0,fadeOut:0.15},suggestedDurationAt30fps:Math.ceil(duration*30)/30,captionTiming:'provisional'},null,2));
  console.log('Apply voiceover metadata to your episode JSON; align and review captions against this exact recording before changing captionTiming. Existing timings are not reused automatically.');
} catch(error) { console.error(error.message); process.exitCode=1; }
