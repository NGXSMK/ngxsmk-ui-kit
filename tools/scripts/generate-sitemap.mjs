#!/usr/bin/env node
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';

const BASE_URL = 'https://ngxsmk.github.io/ngxsmk-ui-kit';

const STATIC_ROUTES = [
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

  // Showcase Category Pages
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

  // Machine Readable AI Docs
  { path: 'llms.txt', priority: 0.95, changefreq: 'weekly' },
  { path: 'llms-full.txt', priority: 0.95, changefreq: 'weekly' },
];

console.log('🗺️  Generating NGXSMK XML Sitemap...');

const today = new Date().toISOString().split('T')[0];

const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${STATIC_ROUTES.map(
  (entry) => `  <url>
    <loc>${BASE_URL}/${entry.path}</loc>
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
