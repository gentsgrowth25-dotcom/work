import type {CompositionProps, Episode} from '../../types';
import {isDevelopmentArtworkPath, requiredPilotAssets} from '../required-assets';
import {pilot} from './pilot';

export const developmentPilot = pilot;

/** Production intent is separate from the legacy storyboard; missing files still fail preflight. */
export const productionPilot: Episode = {
  ...pilot,
  artworkStatus: 'production',
  scenes: pilot.scenes.map((scene, index) => ({...scene, image: requiredPilotAssets[index]})),
};

const firstScene = productionPilot.scenes[0];
export const vintageVisualTest: Episode = {
  ...productionPilot,
  id: 'vintage-visual-test',
  title: 'Pretty Wise Tips — five-second vintage visual test',
  duration: 5,
  scenes: [{...firstScene, start: 0, duration: 5,
    camera: firstScene.camera.map((key) => ({...key, time: key.time / firstScene.duration * 5})),
  }],
  captions: productionPilot.captions.filter((caption) => caption.start < 4.4).map((caption) => ({...caption, end: Math.min(caption.end, 4.4)})),
  // The first sentence ends at 3.86s; stop before the second sentence starts at 4.64s.
  voiceover: productionPilot.voiceover ? {...productionPilot.voiceover, duration: 4.4, fadeOut: 0.1} : undefined,
  music: undefined,
};

/** Fixed production wrappers ignore an incoming development:true prop. */
export const forceProductionProps = (props: CompositionProps): CompositionProps => ({...props, development: false});

/** Browser-safe pilot policy, separate from the generic reusable scene renderer. */
export const assertProductionEpisodeContract = (episode: Episode, kind: 'final' | 'test') => {
  const required = kind === 'test' ? requiredPilotAssets.slice(0, 1) : requiredPilotAssets;
  if (episode.width !== 1080 || episode.height !== 1920 || episode.fps !== 30 || episode.duration !== (kind === 'test' ? 5 : 24)) throw new Error(`The ${kind} composition has fixed 1080 × 1920, 30 FPS timing.`);
  if (episode.artworkStatus !== 'production') throw new Error('Production compositions cannot render a development episode.');
  if (episode.scenes.length !== required.length) throw new Error(`The ${kind} composition requires ${required.length} completed illustrated scene${required.length === 1 ? '' : 's'}.`);
  required.forEach((src, index) => {
    if (episode.scenes[index]?.image !== src || isDevelopmentArtworkPath(episode.scenes[index]?.image ?? '')) throw new Error(`Required production artwork: public/${src}. Development cards are not allowed.`);
  });
};
