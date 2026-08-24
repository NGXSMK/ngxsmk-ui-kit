import { describe, expect, it } from 'vitest';
import { buildThemeCss } from './css';
import { violetPreset } from './presets';

describe('buildThemeCss', () => {
  const css = buildThemeCss(violetPreset);

  it('emits brand scale, secondary scale, surface elevation, and static tokens on :root', () => {
    expect(css).toContain(':root {');
    expect(css).toContain('--ngxsmk-color-brand-500:');
    expect(css).toContain('--ngxsmk-color-secondary-500:');
    expect(css).toContain('--ngxsmk-color-surface-1:');
    expect(css).toContain('--ngxsmk-color-surface-5:');
    expect(css).toContain('--ngxsmk-color-primary:');
    expect(css).toContain('--ngxsmk-color-surface:');
    expect(css).toContain('--ngxsmk-space-4: 1rem;');
    expect(css).toContain('--ngxsmk-radius-md: 0.5rem;');
    expect(css).toContain('--ngxsmk-shadow-md:');
    expect(css).toContain('--ngxsmk-duration-normal: 200ms;');
    expect(css).toContain('--ngxsmk-font-sans:');
    expect(css).toContain('--ngxsmk-text-body-md-size: 0.875rem;');
    expect(css).toContain('--ngxsmk-motion-duration:');
    expect(css).toContain('@media (prefers-reduced-motion: reduce) {');
  });

  it('defaults to the class dark-mode strategy', () => {
    expect(css).toContain('.dark {');
    expect(css).not.toContain('@media (prefers-color-scheme: dark)');
  });

  it('supports the media dark-mode strategy', () => {
    const mediaCss = buildThemeCss({
      brand: { primary: '#7C3AED' },
      darkMode: { strategy: 'media' },
    });
    expect(mediaCss).toContain('@media (prefers-color-scheme: dark)');
  });

  it('sets color-scheme for native controls', () => {
    expect(css).toContain('color-scheme: light;');
    expect(css).toContain('color-scheme: dark;');
  });

  it('uses the exact brand color for light primary', () => {
    expect(css).toContain('--ngxsmk-color-primary: #7C3AED;');
  });

  it('applies dark-mode role overrides', () => {
    const overridden = buildThemeCss({
      brand: { primary: '#7C3AED' },
      overrides: { dark: { '--ngxsmk-color-primary': '#FAFAFA' } },
    });
    expect(overridden).toContain('--ngxsmk-color-primary: #FAFAFA;');
  });

  it('emits the interaction and sizing token groups', () => {
    expect(css).toContain('--ngxsmk-focus-ring: var(--ngxsmk-shadow-focus);');
    expect(css).toContain('--ngxsmk-focus-ring-error:');
    expect(css).toContain('--ngxsmk-opacity-disabled: 0.5;');
    expect(css).toContain('--ngxsmk-icon-md: 1.25rem;');
    expect(css).toContain('--ngxsmk-control-height-sm: 2rem;');
    expect(css).toContain('--ngxsmk-control-height-md: 2.5rem;');
    expect(css).toContain('--ngxsmk-tracking-wide: 0.08em;');
    expect(css).toContain('--ngxsmk-hover-lift: translateY(-1px);');
    expect(css).toContain('--ngxsmk-press-scale: scale(0.98);');
  });

  it('zeroes every duration token under reduced motion, with a class opt-in', () => {
    const reduced = css.slice(css.indexOf('@media (prefers-reduced-motion: reduce)'));
    expect(reduced).toContain('--ngxsmk-duration-fast: 0ms;');
    expect(reduced).toContain('--ngxsmk-duration-normal: 0ms;');
    expect(reduced).toContain('--ngxsmk-duration-slower: 0ms;');
    expect(reduced).toContain('--ngxsmk-hover-lift: none;');
    expect(reduced).toContain('--ngxsmk-press-scale: none;');
    expect(reduced).toContain('.ngxsmk-reduce-motion');
  });

  it('emits mobile safe-area and touch-target tokens', () => {
    expect(css).toContain('--ngxsmk-safe-area-top: env(safe-area-inset-top, 0px);');
    expect(css).toContain('--ngxsmk-safe-area-bottom: env(safe-area-inset-bottom, 0px);');
    expect(css).toContain('--ngxsmk-touch-target-min: 44px;');
  });
});
