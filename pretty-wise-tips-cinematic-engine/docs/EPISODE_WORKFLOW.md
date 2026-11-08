# Creating and finishing episodes

The engine accepts an `Episode` object from JSON. The source contract is [`../src/types.ts`](../src/types.ts). Editing episode data changes the film without rebuilding the components.

## Current pilot and its limits

`src/data/episodes/pilot.json` contains the supplied 23.562438-second narration inside a 24-second composition. The seven scenes were retimed around actual narration pauses. Their frame boundaries at 30 FPS are **0, 137, 228, 323, 404, 533, 617, 720**:

| Scene | Frame range, end exclusive | Seconds |
| --- | --- | --- |
| Hotel lobby | 0–137 | 0.000–4.567 |
| Dressing-room mirror | 137–228 | 4.567–7.600 |
| Meeting room | 228–323 | 7.600–10.767 |
| Jewelry/accessories | 323–404 | 10.767–13.467 |
| Executive desk | 404–533 | 13.467–17.767 |
| Penthouse skyline | 533–617 | 17.767–20.567 |
| Confident close-up | 617–720 | 20.567–24.000 |

All production illustrations are missing. Current `development` plates are explicitly labeled. The illustrated character sheet is also pending: the repository includes its specification, not an invented claim of a completed reference sheet. Character consistency, anatomy and the final 1990s aesthetic cannot be approved until real art is supplied.

## Create a new episode

1. Copy `src/data/episodes/pilot.json` to `src/data/episodes/my-episode.json`.
2. Set `id`, `title`, `width`, `height`, `fps` and `duration`. For this series, keep 1080 × 1920 and 30 FPS unless intentionally making another format.
3. Define an ordered, gap-free scene sequence. `start` and `duration` use episode seconds; keep boundaries on whole frames. Set a stable `id` for every scene.
4. Add real artwork under `public/`. Asset paths in JSON are relative to that directory, such as `scenes/scene-01/background.png`; do not include the `public/` prefix.
5. Select `mode`, camera keyframes, transition, optional layers/rig and scene caption position. Keep a valid `development` object while the episode is in development.
6. Add narration and caption data using [AUDIO_WORKFLOW.md](AUDIO_WORKFLOW.md). Before alignment, use `captionTiming: "provisional"`. Importing an MP3 alone does not align words.
7. Render the custom JSON, inspect the result, correct data and repeat as needed.

```bash
npm run render -- --episode src/data/episodes/my-episode.json --out renders/my-episode-development.mp4
npm run render -- --episode src/data/episodes/my-episode.json --silent --out renders/my-episode-silent.mp4
npm run still -- --episode src/data/episodes/my-episode.json --frame 300 --out renders/my-episode-check.png
```

The Studio's default compositions use the bundled pilot. Custom episode JSON can be rendered directly through `--episode`; it does not require changing the animation components. `npm run build` creates a Remotion bundle for rendering; it does not publish a website.

## Flattened illustration mode

Set a scene's `mode` to `flattened` and its `image` to the approved illustration. A minimal scene looks like this:

```json
{
  "id": "scene-01",
  "title": "Hotel lobby",
  "start": 0,
  "duration": 4,
  "mode": "flattened",
  "image": "scenes/scene-01/background.png",
  "camera": [
    {"time": 0, "x": 0, "y": 0, "scale": 1.04},
    {"time": 4, "x": 8, "y": -6, "scale": 1.09, "ease": "ease-in-out"}
  ],
  "transition": {"type": "cut", "duration": 0},
  "captionPosition": {"top": 1260, "left": 90, "width": 810},
  "development": {
    "src": "development/scene-01.png",
    "description": "Hotel lobby illustration pending",
    "palette": ["#241e2c", "#6c536c", "#cbb69f"]
  }
}
```

This example is a scene fragment to place in `scenes`, not a complete episode. Use correct durations for its surrounding timeline. Images preserve their aspect ratio; the default full-frame fit crops to fill rather than stretching. Supply sufficient painted coverage for the entire camera move and check camera extremes for exposed edges.

For the pilot's optional opening close-up, add an actual `scenes/scene-01/heels.png` file and configure:

```json
"insert": {"src": "scenes/scene-01/heels.png", "duration": 0.9}
```

The insert appears first, then cuts to the main scene image. A still insert does not perform a footfall. Walking, posture changes and selecting jewelry require authored action drawings when those actions must actually occur.

## Camera and layer keyframes

`camera` is an array of `MotionKeyframe` objects. Each has scene-relative `time`, plus optional `x`, `y`, `scale`, `rotation`, `opacity` and `ease`. Translation and pivots use composition pixels; rotation uses degrees. Scale is a multiplier. Easing can be `linear`, `ease-in-out` or `ease-out`; the destination keyframe sets the segment easing. Unspecified values inherit from the previous keyframe, and a track holds before its first and after its last keyframe.

Use small changes for a push-in, reverse the scale values for a pullback, and alter x/y for horizontal/vertical pans. Reframe by cropping and camera placement; do not distort a face to invent a head turn. Avoid rotational moves except restrained authored tilts.

A scene transition is `cut` or `dissolve`, with duration in seconds. Keep dissolves short and inspect scene boundaries; a transition does not extend the episode's configured duration. The particle system is for restrained auxiliary light particles. Primary objects such as jewelry or papers require real illustrated raster assets.

## Layered illustration mode

Set `mode: "layered"` only when suitable independent assets exist. All rasters in one shot must share the same full-frame registration. The example below shows the supported shape of a layered scene. Every path is illustrative and must be supplied before rendering; the current pilot does not contain this rig.

