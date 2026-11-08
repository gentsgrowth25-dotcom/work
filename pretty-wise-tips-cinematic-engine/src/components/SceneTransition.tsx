import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import type {Scene} from '../types';
import {clamp} from '../utils/motion';

/** Incoming layer dissolves over a held outgoing shot; parent must extend its sequence. */
export const SceneTransition: React.FC<{scene: Scene; children: React.ReactNode}> = ({scene, children}) => {
  const frame = useCurrentFrame();
  const fps = useVideoConfig().fps;
  const duration = scene.transition?.duration ?? 0;
  const opacity = scene.start === 0 || scene.transition?.type !== 'dissolve' || duration === 0 ? 1 : clamp(frame / (duration * fps));
  return <AbsoluteFill style={{opacity}}>{children}</AbsoluteFill>;
};
