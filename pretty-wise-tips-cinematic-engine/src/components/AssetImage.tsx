import React from 'react';
import {Img, staticFile} from 'remotion';

export const assetSrc = (src: string) => /^(https?:|data:|blob:)/.test(src) ? src : staticFile(src.replace(/^\/+/, ''));

export const AssetImage: React.FC<{src: string; fit?: 'cover' | 'contain'}> = ({src, fit = 'cover'}) => (
  <Img src={assetSrc(src)} style={{width: '100%', height: '100%', objectFit: fit, display: 'block'}} />
);
