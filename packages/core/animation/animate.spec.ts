import { describe, expect, it } from 'vitest';
import { normalizeEase, toMotionOptions } from './animate';

describe('normalizeEase', () => {
  it('maps CSS easing keywords to the names motion understands', () => {
    expect(normalizeEase('ease')).toBe('easeInOut');
    expect(normalizeEase('ease-in')).toBe('easeIn');
    expect(normalizeEase('ease-out')).toBe('easeOut');
    expect(normalizeEase('ease-in-out')).toBe('easeInOut');
  });

  it('passes motion-native names, bezier arrays and functions through untouched', () => {
    const fn = (t: number) => t;
    const bezier = [0.4, 0, 0.2, 1];
    expect(normalizeEase('easeOut')).toBe('easeOut');
    expect(normalizeEase('circInOut')).toBe('circInOut');
    expect(normalizeEase('linear')).toBe('linear');
    expect(normalizeEase(bezier)).toBe(bezier);
    expect(normalizeEase(fn)).toBe(fn);
    expect(normalizeEase(undefined)).toBeUndefined();
  });
});

describe('toMotionOptions', () => {
  it('normalises tween easing from both `ease` and the `easing` alias', () => {
    expect(toMotionOptions({ duration: 0.2, easing: 'ease-out' })).toEqual({
      duration: 0.2,
      ease: 'easeOut',
    });
    expect(toMotionOptions({ duration: 0.2, ease: 'ease-in' })).toEqual({
      duration: 0.2,
      ease: 'easeIn',
    });
  });

  it('returns undefined when no transition is given', () => {
    expect(toMotionOptions(undefined)).toBeUndefined();
  });
});
