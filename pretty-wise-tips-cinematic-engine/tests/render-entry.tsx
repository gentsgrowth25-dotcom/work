/** Browser-only test harness. All synthetic fixture artwork is explicitly test data. */
import React, {useLayoutEffect} from 'react';
import {Composition, continueRender, delayRender, registerRoot, useCurrentFrame} from 'remotion';
import {PilotEpisode} from '../src/compositions/PilotEpisode';
import {pilot} from '../src/data/episodes/pilot';
import type {CompositionProps} from '../src/types';

const Probe: React.FC<CompositionProps> = (props) => {
  const frame = useCurrentFrame();
  useLayoutEffect(() => {
    const handle = delayRender(`Caption test measurement at frame ${frame}`);
    let cancelled = false;
    void document.fonts.ready.then(() => {
      if (!cancelled) {
        const measurements = Array.from(document.querySelectorAll<HTMLElement>('[data-caption]')).map((caption) => {
          const text = caption.querySelector<HTMLElement>('[data-caption-text]') ?? caption.firstElementChild as HTMLElement;
          const lines = new Set(Array.from(text.querySelectorAll('span')).map((span) => Math.round(span.getBoundingClientRect().top)));
          return {id: caption.dataset.caption, scrollHeight: text.scrollHeight, clientHeight: text.clientHeight, lineCount: lines.size, fontLoaded: document.fonts.check("700 64px 'Pretty Serif'")};
        });
        console.log('PWT_CAPTION_PROBE:' + JSON.stringify({frame, measurements}));
      }
      continueRender(handle);
    });
    return () => {cancelled = true; continueRender(handle);};
  }, [frame]);
  return <PilotEpisode {...props}/>;
};

registerRoot(() => <Composition id="RenderSmoke" component={Probe} width={1080} height={1920} fps={30} durationInFrames={720}
  defaultProps={{episode: pilot, silent: true, development: true}}
  calculateMetadata={({props}: {props: CompositionProps}) => ({width: props.episode.width, height: props.episode.height, fps: props.episode.fps, durationInFrames: Math.round(props.episode.duration * props.episode.fps)})}
/>);
