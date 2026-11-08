import {createHash} from 'node:crypto';
import {existsSync, readFileSync, statSync} from 'node:fs';
import path from 'node:path';
import {inflateSync} from 'node:zlib';
import type {Episode} from '../src/types';
import {developmentArtworkHashes, requiredPilotAssets, type RenderKind, type VisualTestReview} from '../src/data/required-assets';
import {validateEpisode, type ValidationResult} from '../src/utils/validate';

export type PreflightOptions = {kind: RenderKind; publicDir: string; projectDir: string; reviewFile?: string; silent?: boolean};
export type PreflightResult = ValidationResult & {review?: VisualTestReview};
const hash = (data: Buffer) => createHash('sha256').update(data).digest('hex');
const pngSignature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
const crc32 = (bytes: Buffer) => {
  let value = 0xffffffff;
  for (const byte of bytes) {value ^= byte; for (let i = 0; i < 8; i++) value = (value >>> 1) ^ (value & 1 ? 0xedb88320 : 0);}
  return (value ^ 0xffffffff) >>> 0;
};

/** Validate actual PNG structure and compressed scanlines, not merely the filename. */
export const inspectPng = (data: Buffer): {width: number; height: number} => {
  if (!data.subarray(0, 8).equals(pngSignature)) throw new Error('not a PNG image (invalid signature)');
  let offset = 8, width = 0, height = 0, bitDepth = 0, colorType = 0, interlace = 0, ended = false;
  const imageData: Buffer[] = [];
  while (offset + 12 <= data.length) {
    const size = data.readUInt32BE(offset);
    if (size > data.length - offset - 12) throw new Error('truncated PNG chunk');
    const type = data.toString('ascii', offset + 4, offset + 8);
    const payload = data.subarray(offset + 8, offset + 8 + size);
    if (crc32(data.subarray(offset + 4, offset + 8 + size)) !== data.readUInt32BE(offset + 8 + size)) throw new Error(`invalid PNG ${type} checksum`);
    if (offset === 8 && type !== 'IHDR') throw new Error('PNG must begin with IHDR');
    if (type === 'IHDR') {
      if (width || size !== 13) throw new Error('invalid PNG image header');
      width = payload.readUInt32BE(0); height = payload.readUInt32BE(4);
      bitDepth = payload[8]; colorType = payload[9]; interlace = payload[12];
      if (!width || !height || width > 16384 || height > 16384 || width * height > 40_000_000 || payload[10] !== 0 || payload[11] !== 0 || interlace > 1) throw new Error('unsupported or invalid PNG dimensions/header');
    } else if (type === 'IDAT') imageData.push(payload);
    else if (type === 'IEND') {if (size) throw new Error('invalid PNG end chunk'); ended = true; break;}
    offset += size + 12;
  }
  if (!width || !ended || !imageData.length) throw new Error('PNG is missing its image data or end chunk');
  const channels = ({0: 1, 2: 3, 3: 1, 4: 2, 6: 4} as Record<number, number>)[colorType];
  const allowedDepths = colorType === 0 ? [1, 2, 4, 8, 16] : colorType === 3 ? [1, 2, 4, 8] : [8, 16];
  if (!channels || !allowedDepths.includes(bitDepth)) throw new Error('unsupported PNG color type/bit depth');
  const rowBytes = Math.ceil(width * channels * bitDepth / 8) + 1;
  const decoded = inflateSync(Buffer.concat(imageData), {maxOutputLength: rowBytes * height + height * 8 + 65536});
  if (!interlace) {
    if (decoded.length !== rowBytes * height) throw new Error('PNG image data length does not match dimensions');
    for (let row = 0; row < height; row++) if (decoded[row * rowBytes] > 4) throw new Error('PNG uses an invalid scanline filter');
  } else if (!decoded.length) throw new Error('PNG image data is empty');
  return {width, height};
};

