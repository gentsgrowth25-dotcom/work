import React from 'react';
import {Composition} from 'remotion';
import {DevelopmentPreview} from './compositions/DevelopmentPreview';
import {CinematicPilotFinal, VintageVisualTest} from './compositions/ProductionCompositions';
import {developmentPilot, productionPilot, vintageVisualTest} from './data/episodes/production';
import type {CompositionProps} from './types';

export const RemotionRoot: React.FC = () => <>
  <Composition id="CINEMATIC_PILOT_FINAL" component={CinematicPilotFinal} width={1080} height={1920} fps={30} durationInFrames={720}
    defaultProps={{episode: productionPilot, silent: false, development: false}}/>
  <Composition id="VINTAGE_VISUAL_TEST" component={VintageVisualTest} width={1080} height={1920} fps={30} durationInFrames={150}
    defaultProps={{episode: vintageVisualTest, silent: false, development: false}}/>
  <Composition id="DEVELOPMENT_PREVIEW" component={DevelopmentPreview} width={1080} height={1920} fps={30} durationInFrames={720}
    defaultProps={{episode: developmentPilot, silent: true, development: true}}
    calculateMetadata={({props}: {props: CompositionProps}) => ({
      width: props.episode.width, height: props.episode.height, fps: props.episode.fps,
      durationInFrames: Math.round(props.episode.duration * props.episode.fps),
    })}
  />
</>;
