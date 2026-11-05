# Episode 06 — 3 Reasons Your Daily Routine Never Lasts

## Audio-driven production

The supplied ElevenLabs recording is **35.082438 seconds**. The voiced edition follows its natural pace on a **35.5-second / 1065-frame** timeline at 30 fps, including a short final hold. This supersedes the pasted visual-first brief's provisional 30-second schedule. No voice, music or effects were generated. A matching silent visual track is also exported.

Composition: `PrettyWiseTipsEpisode06`, 1080 × 1920. Files: `pretty-wise-tips-episode-06.mp4` (voiced) and a separate `pretty-wise-tips-episode-06-silent-v1.mp4` for editing.

From `pretty-wise-tips/`:

```sh
npm ci
npm run check
npm run dev:06
npm run render:06
```

Chromium is set to `/usr/bin/chromium`; adjust on another platform. `scripts/render-episode06.mjs` creates the visual track, then muxes the original recording directly with FFmpeg to avoid the audio mix delay diagnosed in Episode 04. The Studio composition includes the recording for preview.

## New character reference

This episode intentionally replaces the Episode 01–05 Maya rigs. `public/episode06/character/confident.png` is a reference-conditioned transparent cutout of the supplied business-suit character. `poses.png` is a matching two-pose sheet for a concerned watch-check and a calm presenting gesture. These assets were prepared with the image-editing tool using the uploaded picture as reference; they are not a claim of pixel-identical extraction from the original attachment.

The actual supplied picture governs appearance where the prose differs: it shows flowing/wavy long dark-brown hair and gold hoop earrings, rather than perfectly straight hair and pearl studs. The face, lavender blazer and trousers, white blouse and heels, belt buckle, necklace, watch and mature illustrated appearance are carried through the reference-based assets. The final pose uses the original arms-crossed cutout treatment. No older character rig is substituted.

`RoutineCharacter.tsx` renders these assets through SVG head/torso/leg layers and pose changes. Purposeful head/upper-body movement, expression poses, clock motion, calendar reflow, habit selection and interactive objects drive the animation. The SVG asset component removes low-opacity generated background fringe before compositing on pure white; use the component rather than displaying the raw pose atlas directly. The standing mobility beat is a gentle upper-body/shoulder movement, without a gym outfit or an implausible heel-clad workout. No simulated running or weight lifting is added.

### Lavender sampling

`episode06Theme.ts` uses **#CB85ED**: the most frequent opaque lavender RGB triplet in the reference-conditioned cutout. The outfit has illustrated shading rather than one flat RGB. `character-provenance.json` records the source treatment and sample method. This is the latest reference-based lavender treatment, not the old darker mauve fallback. Backgrounds remain pure white; gold appears only in the reference character's jewelry and hardware.

## Timing and scene data

`public/episode06/narrationTiming.json` is the animation's source of scene boundaries and cue frames. `src/episode06Data.ts` exposes it separately from the scenes. Local PocketSphinx forced alignment produced phrase estimates, with rough independent recognition and phrase-pause checks. These are not manually verified word-perfect captions. No transcript subtitles are burned in.

| Scene | Starts | Main change |
| --- | ---: | --- |
| Late alarm | 0.00 s | Alarm moves on frame one; schedule becomes disrupted; early breathing-room hint before four seconds |
| Overplanning | 6.21 s | Schedule gains gaps at “leave breathing room,” around 8.94 s |
| One habit | 11.98 s | Competing goals narrow to reading two pages at 15.01–15.52 s |
| Comment ROUTINE | 18.09 s | ROUTINE types with the word at 18.59 s; five-day planner follows |
| Backup plan | 21.85 s | Obligation interrupts the 30-minute plan; 10-minute version appears at 28.22 s |
| Takeaway | 29.77 s | Full and smaller routines coexist; close-up arms-crossed pose finishes the message |

The narration script, local alignment output and optional `scripts/align-episode06.py` are included. For another recording, install `pocketsphinx==5.1.1` in a separate Python environment, run the alignment script, probe the new duration and revise the cue map before rendering. Preserve natural narration speed and its first/last syllables.

## Creator planner and verification

`ROUTINE-five-day-habit-planner.md` is a readable planner; the CSV is spreadsheet-ready. Deliver manually to commenters or set up your own authorized workflow. No DM delivery was simulated or configured.

Review frames cover the hook, schedule reflow, selected habit, comment prompt, backup transformation, and final reference pose. TypeScript, full video decoding, opening-frame movement and original-versus-export audio timing are checked before GitHub upload. Older episodes are preserved.
