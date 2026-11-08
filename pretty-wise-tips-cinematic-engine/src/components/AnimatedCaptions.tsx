import React, {useEffect, useRef, useState} from 'react';
import {cancelRender, continueRender, delayRender, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import type {Caption, CaptionPosition, Scene} from '../types';
import {getCaptionLayout} from '../utils/caption-layout';

/** A long edited cue fails with a useful message instead of hiding its third line. */
const CaptionLayoutGuard: React.FC<{target: React.RefObject<HTMLDivElement | null>; id: string}> = ({target, id}) => {
  const [handle] = useState(() => delayRender(`Checking caption layout: ${id}`));
  useEffect(() => {
    let disposed = false;
    document.fonts.ready.then(() => {
      if (disposed) return;
      const element = target.current;
      if (!document.fonts.check("600 56px 'Pretty Sans Semibold'")) {
        cancelRender(new Error('Required caption font failed to load. Restore public/fonts/pretty-sans-semibold.ttf.'));
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
  const requested: CaptionPosition = caption.position ?? scene?.captionPosition ?? {top: Math.round(height * 0.70), left: 80, width: width - 160};
  const layout = getCaptionLayout({width, height, position: requested, text: caption.text, final: caption.final});
  const {left, top, fontSize, scale: sx} = layout;
  const boxWidth = layout.width;
  const age = time - caption.start;
  const remaining = caption.end - time;
  const fadeIn = interpolate(age, [0, 0.17], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const fadeOut = caption.final ? 1 : interpolate(remaining, [0, 0.1], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const dark = caption.color === 'dark';
  const lines = caption.text.trim().split('\n');
  let wordIndex = 0;
  const normalize = (value: string) => value.replace(/[^a-z0-9]/gi, '').toLowerCase();

  return <div data-caption={caption.id} style={{
    position: 'absolute', left, top, width: boxWidth,
    pointerEvents: 'none', textAlign: 'center', opacity: fadeIn * fadeOut,
    transform: `translateY(${(1 - fadeIn) * 8 * sx}px) scale(${0.989 + fadeIn * 0.011})`,
    transformOrigin: 'center center',
  }}>
    <div ref={textRef} data-caption-text style={{
      display: 'inline-block', maxWidth: '100%', padding: `${6 * sx}px ${10 * sx}px`,
      boxSizing: 'border-box',
      color: dark ? '#292332' : '#fff7e8',
      fontFamily: "'Pretty Sans Semibold', 'Open Sans', sans-serif", fontSize, fontWeight: 600,
      lineHeight: layout.lineHeight, letterSpacing: caption.final ? 1.0 * sx : -0.3 * sx,
      textShadow: dark ? `0 ${1 * sx}px ${3 * sx}px rgba(255,248,235,0.9)` : `0 ${2 * sx}px ${5 * sx}px rgba(20,13,14,0.95)`,
      WebkitTextStroke: `${0.8 * sx}px ${dark ? 'rgba(255,248,235,0.65)' : 'rgba(20,13,14,0.8)'}`,
      paintOrder: 'stroke fill',
      maxHeight: layout.maxHeight,
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
            color: (caption.keyword ? keyword : active) ? (dark ? '#68452f' : '#e7ce98') : 'inherit',
            whiteSpace: 'nowrap',
          }}>{token}</span>
        </React.Fragment>;
      })}</React.Fragment>)}
      <CaptionLayoutGuard key={`${caption.id}-${boxWidth}-${fontSize}-${sx}-${caption.text}`} id={caption.id} target={textRef}/>
    </div>
  </div>;
};
