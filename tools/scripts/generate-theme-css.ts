/**
 * Generates the prebuilt token stylesheets shipped with @ngxsmk/theme.
 * Run via `npm run theme:css` after changing tokens or presets.
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildThemeCss } from '../../packages/theme/src/lib/css';
import { presets } from '../../packages/theme/src/lib/presets';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const outDir = join(root, 'packages', 'theme', 'styles');
mkdirSync(outDir, { recursive: true });

for (const [name, config] of Object.entries(presets)) {
  const file = join(outDir, `ngxsmk.${name}.css`);
  writeFileSync(file, buildThemeCss(config), 'utf8');
  console.log(`wrote ${file}`);
}

// The default stylesheet is the emerald preset.
const defaultFile = join(outDir, 'ngxsmk.css');
writeFileSync(defaultFile, buildThemeCss(presets['emerald']), 'utf8');
console.log(`wrote ${defaultFile}`);