/** All required artwork is checked before bundling or launching Chromium. */
export const preflightRender = (episode: Episode, options: PreflightOptions): PreflightResult => {
  const production = options.kind !== 'development';
  const result: PreflightResult = validateEpisode(episode, {publicDir: options.publicDir, production, silent: options.silent});
  if (!production) return result;
  const required = options.kind === 'test' ? requiredPilotAssets.slice(0, 1) : requiredPilotAssets;
  // The pilot policy reports each mandatory missing scene once, with its precise role.
  result.errors = result.errors.filter((message) => !required.some((src) => message === `Missing asset: public/${src}`));
  const expectedDuration = options.kind === 'test' ? 5 : 24;
  if (episode.width !== 1080 || episode.height !== 1920 || episode.fps !== 30 || episode.duration !== expectedDuration) result.errors.push(`${options.kind} composition must be 1080 × 1920, 30 FPS and ${expectedDuration} seconds.`);
  if (episode.scenes.length !== required.length) result.errors.push(`${options.kind} composition requires exactly ${required.length} illustrated scene${required.length === 1 ? '' : 's'}.`);
  const hashes: Record<string, string> = {};
  const seenHashes = new Map<string, string>();
  required.forEach((src, index) => {
    if (episode.scenes[index]?.image !== src) result.errors.push(`Scene ${index + 1} must load required artwork public/${src}.`);
    const filename = path.resolve(options.publicDir, src);
    if (!existsSync(filename) || !statSync(filename).isFile()) {result.errors.push(`Missing required scene illustration: public/${src}`); return;}
    try {
      const bytes = readFileSync(filename);
      const dimensions = inspectPng(bytes);
      const digest = hash(bytes); hashes[src] = digest;
      if ((developmentArtworkHashes as readonly string[]).includes(digest)) result.errors.push(`Forbidden development placeholder: public/${src} contains a known numbered storyboard card, even though it was renamed.`);
      const prior = seenHashes.get(digest);
      if (prior) result.errors.push(`Duplicate scene artwork: public/${src} is identical to public/${prior}; each shot requires its own illustration.`);
      else seenHashes.set(digest, src);
      if (Math.abs(dimensions.width / dimensions.height - 9 / 16) > 0.005) result.warnings.push(`public/${src} is ${dimensions.width} × ${dimensions.height}; 9:16 is preferred. The renderer will crop with object-fit: cover without stretching.`);
      if (dimensions.width < 1080 || dimensions.height < 1920) result.warnings.push(`public/${src} is below the preferred 1080 × 1920 artwork resolution; check sharpness at export size.`);
    } catch (error) {result.errors.push(`Invalid required scene illustration public/${src}: ${error instanceof Error ? error.message : String(error)}`);}
  });
  if (options.kind === 'final') {
    const filename = options.reviewFile ? path.resolve(options.projectDir, options.reviewFile) : path.resolve(options.projectDir, 'config/visual-test-review.json');
    if (!existsSync(filename)) result.errors.push('Five-second visual test has not been reviewed. Render VINTAGE_VISUAL_TEST, inspect the actual artwork and video, then create config/visual-test-review.json before the final render.');
    else {
      try {
        const review = JSON.parse(readFileSync(filename, 'utf8')) as VisualTestReview;
        if (review.status !== 'passed') throw new Error('review status must be passed');
        if (!['written-brief', 'supplied-reference'].includes(review.basis) || !review.notes?.trim() || !Number.isFinite(Date.parse(review.reviewedAt))) throw new Error('review must record its visual basis, reviewedAt date and notes');
        if (review.sceneSha256 !== hashes[requiredPilotAssets[0]]) throw new Error('first-scene artwork changed or has not been reviewed (scene SHA-256 mismatch)');
        if (!review.testVideoPath || path.isAbsolute(review.testVideoPath)) throw new Error('testVideoPath must be relative to the project directory');
        const testPath = path.resolve(options.projectDir, review.testVideoPath);
        const relative = path.relative(options.projectDir, testPath);
        if (relative.startsWith('..') || path.isAbsolute(relative)) throw new Error('testVideoPath must remain within the project directory');
        if (!existsSync(testPath) || !statSync(testPath).isFile()) throw new Error(`reviewed five-second test video is missing: ${review.testVideoPath}`);
        if (hash(readFileSync(testPath)) !== review.testVideoSha256) throw new Error('reviewed five-second test video SHA-256 does not match the file');
        result.review = review;
      } catch (error) {result.errors.push(`Invalid visual-test review: ${error instanceof Error ? error.message : String(error)}`);}
    }
  }
  return result;
};
