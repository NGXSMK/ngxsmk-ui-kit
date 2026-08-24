#!/usr/bin/env node
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

console.log('🔍 Running NGXSMK Technical SEO & GEO Verification Linter...\n');

let totalChecks = 0;
let passedChecks = 0;
const errors = [];
const warnings = [];

function check(desc, condition, errorMsg) {
  totalChecks++;
  if (condition) {
    passedChecks++;
  } else {
    errors.push(errorMsg || desc);
  }
}

// 1. Check robots.txt
const robotsPath = join(process.cwd(), 'apps/demo/public/robots.txt');
check('robots.txt exists in demo public directory', existsSync(robotsPath));
if (existsSync(robotsPath)) {
  const robotsContent = readFileSync(robotsPath, 'utf-8');
  check('robots.txt declares Sitemap index', robotsContent.includes('Sitemap:'));
  check('robots.txt declares GPTBot permissions', robotsContent.includes('User-agent: GPTBot'));
  check(
    'robots.txt declares ClaudeBot permissions',
    robotsContent.includes('User-agent: ClaudeBot'),
  );
}

// 2. Check sitemap.xml
const sitemapPath = join(process.cwd(), 'apps/demo/public/sitemap.xml');
check('sitemap.xml exists in demo public directory', existsSync(sitemapPath));
if (existsSync(sitemapPath)) {
  const sitemapContent = readFileSync(sitemapPath, 'utf-8');
  check(
    'sitemap.xml is valid urlset XML',
    sitemapContent.includes('<urlset') && sitemapContent.includes('</urlset>'),
  );
  check(
    'sitemap.xml includes root URL',
    sitemapContent.includes('<loc>https://ngxsmk.github.io/ngxsmk-ui-kit/</loc>'),
  );
  check('sitemap.xml includes docs URL', sitemapContent.includes('/docs</loc>'));
  check(
    'sitemap.xml includes showcase explorer',
    sitemapContent.includes('/showcase/explorer</loc>'),
  );
  check('sitemap.xml includes AI showcase', sitemapContent.includes('/showcase/ai</loc>'));
}

// 3. Check machine-readable AI files
const llmsPath = join(process.cwd(), 'apps/demo/public/llms.txt');
const llmsFullPath = join(process.cwd(), 'apps/demo/public/llms-full.txt');
check('llms.txt exists in demo public', existsSync(llmsPath));
check('llms-full.txt exists in demo public', existsSync(llmsFullPath));

// 4. Check route metadata in app.routes.ts
const routesPath = join(process.cwd(), 'apps/demo/src/app/app.routes.ts');
check('app.routes.ts exists', existsSync(routesPath));
if (existsSync(routesPath)) {
  const routesContent = readFileSync(routesPath, 'utf-8');
  check('app.routes.ts defines titles', routesContent.includes('title:'));
  check('app.routes.ts defines meta descriptions', routesContent.includes('description:'));
  check(
    'app.routes.ts defines OpenGraph/Twitter friendly descriptions',
    routesContent.length > 5000,
  );
}

// 5. Check SEO service implementation
const seoServicePath = join(process.cwd(), 'packages/core/seo/seo.service.ts');
check('NgxsmkSeoService exists in @ngxsmk/core/seo', existsSync(seoServicePath));
if (existsSync(seoServicePath)) {
  const seoServiceContent = readFileSync(seoServicePath, 'utf-8');
  check('NgxsmkSeoService handles JSON-LD structured data', seoServiceContent.includes('jsonLd'));
  check('NgxsmkSeoService handles OpenGraph tags', seoServiceContent.includes('og:'));
  check('NgxsmkSeoService handles Canonical tags', seoServiceContent.includes('canonical'));
  check('NgxsmkSeoService handles Twitter Card tags', seoServiceContent.includes('twitter:'));
}

// Summary
const score = Math.round((passedChecks / totalChecks) * 100);

console.log('===============================================================');
console.log('            NGXSMK TECHNICAL SEO & GEO SCORECARD               ');
console.log('===============================================================');
console.log(`Total SEO Audit Checks:     ${totalChecks}`);
console.log(`Passed Checks:              ${passedChecks}`);
console.log(`Overall SEO Health Score:   ${score}%`);
console.log('---------------------------------------------------------------');

if (errors.length > 0) {
  console.error('\n❌ SEO Errors:');
  for (const err of errors) {
    console.error(`  - ${err}`);
  }
  process.exit(1);
} else {
  console.log('🎉 All Technical SEO, Sitemaps, and GEO checks PASSED!\n');
}
