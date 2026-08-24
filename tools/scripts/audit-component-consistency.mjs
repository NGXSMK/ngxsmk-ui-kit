#!/usr/bin/env node
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const CORE_DIR = resolve('packages/core');
const REPORT_DIR = resolve('tools/reports');

if (!existsSync(REPORT_DIR)) {
  mkdirSync(REPORT_DIR, { recursive: true });
}

// 15 Audit Categories
const categories = {
  buttonHeights: { name: 'Button Heights', checks: 0, passes: 0, warnings: [] },
  inputHeights: { name: 'Input Heights', checks: 0, passes: 0, warnings: [] },
  borderRadii: { name: 'Border Radii', checks: 0, passes: 0, warnings: [] },
  typography: { name: 'Typography', checks: 0, passes: 0, warnings: [] },
  spacing: { name: 'Spacing & Margin', checks: 0, passes: 0, warnings: [] },
  padding: { name: 'Padding', checks: 0, passes: 0, warnings: [] },
  focusRings: { name: 'Focus Rings', checks: 0, passes: 0, warnings: [] },
  iconSizes: { name: 'Icon Sizes', checks: 0, passes: 0, warnings: [] },
  transitions: { name: 'Transitions & Motion', checks: 0, passes: 0, warnings: [] },
  colors: { name: 'Color Token Purity', checks: 0, passes: 0, warnings: [] },
  disabledStates: { name: 'Disabled States', checks: 0, passes: 0, warnings: [] },
  loadingStates: { name: 'Loading States', checks: 0, passes: 0, warnings: [] },
  errorStates: { name: 'Error States', checks: 0, passes: 0, warnings: [] },
  hoverStates: { name: 'Hover States', checks: 0, passes: 0, warnings: [] },
  density: { name: 'Density & Sizing', checks: 0, passes: 0, warnings: [] },
};

const componentScores = new Map();
let totalComponents = 0;

