import type {CompositionProps, Episode, Scene} from '../../types';
import {cinematicMaster, isDevelopmentArtworkPath, originalVoiceover, requiredPilotAssets} from '../required-assets';
import {pilot} from './pilot';

/** The historical storyboard is available only through the explicit development composition. */
export const developmentPilot = pilot;

const shotFrames = [0, 42, 137, 172, 228, 256, 323, 359, 404, 473, 533, 570, 617, 690, 716];
const shotTitles = [
  'Pearls detail', 'Dressing-room mirror', 'Kitchen', 'Teacup detail',
  'City street', 'Boutique glance', 'Jewelry detail', 'Jewel boutique',
  'Signing detail', 'Executive office', 'Balcony wide', 'Balcony profile',
  'Hero portrait', 'Final portrait',
];

const makeShot = (index: number, startFrame: number, endFrame: number): Scene => {
  const group = Math.floor(index / 2);
  const duration = (endFrame - startFrame) / cinematicMaster.fps;
  return {
    id: `${String(group + 1).padStart(2, '0')}${index % 2 ? 'B' : 'A'}`,
    groupId: String(group + 1).padStart(2, '0'),
    title: shotTitles[index], start: startFrame / cinematicMaster.fps, duration,
    mode: index === 3 ? 'layered' : 'flattened', image: requiredPilotAssets[index],
    layers: index === 3 ? [{
      id: 'illustrated-tea-steam', src: 'props/4x5/tea-steam.png', plane: 'foreground', depth: 0,
      fit: 'contain', keyframes: [
        {time: 0, y: -20, opacity: 0},
        {time: Math.min(0.3, duration / 3), y: -24, opacity: 0.6, ease: 'ease-out'},
        {time: duration - 0.15, y: -34, opacity: 0.35, ease: 'ease-in-out'},
        {time: duration, y: -37, opacity: 0},
      ],
    }] : undefined,
    // Character drawings are held. Only the separate illustrated steam moves independently.
    camera: [
      {time: 0, x: 0, y: 0, scale: index % 2 ? 1.045 : 1.015},
      {time: duration, x: index % 2 ? -5 : 5, y: -4, scale: index % 2 ? 1.015 : 1.045, ease: 'ease-in-out'},
    ],
    transition: index === 8 || index === 12 ? {type: 'dissolve', duration: 8 / cinematicMaster.fps} : {type: 'cut', duration: 0},
    // The detail shot has hands near the pearls and waist; use its clear middle band.
    captionPosition: {top: index === 0 ? 650 : index === 7 || index === 8 ? 990 : 930, left: 80, width: 920},
    lighting: {brightness: 1, saturation: 1}, development: pilot.scenes[group].development,
  };
};

/** The source narration determines this native 4:5 pilot's duration and shot boundaries. */
export const productionPilot: Episode = {
  ...pilot, id: 'not-waiting-to-be-chosen-4x5', width: cinematicMaster.width,
  height: cinematicMaster.height, fps: cinematicMaster.fps, duration: cinematicMaster.duration,
  artworkStatus: 'production',
  scenes: requiredPilotAssets.map((_, index) => makeShot(index, shotFrames[index], shotFrames[index + 1])),
  captions: pilot.captions.map((caption) => ({
    ...caption, start: caption.final ? 22.98 : caption.start,
    end: caption.final ? cinematicMaster.duration : Math.min(caption.end, 22.98),
  })),
  voiceover: {src: originalVoiceover.src, duration: originalVoiceover.duration, start: 0, volume: 1, fadeIn: 0, fadeOut: 0},
  music: undefined,
};

export const vintageVisualTest: Episode = {
  ...productionPilot, id: 'vintage-visual-test-4x5',
  title: 'Pretty Wise Tips — five-second 4:5 vintage visual test', duration: 5,
  scenes: [makeShot(0, 0, 38), makeShot(1, 38, 150)].map((scene) => ({...scene, transition: {type: 'cut', duration: 0}})),
  captions: productionPilot.captions.filter((caption) => caption.start < 4.4).map((caption) => ({...caption, end: Math.min(caption.end, 4.4)})),
  // The first sentence ends at 3.86s; stop before sentence two starts at 4.64s.
  voiceover: {...productionPilot.voiceover!, duration: 4.4}, music: undefined,
};

/** Fixed production wrappers ignore an incoming development:true prop. */
export const forceProductionProps = (props: CompositionProps): CompositionProps => ({...props, development: false});

/** Browser-safe pilot policy; generic reusable renderers do not hardcode the pilot manifest. */
export const assertProductionEpisodeContract = (episode: Episode, kind: 'final' | 'test') => {
  const required = kind === 'test' ? requiredPilotAssets.slice(0, 2) : requiredPilotAssets;
  if (episode.width !== cinematicMaster.width || episode.height !== cinematicMaster.height || episode.fps !== cinematicMaster.fps || episode.duration !== (kind === 'test' ? 5 : cinematicMaster.duration)) throw new Error(`The ${kind} composition has fixed 1080 × 1350, 30 FPS timing.`);
  if (episode.artworkStatus !== 'production') throw new Error('Production compositions cannot render a development episode.');
  if (episode.scenes.length !== required.length) throw new Error(`The ${kind} composition requires ${required.length} completed illustrated shots.`);
  required.forEach((src, index) => {
    if (episode.scenes[index]?.image !== src || isDevelopmentArtworkPath(episode.scenes[index]?.image ?? '')) throw new Error(`Required production artwork: public/${src}. Development cards are not allowed.`);
  });
  const voice = episode.voiceover;
  if (!voice || voice.src !== originalVoiceover.src || voice.duration !== (kind === 'test' ? 4.4 : originalVoiceover.duration) || (voice.start ?? 0) !== 0 || voice.volume !== 1 || voice.fadeIn !== 0 || voice.fadeOut !== 0 || episode.music) throw new Error('The cinematic pilot requires its original narration at source volume and speed, without fades or music.');
};
