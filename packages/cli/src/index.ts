#!/usr/bin/env node
import { runMigration } from './migrate';

export * from './migrate';

const args = process.argv.slice(2);
const command = args[0];

if (command === 'migrate') {
  const dryRun = args.includes('--dry-run');
  const targetIdx = args.indexOf('--target');
  const targetVersion = targetIdx > -1 ? args[targetIdx + 1] : 'latest';

  console.log(
    `🚀 Running NGXSMK Migration Engine (target: ${targetVersion}, dryRun: ${dryRun})...\n`,
  );

  const result = runMigration({
    cwd: process.cwd(),
    dryRun,
    targetVersion,
  });

  console.log('===============================================================');
  console.log('                 NGXSMK MIGRATION REPORT                       ');
  console.log('===============================================================');
  console.log(`Files Scanned:              ${result.filesScanned}`);
  console.log(`Files Modified:             ${result.filesModified}`);
  console.log(`Codemod Changes Applied:    ${result.changesApplied.length}`);
  console.log(`Migration Warnings:         ${result.warnings.length}`);
  console.log('---------------------------------------------------------------');

  if (result.changesApplied.length > 0) {
    console.log('Applied Codemods:');
    for (const c of result.changesApplied.slice(0, 10)) {
      console.log(`  - ${c.file}: ${c.description}`);
    }
    if (result.changesApplied.length > 10) {
      console.log(`  ... and ${result.changesApplied.length - 10} more`);
    }
  }

  if (result.warnings.length > 0) {
    console.log('\nWarnings:');
    for (const w of result.warnings.slice(0, 10)) {
      console.warn(`  ⚠️ ${w}`);
    }
  }

  if (dryRun) {
    console.log('\n💡 Dry-run complete. Run with `ngxsmk migrate` to apply changes.\n');
  } else {
    console.log('\n✅ Migration completed successfully!\n');
  }
} else if (command === '--help' || command === '-h' || !command) {
  console.log(`
NGXSMK CLI - Enterprise Angular UI Kit Utilities

Usage:
  ngxsmk migrate [--dry-run] [--target <version>]   Migrate and apply automated codemods
  ngxsmk --help                                     Show CLI help
`);
}
