# Native 4:5 production verification — 8 November 2026

The actual illustrated master and five-second artwork test have been rendered and visually reviewed. All **14 principal scene PNGs** exist at **1122 × 1402** and were checked together for the canonical character, crimson outfit, coherent environments, readable captions and absence of development graphics. Their actual dimensions and SHA-256 hashes are recorded in the public manifests.

## Implementation and visual checks

- TypeScript passed; **44 unit and pipeline tests** passed.
- The real five-second test and full production rendering commands passed, including bundling and strict preflight.
- Generic browser checks passed for all **17 caption cues**, local fonts, two-line layout and supported raster/layer behavior. Synthetic fixtures establish engine behavior; they do not imply character acting in this film.
- The actual first test was inspected against the supplied canonical red-dress reference. Its passed receipt binds both opening PNG hashes and the reviewed MP4 hash. The matching test video is bundled at `review/pretty-wise-tips-vintage-test-4x5.mp4` so source-package validation is reproducible.
- A contact sheet sampling all 14 final shots was visually reviewed. It contains real cel-style artwork, clear captions and no scene cards, missing-art labels or debug graphics.
- Caption placement was adjusted for the images: y = 650 px on the opening detail; y = 990 px on 04B/05A; y = 930 px otherwise, with x = 80 px and width = 920 px. The semibold sans is 56 px, with a 64 px closing caption; phrases stay at six words/two lines maximum.

## Measured final media

[`MEDIA_VERIFICATION_4X5.json`](MEDIA_VERIFICATION_4X5.json) records the actual export:

| Property | Verified result |
| --- | --- |
| Video | H.264, 1080 × 1350, 30/1 FPS |
| Video length | 716 frames, 23.866667 seconds |
| Audio | AAC, 48 kHz, stereo |
| MP4 container length | 23.872 seconds, including small AAC padding |
| Full decode | Passed |
| Reported black intervals | None |
| Decoded audio sample peak | −7.4 dBFS; this is not a true-peak measurement |

The original 23.562438-second MP3 is preserved with SHA-256 `f5e618942f244bca0f33e79cfecf7c9c5901fc5c32b6eb71a06a42dd35e4c399`. The final production uses gain 1, no fades, no speed change and no music. At a 16 kHz decoded comparison rate, source/output waveform alignment lag is **0 samples**, correlation **0.999961**, and mono-downmix relative gain **0.998337**. The AAC output is encoded media, not a byte-identical copy of the MP3; these measurements support preserved timing and level.

The five-second test video is H.264 at 1080 × 1350, 30 FPS, 150 frames and 5.000 seconds of video. Its MP4 container is 5.013 seconds with AAC padding. The native cover PNG is 1080 × 1350.

## Motion and alignment limits

Character drawings remain held. Camera movement, cuts, captions and the separately illustrated rising/fading tea-steam overlay are animated. There is no independent face/body/hand/hair acting or lip sync. See [MOTION_REPORT_4X5.md](MOTION_REPORT_4X5.md) for the precise motion claim.

The recording is authoritative and differs from sample quotations in the production JSON. All **63 ASR word records** are retained, with an unspoken closing affirmation from 22.98 seconds to the master end. Their automatic alignment remains editable and has not been claimed as a completed human word-by-word listening review. `AUDIO_ALIGNMENT_4X5.json` and `src/data/sceneTimings/pilot.waveform.json` preserve alignment/waveform evidence. Current exact shot/caption timing is configured in `src/data/episodes/production.ts`; recommended split points in the alignment report are planning suggestions.

The original user reference is inline in the conversation. `public/characters/lead-style-anchor-4x5.png` is a **derived generated style anchor**, not the original user attachment. That distinction is recorded in the manifest. Historical 9:16 development exports are separate artifacts and are not evidence for this native 4:5 film.

The default Studio final preview was also checked with no manually supplied `artworkReview` prop: it loads the approved public receipt and verifies the opening artwork and original audio. CLI receipt validation remains authoritative.
