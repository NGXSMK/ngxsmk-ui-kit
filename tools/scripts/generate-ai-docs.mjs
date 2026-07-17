/**
 * Generates AI-consumption docs from component sources:
 *  - llms.txt            (root + apps/demo/public) — concise index for LLMs
 *  - llms-full.txt       (root + apps/demo/public) — full API reference
 *  - packages/mcp/src/component-db.ts — database consumed by the MCP server
 *  - apps/demo/public/component-api.json — data for the demo site's /api page
 *
 * Extraction is line/regex based and relies on the workspace convention of
 * single-file, signal-based components (input()/output()/model()).
 *
 * Run: node tools/scripts/generate-ai-docs.mjs
 */
import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const corePath = join(root, 'packages', 'core');
const rootPkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));

const SKIP_DIRS = new Set(['util', 'testing', 'styles']);

/** Extract JSDoc summary immediately preceding a decorator/class at `idx`. */
function docAbove(lines, idx) {
  let end = idx - 1;
  while (end >= 0 && lines[end].trim() === '') end--;
  if (end < 0 || !lines[end].trim().startsWith('*/')) return '';
  let start = end;
  while (start >= 0 && !lines[start].trim().startsWith('/**')) start--;
  if (start < 0) return '';
  const body = lines
    .slice(start + 1, end)
    .map((l) => l.replace(/^\s*\*\s?/, ''))
    .filter((l) => !l.startsWith('@'));
  // Take text up to the first code fence or blank-line-separated example.
  const cut = body.findIndex((l) => l.startsWith('```'));
  const text = (cut === -1 ? body : body.slice(0, cut)).join(' ').replace(/\s+/g, ' ').trim();
  return text;
}

