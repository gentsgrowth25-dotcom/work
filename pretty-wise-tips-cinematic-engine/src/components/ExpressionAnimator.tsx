import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import type {CharacterRig} from '../types';
import {blinkSprite, currentExpression, currentMouth} from '../utils/timing';
import {AssetImage} from './AssetImage';

/** Registered transparent replacement cels. These must overlay a clean featureless face plate. */
export const ExpressionAnimator: React.FC<{rig: CharacterRig}> = ({rig}) => {
  const time = useCurrentFrame() / useVideoConfig().fps;
  const expression = rig.expressions?.[currentExpression(rig, time)];
  const eye = rig.eyes ? rig.eyes[blinkSprite(time, rig.eyes.blinkTimes, rig.eyes.duration)] : undefined;
  const shape = currentMouth(rig, time);
  const mouth = shape ? rig.mouths?.[shape] : undefined;
  return <AbsoluteFill>{[expression, eye, mouth].map((src, index) => src ? <AbsoluteFill key={`${index}-${src}`}><AssetImage src={src} fit="contain" /></AbsoluteFill> : null)}</AbsoluteFill>;
};
