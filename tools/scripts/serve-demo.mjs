#!/usr/bin/env node
/**
 * Minimal static server for the built demo (dist/demo/browser) with SPA
 * fallback to index.html. Used by Playwright's webServer for visual tests.
 *
 * Usage: node tools/scripts/serve-demo.mjs [port]   (default 4300)
 */
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { existsSync, statSync } from 'node:fs';
import { join, extname, normalize, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..', 'dist', 'demo', 'browser');
const port = Number(process.argv[2]) || 4300;

if (!existsSync(join(root, 'index.html'))) {
  console.error(`Demo build not found at ${root} — run "npm run build:demo" first.`);
  process.exit(1);
}

const MIME = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.mjs': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain',
};

// The demo is built with a GitHub Pages base href (e.g. /ngxsmk-ui-kit/);
// serve the app under that prefix too.
const indexHtml = await readFile(join(root, 'index.html'), 'utf8');
const baseHref = indexHtml.match(/<base href="([^"]*)"/)?.[1] ?? '/';

createServer(async (req, res) => {
  let urlPath = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  if (baseHref !== '/' && urlPath.startsWith(baseHref.replace(/\/$/, ''))) {
    urlPath = urlPath.slice(baseHref.replace(/\/$/, '').length) || '/';
  }
  let filePath = normalize(join(root, urlPath));
  if (!filePath.startsWith(root)) {
    res.writeHead(403).end();
    return;
  }
  if (!existsSync(filePath) || statSync(filePath).isDirectory()) {
    filePath = join(root, 'index.html');
  }
  try {
    const body = await readFile(filePath);
    res.writeHead(200, { 'content-type': MIME[extname(filePath)] ?? 'application/octet-stream' });
    res.end(body);
  } catch {
    res.writeHead(500).end();
  }
}).listen(port, () => console.log(`Serving demo at http://localhost:${port}`));
