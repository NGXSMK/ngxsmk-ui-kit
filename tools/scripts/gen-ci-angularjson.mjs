// Generates an angular.json containing ONLY the three publishable libraries,
// so the Angular CLI can build them against any Angular major without being
// blocked by version-specific demo/app builder schema differences or by the
// root tsconfig's modern defaults (e.g. `module: "preserve"`, which TS <5.4
// rejects, and `importHelpers`, which older ng-packagr cannot resolve tslib
// for). Each library gets a generated `tsconfig.lib.compat.json` that reuses
// the real lib config but neutralizes those two options, while keeping the
// `@ngxsmk/*` path mappings required for cross-entry-point imports.
//
// Usage:  node tools/scripts/gen-ci-angularjson.mjs <major>
//         node tools/scripts/gen-ci-angularjson.mjs --restore
import {
  writeFileSync,
  rmSync,
  existsSync,
  renameSync,
} from "node:fs";

const major = process.argv[2];
if (!major) {
  console.error("usage: gen-ci-angularjson.mjs <major> | --restore");
  process.exit(1);
}

const libs = ["theme", "cdk", "core"];
const builder = "@angular-devkit/build-angular:ng-packagr";
const ANGULAR_JSON = "angular.json";
const BACKUP = "angular.json.bak";

if (major === "--restore") {
  for (const lib of libs) {
    const p = `packages/${lib}/tsconfig.lib.compat.json`;
    if (existsSync(p)) rmSync(p);
  }
  // Idempotent: only restore if a backup exists; otherwise leave angular.json
  // (which is the real/original one) untouched.
  if (existsSync(BACKUP)) {
    if (existsSync(ANGULAR_JSON)) rmSync(ANGULAR_JSON);
    renameSync(BACKUP, ANGULAR_JSON);
    console.log("Restored original angular.json.");
  }
  process.exit(0);
}

// Back up the real angular.json once (so --restore can bring it back).
if (existsSync(ANGULAR_JSON) && !existsSync(BACKUP)) {
  renameSync(ANGULAR_JSON, BACKUP);
}

// Write per-library compat tsconfig that overrides version-sensitive options
// (module / moduleResolution / importHelpers) while inheriting the root
// `paths` mapping so cross-library imports (@ngxsmk/cdk from core) resolve.
// Secondary entry points are re-exported via package specifiers
// (@ngxsmk/cdk/focusable) so ng-packagr does not double-compile them.
const compatTsConfig = {
  extends: "./tsconfig.lib.json",
  compilerOptions: {
    module: "esnext",
    moduleResolution: "bundler",
    importHelpers: false,
  },
};

const projects = {};
for (const lib of libs) {
  const compatPath = `packages/${lib}/tsconfig.lib.compat.json`;
  writeFileSync(compatPath, JSON.stringify(compatTsConfig, null, 2) + "\n");
  projects[`@ngxsmk/${lib}`] = {
    projectType: "library",
    root: `packages/${lib}`,
    sourceRoot: `packages/${lib}/src`,
    prefix: "ngxsmk",
    architect: {
      build: {
        builder,
        options: {
          project: `packages/${lib}/ng-package.json`,
          tsConfig: compatPath,
        },
        configurations: {
          production: { tsConfig: compatPath },
          development: { tsConfig: compatPath },
        },
        defaultConfiguration: "production",
      },
    },
  };
}

writeFileSync(
  "angular.json",
  JSON.stringify({ version: 1, newProjectRoot: "projects", projects }, null, 2) +
    "\n"
);
console.log(`Generated angular.json (Angular ${major}, builder ${builder}).`);
