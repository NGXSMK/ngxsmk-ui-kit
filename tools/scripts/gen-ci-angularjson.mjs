// Generates an angular.json containing ONLY the three publishable libraries,
// so the Angular CLI can build them against any Angular major without being
// blocked by version-specific demo/app builder schema differences.
//
// Usage:  node tools/scripts/gen-ci-angularjson.mjs <major>
//   - Angular 17 uses @angular-devkit/build-angular:ng-packagr (requires `project`).
//   - Angular 18+ uses @angular/build:ng-packagr.
import { writeFileSync } from 'node:fs';

const major = process.argv[2];
if (!major) {
  console.error('usage: gen-ci-angularjson.mjs <major>');
  process.exit(1);
}

const is17 = major === '17';
const builder = is17
  ? '@angular-devkit/build-angular:ng-packagr'
  : '@angular/build:ng-packagr';

const libs = ['theme', 'cdk', 'core'];
const projects = {};

for (const lib of libs) {
  const buildOptions = {};
  if (is17) buildOptions.project = `packages/${lib}/ng-package.json`;
  projects[`@ngxsmk/${lib}`] = {
    projectType: 'library',
    root: `packages/${lib}`,
    sourceRoot: `packages/${lib}/src`,
    prefix: 'ngxsmk',
    architect: {
      build: {
        builder,
        options: buildOptions,
        configurations: {
          production: { tsConfig: `packages/${lib}/tsconfig.lib.prod.json` },
          development: { tsConfig: `packages/${lib}/tsconfig.lib.json` },
        },
        defaultConfiguration: 'production',
      },
    },
  };
}

writeFileSync(
  'angular.json',
  JSON.stringify({ version: 1, newProjectRoot: 'projects', projects }, null, 2) + '\n',
);
console.log(`Generated angular.json (Angular ${major}, builder ${builder}).`);
