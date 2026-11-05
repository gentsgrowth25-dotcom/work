import {execFileSync} from 'node:child_process';
import {readFileSync,mkdirSync} from 'node:fs';
const timing=JSON.parse(readFileSync('public/episode06/narrationTiming.json','utf8'));
const duration=timing.durationInFrames/timing.fps;
const actual=Number(execFileSync('ffprobe',['-v','error','-show_entries','format=duration','-of','default=noprint_wrappers=1:nokey=1','public/'+timing.audioFile],{encoding:'utf8'}));
if(actual>duration)throw Error('Voiceover exceeds timeline: update narrationTiming.json before rendering.');
mkdirSync('out',{recursive:true});
execFileSync('npx',['remotion','render','src/episode06.tsx','PrettyWiseTipsEpisode06','out/pretty-wise-tips-episode-06.render.mp4','--browser-executable=/usr/bin/chromium','--concurrency=2','--muted','--overwrite'],{stdio:'inherit'});
// Mux directly from the original to avoid the measured delay in Remotion's audio mix.
execFileSync('ffmpeg',['-y','-v','error','-i','out/pretty-wise-tips-episode-06.render.mp4','-i','public/'+timing.audioFile,'-map','0:v:0','-map','1:a:0','-c:v','copy','-c:a','aac','-b:a','192k','-af','apad','-t',String(duration),'-movflags','+faststart','out/pretty-wise-tips-episode-06.mp4'],{stdio:'inherit'});
// Also retain the requested visuals-only editing version on the same audio-aligned timeline.
execFileSync('ffmpeg',['-y','-v','error','-i','out/pretty-wise-tips-episode-06.render.mp4','-map','0:v:0','-c:v','copy','-an','-movflags','+faststart','out/pretty-wise-tips-episode-06-silent-v1.mp4'],{stdio:'inherit'});
