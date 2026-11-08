# Image-first episode workflow

Episode JSON configures the reusable engine. The source contract is [`../src/types.ts`](../src/types.ts); pilot data lives in `src/data/episodes/pilot.json`. Production now follows an image-first visual gate, not a storyboard export.

## Production sequence

1. Create or supply the first completed illustration at `public/scenes/01_hotel_lobby.png`. It must show a real vintage-style adult female character in a fully painted cinematic lobby. Check the artwork itself, not only its filename.
2. Render `VINTAGE_VISUAL_TEST` with `npm run render -- --composition test`. The output is `renders/pretty-wise-tips-vintage-test.mp4`: five seconds, 150 frames, 1080 × 1920 at 30 FPS. The first actual narration sentence is used in a 4.4-second audio clip, with a picture hold to five seconds.
3. Review the actual image and rendered test for mature character design, consistent cel-style drawing, face/hair construction, environment, framing, subtle camera movement and readable captions. If matching independent layers exist, verify genuine restrained movement; flat artwork supports camera motion only.
4. Record the completed review in `config/visual-test-review.json` using the validator's required schema and the current first-scene artwork and video SHA-256. Do not invent an approval or reuse one after changing the reviewed files.
5. Supply all seven mandatory completed PNGs named in [ASSET_MANIFEST.md](ASSET_MANIFEST.md). Review character identity and series art direction across them.
6. Validate the final episode and render with `npm run render -- --composition final`. The output is `renders/pretty-wise-tips-cinematic-pilot-final.mp4`, 24 seconds at 1080 × 1920 and 30 FPS.

`npm run render` defaults to final production. It must fail when required artwork or a current visual-test review is missing. The final path never falls back to cards, descriptions, numbers or blank-color artwork. `DEVELOPMENT_PREVIEW` is separately named for internal inspection; no additional placeholder video is part of this correction.

The airplane-wing reference is unavailable. Reference fidelity cannot be verified until it is supplied. When proceeding from the written brief is authorized, the review must state that basis; it must not assert a match to an unseen image.

## Required image slots

```text
scenes/01_hotel_lobby.png
scenes/02_dressing_room.png
scenes/03_meeting_room.png
scenes/04_jewelry_detail.png
scenes/05_executive_desk.png
scenes/06_penthouse.png
scenes/07_final_portrait.png
```

Paths in episode JSON are relative to `public/`. Use fully illustrated portrait shots at 1080 × 1920 minimum, with no embedded caption or watermark. Keep one original recurring character with the same face, eye construction, hair swoop/silhouette, skin palette, pearls and mature elegant proportions. Traditional line drawing, flat color and cel shadows must come from the art itself.

## Timeline and captions

The pilot preserves the supplied 23.562438-second recording at its original speed. Seven scene boundaries at 30 FPS are **0, 137, 228, 323, 404, 533, 617, 720**:

| Scene | End-exclusive frame range | Seconds |
| --- | --- | --- |
| Hotel lobby | 0–137 | 0.000–4.567 |
| Dressing-room mirror | 137–228 | 4.567–7.600 |
| Meeting room | 228–323 | 7.600–10.767 |
| Jewelry detail | 323–404 | 10.767–13.467 |
| Executive desk | 404–533 | 13.467–17.767 |
| Penthouse | 533–617 | 17.767–20.567 |
| Final portrait | 617–720 | 20.567–24.000 |

`Scene.start` and `duration` are episode seconds. Keep scenes contiguous and put boundaries on whole frames. Camera keyframes, character cues and blink times use scene-relative seconds. Caption and word boundaries use absolute episode seconds, so they stay aligned across cuts.

The full pilot has 16 short narration phrases and the unspoken closing affirmation at 23–24 seconds. The five-second test uses only the opening phrases. Captions remain editable; ASR alignment has not been claimed as a human listening review. See [AUDIO_WORKFLOW.md](AUDIO_WORKFLOW.md).

Place captions below faces and clear of important objects. Caption-level `position` overrides `Scene.captionPosition`; coordinates use composition pixels. Choose `color: "cream"` on dark scenes or `"dark"` on light scenes. Keep two-line phrases short enough to fit; inspect actual text in the rendered image.

## Flattened artwork mode

Set each scene's `mode` to `flattened` and `image` to its exact mandatory slot. For example, the first scene uses:

