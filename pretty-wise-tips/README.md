# Pretty Wise Tips — Episode 01

Editable vector animation: 1080 × 1920, 30 fps. Composition: `PrettyWiseTipsEpisode`.

## Run

Use Node 24 and npm. From this directory:

```sh
npm ci
npm run check
npm run dev
npm run render
```

Rendering uses `/usr/bin/chromium` and FFmpeg/ffprobe. Adjust the browser path in `scripts/render.mjs` on another operating system. In a restricted execution sandbox, Chromium may require an authorized unsandboxed process.

Output: `out/pretty-wise-tips-episode-01.mp4`. Current output is a 47-second **silent timing preview**, explicitly labeled on every frame. No narration, music, or synthesized substitute voice is included.

## Add ElevenLabs narration

1. Paste the exact contents of `voiceover-script.txt` into ElevenLabs outside this project.
2. Download the clean full-length recording as `public/voiceover.mp3` or `public/voiceover.wav` (keep only one).
3. Listen to the actual recording and refine scene start/end seconds in `public/narrationTiming.json`. All seven scenes should cover the recording without gaps. Prefer ElevenLabs timestamps when provided. This project has no forced aligner and does not claim word-accurate synchronization.
4. Adjust each scene's delayed reveals in `src/index.tsx` to match the corresponding phrases. Current delays are provisional.
5. Set the timing JSON status to `manually aligned to supplied audio` only after that manual work.
6. Run `npm run render`. The render script probes actual audio duration, adds 0.5 seconds, and includes the full audio at its natural pace. The preview label disappears when audio is included. Inspect the outro against the recording.

For future episodes, change `voiceover-script.txt`, `public/narrationTiming.json`, and scene content in `src/index.tsx`. Brand tokens live in `src/episodeData.ts`. Reusable SVG avatar, phone, card, calendar, text, rail, comparison, and outro components are named exports in `src/index.tsx`.

## Validation

TypeScript check and seven rendered frame inspections at 1, 7, 13, 22, 30, 37 and 44 seconds. See `out/contact-sheet.jpg` and individual PNGs. All animation is deterministic from Remotion frames. Timing is provisional and unequal across the seven story beats. Current scene transitions are direct editorial cuts; cards use staggered spring reveals.

## Episode 02 — How to Stop Overthinking His Texts

See [episode instructions](episodes/02-overthinking/README.md). Run `npm run dev:02` or `npm run render:02` for the 30-second, six-scene, visuals-only Reel. The promised CALM checklist is included alongside the episode brief.

## Episode 03 — 3 Signs Your Self-Respect Is Growing

See [episode instructions](episodes/03-self-respect/README.md). Run `npm run dev:03` or `npm run render:03` for the revised five-scene, 900-frame, silent animation. Episode 03 follows its specific rose-and-cream visual brief. The exact narration script, timing map, and free five-day RESPECT challenge are included.

## Episode 04 — Your Healthy Breakfast Might Be Missing Something

See [episode instructions](episodes/04-breakfast/README.md). `npm run dev:04` and `npm run render:04` use the uploaded ElevenLabs narration with an audio-timed 34-second timeline. The seven scenes return to white backgrounds and the original #CE89FE accent. Source includes the narration, editable phrase timing, local alignment script, and BOWL breakfast-builder checklist.

## Episode 05 — 3 Gym Mistakes That Could Be Holding Back Your Progress

See [episode instructions](episodes/05-gym/README.md). `npm run dev:05` and `npm run render:05` use the supplied ElevenLabs recording and adjustable audio-derived timing. The 33.5-second voiced edition includes an articulated curl, recovery schedule, concrete tracking example, and the promised STRONG workout tracker.

## Episode 06 — 3 Reasons Your Daily Routine Never Lasts

See [episode instructions](episodes/06-routine/README.md). `npm run dev:06` and `npm run render:06` use the newly supplied business-suit character reference and actual ElevenLabs timing. The 35.5-second voiced edition includes calendar reflow, habit selection, a 30-to-10-minute backup transformation, and the ROUTINE planner.

## Boundaries — Why You Feel Guilty Saying No

This brief was labeled Episode 05 but is stored separately to preserve the existing gym episode. See [boundaries instructions](episodes/05-boundaries/README.md). `npm run dev:boundaries` and `npm run render:boundaries` create the 30-second voiced/silent editions, using the current character, exact supplied transcript, and phrase-timed animation. The three promised polite replies are included.
