#!/usr/bin/env node
/**
 * Per-entry-point bundle size audit for the built @ngxsmk packages.
 *
 * Measures the gzipped size of every FESM chunk in dist/ngxsmk and compares
 * it against tools/bundle-size-baseline.json.
 *
 * Usage:
 *   node tools/scripts/check-bundle-sizes.mjs            # check against baseline
 *   node tools/scripts/check-bundle-sizes.mjs --update   # rewrite the baseline
 *   node tools/scripts/check-bundle-sizes.mjs --top 20   # also print the 20 largest entries
 *
 * A check fails when an entry grows more than TOLERANCE over its baseline,
 * or when a new entry appears without a baseline (run --update to accept it).
 */
import { readdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { gzipSync } from 'node:zlib';

const TOLERANCE = 0.1; // 10% growth allowed over baseline

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const distRoot = join(root, 'dist', 'ngxsmk');
const baselinePath = join(root, 'tools', 'bundle-size-baseline.json');

const update = process.argv.includes('--update');
const topIdx = process.argv.indexOf('--top');
const topN = topIdx > -1 ? Number(process.argv[topIdx + 1]) || 15 : 0;

if (!existsSync(distRoot)) {
  console.error(`dist not found at ${distRoot} — run "npm run build:libs" first.`);
  process.exit(1);
}

/** @type {Record<string, number>} entry name -> gzipped bytes */
const sizes = {};
for (const pkg of readdirSync(distRoot)) {
  const fesmDir = join(distRoot, pkg, 'fesm2022');
  if (!existsSync(fesmDir)) continue;
  for (const file of readdirSync(fesmDir)) {
    if (!file.endsWith('.mjs')) continue;
    const entry = `${pkg}/${file.replace(/^ngxsmk-[^-]+-?/, '').replace(/\.mjs$/, '') || pkg}`;
    sizes[entry] = gzipSync(readFileSync(join(fesmDir, file))).length;
  }
}

const total = Object.values(sizes).reduce((a, b) => a + b, 0);
const kb = (b) => `${(b / 1024).toFixed(1)} kB`;

if (update) {
  writeFileSync(baselinePath, JSON.stringify(sizes, null, 2) + '\n');
  console.log(
    `Baseline updated: ${Object.keys(sizes).length} entries, ${kb(total)} gzipped total.`,
  );
  process.exit(0);
}

if (!existsSync(baselinePath)) {
  console.error('No baseline found. Run with --update to create tools/bundle-size-baseline.json.');
  process.exit(1);
}

/** @type {Record<string, number>} */
const baseline = JSON.parse(readFileSync(baselinePath, 'utf8'));

const failures = [];
const removed = Object.keys(baseline).filter((e) => !(e in sizes));

for (const [entry, size] of Object.entries(sizes)) {
  const base = baseline[entry];
  if (base === undefined) {
    failures.push(`NEW    ${entry}: ${kb(size)} (no baseline — run --update to accept)`);
  } else if (size > base * (1 + TOLERANCE)) {
    const pct = (((size - base) / base) * 100).toFixed(1);
    failures.push(
      `GREW   ${entry}: ${kb(base)} -> ${kb(size)} (+${pct}%, limit +${TOLERANCE * 100}%)`,
    );
  }
}

if (topN) {
  console.log(`\nTop ${topN} largest entries (gzipped):`);
  for (const [entry, size] of Object.entries(sizes)
    .sort((a, b) => b[1] - a[1])
    .slice(0, topN)) {
    console.log(`  ${kb(size).padStart(9)}  ${entry}`);
  }
}

console.log(`\nChecked ${Object.keys(sizes).length} entries, ${kb(total)} gzipped total.`);
if (removed.length) {
  console.log(
    `Note: ${removed.length} baseline entries no longer exist (run --update to prune): ${removed.join(', ')}`,
  );
}

if (failures.length) {
  console.error(`\nBundle size check FAILED (${failures.length}):`);
  for (const f of failures) console.error(`  ${f}`);
  process.exit(1);
}
console.log('Bundle size check passed.');
