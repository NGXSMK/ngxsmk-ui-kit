import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync, existsSync, rmSync } from 'node:fs';

// Build with the LOWEST supported Angular so the partial-Ivy output is
// forward-compatible: a package compiled with an older ng-packagr loads on
// newer Angular, not the reverse. This makes the published artifact work on
// Angular 17.3, 18, 19, 20, 21, and 22.
const ANGULAR = '17';
const FLOOR = '17.3';
const LIBS = ['theme', 'cdk', 'core'];
const BUILDER = '@angular-devkit/build-angular'; // Angular 17 uses legacy builder

const run = (cmd) => execSync(cmd, { stdio: 'inherit' });

// 1. Pin the lowest-supported Angular toolchain (--no-save: package.json untouched).
//    Two-pass install: first pin the Angular packages so we can read the correct
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
  `${BUILDER}@^${FLOOR}.0`,
  'tslib',
].join(' ');

run(`npm install --no-save --legacy-peer-deps ${PKGS}`);

const tsRange = JSON.parse(
  readFileSync('./node_modules/@angular/compiler-cli/package.json', 'utf8'),
).peerDependencies.typescript;
console.log(`TypeScript peer for Angular ${ANGULAR}: ${tsRange}`);

run(`npm install --no-save --legacy-peer-deps typescript@"${tsRange}" ${PKGS}`);

// 2. Back up the real angular.json and generate a libs-only one.
const backup = 'angular.json.bak-publish';
if (existsSync('angular.json')) writeFileSync(backup, readFileSync('angular.json'));
run(`node tools/scripts/gen-ci-angularjson.mjs ${ANGULAR}`);

try {
  // 3. Build all three libraries with the matching Angular CLI in production
  //    (partial compilation mode — required for npm publish).
  console.log('\nBuilding libraries in partial compilation mode...');
  for (const lib of LIBS) {
    run(
      `npx -p @angular/cli@${ANGULAR} ng build --project @ngxsmk/${lib} --configuration production`,
    );
  }

  // 4. Publish (public via publishConfig in each package.json).
  console.log('\nPublishing packages...');
  for (const lib of ['cdk', 'theme', 'core']) {
    run(`npm publish ./dist/ngxsmk/${lib} --access public`);
  }

  const version = JSON.parse(readFileSync('./packages/core/package.json', 'utf8')).version;
  console.log(`\n✓ Published @ngxsmk/{cdk,theme,core}@${version} (built with Angular ${ANGULAR}).`);
} finally {
  // 5. Always restore angular.json.
  if (existsSync(backup)) {
    writeFileSync('angular.json', readFileSync(backup));
    rmSync(backup);
    console.log('\nRestored angular.json.');
  }
  console.log('Run `npm install` to restore the Angular 22 development toolchain.');
}
