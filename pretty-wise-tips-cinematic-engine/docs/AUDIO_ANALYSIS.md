# Supplied voiceover analysis

The supplied MP3 is **23.562438 seconds**, mono, 44.1 kHz, nominal 128 kbit/s. A 24-second composition can preserve the original narration speed and leave approximately 0.44 seconds of audio padding at the end.

## Actual transcript

The attached narration differs from the six-sentence reference script in the brief. Use this actual transcript for captions:

| Start | End | Narration |
| --- | --- | --- |
| 0.00 | 3.86 | I enter every room knowing I have something valuable to offer. |
| 4.64 | 6.64 | I speak about my work without apologizing. |
| 7.68 | 10.26 | I ask for opportunities and I prepare for them. |
| 10.80 | 12.82 | A rejection does not change my value. |
| 13.52 | 15.20 | I don't need to chase every offer. |
| 15.78 | 16.96 | I can choose the right ones. |
| 17.82 | 19.92 | My ambition is not something to hide. |
| 20.62 | 22.92 | I'm building the life I used to only imagine. |

The requested finishing affirmation, “I AM BECOMING HER.”, is visual end text; it is not spoken in the supplied audio.

## Alignment provenance and confidence

`src/data/sceneTimings/pilot.words.json` contains 63 actual ASR word timestamps, their model token probabilities, and the eight recognized sentence segments. These are **automatically aligned to the supplied audio, not provisional script estimates**. They remain editable and have not received a human listening pass; word boundaries can differ by several frames, especially around pauses and long words. Model probability is a transcription-confidence signal, not a timing-error estimate. The lowest token confidence is “apologizing.” at 0.596; “and” is 0.752. All other tokens are at least 0.894.

Method: faster-whisper 1.2.1; pretrained `Systran/faster-whisper-base.en`; CPU int8; beam size 5; English language specified; word timestamps enabled; VAD disabled. No initial-prompt script was supplied. The audio was decoded by system FFmpeg to 16 kHz mono signed 16-bit PCM, then passed as a NumPy float32 array to avoid a PyAV 19 API incompatibility. No speed adjustment, trimming, gain processing, or content alteration was applied to the source MP3.

FFmpeg silence detection (`-35dB`, at least 0.15s) found sentence pauses around 4.12–4.60, 7.17–7.66, 10.36–10.79, 13.07–13.53, 15.44–15.82, 17.24–17.80, and 20.15–20.63 seconds. These agree with the ASR segment starts and support scene transition placement.

Source loudness measured with FFmpeg loudnorm analysis: −22.75 LUFS integrated; −4.25 dBTP; loudness range 1.40 LU. These measurements do not mean the source has been normalized.

## Suggested scene ranges

Retain seven scenes and adapt durations to the real narration:

1. Hotel lobby: 0.00–4.55s (heels insert then expression, first sentence).
2. Dressing-room mirror: 4.55–7.60s (second sentence).
3. Meeting room: 7.60–10.75s (third sentence).
4. Accessories: 10.75–13.48s (fourth sentence).
5. Executive desk: 13.48–17.75s (fifth and sixth sentences).
6. Penthouse skyline: 17.75–20.58s (seventh sentence).
7. Final close-up: 20.58–24.00s (eighth sentence then visual finishing affirmation).

At 30fps, round these scene boundaries to whole frames and leave caption word timing in seconds (render at frame precision).

## Delivered timing files

- `src/data/sceneTimings/pilot.words.json`: recognized text and word timestamps with provenance.
- `src/data/episodes/pilot.json`: editable production caption phrases and normalized word fields, plus the unspoken closing title. The long second ASR phrase was split for legibility.

ASR packages and model downloads were used only for this analysis and are not project runtime dependencies. Future recordings can use manually corrected timestamps or an external alignment tool; see `AUDIO_WORKFLOW.md`.
