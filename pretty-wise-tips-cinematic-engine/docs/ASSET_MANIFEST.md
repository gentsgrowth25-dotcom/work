# Native 4:5 cinematic shot manifest

Master: **1080 × 1350, 4:5, 30 FPS, 716 frames / 23.866667 seconds**. The supplied 23.562438-second narration remains unchanged in speed and content, followed by a short 0.304-second tail.

The canonical red-dress character reference is available **inline in the conversation**, without a filesystem attachment path. Its actual visible design overrides textual approximations. The voice source resolves to the newly supplied MP3 and matches the bundled audio SHA-256. No motion-reference video or alternate kitchen image is asserted as supplied.

All fourteen complete native 4:5 drawings are now available at 1122 × 1402 and were visually reviewed together. [`../public/required-assets.json`](../public/required-assets.json) lists their current statuses and exact paths; [`../public/art-prompts-4x5.json`](../public/art-prompts-4x5.json) contains detailed generation/art-direction prompts. Each file now has its actual dimensions, SHA-256 and review status recorded. The prompt manifest is retained as production provenance and a future-episode handoff.

| Group / shot | Mandatory PNG under `public/` | Authored content |
| --- | --- | --- |
| Mirror · 01A | `scenes/4x5/01A_pearls_detail.png` | Poised caramel-brown hand lightly touching short pearl necklace, crimson long sleeve and pearl bracelet; warm walnut/ivory dressing-room detail. A held drawing, not an independently moving hand. |
| Mirror · 01B | `scenes/4x5/01B_dressing_room.png` | Same woman and costume in a gilded mirror composition, coherent reflection, composed face and sculpted forelock; ivory paneling, walnut table, burgundy chaise and peach sunlight. |
| Kitchen · 02A | `scenes/4x5/02A_kitchen.png` | Same heroine at an olive-sage vintage kitchen island with brass fixtures, cream diamond backsplash, porcelain, lilies, croissants and garden window. |
| Kitchen · 02B | `scenes/4x5/02B_teacup_detail.png` | Anatomically coherent hand holding a floral porcelain cup over marble; crimson sleeve/pearl bracelet; restrained painted brass and olive cabinetry behind. Any drawn steam remains part of a still unless separately supplied. |
| Street · 03A | `scenes/4x5/03A_city_street.png` | Same woman in a deliberate street pose among coherent cream-stone and brick façades, green awnings, iron balconies, flower vendor and dark maroon sedan. |
| Street · 03B | `scenes/4x5/03B_boutique_glance.png` | Matching face/forelock in a closer boutique-window glance; consistent red dress and pearls, painted buildings/reflections with correct perspective. |
| Jewelry · 04A | `scenes/4x5/04A_jewelry_detail.png` | Graceful hand beside an open walnut/ruby-velvet jewelry box and pearl brooch; correct fingers, crimson sleeve and pearl bracelet. |
| Jewelry · 04B | `scenes/4x5/04B_jewel_boutique.png` | Same heroine's thoughtful confident face inside a warm walnut jewel boutique, brass-framed cabinets, velvet trays and an ivory arched niche. |
| Office · 05A | `scenes/4x5/05A_signing_detail.png` | Over-shoulder held signing pose: correct hand/fountain pen/document geometry at a mahogany desk, burgundy pen, cream folders and brass corners. |
| Office · 05B | `scenes/4x5/05B_executive_office.png` | Same woman holding a folder near tall windows in a refined office; classical skyline, terracotta roofs, legal books, olive lamp and cream calla lilies. |
| Balcony · 06A | `scenes/4x5/06A_balcony_wide.png` | Same heroine at the right third of a grand limestone balcony; white roses, lanterns, wicker chairs, river and golden-hour city. |
| Balcony · 06B | `scenes/4x5/06B_balcony_profile.png` | Matching side/three-quarter profile at the rail, poised chin and recognizable long waves; rose-gold/violet skyline with restrained flat shadows. |
| Portrait · 07A | `scenes/4x5/07A_hero_portrait.png` | Large matching face/pearls/red neckline, serene half-smile toward the viewer, twilight terrace continuity and painted hair rim-light shape. |
| Portrait · 07B | `scenes/4x5/07B_final_portrait.png` | Distinct calm final hero drawing toward the horizon, same identity and costume, upper-third face and clear lower caption region for the finishing affirmation. |

