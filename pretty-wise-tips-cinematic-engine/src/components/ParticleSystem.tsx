import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import type {Scene} from '../types';

/** Deterministic auxiliary light motes; illustrated props belong in scene.layers. */
export const ParticleSystem: React.FC<{settings: NonNullable<Scene['particles']>}> = ({settings}) => {
  const frame = useCurrentFrame();
  const {fps, width, height} = useVideoConfig();
  const time = frame / fps;
  const noise = (n: number) => {
    const value = Math.sin(n * 127.1 + settings.seed * 311.7) * 43758.5453123;
    return value - Math.floor(value);
  };
  return <AbsoluteFill style={{pointerEvents: 'none', overflow: 'hidden'}}>
    {Array.from({length: Math.min(60, Math.max(0, Math.floor(settings.count)))}, (_, i) => {
      const x = noise(i + 1) * width;
      const travel = (noise(i + 101) * height - time * (7 + noise(i + 201) * 11) + height * 10) % height;
      const size = (1.4 + noise(i + 301) * 2.6) * width / 1080;
      const glow = 0.4 + (Math.sin(time * 1.3 + noise(i + 401) * Math.PI * 2) + 1) * 0.3;
      return <div key={i} style={{position: 'absolute', left: x + Math.sin(time * 0.3 + i) * 9, top: travel,
        width: size, height: size, borderRadius: '50%', background: '#fff3d8',
        opacity: Math.min(1, Math.max(0, settings.opacity)) * glow,
        boxShadow: `0 0 ${size * 2}px rgba(255,244,212,0.4)`,
      }}/>;
    })}
  </AbsoluteFill>;
};
