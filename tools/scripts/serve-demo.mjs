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

// The demo may be built with a GitHub Pages base href (/ngxsmk-ui-kit/) or
// with the default (/). Normalize both to serve at the root: strip the
// prefix from incoming requests and rewrite <base href> to "/" so the
// Angular router always resolves routes the same way in tests.
const rawIndex = await readFile(join(root, 'index.html'), 'utf8');
const baseHref = rawIndex.match(/<base href="([^"]*)"/)?.[1] ?? '/';
const indexHtml = rawIndex.replace(/<base href="[^"]*"/, '<base href="/"');
const prefix = baseHref.replace(/\/$/, '');

createServer(async (req, res) => {
  let urlPath = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  if (prefix && urlPath.startsWith(prefix)) {
    urlPath = urlPath.slice(prefix.length) || '/';
  }
  let filePath = normalize(join(root, urlPath));
  if (!filePath.startsWith(root)) {
    res.writeHead(403).end();
    return;
  }
  const isIndex =
    !existsSync(filePath) || statSync(filePath).isDirectory() || filePath.endsWith('index.html');
  try {
    const body = isIndex ? indexHtml : await readFile(filePath);
    res.writeHead(200, {
      'content-type': isIndex
        ? 'text/html'
        : (MIME[extname(filePath)] ?? 'application/octet-stream'),
    });
    res.end(body);
  } catch {
    res.writeHead(500).end();
  }
}).listen(port, () => console.log(`Serving demo at http://localhost:${port}`));
