import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import type {Scene} from '../types';
import {isDevelopmentArtworkPath} from '../data/required-assets';
import {AssetImage} from './AssetImage';
import {CameraMotion} from './CameraMotion';
import {ParallaxLayer} from './ParallaxLayer';
import {CharacterAnimator} from './CharacterAnimator';
import {ParticleSystem} from './ParticleSystem';

/** Shared raster renderer. It never chooses a fallback or adds labels. */
export const SceneArtwork: React.FC<{scene: Scene}> = ({scene}) => {
  const backgroundLayers = (scene.layers ?? []).filter((layer) => layer.plane !== 'foreground');
  const foregroundLayers = (scene.layers ?? []).filter((layer) => layer.plane === 'foreground');
  const time = useCurrentFrame() / useVideoConfig().fps;
  const useInsert = scene.insert && time < scene.insert.duration;
  const image = useInsert ? scene.insert?.src : scene.image;
  return <AbsoluteFill style={{backgroundColor: '#000', overflow: 'hidden'}}>
    <AbsoluteFill style={{filter: (scene.lighting?.brightness ?? 1) === 1 && (scene.lighting?.saturation ?? 1) === 1 ? undefined : `brightness(${scene.lighting?.brightness ?? 1}) saturate(${scene.lighting?.saturation ?? 1})`}}>
      <CameraMotion keyframes={scene.camera}>
        {scene.mode === 'flattened' || useInsert ? image && <AbsoluteFill><AssetImage src={image} /></AbsoluteFill> : <>
          {image && <AbsoluteFill><AssetImage src={image} /></AbsoluteFill>}
          {backgroundLayers.map((layer) => <ParallaxLayer key={layer.id} layer={layer} camera={scene.camera} />)}
          {scene.character && <CharacterAnimator rig={scene.character} />}
          {foregroundLayers.map((layer) => <ParallaxLayer key={layer.id} layer={layer} camera={scene.camera} />)}
        </>}
      </CameraMotion>
    </AbsoluteFill>
    {scene.particles && <ParticleSystem settings={scene.particles} />}
  </AbsoluteFill>;
};

export const sceneArtworkPaths = (scene: Scene): string[] => [
  scene.image, scene.insert?.src,
  ...(scene.layers ?? []).map((layer) => layer.src),
  ...(scene.character?.parts ?? []).map((part) => part.src),
  ...Object.values(scene.character?.expressions ?? {}),
  ...(scene.character?.eyes ? [scene.character.eyes.open, scene.character.eyes.half, scene.character.eyes.closed] : []),
  ...Object.values(scene.character?.mouths ?? {}),
].filter((src): src is string => src !== undefined);

/** Generic image-only scene. The compatibility development prop is deliberately ignored. */
export const CinematicScene: React.FC<{scene: Scene; development?: boolean}> = ({scene}) => {
  const hasBackground = Boolean(scene.image) || (scene.mode === 'layered' && (scene.layers ?? []).some((layer) => layer.plane !== 'foreground'));
  if (!hasBackground) throw new Error(`Missing actual illustrated artwork for ${scene.id}. Production scenes have no placeholder fallback.`);
  const forbidden = sceneArtworkPaths(scene).find(isDevelopmentArtworkPath);
  if (forbidden) throw new Error(`Production scene ${scene.id} cannot load development artwork ${forbidden}.`);
  return <SceneArtwork scene={scene}/>;
};
