# Pretty Wise Tips — native 4:5 cinematic pilot

The illustrated pilot is rendered and reviewed. It uses **14 distinct cel-style drawings**, the supplied ElevenLabs voiceover and a native **1080 × 1350, 4:5, 30 FPS** master: **716 frames / 23.866667 seconds**. The complete 23.562438-second recording plays at source speed and gain, followed by a short tail.

The production follows the supplied inline red-dress character reference: caramel-brown skin, chestnut/burgundy sculpted forelock and long waves, beauty mark, crimson long-sleeve draped dress and pearls. All shot PNGs are present at 1122 × 1402; their hashes and review status are in [`public/required-assets.json`](public/required-assets.json).

## Deliverables

- `pretty-wise-tips-cinematic-pilot-4x5-final.mp4` — full H.264/AAC master.
- `pretty-wise-tips-vintage-test-4x5.mp4` — reviewed five-second / 150-frame opening test.
- `pretty-wise-tips-cinematic-pilot-4x5-cover.png` — native 1080 × 1350 cover.
- The v3 source package — reusable Remotion engine, all artwork, editable production/timing data, original voiceover, manifests and verification reports.

The source includes the reviewed test at `review/pretty-wise-tips-vintage-test-4x5.mp4` and its passed receipt, allowing final preflight to be reproduced after extraction. The derived `public/characters/lead-style-anchor-4x5.png` is a generated style anchor; the original canonical reference was supplied inline, without a local attachment path.

## Run and render

Use Node.js 20 or later and npm. FFmpeg/ffprobe support media inspection. Core versions are pinned to Remotion **4.0.541**, React **19.2.3** and TypeScript **5.9.3**.

```bash
npm ci
npm run studio
npm run render -- --composition test
npm run render -- --composition final
```

If locally installed, Chromium can be selected with `REMOTION_BROWSER_EXECUTABLE=/usr/bin/chromium`; otherwise Remotion may obtain a compatible browser on first use.

Registered compositions are `VINTAGE-VISUAL-TEST-4X5`, `CINEMATIC-PILOT-4X5-FINAL` and the separate `DEVELOPMENT-PREVIEW`. CLI selectors `test` and `final` choose the real-artwork routes. Default `npm run render` targets final production and writes `renders/pretty-wise-tips-cinematic-pilot-4x5-final.mp4`.

Preflight requires the 14 actual shot PNGs, matching original voiceover and a current review receipt. It never replaces missing art with cards or blank panels. The receipt binds both opening PNG hashes and the bundled reviewed test-video hash; changed reviewed files need a new test/review. See [the review workflow](docs/VISUAL_TEST_REVIEW.md).

## What moves

The character poses are held drawings. The film animates restrained camera movement, cuts/dissolves, captions and **one separate transparent rising/fading steam overlay** in the teacup shot. It does not claim independent blinking, lip sync, walking, signing or face/body/hand/hair animation. [The motion report](docs/MOTION_REPORT_4X5.md) states exactly what is animated.

The actual recording controls captions; its words differ from the sample quotations in the production JSON. All **63 ASR word records** remain editable. No replacement narrator, fades or music are added to the final film. Automated word alignment has not been claimed as a completed human listening review.

## Verify and reuse

```bash
npm run typecheck
npm test
npm run test:render
npm run validate
npm run build
```

TypeScript and 44 unit/pipeline checks passed. The real test and full film rendered successfully; [QUALITY_CONTROL.md](docs/QUALITY_CONTROL.md) and [the measured media report](docs/MEDIA_VERIFICATION_4X5.json) record the actual results and limitations.

Edit `src/data/episodes/production.ts` for the current 14-shot timeline/camera/caption configuration. [The episode workflow](docs/EPISODE_WORKFLOW.md), [audio workflow](docs/AUDIO_WORKFLOW.md), [character bible](docs/CHARACTER_SPEC.md), [asset handoff](docs/ASSET_MANIFEST.md) and [`public/art-prompts-4x5.json`](public/art-prompts-4x5.json) support future episodes without rebuilding the components.

The supplied voiceover remains unchanged as a user-provided source. Bundled Open Sans and DejaVu fonts include their licenses. Use artwork/audio you have rights to use and review Remotion's current licensing terms for your organization's use.

Studio can preview the approved final using `public/visual-test-review.json`; the CLI refreshes this mirror only after the authoritative file/hash preflight passes. `npm run test:studio` verifies the default Studio props without a pasted review prop.
