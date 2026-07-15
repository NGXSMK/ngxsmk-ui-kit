// Rewrites relative secondary-entry-point re-exports in a library's
// public-api.ts to package specifiers, e.g.
//   export * from './button'  ->  export * from '@ngxsmk/core/button'
// Only names that are real secondary entry points (have an ng-package.json)
// are rewritten, so relative internal modules (e.g. theme's './lib/*') are
// left untouched. This is required by ng-packagr across all Angular majors
// (relative re-exports double-compile the secondary and break the build).
// Line endings are preserved.
import { readFileSync, writeFileSync, existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const libs = ['cdk', 'core'];

function subdirs(p) {
  return readdirSync(p, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name);
}

for (const lib of libs) {
  const root = join('packages', lib);
  // Collect secondary entry-point directory names (any subdir with ng-package.json).
  const secondaries = new Set();
  for (const name of subdirs(root)) {
    if (existsSync(join(root, name, 'ng-package.json'))) secondaries.add(name);
  }

  const apiPath = join(root, 'public-api.ts');
  const content = readFileSync(apiPath, 'utf8');
  const re = /(export \* from ')\.\/([^']+)(';)(\r?)/g;
  let changed = 0;
  const out = content.replace(re, (m, p1, name, p3, cr) => {
    if (!secondaries.has(name)) return m;
    changed++;
    return `${p1}@ngxsmk/${lib}/${name}${p3}${cr}`;
  });
  writeFileSync(apiPath, out);
  console.log(`@ngxsmk/${lib}: rewrote ${changed} secondary re-exports in public-api.ts`);
}
