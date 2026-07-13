import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  renameSync,
  statSync,
  writeFileSync,
} from 'node:fs';
import { basename, dirname, join, relative, resolve, sep } from 'node:path';

/**
 * Migrates a package to ng-packagr secondary entry points so consumers can
 * import individual modules, e.g. `from '@ngxsmk/core/select'`.
 *
 * Strategy:
 *  - Move each module currently under `src/lib/<path>` into its own entry-point
 *    directory `pkgRoot/<firstSegment>/` (ng-packagr sets rootDir per entry
 *    point, so each entry must own its source).
 *  - Generate `<entry>/index.ts` (re-exporting the module) + `<entry>/ng-package.json`.
 *  - Rewrite relative imports that cross entry-point boundaries to the package
 *    alias `@ngxsmk/<scope>/<entry>`.
 *  - Regenerate the root `public-api.ts` to re-export each entry (`export * from './<entry>'`),
 *    preserving the flat `@ngxsmk/<scope>` import for backward compatibility.
 *
 * Usage: tsx tools/scripts/migrate-secondary-entry-points.ts <pkgRoot> <scope>
 *   e.g. tsx tools/scripts/migrate-secondary-entry-points.ts packages/core core
 */

const pkgRoot = resolve(process.cwd(), process.argv[2]);
const scope = process.argv[3];
const libDir = join(pkgRoot, 'src', 'lib');
const publicApiPath = join(pkgRoot, 'src', 'public-api.ts');

if (!existsSync(publicApiPath)) {
  console.error(`No public-api.ts at ${publicApiPath}`);
  process.exit(1);
}

const content = readFileSync(publicApiPath, 'utf8');
const re = /export\s+\*\s+from\s+['"]\.\/lib\/([^'"]+)['"]/g;
interface Entry {
  firstSeg: string;
  rest: string; // module path inside the entry dir (e.g. 'select' or 'id')
  path: string; // full './lib/...' path without './lib/'
}
const entries: Entry[] = [];
let m: RegExpExecArray | null;
while ((m = re.exec(content))) {
  const path = m[1];
  const segs = path.split('/');
  entries.push({ firstSeg: segs[0], rest: segs.slice(1).join('/'), path });
}

const isDir = (p: string) => statSync(p).isDirectory();

// 1. Move each module into its entry-point directory.
const moved: string[] = [];
for (const e of entries) {
  const dirSrc = join(libDir, e.firstSeg);
  const fileSrc = join(libDir, `${e.firstSeg}.ts`);
  const src = existsSync(dirSrc) && isDir(dirSrc) ? dirSrc : fileSrc;
  const dest = join(pkgRoot, e.firstSeg);
  if (!existsSync(src)) {
    console.warn(`  ! source missing: ${src}`);
    continue;
  }
  mkdirSync(dest, { recursive: true });
  if (isDir(src)) {
    // Move the whole directory's contents up into dest.
    for (const child of readdirSync(src)) {
      renameSync(join(src, child), join(dest, child));
    }
  } else {
    // Flat file (e.g. cdk): place it as <firstSeg>.ts inside the entry dir.
    renameSync(src, join(dest, `${e.firstSeg}.ts`));
    e.rest = e.firstSeg;
  }
  moved.push(e.firstSeg);
}
console.log(`  moved ${moved.length} modules`);

// 2. Generate index.ts + ng-package.json for each entry.
for (const e of entries) {
  const dest = join(pkgRoot, e.firstSeg);
  if (!existsSync(dest)) continue;
  const exportTarget = e.rest || e.firstSeg;
  writeFileSync(join(dest, 'index.ts'), `export * from './${exportTarget}';\n`);
  const ngPkg = {
    $schema: '../../../node_modules/ng-packagr/ng-package.schema.json',
    lib: { entryFile: 'index.ts' },
  };
  writeFileSync(join(dest, 'ng-package.json'), JSON.stringify(ngPkg, null, 2) + '\n');
}

// 3. Rewrite cross-entry-point relative imports to package aliases.
const entryNames = new Set(entries.map((e) => e.firstSeg));
const entryDirs = entries.map((e) => join(pkgRoot, e.firstSeg));
const importRe =
  /(import\s+(?:[\w*{},\s]*\s+from\s+)?|export\s+(?:[\w*{},\s]*\s+from\s+)?|import\s+)(['"])(\.\.?\/[^'"]+)\2/g;

const resolveEntry = (filePath: string): string | null => {
  for (const d of entryDirs) {
    if (filePath === d || filePath.startsWith(d + sep)) return d;
  }
  return null;
};

const localFileExists = (base: string): boolean =>
  existsSync(base) || existsSync(base + '.ts') || existsSync(join(base, 'index.ts'));

const walk = (dir: string): string[] => {
  const out: string[] = [];
  if (!existsSync(dir)) return out;
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) out.push(...walk(p));
    else if (p.endsWith('.ts')) out.push(p);
  }
  return out;
};

for (const entryDir of entryDirs) {
  for (const file of walk(entryDir)) {
    const srcText = readFileSync(file, 'utf8');
    let changed = false;
    const newText = srcText.replace(importRe, (full, pre, q, spec) => {
      if (!spec.startsWith('.')) return full;
      // Prefer real filesystem resolution (handles ../sibling/sibling etc.).
      let targetEntry = resolveEntry(resolve(dirname(file), spec));
      if (!targetEntry) {
        // Extension-less relative import into a sibling entry,
        // e.g. ./focusable from inside focus-trap after the flat file moved.
        const segs = spec.split('/');
        const idx = segs[0] === '.' || segs[0] === '..' ? 1 : 0;
        const name = segs[idx];
        const rest = segs.slice(idx + 1).join('/');
        if (name && entryNames.has(name) && !localFileExists(join(dirname(file), spec))) {
          targetEntry = join(pkgRoot, name);
          if (rest) return `${pre}${q}@ngxsmk/${scope}/${name}/${rest}${q}`;
        }
      }
      const srcEntry = resolveEntry(file);
      if (targetEntry && srcEntry && targetEntry !== srcEntry) {
        const name = basename(targetEntry);
        changed = true;
        return `${pre}${q}@ngxsmk/${scope}/${name}${q}`;
      }
      return full;
    });
    if (changed) writeFileSync(file, newText);
  }
}
console.log('  rewrote cross-entry imports');

// 4. Regenerate root public-api.ts re-exporting each entry.
const newPublicApi = [
  `/*`,
  ` * Public API Surface of @ngxsmk/${scope}`,
  ` */`,
  '',
  ...entries.map((e) => `export * from './${e.firstSeg}';`),
  '',
].join('\n');
writeFileSync(join(pkgRoot, 'public-api.ts'), newPublicApi);
console.log(`  wrote ${join(pkgRoot, 'public-api.ts')}`);

console.log(`\nDone: ${moved.length} secondary entry points in @ngxsmk/${scope}`);
