# Five-second native 4:5 visual review

The actual five-second test has passed visual review. Its matching MP4 is bundled at `review/pretty-wise-tips-vintage-test-4x5.mp4`, and `config/visual-test-review.json` contains the real passed receipt. The pending example remains a schema template, not a second approval.

The current canonical character reference is the user's inline red-dress illustration. It has no local attachment filename. Review the actual first two native 4:5 drawings and the rendered test against that reference before approving the full film. Pending prompts and historical development cards cannot satisfy this gate.

1. Obtain `public/scenes/4x5/01A_pearls_detail.png` and `public/scenes/4x5/01B_dressing_room.png` as real complete 4:5 illustrations. Inspect identity, crimson long sleeves, pearl jewelry, caramel skin, forelock/long-wave silhouette and the mirror's geometry.
2. Run `npm run render -- --composition test`. Inspect `renders/pretty-wise-tips-vintage-test-4x5.mp4`: 1080 × 1350, 30 FPS, 150 frames. The first sentence plays in a 4.4-second audio clip, then the picture holds to five seconds. Check framing, clean cut between the two real drawings, modest camera movement, two-line semibold sans captions and safe placement. There must be no debug labels, cards or placeholder graphics.
3. Record actual SHA-256 hashes for **both** artwork PNGs and the rendered MP4. Complete `config/visual-test-review.json` with the actual review date, reference basis and concrete notes. Do not set a passed status until the image and video have been inspected.
4. Complete all 14 native 4:5 drawings. Run final validation/rendering only when the required image files, authoritative audio and matching review receipt exist.

The receipt format is:

```json
{
  "status": "passed",
  "artworkSha256": {
    "scenes/4x5/01A_pearls_detail.png": "ACTUAL_SHA256_OF_01A",
    "scenes/4x5/01B_dressing_room.png": "ACTUAL_SHA256_OF_01B"
  },
  "testVideoPath": "review/pretty-wise-tips-vintage-test-4x5.mp4",
  "testVideoSha256": "ACTUAL_SHA256_OF_REVIEWED_MP4",
  "basis": "supplied-reference",
  "reviewedAt": "ACTUAL_ISO_DATE_TIME",
  "notes": "Concrete observations from inspecting the actual drawings and video."
}
```

The strings above are schema examples, not valid hashes or an approval. Use the project's pending template when recording the actual review. For a newly reviewed render, retain the approved MP4 under `review/` and record that path. The test-video path is relative to the project; keep that file present when validating/rendering final production. Both PNG hashes and the MP4 hash must match the reviewed files. After either image or the video changes, render and review the current version again.

The test demonstrates camera motion and a cut between two authored drawings. A flat-image pan is not independent character acting. If the assets have no separate eyes/hand/character layers, the review notes must not claim a blink, necklace adjustment or other articulated motion.

The standard CLI validates this receipt for `CINEMATIC-PILOT-4X5-FINAL`. `VINTAGE-VISUAL-TEST-4X5` needs the first two actual illustrations and supplied voiceover, but not the other 12 shots or a previous approval. Current render results and visual observations belong in `QUALITY_CONTROL.md`; do not carry over old 9:16 development-video measurements as evidence for this master.
