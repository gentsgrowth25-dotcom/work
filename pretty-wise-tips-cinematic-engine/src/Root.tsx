import React from 'react';
import {Composition} from 'remotion';
import {PilotEpisode} from './compositions/PilotEpisode';
import {pilot} from './data/episodes/pilot';
import type {CompositionProps} from './types';

export const RemotionRoot: React.FC = () => <>
  {['PrettyWisePilot', 'PrettyWiseSilent'].map((id) => <Composition
    key={id} id={id} component={PilotEpisode}
    width={pilot.width} height={pilot.height} fps={pilot.fps}
    durationInFrames={Math.round(pilot.duration * pilot.fps)}
    defaultProps={{episode: pilot, silent: id === 'PrettyWiseSilent', development: true}}
    calculateMetadata={({props}: {props: CompositionProps}) => ({
      width: props.episode.width, height: props.episode.height, fps: props.episode.fps,
      durationInFrames: Math.round(props.episode.duration * props.episode.fps),
    })}
  />)}
</>;
