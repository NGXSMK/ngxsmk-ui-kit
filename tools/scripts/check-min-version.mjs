#!/usr/bin/env node
/**
 * Verifies the built @ngxsmk packages stay linkable on the oldest Angular
 * major we advertise.
 *
 * Libraries are published as partial-Ivy code: every declaration carries a
 * `minVersion` stamp, and the Angular linker in the *consumer's* toolchain
 * refuses any declaration newer than itself. Using a post-floor template or
 * compiler feature (`@defer` -> 18.0.0, `linkedSignal` -> 19.0.0,
 * `afterRenderEffect` -> 20.0.0) silently raises that stamp, which breaks
 * every consumer below it at build time.
 *
 * The compatibility workflow compiles our *source* under old toolchains, which
 * does not catch this: we ship one tarball built with the newest Angular, so
 * the stamp inside that tarball is what actually gates consumers.
 *
 * The ceiling is derived from the `@angular/core` peer range so the guardrail
 * can never drift from the compatibility we advertise on npm.
 *
 * Usage: node tools/scripts/check-min-version.mjs   (after `npm run build:libs`)
 */
import { readdirSync, readFileSync, existsSync, statSync } from 'node:fs';
import { join, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const distRoot = join(root, 'dist', 'ngxsmk');

if (!existsSync(distRoot)) {
  console.error(`dist not found at ${distRoot} — run "npm run build:libs" first.`);
  process.exit(1);
}

/** `>=17.3.0`, `^17.3.0`, `17.3.0 || ^18.0.0` -> `17.3.0` (the lowest floor). */
function floorFromRange(range) {
  const versions = range.match(/\d+\.\d+\.\d+/g);
  if (!versions?.length) return null;
  return versions.sort(compareSemver)[0];
}

function compareSemver(a, b) {
  const pa = a.split('.').map(Number);
  const pb = b.split('.').map(Number);
  for (let i = 0; i < 3; i++) {
    if ((pa[i] ?? 0) !== (pb[i] ?? 0)) return (pa[i] ?? 0) - (pb[i] ?? 0);
  }
  return 0;
}

// Every publishable package must agree on the floor; take the lowest so the
// check reflects the weakest promise we make.
const sourcePkgs = ['core', 'cdk', 'theme'].map((p) => join(root, 'packages', p, 'package.json'));

let ceiling = null;
const floors = [];
for (const pkgPath of sourcePkgs) {
  if (!existsSync(pkgPath)) continue;
  const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
  const range = pkg.peerDependencies?.['@angular/core'];
  if (!range) continue;
  const floor = floorFromRange(range);
  if (!floor) continue;
  floors.push(`${pkg.name} -> ${range}`);
  if (!ceiling || compareSemver(floor, ceiling) < 0) ceiling = floor;
}

if (!ceiling) {
  console.error('Could not derive an Angular floor from any package peerDependencies.');
  process.exit(1);
}

function* walk(dir) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) yield* walk(full);
    else if (full.endsWith('.mjs')) yield full;
  }
}

const DECLARATION = /ɵɵngDeclare(\w+)\(\{([^]*?)\}\)/g;
const MIN_VERSION = /minVersion:\s*["']([\d.]+)["']/;
const TYPE_NAME = /type:\s*([\w$.]+)/;

const offenders = [];
const seen = new Map();
let checked = 0;
let declarations = 0;

for (const file of walk(distRoot)) {
  checked++;
  const src = readFileSync(file, 'utf8');
  for (const match of src.matchAll(DECLARATION)) {
    const [, kind, body] = match;
    const min = body.match(MIN_VERSION)?.[1];
    if (!min) continue;
    declarations++;
    seen.set(min, (seen.get(min) ?? 0) + 1);
    if (compareSemver(min, ceiling) > 0) {
      offenders.push({
        file: relative(root, file),
        kind,
        min,
        symbol: body.match(TYPE_NAME)?.[1] ?? '<unknown>',
      });
    }
  }
}

console.log(`Angular floor from peerDependencies: ${ceiling}`);
for (const f of floors) console.log(`  ${f}`);
console.log(`Checked ${declarations} partial declarations across ${checked} built chunks.`);

const ladder = [...seen.entries()].sort(([a], [b]) => compareSemver(a, b));
console.log('minVersion distribution:');
for (const [version, count] of ladder) {
  const flag = compareSemver(version, ceiling) > 0 ? '  <-- ABOVE FLOOR' : '';
  console.log(`  ${version.padEnd(8)} ${String(count).padStart(5)}${flag}`);
}

if (offenders.length) {
  // One entry per symbol: a single bad component fans out across esm + fesm.
  const unique = new Map();
  for (const o of offenders) {
    const key = `${o.symbol}@${o.min}`;
    if (!unique.has(key)) unique.set(key, o);
  }

  console.error(
    `\nminVersion check FAILED — ${unique.size} declaration(s) require Angular newer than ${ceiling}:`,
  );
  for (const o of [...unique.values()].sort((a, b) => compareSemver(b.min, a.min))) {
    console.error(`  ${o.symbol} (${o.kind}) needs >=${o.min}  ${o.file}`);
  }
  console.error(
    `\nThese would fail to link for consumers on Angular ${ceiling}. Either revert the\n` +
      `feature that raised the stamp, or raise the "@angular/core" peer floor in\n` +
      `packages/*/package.json (a breaking change for existing consumers).`,
  );
  process.exit(1);
}

console.log(`\nminVersion check passed — all declarations link on Angular ${ceiling}.`);
