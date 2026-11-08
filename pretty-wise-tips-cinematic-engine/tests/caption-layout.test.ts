import assert from 'node:assert/strict';
import {test} from 'node:test';
import {getCaptionLayout} from '../src/utils/caption-layout';

test('native 4:5 caption positions remain composition pixels instead of scaling against 1920px', () => {
  const result = getCaptionLayout({width: 1080, height: 1350, position: {left: 80, top: 930, width: 920}, text: 'I know my worth.'});
  assert.equal(result.left, 80);
  assert.equal(result.top, 930);
  assert.equal(result.width, 920);
  assert.ok(result.fontSize >= 48 && result.fontSize <= 80);
  assert.ok(result.top + result.maxHeight <= 1350 - 190);
});

test('default captions occupy the lower middle inside the 4:5 safe area', () => {
  const result = getCaptionLayout({width: 1080, height: 1350, text: 'I choose the right ones.'});
  assert.ok(result.left >= 80);
  assert.ok(result.left + result.width <= 1080 - 80);
  assert.ok(result.top >= 1350 * 0.68 && result.top <= 1350 * 0.78);
  assert.ok(result.top + result.maxHeight <= 1350 - 190);
  assert.ok(result.lineHeight > 0 && result.maxHeight > result.fontSize);
});

test('edited caption bounds are clamped on every side with room for two text lines', () => {
  for (const position of [{left: -100, top: -100, width: 5000}, {left: 2000, top: 2000, width: 5000}]) {
    const result = getCaptionLayout({width: 1080, height: 1350, position, text: 'Prepared for every opportunity.'});
    assert.ok(result.left >= 80);
    assert.ok(result.left + result.width <= 1080 - 80);
    assert.ok(result.top >= 95);
    assert.ok(result.top + result.maxHeight <= 1350 - 190);
    assert.ok(result.width > 0);
  }
});

test('the final affirmation keeps its full two-line box above the bottom safe margin', () => {
  const result = getCaptionLayout({width: 1080, height: 1350, final: true, position: {left: 80, top: 1100, width: 920}, text: 'I AM BECOMING HER.'});
  assert.ok(result.top + result.maxHeight <= 1350 - 190);
  assert.equal(result.width, 920);
});
