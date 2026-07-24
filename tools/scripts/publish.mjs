import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync, existsSync, rmSync, renameSync } from 'node:fs';

// Build with the LOWEST supported Angular so the partial-Ivy output is
// forward-compatible: a package compiled with an older ng-packagr loads on
// newer Angular, not the reverse. This makes the published artifact work on
// Angular 17.3, 18, 19, 20, 21, and 22.
const ANGULAR = '17';
const FLOOR = '17.3';
const LIBS = ['theme', 'cdk', 'core'];
const BUILDER = '@angular-devkit/build-angular:ng-packagr';
const ANGULAR_JSON = 'angular.json';
const BACKUP = 'angular.json.bak-publish';

const run = (cmd) => execSync(cmd, { stdio: 'inherit' });

// 1. Pin the lowest-supported Angular toolchain (--no-save: package.json untouched).
//    Two-pass install: first pin Angular packages so we can read the correct
//    TypeScript peer range from compiler-cli, then reinstall everything together
//    with the matched TypeScript — this prevents npm from rolling back Angular packages.
console.log(`\nInstalling Angular ${ANGULAR} toolchain...`);
const PKGS = [
  `@angular/core@^${FLOOR}.0`,
  `@angular/common@^${FLOOR}.0`,
  `@angular/compiler@^${FLOOR}.0`,
  `@angular/compiler-cli@^${FLOOR}.0`,
  `@angular/platform-browser@^${FLOOR}.0`,
  `@angular/forms@^${FLOOR}.0`,
  `@angular/animations@^${FLOOR}.0`,
  `@angular/cdk@^${FLOOR}.0`,
  `ng-packagr@^${FLOOR}.0`,
  `@angular/cli@^${FLOOR}.0`,
  `@angular-devkit/build-angular@^${FLOOR}.0`,
  'tslib',
].join(' ');

run(`npm install --no-save --legacy-peer-deps ${PKGS}`);

const tsRange = JSON.parse(
  readFileSync('./node_modules/@angular/compiler-cli/package.json', 'utf8'),
).peerDependencies.typescript;
console.log(`TypeScript peer for Angular ${ANGULAR}: ${tsRange}`);

run(`npm install --no-save --legacy-peer-deps typescript@"${tsRange}" ${PKGS}`);

// 2. Back up the real angular.json and write a libs-only one inline.
//    (We do NOT call gen-ci-angularjson.mjs to avoid its own backup chain.)
if (existsSync(ANGULAR_JSON)) renameSync(ANGULAR_JSON, BACKUP);

const compatTsConfig = {
  extends: './tsconfig.lib.json',
  compilerOptions: { module: 'esnext', moduleResolution: 'bundler', importHelpers: false },
  angularCompilerOptions: { compilationMode: 'partial' },
};

const projects = {};
for (const lib of LIBS) {
  const compatPath = `packages/${lib}/tsconfig.lib.compat.json`;
  writeFileSync(compatPath, JSON.stringify(compatTsConfig, null, 2) + '\n');
  projects[`@ngxsmk/${lib}`] = {
    projectType: 'library',
    root: `packages/${lib}`,
    sourceRoot: `packages/${lib}/src`,
    prefix: 'ngxsmk',
    architect: {
      build: {
        builder: BUILDER,
        options: { project: `packages/${lib}/ng-package.json`, tsConfig: compatPath },
        configurations: {
          production: { tsConfig: compatPath },
          development: { tsConfig: compatPath },
        },
        defaultConfiguration: 'production',
      },
    },
  };
}
writeFileSync(
  ANGULAR_JSON,
  JSON.stringify({ version: 1, newProjectRoot: 'projects', projects }, null, 2) + '\n',
);

try {
  // 3. Clean any stale dist artifacts, then build all three libraries.
  //    Partial compilation mode is guaranteed by the compat tsconfig above.
  console.log('\nCleaning dist and rebuilding libraries in partial compilation mode...');
  if (existsSync('dist')) rmSync('dist', { recursive: true, force: true });
  for (const lib of LIBS) {
    run(`node node_modules/@angular/cli/bin/ng.js build @ngxsmk/${lib} --configuration production`);
  }

  // 4. Publish (public via publishConfig in each package.json).
  console.log('\nPublishing packages...');
  for (const lib of ['cdk', 'theme', 'core']) {
    run(`npm publish ./dist/ngxsmk/${lib} --access public`);
  }

  const version = JSON.parse(readFileSync('./packages/core/package.json', 'utf8')).version;
  console.log(`\n✓ Published @ngxsmk/{cdk,theme,core}@${version} (built with Angular ${ANGULAR}).`);
} finally {
  // 5. Always restore angular.json and clean up generated compat tsconfigs.
  for (const lib of LIBS) {
    const p = `packages/${lib}/tsconfig.lib.compat.json`;
    if (existsSync(p)) rmSync(p);
  }
  if (existsSync(BACKUP)) {
    if (existsSync(ANGULAR_JSON)) rmSync(ANGULAR_JSON);
    renameSync(BACKUP, ANGULAR_JSON);
    console.log('\nRestored angular.json.');
  }

  // 6. Auto-restore the Angular 22 development toolchain so the workspace is
  //    immediately usable after publish without any manual step.
  console.log('\nRestoring Angular 22 development toolchain...');
  run('npm install');
  console.log('✓ Development toolchain restored. Ready to use.');
}
