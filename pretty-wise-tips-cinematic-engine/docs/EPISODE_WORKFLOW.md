# Native 4:5 episode workflow

The current film has been rendered and visually reviewed with all 14 principal illustrations. The first two-shot test and passed review are bundled with the source. The workflow below also describes how to repeat production after edits.

The current production specification is `docs/PRODUCTION_SPEC_4X5.json`. Its sample quoted script is provisional reference text; the actual MP3 controls captions and cuts. Reusable components remain driven by episode/shot data, not manually rebuilt for each image.

## Current master and scene order

The master is **1080 × 1350, 4:5, 30 FPS, 716 frames / 23.866667 seconds**. The 23.562438-second supplied recording plays at its original speed and content, with about 0.304 seconds of tail. Do not stretch or blindly crop older 9:16 artwork to create this master.

Seven location groups contain two authored drawings each:

| Group | Drawings | Actual spoken anchor |
| --- | --- | --- |
| 01 · Dressing-room mirror | Pearl/hand detail → mirror portrait | “I enter every room knowing I have something valuable to offer.” |
| 02 · Vintage kitchen | Three-quarter kitchen portrait → teacup detail | “I speak about my work without apologizing.” |
| 03 · City street | Arrival pose → boutique-window glance | “I ask for opportunities and I prepare for them.” |
| 04 · Jewel boutique | Jewelry-box detail → boutique portrait | “A rejection does not change my value.” |
| 05 · Executive office | Signing detail → office portrait | “I don't need to chase every offer. I can choose the right ones.” |
| 06 · Balcony | Skyline reveal → contemplative profile | “My ambition is not something to hide.” |
| 07 · Hero portrait | Confident close-up → final hero hold | “I'm building the life I used to only imagine.” |

The exact 14 paths and detailed prompts are in `public/required-assets.json` and `public/art-prompts-4x5.json`. Use actual generated/supplied files, not text cards or copied crops of the character reference. Keep the canonical caramel-brown heroine, chestnut/burgundy forelock and long waves, beauty mark, crimson long-sleeve dress and pearls unchanged across every location.

## First two drawings, then the five-second test

Create/obtain `01A_pearls_detail.png` and `01B_dressing_room.png` under `public/scenes/4x5/`, then inspect them against the supplied inline canonical image. Run:

```bash
npm run render -- --composition test
```

`VINTAGE-VISUAL-TEST-4X5` exports `renders/pretty-wise-tips-vintage-test-4x5.mp4`: five seconds, 150 frames, native 4:5. It cuts between the two real drawings, with restrained camera motion and semibold editorial sans captions. The first spoken sentence is complete within the 4.4-second audio clip; the picture holds to five seconds, before the next sentence would begin.

Review the actual image/video for character identity, coherent mirror, anatomy, hand/pearl detail, background design, framing, two-line captions and absence of labels/placeholders. Only after that review should `config/visual-test-review.json` record `status: "passed"`, both first-shot PNG SHA-256 hashes and the test-video SHA-256, with `basis: "supplied-reference"`. See [VISUAL_TEST_REVIEW.md](VISUAL_TEST_REVIEW.md) for the exact receipt shape. The receipt is evidence of a real review; it must not be invented or copied after the reviewed files change.

## Complete the artwork and render the film

After the first test has been inspected, complete the remaining 12 actual drawings. Review a contact sheet for face/hair/costume consistency and the genuine cel-art style. Keep hands, eyes and meaningful details out of the caption area.

```bash
npm run validate
npm run render -- --composition final
```

The default renderer also targets `CINEMATIC-PILOT-4X5-FINAL`. Output: `renders/pretty-wise-tips-cinematic-pilot-4x5-final.mp4`. Final preflight requires all 14 principal PNGs, the supplied voiceover and the current first-test review. It must stop on missing inputs; there is no production fallback to a card or plain color. `DEVELOPMENT-PREVIEW` is isolated for inspection and is not the delivery.

## Editable timing and camera data

Episode data controls title, duration, shot images, starts/durations, camera tracks, captions, audio and finish. The TypeScript shape lives in `src/types.ts`; the current 14-shot edit lives in `src/data/episodes/production.ts`. Use that production configuration rather than older historical storyboard data. The CLI's `--episode` argument selects an alternative episode JSON without rewriting the components. The current pilot's production gate still enforces its 14 required shot slots and reviewed first-test inputs.

Scene/shot `start` and `duration` use episode seconds; keep cuts on whole frames and the timeline contiguous. Camera keyframes, blink/expression/mouth cues use shot-local seconds. Caption/word times use absolute episode seconds, preserving speech alignment across image cuts. One frame at 30 FPS is about 0.0333 seconds.

Camera keyframes accept `time`, `x`, `y`, `scale`, `rotation`, `opacity`, and easing (`linear`, `ease-in-out`, `ease-out`). Translation/pivots use composition pixels; rotation uses degrees. A destination keyframe sets easing for its incoming segment. Keep image moves around 3–7% and art-direct adequate painted bleed. Use clean cuts and occasional 6–10-frame dissolves; the art should dominate.

Native images preserve aspect ratio. Do not squeeze the face or use a large crop to hide an incorrectly proportioned scene. Captions use a clean editorial semibold sans, off-white/charcoal according to background, one restrained gold/lavender emphasis and a 4–6-frame entry. Keep phrases to six words/two lines maximum, around 68–78% height where appropriate. Native safe margins: 95 px top, 190 px bottom, 80 px left/right. Override placement when hands, jewelry or documents need that space.

## What is actually animated

The current principal artwork is flattened; 02B also includes a separately registered illustrated steam overlay that rises/fades. Supported performance is restrained camera movement and cuts between separately authored drawings. A still of a hand at a necklace is a held drawing; it is not an independently moving hand. A street pose is not a walk cycle. A signing pose does not show an animated pen stroke. Do not warp heads, wrists, hair or bodies to imply those actions.

When suitable independent raster layers are added, configure them explicitly: clean background/midground/foreground, registered character parts, open/half/closed eyes, compatible expressions and illustrated props. Background-plane layers draw before the character and `plane: "foreground"` layers after it. Genuine parallax requires those separate layers. Keep all layers in a shot on the same canvas/registration and provide hidden painted fill. Voiceover does not infer mouth cues. See [CHARACTER_SPEC.md](CHARACTER_SPEC.md).

## Verification and future episodes

```bash
npm run typecheck
npm test
npm run test:render
npm run build
```

Checks verify implementation and file/configuration behavior. Inspect sampled frames, all cut boundaries and the full rendered MP4 with sound; use ffprobe to confirm 1080 × 1350, 30 FPS and 716 frames. Current measured results and a short truthful movement report belong in `QUALITY_CONTROL.md` only after those checks and media reviews are complete.

For future episodes, preserve the component engine and create a new data/asset pack with its own authoritative narration, actual illustrations, timing and visual review. Keep one approved character model; do not treat a prompt list or pending file status as finished artwork.
