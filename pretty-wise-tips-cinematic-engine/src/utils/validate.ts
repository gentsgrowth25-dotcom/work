import {existsSync, statSync} from 'node:fs';
import path from 'node:path';
import type {AudioTrack, CaptionPosition, Episode, Layer, MotionKeyframe} from '../types';

export type ValidationOptions = {publicDir: string; production?: boolean; silent?: boolean};
export type ValidationResult = {errors: string[]; warnings: string[]};

/** Assets actually consumed by a render. Unused fallback artwork is excluded. */
export const collectAssetPaths = (episode: Episode, options: {silent?: boolean; development?: boolean} = {}): string[] => {
  const result: string[] = [];
  const add = (src: string | undefined) => {if (src !== undefined) result.push(src);};
  for (const scene of episode.scenes ?? []) {
    add(scene.image);
    const hasBackgroundLayers = (scene.layers ?? []).some((item) => item.plane !== 'foreground');
    if (options.development && scene.image === undefined && !hasBackgroundLayers) add(scene.development?.src);
    add(scene.insert?.src);
    for (const layer of scene.layers ?? []) add(layer.src);
    const rig = scene.character;
    if (rig) {
      for (const part of rig.parts ?? []) add(part.src);
      for (const src of Object.values(rig.expressions ?? {})) add(src);
      if (rig.eyes) {add(rig.eyes.open); add(rig.eyes.half); add(rig.eyes.closed);}
      for (const src of Object.values(rig.mouths ?? {})) add(src);
    }
  }
  if (!options.silent) {add(episode.voiceover?.src); add(episode.music?.src);}
  return [...new Set(result)];
};

const finite = (value: unknown): value is number => typeof value === 'number' && Number.isFinite(value);
const safeAssetPath = (src: string) => typeof src === 'string' && src.trim().length > 0 &&
  !src.includes('\0') && !src.includes('\\') && !path.posix.isAbsolute(src) &&
  !/^[a-z][a-z0-9+.-]*:/i.test(src) && !src.split('/').includes('..');

