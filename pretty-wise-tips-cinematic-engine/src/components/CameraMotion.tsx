import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import type {CameraKeyframe} from '../types';
import {motionTransform, sampleMotion} from '../utils/motion';

/** Applied to the whole scene; flattened portraits receive camera movement only. */
export const CameraMotion: React.FC<{keyframes: CameraKeyframe[]; children: React.ReactNode}> = ({keyframes, children}) => {
  const time = useCurrentFrame() / useVideoConfig().fps;
  const motion = sampleMotion(keyframes, time);
  return <AbsoluteFill style={{transform: motionTransform(motion), opacity: motion.opacity, transformOrigin: '50% 50%'}}>{children}</AbsoluteFill>;
};
