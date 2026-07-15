// Adds `standalone: true` to every @Component / @Directive / @Pipe decorator
// that does not already declare it. Required for Angular 17/18 (where
// standalone is opt-in); 19+ default to standalone:true so it is harmless.
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

function walk(dir, files = []) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) {
      if (e.name === 'node_modules' || e.name === 'dist' || e.name.startsWith('.')) continue;
      walk(p, files);
    } else if (e.name.endsWith('.ts')) {
      files.push(p);
    }
  }
  return files;
}

function matchingBrace(src, openIdx) {
  let depth = 0;
  for (let i = openIdx; i < src.length; i++) {
    const c = src[i];
    if (c === '{') depth++;
    else if (c === '}') {
      depth--;
      if (depth === 0) return i;
    } else if (c === "'" || c === '"' || c === '`') {
      const q = c;
      i++;
      while (i < src.length && src[i] !== q) {
        if (src[i] === '\\') i++;
        i++;
      }
    }
  }
  return -1;
}

function addStandalone(src) {
  const re = /@(Component|Directive|Pipe)\s*\(\s*\{/g;
  let out = '';
  let last = 0;
  let m;
  while ((m = re.exec(src))) {
    const openIdx = m.index + m[0].length - 1;
    const end = matchingBrace(src, openIdx);
    if (end === -1) {
      out += src.slice(last);
      last = src.length;
      break;
    }
    const body = src.slice(openIdx + 1, end);
    out += src.slice(last, m.index);
    if (/\bstandalone\s*:/.test(body)) {
      out += m[0];
    } else {
      out += m[0] + '\n  standalone: true,';
    }
    last = m.index + m[0].length;
    re.lastIndex = end + 1;
  }
  out += src.slice(last);
  return out;
}

const libs = ['theme', 'cdk', 'core'];
let patched = 0;
let files = 0;
for (const lib of libs) {
  for (const f of walk(join('packages', lib))) {
    const src = readFileSync(f, 'utf8');
    const next = addStandalone(src);
    if (next !== src) {
      writeFileSync(f, next);
      patched++;
    }
    files++;
  }
}
console.log(`scanned ${files} files, added standalone:true to ${patched}`);
