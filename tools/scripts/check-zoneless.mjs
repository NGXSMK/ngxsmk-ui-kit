#!/usr/bin/env node
/**
 * Verifies the built @ngxsmk packages stay zoneless: no FESM chunk may
 * import zone.js or reference the Zone global.
 *
 * Usage: node tools/scripts/check-zoneless.mjs   (after `npm run build:libs`)
 */
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const distRoot = join(root, 'dist', 'ngxsmk');

if (!existsSync(distRoot)) {
  console.error(`dist not found at ${distRoot} — run "npm run build:libs" first.`);
  process.exit(1);
}

const offenders = [];
let checked = 0;

for (const pkg of readdirSync(distRoot)) {
  const fesmDir = join(distRoot, pkg, 'fesm2022');
  if (!existsSync(fesmDir)) continue;
  for (const file of readdirSync(fesmDir)) {
    if (!file.endsWith('.mjs')) continue;
    checked++;
    const src = readFileSync(join(fesmDir, file), 'utf8');
    if (/from\s+['"]zone\.js/.test(src) || /\bZone\.(current|root|wrap|run)\b/.test(src)) {
      offenders.push(`${pkg}/${file}`);
    }
  }
}

console.log(`Checked ${checked} FESM chunks for zone.js usage.`);
if (offenders.length) {
  console.error(`Zoneless check FAILED — zone.js referenced in:`);
  for (const f of offenders) console.error(`  ${f}`);
  process.exit(1);
}
console.log('Zoneless check passed — no zone.js references in built output.');
