import {existsSync,writeFileSync,readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
const audio=['voiceover.mp3','voiceover.wav'].find(f=>existsSync('public/'+f));
let durationFrames=1410;
if(audio){
 const duration=Number(execFileSync('ffprobe',['-v','error','-show_entries','format=duration','-of','default=noprint_wrappers=1:nokey=1','public/'+audio],{encoding:'utf8'}));
 durationFrames=Math.ceil((duration+.5)*30);
 const timing=JSON.parse(readFileSync('public/narrationTiming.json'));
 if(timing.status!=='manually aligned to supplied audio')throw Error('Audio found. Refine scene start/end times in public/narrationTiming.json against the actual recording, then set status to "manually aligned to supplied audio". Automatic alignment is not available.');
 if(timing.scenes.at(-1).end>durationFrames/30)throw Error('Scene timings exceed narration plus outro.');
}
writeFileSync('out/render-props.json',JSON.stringify({audioFile:audio,durationFrames}));
execFileSync('npx',['remotion','render','src/index.tsx','PrettyWiseTipsEpisode','out/pretty-wise-tips-episode-01.mp4','--props=out/render-props.json','--browser-executable=/usr/bin/chromium','--concurrency=2'],{stdio:'inherit'});
