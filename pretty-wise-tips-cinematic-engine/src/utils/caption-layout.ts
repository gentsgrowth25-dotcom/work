import type {CaptionPosition} from '../types';

const clamp = (value: number, minimum: number, maximum: number) => Math.min(maximum, Math.max(minimum, value));

/** Configured positions are actual composition pixels, including on a native 4:5 frame. */
export const getCaptionLayout = ({width, height, position, text, final = false}: {
  width: number; height: number; position?: CaptionPosition; text: string; final?: boolean;
}) => {
  const scale = width / 1080;
  const requested = position ?? {left: 80 * scale, top: Math.round(height * 0.70), width: width - 160 * scale};
  const fontSize = (final ? 64 : text.length > 40 ? 50 : 56) * scale;
  const lineHeight = 1.2;
  const maxHeight = fontSize * lineHeight * 2 + 12 * scale;
  const left = clamp(requested.left, 80 * scale, width - 180 * scale);
  return {
    left, top: clamp(requested.top, 95 * scale, height - 190 * scale - maxHeight),
    width: clamp(requested.width, 100 * scale, width - 80 * scale - left),
    fontSize, lineHeight, maxHeight, scale,
  };
};
