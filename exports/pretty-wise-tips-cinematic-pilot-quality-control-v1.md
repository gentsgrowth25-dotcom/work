# Verification — 8 November 2026

This delivery is a functioning animation engine and a marked development animatic. Production illustration, character identity and anatomical performance cannot be approved without the missing artwork.

## Completed checks

- `npm run typecheck`: passed.
- `npm test`: 20 tests passed, including independent motion channels, blink timing, scene coverage at fractional boundaries, required assets, facial registration, caption bounds and audio truncation.
- `npm run test:render`: real Chromium pixel checks passed for background/character/foreground ordering, camera and depth movement, registered head/eye movement, blinks, an explicit mouth cue and the absence of uncued mouth movement. These use synthetic raster fixtures only; they do not demonstrate a finished character performance.
- Browser layout checks passed for all 17 pilot caption cues, local font loading, two-line limits, no clipped text and explicit line breaks.
- `npm run validate`: passed for the development pilot. `npm run validate -- --production` correctly rejected the missing artwork and development status.
- `npm run build`: passed on the final source.
- `npm run studio -- --no-open`: started successfully and returned HTTP 200 with the Remotion Studio page. Studio chooses an available port automatically.
- Full narrated and silent Remotion rendering commands completed successfully. Closing still rendered and was visually inspected.

## Export measurements

Both delivered MP4 files contain H.264 video at **1080 × 1920, 30/1 FPS, 720 frames and exactly 24.000 seconds**. The narrated file contains an AAC audio stream; the silent file contains no audio stream. The narrated export's measured sample peak is **−6.1 dBFS**, below clipping. This is a sample-peak measurement, not a true-peak measurement.

FFmpeg checked both full videos for black intervals at least 0.01 seconds long, using a 2% pixel threshold and 98% picture coverage; none were reported. Scene coverage is also checked structurally before rendering. See the separately delivered `media-verification.json` for metadata and file hashes.

The original 23.562438-second MP3 is included unchanged in `public/audio/pilot-elevenlabs.mp3`; its SHA-256 is recorded in the asset manifest. The render uses the configured gain and tail fade without changing narration speed. No background music or synthetic narration was added.

## Review still required

The supplied recording differs from the brief's sample script. Caption data follows the recording, with 63 automated word timestamps and an unspoken closing title at 23–24 seconds. Automated alignment has not received a human listening pass. Review the low-confidence word and pause boundaries described in `AUDIO_ANALYSIS.md`, then correct the episode JSON as needed.

The airplane-wing reference, illustrated master character sheet, seven scene illustrations, opening heel insert and independent animation layers are missing. The manifest describes their exact slots. Current camera moves, captions and transitions operate on clearly labelled development plates. Do not treat these as finished cel artwork or claim independent character movement in the pilot.

Runtime caption guards stop an export if edited text overflows its two-line box or the required serif font fails to load. Production validation stops when supplied artwork is missing, development assets are referenced, rig cues lack sprites or timings leave uncovered frames.
