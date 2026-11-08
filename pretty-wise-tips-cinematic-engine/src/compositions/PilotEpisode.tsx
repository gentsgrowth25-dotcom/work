import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import type {AudioTrack, CompositionProps} from '../types';
import {CinematicScene} from '../components/CinematicScene';
import {AnimatedCaptions} from '../components/AnimatedCaptions';
import {SceneTransition} from '../components/SceneTransition';
import {FilmTexture} from '../components/FilmTexture';

const Track: React.FC<{track: AudioTrack}> = ({track}) => {
  const {fps} = useVideoConfig();
  return <Sequence from={Math.round((track.start ?? 0) * fps)} durationInFrames={Math.max(1, Math.ceil(track.duration * fps))}>
    <Audio src={staticFile(track.src)} volume={(frame) => {
      const seconds = frame / fps;
      const enter = track.fadeIn > 0 ? Math.min(1, seconds / track.fadeIn) : 1;
      const exit = track.fadeOut > 0 ? Math.min(1, Math.max(0, (track.duration - seconds) / track.fadeOut)) : 1;
      return track.volume * enter * exit;
    }}/>
  </Sequence>;
};

/** Scenes use local frames; captions and audio retain episode-global timing. */
export const PilotEpisode: React.FC<CompositionProps> = ({episode, silent = false, development = true}) => {
  const frame = useCurrentFrame();
  // Font declarations travel with the project and do not rely on network fonts.
  const styles = `@font-face{font-family:'Pretty Serif';src:url('${staticFile('fonts/pretty-serif-bold.ttf')}') format('truetype');font-weight:700;font-display:block;}@font-face{font-family:'Pretty Sans';src:url('${staticFile('fonts/pretty-sans.ttf')}') format('truetype');font-display:block;}`;
  return <AbsoluteFill style={{backgroundColor: '#241e2c', overflow: 'hidden'}}>
    <style>{styles}</style>
    {episode.scenes.map((scene, index) => {
      const start = Math.round(scene.start * episode.fps);
      const next = episode.scenes[index + 1];
      const hold = next?.transition?.type === 'dissolve' ? Math.ceil(next.transition.duration * episode.fps) : 0;
      const end = Math.min(Math.round(episode.duration * episode.fps), Math.round((scene.start + scene.duration) * episode.fps) + hold);
      return <Sequence key={scene.id} from={start} durationInFrames={end - start} name={scene.title}>
        <SceneTransition scene={scene}><CinematicScene scene={scene} development={development}/></SceneTransition>
      </Sequence>;
    })}
    <FilmTexture settings={episode.film}/>
    <AnimatedCaptions captions={episode.captions} scenes={episode.scenes}/>
    {development ? <div data-development-banner style={{position: 'absolute', top: 100, left: 90, right: 180, color: '#e7d9f1', fontFamily: 'Pretty Sans, sans-serif', fontSize: 21, letterSpacing: 2.4, textAlign: 'center', opacity: .86}}>
      DEVELOPMENT PREVIEW · {silent ? 'SILENT' : 'SUPPLIED NARRATION'}
    </div> : null}
    {!silent && episode.voiceover ? <Track track={episode.voiceover}/> : null}
    {!silent && episode.music ? <Track track={episode.music}/> : null}
  </AbsoluteFill>;
};
