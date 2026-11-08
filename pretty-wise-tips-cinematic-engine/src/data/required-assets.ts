/** Exact primary scene-art slots for the corrected cinematic pilot. Paths are relative to public/. */
export const requiredPilotAssets = [
  'scenes/01_hotel_lobby.png',
  'scenes/02_dressing_room.png',
  'scenes/03_meeting_room.png',
  'scenes/04_jewelry_detail.png',
  'scenes/05_executive_desk.png',
  'scenes/06_penthouse.png',
  'scenes/07_final_portrait.png',
] as const;

/** These are the old numbered development cards, never production illustration. */
export const developmentArtworkHashes = [
  '1ff089c60d7880e9cb6ceb72fc4085ba467ae0dd515a9daa3e5f770d20408cf6',
  '97c3a366f11e219131f2ff218cbbb6cac6dd8dba1ec4a32b975fdaf8ee43b483',
  '3657611b49dd2faeb0b71c01e7b5e48fc3cd1b8c5430bac3a6101bc307c15368',
  '7eff63f3b49869bade94ca6de168e8cfbcc629f8c7d2aa86bf58f4a63c45d7df',
  '15c20cbf18a7f64aea79924299318bcde73648b42b0642a63b3a8f58a2df9d5a',
  'fbfdf644a7512c29a4002e3fd3933387c18c63ca7a8f4ca2e7468741b72a9a5a',
  'f572a2db47a4364737512620dec4e5e8cc5eea2c7ac62f38046d1b756cf52663',
] as const;

export type RenderKind = 'final' | 'test' | 'development';
export type VisualTestReview = {
  status: 'passed';
  sceneSha256: string;
  testVideoPath: string;
  testVideoSha256: string;
  basis: 'written-brief' | 'supplied-reference';
  reviewedAt: string;
  notes: string;
};

export const isDevelopmentArtworkPath = (src: string) => /(^|\/)development(\/|$)/i.test(src.replace(/\\/g, '/'));
