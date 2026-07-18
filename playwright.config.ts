import { defineConfig, devices } from '@playwright/test';

/**
 * Visual regression tests for the demo app. Screenshots are committed under
 * tests/visual/__screenshots__ and compared per light/dark project.
 *
 * Baselines are rendered on Linux (CI); the snapshot path has no platform
 * suffix, so refresh them via CI artifacts rather than a local
 * `--update-snapshots` run on Windows/macOS.
 */
export default defineConfig({
  testDir: 'tests/visual',
  snapshotPathTemplate: '{testDir}/__screenshots__/{projectName}/{arg}{ext}',
  fullyParallel: true,
  forbidOnly: !!process.env['CI'],
  retries: process.env['CI'] ? 1 : 0,
  reporter: process.env['CI'] ? [['github'], ['html', { open: 'never' }]] : 'list',
  use: {
    // serve-demo.mjs normalizes any build's base href to "/", so the app is
    // always rooted here regardless of the GitHub Pages prefix.
    baseURL: 'http://localhost:4300/',
    viewport: { width: 1280, height: 800 },
  },
  expect: {
    toHaveScreenshot: { maxDiffPixelRatio: 0.02, animations: 'disabled' },
  },
  projects: [
    { name: 'light', use: { ...devices['Desktop Chrome'], colorScheme: 'light' } },
    { name: 'dark', use: { ...devices['Desktop Chrome'], colorScheme: 'dark' } },
  ],
  webServer: {
    command: 'node tools/scripts/serve-demo.mjs 4300',
    url: 'http://localhost:4300',
    reuseExistingServer: !process.env['CI'],
  },
});
