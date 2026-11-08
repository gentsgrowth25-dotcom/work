# Authoritative ElevenLabs audio and editable captions

The supplied voice is used verbatim in content and playback speed. The engine does not generate a replacement narrator, infer lip sync or add unsupplied music.

## Verified source

The current uploaded MP3 resolves to:

```text
/workspace/attachments/9cc76185-4075-4d5d-85de-d2b357406664/ElevenLabs_2026-11-08T12_14_36_Georgia K - Warm Engaging Customer Care_pvc_s50_sim75_v4 (1).mp3
```

It matches `public/audio/pilot-elevenlabs.mp3` exactly:

```text
SHA-256: f5e618942f244bca0f33e79cfecf7c9c5901fc5c32b6eb71a06a42dd35e4c399
Duration: 23.562438 seconds
Mono, 44.1 kHz
```

Because the bytes match, the existing 63 actual ASR word timestamps apply to the new upload. The native 4:5 master is **716 frames at 30 FPS / 23.866667 seconds**, allowing a 0.304-second tail without accelerating or truncating the recording. Output gain/fades are editable track settings; they do not change the source file.

## Actual spoken text

The sample quotations in the production JSON do **not** match the recording. Captions must use:

> I enter every room knowing I have something valuable to offer.
>
> I speak about my work without apologizing.
>
> I ask for opportunities and I prepare for them.
>
> A rejection does not change my value.
>
> I don't need to chase every offer.
>
> I can choose the right ones.
>
> My ambition is not something to hide.
>
> I'm building the life I used to only imagine.

“I AM BECOMING HER.” is an unspoken finishing caption. Do not synthesize it or substitute the JSON's sample text for the actual voice.

The 63 word boundaries are ASR-aligned against this exact audio, not estimated from the sample script. They remain editable and have not been claimed as human-reviewed. Model probability is not a timing-error measurement. Review the lower-confidence “apologizing.” and the “and” before “I prepare” particularly closely. See `AUDIO_ANALYSIS.md` and `src/data/sceneTimings/pilot.words.json` for provenance.

## Five-second test audio

`VINTAGE-VISUAL-TEST-4X5` uses the first two actual 4:5 drawings, a **4.4-second clip of this source recording**, and a picture hold to five seconds. The opening sentence ends around 3.86 seconds; the next starts around 4.64 seconds, so the clip preserves the complete first sentence without including the next one. The full final composition uses the complete source narration.

```bash
npm run render -- --composition test
```

Inspect both the artwork and caption/audio relationship in `renders/pretty-wise-tips-vintage-test-4x5.mp4` before recording visual approval. Do not render a card-based substitute for this review.

## Importing narration for a future episode

```bash
npm run audio:inspect -- '/path/to/ElevenLabs narration.mp3'
npm run audio:inspect -- '/path/to/ElevenLabs narration.mp3' --copy
```

The script uses ffprobe to report duration and propose a `voiceover` object; `--copy` also copies into `public/audio/` with a sanitized filename. It does not edit episode JSON, transcribe or align audio, reuse prior word timings, change speed or overwrite an existing different destination.

Apply the proposed path/duration to the new episode. `AudioTrack` uses `src`, `duration`, optional episode `start`, gain `volume`, `fadeIn` and `fadeOut` in seconds. Ensure `start + duration` fits the episode and leave a short intentional tail instead of truncating speech. General engine audio tracks are optional; **this production's final/test gate requires the supplied voiceover**. The test may be inspected silently while its source file is still verified. A silent final render is rejected; this film requires its original narration. No music is supplied for this pilot.

## Word data and manual correction

The render uses caption arrays in the production episode configuration. Each cue has absolute episode `start`/`end`, `text` and optional `words`:

```json
{
  "id": "caption-01",
  "start": 0,
  "end": 1.38,
  "text": "I enter every room",
  "words": [
    {"word": "I", "start": 0, "end": 0.2},
    {"word": "enter", "start": 0.2, "end": 0.46},
    {"word": "every", "start": 0.46, "end": 0.88},
    {"word": "room", "start": 0.88, "end": 1.38}
  ],
  "keyword": "room"
}
```

An external aligner may use `text`/`probability`; map those to render fields `word`/optional `confidence`. Keep token order aligned with caption text, preserve punctuation and chronological boundaries, and keep each word inside its phrase. Source word-data edits alone do not update separate caption arrays automatically.

If audio is placed at episode offset 0.5 seconds, add that offset once to file-relative word/phrase times. Camera/character cues are local to their shot; captions remain global so they stay synchronized through cuts. Keep six words/two lines maximum and place the semibold editorial sans captions clear of faces, hands and key objects.

Use `captionTiming: "provisional"` for estimates, `"asr-aligned"` for imported actual alignment, and `"reviewed"` only after a real listening pass. Correct cue starts/ends and individual words against playback at 30 FPS (one frame ≈0.0333 seconds). Current alignment stays marked as ASR until such review is performed; a status change alone is not a review.
