import { test, expect } from '@playwright/test';

// Route -> snapshot name. Keep this list small and stable; every entry is
// captured in both light and dark projects.
// Paths are relative so they resolve under the app's base href.
const PAGES: Record<string, string> = {
  '.': 'home',
  docs: 'docs',
  'showcase/forms': 'showcase-forms',
  'showcase/navigation': 'showcase-navigation',
  'showcase/feedback': 'showcase-feedback',
};

// Pin the demo's theme to the project name (light/dark) so screenshots are
// deterministic regardless of OS color-scheme emulation.
test.beforeEach(async ({ page }, testInfo) => {
  await page.addInitScript((mode: string) => {
    window.localStorage.setItem('ngxsmk-theme-mode', mode);
  }, testInfo.project.name);
});

for (const [route, name] of Object.entries(PAGES)) {
  test(`${name} page`, async ({ page }) => {
    await page.goto(route, { waitUntil: 'networkidle' });
    // Let lazy-loaded content and fonts settle.
    await page.evaluate(() => document.fonts.ready);
    await expect(page).toHaveScreenshot(`${name}.png`, { fullPage: true });
  });
}
