import { readdirSync, readFileSync, writeFileSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';

const CORE_DIR = resolve('packages/core');

function walk(dir) {
  let results = [];
  const list = readdirSync(dir);
  for (const file of list) {
    const fullPath = join(dir, file);
    const stat = statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(fullPath));
    } else if (file.endsWith('.ts') && !file.endsWith('.spec.ts')) {
      results.push(fullPath);
    }
  }
  return results;
}

const files = walk(CORE_DIR);
let cleanedCount = 0;
let fileCount = 0;

for (const file of files) {
  const content = readFileSync(file, 'utf-8');
  const regex = /var\((--ngxsmk-[a-zA-Z0-9_-]+),\s*#[0-9a-fA-F]{3,8}\)/g;
  if (regex.test(content)) {
    const updated = content.replace(regex, 'var($1)');
    writeFileSync(file, updated, 'utf-8');
    fileCount++;
    cleanedCount += (content.match(regex) || []).length;
  }
}

console.log(`✨ Cleaned ${cleanedCount} redundant hex fallbacks across ${fileCount} files.`);
