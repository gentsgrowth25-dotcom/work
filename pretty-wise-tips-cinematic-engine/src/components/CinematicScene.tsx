import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import type {Scene} from '../types';
import {AssetImage} from './AssetImage';
import {CameraMotion} from './CameraMotion';
import {ParallaxLayer} from './ParallaxLayer';
import {CharacterAnimator} from './CharacterAnimator';
import {ParticleSystem} from './ParticleSystem';

export const CinematicScene: React.FC<{scene: Scene; development: boolean}> = ({scene, development}) => {
  const backgroundLayers = (scene.layers ?? []).filter((layer) => layer.plane !== 'foreground');
  const foregroundLayers = (scene.layers ?? []).filter((layer) => layer.plane === 'foreground');
  const hasArtwork = Boolean(scene.image) || (scene.mode === 'layered' && backgroundLayers.length > 0);
  if (!development && !hasArtwork) throw new Error(`Missing artwork for ${scene.id}; production requires an explicit scene image or background layers.`);
  const time = useCurrentFrame() / useVideoConfig().fps;
  const useInsert = scene.insert && time < scene.insert.duration;
  const isPlaceholder = development && !hasArtwork;
  const image = useInsert ? scene.insert?.src : scene.image ?? (isPlaceholder ? scene.development.src : undefined);
  if (!image && scene.mode === 'flattened') throw new Error(`Missing artwork for ${scene.id}; production cannot use development placeholders.`);
  return <AbsoluteFill style={{backgroundColor: scene.development.palette[0] ?? '#231d2c', overflow: 'hidden'}}>
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
    {isPlaceholder && <div style={{position: 'absolute', top: 1540, left: 90, right: 180, textAlign: 'center', color: '#eee0fa', fontFamily: 'Arial, sans-serif', fontSize: 18, letterSpacing: 3, lineHeight: 1.6}}>DEVELOPMENT ARTWORK • ILLUSTRATION REQUIRED</div>}
  </AbsoluteFill>;
};
