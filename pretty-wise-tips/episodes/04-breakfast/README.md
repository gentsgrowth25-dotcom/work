# Episode 04 — Your Healthy Breakfast Might Be Missing Something

## Narration-first delivery

The supplied ElevenLabs recording is **33.567313 seconds**, so this voiced edition follows the actual recording rather than cutting or speeding it to the draft brief's provisional 30 seconds. The exported timeline is **34 seconds / 1020 frames at 30 fps**, including about 0.433 seconds of final hold. The full original voiceover is used once, at 100% volume, with its natural speed and pitch. No voiceover, music or sound effects were generated.

Composition: `PrettyWiseTipsEpisode04` at 1080 × 1920. Output: `out/pretty-wise-tips-episode-04.mp4`.

From `pretty-wise-tips/`:

```sh
npm ci
npm run check
npm run dev:04
npm run render:04
```

Chromium is set to `/usr/bin/chromium`; change that path on another platform. The render script builds the visual track, then muxes the original MP3 directly with FFmpeg. This avoids a measured 42.7-ms delay in the initial Remotion audio mix; the final file is checked for audio lag at the beginning, middle and end.

## Editable audio timing

`public/episode04/voiceover.mp3` is the original supplied recording. `public/episode04/narrationTiming.json` is the source of scene boundaries, duration, and 27 phrase/ingredient cues. All scene components use those absolute frame cues. `src/episode04Data.ts` exposes the data separately from the animation.

Local PocketSphinx 5.1.1 forced alignment placed the 77 transcript words against a 16-kHz mono decoding of the recording. An independent recognition pass was used as a rough transcript check; FFmpeg silence detection also confirmed the major phrase pauses. These are **estimated phrase timings**, not a claim of manually verified word-perfect captions. No full transcript captions were burned in.

| Scene | Start | Cue examples |
| --- | ---: | --- |
| Breakfast hook | 0.00 s | Hungry 2.58 s; ten 3.16 s; third fix 4.34 s |
| Protein | 7.21 s | Protein 8.25 s; Greek yogurt 10.12 s; eggs 11.21 s |
| Fiber | 13.20 s | Fiber 14.22 s; oats 15.22 s; whole grains 15.68 s |
| Comment prompt | 17.99 s | BOWL 18.42 s; checklist 19.22–21.16 s |
| Combine | 21.53 s | Yogurt 23.75 s; oats 24.51 s; berries 24.97 s; nuts 25.66 s |
| Nutrients | 26.35 s | Protein 26.35 s; fiber 26.96 s; healthy fats 27.66 s |
| Conclusion | 29.83 s | Balance 31.54 s; restriction 32.69 s |

`word-alignment.json` preserves the local alignment output. `voiceover-script.txt` contains the reference narration normalized only to join the storyboard's split clauses. To repeat alignment with another recording, install `pocketsphinx==5.1.1` in a separate Python environment and run `python3 scripts/align-episode04.py`. If building from source, use an available C compiler (this environment required `CC=gcc CXX=g++`). Do not put that Python environment in Git. Rerun alignment, inspect the estimates, probe the new audio duration, and edit the timing JSON before rendering.

## Brand and assets

All backgrounds are pure white. The recovered original accent is **#CE89FE** from `episodeData.ts` and the saved style guide, with original deeper purple #A95BE8. `episode04Theme.ts` is the single source for graphic colors. No rose/cream backgrounds, blue UI, yellow UI, or gradients are used. Restrained natural colors are limited to skin, hair and food.

`MayaBreakfast.tsx` preserves the recurring brunette character rig with mauve clothing and an eating pose. `BreakfastFoods.tsx` contains reusable editable fruit, bowl, yogurt, egg, oat and toast SVGs. Ingredient reveals follow their narrated list; nutrient connectors follow their respective phrase cues. The completed meal smoothly reframes into the nutrition diagram.

## Checks and creator resource

Seven representative scene frames are inspected for layout and brand consistency. The complete video is decoded, metadata is checked for both video and audio, and the rendered audio is compared with the original to detect timing shifts. Older exports remain untouched.

`BOWL-breakfast-builder-checklist.md` is the promised resource. Deliver it to commenters manually or configure your own authorized workflow before posting the promise. No Instagram DMs have been sent or automated delivery installed.
