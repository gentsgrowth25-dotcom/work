/** Exact primary scene-art slots for the corrected cinematic pilot. Paths are relative to public/. */
export const requiredPilotAssets = [
  'scenes/4x5/01A_pearls_detail.png',
  'scenes/4x5/01B_dressing_room.png',
  'scenes/4x5/02A_kitchen.png',
  'scenes/4x5/02B_teacup_detail.png',
  'scenes/4x5/03A_city_street.png',
  'scenes/4x5/03B_boutique_glance.png',
  'scenes/4x5/04A_jewelry_detail.png',
  'scenes/4x5/04B_jewel_boutique.png',
  'scenes/4x5/05A_signing_detail.png',
  'scenes/4x5/05B_executive_office.png',
  'scenes/4x5/06A_balcony_wide.png',
  'scenes/4x5/06B_balcony_profile.png',
  'scenes/4x5/07A_hero_portrait.png',
  'scenes/4x5/07B_final_portrait.png',
] as const;

export const cinematicMaster = {width: 1080, height: 1350, fps: 30, frames: 716, duration: 716 / 30} as const;
export const originalVoiceover = {
  src: 'audio/pilot-elevenlabs.mp3', duration: 23.562438,
  sha256: 'f5e618942f244bca0f33e79cfecf7c9c5901fc5c32b6eb71a06a42dd35e4c399',
} as const;

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
  artworkSha256: Record<string, string>;
  testVideoPath: string;
  testVideoSha256: string;
  basis: 'supplied-reference';
  reviewedAt: string;
  notes: string;
};

export const isDevelopmentArtworkPath = (src: string) => /(^|\/)development(\/|$)/i.test(src.replace(/\\/g, '/'));
