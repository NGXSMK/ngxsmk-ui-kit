#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const BASE_URL = 'https://ngxsmk.github.io/ngxsmk-ui-kit';

/** Fallback when route parsing fails — keep in sync with apps/demo/src/app/app.routes.ts */
const FALLBACK_ROUTES = [
  { path: '', priority: 1.0, changefreq: 'daily' },
  { path: 'docs', priority: 0.9, changefreq: 'weekly' },
  { path: 'api', priority: 0.9, changefreq: 'weekly' },
  { path: 'templates', priority: 0.85, changefreq: 'weekly' },
  { path: 'themes', priority: 0.85, changefreq: 'weekly' },
  { path: 'playground', priority: 0.8, changefreq: 'weekly' },
  { path: 'playground/component', priority: 0.8, changefreq: 'weekly' },
  { path: 'community', priority: 0.7, changefreq: 'monthly' },
  { path: 'blog', priority: 0.75, changefreq: 'weekly' },
  { path: 'changelog', priority: 0.8, changefreq: 'weekly' },
  { path: 'roadmap', priority: 0.7, changefreq: 'monthly' },
  { path: 'showcase/explorer', priority: 0.9, changefreq: 'weekly' },
  { path: 'showcase/content-typography', priority: 0.8, changefreq: 'weekly' },
  { path: 'showcase/navigation', priority: 0.8, changefreq: 'weekly' },
  { path: 'showcase/layout', priority: 0.8, changefreq: 'weekly' },
  { path: 'showcase/forms', priority: 0.85, changefreq: 'weekly' },
  { path: 'showcase/feedback', priority: 0.8, changefreq: 'weekly' },
  { path: 'showcase/data-display', priority: 0.85, changefreq: 'weekly' },
  { path: 'showcase/overlay', priority: 0.85, changefreq: 'weekly' },
  { path: 'showcase/charts', priority: 0.8, changefreq: 'weekly' },
  { path: 'showcase/ai', priority: 0.9, changefreq: 'weekly' },
  { path: 'showcase/enterprise', priority: 0.9, changefreq: 'weekly' },
  { path: 'showcase/utilities', priority: 0.75, changefreq: 'weekly' },
  { path: 'llms.txt', priority: 0.95, changefreq: 'weekly' },
  { path: 'llms-full.txt', priority: 0.95, changefreq: 'weekly' },
];

const PRIORITY_BY_PATH = new Map(FALLBACK_ROUTES.map((r) => [r.path, r]));

function extractRoutesFromAppRoutes() {
  const routesPath = join(process.cwd(), 'apps/demo/src/app/app.routes.ts');
  let source;
  try {
    source = readFileSync(routesPath, 'utf-8');
  } catch {
    return null;
  }

  const paths = new Set(['']);
  // Top-level paths: path: 'docs'
  for (const match of source.matchAll(/\bpath:\s*'([^']*)'/g)) {
    const p = match[1];
    if (!p || p === '**') continue;
    // Skip empty showcase redirect leaf — handled via full child paths below
    paths.add(p);
  }

  // Showcase children are nested under path: 'showcase'
  const showcaseBlock = source.match(/path:\s*'showcase'[\s\S]*?children:\s*\[([\s\S]*?)\n\s*\],/);
  if (showcaseBlock) {
    for (const match of showcaseBlock[1].matchAll(/\bpath:\s*'([^']+)'/g)) {
      const child = match[1];
      if (child && child !== '') paths.add(`showcase/${child}`);
    }
    paths.delete('showcase');
    paths.delete('explorer');
    paths.delete('content-typography');
    paths.delete('navigation');
    paths.delete('layout');
    paths.delete('forms');
    paths.delete('feedback');
    paths.delete('data-display');
    paths.delete('overlay');
    paths.delete('charts');
    paths.delete('ai');
    paths.delete('enterprise');
    paths.delete('utilities');
  }

  // Always include machine-readable docs
  paths.add('llms.txt');
  paths.add('llms-full.txt');

  return [...paths].map((path) => {
    const known = PRIORITY_BY_PATH.get(path);
    return {
      path,
      priority: known?.priority ?? (path.startsWith('showcase/') ? 0.8 : 0.7),
      changefreq: known?.changefreq ?? 'weekly',
    };
  });
}

function locFor(path) {
  if (!path) return `${BASE_URL}/`;
  return `${BASE_URL}/${path.replace(/^\/+/, '')}`;
}

console.log('🗺️  Generating NGXSMK XML Sitemap...');

const discovered = extractRoutesFromAppRoutes();
const STATIC_ROUTES = (discovered ?? FALLBACK_ROUTES).sort((a, b) => {
  if (a.path === '') return -1;
  if (b.path === '') return 1;
  return a.path.localeCompare(b.path);
});

const today = new Date().toISOString().split('T')[0];

const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${STATIC_ROUTES.map(
  (entry) => `  <url>
    <loc>${locFor(entry.path)}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority.toFixed(2)}</priority>
  </url>`,
).join('\n')}
</urlset>
`;

const outputPath = join(process.cwd(), 'apps/demo/public/sitemap.xml');
writeFileSync(outputPath, xmlContent, 'utf-8');

console.log(
  `✅ Successfully generated sitemap with ${STATIC_ROUTES.length} URLs at: ${outputPath}`,
);
