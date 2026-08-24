import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join, extname } from 'node:path';

export interface MigrationOptions {
  cwd?: string;
  dryRun?: boolean;
  targetVersion?: string;
}

export interface MigrationResult {
  filesScanned: number;
  filesModified: number;
  warnings: string[];
  changesApplied: { file: string; description: string }[];
}

/**
 * Migration mappings from legacy barrel import identifiers to secondary entry points.
 */
const IMPORT_MAPPINGS: Record<string, string> = {
  NgxsmkButton: '@ngxsmk/core/button',
  NgxsmkCard: '@ngxsmk/core/card',
  NgxsmkCardHeader: '@ngxsmk/core/card',
  NgxsmkCardTitle: '@ngxsmk/core/card',
  NgxsmkCardDescription: '@ngxsmk/core/card',
  NgxsmkCardContent: '@ngxsmk/core/card',
  NgxsmkCardFooter: '@ngxsmk/core/card',
  NgxsmkDialog: '@ngxsmk/core/dialog',
  NgxsmkFormField: '@ngxsmk/core/form-field',
  NgxsmkInputDirective: '@ngxsmk/core/input',
  NgxsmkSwitch: '@ngxsmk/core/switch',
  NgxsmkCheckbox: '@ngxsmk/core/checkbox',
  NgxsmkTabs: '@ngxsmk/core/tabs',
  NgxsmkTab: '@ngxsmk/core/tabs',
  NgxsmkAlert: '@ngxsmk/core/alert',
  NgxsmkBadge: '@ngxsmk/core/badge',
  NgxsmkPinInput: '@ngxsmk/core/pin-input',
  NgxsmkAiChat: '@ngxsmk/core/ai-chat',
  NgxsmkPromptInput: '@ngxsmk/core/prompt-input',
  NgxsmkVirtualScroll: '@ngxsmk/core/virtual-scroll',
  NgxsmkTable: '@ngxsmk/core/table',
};

/**
 * Applies automated AST-like codemods to a single file content.
 */
export function migrateSourceContent(content: string, filePath = ''): { updated: string; changes: string[]; warnings: string[] } {
  let updated = content;
  const changes: string[] = [];
  const warnings: string[] = [];

  // 1. Codemod: Rewrite barrel imports `import { ... } from '@ngxsmk/core'` to secondary entry points
  const barrelImportRegex = /import\s*\{([^}]+)\}\s*from\s*['"]@ngxsmk\/core['"];?/g;
  updated = updated.replace(barrelImportRegex, (match, importsStr) => {
    const symbols = importsStr
      .split(',')
      .map((s: string) => s.trim())
      .filter(Boolean);

    const grouped: Record<string, string[]> = {};
    const unmapped: string[] = [];

    for (const sym of symbols) {
      const target = IMPORT_MAPPINGS[sym];
      if (target) {
        grouped[target] = grouped[target] || [];
        grouped[target].push(sym);
      } else {
        unmapped.push(sym);
      }
    }

    const statements: string[] = [];
    for (const [entry, syms] of Object.entries(grouped)) {
      statements.push(`import { ${syms.join(', ')} } from '${entry}';`);
    }

    if (unmapped.length > 0) {
      statements.push(`import { ${unmapped.join(', ')} } from '@ngxsmk/core';`);
      warnings.push(`[${filePath}] Could not automatically resolve secondary entry point for: ${unmapped.join(', ')}`);
    }

    changes.push(`Split barrel import into ${statements.length} secondary entry point(s)`);
    return statements.join('\n');
  });

  // 2. Codemod: Rename legacy renderer classes
  if (updated.includes('DefaultButtonRenderer')) {
    updated = updated.replace(/\bDefaultButtonRenderer\b/g, 'NgxsmkDefaultButtonRenderer');
    changes.push('Renamed DefaultButtonRenderer to NgxsmkDefaultButtonRenderer');
  }

  // 3. Codemod: Deprecated property attributes (e.g. `[theme]="..."` on cards/buttons -> `[variant]="..."`)
  if (updated.includes('[theme]="')) {
    updated = updated.replace(/\[theme\]="/g, '[variant]="');
    changes.push('Migrated deprecated [theme] property to [variant]');
  }

  // 4. Codemod: Deprecated CSS variable fallbacks
  if (updated.includes('--ngxsmk-color-accent')) {
    updated = updated.replace(/--ngxsmk-color-accent\b/g, '--ngxsmk-color-primary');
    changes.push('Replaced legacy --ngxsmk-color-accent token with --ngxsmk-color-primary');
  }

  // 5. Diagnostics / Warnings for legacy Angular decorators in UI code
  if (/@Input\(\)/.test(updated) && (filePath.endsWith('.ts') && !filePath.endsWith('.spec.ts'))) {
    warnings.push(`[${filePath}] Detected legacy @Input() decorator. Consider migrating to signal input().`);
  }

  return { updated, changes, warnings };
}

/**
 * Recursively scans directory and applies migrations.
 */
export function runMigration(options: MigrationOptions = {}): MigrationResult {
  const cwd = options.cwd || process.cwd();
  const dryRun = options.dryRun ?? false;

  const result: MigrationResult = {
    filesScanned: 0,
    filesModified: 0,
    warnings: [],
    changesApplied: [],
  };

  function scanDir(dir: string) {
    if (!existsSync(dir)) return;
    const entries = readdirSync(dir);

    for (const entry of entries) {
      if (entry === 'node_modules' || entry === 'dist' || entry === '.git' || entry === '.angular') continue;
      const fullPath = join(dir, entry);
      const stat = statSync(fullPath);

      if (stat.isDirectory()) {
        scanDir(fullPath);
      } else if (stat.isFile()) {
        const ext = extname(fullPath);
        if (ext === '.ts' || ext === '.html' || ext === '.css' || ext === '.scss') {
          result.filesScanned++;
          const content = readFileSync(fullPath, 'utf-8');
          const { updated, changes, warnings } = migrateSourceContent(content, fullPath);

          if (warnings.length > 0) {
            result.warnings.push(...warnings);
          }

          if (updated !== content) {
            result.filesModified++;
            for (const desc of changes) {
              result.changesApplied.push({ file: fullPath, description: desc });
            }
            if (!dryRun) {
              writeFileSync(fullPath, updated, 'utf-8');
            }
          }
        }
      }
    }
  }

  scanDir(cwd);
  return result;
}