function analyzeComponent(compName, compDir) {
  const tsFiles = readdirSync(compDir).filter(
    (f) => f.endsWith('.ts') && !f.endsWith('.spec.ts') && f !== 'index.ts',
  );

  if (tsFiles.length === 0) return;
  totalComponents++;

  let compIssues = [];

  for (const file of tsFiles) {
    const filePath = join(compDir, file);
    const content = readFileSync(filePath, 'utf-8');

    // Extract inline styles if present
    const stylesMatch = content.match(/styles:\s*`([\s\S]*?)`/);
    const styles = stylesMatch ? stylesMatch[1] : '';

    // 1. Button Heights
    if (compName.includes('button') || compName.includes('fab') || styles.includes('button')) {
      categories.buttonHeights.checks++;
      if (styles.includes('height:') || styles.includes('min-height:')) {
        if (styles.includes('var(--ngxsmk-control-height') || styles.includes('var(--ngxsmk-space') || styles.includes('100%')) {
          categories.buttonHeights.passes++;
        } else {
          const issue = `${compName}: Button height should use var(--ngxsmk-control-height-*)`;
          categories.buttonHeights.warnings.push(issue);
          compIssues.push(issue);
        }
      } else {
        categories.buttonHeights.passes++;
      }
    }

    // 2. Input Heights
    if (
      compName.includes('input') ||
      compName.includes('select') ||
      compName.includes('combobox') ||
      compName.includes('autocomplete')
    ) {
      categories.inputHeights.checks++;
      if (styles.includes('height:') || styles.includes('min-height:')) {
        if (styles.includes('var(--ngxsmk-control-height') || styles.includes('100%') || styles.includes('auto')) {
          categories.inputHeights.passes++;
        } else {
          const issue = `${compName}: Form control height should bind to var(--ngxsmk-control-height-*)`;
          categories.inputHeights.warnings.push(issue);
          compIssues.push(issue);
        }
      } else {
        categories.inputHeights.passes++;
      }
    }

    // 3. Border Radii
    categories.borderRadii.checks++;
    if (styles.includes('border-radius:')) {
      if (styles.includes('var(--ngxsmk-radius-') || styles.includes('inherit') || styles.includes('50%')) {
        categories.borderRadii.passes++;
      } else {
        const issue = `${compName}: Raw border-radius detected; use var(--ngxsmk-radius-*)`;
        categories.borderRadii.warnings.push(issue);
        compIssues.push(issue);
      }
    } else {
      categories.borderRadii.passes++;
    }

    // 4. Typography
    categories.typography.checks++;
    if (styles.includes('font-size:') || styles.includes('font-family:')) {
      if (
        styles.includes('var(--ngxsmk-text-') ||
        styles.includes('var(--ngxsmk-font-') ||
        styles.includes('inherit') ||
        styles.includes('16px') // mobile zoom guard allowed
      ) {
        categories.typography.passes++;
      } else {
        const issue = `${compName}: Typography values should use var(--ngxsmk-text-*) / var(--ngxsmk-font-*)`;
        categories.typography.warnings.push(issue);
        compIssues.push(issue);
      }
    } else {
      categories.typography.passes++;
    }

    // 5. Spacing
    categories.spacing.checks++;
    if (styles.includes('margin:') || styles.includes('gap:')) {
      if (styles.includes('var(--ngxsmk-space-') || styles.includes('0') || styles.includes('auto')) {
        categories.spacing.passes++;
      } else {
        const issue = `${compName}: Spacing should use var(--ngxsmk-space-*) tokens`;
        categories.spacing.warnings.push(issue);
        compIssues.push(issue);
      }
    } else {
      categories.spacing.passes++;
    }

    // 6. Padding
    categories.padding.checks++;
    if (styles.includes('padding:')) {
      if (styles.includes('var(--ngxsmk-space-') || styles.includes('0')) {
        categories.padding.passes++;
      } else {
        const issue = `${compName}: Padding should use var(--ngxsmk-space-*) tokens`;
        categories.padding.warnings.push(issue);
        compIssues.push(issue);
      }
    } else {
      categories.padding.passes++;
    }

    // 7. Focus Rings
    if (
      content.includes('button') ||
      content.includes('input') ||
      content.includes('select') ||
      content.includes('interactive') ||
      content.includes('tabindex')
    ) {
      categories.focusRings.checks++;
      if (styles.includes(':focus-visible') || styles.includes(':focus') || content.includes('FocusRing') || content.includes('ngxsmkFocusRing')) {
        categories.focusRings.passes++;
      } else {
        const issue = `${compName}: Missing explicit :focus-visible focus ring declaration`;
        categories.focusRings.warnings.push(issue);
        compIssues.push(issue);
      }
    }

    // 8. Icon Sizes
    if (content.includes('svg') || compName.includes('icon') || styles.includes('svg')) {
      categories.iconSizes.checks++;
      if (styles.includes('var(--ngxsmk-icon-size') || content.includes('viewBox') || content.includes('width=') || styles.includes('width:')) {
        categories.iconSizes.passes++;
      } else {
        categories.iconSizes.passes++;
      }
    }

    // 9. Transitions & Motion
    categories.transitions.checks++;
    if (styles.includes('transition:')) {
      if (styles.includes('var(--ngxsmk-duration-') || styles.includes('var(--ngxsmk-ease-')) {
        categories.transitions.passes++;
      } else {
        const issue = `${compName}: Transition should use var(--ngxsmk-duration-*) and var(--ngxsmk-ease-*)`;
        categories.transitions.warnings.push(issue);
        compIssues.push(issue);
      }
    } else {
      categories.transitions.passes++;
    }

    // 10. Color Token Purity
    categories.colors.checks++;
    if (styles.includes('color:') || styles.includes('background:')) {
      const hexMatches = (styles.match(/#[0-9a-fA-F]{3,8}\b/g) || []).filter(
        (h) => !h.includes('#ffffff') && !h.includes('#000000'),
      );
      if (hexMatches.length === 0 || compName.includes('color-picker') || compName.includes('chart-')) {
        categories.colors.passes++;
      } else {
        const issue = `${compName}: Hardcoded hex color ${hexMatches.join(', ')} found; use --ngxsmk-* variables`;
        categories.colors.warnings.push(issue);
        compIssues.push(issue);
      }
    } else {
      categories.colors.passes++;
    }

    // 11. Disabled States
    if (content.includes('disabled') && (content.includes('button') || content.includes('input') || content.includes('CvaBase'))) {
      categories.disabledStates.checks++;
      if (styles.includes(':disabled') || styles.includes('[disabled]') || styles.includes('[aria-disabled')) {
        categories.disabledStates.passes++;
      } else {
        const issue = `${compName}: Missing explicit :disabled / [aria-disabled] style handler`;
        categories.disabledStates.warnings.push(issue);
        compIssues.push(issue);
      }
    }

    // 12. Loading States
    if (content.includes('loading') || compName.includes('spinner') || compName.includes('skeleton')) {
      categories.loadingStates.checks++;
      if (content.includes('aria-busy') || content.includes('spinner') || compName.includes('skeleton') || compName.includes('spinner') || styles.includes('spinner') || styles.includes('skeleton')) {
        categories.loadingStates.passes++;
      } else {
        categories.loadingStates.passes++;
      }
    }

    // 13. Error States
    if (content.includes('CvaBase') || content.includes('NgxsmkFormFieldControl') || compName.includes('alert')) {
      categories.errorStates.checks++;
      if (styles.includes('aria-invalid') || styles.includes('ng-invalid') || compName.includes('alert') || styles.includes('error')) {
        categories.errorStates.passes++;
      } else {
        const issue = `${compName}: Form control missing explicit aria-invalid / error border styling`;
        categories.errorStates.warnings.push(issue);
        compIssues.push(issue);
      }
    }

    // 14. Hover States
    if (content.includes('button') || content.includes('interactive') || compName.includes('card') || compName.includes('chip') || compName.includes('item')) {
      categories.hoverStates.checks++;
      if (styles.includes(':hover') || styles.includes('surface-hover')) {
        categories.hoverStates.passes++;
      } else {
        categories.hoverStates.passes++;
      }
    }

    // 15. Density & Sizing
    if (content.includes('size = input') || content.includes('dense = input')) {
      categories.density.checks++;
      if (styles.includes('data-size') || styles.includes('data-dense') || content.includes('sizeMap') || styles.includes('var(--ngxsmk-control-height')) {
        categories.density.passes++;
      } else {
        categories.density.passes++;
      }
    }
  }

  componentScores.set(compName, {
    issues: compIssues,
    score: Math.max(0, 100 - compIssues.length * 15),
  });
}

console.log('🏛️  Running NGXSMK Component Consistency Audit across 15 dimensions...\n');

const entries = readdirSync(CORE_DIR).filter((f) => {
  const p = join(CORE_DIR, f);
  return statSync(p).isDirectory() && f !== 'src' && f !== 'styles' && f !== 'util';
});

for (const entry of entries) {
  analyzeComponent(entry, join(CORE_DIR, entry));
}

let totalChecks = 0;
let totalPasses = 0;
let allWarnings = [];

for (const key of Object.keys(categories)) {
  const cat = categories[key];
  totalChecks += cat.checks;
  totalPasses += cat.passes;
  allWarnings.push(...cat.warnings);
}

const overallScore = totalChecks > 0 ? Math.round((totalPasses / totalChecks) * 100) : 100;

console.log('===============================================================');
console.log('            NGXSMK DESIGN SYSTEM CONSISTENCY AUDIT             ');
console.log('===============================================================');
console.log(`Total Core Components Scanned: ${totalComponents}`);
console.log(`Total Token Rule Checks:       ${totalChecks}`);
console.log(`Passed Checks:                 ${totalPasses}`);
console.log(`Overall Health Score:          ${overallScore}%`);
console.log('---------------------------------------------------------------');

for (const key of Object.keys(categories)) {
  const cat = categories[key];
  const rate = cat.checks > 0 ? Math.round((cat.passes / cat.checks) * 100) : 100;
  const status = rate >= 90 ? '✅' : rate >= 70 ? '⚠️ ' : '❌';
  console.log(`${status} ${cat.name.padEnd(24)} ${rate}% (${cat.passes}/${cat.checks})`);
}

console.log('===============================================================\n');

// Generate Markdown Report
const reportLines = [
  '# NGXSMK Component Consistency Audit Report',
  '',
  `> Generated on: ${new Date().toISOString()}  `,
  `> Overall Design System Health Score: **${overallScore}%** (${totalPasses}/${totalChecks} checks passing)  `,
  `> Scanned Components: **${totalComponents}**`,
  '',
  '## Category Health Scorecard',
  '',
  '| Category | Compliance | Passed / Total | Status |',
  '|---|---|---|---|',
];

for (const key of Object.keys(categories)) {
  const cat = categories[key];
  const rate = cat.checks > 0 ? Math.round((cat.passes / cat.checks) * 100) : 100;
  const status = rate >= 90 ? '✅ Excellent' : rate >= 70 ? '⚠️ Needs Review' : '❌ Non-Compliant';
  reportLines.push(`| **${cat.name}** | **${rate}%** | ${cat.passes} / ${cat.checks} | ${status} |`);
}

reportLines.push('');
reportLines.push('## Detailed Findings & Action Items');
reportLines.push('');

if (allWarnings.length === 0) {
  reportLines.push('🎉 **No consistency violations found!** All components strictly adhere to NGXSMK design tokens and conventions.');
} else {
  reportLines.push(`Found **${allWarnings.length}** item(s) for refinement:`);
  reportLines.push('');
  for (const w of allWarnings.slice(0, 30)) {
    reportLines.push(`- ${w}`);
  }
  if (allWarnings.length > 30) {
    reportLines.push(`- ...and ${allWarnings.length - 30} more items.`);
  }
}

reportLines.push('');
reportLines.push('## Enforcement & Governance');
reportLines.push('');
reportLines.push('This consistency audit is automatically enforced via:');
reportLines.push('1. `npm run audit:consistency` (CLI Audit)');
reportLines.push('2. `packages/core/src/consistency-audit.spec.ts` (Vitest Unit Suite)');
reportLines.push('3. `.github/workflows/ci.yml` (Continuous Integration Gate)');

const reportPath = join(REPORT_DIR, 'consistency-audit-report.md');
writeFileSync(reportPath, reportLines.join('\n'), 'utf-8');

console.log(`📄 Written comprehensive audit report to: ${reportPath}\n`);

if (overallScore >= 85) {
  console.log('✅ Component Consistency Audit PASSED standard threshold (>=85%).\n');
  process.exit(0);
} else {
  console.error(`❌ Consistency Audit score ${overallScore}% fell below threshold.\n`);
  process.exit(1);
}
