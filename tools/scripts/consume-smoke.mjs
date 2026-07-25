#!/usr/bin/env node
/**
 * Consumption smoke test: installs the *packed* libraries into a throwaway
 * Angular app on a given major and AOT-builds it.
 *
 * This covers what `compatibility.yml` cannot. That workflow compiles our
 * source under each Angular major, which proves the source is compatible — but
 * consumers never compile our source. They install one prebuilt tarball, and
 * three things can break only on that path:
 *
 *   1. the Angular linker rejecting a partial declaration whose `minVersion`
 *      exceeds the consumer's Angular,
 *   2. `.d.ts` output that the consumer's older TypeScript cannot parse
 *      (we emit with a much newer TS than Angular 17 ships), and
 *   3. a broken `exports` map — wrong subpath, missing types condition.
 *
 * `skipLibCheck` is deliberately **false** so (2) actually fails the build.
 *
 * Usage: node tools/scripts/consume-smoke.mjs <major> [--keep]
 *   Expects `dist/ngxsmk/{theme,cdk,core}` to exist (run `build:libs` first).
 */
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { tmpdir } from 'node:os';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const major = String(process.argv[2] ?? '');
const keep = process.argv.includes('--keep');

if (!/^\d+$/.test(major)) {
  console.error('usage: node tools/scripts/consume-smoke.mjs <major> [--keep]');
  process.exit(1);
}

// Matches publish.mjs: the supported floor is 17.3, not 17.0.
const floor = major === '17' ? '17.3' : major;
// The `application` builder moved packages in v20.
const builderPkg = Number(major) <= 19 ? '@angular-devkit/build-angular' : '@angular/build';
const builder = `${builderPkg}:application`;

const LIBS = ['theme', 'cdk', 'core'];
const app = join(tmpdir(), `ngxsmk-consume-ng${major}`);

const npm = 'npm';
const isWindows = process.platform === 'win32';

/**
 * Windows needs both halves of this: Node refuses to spawn a `.cmd` shim
 * without a shell, and under a shell it does not quote arguments — so any path
 * containing a space (a repo checked out under "My Projects", say) is split.
 * Quote explicitly and let the shell resolve `npm` to `npm.cmd`.
 */
function run(cmd, args, cwd) {
  execFileSync(cmd, isWindows ? args.map((a) => `"${a}"`) : args, {
    cwd,
    stdio: 'inherit',
    shell: isWindows,
  });
}

// ── Pack the built libraries ───────────────────────────────
const distRoot = join(root, 'dist', 'ngxsmk');
for (const lib of LIBS) {
  if (!existsSync(join(distRoot, lib))) {
    console.error(`dist/ngxsmk/${lib} missing — run "npm run build:libs" first.`);
    process.exit(1);
  }
}

rmSync(app, { recursive: true, force: true });
mkdirSync(app, { recursive: true });

const tarballs = [];
for (const lib of LIBS) {
  run(npm, ['pack', join(distRoot, lib), '--pack-destination', app], root);
}
for (const file of readdirSync(app)) {
  if (file.endsWith('.tgz')) tarballs.push(resolve(app, file));
}
if (tarballs.length !== LIBS.length) {
  console.error(`expected ${LIBS.length} tarballs, found ${tarballs.length}`);
  process.exit(1);
}

// Peers @ngxsmk/core declares. Installed so the root barrel — which pulls in
// every entry point, and so type-checks every shipped .d.ts — resolves.
// `@angular/*` peers are pinned to the major under test rather than their
// declared floor, so the app runs one coherent Angular version.
const corePeers = JSON.parse(
  readFileSync(join(root, 'packages/core/package.json'), 'utf8'),
).peerDependencies;

const peerSpec = ([name, range]) =>
  name.startsWith('@angular/') ? `${name}@^${floor}.0` : `${name}@${range}`;

const externalPeers = Object.entries(corePeers)
  .filter(([name]) => !name.startsWith('@ngxsmk/'))
  .map(peerSpec);

// ── Write a minimal standalone app ─────────────────────────
writeFileSync(
  join(app, 'package.json'),
  JSON.stringify({ name: 'ngxsmk-consume-smoke', version: '0.0.0', private: true }, null, 2),
);

writeFileSync(
  join(app, 'tsconfig.json'),
  JSON.stringify(
    {
      compilerOptions: {
        strict: true,
        // The point of the exercise: type-check the shipped .d.ts against this
        // major's TypeScript instead of skipping it.
        skipLibCheck: false,
        target: 'ES2022',
        module: 'ES2022',
        moduleResolution: 'bundler',
        experimentalDecorators: true,
        types: [],
      },
      files: ['src/main.ts'],
    },
    null,
    2,
  ),
);

writeFileSync(
  join(app, 'angular.json'),
  JSON.stringify(
    {
      version: 1,
      projects: {
        smoke: {
          projectType: 'application',
          root: '',
          sourceRoot: 'src',
          architect: {
            build: {
              builder,
              options: {
                browser: 'src/main.ts',
                index: 'src/index.html',
                tsConfig: 'tsconfig.json',
                // Required by the v17 application-builder schema; optional
                // from v18 on, but harmless to always supply.
                outputPath: 'dist/smoke',
              },
            },
          },
        },
      },
    },
    null,
    2,
  ),
);

