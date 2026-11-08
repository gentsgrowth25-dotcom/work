import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import type {CharacterPart, CharacterRig} from '../types';
import {motionTransform, sampleMotion} from '../utils/motion';
import {AssetImage} from './AssetImage';
import {ExpressionAnimator} from './ExpressionAnimator';

const Part: React.FC<{part: CharacterPart; time: number}> = ({part, time}) => {
  const motion = sampleMotion(part.keyframes, time);
  if (part.motion) {
    const wave = Math.sin((time / Math.max(0.1, part.motion.period)) * Math.PI * 2);
    if (part.motion.type === 'breathing') motion.y += wave * Math.min(8, Math.abs(part.motion.amplitude));
    else motion.rotation += wave * Math.min(1.5, Math.abs(part.motion.amplitude));
  }
  return <AbsoluteFill style={{transform: motionTransform(motion), opacity: motion.opacity, transformOrigin: part.pivot ? `${part.pivot[0]}px ${part.pivot[1]}px` : '50% 50%'}}><AssetImage src={part.src} fit={part.fit ?? 'contain'} /></AbsoluteFill>;
};

export const CharacterAnimator: React.FC<{rig: CharacterRig}> = ({rig}) => {
  const time = useCurrentFrame() / useVideoConfig().fps;
  const head = sampleMotion(rig.headKeyframes, time);
  const headStyle: React.CSSProperties = {transform: motionTransform(head), opacity: head.opacity, transformOrigin: rig.headPivot ? `${rig.headPivot[0]}px ${rig.headPivot[1]}px` : '50% 35%'};
  return <AbsoluteFill>
    {rig.parts.map((part) => part.role === 'head' || part.role === 'hair' ? <AbsoluteFill key={part.id} style={headStyle}><Part part={part} time={time} /></AbsoluteFill> : <Part key={part.id} part={part} time={time} />)}
    <AbsoluteFill style={headStyle}><ExpressionAnimator rig={rig} /></AbsoluteFill>
  </AbsoluteFill>;
};
