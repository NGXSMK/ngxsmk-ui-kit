/**
 * Generates AI-consumption docs from component sources:
 *  - llms.txt            (root + apps/demo/public) — concise index for LLMs
 *  - llms-full.txt       (root + apps/demo/public) — full API reference
 *  - packages/mcp/src/component-db.ts — database consumed by the MCP server
 *  - apps/demo/public/component-api.json — data for the demo site's /api page
 *
 * Extraction uses the TypeScript AST Compiler API to query standalone
 * components and directives (inputs/outputs/models).
 *
 * Run: node tools/scripts/generate-ai-docs.mjs
 */
import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const corePath = join(root, 'packages', 'core');
const rootPkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));

const SKIP_DIRS = new Set(['util', 'testing', 'styles']);

function getDecoratorsOfNode(node) {
  if (node.modifiers) {
    return node.modifiers.filter((mod) => mod.kind === ts.SyntaxKind.Decorator);
  }
  if (node.decorators) {
    return node.decorators;
  }
  return [];
}

function inferTypeFromCode(defaultCode) {
  const code = defaultCode.trim();
  if (code === 'true' || code === 'false' || /booleanAttribute/.test(code)) return 'boolean';
  if (/^-?\d/.test(code) || /numberAttribute/.test(code)) return 'number';
  if (/^['"`]/.test(code)) return 'string';
  if (code === '[]') return 'unknown[]';
  return 'unknown';
}

function parseFile(filePath) {
  const sourceCode = readFileSync(filePath, 'utf8');
  const sourceFile = ts.createSourceFile(filePath, sourceCode, ts.ScriptTarget.Latest, true);

  const entries = [];

  function visit(node) {
    if (ts.isClassDeclaration(node) && node.name) {
      const className = node.name.text;

      let decoratorName = null;
      let selector = '';

      const decorators = getDecoratorsOfNode(node);
      for (const dec of decorators) {
        const expr = dec.expression;
        if (ts.isCallExpression(expr) && ts.isIdentifier(expr.expression)) {
          const name = expr.expression.text;
          if (name === 'Component' || name === 'Directive') {
            decoratorName = name;

            if (expr.arguments.length > 0) {
              const arg = expr.arguments[0];
              if (ts.isObjectLiteralExpression(arg)) {
                for (const prop of arg.properties) {
                  if (
                    ts.isPropertyAssignment(prop) &&
                    ts.isIdentifier(prop.name) &&
                    prop.name.text === 'selector'
                  ) {
                    if (
                      ts.isStringLiteral(prop.initializer) ||
                      ts.isNoSubstitutionTemplateLiteral(prop.initializer)
                    ) {
                      selector = prop.initializer.text;
                    }
                  }
                }
              }
            }
          }
        }
      }

      if (decoratorName && selector) {
        const jsDocTexts = [];
        const jsDocComments = node.jsDoc;
        if (jsDocComments && jsDocComments.length > 0) {
          for (const commentNode of jsDocComments) {
            let commentText = '';
            if (typeof commentNode.comment === 'string') {
              commentText = commentNode.comment;
            } else if (Array.isArray(commentNode.comment)) {
              commentText = commentNode.comment.map((part) => part.text).join('');
            }
            if (commentText) {
              const cleanText = commentText
                .split(/\r?\n/)
                .map((l) => l.replace(/^\s*\*\s?/, ''))
                .filter((l) => !l.startsWith('@'));
              const cut = cleanText.findIndex((l) => l.startsWith('```'));
              const text = (cut === -1 ? cleanText : cleanText.slice(0, cut))
                .join(' ')
                .replace(/\s+/g, ' ')
                .trim();
              jsDocTexts.push(text);
            }
          }
        }
        const description = jsDocTexts.join(' ').trim();

        const entry = {
          name: className,
          kind: decoratorName,
          selector,
          description,
          inputs: [],
          outputs: [],
        };

        for (const member of node.members) {
          if (ts.isPropertyDeclaration(member) && member.name && ts.isIdentifier(member.name)) {
            const memberName = member.name.text;
            const initializer = member.initializer;

            if (initializer && ts.isCallExpression(initializer)) {
              let callExpr = initializer.expression;
              let isRequired = false;

              if (
                ts.isPropertyAccessExpression(callExpr) &&
                ts.isIdentifier(callExpr.name) &&
                callExpr.name.text === 'required'
              ) {
                isRequired = true;
                callExpr = callExpr.expression;
              }

              if (ts.isIdentifier(callExpr)) {
                const callName = callExpr.text;
                if (callName === 'input') {
                  const typeArg = initializer.typeArguments?.[0];
                  let type = typeArg
                    ? sourceCode.substring(typeArg.getStart(), typeArg.getEnd())
                    : '';
                  const args = initializer.arguments;
                  const defaultVal = isRequired
                    ? undefined
                    : args.length > 0
                      ? sourceCode.substring(args[0].getStart(), args[0].getEnd())
                      : undefined;

                  if (!type) {
                    type = defaultVal ? inferTypeFromCode(defaultVal) : 'unknown';
                  }

                  entry.inputs.push({
                    name: memberName,
                    type,
                    required: isRequired,
                    default: defaultVal,
                  });
                } else if (callName === 'model') {
                  const typeArg = initializer.typeArguments?.[0];
                  let type = typeArg
                    ? sourceCode.substring(typeArg.getStart(), typeArg.getEnd())
                    : '';
                  const args = initializer.arguments;
                  const defaultVal = isRequired
                    ? undefined
                    : args.length > 0
                      ? sourceCode.substring(args[0].getStart(), args[0].getEnd())
                      : undefined;

                  if (!type) {
                    type = defaultVal ? inferTypeFromCode(defaultVal) : 'unknown';
                  }

                  entry.inputs.push({
                    name: memberName,
                    type,
                    required: isRequired,
                    twoWay: true,
                    default: defaultVal,
                  });
                } else if (callName === 'output') {
                  const typeArg = initializer.typeArguments?.[0];
                  const type = typeArg
                    ? sourceCode.substring(typeArg.getStart(), typeArg.getEnd())
                    : 'void';
                  entry.outputs.push({
                    name: memberName,
                    type,
                  });
                }
              }
            }
          }
        }

        entries.push(entry);
      }
    }

    ts.forEachChild(node, visit);
  }

  visit(sourceFile);
  return entries.filter((e) => e.selector);
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
