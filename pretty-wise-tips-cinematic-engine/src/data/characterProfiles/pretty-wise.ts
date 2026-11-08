/** Art contract, not an invented finished character sheet. See docs/CHARACTER_SPEC.md. */
export const mainCharacter = {
  id: 'pwt-brunette', status: 'awaiting-reference-and-illustration',
  adultAgeRange: [25, 30], palette: {hair: '#38241f', skin: '#ad775f', lips: '#983c47', pearl: '#f0e9dc'},
  traits: ['chestnut curls', 'sculpted front swoop', 'almond eyes', 'pearl earrings', 'calm posture'],
  artboard: {width: 1080, height: 1920},
  expressions: ['neutral', 'smile', 'smirk', 'thoughtful', 'confident', 'disappointed', 'surprised'],
  sourceReferenceReceived: false,
} as const;
