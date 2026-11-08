# Cinematic engine instructions

This directory implements the current cinematic cel-animation brief in `docs/PROJECT_BRIEF.md`. It is separate from the historical infographic episodes in `../pretty-wise-tips/`. The user explicitly requested this new visual direction: use principal PNG/WebP illustrations, with SVG only for auxiliary graphics. Do not substitute the older SVG puppet art for missing illustrations.

Production artwork and the airplane reference are missing. Preserve the marked development status until approved scene art is supplied. Flattened scenes support camera effects; independent character performance requires compatible layers and registered replacement sprites. Do not claim absent artwork or unrendered motion exists.

Use the bundled package lockfile. Run `npm ci`, `npm run typecheck`, `npm test`, `npm run validate` and `npm run build`. Browser pixel/layout checks use `npm run test:render`. See README.md and docs/ for rendering and narration import.

Continue the repository's authorized GitHub export workflow with versioned filenames; preserve older exports and exclude dependencies, caches and credentials.
