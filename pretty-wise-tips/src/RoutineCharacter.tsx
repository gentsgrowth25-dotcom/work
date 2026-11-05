import React,{useId} from 'react';
import {staticFile,useCurrentFrame} from 'remotion';
// The new supplied character is preserved as reference-conditioned artwork.
// Separate clipped layers move the head/upper body while the heels stay anchored.
export function RoutineCharacter({height=1100,pose='confident',portrait=false,mobility=false,gesture=false}:{height?:number,pose?:'confident'|'concerned'|'presenting',portrait?:boolean,mobility?:boolean,gesture?:boolean}){
 const f=useCurrentFrame();const id=useId().replace(/:/g,'');const original=pose==='confident';
 const cfg=original?{x:260,w:560,h:1402,head:245,legs:690,neckX:540,neckY:228,waistX:540,waistY:510,iw:1122,ih:1402}:pose==='concerned'?{x:215,w:420,h:1024,head:183,legs:510,neckX:430,neckY:170,waistX:450,waistY:365,iw:1536,ih:1024}:{x:790,w:565,h:1024,head:183,legs:510,neckX:1010,neckY:170,waistX:1030,waistY:365,iw:1536,ih:1024};
 const visibleH=portrait?(original?900:680):cfg.h;const width=height*cfg.w/visibleH;
 const roll=mobility?Math.sin(f/16)*2.7:gesture?Math.sin(f/32)*.9:Math.sin(f/47)*.35;
 const head=pose==='concerned'?Math.sin(f/27)*1.3:Math.sin(f/39)*.65;
 const image=staticFile(`episode06/character/${original?'confident.png':'poses.png'}`);
 const artwork=<image href={image} x="0" y="0" width={cfg.iw} height={cfg.ih} filter={`url(#${id}-alpha)`}/>;
 return <svg width={width} height={height} viewBox={`${cfg.x} 0 ${cfg.w} ${visibleH}`} style={{overflow:'hidden'}}>
 <defs><filter id={`${id}-alpha`} x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB"><feComponentTransfer><feFuncA type="linear" slope="10" intercept="-8"/></feComponentTransfer></filter>
 <clipPath id={`${id}-head`}><rect x={cfg.x-100} y="0" width={cfg.w+200} height={cfg.head+8}/></clipPath>
 <clipPath id={`${id}-torso`}><rect x={cfg.x-100} y={cfg.head-8} width={cfg.w+200} height={portrait?cfg.h-cfg.head+30:cfg.legs-cfg.head+20}/></clipPath>
 <clipPath id={`${id}-legs`}><rect x={cfg.x-100} y={cfg.legs-8} width={cfg.w+200} height={cfg.h-cfg.legs+30}/></clipPath></defs>
 {!portrait&&<g clipPath={`url(#${id}-legs)`}>{artwork}</g>}
 <g transform={`rotate(${roll} ${cfg.waistX} ${cfg.waistY}) translate(0 ${Math.sin(f/29)*1.2})`}>
 <g clipPath={`url(#${id}-torso)`}>{artwork}</g>
 <g transform={`rotate(${head} ${cfg.neckX} ${cfg.neckY})`} clipPath={`url(#${id}-head)`}>{artwork}</g>
 </g></svg>;
}