```json
{
  "mode": "flattened",
  "image": "scenes/01_hotel_lobby.png",
  "camera": [
    {"time": 0, "x": 0, "y": 0, "scale": 1.04},
    {"time": 4.5666666667, "x": 8, "y": -6, "scale": 1.09, "ease": "ease-in-out"}
  ]
}
```

This is a fragment of an existing scene object, not a complete episode. A flattened image supports aspect-ratio-safe framing, zoom, pan, reframing, transitions, global lighting, subtle grain, captions and independent overlays that are separately supplied. It does not independently blink, speak, walk, gesture, turn its head or move its hair. Do not warp a face to simulate acting.

Camera keyframes accept `time`, `x`, `y`, `scale`, `rotation`, `opacity` and `ease`. Translation uses composition pixels, rotation uses degrees, and scale is a multiplier. Available easing is `linear`, `ease-in-out` and `ease-out`; the destination keyframe selects easing for its segment. Unspecified values inherit their previous value, and the track holds outside its first/last keyframe. Use restrained moves and sufficient painted bleed; do not stretch the artwork to fill the frame.

Scene transitions support cuts or short dissolves with duration in seconds. The particle system is for auxiliary light particles. Jewelry, banknotes, documents and other primary objects require actual illustrated assets rather than geometric placeholders.

## Optional layered mode

No compatible independent character layers are currently supplied. Once available, retain the required principal scene illustrations and configure clean registered layers appropriate to the shot. A rig does not arise from a flattened PNG merely because the scene mode changes.

Every independent part and replacement sprite must use the same full-frame canvas, origin and scale. The scene image draws first; background-plane layers follow, then the character, then layers with `plane: "foreground"`. Each plane retains array order. Use sufficient painted overlap and clean fill behind removed parts. All sprites must match the exact head angle.

A character rig fragment may look like this **after those assets exist**:

```json
{
  "parts": [
    {"id": "body", "src": "characters/main/scene-07/body.png", "role": "body", "fit": "contain"},
    {"id": "head", "src": "characters/main/scene-07/head.png", "role": "head", "fit": "contain"},
    {"id": "hair", "src": "characters/main/scene-07/hair-front.png", "role": "hair", "fit": "contain", "pivot": [540, 570], "motion": {"type": "sway", "amplitude": 0.2, "period": 4.6}}
  ],
  "headPivot": [540, 900],
  "headKeyframes": [{"time": 0, "rotation": 0}, {"time": 3, "rotation": -0.5, "ease": "ease-in-out"}],
  "eyes": {
    "open": "characters/main/scene-07/eyes-open.png",
    "half": "characters/main/scene-07/eyes-half.png",
    "closed": "characters/main/scene-07/eyes-closed.png",
    "blinkTimes": [1.15],
    "duration": 0.18
  },
  "expressions": {
    "neutral": "characters/main/scene-07/expression-neutral.png",
    "smile": "characters/main/scene-07/expression-smile.png"
  },
  "expressionCues": [{"time": 0, "expression": "neutral"}, {"time": 2.3, "expression": "smile"}]
}
```

This is an asset contract example, not a supplied rig or a performed animation. `head`/`hair` parts share the head track. Body/shoulder/hand/clothing parts can have restrained explicit keyframes or supported breathing/sway motion. Transparent replacement eyes and expressions must not double up features already baked into the base face. Optional `mouths` maps shape names to raster files; `mouthCues` explicitly selects those names over time. Voiceover does not automatically enable mouth movement.

A convincing head turn, walking entrance, footfall, posture change or putting on jewelry requires appropriately drawn poses/action frames. A small head tilt is not a large head turn. See [CHARACTER_SPEC.md](CHARACTER_SPEC.md) for the illustrated reference and export handoff.

## Reuse and final review

Copy episode JSON for a future film and change the title, timing, artwork, camera tracks, captions and audio. The `--episode` argument selects a different data file without changing the engine components. The current pilot's final gate enforces its seven exact image slots and reviewed first-scene test; preserve that contract for this pilot rather than bypassing it while drafting a future episode.

Run type checks, unit/render checks and the build after configuration changes. Inspect the actual test before recording review, then watch the whole final export with sound after rendering. File presence and format validation cannot approve identity, anatomy or aesthetic fidelity. Changing status metadata cannot turn a card into an illustration.
