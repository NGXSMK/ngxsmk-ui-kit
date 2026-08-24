#!/usr/bin/env node
import assert from 'node:assert';
import { migrateSourceContent } from '../../packages/cli/src/migrate.ts';

console.log('🧪 Testing NGXSMK Migration & Codemod Transformations...\n');

// Test 1: Split barrel imports
const legacyImports = `import { NgxsmkButton, NgxsmkCard, NgxsmkDialog } from '@ngxsmk/core';`;
const { updated: updatedImports, changes: changesImports } = migrateSourceContent(legacyImports, 'test.ts');

assert(updatedImports.includes("import { NgxsmkButton } from '@ngxsmk/core/button';"), 'Failed to rewrite NgxsmkButton import');
assert(updatedImports.includes("import { NgxsmkCard } from '@ngxsmk/core/card';"), 'Failed to rewrite NgxsmkCard import');
assert(updatedImports.includes("import { NgxsmkDialog } from '@ngxsmk/core/dialog';"), 'Failed to rewrite NgxsmkDialog import');
assert(!updatedImports.includes("from '@ngxsmk/core';"), 'Should not contain old root barrel import');
console.log('  ✅ Codemod 1: Barrel Import Splitting PASSED');

// Test 2: Rename renderer class
const legacyRenderer = `const renderer = new DefaultButtonRenderer();`;
const { updated: updatedRenderer } = migrateSourceContent(legacyRenderer, 'test.ts');
assert(updatedRenderer.includes('NgxsmkDefaultButtonRenderer'), 'Failed to rename DefaultButtonRenderer');
console.log('  ✅ Codemod 2: Renderer Class Renaming PASSED');

// Test 3: Deprecated [theme] property to [variant]
const legacyHtml = `<ngxsmk-card [theme]="'dark'"></ngxsmk-card>`;
const { updated: updatedHtml } = migrateSourceContent(legacyHtml, 'test.html');
assert(updatedHtml.includes('[variant]="\'dark\'"'), 'Failed to migrate [theme] to [variant]');
console.log('  ✅ Codemod 3: Deprecated Property Binding PASSED');

// Test 4: Deprecated CSS variable
const legacyCss = `color: var(--ngxsmk-color-accent);`;
const { updated: updatedCss } = migrateSourceContent(legacyCss, 'test.css');
assert(updatedCss.includes('var(--ngxsmk-color-primary)'), 'Failed to migrate --ngxsmk-color-accent to --ngxsmk-color-primary');
console.log('  ✅ Codemod 4: Deprecated CSS Variable Fallback PASSED');

// Test 5: Legacy @Input decorator warning
const legacyDecorator = `@Component({}) export class MyComp { @Input() title = ''; }`;
const { warnings } = migrateSourceContent(legacyDecorator, 'my-comp.ts');
assert(warnings.length > 0, 'Failed to produce warning for @Input() decorator');
console.log('  ✅ Codemod 5: Diagnostic Warnings on Legacy Decorators PASSED');

console.log('\n🎉 All 5 Migration Codemods PASSED successfully!\n');
