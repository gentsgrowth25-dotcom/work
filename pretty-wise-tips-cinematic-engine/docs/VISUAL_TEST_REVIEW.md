# Five-second visual review

No visual test or production approval exists yet. The first completed illustration and the airplane-wing reference are missing. The template in `config/visual-test-review.example.json` is deliberately pending and does not unlock a final render.

1. Supply or generate the actual `public/scenes/01_hotel_lobby.png` illustration. If the original reference is unavailable, establish whether the written description is the accepted visual basis. Do not claim to have compared an unseen reference.
2. Run `npm run render:test`. Inspect `renders/pretty-wise-tips-vintage-test.mp4` for a real drawn character and environment, the traditional cel-art style, identity, framing, captions and subtle camera movement. Confirm there are no development labels or presentation graphics. Do not claim independent character movement from a flattened image.
3. Record the SHA-256 of both the actual illustration and the resulting five-second MP4. Copy the example to `config/visual-test-review.json`; record the hashes, actual review basis (`written-brief` or `supplied-reference`), review date and concrete review notes. Set `status` to `passed` only after that review.
4. Supply all seven completed illustrations, then run `npm run validate` and `npm run render`. The preflight verifies the image files and review hashes before bundling. If the first artwork or test video changes, review the new test and update the receipt.

The receipt keys are `status`, `sceneSha256`, `testVideoPath`, `testVideoSha256`, `basis`, `reviewedAt` and `notes`. The video path is relative to this project. Keep the reviewed test file present when rendering the final film; copying a receipt without its matching video is insufficient.

The standard CLI loads and validates this receipt for `CINEMATIC_PILOT_FINAL`. Direct Remotion/Studio production rendering also needs the corresponding `artworkReview` input prop. The `VINTAGE_VISUAL_TEST` composition needs no review receipt and no other six images.
