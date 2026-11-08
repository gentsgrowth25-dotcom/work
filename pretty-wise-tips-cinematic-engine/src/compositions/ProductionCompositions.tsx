import React, {useEffect, useState} from 'react';
import {cancelRender, continueRender, delayRender, staticFile} from 'remotion';
import type {CompositionProps} from '../types';
import {assertProductionEpisodeContract, forceProductionProps, productionPilot, vintageVisualTest} from '../data/episodes/production';
import {developmentArtworkHashes, originalVoiceover, requiredPilotAssets, type VisualTestReview} from '../data/required-assets';
import {PilotEpisode} from './PilotEpisode';

export type ProductionCompositionProps = CompositionProps & {artworkReview?: VisualTestReview};

/** Runs only on the selected mounted composition, never while Root registers compositions. */
const ArtworkGate: React.FC<{kind: 'final' | 'test'; review?: VisualTestReview; children: React.ReactNode}> = ({kind, review, children}) => {
  const [handle] = useState(() => delayRender('Verifying actual cinematic scene artwork'));
  useEffect(() => {
    let disposed = false;
    const verify = async () => {
      let effectiveReview = review;
      if (kind === 'final' && !effectiveReview) {
        const response = await fetch(staticFile('visual-test-review.json'));
        if (!response.ok) throw new Error('Final production requires the reviewed five-second test. Use npm run render after creating config/visual-test-review.json.');
        effectiveReview = await response.json() as VisualTestReview;
      }
      if (kind === 'final' && effectiveReview?.status !== 'passed') throw new Error('Final production requires the reviewed five-second test. Use npm run render after creating config/visual-test-review.json.');
      if (kind === 'final' && effectiveReview?.basis !== 'supplied-reference') throw new Error('Final production requires visual review against the supplied reference.');
      const required = kind === 'test' ? requiredPilotAssets.slice(0, 2) : requiredPilotAssets;
      const seen = new Set<string>();
      for (const [index, src] of required.entries()) {
        const response = await fetch(staticFile(src));
        if (!response.ok) throw new Error(`Missing required scene illustration: public/${src} (HTTP ${response.status}).`);
        const bytes = await response.arrayBuffer();
        const signature = new Uint8Array(bytes, 0, Math.min(8, bytes.byteLength));
        if (bytes.byteLength < 33 || signature.length !== 8 || signature.some((byte, at) => byte !== [137, 80, 78, 71, 13, 10, 26, 10][at])) throw new Error(`Invalid required PNG scene illustration: public/${src}.`);
        const view = new DataView(bytes);
        const width = view.getUint32(16), height = view.getUint32(20);
        if (!width || !height || Math.abs(width / height - 4 / 5) > 0.005) throw new Error(`Production artwork public/${src} must be native 4:5; got ${width} × ${height}.`);
        const digest = [...new Uint8Array(await crypto.subtle.digest('SHA-256', bytes))].map((byte) => byte.toString(16).padStart(2, '0')).join('');
        if ((developmentArtworkHashes as readonly string[]).includes(digest)) throw new Error(`Forbidden numbered development card in production artwork: public/${src}.`);
        if (seen.has(digest)) throw new Error(`Duplicate illustration in production artwork: public/${src}.`);
        seen.add(digest);
        if (kind === 'final' && index < 2 && digest !== effectiveReview?.artworkSha256?.[src]) throw new Error(`The first-scene artwork ${src} differs from the reviewed five-second test.`);
      }
      const response = await fetch(staticFile(originalVoiceover.src));
      if (!response.ok) throw new Error('The original supplied MP3 is required for production and the visual test.');
      const voice = await response.arrayBuffer();
      const digest = [...new Uint8Array(await crypto.subtle.digest('SHA-256', voice))].map((byte) => byte.toString(16).padStart(2, '0')).join('');
      if (digest !== originalVoiceover.sha256) throw new Error('The configured voiceover differs from the supplied original MP3.');
      if (!disposed) continueRender(handle);
    };
    void verify().catch((error) => {if (!disposed) cancelRender(error);});
    return () => {disposed = true; continueRender(handle);};
  }, [handle, kind, review]);
  return <>{children}</>;
};

/** Names used by the 4:5 production specification, backed by the reusable engine. */
export const FilmComposition4x5 = PilotEpisode;
export const AssetValidator = ArtworkGate;

export const CinematicPilotFinal: React.FC<ProductionCompositionProps> = (props) => {
  const strict = forceProductionProps({...props, episode: props.episode ?? productionPilot});
  assertProductionEpisodeContract(strict.episode, 'final');
  if (strict.silent) throw new Error('The final master requires its full original narration and cannot be silent.');
  return <AssetValidator kind="final" review={props.artworkReview}><FilmComposition4x5 {...strict}/></AssetValidator>;
};

export const VintageVisualTest: React.FC<CompositionProps> = (props) => {
  const strict = forceProductionProps({...props, episode: props.episode ?? vintageVisualTest});
  assertProductionEpisodeContract(strict.episode, 'test');
  return <AssetValidator kind="test"><FilmComposition4x5 {...strict}/></AssetValidator>;
};
