import { describe, expect, it } from 'vitest';
import { deriveScale, hexToHsl, hslToHex } from './color';

describe('hexToHsl / hslToHex', () => {
  it('round-trips common colors', () => {
    for (const hex of ['#7C3AED', '#10B981', '#EF4444', '#FFFFFF', '#000000']) {
      expect(hslToHex(hexToHsl(hex))).toBe(hex.toUpperCase());
    }
  });

  it('expands 3-digit hex', () => {
    expect(hslToHex(hexToHsl('#fff'))).toBe('#FFFFFF');
  });

  it('rejects invalid input', () => {
    expect(() => hexToHsl('not-a-color')).toThrow(/Invalid hex color/);
    expect(() => hexToHsl('#12345')).toThrow(/Invalid hex color/);
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
    const lightness = Object.values(scale).map((hex) => hexToHsl(hex).l);
    for (let i = 1; i < lightness.length; i++) {
      expect(lightness[i]).toBeLessThan(lightness[i - 1]);
    }
  });
});
