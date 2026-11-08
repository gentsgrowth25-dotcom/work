# Pretty Wise Tips — cinematic animation engine

A reusable React + TypeScript + Remotion project for vertical affirmation films made from original cel-style illustrations. Episode JSON controls the scene sequence, raster artwork, camera tracks, optional character layers, captions, voiceover, music and film texture.

**Current pilot: marked development storyboard.** The supplied ElevenLabs narration is included and automatically aligned to editable word timestamps. The airplane-wing reference and all production illustrations are missing. The included development plates demonstrate timing and engine behavior; they are not a finished cinematic pilot or animated character performance.

## Start locally

Use Node.js 20 or later and npm. FFmpeg/ffprobe are needed for the audio inspection workflow. Dependencies are pinned to Remotion **4.0.541**, React **19.2.3** and TypeScript **5.9.3**.

```bash
npm ci
npm run studio
```

Open the Studio URL printed by the command. If an existing Chromium installation is available, the renderer can use it:

```bash
export REMOTION_BROWSER_EXECUTABLE=/usr/bin/chromium
```

Otherwise allow Remotion to obtain its compatible browser. Browser setup needs network access on the first run.

## Build and render

```bash
npm run typecheck
npm test
npm run test:render
npm run validate
npm run build
npm run render -- --out renders/pilot-development.mp4
npm run render:silent
npm run still -- --frame 698 --out renders/closing.png
```

The supplied pilot is **24 seconds · 1080 × 1920 · 30 FPS**. Its narration is **23.562438 seconds** and remains at its original speed. A silent render removes audio tracks; it does not require music. Default outputs are `renders/pilot-development.mp4`, `renders/pilot-development-silent.mp4` for silent mode, `renders/pilot.mp4` for production, and `renders/pilot-development.png` for a still. Use `--out` to choose another path.

Render a different episode without changing the engine:

```bash
npm run render -- --episode src/data/episodes/my-episode.json --out renders/my-episode.mp4
```

The production command deliberately refuses missing artwork and development status:

```bash
npm run render:production -- --episode src/data/episodes/pilot.json --out renders/pilot-final.mp4
```

Supply the approved images, set the scene artwork paths and change `artworkStatus` to `production` before using that command. Do not remove development labels to disguise missing artwork.

## Two artwork modes

- **Flattened:** one scene illustration; camera movement, transitions, lighting, particles, captions and texture. A still image does not independently blink, speak, walk or gesture.
- **Layered:** registered PNG/WebP backgrounds, character parts, props and replacement sprites; restrained keyframed movement, parallax, blinks and explicit expression/mouth cues. Each enabled feature requires the corresponding artwork.

Principal illustrated artwork is raster-based. SVG is reserved for auxiliary graphics. The current pilot uses development plates because production artwork was not attached.

The included development PNGs need no Python dependencies. Their optional regeneration script requires Python, Pillow and the listed Linux DejaVu font paths; regeneration is not needed to run or render the project.

## Project map

```text
src/compositions/              Episode timeline and audio
src/components/                Camera, layers, character, captions, transitions, texture
src/data/episodes/pilot.json    Editable pilot configuration
src/data/characterProfiles/     Character identity contract
src/data/sceneTimings/          Timing utilities and source word alignment
src/styles/                    Typography and brand treatment
src/utils/                     Deterministic timing and motion
public/                        Raster artwork, fonts and audio
scripts/                       Validation, rendering and audio inspection
```

Use [the episode workflow](docs/EPISODE_WORKFLOW.md) for artwork, camera tracks and future episodes; [the audio workflow](docs/AUDIO_WORKFLOW.md) for ElevenLabs import and caption correction. The exact missing illustrations are listed in [the asset manifest](docs/ASSET_MANIFEST.md) and [`public/asset-manifest.json`](public/asset-manifest.json). The original character handoff is specified in [the character specification](docs/CHARACTER_SPEC.md). See [the supplied audio analysis](docs/AUDIO_ANALYSIS.md) for the actual transcript and alignment provenance.

Use only artwork, audio and music you have rights to use. No background music was supplied. The supplied voiceover is retained as a user-provided asset. Bundled DejaVu fonts include their license. Review Remotion's current license terms for your organization's use.