function parseFile(filePath) {
  const src = readFileSync(filePath, 'utf8');
  const lines = src.split(/\r?\n/);
  const entries = [];
  let pending = null; // { selector, description } from last decorator

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const dec = line.match(/^@(Component|Directive)\(/);
    if (dec) {
      pending = { kind: dec[1], selector: '', description: docAbove(lines, i) };
      // scan ahead for the selector within the decorator block
      for (let j = i; j < Math.min(i + 40, lines.length); j++) {
        const sel = lines[j].match(/selector:\s*['"`]([^'"`]+)['"`]/);
        if (sel) {
          pending.selector = sel[1];
          break;
        }
        if (/^\}\)/.test(lines[j])) break;
      }
      continue;
    }
    const cls = line.match(/^export class (\w+)/);
    if (cls && pending) {
      entries.push({
        name: cls[1],
        kind: pending.kind,
        selector: pending.selector,
        description: pending.description,
        inputs: [],
        outputs: [],
        _bodyStart: i,
      });
      pending = null;
    }
  }

  // Attribute inputs/outputs to the class whose body they appear in (classes
  // are sequential in a file; a member belongs to the last class started).
  for (let i = 0; i < lines.length; i++) {
    const owner = [...entries].reverse().find((e) => i > e._bodyStart);
    if (!owner) continue;
    const line = lines[i];

    let m = line.match(/readonly (\w+)\s*=\s*input(\.required)?(?:<(.+?)>)?\(([^;]*)\);?\s*$/);
    if (m) {
      const [, name, required, type, args] = m;
      owner.inputs.push({
        name,
        type: (type || inferType(args)).trim(),
        required: !!required,
        default: required ? undefined : extractDefault(args),
      });
      continue;
    }
    m = line.match(/readonly (\w+)\s*=\s*model(\.required)?(?:<(.+?)>)?\(([^;]*)\);?\s*$/);
    if (m) {
      owner.inputs.push({
        name: m[1],
        type: (m[3] || inferType(m[4])).trim(),
        required: !!m[2],
        twoWay: true,
        default: m[2] ? undefined : extractDefault(m[4]),
      });
      continue;
    }
    m = line.match(/readonly (\w+)\s*=\s*output(?:<(.+?)>)?\(/);
    if (m) {
      owner.outputs.push({ name: m[1], type: (m[2] || 'void').trim() });
    }
  }

  for (const e of entries) delete e._bodyStart;
  return entries.filter((e) => e.selector);
}

function extractDefault(args) {
  const s = args.trim();
  // Array/object literal defaults contain commas — capture to the closing bracket.
  if (s.startsWith('[')) return (s.match(/^\[[^\]]*\]/) || [undefined])[0];
  if (s.startsWith('{')) return (s.match(/^\{[^}]*\}/) || [undefined])[0];
  return (s.match(/^([^,)]*)/)?.[1] || '').trim() || undefined;
}

function inferType(args) {
  const v = (args.match(/^\s*([^,)]*)/)?.[1] || '').trim();
  if (/booleanAttribute/.test(args) || v === 'true' || v === 'false') return 'boolean';
  if (/numberAttribute/.test(args) || /^-?\d/.test(v)) return 'number';
  if (/^['"`]/.test(v)) return 'string';
  if (v === '[]') return 'unknown[]';
  return 'unknown';
}

// ---- scan all component dirs -------------------------------------------------
const components = [];
for (const dir of readdirSync(corePath).sort()) {
  const dirPath = join(corePath, dir);
  if (!statSync(dirPath).isDirectory() || SKIP_DIRS.has(dir)) continue;
  for (const f of readdirSync(dirPath)) {
    if (!f.endsWith('.ts') || f.endsWith('.spec.ts') || f === 'index.ts') continue;
    try {
      for (const entry of parseFile(join(dirPath, f))) {
        components.push({ entryPoint: `@ngxsmk/core/${dir}`, ...entry });
      }
    } catch (err) {
      console.warn(`warn: failed to parse ${dir}/${f}: ${err.message}`);
    }
  }
}

console.log(`Extracted ${components.length} components/directives from packages/core.`);

// ---- llms.txt ----------------------------------------------------------------
const header = `# NGXSMK UI Kit

> Angular-first, MIT-licensed UI ecosystem: ${components.length}+ signals-native, zoneless
> standalone components with a universal design-token engine (CSS variables,
> SCSS, Tailwind, StyleX, Tokens Studio export). MIT licensed, no paid tiers.
> Current version: ${rootPkg.version}. Supports Angular 17.3 through 22.

Packages: \`@ngxsmk/core\` (components, one secondary entry point per component,
e.g. \`@ngxsmk/core/button\`), \`@ngxsmk/theme\` (design tokens + theme engine),
\`@ngxsmk/cdk\` (behavior primitives), \`@ngxsmk/mcp\` (MCP server for coding agents).

Usage rules for generated code:
- All components are standalone; import the class and add it to the \`imports\` array.
- APIs are signal-based: inputs are \`input()\` signals (bind with \`[prop]\`),
  outputs are \`output()\` (bind with \`(event)\`), \`model()\` inputs support \`[(prop)]\`.
- Style via \`--ngxsmk-*\` CSS custom properties, never by overriding internal classes.
- Import theme styles once: \`@import '@ngxsmk/theme/css';\` and toggle dark mode
  by adding the \`dark\` class to \`<html>\`.

## Docs
- Full component API reference: /llms-full.txt
- Website & docs: https://ngxsmk.dev
- Packages on npm: https://www.npmjs.com/org/ngxsmk

## Components
`;

const indexLines = components.map(
  (c) =>
    `- ${c.name} (\`${c.selector}\`) — ${c.entryPoint}${c.description ? ` — ${c.description.split('. ')[0].replace(/\.$/, '')}` : ''}`,
);
const llms = header + indexLines.join('\n') + '\n';

// ---- llms-full.txt -----------------------------------------------------------
function fullEntry(c) {
  const out = [`## ${c.name}`, ''];
  out.push(`- Selector: \`${c.selector}\``);
  out.push(`- Import from: \`${c.entryPoint}\``);
  if (c.description) out.push(`- ${c.description}`);
  if (c.inputs.length) {
    out.push('', 'Inputs:');
    for (const i of c.inputs)
      out.push(
        `- \`${i.twoWay ? `[(${i.name})]` : `[${i.name}]`}\`: ${i.type}${i.required ? ' (required)' : ''}${i.default ? ` (default: \`${i.default}\`)` : ''}`,
      );
  }
  if (c.outputs.length) {
    out.push('', 'Outputs:');
    for (const o of c.outputs) out.push(`- \`(${o.name})\`: emits \`${o.type}\``);
  }
  out.push('');
  return out.join('\n');
}
const llmsFull =
  header.replace('## Docs\n- Full component API reference: /llms-full.txt\n', '') +
  '\n' +
  components.map(fullEntry).join('\n');

writeFileSync(join(root, 'llms.txt'), llms);
writeFileSync(join(root, 'llms-full.txt'), llmsFull);
const demoPublic = join(root, 'apps', 'demo', 'public');
if (existsSync(demoPublic)) {
  for (const f of ['llms.txt', 'llms-full.txt'])
    writeFileSync(join(demoPublic, f), readFileSync(join(root, f)));
  writeFileSync(
    join(demoPublic, 'component-api.json'),
    JSON.stringify({ version: rootPkg.version, components }),
  );
}

// ---- MCP component database --------------------------------------------------
const dbTs = `// AUTO-GENERATED by tools/scripts/generate-ai-docs.mjs — do not edit by hand.
export interface ComponentInput {
  name: string;
  type: string;
  required?: boolean;
  twoWay?: boolean;
  default?: string;
}
export interface ComponentOutput {
  name: string;
  type: string;
}
export interface ComponentEntry {
  entryPoint: string;
  name: string;
  kind: string;
  selector: string;
  description: string;
  inputs: ComponentInput[];
  outputs: ComponentOutput[];
}
export const COMPONENT_DATABASE: ComponentEntry[] = ${JSON.stringify(components, null, 2)};
`;
writeFileSync(join(root, 'packages', 'mcp', 'src', 'component-db.ts'), dbTs);

console.log(
  'Wrote llms.txt, llms-full.txt (root + apps/demo/public) and packages/mcp/src/component-db.ts',
);
