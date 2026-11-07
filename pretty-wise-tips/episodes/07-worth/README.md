# Episode 07 — 3 Signs You're Becoming a Woman Who Knows Her Worth

This updated episode replaces the hook and adds full animated captions, using the current approved business-suit reference from Episode 06. Earlier exports remain untouched.

## Two delivery versions

- `pretty-wise-tips-episode-07.mp4`: **33 seconds / 990 frames**, with the full original **32.287313-second** ElevenLabs recording at natural speed and pitch. Caption timings follow this recording.
- `pretty-wise-tips-episode-07-silent-30s-v1.mp4`: the requested **30-second / 900-frame silent timing preview**. It compresses the visual timeline to meet the draft duration. Its captions are NOT synchronized to playing the longer recording at natural pace.

No voiceover, music or effects were generated. Both are 1080 × 1920, 30 fps, H.264.

From `pretty-wise-tips/`:

```sh
npm ci
npm run check
npm run dev:07
npm run render:07
```

Compositions: `PrettyWiseTipsEpisode07` is the editable 900-frame silent preview; `PrettyWiseTipsEpisode07Voiced` is the natural-audio 990-frame version. The preview maps its frame clock to the master timing data. The render script renders the master visuals and muxes the original narration directly with FFmpeg (to avoid the audio mix delay found in Episode 04); FFmpeg also creates the 900-frame silent preview. Browser path is `/usr/bin/chromium`, adjustable in the script.

## Animated captions

`src/AnimatedCaption.tsx` is reusable. It accepts the absolute frame and caption data. `public/episode07/captions.json` includes every spoken word in 21 semantic chunks, with individually editable start/end frames and one word-highlight onset per chunk. Most contain 3–5 words; a few short emphasis phrases and one coherent six-word phrase are deliberate exceptions.

Placement is horizontally centered at y=1070, approximately 56% down the frame, with a reserved zone through about y=1256. Captions use bold 65–72px sans-serif, at most two explicit lines, dark charcoal, one lavender word highlighted at its estimated spoken onset, a white panel and subtle shadow. Entry is a small upward/scale movement, without large bouncing. Only the first matching token is highlighted if a chunk repeats a word (the opening repeats “three”).

Character faces and hand gestures sit above the caption zone; the important guilt/wrongdoing comparison sits below it. Captions may pass over noncritical lower clothing but do not obscure faces, hands, speech transformations or the comparison.

`captions.srt` preserves phrase subtitles on the actual-audio timeline. It does not encode the animated single-word highlight. `word-alignment.json` and `voiceover-script.txt` retain the exact reference narration and local alignment evidence.

## Timing and visual explanations

`public/episode07/narrationTiming.json` separates scene and action cues from caption cues. The local PocketSphinx forced alignment is an estimate checked against phrase pauses and a rough recognition pass; this is not a claim of manual word-perfect verification. Replacing the recording requires reprobing duration, reviewing alignment, and editing both timing data files. `scripts/align-episode07.py` repeats the optional alignment with `pocketsphinx==5.1.1` installed separately.

| Scene | Master start | Demonstration |
| --- | ---: | --- |
| Revised hook | 0.00s | Step into frame, explicit topic, three lesson previews, third becomes a question mark |
| Praise | 7.03s | “It was nothing” is struck out and replaced by “Thank you!” |
| Confidence | 12.64s | Unnecessary apology disappears; a respectful direct question replaces it |
| Comment WORTH | 19.08s | Keyword typing and the five-day challenge; no fake DM confirmation |
| Fair boundary | 22.88s | Existing commitment, nonurgent request, polite decline, disappointment, separated guilt/wrongdoing labels |
| Self-respect | 30.56s | Original crossed-arms pose, animated underline and synchronized final caption |

The recording's spoken hook is longer than the draft's five-second placeholder. Visual motion and the topic headline start on frame one; lesson symbols preview the practical tips before the first narrated sign.

## Brand, character and resource

The white background and #CB85ED current-reference lavender are reused. No new face or character design was generated for this episode. `RoutineCharacter.tsx` and the existing walk rig retain the supplied business suit, long dark hair, medium-brown complexion and reference jewelry. The actual reference picture takes precedence over conflicting straight-hair/pearl-earring prose, as recorded in the style guide.

`WORTH-five-day-confidence-challenge.md` and `.csv` contain the promised free resource. The Markdown includes an immediately usable pinned comment/manual reply. The creator must deliver it manually or configure an authorized workflow; no social messages or fake delivery confirmations were created.

TypeScript, full video decoding, exact video metadata, caption transcript/highlight/layout checks, opening motion and original-versus-export audio timing are checked before GitHub delivery. Independent contributors prepared timing/captions and reviewed caption fitting while the scene implementation remained separate.