mkdirSync(join(app, 'src'), { recursive: true });
writeFileSync(
  join(app, 'src/index.html'),
  '<!doctype html><html><body><app-root></app-root></body></html>',
);

// Imports the root barrels so every shipped entry point is resolved and
// type-checked, plus the pieces whose DI wiring we most want exercised.
writeFileSync(
  join(app, 'src/main.ts'),
  `import { Component } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';

import { NgxsmkButton } from '@ngxsmk/core/button';
import { provideNgxsmkIonic } from '@ngxsmk/core/ionic';
import { NgxsmkScrollLock } from '@ngxsmk/cdk/scroll-lock';
import { NGXSMK_PLATFORM_ADAPTER } from '@ngxsmk/cdk/platform';
import { ionicVarsAdapter } from '@ngxsmk/theme';

// Barrel imports: force every entry point's .d.ts through the type-checker.
import * as core from '@ngxsmk/core';
import * as cdk from '@ngxsmk/cdk';
import * as theme from '@ngxsmk/theme';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NgxsmkButton],
  template: \`
    <button ngxsmk-button variant="outline" size="sm" [loading]="true">Save</button>
  \`,
})
export class AppComponent {
  readonly surfaces = [core, cdk, theme].length;
  readonly adapter = ionicVarsAdapter.name;
  readonly tokens = [NgxsmkScrollLock, NGXSMK_PLATFORM_ADAPTER].length;
}

bootstrapApplication(AppComponent, { providers: [provideNgxsmkIonic()] });
`,
);

// ── Install the target toolchain, then build ───────────────
const angularPkgs = [
  `@angular/core@^${floor}.0`,
  `@angular/common@^${floor}.0`,
  `@angular/compiler@^${floor}.0`,
  `@angular/compiler-cli@^${floor}.0`,
  `@angular/platform-browser@^${floor}.0`,
  `@angular/forms@^${floor}.0`,
  `@angular/cli@^${floor}.0`,
  `${builderPkg}@^${floor}.0`,
  'tslib',
  'rxjs',
  'zone.js',
];

console.log(`\n[smoke] Angular ${major}: installing toolchain + peers`);
run(npm, ['install', '--legacy-peer-deps', ...angularPkgs, ...externalPeers], app);

// `--legacy-peer-deps` turns off npm's automatic peer installation, so peers of
// peers never land — yet a consumer's bundler still has to resolve them
// (ngxsmk-tel-input needs @angular/material, which in turn needs
// @angular/animations). Walk the graph to a fixpoint, reading what actually
// landed in node_modules so this stays correct as dependencies change.
const specName = (spec) => spec.slice(0, spec.lastIndexOf('@')) || spec;
const installed = new Set([...angularPkgs, ...externalPeers].map(specName));

// Peers our own packages declare optional still have to resolve, because the
// entry points that use them import them unconditionally (ngxsmk-tel-input
// marks @angular/material optional yet imports it at module scope). Optional
// peers of the *toolchain* are a different thing entirely — karma vs jest vs
// protractor — and a consumer installs none of them.
const ourPeers = new Set(externalPeers.map(specName));

for (let depth = 0; depth < 5; depth++) {
  const missing = new Map();
  for (const name of installed) {
    const manifest = join(app, 'node_modules', name, 'package.json');
    if (!existsSync(manifest)) continue;
    const pkg = JSON.parse(readFileSync(manifest, 'utf8'));
    const peers = pkg.peerDependencies ?? {};
    const meta = pkg.peerDependenciesMeta ?? {};
    for (const entry of Object.entries(peers)) {
      const [peerName] = entry;
      if (meta[peerName]?.optional && !ourPeers.has(name)) continue;
      if (peerName === 'typescript') continue; // pinned deliberately below
      if (installed.has(peerName) || missing.has(peerName)) continue;
      if (peerName.startsWith('@ngxsmk/')) continue; // supplied by the tarballs
      if (existsSync(join(app, 'node_modules', peerName, 'package.json'))) continue;
      missing.set(peerName, peerSpec(entry));
    }
  }
  if (!missing.size) break;

  console.log(`[smoke] installing transitive peers: ${[...missing.keys()].join(', ')}`);
  run(npm, ['install', '--legacy-peer-deps', ...missing.values()], app);
  for (const name of missing.keys()) installed.add(name);
}

const tsPeer = JSON.parse(
  readFileSync(join(app, 'node_modules/@angular/compiler-cli/package.json'), 'utf8'),
).peerDependencies.typescript;
console.log(`[smoke] TypeScript peer for Angular ${major}: ${tsPeer}`);
run(npm, ['install', '--legacy-peer-deps', `typescript@${tsPeer}`], app);

console.log(`[smoke] installing packed @ngxsmk tarballs`);
run(npm, ['install', '--legacy-peer-deps', ...tarballs], app);

console.log(`[smoke] AOT-building against Angular ${major}`);
run('node', [join(app, 'node_modules/@angular/cli/bin/ng.js'), 'build', 'smoke'], app);

console.log(`\n[smoke] Angular ${major} OK — packed libraries consume cleanly.`);

if (!keep) {
  rmSync(app, { recursive: true, force: true });
} else {
  console.log(`[smoke] workspace kept at ${app}`);
}
