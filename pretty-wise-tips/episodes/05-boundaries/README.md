# Why You Feel Guilty Saying No — Boundaries edition

The pasted brief labels this Episode 05. Because an unrelated gym Episode 05 already exists, this video uses a separate **boundaries-v1** filename and composition. Existing exports are preserved.

## Delivery

Exactly **30 seconds / 900 frames / 30 fps / 1080 × 1920**. The original supplied ElevenLabs narration is 28.604063 seconds and plays at its natural pace; the remaining time holds the closing message. No new narration, music or effects were generated. Both voiced and silent versions are provided.

Composition: `PrettyWiseTipsBoundaries`.

```sh
# From pretty-wise-tips/
npm ci
npm run check
npm run dev:boundaries
npm run render:boundaries
```

Chromium is set to `/usr/bin/chromium`; adjust in `scripts/render-boundaries.mjs` on another platform. Outputs are `out/pretty-wise-tips-boundaries-v1.mp4` and `out/pretty-wise-tips-boundaries-v1-silent-v1.mp4`. The script renders visuals, then directly muxes the original audio using FFmpeg to avoid the audio-mix delay diagnosed in Episode 04.

## Narration and scene order

The user supplied the exact ElevenLabs transcript after the brief. It explains the guilt before listing the people-pleasing situations and puts the spoken CTA at the end. The animation follows that order so the illustrations support the spoken meaning. A brief visual CTA remains in the middle, as requested, and is echoed when actually spoken at the end.

| Scene | Start | Illustration |
| --- | ---: | --- |
| Hesitation | 0.00 s | Couch, exhausted character, request, NO deleted to YES, worried push-in |
| Guilt explanation | 3.07 s | Three fears and a tightening expectations ring |
| People-pleasing cycle | 7.47 s | Plans, extra work, another favor; YES bubbles crowd the frame |
| Midpoint resource | 14.52 s | BOUNDARIES prompt, three message-card previews without revealing all replies |
| Boundary solution | 16.94 s | Original phone situation; “I can’t this time” begins with the phrase at 21.28 s; send and release |
| Kindness and no | 24.89 s | Forward walking character, YES bubbles disappear, closing message, spoken CTA echoed |

`public/boundaries-v1/narrationTiming.json` stores editable scene boundaries and cue frames. `word-alignment.json` preserves local PocketSphinx forced-alignment estimates against the exact user-supplied script. Timings are phrase estimates, not a claim of manually verified word-perfect captions. No transcript subtitles were burned in. `scripts/align-boundaries.py` repeats the optional local alignment with pocketsphinx 5.1.1 installed.

## Existing character and animation system

The current lavender business-suit reference introduced in Episode 06 is reused. New reference-conditioned seated and walk-pose sheets extend that asset set, not a replacement character. `BoundariesCharacter.tsx` animates clipped layers, head movement and a restrained leg-driven gait; `RoutineCharacter.tsx` supplies the existing standing/concerned/presenting rig. Artwork assets are PNG references rendered through SVG, while couch, phone, other actors, expectations ring and interfaces are editable vector/CSS graphics.

Backgrounds stay pure white. Lavender uses the current #CB85ED reference treatment. Only skin/hair and neutral outlines introduce natural colors; no unrelated UI accents are added.

## Promised resource

`BOUNDARIES-three-polite-replies.md` includes the three replies and a ready-to-post pinned comment or manual reply. The creator can actually deliver this resource through a reply, pinned comment or their own authorized DM workflow. No fake DM confirmation, automatic delivery or external social posting is included.

## Verification

TypeScript, representative rendered frames, full video decoding, exact duration/frame count, silent-track audio absence, and original-versus-export audio timing are checked before upload. The source contains the full recording and editable timing map. All previous episodes remain available.
