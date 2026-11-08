import React, {useEffect, useState} from 'react';
import {cancelRender, continueRender, delayRender, staticFile} from 'remotion';
import type {CompositionProps} from '../types';
import {assertProductionEpisodeContract, forceProductionProps, productionPilot, vintageVisualTest} from '../data/episodes/production';
import {developmentArtworkHashes, requiredPilotAssets, type VisualTestReview} from '../data/required-assets';
import {PilotEpisode} from './PilotEpisode';

export type ProductionCompositionProps = CompositionProps & {artworkReview?: VisualTestReview};

/** Runs only on the selected mounted composition, never while Root registers compositions. */
const ArtworkGate: React.FC<{kind: 'final' | 'test'; review?: VisualTestReview; children: React.ReactNode}> = ({kind, review, children}) => {
  const [handle] = useState(() => delayRender('Verifying actual cinematic scene artwork'));
  useEffect(() => {
    let disposed = false;
    const verify = async () => {
      if (kind === 'final' && review?.status !== 'passed') throw new Error('Final production requires the reviewed five-second test. Use npm run render after creating config/visual-test-review.json.');
      const required = kind === 'test' ? requiredPilotAssets.slice(0, 1) : requiredPilotAssets;
      const seen = new Set<string>();
      for (const [index, src] of required.entries()) {
        const response = await fetch(staticFile(src));
        if (!response.ok) throw new Error(`Missing required scene illustration: public/${src} (HTTP ${response.status}).`);
        const bytes = await response.arrayBuffer();
        const signature = new Uint8Array(bytes, 0, Math.min(8, bytes.byteLength));
        if (signature.length !== 8 || signature.some((byte, at) => byte !== [137, 80, 78, 71, 13, 10, 26, 10][at])) throw new Error(`Invalid required PNG scene illustration: public/${src}.`);
        const digest = [...new Uint8Array(await crypto.subtle.digest('SHA-256', bytes))].map((byte) => byte.toString(16).padStart(2, '0')).join('');
        if ((developmentArtworkHashes as readonly string[]).includes(digest)) throw new Error(`Forbidden numbered development card in production artwork: public/${src}.`);
        if (seen.has(digest)) throw new Error(`Duplicate illustration in production artwork: public/${src}.`);
        seen.add(digest);
        if (kind === 'final' && index === 0 && digest !== review?.sceneSha256) throw new Error('The first-scene artwork differs from the reviewed five-second test.');
      }
      if (!disposed) continueRender(handle);
    };
    void verify().catch((error) => {if (!disposed) cancelRender(error);});
    return () => {disposed = true; continueRender(handle);};
  }, [handle, kind, review]);
  return <>{children}</>;
};

export const CinematicPilotFinal: React.FC<ProductionCompositionProps> = (props) => {
  const strict = forceProductionProps({...props, episode: props.episode ?? productionPilot});
  assertProductionEpisodeContract(strict.episode, 'final');
  return <ArtworkGate kind="final" review={props.artworkReview}><PilotEpisode {...strict}/></ArtworkGate>;
};

export const VintageVisualTest: React.FC<CompositionProps> = (props) => {
  const strict = forceProductionProps({...props, episode: props.episode ?? vintageVisualTest});
  assertProductionEpisodeContract(strict.episode, 'test');
  return <ArtworkGate kind="test"><PilotEpisode {...strict}/></ArtworkGate>;
};
