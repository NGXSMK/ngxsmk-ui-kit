import { describe, expect, it } from 'vitest';
import { ionicVarsAdapter } from './token-adapter';
import { resolveTheme } from './define-config';
import { ResolvedTheme } from './types';

const theme: ResolvedTheme = resolveTheme({
  brand: { primary: '#7C3AED', secondary: '#0EA5E9' },
});

const light = ionicVarsAdapter.vars(theme);
const dark = ionicVarsAdapter.varsDark!(theme);

/** `"124, 58, 237"` -> `[124, 58, 237]` */
function rgb(value: string): number[] {
  return value.split(',').map((p) => Number(p.trim()));
}

describe('ionicVarsAdapter', () => {
  it('emits the full six-variable set for every Ionic color role', () => {
    for (const role of [
      'primary',
      'secondary',
      'tertiary',
      'success',
      'warning',
      'danger',
      'medium',
      'light',
      'dark',
    ]) {
      for (const suffix of ['', '-rgb', '-contrast', '-contrast-rgb', '-shade', '-tint']) {
        expect(light[`--ion-color-${role}${suffix}`], `${role}${suffix}`).toBeTruthy();
        expect(dark[`--ion-color-${role}${suffix}`], `dark ${role}${suffix}`).toBeTruthy();
      }
    }
  });

  it('maps the NGXSMK error semantic onto Ionic danger', () => {
    expect(light['--ion-color-danger']).toBe(theme.semantic.error);
  });

  it('derives primary from the brand color', () => {
    expect(light['--ion-color-primary']).toBe(theme.brandBase);
    expect(rgb(light['--ion-color-primary-rgb'])).toEqual([124, 58, 237]);
  });

  it('picks a readable contrast color per role', () => {
    // #7C3AED is dark enough to need white text.
    expect(light['--ion-color-primary-contrast']).toBe('#FFFFFF');
    // The `light` role is a near-white neutral and needs black text.
    expect(light['--ion-color-light-contrast']).toBe('#000000');
  });

  it('makes shade darker and tint lighter than the base', () => {
    const luma = (hex: string) => {
      const h = hex.replace('#', '');
      return (
        parseInt(h.substring(0, 2), 16) +
        parseInt(h.substring(2, 4), 16) +
        parseInt(h.substring(4, 6), 16)
      );
    };
    expect(luma(light['--ion-color-primary-shade'])).toBeLessThan(
      luma(light['--ion-color-primary']),
    );
    expect(luma(light['--ion-color-primary-tint'])).toBeGreaterThan(
      luma(light['--ion-color-primary']),
    );
  });

  it('emits the full 50-950 step ladder in both modes', () => {
    for (let stop = 50; stop <= 950; stop += 50) {
      expect(light[`--ion-color-step-${stop}`], `light step ${stop}`).toMatch(/^#[0-9a-f]{6}$/i);
      expect(dark[`--ion-color-step-${stop}`], `dark step ${stop}`).toMatch(/^#[0-9a-f]{6}$/i);
    }
  });

  it('runs the step ladder from background toward text in each mode', () => {
    const channelSum = (hex: string) => {
      const h = hex.replace('#', '');
      return (
        parseInt(h.substring(0, 2), 16) +
        parseInt(h.substring(2, 4), 16) +
        parseInt(h.substring(4, 6), 16)
      );
    };

    // Light mode: light background -> dark text, so steps darken.
    expect(channelSum(light['--ion-color-step-950'])).toBeLessThan(
      channelSum(light['--ion-color-step-50']),
    );
    // Dark mode inverts: dark background -> light text, so steps lighten.
    expect(channelSum(dark['--ion-color-step-950'])).toBeGreaterThan(
      channelSum(dark['--ion-color-step-50']),
    );
  });

  it('produces distinct light and dark surfaces', () => {
    expect(light['--ion-background-color']).not.toBe(dark['--ion-background-color']);
    expect(light['--ion-item-background']).not.toBe(dark['--ion-item-background']);
    expect(light['--ion-text-color']).not.toBe(dark['--ion-text-color']);
  });

  it('emits the surface variables Ionic components read', () => {
    for (const key of [
      '--ion-background-color',
      '--ion-background-color-rgb',
      '--ion-text-color',
      '--ion-text-color-rgb',
      '--ion-item-background',
      '--ion-card-background',
      '--ion-toolbar-background',
      '--ion-tab-bar-background',
      '--ion-border-color',
      '--ion-placeholder-color',
      '--ion-font-family',
    ]) {
      expect(light[key], key).toBeTruthy();
      expect(dark[key], `dark ${key}`).toBeTruthy();
    }
  });

  it('carries the theme font family through', () => {
    expect(light['--ion-font-family']).toBe(theme.fontFamily.sans);
  });
});