## Model and style lock

Use the supplied reference's adult honey-caramel brown woman, almond eyes/arched brows, small beauty mark, angular nose and red lips. Preserve the deep chestnut/burgundy sculpted wave and curled forelock, long thick waves, **deep crimson long-sleeve draped midi dress, pearl studs, short pearl necklace, bracelet and red pumps**. Do not change her costume for any location. See [CHARACTER_SPEC.md](CHARACTER_SPEC.md).

Native art must look hand-drawn for 1990s Western television: dark confident contours, broad restrained flat color, one/two hard cel-shadow tones and painted architectural backgrounds. No 3D, glossy fashion render, anime eye construction, vector infographic people or modern lavender slide treatment. No embedded captions, lettering, labels or watermarks. Generate complete 4:5 compositions at 1080 × 1350 minimum, preferably 2160 × 2700 for detailed masters. Do not convert a single reference still into repeated locations by cropping.

Maintain coherent hands, reflections, furniture perspective, buildings and visual continuity. Leave shot-specific caption clearance around 68–78% of the frame height, with safe margins 95 px top, 190 px bottom, 80 px left/right. Do not place essential hands or jewelry under the caption band.

## Audio anchors override the sample quotations

The prompt JSON's quoted sample script does **not** match the supplied MP3. Actual group anchors are:

| Group | Actual voiced anchor |
| --- | --- |
| 01 | “I enter every room knowing I have something valuable to offer.” |
| 02 | “I speak about my work without apologizing.” |
| 03 | “I ask for opportunities and I prepare for them.” |
| 04 | “A rejection does not change my value.” |
| 05 | “I don't need to chase every offer. I can choose the right ones.” |
| 06 | “My ambition is not something to hide.” |
| 07 | “I'm building the life I used to only imagine.” |

The finishing “I AM BECOMING HER.” is visual text, not spoken in the MP3. Use the verified 63 word timestamps and editable actual phrase data; do not replace them with sample quotations or synthesize a narrator.

## Passed two-shot visual test and completed final render

`VINTAGE-VISUAL-TEST-4X5` uses **01A and 01B**, with professional captions and the complete first spoken sentence in a 4.4-second audio clip; the picture holds to five seconds. Output: `renders/pretty-wise-tips-vintage-test-4x5.mp4`, 150 frames, 1080 × 1350, 30 FPS. This first test was rendered and inspected before completing the remaining 12 drawings and full master. The reviewed copy is bundled at `review/pretty-wise-tips-vintage-test-4x5.mp4`.

The passed review receipt binds both first-shot PNG hashes to the actual reviewed test-video SHA-256, with review basis `supplied-reference`. See [VISUAL_TEST_REVIEW.md](VISUAL_TEST_REVIEW.md). A new drawing or test video invalidates the old review. The final composition, `CINEMATIC-PILOT-4X5-FINAL`, requires all 14 actual PNGs, the supplied voiceover and a current visual-test receipt. The final master was rendered as `renders/pretty-wise-tips-cinematic-pilot-4x5-final.mp4`; measured results are in `MEDIA_VERIFICATION_4X5.json`.

## Motion truth

The 14 principal assets are flattened authored drawings. Actual motion is restrained camera pan/push/pull, cuts between distinct drawings, caption animation, subtle broadcast finish and a separately illustrated transparent steam overlay in 02B. Do not claim independent blinks, walking, lifting, signing, breathing, head/hand/hair motion or parallax from these flattened files.

Genuine limited character movement requires separately registered parts, eye/expression replacements or authored action cels. Cup/document/box movement needs separate illustrated prop layers. Parallax requires true background/midground/foreground layers with painted fill. No character rig is implied by a complete scene PNG. The one supplied independent effect is `props/4x5/tea-steam.png`: a registered transparent 1122 × 1402 PNG that rises/fades over 02B. It does not animate the cup or hand. See `MOTION_REPORT_4X5.md`.

## Source-reference provenance

The canonical identity source is the user’s inline red-dress image. `characters/lead-style-anchor-4x5.png` is a derived generated consistency anchor, not the original user attachment. Its origin and actual hash are separate from the inline-source record in the manifest.
