import type {RenderKind} from '../src/data/required-assets';

const selectors: Record<string, RenderKind> = {
  final: 'final', CINEMATIC_PILOT_4X5_FINAL: 'final', 'CINEMATIC-PILOT-4X5-FINAL': 'final',
  test: 'test', VINTAGE_VISUAL_TEST_4X5: 'test', 'VINTAGE-VISUAL-TEST-4X5': 'test',
  development: 'development', DEVELOPMENT_PREVIEW: 'development', 'DEVELOPMENT-PREVIEW': 'development',
};
export const resolveRenderKind = (values: {composition?: string; production?: boolean}): RenderKind => {
  const kind = values.composition === undefined ? 'final' : selectors[values.composition];
  if (!kind) throw new Error(`Unknown composition ${JSON.stringify(values.composition)}. Use final, test or development.`);
  if (values.production && kind !== 'final') throw new Error('--production selects the final composition and cannot be combined with another composition.');
  return kind;
};
export const compositionIdFor = (kind: RenderKind) => ({final: 'CINEMATIC-PILOT-4X5-FINAL', test: 'VINTAGE-VISUAL-TEST-4X5', development: 'DEVELOPMENT-PREVIEW'}[kind]);
export const outputFilenameFor = (kind: RenderKind) => ({final: 'pretty-wise-tips-cinematic-pilot-4x5-final.mp4', test: 'pretty-wise-tips-vintage-test-4x5.mp4', development: 'pretty-wise-tips-development-preview.mp4'}[kind]);
