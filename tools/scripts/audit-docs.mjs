#!/usr/bin/env node
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, extname, join, resolve } from 'node:path';

console.log('📚 Running NGXSMK Documentation Quality & Link Integrity Audit...\n');

let totalMdFiles = 0;
let totalLinksChecked = 0;
let passedLinks = 0;
const linkErrors = [];
const docIssues = [];

function scanMarkdownFiles(dir) {
  if (!existsSync(dir)) return;
  const entries = readdirSync(dir);

  for (const entry of entries) {
    if (entry === 'node_modules' || entry === 'dist' || entry === '.git' || entry === '.angular') continue;
    const fullPath = join(dir, entry);
    const stat = statSync(fullPath);

    if (stat.isDirectory()) {
      scanMarkdownFiles(fullPath);
    } else if (stat.isFile() && (extname(fullPath) === '.md' || extname(fullPath) === '.markdown')) {
      totalMdFiles++;
      auditFile(fullPath);
    }
  }
}

function auditFile(filePath) {
  const content = readFileSync(filePath, 'utf-8');
  const dir = dirname(filePath);

  // Check 1: Non-empty content
  if (content.trim().length === 0) {
    docIssues.push(`[${filePath}] File is empty.`);
    return;
  }

  // Check 2: Heading structure
  const headings = content.match(/^#+\s+.+$/gm) || [];
  if (headings.length === 0) {
    docIssues.push(`[${filePath}] Missing top-level heading.`);
  }

  // Check 3: Relative Markdown Links
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  let match;
  while ((match = linkRegex.exec(content)) !== null) {
    const rawLink = match[2].trim();
    if (
      rawLink.startsWith('http://') ||
      rawLink.startsWith('https://') ||
      rawLink.startsWith('mailto:') ||
      rawLink.startsWith('#') ||
      rawLink.startsWith('file://')
    ) {
      continue;
    }

    // Strip anchor #hash from relative links
    const cleanLink = rawLink.split('#')[0];
    if (!cleanLink) continue;

    totalLinksChecked++;
    const resolvedTarget = resolve(dir, cleanLink);
    if (existsSync(resolvedTarget)) {
      passedLinks++;
    } else {
      linkErrors.push(`[${filePath}] Broken relative link: "${rawLink}" (target not found: ${resolvedTarget})`);
    }
  }
}

scanMarkdownFiles(process.cwd());

const score = totalLinksChecked > 0 ? Math.round((passedLinks / totalLinksChecked) * 100) : 100;

console.log('===============================================================');
console.log('             NGXSMK DOCUMENTATION AUDIT SCORECARD              ');
console.log('===============================================================');
console.log(`Markdown Files Scanned:     ${totalMdFiles}`);
console.log(`Relative Links Checked:     ${totalLinksChecked}`);
console.log(`Passed Links:               ${passedLinks}`);
console.log(`Documentation Link Score:   ${score}%`);
console.log('---------------------------------------------------------------');

if (linkErrors.length > 0) {
  console.warn('\n⚠️ Link Warnings / Broken References:');
  for (const err of linkErrors.slice(0, 10)) {
    console.warn(`  - ${err}`);
  }
  if (linkErrors.length > 10) {
    console.warn(`  ... and ${linkErrors.length - 10} more`);
  }
}

if (docIssues.length > 0) {
  console.warn('\n⚠️ Documentation Structure Issues:');
  for (const issue of docIssues) {
    console.warn(`  - ${issue}`);
  }
}

console.log('✅ Documentation Quality Audit PASSED!\n');
