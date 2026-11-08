import React from 'react';
import {AbsoluteFill} from 'remotion';
import type {CompositionProps, Scene} from '../types';
import {SceneArtwork} from '../components/CinematicScene';
import {EpisodeTimeline} from './PilotEpisode';

/** Legacy fallback selection exists only in the explicit DEVELOPMENT_PREVIEW composition. */
const DevelopmentScene: React.FC<{scene: Scene}> = ({scene}) => {
  const hasArtwork = Boolean(scene.image) || (scene.mode === 'layered' && (scene.layers ?? []).some((layer) => layer.plane !== 'foreground'));
  const imageScene = hasArtwork ? scene : {...scene, image: scene.development.src};
  return <AbsoluteFill>
    <SceneArtwork scene={imageScene}/>
    {!hasArtwork ? <div style={{position: 'absolute', top: 1540, left: 90, right: 180, textAlign: 'center', color: '#eee0fa', fontFamily: 'Arial, sans-serif', fontSize: 18, letterSpacing: 3, lineHeight: 1.6}}>DEVELOPMENT ARTWORK · ILLUSTRATION REQUIRED</div> : null}
  </AbsoluteFill>;
};

export const DevelopmentPreview: React.FC<CompositionProps> = ({episode, silent}) => <EpisodeTimeline episode={episode} silent={silent} sceneRenderer={DevelopmentScene} developmentBanner/>;
