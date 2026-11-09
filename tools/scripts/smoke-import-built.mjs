#!/usr/bin/env node
/**
 * Post-compat-build smoke: verify ng-packagr wrote the three library entry
 * packages under dist/ngxsmk. Used by Compatibility CI on the oldest major.
 */
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const libs = ['theme', 'cdk', 'core'];
const root = process.cwd();
let failed = false;

for (const lib of libs) {
  const pkgPath = join(root, 'dist', 'ngxsmk', lib, 'package.json');
  if (!existsSync(pkgPath)) {
    console.error(`[smoke-import] missing ${pkgPath}`);
    failed = true;
    continue;
  }
  const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
  const entry = pkg.module || pkg.esm2022 || pkg.main || pkg.exports?.['.']?.default;
  if (!entry) {
    console.error(`[smoke-import] ${lib}: package.json has no module/main entry`);
    failed = true;
    continue;
  }
  const resolved = join(root, 'dist', 'ngxsmk', lib, entry);
  if (!existsSync(resolved) && !existsSync(join(root, 'dist', 'ngxsmk', lib, 'fesm2022'))) {
    console.error(`[smoke-import] ${lib}: entry not found (${entry})`);
    failed = true;
    continue;
  }
  console.log(`[smoke-import] ok ${lib} (${pkg.name}@${pkg.version})`);
}

if (failed) {
  process.exit(1);
}
