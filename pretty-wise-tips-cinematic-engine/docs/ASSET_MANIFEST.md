# Pretty Wise Tips — pilot asset handoff

Episode: **I'm Not Waiting to Be Chosen**. Target: 24 seconds, 1080 × 1920, 30 FPS. The supplied ElevenLabs MP3 is approximately 23.562 seconds. The original scene windows below are editable planning ranges; use the measured narration and editable caption data when finalizing the cut.

## What is available

The supplied narration and project brief are available. The airplane-wing reference, master character sheet, all seven scene illustrations and all independent character/prop layers are **missing**. The engine's marked development plates are layout/timing aids. They are not cinematic artwork and do not demonstrate a finished character performance.

The machine-readable inventory is [`../public/asset-manifest.json`](../public/asset-manifest.json). Paths in the inventory are relative to `public/`. Supplied audio is listed separately from missing artwork. The manifest distinguishes minimum flattened artwork from optional rig layers; an optional layer becomes required when an episode enables that feature.

## Minimum artwork for a camera-motion pilot

Supply one approved full-frame PNG/WebP for every scene. The filenames below are the intended replacement slots; confirm them against the episode configuration before import. Flattened scenes permit pans, zooms, reframing, scene transitions, lighting treatment, grain, captions and separately added overlays. They do not create walking, blinking, head turns or gestures.

| Scene / initial window | Required flattened slot | Illustration brief and composition |
| --- | --- | --- |
| 01 · 0–3 s | `scenes/scene-01/background.png` | Elegant hotel lobby with polished stone floor, warm lamps, refined brass details and the recurring brunette's composed expression. Frame her face above the caption region. Optional `heels.png` gives the requested opening floor/heel close-up before the portrait cut. |
| 02 · 3–6 s | `scenes/scene-02/background.png` | Beautiful dressing room, large mirror, restrained luxurious dressing table; brunette with calm self-regard and upright posture. Reflection must match her pose, costume and light. Leave a readable lower-middle caption region. |
| 03 · 6–9 s | `scenes/scene-03/background.png` | Upscale meeting room entrance, purposeful composition, elegant tailored outfit and composed expression. Implied movement in a still is acceptable for flattened mode; actual walking needs an authored action sequence. |
| 04 · 9–12 s | `scenes/scene-04/background.png` | Close-up of a dressing table with pearl/gold jewelry and refined accessories. Use beautiful illustrated objects with matching perspective. Reserve caption space away from the selected accessory and hand. |
| 05 · 12–16 s | `scenes/scene-05/background.png` | Executive desk, considered plans/documents, brunette seated and focused. Compose a slow push toward her determined expression without cropping the eyes. Documents should be original, free of accidental generated text or sensitive data. |
| 06 · 16–20 s | `scenes/scene-06/background.png` | Luxurious penthouse overlooking a beautiful city skyline; brunette by a tall window, soft curtains and restrained evening light. Separate curtains and hair are needed for real breeze movement. |
| 07 · 20–24 s | `scenes/scene-07/background.png` | Emotionally satisfying confident close-up, subtle smile, calm eyes, pearl earrings and the approved hair swoop. Compose for the final “I AM BECOMING HER.” caption below the face. |

Every scene must use the same original character and traditional 1990s Western cel-animation style. Painted backgrounds, restrained flat-color characters and clean contours are the foundation; a texture filter cannot correct artwork in the wrong style.

### Opening heel insert

The first scene requests a heel close-up followed by her confident expression. Supply `scenes/scene-01/heels.png` as a separately composed, full-frame portrait insert. It may show a drawn mid-step, but a single still will not perform a step. To show an actual footfall, provide an approved short pose sequence with planted-foot contact frames and correct floor reflection. The insert is optional for the minimal seven-image camera test and required to fulfill that exact opening shot.

## Layered mode handoff

Each scene may replace its flattened illustration with a clean background plate plus aligned independent layers. The clean plate uses `background-clean.png`; foreground uses `foreground.png`; the character may use `character.png` for a single separable figure or a rig directory under `characters/main/scene-XX/`. Add only layers that actually exist. Set `plane: "foreground"` on a scene layer that must draw in front of the character; other scene layers default to the background plane. Preserve registration and painted overlap for correct occlusion. Do not turn a flattened face into a rig through CSS deformation.

| Scene | Useful independent assets | What they enable |
| --- | --- | --- |
| 01 | Clean lobby plate, foreground floor/doorframe, character, heel contact poses | Genuine depth/parallax; authored entrance/step sequence |
| 02 | Clean dressing room, character, matching reflection, head/eyes sprites, posture poses | Blinks and restrained head movement; posture change only with suitable drawings |
| 03 | Clean meeting room, foreground doorframe/table, character walk/settle pose sequence | Parallax and actual walking/settling performance |
| 04 | Clean dressing table, illustrated jewelry prop, resting/reaching/holding hand poses, occlusion masks | Picking up and adjusting an accessory when fully authored |
| 05 | Clean office/desk, character rig, foreground documents, paper prop, hand poses | Breathing, blink, subtle head move; independent document/hand movement |
| 06 | Clean penthouse, skyline/background layers, character rig, separate curtains and hair | Layered parallax and slight breeze motion without moving the entire room |
| 07 | Portrait background, head/body/hair rig, open/half/closed eyes, neutral/smile expression | Restrained blink, head tilt and deliberate expression replacement |

For rig exports, registration, pivots, expression sets and optional mouth shapes, see [`CHARACTER_SPEC.md`](CHARACTER_SPEC.md). Use artwork matching the same head angle for each scene. Do not reuse incompatible expressions just because their filenames match.

## Export contract

- PNG or lossless WebP, sRGB. Principal artwork must be raster illustration; SVG is reserved for auxiliary graphics.
- Deliver portrait art at 1080 × 1920 minimum; ideally 2160 × 3840 with sufficient painted bleed for each camera move.
- Use identical full-frame canvas dimensions and origin for every layer in a scene. Preserve alpha on independent layers.
- Provide a clean painted background behind any removed character, curtain or prop. Avoid transparent holes and duplicate features.
- Do not bake captions, brand text, film grain or interface-safe-area guides into illustration exports.
- Place eyes and important gestures outside the configured caption bounds. Keep essential information clear of Instagram's interface areas; confirm in the current platform preview before publishing.
- Keep artwork review separate from engine validation: code checks can detect missing files and invalid configuration; a person must approve identity, anatomy, perspective and the requested aesthetic.

## Replacing development assets

1. Copy approved art into its configured `public/` slot. Keep dimensions and file extensions aligned with the episode configuration.
2. Set each scene to flattened or layered mode according to the artwork actually supplied. Configure optional layers, pivots, camera motion and caption positions in episode data.
3. Remove development-placeholder flags only after real artwork is present. Update the manifest's `status` to `supplied` and include provenance/approval notes; a manifest status does not create a file.
4. Run the project's asset validation and render checks. Missing configured files must stop production rendering instead of silently falling back.
5. Inspect stills at scene boundaries, the entire caption track, movement extremes and the final frame. Render the cinematic pilot only after the artwork and caption timing are approved.

## Unfulfilled visual deliverables

The original character reference sheet, approved character identity and finished seven-scene cinematic pilot depend on missing artwork. The functioning engine and any labeled development preview are valid technical deliverables, but they must not be presented as the completed visual production.
