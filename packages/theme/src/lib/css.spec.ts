import { describe, expect, it } from 'vitest';
import { buildThemeCss } from './css';
import { violetPreset } from './presets';

describe('buildThemeCss', () => {
  const css = buildThemeCss(violetPreset);

  it('emits brand scale, semantic roles, and static tokens on :root', () => {
    expect(css).toContain(':root {');
    expect(css).toContain('--ngxsmk-color-brand-500:');
    expect(css).toContain('--ngxsmk-color-primary:');
    expect(css).toContain('--ngxsmk-color-surface:');
    expect(css).toContain('--ngxsmk-space-4: 1rem;');
    expect(css).toContain('--ngxsmk-radius-md: 0.5rem;');
    expect(css).toContain('--ngxsmk-shadow-md:');
    expect(css).toContain('--ngxsmk-duration-normal: 200ms;');
    expect(css).toContain('--ngxsmk-font-sans:');
    expect(css).toContain('--ngxsmk-text-body-md-size: 0.875rem;');
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
});
