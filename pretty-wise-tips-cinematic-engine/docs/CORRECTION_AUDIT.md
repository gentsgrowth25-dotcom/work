# Production pipeline correction audit

The previous MP4 was a development storyboard. It did not satisfy the requested illustrated animation.

## Cause found in the inspected project

- `scripts/create-development-assets.py` drew scene numbers, descriptions and “ILLUSTRATION REQUIRED” into seven PNG cards under `public/development/`.
- `src/data/episodes/pilot.json` provided those `development.src` paths and omitted actual scene-image paths.
- `CinematicScene` selected the development PNG when no real image was configured and the development flag was enabled. Its additional development label was separate from the text already baked into the PNG.
- `PilotEpisode` added a development banner. The former `PrettyWisePilot` and `PrettyWiseSilent` root compositions both defaulted to development mode, while the old renderer used that route unless `--production` was supplied.
- The supplied images inventory contained those development cards, fonts and the MP3. There were no completed cinematic scene illustrations or airplane-wing reference to render.

The camera, timing, captions, audio, transition and layered-motion utilities remain useful. Removing the banner alone would not solve the problem: the source images themselves were development graphics.

## Required separation

The corrected contract names three distinct compositions: `CINEMATIC_PILOT_FINAL`, `VINTAGE_VISUAL_TEST` and `DEVELOPMENT_PREVIEW`. Final production is the default render target and must use actual mandatory scene images. The visual test uses the first actual illustration for five seconds before the full film. Development cards belong only to the explicit development composition; another placeholder export is not a corrected deliverable.

`public/required-assets.json` lists the seven exact production PNGs. Missing required images must stop final rendering with errors identifying their paths. A recorded visual review, tied to the actual first-scene image and test-video SHA-256, is required before the full 24-second film. The final composition must contain no numbers, descriptions, filenames, debug overlays or fallback cards.

The airplane-wing reference is unavailable. No result can honestly be described as checked against that unseen image. Any authorized written-brief interpretation must be labeled as the review basis.

## Verification status

This audit records the inspected cause and correction contract. It is not a claim that illustrations have been created, a visual test has passed or a final cinematic film has been rendered. Historical development-video measurements do not verify the corrected production route. Current verification results belong in `docs/QUALITY_CONTROL.md` after the corrected code and actual artwork have been reviewed.
