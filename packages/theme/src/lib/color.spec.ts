import { describe, expect, it } from 'vitest';
import { deriveScale, hexToOklch, oklchToHex } from './color';

describe('hexToOklch / oklchToHex', () => {
  it('round-trips common colors', () => {
    for (const hex of ['#7C3AED', '#10B981', '#EF4444', '#FFFFFF', '#000000']) {
      expect(oklchToHex(hexToOklch(hex))).toBe(hex.toUpperCase());
    }
  });

  it('expands 3-digit hex', () => {
    expect(oklchToHex(hexToOklch('#fff'))).toBe('#FFFFFF');
  });

  it('rejects invalid input', () => {
    expect(() => hexToOklch('not-a-color')).toThrow(/Invalid hex color/);
    expect(() => hexToOklch('#12345')).toThrow(/Invalid hex color/);
  });
});

describe('deriveScale', () => {
  it('produces all 11 steps', () => {
    const scale = deriveScale('#7C3AED');
    expect(Object.keys(scale)).toHaveLength(11);
  });

  it('preserves the input color at its nearest step', () => {
    const scale = deriveScale('#7C3AED');
    expect(Object.values(scale)).toContain('#7C3AED');
  });

  it('gets monotonically darker', () => {
    const scale = deriveScale('#7C3AED');
    const lightness = Object.values(scale).map((hex) => hexToOklch(hex).l);
    for (let i = 1; i < lightness.length; i++) {
      expect(lightness[i]).toBeLessThan(lightness[i - 1]);
    }
  });
});
