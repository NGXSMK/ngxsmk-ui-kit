import { spawnSync } from 'node:child_process';
import { readFileSync, rmSync } from 'node:fs';

const major = String(process.argv[2] ?? '');
if (!major) {
  console.error('usage: node tools/scripts/verify-compat.mjs <major>');
  process.exit(1);
}

const BUILDER =
  major === '17' || major === '18'
    ? '@angular-devkit/build-angular'
    : '@angular/build';

// The supported floor is 17.3 (signal `output()` etc.), so the 17 job must
// install the 17.3 line, not the 17.0 line.
const floor = major === '17' ? '17.3' : major;

const pkgs = [
  `@angular/core@^${floor}.0`,
  `@angular/common@^${floor}.0`,
  `@angular/compiler@^${floor}.0`,
  `@angular/compiler-cli@^${floor}.0`,
  `@angular/platform-browser@^${floor}.0`,
  `@angular/forms@^${floor}.0`,
  `@angular/animations@^${floor}.0`,
  `@angular/cdk@^${floor}.0`,
  `ng-packagr@^${floor}.0`,
  `@angular/cli@^${floor}.0`,
  `${BUILDER}@^${floor}.0`,
  `tslib`,
];

const ng = 'node_modules/@angular/cli/bin/ng.js';
const libs = ['@ngxsmk/theme', '@ngxsmk/cdk', '@ngxsmk/core'];

function run(cmd, args, opts = {}) {
  const r = spawnSync(cmd, args, { stdio: 'inherit', shell: true, ...opts });
  if (r.status !== 0) {
    throw new Error(`failed: ${cmd} ${args.join(' ')} (exit ${r.status})`);
  }
}

function readInstalledAngularVersion() {
  try {
    return JSON.parse(readFileSync('node_modules/@angular/core/package.json', 'utf8')).version;
  } catch {
    return 'unknown';
  }
}

let failed = false;
try {
  console.log(`\n[verify] === Angular ${major} :: installing toolchain ===`);
  run('npm', ['install', '--no-save', '--legacy-peer-deps', ...pkgs]);

  // The installed Angular patch dictates the required TypeScript range.
  const tsPeer = JSON.parse(readFileSync('node_modules/@angular/compiler-cli/package.json', 'utf8'))
    .peerDependencies?.typescript;
  if (!tsPeer) {
    throw new Error('could not read @angular/compiler-cli typescript peer range');
  }
  console.log(
    `[verify] Angular ${major} resolved to ${readInstalledAngularVersion()}, typescript peer "${tsPeer}"`,
  );
  // Re-list the Angular packages so npm does not prune them as extraneous
  // while adding the matching TypeScript version.
  run('npm', ['install', '--no-save', '--legacy-peer-deps', ...pkgs, `"typescript@${tsPeer}"`]);
  run('node', ['tools/scripts/gen-ci-angularjson.mjs', major]);

  // Avoid stale output confusing ng-packagr's secondary-entry-point builds.
  rmSync('dist', { recursive: true, force: true });

  for (const lib of libs) {
    console.log(`[verify] building ${lib}`);
    run('node', [ng, 'build', lib, '--configuration', 'development']);
  }

  console.log(`[verify] Angular ${major} OK`);
} catch (e) {
  console.error(`[verify] Angular ${major} FAILED: ${e.message}`);
  failed = true;
} finally {
  try {
    run('node', ['tools/scripts/gen-ci-angularjson.mjs', '--restore']);
  } catch {}
}

process.exit(failed ? 1 : 0);
