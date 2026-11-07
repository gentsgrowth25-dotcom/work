import {execFileSync} from 'node:child_process';
import {readFileSync,mkdirSync} from 'node:fs';
const timing=JSON.parse(readFileSync('public/episode07/narrationTiming.json','utf8'));
const duration=timing.durationInFrames/timing.fps;
const actual=Number(execFileSync('ffprobe',['-v','error','-show_entries','format=duration','-of','default=noprint_wrappers=1:nokey=1','public/'+timing.audioFile],{encoding:'utf8'}));
if(actual>duration)throw Error('Voiceover exceeds timeline: update narrationTiming.json.');
mkdirSync('out',{recursive:true});
execFileSync('npx',['remotion','render','src/episode07.tsx','PrettyWiseTipsEpisode07Voiced','out/pretty-wise-tips-episode-07.render.mp4','--browser-executable=/usr/bin/chromium','--concurrency=2','--muted','--overwrite'],{stdio:'inherit'});
execFileSync('ffmpeg',['-y','-v','error','-i','out/pretty-wise-tips-episode-07.render.mp4','-i','public/'+timing.audioFile,'-map','0:v:0','-map','1:a:0','-c:v','copy','-c:a','aac','-b:a','192k','-af','apad','-t',String(duration),'-movflags','+faststart','out/pretty-wise-tips-episode-07.mp4'],{stdio:'inherit'});
// Requested 900-frame silent timing preview; this is NOT synced to the 32.29s audio.
execFileSync('ffmpeg',['-y','-v','error','-i','out/pretty-wise-tips-episode-07.render.mp4','-an','-vf',`setpts=${30/duration}*PTS,fps=30`,'-frames:v','900','-t','30','-c:v','libx264','-crf','18','-preset','fast','-movflags','+faststart','-metadata','title=30-second silent timing preview','out/pretty-wise-tips-episode-07-silent-30s-v1.mp4'],{stdio:'inherit'});
