import type {RenderKind} from '../src/data/required-assets';

const selectors: Record<string, RenderKind> = {
  final: 'final', CINEMATIC_PILOT_FINAL: 'final',
  test: 'test', VINTAGE_VISUAL_TEST: 'test',
  development: 'development', DEVELOPMENT_PREVIEW: 'development',
};
export const resolveRenderKind = (values: {composition?: string; production?: boolean}): RenderKind => {
  const kind = values.composition === undefined ? 'final' : selectors[values.composition];
  if (!kind) throw new Error(`Unknown composition ${JSON.stringify(values.composition)}. Use final, test or development.`);
  if (values.production && kind !== 'final') throw new Error('--production selects the final composition and cannot be combined with another composition.');
  return kind;
};
export const compositionIdFor = (kind: RenderKind) => ({final: 'CINEMATIC_PILOT_FINAL', test: 'VINTAGE_VISUAL_TEST', development: 'DEVELOPMENT_PREVIEW'}[kind]);
export const outputFilenameFor = (kind: RenderKind) => ({final: 'pretty-wise-tips-cinematic-pilot-final.mp4', test: 'pretty-wise-tips-vintage-test.mp4', development: 'pretty-wise-tips-development-preview.mp4'}[kind]);
