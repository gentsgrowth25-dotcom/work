# ElevenLabs narration and caption workflow

Create and approve the illustrations first, then import the finished ElevenLabs recording. The engine uses the supplied recording; it does not synthesize a narrator or infer talking animation from voiceover.

## Supplied pilot recording

`public/audio/pilot-elevenlabs.mp3` is the supplied MP3: **23.562438 seconds**, mono, **44.1 kHz**. The 24-second episode preserves its original speed. The recording differs from the reference script in the project brief; captions use this actual transcript:

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

The final **“I AM BECOMING HER.”** is visual text from 23–24 seconds. It is not spoken in the recording.

The pilot contains 16 short narration phrases plus the closing caption. Their word timestamps were automatically aligned to the actual recording with faster-whisper, not estimated from the reference script. `captionTiming` is `asr-aligned`, because no human listening pass has been claimed. ASR timings can be several frames off, especially around pauses; model confidence is not a timing-error measurement. Review “apologizing.” and the “and” before “I prepare” particularly closely. See [AUDIO_ANALYSIS.md](AUDIO_ANALYSIS.md) for measurements and provenance, and [`../src/data/sceneTimings/pilot.words.json`](../src/data/sceneTimings/pilot.words.json) for source word data.

## Inspect and copy a new narration

Use a local MP3, WAV or another format supported by FFmpeg/ffprobe:

```bash
npm run audio:inspect -- '/path/to/ElevenLabs narration.mp3'
npm run audio:inspect -- '/path/to/ElevenLabs narration.mp3' --copy
```

The first command reports the measured file duration and proposes an `AudioTrack` object. `--copy` also copies the file into `public/audio/`, using a filename with spaces and other special characters replaced by hyphens. Existing different destination files are preserved: choose a new source filename rather than overwriting a previous narration accidentally.

The script prints proposed metadata. It **does not edit episode JSON, transcribe audio, align captions, replace existing timestamps or change audio speed**. Apply the printed `voiceover` object to your episode file, and use its printed `src`, for example:

```json
"voiceover": {
  "src": "audio/ElevenLabs-narration.mp3",
  "duration": 23.562438,
  "start": 0,
  "volume": 1,
  "fadeIn": 0,
  "fadeOut": 0.15
}
```

All times are seconds. `start` is the recording's placement on the episode timeline. `volume` is a gain multiplier, not a decibel value. Fade durations apply within that audio track; use zero when a fade would obscure the opening or closing word. The episode must be long enough for `start + duration`; extend the final scene and episode duration rather than unintentionally truncating narration. The metadata proposal includes a duration rounded up to a whole 30 FPS frame. It is a suggestion, not an automatic timeline edit.

The supplied pilot uses gain 1.15 with a 0.15-second ending fade. Review final output levels after any gain or music change. The source recording has not been normalized or speed-adjusted.

## Import word timestamps

Obtain alignment for the **exact finished audio file**, using an external speech aligner or manual listening. The project includes the pilot's completed ASR data; ASR model installation is not required to build or render the project. For a different recording, do not reuse the pilot's word timings, even if the text is similar.

The canonical render data lives in each caption's `words` array in episode JSON:

```json
{
  "id": "caption-01",
  "start": 0,
  "end": 1.38,
  "text": "I enter every room",
  "words": [
    {"word": "I", "start": 0, "end": 0.2, "confidence": 0.964},
    {"word": "enter", "start": 0.2, "end": 0.46, "confidence": 0.998},
    {"word": "every", "start": 0.46, "end": 0.88, "confidence": 0.985},
    {"word": "room", "start": 0.88, "end": 1.38, "confidence": 0.999}
  ],
  "keyword": "room"
}
```

An external aligner's field names may differ. Map its token text to `word`, its boundaries to `start`/`end`, and optional confidence to a 0–1 `confidence`. The included source ASR file uses `text` and `probability`; episode captions use `word` and `confidence`. Keep the source data for provenance, but changing it alone does not update the caption arrays used by the renderer.

Caption boundaries and word boundaries are **absolute episode seconds**, while camera, expression, blink and mouth cues are scene-relative. If a recording begins at `voiceover.start: 0.5`, add 0.5 seconds to file-relative word and caption times. Avoid applying that offset twice.

Keep the `words` array in the same token order as the caption text; the highlight follows token index. Preserve punctuation with its word. Set each word's end after its start, keep words chronological and inside the caption range, and keep caption ranges non-overlapping. Split phrases before they exceed two rendered lines. Shorten or rephrase the caption grouping rather than hiding text outside the caption box.

## Review and make corrections

1. Set `captionTiming: "provisional"` when timings are estimates, or `"asr-aligned"` after importing alignment against the actual recording.
2. Play the actual-artwork visual test with sound in Studio or render `VINTAGE_VISUAL_TEST`. Do not export another placeholder video for caption review. Correct phrase starts/ends and individual word boundaries in episode JSON. At 30 FPS, one frame is approximately 0.0333 seconds.
3. Watch at normal speed after making corrections. A phrase should appear comfortably with its speech and replace cleanly; one highlighted keyword and word-level emphasis should remain restrained.
4. Check the configured caption position against the real illustration. Caption `position` overrides the scene position; use dark text on light scenes or cream text on dark scenes.
5. Change `captionTiming` to `"reviewed"` only after the listening pass. Changing a status flag is not itself a review.

```bash
npm run validate -- --episode src/data/episodes/my-episode.json
npm run render -- --composition test --episode src/data/episodes/my-episode.json
```

The current pilot remains marked as ASR-aligned. Production validation rejects provisional timings; ASR-aligned data is accepted with a listening-review warning.

## Optional audio and music

The corrected five-second `VINTAGE_VISUAL_TEST` uses only the first actual spoken sentence: a 4.4-second recording clip followed by a picture hold to five seconds. It does not play the next sentence in that test. The full final composition retains the original supplied recording at its original speed.

Where a real-artwork render is intentionally silent, `--silent` excludes both narration and music and can render without the configured audio files. It does not bypass the artwork or visual-test gate. Narration and music are optional episode fields. Removing `voiceover` produces a silent episode when no music is configured. There is no requirement to add music.

For licensed music, add a separate `music` track with the same schema:

```json
"music": {
  "src": "audio/licensed-music.mp3",
  "duration": 24,
  "start": 0,
  "volume": 0.1,
  "fadeIn": 0.6,
  "fadeOut": 1.2
}
```

This is an example, not a supplied music asset. Set its measured duration and timeline placement to fit your episode. Start with a low gain, then listen to the whole mix so every narration word stays clear. Use only audio you have rights to use.
