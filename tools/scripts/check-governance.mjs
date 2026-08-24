#!/usr/bin/env node
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';

const CORE_DIR = resolve('packages/core');

const violations = [];
let totalComponents = 0;

function checkComponent(dirName, dirPath) {
  const ngPackagePath = join(dirPath, 'ng-package.json');
  const indexPath = join(dirPath, 'index.ts');

  // Skip utilities or non-entrypoint dirs if any
  if (!existsSync(ngPackagePath) && !existsSync(indexPath)) {
    return;
  }

  totalComponents++;

  if (!existsSync(ngPackagePath)) {
    violations.push({
      file: dirPath,
      rule: 'Entry Point Manifest',
      message: `Missing ng-package.json in ${dirName}`,
    });
  }

  if (!existsSync(indexPath)) {
    violations.push({
      file: dirPath,
      rule: 'Public API Index',
      message: `Missing index.ts in ${dirName}`,
    });
  }

  // Scan all .ts files in component dir
  const files = readdirSync(dirPath).filter(
    (f) => f.endsWith('.ts') && !f.endsWith('.spec.ts') && f !== 'index.ts',
  );

  for (const file of files) {
    const filePath = join(dirPath, file);
    const content = readFileSync(filePath, 'utf-8');

    // 1. Standalone & OnPush Check
    if (content.includes('@Component(')) {
      if (!content.includes('standalone: true')) {
        violations.push({
          file: filePath,
          rule: 'Standalone Architecture',
          message: `Component is missing 'standalone: true'`,
        });
      }
      if (!content.includes('ChangeDetectionStrategy.OnPush')) {
        violations.push({
          file: filePath,
          rule: 'Change Detection',
          message: `Component is missing 'changeDetection: ChangeDetectionStrategy.OnPush'`,
        });
      }
    } else if (content.includes('@Directive(')) {
      if (!content.includes('standalone: true')) {
        violations.push({
          file: filePath,
          rule: 'Standalone Architecture',
          message: `Directive is missing 'standalone: true'`,
        });
      }
    }

    // 2. Signals-Only Check (No legacy @Input / @Output decorators)
    const hasLegacyInput = /@Input\s*\(/g.test(content);
    const hasLegacyOutput = /@Output\s*\(/g.test(content);
    if (hasLegacyInput || hasLegacyOutput) {
      violations.push({
        file: filePath,
        rule: 'Signals API Exclusivity',
        message: `Legacy decorator detected (@Input/@Output). Use input(), model(), or output() signals.`,
      });
    }

    // 3. Class Naming Check (Must start with Ngxsmk)
    const classMatches = content.match(/export class (\w+)/g);
    if (classMatches) {
      for (const m of classMatches) {
        const className = m.replace('export class ', '');
        if (!className.startsWith('Ngxsmk')) {
          violations.push({
            file: filePath,
            rule: 'Class Naming',
            message: `Class '${className}' does not start with 'Ngxsmk' prefix.`,
          });
        }
      }
    }

    // 4. Component Selector Prefix Check
    const selectorMatch = content.match(/selector:\s*['"`]([^'"`]+)['"`]/);
    if (selectorMatch) {
      const selector = selectorMatch[1];
      const valid =
        selector.startsWith('ngxsmk-') ||
        selector.includes('[ngxsmk') ||
        selector.includes('ngxsmk');
      if (!valid) {
        violations.push({
          file: filePath,
          rule: 'Selector Prefix',
          message: `Selector '${selector}' does not adhere to 'ngxsmk-*' element or '[ngxsmk*]' attribute convention.`,
        });
      }
    }

    // 5. Hardcoded Hex Colors in Component Styles
    const stylesMatch = content.match(/styles:\s*`([\s\S]*?)`/);
    if (stylesMatch) {
      const stylesContent = stylesMatch[1];
      const hexMatches = stylesContent.match(/#[0-9a-fA-F]{3,8}\b/g);
      if (hexMatches) {
        // Filter out benign defaults or color-picker / canvas chart palette defaults
        const nonTokens = hexMatches.filter(
          (h) => !h.includes('#ffffff') && !h.includes('#000000'),
        );
        if (nonTokens.length > 0 && !file.includes('color-picker') && !file.includes('chart-') && !file.includes('calendar-heatmap')) {
          violations.push({
            file: filePath,
            rule: 'Design Token Purity',
            message: `Found hardcoded hex color(s) [${nonTokens.slice(0, 3).join(', ')}] in component styles. Use --ngxsmk-* CSS variables.`,
          });
        }
      }
    }
  }
}

console.log('🔍 Running NGXSMK Design System Governance Audit...\n');

const entries = readdirSync(CORE_DIR).filter((f) => {
  const p = join(CORE_DIR, f);
  return statSync(p).isDirectory() && f !== 'src' && f !== 'styles' && f !== 'util';
});

for (const entry of entries) {
  checkComponent(entry, join(CORE_DIR, entry));
}

console.log(`📦 Scanned ${totalComponents} core component entry points.`);

if (violations.length === 0) {
  console.log('✅ Governance Check PASSED! All components adhere to NGXSMK standards.\n');
  process.exit(0);
} else {
  console.error(`❌ Found ${violations.length} governance violation(s):\n`);
  for (const v of violations) {
    console.error(`  - [${v.rule}] ${v.file}: ${v.message}`);
  }
  console.error('\nPlease resolve the violations above before submitting.\n');
  process.exit(1);
}
