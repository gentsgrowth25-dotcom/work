# Episode 03 — 3 Signs Your Self-Respect Is Growing

Exactly 900 frames at 30 fps: 30 seconds, 1080 × 1920, H.264, no audio stream.

This revised brief requests a rose, pink, cream and deep-plum treatment with large characters. That direction is applied specifically to this episode. Maya's brunette hair, medium-brown complexion and facial proportions remain consistent across its five scenes; the outfit is pink and cream. The episode's palette is in `src/episode03Data.ts`.

From `pretty-wise-tips/`:

```sh
npm ci
npm run check
npm run dev:03
npm run render:03
```

The render command uses Chromium at `/usr/bin/chromium`; change the browser path on another platform. Composition: `PrettyWiseTipsEpisode03`. Output: `out/pretty-wise-tips-episode-03.mp4`.

## Editable timeline

- 0–5 s: immediate character hook, surrounding demands, three numbered circles; number three becomes a question mark.
- 5–10 s: type a long explanation, delete it, replace it with “I can't today, sorry!”, then send.
- 10–17 s: calendar requests build, protected goal time replaces the clutter, and Maya works at her desk.
- 17–21 s: typed RESPECT comment prompt and five-day checklist preview.
- 21–30 s: a reasonable boundary, disappointed other person, Maya's guilt, the distinct labels moving apart, confidence, final practice lesson and last-second brand reveal.

Scene boundaries and narration text are in `src/episode03Data.ts`; animation cues are deterministic frame values in `src/episode03.tsx`. `scene-timing.json` records the provisional fixed timeline. `voiceover-script.txt` preserves the original narration for recording externally in ElevenLabs. No voice, music or other audio was generated. The visuals have not been speech-aligned. When audio is supplied, probe its duration and adjust cue frames and scene times to the actual phrases; this narration may require a longer timeline at a natural pace.

The recurring SVG character rig is `MayaRose`, with expression, pose, head, eye, blinking, arm and typing variations. All assets are editable vectors/CSS; no external stock art or generated image assets are used.

## Review and delivery

Review frames sample the hook, concise reply, focused desk, comment prompt, guilty thought, separated concepts, and final frame. TypeScript and full video decoding are checked before GitHub upload. The validated output is copied into the repository's `exports/` directory. Older episodes are retained.

`RESPECT-five-day-challenge.md` is the promised resource. Deliver it manually or set up an authorized Instagram workflow before posting the offer. No comment or DM automation has been installed.
