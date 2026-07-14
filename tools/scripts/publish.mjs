import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync, existsSync, rmSync } from 'node:fs';

// Build with the LOWEST supported Angular so the partial-Ivy output is
// forward-compatible: a package compiled with an older ng-packagr loads on
// newer Angular, not the reverse. This makes the published artifact work on
// Angular 17.3, 18, 19, 20, 21, and 22.
const ANGULAR = '17';
const LIBS = ['theme', 'cdk', 'core'];

// 1. Pin the lowest-supported Angular toolchain (--no-save: package.json untouched)
console.log(`Installing Angular ${ANGULAR} toolchain...`);
execSync(
  'npm install --no-save --legacy-peer-deps ' +
    `@angular/core@^${ANGULAR}.3.0 @angular/common@^${ANGULAR}.3.0 ` +
    `@angular/compiler@^${ANGULAR}.3.0 @angular/compiler-cli@^${ANGULAR}.3.0 ` +
    `@angular/platform-browser@^${ANGULAR}.3.0 @angular/forms@^${ANGULAR}.3.0 ` +
    `@angular-devkit/build-angular@^${ANGULAR}.3.0 typescript@~5.4.0`,
  { stdio: 'inherit' },
);

// 2. Back up the real angular.json and generate a libs-only one
const backup = 'angular.json.bak-publish';
if (existsSync('angular.json')) writeFileSync(backup, readFileSync('angular.json'));
execSync(`node tools/scripts/gen-ci-angularjson.mjs ${ANGULAR}`, { stdio: 'inherit' });

try {
  // 3. Build all three libraries with the matching Angular CLI
  for (const lib of LIBS) {
    execSync(
      `npx -p @angular/cli@${ANGULAR} ng build --project @ngxsmk/${lib} --configuration development`,
      { stdio: 'inherit' },
    );
  }
  // 4. Publish (public via publishConfig in each package.json)
  for (const lib of ['cdk', 'theme', 'core']) {
    execSync(`npm publish ./dist/ngxsmk/${lib} --access public`, { stdio: 'inherit' });
  }
  console.log(`\nPublished @ngxsmk/{cdk,theme,core} @1.0.0 (built with Angular ${ANGULAR}).`);
} finally {
  // 5. Always restore angular.json
  if (existsSync(backup)) {
    writeFileSync('angular.json', readFileSync(backup));
    rmSync(backup);
  }
  console.log('Run `npm ci` to restore the development toolchain.');
}