/** Validate before bundling: referenced missing assets always fail, including in development. */
export const validateEpisode = (episode: Episode, options: ValidationOptions): ValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];
  const error = (message: string) => errors.push(message);
  const positive = (value: unknown, label: string, integer = false) => {
    if (!finite(value) || value <= 0 || (integer && !Number.isInteger(value))) error(`${label} must be a positive ${integer ? 'integer' : 'number'}.`);
  };
  positive(episode.width, 'width', true); positive(episode.height, 'height', true);
  positive(episode.fps, 'fps', true); positive(episode.duration, 'duration');
  const fps = finite(episode.fps) && episode.fps > 0 ? episode.fps : 30;
  const epsilon = 1 / fps + 1e-7;
  const frame = (seconds: number) => Math.round(seconds * fps);
  if (!episode.id?.trim() || !episode.title?.trim()) error('Episode id and title are required.');
  if (options.production && episode.artworkStatus !== 'production') error('Production render requires artworkStatus "production" and completed scene artwork.');
  if (options.production && episode.captionTiming === 'provisional') error('Production captions cannot use provisional estimated timings.');
  if (episode.captionTiming === 'asr-aligned') warnings.push('Caption word timings were aligned by ASR and need listening review; they are not human verified.');
  if (!options.production && episode.artworkStatus === 'development') warnings.push('Development artwork is a marked placeholder animatic, not finished cinematic illustration.');

  const keyframes = (keys: MotionKeyframe[] | undefined, label: string, duration: number) => {
    let previous = -Infinity;
    for (const key of keys ?? []) {
      if (!finite(key.time) || key.time < 0 || key.time > duration + epsilon) error(`${label}: keyframe time must be inside the scene.`);
      if (key.time <= previous) error(`${label}: keyframe times must be strictly increasing.`);
      previous = key.time;
      for (const property of ['x', 'y', 'scale', 'rotation', 'opacity'] as const) {
        if (key[property] !== undefined && !finite(key[property])) error(`${label}: ${property} must be finite.`);
      }
      if (key.scale !== undefined && key.scale <= 0) error(`${label}: scale must be positive.`);
      if (key.opacity !== undefined && (key.opacity < 0 || key.opacity > 1)) error(`${label}: opacity must be between 0 and 1.`);
      if (key.ease !== undefined && !['linear', 'ease-in-out', 'ease-out'].includes(key.ease)) error(`${label}: unsupported easing.`);
    }
  };
  const position = (p: CaptionPosition | undefined, label: string) => {
    if (!p) return;
    if (![p.left, p.top, p.width].every(finite) || p.width <= 0) {error(`${label}: caption coordinates must be finite with positive width.`); return;}
    const captionScale = episode.width / 1080;
    const maxCaptionHeight = 64 * captionScale * 1.2 * 2 + 12 * captionScale;
    if (p.left < 80 * captionScale || p.left + p.width > episode.width - 80 * captionScale || p.top < 95 * captionScale || p.top + maxCaptionHeight > episode.height - 190 * captionScale) error(`${label}: caption position exceeds Instagram-safe bounds (80px left/right, 95px top, 190px bottom at 1080px width).`);
  };
  const layer = (item: Layer, label: string, duration: number) => {
    if (!item.id?.trim()) error(`${label}: layer id is required.`);
    if (item.src === undefined) error(`${label}: layer source is required.`);
    if (item.depth !== undefined && !finite(item.depth)) error(`${label}: parallax depth must be finite.`);
    if (item.pivot && (item.pivot.length !== 2 || !item.pivot.every(finite))) error(`${label}: pivot must contain two finite coordinates.`);
    keyframes(item.keyframes, label, duration);
  };

  const scenes = episode.scenes ?? [];
  if (!scenes.length) error('At least one scene is required.');
  const sceneIds = new Set<string>();
  let expectedStart = 0;
  let expectedStartFrame = 0;
  for (const scene of scenes) {
    const label = `Scene ${scene.id}`;
    if (!scene.id?.trim() || sceneIds.has(scene.id)) error(`${label}: scene ids must be nonempty and unique.`);
    sceneIds.add(scene.id);
    positive(scene.duration, `${label} duration`);
    if (!finite(scene.start) || scene.start < 0) error(`${label}: start must be a nonnegative number.`);
    if (Math.abs(scene.start - expectedStart) > epsilon || frame(scene.start) !== expectedStartFrame) error(`${label}: scenes must be contiguous; expected start ${expectedStart.toFixed(6)}s (${expectedStartFrame} frames).`);
    expectedStart = scene.start + scene.duration;
    // Match PilotEpisode: round absolute scene endpoints rather than summing rounded durations.
    expectedStartFrame = frame(scene.start + scene.duration);
    if (expectedStartFrame - frame(scene.start) < 1) error(`${label}: duration must cover at least one rendered frame.`);
    if (!['flattened', 'layered'].includes(scene.mode)) error(`${label}: mode must be flattened or layered.`);
    if (scene.mode === 'flattened') {
      if (scene.layers?.length || scene.character) error(`${label}: flattened artwork cannot have independent character or parallax layers.`);
      if (scene.image === undefined && options.production) error(`${label}: flattened scene image is missing.`);
    } else if (scene.mode === 'layered') {
      if (scene.image === undefined && !(scene.layers ?? []).some((item) => item.plane !== 'foreground') && options.production) error(`${label}: layered scene needs a background image or background image layers; foreground alone cannot supply a backdrop.`);
    }
    if (scene.image === undefined && !(scene.layers ?? []).some((item) => item.plane !== 'foreground') && !options.production && !scene.development?.src) error(`${label}: development fallback must be explicitly provided.`);
    if (!scene.camera?.length) error(`${label}: at least one camera keyframe is required.`);
    keyframes(scene.camera, `${label} camera`, scene.duration);
    position(scene.captionPosition, label);
    if (scene.insert && (!finite(scene.insert.duration) || scene.insert.duration <= 0 || scene.insert.duration > scene.duration)) error(`${label}: insert duration must be positive and within the scene.`);
    if (scene.transition && (!finite(scene.transition.duration) || scene.transition.duration < 0 || scene.transition.duration > scene.duration)) error(`${label}: transition duration must be within the scene.`);
    for (const item of scene.layers ?? []) layer(item, `${label} layer ${item.id}`, scene.duration);
    if (scene.particles && (!Number.isInteger(scene.particles.count) || scene.particles.count < 0 || scene.particles.count > 150 || !finite(scene.particles.seed) || !finite(scene.particles.opacity) || scene.particles.opacity < 0 || scene.particles.opacity > 1)) error(`${label}: particle count must be 0–150 and opacity 0–1, with a finite seed.`);
    const rig = scene.character;
    if (rig) {
      for (const part of rig.parts ?? []) {
        layer(part, `${label} character ${part.id}`, scene.duration);
        if (part.role === 'head' && (part.keyframes?.length || part.motion) && (rig.eyes || Object.keys(rig.expressions ?? {}).length || Object.keys(rig.mouths ?? {}).length)) error(`${label}: head parts with replacement facial sprites must use rig.headKeyframes instead of local part keyframes or motion to keep feature registration.`);
        if (part.motion && (!finite(part.motion.amplitude) || part.motion.amplitude < 0 || part.motion.amplitude > 8 || !finite(part.motion.period) || part.motion.period <= 0)) error(`${label}: character motion requires a positive period and subtle amplitude from 0 to 8.`);
      }
      keyframes(rig.headKeyframes, `${label} head`, scene.duration);
      let lastExpression = -Infinity;
      for (const cue of rig.expressionCues ?? []) {
        if (!finite(cue.time) || cue.time < 0 || cue.time > scene.duration || cue.time < lastExpression) error(`${label}: expression cues must be chronological and within the scene.`);
        lastExpression = cue.time;
        if (!rig.expressions?.[cue.expression]) error(`${label}: expression cue "${cue.expression}" has no replacement sprite.`);
      }
      let lastMouth = -Infinity;
      for (const cue of rig.mouthCues ?? []) {
        if (!finite(cue.time) || cue.time < 0 || cue.time > scene.duration || cue.time < lastMouth) error(`${label}: mouth cues must be chronological and within the scene.`);
        lastMouth = cue.time;
        if (!rig.mouths?.[cue.shape]) error(`${label}: mouth cue "${cue.shape}" has no replacement sprite.`);
      }
      if (rig.eyes) {
        if (!rig.eyes.open || !rig.eyes.half || !rig.eyes.closed) error(`${label}: blinking requires open, half and closed eye sprites.`);
        const blinkDuration = rig.eyes.duration ?? 0.16;
        if (!finite(blinkDuration) || blinkDuration <= 0 || blinkDuration > 0.5) error(`${label}: blink duration must be positive and at most 0.5 seconds.`);
        let lastBlinkEnd = -Infinity;
        for (const time of rig.eyes.blinkTimes ?? []) {
          if (!finite(time) || time < 0 || time + blinkDuration > scene.duration + epsilon || time < lastBlinkEnd) error(`${label}: blink intervals must not overlap and must fit inside the scene.`);
          lastBlinkEnd = time + blinkDuration;
        }
      }
    }
  }
  if (scenes.length && (Math.abs(expectedStart - episode.duration) > epsilon || expectedStartFrame !== frame(episode.duration))) error('Scene sequence must exactly cover the composition duration without blank frames.');

  let captionEnd = -Infinity;
  const captionIds = new Set<string>();
  for (const caption of episode.captions ?? []) {
    const label = `Caption ${caption.id}`;
    if (!caption.id?.trim() || captionIds.has(caption.id)) error(`${label}: caption ids must be nonempty and unique.`);
    captionIds.add(caption.id);
    if (!finite(caption.start) || !finite(caption.end) || caption.start < 0 || caption.end <= caption.start || caption.end > episode.duration + epsilon) error(`${label}: time range must be positive and inside the episode.`);
    if (caption.start < captionEnd - 1e-7) error(`${label}: captions must be chronological and cannot overlap.`);
    captionEnd = caption.end;
    if (!caption.text?.trim()) error(`${label}: text is required.`);
    if ((caption.text ?? '').split('\n').length > 2) error(`${label}: at most two explicit caption lines are allowed.`);
    position(caption.position, label);
    let wordEnd = caption.start;
    for (const word of caption.words ?? []) {
      if (!word.word?.trim() || !finite(word.start) || !finite(word.end) || word.end <= word.start || word.start < caption.start - epsilon || word.end > caption.end + epsilon || word.start < wordEnd - epsilon) error(`${label}: word timestamps must be ordered and inside the caption.`);
      if (word.confidence !== undefined && (!finite(word.confidence) || word.confidence < 0 || word.confidence > 1)) error(`${label}: word confidence must be between 0 and 1.`);
      wordEnd = word.end;
    }
  }

  const audio = (track: AudioTrack | undefined, label: string) => {
    if (!track) return;
    const start = track.start ?? 0;
    if (!finite(start) || start < 0 || !finite(track.duration) || track.duration <= 0 || start + track.duration > episode.duration + epsilon) error(`${label}: audio must fit inside the composition; extending the episode avoids narration truncation.`);
    if (!finite(track.volume) || track.volume < 0) error(`${label}: volume must be finite and nonnegative.`);
    if (track.volume > 1) warnings.push(`${label} volume exceeds source level; review output peaks for clipping.`);
    if (![track.fadeIn, track.fadeOut].every(finite) || track.fadeIn < 0 || track.fadeOut < 0 || track.fadeIn + track.fadeOut > track.duration) error(`${label}: fade durations must be nonnegative and fit inside the track.`);
  };
  if (!options.silent) {audio(episode.voiceover, 'Voiceover'); audio(episode.music, 'Music');}
  else if (episode.voiceover || episode.music) warnings.push('Silent preview explicitly omits configured voiceover and music.');

  for (const src of collectAssetPaths(episode, {silent: options.silent, development: !options.production})) {
    if (!safeAssetPath(src)) {error(`Invalid asset path ${JSON.stringify(src)}: use a nonempty relative path within public/.`); continue;}
    if (options.production && src.split('/').includes('development')) {error(`Production render cannot consume development placeholder ${src}.`); continue;}
    const absolutePath = path.resolve(options.publicDir, src);
    if (!existsSync(absolutePath) || !statSync(absolutePath).isFile()) error(`Missing asset: public/${src}`);
  }
  return {errors, warnings};
};
