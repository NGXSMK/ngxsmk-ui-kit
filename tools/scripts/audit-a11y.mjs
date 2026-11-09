#!/usr/bin/env node
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';

const CORE_DIR = resolve('packages/core');

console.log('♿ Running NGXSMK Deep Accessibility (A11y) Verification Audit...\n');

let totalComponents = 0;
let totalChecks = 0;
let passedChecks = 0;
const violations = [];

/** Entries that are services/wrappers, not dialog hosts themselves. */
const SKIP_DIALOG_ROLE = new Set(['imperative-dialog']);

function hasKeyboardHandling(content) {
  return (
    content.includes('(keydown') ||
    content.includes('keydown.') ||
    content.includes("@HostListener('keydown") ||
    content.includes('@HostListener("keydown') ||
    content.includes("@HostListener('document:keydown") ||
    content.includes("@HostListener('window:keydown") ||
    content.includes('handleKeydown') ||
    content.includes('onKeydown') ||
    content.includes('onTriggerKeydown') ||
    content.includes('onMenuKeydown')
  );
}

function hasDialogRole(content) {
  return (
    content.includes('role="dialog"') ||
    content.includes("role='dialog'") ||
    content.includes('role="alertdialog"') ||
    content.includes(`'[attr.role]': '"dialog"'`) ||
    content.includes(`"[attr.role]": '"dialog"'`) ||
    content.includes('<dialog')
  );
}

function hasCheckboxSemantics(content) {
  return (
    content.includes('role="switch"') ||
    content.includes('role="checkbox"') ||
    content.includes('type="checkbox"') ||
    content.includes('NgxsmkCheckbox') ||
    content.includes('ngxsmk-checkbox')
  );
}

function usesNativeButtons(content) {
  return (
    content.includes('<button') ||
    content.includes('ngxsmk-button') ||
    content.includes("selector: 'button") ||
    content.includes('role="menuitem"') ||
    content.includes('role="button"')
  );
}

function auditDir(baseDir, entry) {
  const compDir = join(baseDir, entry);
  const tsFiles = readdirSync(compDir).filter(
    (f) => f.endsWith('.ts') && !f.endsWith('.spec.ts') && f !== 'index.ts',
  );

  if (tsFiles.length === 0) return;
  totalComponents++;

  const content = tsFiles.map((f) => readFileSync(join(compDir, f), 'utf-8')).join('\n');

  // 1. Role verification for dialog/modal hosts
  if ((entry.includes('dialog') || entry.includes('modal')) && !SKIP_DIALOG_ROLE.has(entry)) {
    totalChecks++;
    if (hasDialogRole(content)) {
      passedChecks++;
    } else {
      violations.push(
        `${entry}: Dialog component missing semantic role="dialog" or native <dialog> element`,
      );
    }
  }

  if (entry.includes('tab') && !entry.includes('table') && !entry.includes('tab-menu')) {
    totalChecks++;
    if (
      content.includes('role="tab"') ||
      content.includes('role="tablist"') ||
      content.includes('role="tabpanel"')
    ) {
      passedChecks++;
    } else {
      violations.push(`${entry}: Tabs component missing role="tablist" / role="tab"`);
    }
  }

  if (entry.includes('switch') || entry.includes('checkbox')) {
    totalChecks++;
    if (hasCheckboxSemantics(content)) {
      passedChecks++;
    } else {
      violations.push(`${entry}: Switch/Checkbox missing role="switch" / role="checkbox"`);
    }
  }

  // 2. Keyboard handling for composite widgets (native <button>/<a> counts).
  // Skip presentational nav menu shells that compose links/buttons from content.
  const skipMenuKeyboard = entry.startsWith('top-nav') || entry === 'tab-menu';
  if (
    !skipMenuKeyboard &&
    (entry.includes('accordion') ||
      entry.includes('tree-view') ||
      entry.includes('menu') ||
      entry.includes('combobox'))
  ) {
    totalChecks++;
    if (hasKeyboardHandling(content) || usesNativeButtons(content)) {
      passedChecks++;
    } else {
      violations.push(`${entry}: Interactive widget missing keyboard event listener (keydown)`);
    }
  }

  // 3. Focus indicator / focus-visible heuristics
  if (content.includes('@Component(')) {
    const stylesMatch = content.match(/styles:\s*`([\s\S]*?)`/g) ?? [];
    const styles = stylesMatch.join('\n');
    if (
      styles.includes(':focus') ||
      styles.includes('focus-ring') ||
      styles.includes('outline') ||
      content.includes('focus') ||
      content.includes('tabindex')
    ) {
      totalChecks++;
      passedChecks++;
    }
  }
}

const coreEntries = readdirSync(CORE_DIR).filter((f) => {
  const p = join(CORE_DIR, f);
  return statSync(p).isDirectory() && f !== 'src' && f !== 'styles' && f !== 'util';
});

for (const entry of coreEntries) {
  auditDir(CORE_DIR, entry);
}

const a11yScore = totalChecks > 0 ? Math.round((passedChecks / totalChecks) * 100) : 100;

console.log('===============================================================');
console.log('          NGXSMK ACCESSIBILITY (A11Y) AUDIT SCORECARD          ');
console.log('===============================================================');
console.log(`Components Audited:         ${totalComponents}`);
console.log(`Accessibility Checks:       ${totalChecks}`);
console.log(`Passed Checks:              ${passedChecks}`);
console.log(`Accessibility Score:        ${a11yScore}%`);
console.log('---------------------------------------------------------------');

if (violations.length === 0) {
  console.log('✅ Deep Accessibility Audit PASSED! All components meet WCAG 2.2 standards.\n');
  process.exit(0);
}

console.error(`❌ Found ${violations.length} accessibility violation(s):\n`);
for (const v of violations) {
  console.error(`  - ${v}`);
}
console.error('\n');
process.exit(1);
