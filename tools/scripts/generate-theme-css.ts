/**
 * Generates the prebuilt stylesheets shipped with @ngxsmk/theme.
 * Run via `npm run theme:css` after changing tokens, presets, or any file in
 * `packages/core/styles/`.
 *
 * Each stylesheet = design tokens for one preset + the component CSS that
 * cannot live inside a component (`@ngxsmk/core/button` and
 * `@ngxsmk/core/input` are attribute directives on native elements, so their
 * styles ship as plain CSS). Inlining them here keeps the consumer story to a
 * single `@import '@ngxsmk/theme/styles/ngxsmk.css'`.
 */
import { mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildThemeCss } from '../../packages/theme/src/lib/css';
import { presets } from '../../packages/theme/src/lib/presets';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const outDir = join(root, 'packages', 'theme', 'styles');
const coreStylesDir = join(root, 'packages', 'core', 'styles');
mkdirSync(outDir, { recursive: true });

const coreStyles = readdirSync(coreStylesDir)
  .filter((f) => f.endsWith('.css'))
  .sort()
  .map((f) => {
    const css = readFileSync(join(coreStylesDir, f), 'utf8').trimEnd();
    return `/* ---- @ngxsmk/core/styles/${f} ---- */\n${css}\n`;
  })
  .join('\n');

const banner = `\n/* ==========================================================================\n   Component styles for directive-based primitives (button, input).\n   Source: packages/core/styles/*.css — regenerate with \`npm run theme:css\`.\n   ========================================================================== */\n\n`;

const build = (config: Parameters<typeof buildThemeCss>[0]): string =>
  `${buildThemeCss(config).trimEnd()}\n${banner}${coreStyles}`;

for (const [name, config] of Object.entries(presets)) {
  const file = join(outDir, `ngxsmk.${name}.css`);
  writeFileSync(file, build(config), 'utf8');
  console.log(`wrote ${file}`);
}

// The default stylesheet is the emerald preset.
const defaultFile = join(outDir, 'ngxsmk.css');
writeFileSync(defaultFile, build(presets['emerald']), 'utf8');
console.log(`wrote ${defaultFile}`);
