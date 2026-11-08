# Pretty Wise Tips — character asset specification

Status: **design specification only**. The mandatory principal scene PNGs are listed in `public/required-assets.json`; all seven and all compatible independent layers are currently missing. The airplane-wing reference mentioned in the brief was not attached. No character reference sheet or production character artwork has been supplied or generated. Fidelity to the unavailable reference cannot be claimed. If proceeding from the written brief is authorized, record that original-interpretation basis. Approve the original recurring design after actual artwork is available; do not describe development plates as finished illustrations.

## Original recurring character

An adult woman, approximately 25–30, with warm medium skin, dark chestnut-brown hair, voluminous soft vintage curls and a sculpted front swoop. Preserve her almond-shaped eyes, refined brows, angular yet attractive facial construction, elegant simplified nose, soft red lips, pearl earrings, graceful neck and shoulders. She carries herself with quiet confidence and emotional composure. Wardrobe changes should suit each location while her facial proportions, eye construction and recognizable hair silhouette stay consistent.

The missing reference is an aesthetic guide, not a tracing source. Create an original character; do not reproduce a television frame or an existing character.

## Art direction

Use original raster illustration in a traditional 1990s Western television cel-animation aesthetic: moderately bold clean dark contours, strong silhouette, broad flat colors, one or two restrained cel-shadow tones, limited highlights, painted-looking backgrounds, and slightly muted natural color. Draw in this style from the outset. Optional grain and softness belong in the engine; do not bake heavy VHS effects into artwork. Exclude 3D renders, modern anime, hyperreal skin, glossy gradients, plastic faces, infographic styling and SVG puppet anatomy.

## Master reference package

Save a readable contact sheet to `public/characters/main/reference-sheet.png`. A suggested working canvas is 3200 × 2400 or larger; this is a reference document, not a video layer. Include:

| Panel | Required content |
| --- | --- |
| Turnaround | Front, three-quarter and side profile, with equal head scale and an eye-line guide |
| Expressions | Neutral, confident smile, thoughtful, disappointed, closed eyes |
| Additional replacements | Smirk, confident and surprised expressions using the same head angle |
| Mouth library | Rest, closed, A, E, O, U, M/B/P and F/V, aligned to one mouth anchor |
| Identity notes | Approved palette, hair silhouette, pearl size, facial proportions and contour treatment |

Export expression and mouth sprites separately in addition to the contact sheet. A contact sheet alone is not animation-ready. A frontal sprite must not be used as a replacement on a three-quarter head. Every pose has its own compatible replacement set.

## Raster exports and registration

The final composition is 1080 × 1920, 9:16 at 30 FPS. Use lossless PNG or lossless WebP in sRGB. Export at 1080 × 1920 minimum; 2160 × 3840 is preferable when a camera move needs extra detail. Keep every layer for a shot on the same full-frame canvas, with identical origin, scale and registration. Transparent areas must have clean alpha, without a white or dark matte. Do not stretch an image to change its aspect ratio.

Keep the camera's entire motion envelope painted. For a 1.08× push or a pan, supply overscan/bleed beyond the initial framing. A 10–15% overscan target is a starting point; check the configured maximum travel. Background plates must include plausible painted fill behind removed character, props and foreground objects.

Use a separate pose directory per shot when anatomy or perspective changes. Example asset names below are suggested exports; use the exact paths configured in the episode when integrating:

```text
characters/main/scene-07/
  body.png
  head.png
  hair-back.png
  hair-front.png
  eyebrows-neutral.png
  eyebrows-confident.png
  eyes-open.png
  eyes-half.png
  eyes-closed.png
  mouth-rest.png
  mouth-smile.png
  mouth-a.png
  mouth-e.png
  mouth-o.png
  mouth-u.png
  mouth-mbp.png
  mouth-fv.png
  hand-resting.png
  hand-jewelry.png
  clothing.png
```

Do not bake eyes, eyebrows or mouth into the base head when replacements are enabled, or the original features will show through. Export enough painted skin under replacement regions. Splitting front and back hair allows correct occlusion around the face and shoulders; both must preserve the approved silhouette.

## Rig handoff

For each separable part, record its parent, order, transform origin, neutral transform, bounds and allowed motion in the episode's character/scene configuration. Use full-frame coordinates consistently; convert to the engine's configured coordinate convention during setup. A useful handoff table looks like this:

| Part | Parent and pivot | Limits / required artwork |
| --- | --- | --- |
| Body / shoulders | Scene, near lower torso | A few pixels of breathing; concealed overlap at joins |
| Head | Upper body, base of neck | Small tilt and vertical motion only; neck fill and hair overlap |
| Eyes | Head, same registration as face | Open → half → closed → half → open replacement sprites; short natural blink |
| Brows / expression | Head | Compatible same-pose replacement sprites; no stretching between expressions |
| Mouth | Head | Rest by default; timed replacements only when deliberately enabled |
| Front/back hair | Head or body according to strand attachment | Very small lag/rotation; no exaggerated waving |
| Hands | Arm/forearm or scene | Separate resting, holding, jewelry-adjusting or reaching pose as needed |
| Clothing | Body | Only independent edges intended to move; paint hidden overlap |

For cropped sprites rather than full-frame exports, also provide the sprite rectangle and placement origin. Never mix the two registration methods without explicit metadata. Record pivots after checking the approved scene, not by guessing from a generic skeleton.

Optional masks must share the scene canvas and be exported separately. Supply occluders for a hand passing behind a desk, jewelry under a sleeve, or a head behind front hair. Match every prop's line weight, perspective and lighting to its shot.

## Performance rules

- A flattened illustration supports camera motion, grading, captions, overlays and separately supplied particles. It does **not** support independent blinking, walking, speaking, gestures or hair motion.
- A head sprite supports small tilt; a convincing head turn requires separately drawn poses or an authored pose sequence. Do not warp a flattened face to invent a turn.
- A walking entrance, straightening posture, choosing jewelry and putting it on require drawings for the relevant actions, not merely isolated body parts. Supply keyed pose sequences or approved in-between drawings when those actions must actually occur.
- Keep narration as voiceover. Mouth movement is off unless an episode explicitly provides mouth cues and compatible shapes.
- Blink intervals and expressions are editable per scene. Avoid simultaneous mechanical movement of all layers.

## Acceptance checks before production

Compare a contact sheet of all seven shots. Check face proportions, eye angle and spacing, front swoop, curl silhouette, skin palette, pearls and contour weight. Preview every replacement over its base at 100% scale. Scrub blink frames and movement extremes for gaps, doubled features, exposed cut edges and occlusion mistakes. Confirm captions leave the face and essential action clear. Production visual review remains pending until the artwork is supplied.

When registered facial replacement sprites are present, animate the head through `rig.headKeyframes` and `rig.headPivot`. The validator rejects independent head-part keyframes or motion in that case, keeping eyes, brows and mouth attached to the painted head. Hair may retain restrained local secondary motion.
