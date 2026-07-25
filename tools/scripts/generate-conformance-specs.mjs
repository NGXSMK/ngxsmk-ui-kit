#!/usr/bin/env node
/**
 * Generates baseline conformance specs for @ngxsmk/core components.
 *
 * The library has hundreds of components and most of them have no test at all.
 * Hand-writing one suite per component does not scale, but the *floor* every
 * component should clear is identical: it mounts, it logs nothing, it produces
 * no axe violations. That floor is what catches a component wired up wrong —
 * the kind of defect that otherwise ships silently.
 *
 * Eligibility is deliberately conservative. A class is generated for only when
 * it can be mounted with no arguments:
 *   - it is a @Component with an element selector (directives need a host, and
 *     a generic host cannot satisfy arbitrary attribute selectors),
 *   - it declares no `input.required()`, and
 *   - it is not in EXCLUSIONS below.
 *
 * Everything skipped is reported with a reason, so the gap stays visible.
 *
 * Usage:
 *   node tools/scripts/generate-conformance-specs.mjs [--dry-run] [--only <substr>]
 */
import { readdirSync, readFileSync, writeFileSync, statSync, existsSync, rmSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const coreRoot = join(root, 'packages', 'core');

const dryRun = process.argv.includes('--dry-run');
const onlyIndex = process.argv.indexOf('--only');
const only = onlyIndex !== -1 ? process.argv[onlyIndex + 1] : null;

const SPEC_SUFFIX = '.conformance.spec.ts';

/**
 * Classes that cannot be mounted standalone, with the reason. Keep this list
 * short and specific — every entry is a component with no baseline coverage.
 * Populated from real failures, never to silence a genuine bug.
 */
const EXCLUSIONS = new Map([
  // none currently — the eligibility rules above cover every known case
]);

/**
 * Components whose axe audit is not meaningful when mounted empty, because the
 * accessible name or the required child roles come from data the caller
 * supplies through an existing input. These get the mount check without the
 * audit; the audit belongs in a test that supplies that data.
 *
 * This is NOT a place to park real defects — see KNOWN_A11Y_BUGS below.
 */
const EMPTY_STATE_ONLY = new Map([
  ['NgxsmkSlider', 'named via the `ariaLabel` input'],
  ['NgxsmkAvatar', 'named via the `name` input'],
  ['NgxsmkThumbnail', 'named via the `alt` input'],
  ['NgxsmkSpreadsheet', 'role="grid" has no rows until `data` is supplied'],
  ['NgxsmkTransfer', 'role="listbox" has no options until `items` are supplied'],
  ['NgxsmkCalendarHeatmap', 'role="grid" has no cells until `values` are supplied'],
]);

/**
 * Real accessibility defects this suite found, which cannot be fixed without
 * adding public API. Emitted as `it.fails()` so the suite stays green while the
 * defect stays visible — and so the test *starts failing* the moment someone
 * fixes the component, prompting the entry to be removed.
 *
 * Every entry is a component a consumer currently cannot make accessible.
 */
const KNOWN_A11Y_BUGS = new Map([
  ['NgxsmkProgressCircle', 'role="progressbar" with no accessible name and no input to set one'],
  ['NgxsmkNumberInput', 'inner <input> has no label and no ariaLabel input (the +/- buttons do)'],
  ['NgxsmkCodeEditor', 'form control with no labelling API'],
  ['NgxsmkDatePicker', 'form control with no labelling API'],
  ['NgxsmkImageCropper', 'form control with no labelling API'],
  ['NgxsmkAiChat', 'internal icon buttons have no aria-label and the caller cannot supply one'],
  [
    'NgxsmkPromptInput',
    'internal icon buttons have no aria-label and the caller cannot supply one',
  ],
]);

/** Split a source file into decorator/class pairs. */
function extractClasses(src) {
  const found = [];
  // Each decorator starts a segment that runs to the next decorator, so the
  // class body we scan for `input.required()` is the right one.
  const decorators = [...src.matchAll(/@(Component|Directive)\(\{/g)];

  for (let i = 0; i < decorators.length; i++) {
    const start = decorators[i].index;
    const end = i + 1 < decorators.length ? decorators[i + 1].index : src.length;
    const segment = src.slice(start, end);

    const className = segment.match(/export class (\w+)/)?.[1];
    if (!className) continue;

    found.push({
      kind: decorators[i][1],
      className,
      selector: segment.match(/selector:\s*['"`]([^'"`]+)['"`]/)?.[1] ?? null,
      // `model.required()` is as unmountable as `input.required()` — Angular
      // throws NG0952 when the model is read without a value.
      requiredInputs: [...segment.matchAll(/(\w+)\s*=\s*(?:input|model)\.required/g)].map(
        (m) => m[1],
      ),
      // A component injecting another ngxsmk class without `{ optional: true }`
      // needs a parent in the tree and will throw when mounted bare.
      needsParent: /inject\(\s*Ngxsmk\w+\s*\)/.test(segment),
      // A component that projects content takes its accessible name from the
      // caller, so auditing it empty measures the empty state, not the
      // component. Those get the mount check without the axe assertion.
      projectsContent: /<ng-content/.test(segment),
    });
  }

  return found;
}

function isElementSelector(selector) {
  if (!selector) return false;
  // Reject attribute selectors and any comma-list containing one.
  return selector.split(',').every((s) => /^[a-z][\w-]*$/.test(s.trim()));
}

const eligible = [];
const skipped = [];

for (const entry of readdirSync(coreRoot)) {
  const dir = join(coreRoot, entry);
  if (!statSync(dir).isDirectory()) continue;
  if (only && !entry.includes(only)) continue;

  const sources = readdirSync(dir).filter(
    (f) => f.endsWith('.ts') && !f.includes('.spec.') && f !== 'index.ts',
  );

  const classesInDir = [];
  for (const file of sources) {
    const src = readFileSync(join(dir, file), 'utf8');
    for (const cls of extractClasses(src)) {
      const where = `${entry}/${file}`;

      if (EXCLUSIONS.has(cls.className)) {
        skipped.push({ ...cls, where, reason: EXCLUSIONS.get(cls.className) });
        continue;
      }
      if (cls.kind === 'Directive') {
        skipped.push({ ...cls, where, reason: 'directive — needs a host element' });
        continue;
      }
      if (!isElementSelector(cls.selector)) {
        skipped.push({ ...cls, where, reason: `attribute selector (${cls.selector})` });
        continue;
      }
      if (cls.requiredInputs.length) {
        skipped.push({
          ...cls,
          where,
          reason: `required input(s): ${cls.requiredInputs.join(', ')}`,
        });
        continue;
      }
      if (cls.needsParent) {
        skipped.push({ ...cls, where, reason: 'injects a parent component' });
        continue;
      }

      classesInDir.push(cls);
      eligible.push({ ...cls, where });
    }
  }

  const specPath = join(dir, `${entry}${SPEC_SUFFIX}`);

  if (!classesInDir.length) {
    // Nothing eligible any more — drop a stale generated spec if present.
    if (!dryRun && existsSync(specPath)) rmSync(specPath);
    continue;
  }

  const imports = classesInDir.map((c) => c.className).sort();
  const mode = (c) =>
    KNOWN_A11Y_BUGS.has(c.className)
      ? 'bug'
      : c.projectsContent || EMPTY_STATE_ONLY.has(c.className)
        ? 'mount-only'
        : 'full';
  const helpers = [
    ...new Set(
      classesInDir.map((c) =>
        mode(c) === 'mount-only' ? 'expectMountsCleanly' : 'expectConformance',
      ),
    ),
  ].sort();

  const spec = `// GENERATED by tools/scripts/generate-conformance-specs.mjs — do not edit.
// Baseline conformance only. Add behavior tests in ${entry}.spec.ts.
import { describe, it } from 'vitest';
import { ${helpers.join(', ')} } from '@ngxsmk/cdk/testing';
import { ${imports.join(', ')} } from '@ngxsmk/core/${entry}';

describe('${entry} conformance', () => {
${classesInDir
  .map((c) => {
    switch (mode(c)) {
      case 'bug':
        return `  // KNOWN DEFECT: ${KNOWN_A11Y_BUGS.get(c.className)}.
  // Asserted as a failure so the suite stays green while the defect stays
  // visible; this test will start failing once the component is fixed, which
  // is the signal to drop it from KNOWN_A11Y_BUGS in the generator.
  it.fails('${c.className} is accessible', async () => {
    await expectConformance(${c.className});
  });`;
      case 'mount-only':
        return `  // ${
          c.projectsContent
            ? 'Projects content — its accessible name comes from the caller'
            : EMPTY_STATE_ONLY.get(c.className)
        }, so the
  // axe audit belongs in a test that supplies it.
  it('${c.className} mounts cleanly', async () => {
    await expectMountsCleanly(${c.className});
  });`;
      default:
        return `  it('${c.className} mounts cleanly and is accessible', async () => {
    await expectConformance(${c.className});
  });`;
    }
  })
  .join('\n\n')}
});
`;

  if (!dryRun) writeFileSync(specPath, spec);
}

// ── Report ─────────────────────────────────────────────────
const byReason = new Map();
for (const s of skipped) {
  const key = s.reason.replace(/\(.*\)/, '(…)').replace(/:.*/, '');
  byReason.set(key, (byReason.get(key) ?? 0) + 1);
}

console.log(`${dryRun ? '[dry-run] ' : ''}Conformance specs`);
console.log(`  generated for : ${eligible.length} classes`);
console.log(`  skipped       : ${skipped.length} classes`);
for (const [reason, count] of [...byReason].sort((a, b) => b[1] - a[1])) {
  console.log(`      ${String(count).padStart(3)}  ${reason}`);
}

if (process.argv.includes('--verbose')) {
  console.log('\nSkipped detail:');
  for (const s of skipped.sort((a, b) => a.where.localeCompare(b.where))) {
    console.log(`  ${s.className.padEnd(34)} ${s.reason}   (${s.where})`);
  }
}
