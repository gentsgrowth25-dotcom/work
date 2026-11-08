import React, {useEffect, useRef, useState} from 'react';
import {cancelRender, continueRender, delayRender, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import type {Caption, CaptionPosition, Scene} from '../types';

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

/** A long edited cue fails with a useful message instead of hiding its third line. */
const CaptionLayoutGuard: React.FC<{target: React.RefObject<HTMLDivElement | null>; id: string}> = ({target, id}) => {
  const [handle] = useState(() => delayRender(`Checking caption layout: ${id}`));
  useEffect(() => {
    let disposed = false;
    document.fonts.ready.then(() => {
      if (disposed) return;
      const element = target.current;
      if (!document.fonts.check("700 64px 'Pretty Serif'")) {
        cancelRender(new Error('Required Pretty Serif font failed to load. Restore public/fonts/pretty-serif-bold.ttf.'));
      } else if (element && (element.scrollHeight > element.clientHeight + 2 || element.scrollWidth > element.clientWidth + 2)) {
        cancelRender(new Error(`Caption ${id} exceeds its two-line box. Split the phrase or add an earlier caption cue.`));
      } else continueRender(handle);
    }).catch(cancelRender);
    return () => {disposed = true; continueRender(handle);};
  }, [handle, id, target]);
  return null;
};

/** Caption/word times are absolute episode seconds, independent of scene cuts. */
export const AnimatedCaptions: React.FC<{captions: Caption[]; scenes: Scene[]}> = ({captions, scenes}) => {
  const frame = useCurrentFrame();
  const {fps, width, height} = useVideoConfig();
  const textRef = useRef<HTMLDivElement>(null);
  const time = frame / fps;
  const caption = captions.find((item) => time >= item.start && time < item.end);
  if (!caption) return null;

  const scene = [...scenes].reverse().find((item) => time >= item.start && time < item.start + item.duration);
  const requested: CaptionPosition = caption.position ?? scene?.captionPosition ?? {top: 1230, left: 90, width: 810};
  const sx = width / 1080;
  const sy = height / 1920;
  const left = clamp(requested.left, 90, 800);
  const boxWidth = clamp(requested.width, 100, 900 - left);
  const top = clamp(requested.top, 260, 1360);
  const age = time - caption.start;
  const remaining = caption.end - time;
  const fadeIn = interpolate(age, [0, 0.17], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const fadeOut = caption.final ? 1 : interpolate(remaining, [0, 0.1], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const dark = caption.color === 'dark';
  const fontSize = caption.final ? 74 : caption.text.length > 55 ? 51 : caption.text.length > 40 ? 57 : 64;
  const lines = caption.text.trim().split('\n');
  let wordIndex = 0;
  const normalize = (value: string) => value.replace(/[^a-z0-9]/gi, '').toLowerCase();

  return <div data-caption={caption.id} style={{
    position: 'absolute', left: left * sx, top: top * sy, width: boxWidth * sx,
    pointerEvents: 'none', textAlign: 'center', opacity: fadeIn * fadeOut,
    transform: `translateY(${(1 - fadeIn) * 12 * sy}px) scale(${0.982 + fadeIn * 0.018})`,
    transformOrigin: 'center center',
  }}>
    <div ref={textRef} data-caption-text style={{
      display: 'inline-block', maxWidth: '100%', padding: `${14 * sy}px ${20 * sx}px`,
      boxSizing: 'border-box', borderRadius: 12 * sx,
      background: dark ? 'rgba(255,248,235,0.83)' : 'rgba(28,23,35,0.69)',
      color: dark ? '#292332' : '#fff7e8',
      fontFamily: "'Pretty Serif', Georgia, serif", fontSize: fontSize * sx, fontWeight: 700,
      lineHeight: 1.17, letterSpacing: caption.final ? 1.6 * sx : -0.4 * sx,
      textShadow: dark ? 'none' : `0 ${2 * sy}px ${5 * sx}px rgba(0,0,0,0.6)`,
      maxHeight: (fontSize * sx * 1.17 * 2) + 28 * sy,
      overflow: 'hidden', overflowWrap: 'normal',
    }}>
      {lines.map((line, lineIndex) => <React.Fragment key={lineIndex}>
        {lineIndex > 0 ? <br/> : null}
        {line.trim().split(/\s+/).map((token, index) => {
        const word = caption.words?.[wordIndex++];
        const active = word !== undefined && time >= word.start && time < word.end;
        const keyword = caption.keyword && normalize(token) === normalize(caption.keyword);
        return <React.Fragment key={`${caption.id}-${index}`}>
          {index > 0 ? ' ' : ''}
          <span data-active-word={active || undefined} style={{
            color: active || keyword ? (dark ? '#664b86' : '#d8c2f5') : 'inherit',
            whiteSpace: 'nowrap',
          }}>{token}</span>
        </React.Fragment>;
      })}</React.Fragment>)}
      <CaptionLayoutGuard key={`${caption.id}-${boxWidth}-${fontSize}-${sx}-${caption.text}`} id={caption.id} target={textRef}/>
    </div>
  </div>;
};
