export type Ease = 'linear' | 'ease-in-out' | 'ease-out';
export type Expression = 'neutral' | 'smile' | 'smirk' | 'thoughtful' | 'confident' | 'disappointed' | 'surprised';
/** Times in seconds, relative to the containing scene. Coordinates in composition pixels. */
export type MotionKeyframe = {time: number; x?: number; y?: number; scale?: number; rotation?: number; opacity?: number; ease?: Ease};
export type CameraKeyframe = MotionKeyframe;
export type Layer = {id: string; src: string; plane?: 'background' | 'foreground'; depth?: number; fit?: 'cover' | 'contain'; pivot?: [number, number]; keyframes?: MotionKeyframe[]};
export type CharacterPart = Layer & {role: 'body' | 'head' | 'hair' | 'shoulders' | 'hand' | 'clothing' | 'prop'; motion?: {type: 'breathing' | 'sway'; amplitude: number; period: number}};
/** Every part and replacement sprite is a transparent, full-canvas, registered image. */
export type CharacterRig = {
  parts: CharacterPart[];
  expressions?: Partial<Record<Expression, string>>;
  expressionCues?: {time: number; expression: Expression}[];
  eyes?: {open: string; half: string; closed: string; blinkTimes: number[]; duration?: number};
  mouths?: Record<string, string>;
  mouthCues?: {time: number; shape: string}[];
  headPivot?: [number, number];
  headKeyframes?: MotionKeyframe[];
};
export type CaptionPosition = {top: number; left: number; width: number};
export type Scene = {
  id: string; title: string; start: number; duration: number; mode: 'flattened' | 'layered';
  /** Multiple separately illustrated shots may belong to one narrative scene. */
  groupId?: string;
  image?: string; layers?: Layer[]; character?: CharacterRig;
  /** Optional opening cutaway; shown for its duration, without pretending to animate the figure. */
  insert?: {src: string; duration: number};
  camera: CameraKeyframe[];
  transition?: {type: 'cut' | 'dissolve'; duration: number};
  captionPosition?: CaptionPosition;
  particles?: {count: number; seed: number; opacity: number};
  lighting?: {brightness?: number; saturation?: number};
  development: {src: string; description: string; palette: string[]};
};
export type WordTimestamp = {word: string; start: number; end: number; confidence?: number};
export type Caption = {id: string; start: number; end: number; text: string; words?: WordTimestamp[]; keyword?: string; position?: CaptionPosition; color?: 'cream' | 'dark'; final?: boolean};
export type AudioTrack = {src: string; duration: number; start?: number; volume: number; fadeIn: number; fadeOut: number};
export type FilmSettings = {enabled: boolean; grain: number; softness: number; muted: number; colorBleed: number; vignette: number};
export type Episode = {
  id: string; title: string; width: number; height: number; fps: number; duration: number;
  artworkStatus: 'development' | 'production';
  captionTiming: 'provisional' | 'asr-aligned' | 'reviewed';
  voiceover?: AudioTrack; music?: AudioTrack;
  film: FilmSettings; scenes: Scene[]; captions: Caption[];
};
export type CompositionProps = {episode: Episode; silent?: boolean; development?: boolean};
