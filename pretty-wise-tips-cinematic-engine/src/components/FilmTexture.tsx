import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import type {FilmSettings} from '../types';

// A tiny, repeated, static auxiliary texture. No animated SVG/filter runs per frame.
const grainTile = `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.84" numOctaves="2" seed="17" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter><rect width="100%" height="100%" filter="url(#n)" opacity="0.7"/></svg>')}`;
const clamp = (value: number, max = 1) => Math.min(max, Math.max(0, value));

/** Optional broadcast treatment. Keep all strengths restrained; never transforms faces. */
export const FilmTexture: React.FC<{settings: FilmSettings}> = ({settings}) => {
  const frame = useCurrentFrame();
  if (!settings.enabled) return null;
  return <AbsoluteFill style={{pointerEvents: 'none'}}>
    {settings.softness > 0 ? <AbsoluteFill style={{backdropFilter: `blur(${clamp(settings.softness, 0.6)}px)`}}/> : null}
    {settings.muted > 0 ? <AbsoluteFill style={{background: '#9d968c', opacity: clamp(settings.muted, 0.25)}}/> : null}
    {settings.colorBleed > 0 ? <AbsoluteFill style={{
      background: 'linear-gradient(90deg, rgba(152,127,157,0.1), rgba(231,211,175,0.07))',
      opacity: clamp(settings.colorBleed),
    }}/> : null}
    {settings.grain > 0 ? <AbsoluteFill style={{
      backgroundImage: `url("${grainTile}")`, backgroundRepeat: 'repeat',
      backgroundPosition: `${(frame * 23) % 160}px ${(frame * 41) % 160}px`,
      opacity: clamp(settings.grain, 0.16),
    }}/> : null}
    {settings.vignette > 0 ? <AbsoluteFill style={{
      background: 'radial-gradient(ellipse at 50% 45%, transparent 42%, rgba(23,16,26,0.7) 100%)',
      opacity: clamp(settings.vignette, 0.4),
    }}/> : null}
  </AbsoluteFill>;
};
