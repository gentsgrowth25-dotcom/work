# Pretty Wise Tips — approved animation reference

The Instagram brand is **Pretty Wise Tips**. The creator chose this animation style as the ongoing visual direction for recurring videos. Preserve this reference for future episodes unless the creator asks to change it.

## Canonical reference

- Approved visual baseline: `exports/pretty-wise-tips-animated-v2.mp4`.
- Editable animation: `pretty-wise-tips/src/index.tsx`.
- Brand tokens: `pretty-wise-tips/src/episodeData.ts`.
- Scene timing: `pretty-wise-tips/public/narrationTiming.json`.

## Visual identity

Vertical 1080 × 1920, 30 fps. Clean 2D editorial vector infographics on white graph paper with an extremely faint 48-pixel grid. Dark text, generous whitespace, large readable headings, occasional elegant italic serif emphasis. Small brand header and episode number, left-hand progressing story rail, subtle borders, rounded floating cards, soft shadows, app-like chats and calendars.

Primary accent #CE89FE; deeper accent #A95BE8; wash #F3E7FE; panel #F7F1FC; light border #E8DDF2; ink #111111; secondary #6F6878. Use lilac accents for emphasis, highlights, connectors, checkmarks, timeline and progress. Keep the canvas white; preserve the restrained palette.

MAYA is the recurring adult female SVG character: medium-brown skin, consistent dark-brown shoulder-length hair and facial features, lavender shirt. Preserve the actual reusable vector design. Use worried, thoughtful, relieved and confident expressions, blinking, eye movement and subtle head motion. Keep character identity consistent across episodes.

## Motion language

Preserve v2's visible per-frame motion: staggered spring card entrances, float and small rotations, drawn purple highlights/connectors, progressive calendar entries, typed chat text, slide-in notifications, deliberate scale/recession and character expressions. Use deterministic Remotion frame animation. Continue improving movement within this established style; avoid long static holds and slideshow-like delivery.

Keep important content inside Instagram-safe margins and inspect representative frames for overflow. Tone is mature, empathetic, empowering, and never shaming. Future content should fit the creator's brief; episode 01's plot is not a required template for every story.

## Narration and production

Use the creator's ElevenLabs narration when supplied. Do not fabricate a substitute voice. Probe actual audio duration, refine timings against the recording, and preserve the natural pace. Without audio, explicitly label output as a silent timing preview; never claim verified narration alignment. Keep exact approved scripts separate from scene data.

Render an H.264 MP4 and retain runnable React/TypeScript/Remotion source. Validate TypeScript, inspect representative frames and verify the complete video decodes. Use existing isolated checkouts; do not create a Git worktree unless requested.

## Established delivery workflow

The creator explicitly chose GitHub as the ongoing export route because the chat workspace viewer cannot download these MP4 artifacts reliably.

Push finished videos and editable source to `gentsgrowth25-dotcom/work`, with versioned filenames under `exports/`, preserving older exports. Include runnable source and dependency lockfile, exclude node_modules and secrets. Give GitHub file links and instruct the creator to use **Download raw file**. Do not present workspace/sandbox links as working downloads. GitHub delivery is authorized for this project's finished videos and source; this does not authorize unrelated publication or other destinations.

## Credit estimates

Account balances and exact Codex per-task consumption are not visible here; do not invent a fixed credit cost per video. Reusing this project should reduce setup work, but editing, tool use, render retries and subscription rules affect usage. ElevenLabs charges depend on the chosen model and plan: count script characters and apply the rate shown in the creator's account. Episode 01 is 625 characters / 99 words before an optional final newline. Budget multiple takes separately.

## Current character update — Episode 06

The creator explicitly supplied a new character and required it to replace the older Episode 01–05 Maya designs. For Episode 06 and future work without another character instruction, use the reference-based business-suit character assets in `pretty-wise-tips/public/episode06/character/` and `RoutineCharacter.tsx`, rather than substituting the older SVG woman. The supplied picture shows an adult woman with long flowing dark-brown hair, medium-brown skin, lavender blazer/trousers/belt, white blouse/pointed heels, and gold jewelry. Follow the actual picture where the brief's straight-hair/pearl-earring prose differs.

Episode 06 uses representative reference-derived lavender #CB85ED with a pure-white canvas. Its provenance is documented in the episode folder; the cutout/pose assets are reference-conditioned image edits rather than a pixel-exact original extraction. Previous episodes retain their historical colors and assets. Preserve the confident arms-crossed reference pose for suitable closing shots, with expressive, tasteful pose/head/body animation elsewhere.


## Current cinematic direction — native 4:5 crimson-dress character

The creator's new `pretty-wise-tips-cinematic-engine/docs/PRODUCTION_SPEC_4X5.json` explicitly supersedes the historical infographic/business-suit direction for the cinematic affirmation project. Use its supplied crimson dress, pearls, caramel complexion, sculpted burgundy forelock and long waves in actual painted/cel-style raster scenes. The finished visual baseline is `exports/pretty-wise-tips-cinematic-pilot-4x5-final.mp4`. Native master geometry is 1080 × 1350 at 30 fps; a 9:16 derivative requires a later request. Preserve the original narration and align cuts/captions to its actual words. No placeholders, SVG puppet substitutes or claims of independent animation from flat art. Camera moves, authored pose cuts, captions and independently illustrated overlays are permitted. Earlier episodes retain their historical styles/assets.
