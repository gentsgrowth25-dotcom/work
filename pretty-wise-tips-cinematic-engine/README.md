# Pretty Wise Tips — cinematic animation engine

A reusable React, TypeScript and Remotion engine for affirmation films made from original illustrated scenes. Episode JSON controls raster artwork, camera movement, scene timing, optional character layers, captions, audio and subtle broadcast texture.

**Production status: artwork required.** The seven required scene illustrations and the airplane-wing reference have not been supplied. Previous development cards were a storyboard, not the requested animation. They are not accepted as production artwork. No new placeholder video is part of the correction.

## Start locally

Use Node.js 20 or later and npm. FFmpeg/ffprobe are used by the audio workflow. Dependencies are pinned to Remotion **4.0.541**, React **19.2.3** and TypeScript **5.9.3**.

```bash
npm ci
npm run studio
```

The Studio compositions are deliberately separate:

| Composition | Purpose |
| --- | --- |
| `CINEMATIC_PILOT_FINAL` | 24-second production film; real artwork only, no fallback cards |
| `VINTAGE_VISUAL_TEST` | Five-second first-scene artwork test before full production |
| `DEVELOPMENT_PREVIEW` | Explicitly separated development inspection; not the corrected deliverable |

If an existing Chromium installation is available, the renderer can use it:

```bash
export REMOTION_BROWSER_EXECUTABLE=/usr/bin/chromium
```

Otherwise allow Remotion to obtain a compatible browser. First-run browser setup needs network access.

## Required artwork

Supply these **completed cinematic illustrations**, with one consistent original adult female lead, at 1080 × 1920 or larger in 9:16:

```text
public/scenes/01_hotel_lobby.png
public/scenes/02_dressing_room.png
public/scenes/03_meeting_room.png
public/scenes/04_jewelry_detail.png
public/scenes/05_executive_desk.png
public/scenes/06_penthouse.png
public/scenes/07_final_portrait.png
```

No embedded captions, watermarks, scene descriptions or development graphics. Use hand-drawn 1990s Western television cel-animation artwork: clean dark contours, mature elegant proportions, flat restrained color, one or two cel-shadow tones and painted-looking backgrounds. Fine grain cannot substitute for the correct illustration style.

[`public/required-assets.json`](public/required-assets.json) lists the exact mandatory inputs. [The asset handoff](docs/ASSET_MANIFEST.md) describes each scene. The missing airplane-wing image cannot be inspected or used to verify reference fidelity. An interpretation from the written brief must be identified as such; do not claim it matches an unseen reference.

## Test first, then render the film

Once the first actual illustration is present:

```bash
npm run render -- --composition test
```

This targets `renders/pretty-wise-tips-vintage-test.mp4`: **five seconds, 150 frames, 1080 × 1920, 30 FPS**, with subtle camera movement and the first actual narration sentence followed by a brief hold. Inspect the rendered artwork, face, environment, captions and framing. Real independent character motion is possible only if matching transparent layers are supplied.

Only after visual review should `config/visual-test-review.json` record approval tied to the current first-scene artwork and test-video SHA-256. The receipt records the review basis; it cannot establish similarity to an unavailable reference. Changes to the reviewed artwork or video require a fresh review.

See [the visual review workflow](docs/VISUAL_TEST_REVIEW.md) and the deliberately pending example receipt in `config/`.

Then render the 24-second film:

```bash
npm run render -- --composition final
```

The default `npm run render` also targets final production. Its output is `renders/pretty-wise-tips-cinematic-pilot-final.mp4`. Missing mandatory images or a missing/stale visual-test review must stop the final render with a clear error. There is no silent substitution of a development plate.

At the current missing-art stage, failing this gate is the intended result; it is not a completed cinematic export.

## Engine checks and workflows

```bash
npm run typecheck
npm test
npm run test:render
npm run build
```

These checks verify code and rendering behavior; they do not approve the artwork's aesthetic. See [the episode workflow](docs/EPISODE_WORKFLOW.md), [ElevenLabs and caption workflow](docs/AUDIO_WORKFLOW.md), [character asset specification](docs/CHARACTER_SPEC.md), and [correction audit](docs/CORRECTION_AUDIT.md).

The supplied narration is **23.562438 seconds** and has editable ASR word alignment against its actual spoken text. It is voiceover, not a generated narrator. No music was supplied. A flat illustration supports camera motion and separate overlays; it does not independently blink, walk, turn its head, gesture or move its hair. [The audio analysis](docs/AUDIO_ANALYSIS.md) records alignment provenance and review limits.

Use only artwork, audio and music you have rights to use. The supplied voiceover is retained as a user-provided asset. Bundled DejaVu fonts include their license. Review Remotion's current licensing terms for your organization's use.
