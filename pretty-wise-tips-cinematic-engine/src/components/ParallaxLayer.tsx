import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import type {CameraKeyframe, Layer} from '../types';
import {motionTransform, sampleMotion} from '../utils/motion';
import {AssetImage} from './AssetImage';

/** Depth adds registered-layer motion to the common camera. Zero means locked to camera. */
export const ParallaxLayer: React.FC<{layer: Layer; camera?: CameraKeyframe[]}> = ({layer, camera}) => {
  const time = useCurrentFrame() / useVideoConfig().fps;
  const motion = sampleMotion(layer.keyframes, time);
  const cameraMotion = sampleMotion(camera, time);
  const depth = layer.depth ?? 0;
  const combined = {...motion, x: motion.x + cameraMotion.x * depth, y: motion.y + cameraMotion.y * depth};
  return <AbsoluteFill style={{transform: motionTransform(combined), opacity: motion.opacity, transformOrigin: layer.pivot ? `${layer.pivot[0]}px ${layer.pivot[1]}px` : '50% 50%'}}><AssetImage src={layer.src} fit={layer.fit} /></AbsoluteFill>;
};