```json
{
  "id": "scene-07",
  "title": "Confident close-up",
  "start": 20,
  "duration": 4,
  "mode": "layered",
  "image": "scenes/scene-07/background-clean.png",
  "layers": [
    {
      "id": "window-light",
      "src": "scenes/scene-07/window-light.png",
      "depth": 0.15,
      "fit": "contain",
      "keyframes": [{"time": 0, "opacity": 0.8}, {"time": 4, "opacity": 0.9}]
    },
    {
      "id": "foreground-frame",
      "src": "scenes/scene-07/foreground.png",
      "plane": "foreground",
      "depth": 0.25,
      "fit": "contain"
    }
  ],
  "character": {
    "parts": [
      {
        "id": "body",
        "src": "characters/main/scene-07/body.png",
        "role": "body",
        "fit": "contain",
        "motion": {"type": "breathing", "amplitude": 1.5, "period": 4}
      },
      {"id": "hair-back", "src": "characters/main/scene-07/hair-back.png", "role": "hair", "fit": "contain"},
      {"id": "head", "src": "characters/main/scene-07/head.png", "role": "head", "fit": "contain"},
      {
        "id": "hair-front",
        "src": "characters/main/scene-07/hair-front.png",
        "role": "hair",
        "fit": "contain",
        "pivot": [540, 570],
        "motion": {"type": "sway", "amplitude": 0.2, "period": 4.6}
      }
    ],
    "headPivot": [540, 900],
    "headKeyframes": [{"time": 0, "rotation": 0}, {"time": 4, "rotation": -0.5, "ease": "ease-in-out"}],
    "expressions": {
      "neutral": "characters/main/scene-07/expression-neutral.png",
      "smile": "characters/main/scene-07/expression-smile.png"
    },
    "expressionCues": [{"time": 0, "expression": "neutral"}, {"time": 2.3, "expression": "smile"}],
    "eyes": {
      "open": "characters/main/scene-07/eyes-open.png",
      "half": "characters/main/scene-07/eyes-half.png",
      "closed": "characters/main/scene-07/eyes-closed.png",
      "blinkTimes": [1.15],
      "duration": 0.18
    }
  },
  "camera": [{"time": 0, "scale": 1.04}, {"time": 4, "scale": 1.07, "ease": "ease-in-out"}],
  "transition": {"type": "dissolve", "duration": 0.25},
  "captionPosition": {"top": 1260, "left": 90, "width": 810},
  "development": {
    "src": "development/scene-07.png",
    "description": "Layered portrait rig pending",
    "palette": ["#2b2135", "#715577", "#d7bfd5"]
  }
}
```

The scene image draws first, then layers with `plane: "background"` (the default), then the character rig, then layers with `plane: "foreground"`. Each plane preserves array order. Use a registered foreground layer for an illustrated curtain, doorframe or other element that should occlude the character. Character parts use array order for their stack. `head` and `hair` parts share the head track; other roles use their own tracks. Expression, eye and optional mouth replacements sit over the clean face. Avoid double-drawing features: a blink replacement requires base artwork without baked-in open eyes. All expression and mouth sprites must match the head's pose. `Layer.depth` adds a proportion of the camera's translation to the layer's own movement; use it only on independent depth layers with adequate painted overlap.

For optional future mouth animation, add `mouths` as a shape-name-to-file map and `mouthCues` as explicit `{ "time": 1.2, "shape": "a" }` entries. Add a rest cue when the mouth should settle. No mouth shapes or cues are enabled for the pilot's voiceover. This engine does not infer lip sync from audio.

See [CHARACTER_SPEC.md](CHARACTER_SPEC.md) for exact export requirements, pose libraries and restrained performance direction.

## Captions, film and optional audio

Captions and word timestamps use **absolute episode seconds**, so phrases remain continuous across cuts. Camera tracks, character cues and blink times use **scene-relative seconds**. Keep phrases short enough to fit two lines. Choose a caption-level `position` to override a scene's `captionPosition`; use `color: "cream"` over darker scenes or `"dark"` over lighter scenes. The caption component constrains its box to the configured Instagram-safe region. Confirm it avoids faces and key action in the actual illustration.

`film.enabled` switches texture on/off. `grain`, `softness`, `muted`, `colorBleed` and `vignette` tune the optional treatment. Keep these subtle; they cannot turn artwork in the wrong style into traditional cel animation. Optional `music` uses the same `AudioTrack` shape as `voiceover`: `src`, `duration`, optional episode `start`, `volume`, `fadeIn`, `fadeOut`. Use licensed music and keep narration clear.

## Production handoff

The renderer's production checks require production status and actual configured artwork. For flattened scenes, set every `scene.image` to its real file; layered scenes must have their configured real background/layers/rig files. All referenced assets must exist. Set `artworkStatus` to `production` only after those assets are approved. Keep the image inventory accurate; changing a manifest status does not create missing artwork.

```bash
npm run typecheck
npm test
npm run validate
npm run build
npm run render:production -- --episode src/data/episodes/my-episode.json --out renders/my-episode-final.mp4
```

Inspect rendered stills at scene boundaries and movement extremes, then watch the entire video with sound. Review caption timing manually before changing `captionTiming` to `reviewed`. Verify identity, anatomy, true cel-style artwork, readable captions, intended audio level, 1080 × 1920 dimensions, 30 FPS, full painted frame coverage and a satisfying final caption. The code can validate configuration and files; artistic approval remains a visual task.
