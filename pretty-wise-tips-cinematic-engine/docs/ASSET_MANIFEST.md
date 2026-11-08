# Mandatory cinematic artwork handoff

Episode: **I'm Not Waiting to Be Chosen**. Final format: 24 seconds, 1080 × 1920, 30 FPS.

The correction requires seven finished illustrations in the exact slots below. The attached MP3 and written briefs are available. The airplane-wing image, actual scene illustrations, master character sheet and compatible independent animation layers are **missing**. Do not fill missing slots with scene-description cards, numbers, filename labels, blank colors or presentation graphics.

Machine-readable inputs: [`../public/required-assets.json`](../public/required-assets.json). The fuller status inventory is [`../public/asset-manifest.json`](../public/asset-manifest.json). Inventory paths are relative to `public/`.

| Mandatory file | Required completed illustration |
| --- | --- |
| `public/scenes/01_hotel_lobby.png` | An original glamorous adult brunette arriving in an elegant hotel lobby. Painted architecture, polished stone, restrained brass and warm lighting; calm face, expressive eyes, chestnut curls and sculpted front swoop clearly readable. Compose for a first-scene visual test with caption space below the face. |
| `public/scenes/02_dressing_room.png` | The same original woman in a beautiful dressing room at a large mirror, with upright posture and quiet self-regard. Her reflection, wardrobe and light must agree. Preserve the face proportions and recognizable hair silhouette. |
| `public/scenes/03_meeting_room.png` | The same woman entering an upscale meeting room, in sophisticated tailored clothing. Composed expression, believable room perspective and a strong elegant silhouette. A still can imply an entrance; actual walking needs authored action drawings. |
| `public/scenes/04_jewelry_detail.png` | A cinematic close-up of refined jewelry and luxurious accessories on a dressing table, with a graceful hand if appropriate. Draw actual objects with coherent lighting and perspective, and keep caption space away from the selected detail. |
| `public/scenes/05_executive_desk.png` | The same woman seated at an executive desk, reviewing original plans/documents. Determined but calm expression, believable anatomy and composition suited to a subtle push toward her face. Avoid accidental generated text on documents. |
| `public/scenes/06_penthouse.png` | The same woman at a tall penthouse window overlooking an elegant skyline at dusk. Painted city and interior, restrained luxury and soft curtains. Independent breeze motion requires separate curtain and hair artwork. |
| `public/scenes/07_final_portrait.png` | A satisfying confident close-up of the same woman with a subtle smile, almond eyes, pearls, soft red lips and the established chestnut front swoop. Leave clear space below the face for “I AM BECOMING HER.” |

## Shared art requirements

Each mandatory PNG is a **fully illustrated cinematic shot**, not a contact sheet or a character cutout on empty color. Use portrait 9:16 framing at 1080 × 1920 minimum; 2160 × 3840 is preferable when camera cropping needs more detail. Export in sRGB, with complete frame coverage and painted bleed for the entire camera move. No baked-in captions, watermarks, interface guides, asset names or development instructions.

Use the same original adult female lead throughout: warm medium skin, chestnut vintage curls, sculpted front swoop, almond-shaped eyes, refined brows, elegant simplified nose, soft red lipstick, pearls and composed posture. Maintain face proportions, hair silhouette, palette and contour treatment across scenes.

The artwork itself must use traditional 1990s Western television cel-animation construction: clean moderately bold dark outlines; angular yet attractive anatomy; broad restrained flat colors; one or two cel-shadow tones; limited highlights and painted-looking backgrounds. Exclude modern vector infographic characters, 3D renders, glossy hyper-detailed faces and modern anime styling. Optional softness and grain are finishing effects, not a replacement for suitable art.

The airplane-wing reference named in the brief is unavailable. Do not claim it was examined or that generated art matches it. If proceeding from the written brief is authorized, document that review basis explicitly and treat the result as an original written-brief interpretation.

## Five-second visual gate

Only the first completed image is needed to begin `VINTAGE_VISUAL_TEST`. It must render a real illustrated woman and cinematic lobby, subtle camera movement and professional captions with no development labels. If compatible independent layers exist, include at least one genuine independent movement; if the image is flat, do not invent one.

The test is five seconds at 30 FPS and exports `renders/pretty-wise-tips-vintage-test.mp4`. Inspect the actual PNG and rendered MP4 before recording a review. `config/visual-test-review.json` must bind approval to the current first-scene image and test-video SHA-256. A changed image/video invalidates that approval. A receipt does not prove resemblance to a reference that was never supplied.

All seven images and a current visual-test review are prerequisites for `CINEMATIC_PILOT_FINAL`, which exports `renders/pretty-wise-tips-cinematic-pilot-final.mp4`. The final route must reject missing images by name and must never substitute development graphics.

## Optional independent layers

The mandatory seven files are flattened scene illustrations. They permit aspect-ratio-safe framing, zoom/pan, transitions, grading, subtle texture, captions and separately supplied overlays. They do not provide independent blinking, speaking, walking, head turning, hair motion or gestures.

For layered mode, separately supply clean painted backgrounds, registered transparent character parts, eye and expression replacements, props and foreground occluders appropriate to each shot. No compatible independent layers are currently present. Configure only paths that really exist; do not reuse unrelated older characters as substitutes for this lead.

| Shot | Additional artwork needed for real action |
| --- | --- |
| Lobby | Authored heel/contact and entrance poses; clean lobby plate and matching floor reflection |
| Mirror | Same-angle eye/head sprites, posture poses and matching reflection treatment |
| Meeting room | Authored walk/settle drawings and foreground doorway/table occluders |
| Jewelry | Separate jewelry, resting/reaching/holding hand drawings and overlap/occlusion artwork |
| Desk | Character rig, clean desk background, independently drawn documents and hand poses |
| Penthouse | Registered skyline/interior depth layers, separate curtain and hair pieces |
| Final portrait | Compatible head/body/hair parts, open/half/closed eyes and neutral/smile replacements |

Keep all parts in a shot on one identically registered full-frame canvas. Supply clean painted fill under removed features. Set scene-layer `plane: "foreground"` for actual foreground elements that must occlude the character; background is the default. See [CHARACTER_SPEC.md](CHARACTER_SPEC.md) for detailed layer and pose conventions.

## Acceptance

Check all seven images together for identity and art-style consistency. Inspect anatomy, reflections, object perspective, line quality, missing painted areas, camera extremes and caption clearance. File validation can check presence, format, dimensions and configuration; aesthetic approval requires looking at the artwork and rendered motion. A valid filename alone is not a completed illustration.
