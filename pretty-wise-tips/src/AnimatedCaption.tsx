import type {CSSProperties} from 'react';
import {routineTheme} from './episode06Theme';

export type AnimatedCaptionItem = {
  text: string;
  startFrame: number;
  endFrame: number;
  highlightWord: string;
  highlightStartFrame: number;
};

export type AnimatedCaptionProps = {
  /** Absolute episode frame, including when rendered inside a Sequence. */
  frame: number;
  items: AnimatedCaptionItem[];
  top?: number;
  width?: number;
};

const normalizeWord = (word: string) =>
  word.normalize('NFKC').toLocaleLowerCase('en-US').replace(/[^\p{L}\p{N}]/gu, '');

const smooth = (value: number) => {
  const clamped = Math.max(0, Math.min(1, value));
  return clamped * clamped * (3 - 2 * clamped);
};

// Arial's approximate glyph advances keep wrapping deterministic during rendering.
// A small safety margin accounts for the heavier caption weight.
const wordWidth = (word: string, fontSize: number) =>
  [...word].reduce((total, character) => {
    if (/[ilI.,!':;|]/.test(character)) return total + 0.29;
    if (/[mwMW@%]/.test(character)) return total + 0.87;
    if (/[A-Z]/.test(character)) return total + 0.70;
    if (/[frt()\[\]]/.test(character)) return total + 0.39;
    return total + 0.57;
  }, 0) * fontSize * 1.035;

const lineWidth = (words: string[], fontSize: number) =>
  words.reduce((total, word) => total + wordWidth(word, fontSize), 0) +
  Math.max(0, words.length - 1) * fontSize * 0.29;

const layoutCaption = (words: string[], availableWidth: number) => {
  // Briefs use three to five words per cue. Keep all supplied words intact and
  // balance a longer cue across two explicit lines, never across three lines.
  for (let fontSize = 72; fontSize >= 65; fontSize--) {
    if (lineWidth(words, fontSize) <= availableWidth) {
      return {fontSize, lines: [words]};
    }
    let bestSplit = 0;
    let bestBalance = Number.POSITIVE_INFINITY;
    for (let split = 1; split < words.length; split++) {
      const first = lineWidth(words.slice(0, split), fontSize);
      const second = lineWidth(words.slice(split), fontSize);
      if (Math.max(first, second) <= availableWidth && Math.abs(first - second) < bestBalance) {
        bestSplit = split;
        bestBalance = Math.abs(first - second);
      }
    }
    if (bestSplit) {
      return {fontSize, lines: [words.slice(0, bestSplit), words.slice(bestSplit)]};
    }
  }
  // Oversized externally supplied cues remain complete, with at most two lines.
  const split = Math.max(1, Math.ceil(words.length / 2));
  return {fontSize: 65, lines: [words.slice(0, split), words.slice(split)].filter((line) => line.length)};
};

export const AnimatedCaption = ({
  frame,
  items,
  top = 1070,
  width = 900,
}: AnimatedCaptionProps) => {
  const item = items.find((candidate) => frame >= candidate.startFrame && frame < candidate.endFrame);
  if (!item) return null;

  const words = item.text.trim().split(/\s+/).filter(Boolean);
  if (!words.length) return null;

  const {fontSize, lines} = layoutCaption(words, width - 48);
  const highlightIndex = words.findIndex((word) => normalizeWord(word) === normalizeWord(item.highlightWord));
  const entered = smooth((frame - item.startFrame + 1) / 5);
  const exiting = smooth((item.endFrame - frame) / 3);
  const opacity = entered * exiting;
  const translateY = (1 - entered) * 11 - (1 - exiting) * 3;
  const scale = 0.987 + entered * 0.013;
  const outerStyle: CSSProperties = {
    position: 'absolute',
    top,
    left: '50%',
    width,
    marginLeft: -width / 2,
    zIndex: 30,
    pointerEvents: 'none',
    textAlign: 'center',
    opacity,
    transform: `translateY(${translateY}px) scale(${scale})`,
    transformOrigin: 'center center',
  };

  let wordIndex = 0;
  return (
    <div style={outerStyle} data-caption={item.text}>
      <div style={{
        display: 'inline-block',
        maxWidth: '100%',
        padding: '12px 24px',
        boxSizing: 'border-box',
        borderRadius: 14,
        background: routineTheme.background,
        color: routineTheme.ink,
        fontFamily: 'Arial, Helvetica, sans-serif',
        fontWeight: 800,
        fontSize,
        lineHeight: 1.12,
        letterSpacing: '-0.7px',
        fontVariantLigatures: 'none',
        textShadow: '0 1px 1px rgba(23,19,27,0.08)',
      }}>
        {lines.map((line, lineIndex) => (
          <div key={lineIndex} style={{whiteSpace: 'nowrap'}}>
            {line.map((word, index) => {
              const isHighlighted = wordIndex++ === highlightIndex && frame >= item.highlightStartFrame;
              return (
                <span key={index} style={{color: isHighlighted ? routineTheme.accent : routineTheme.ink}}>
                  {index > 0 ? ' ' : ''}{word}
                </span>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};
