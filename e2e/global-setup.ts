import { chromium, expect, type FullConfig } from '@playwright/test';
import fs from 'fs';

async function neutralizeOverlays(page: any) {
  // try your known tutorial helper behavior without importing test file
  await page.evaluate(() => {
    const selectors = [
      '.driver-overlay',
      '.driver-popover',
      '.cdk-overlay-backdrop',
      '[data-testid="tutorial"]',
      '[data-testid="cookie-banner"]',
    ];
    for (const sel of selectors) {
      document.querySelectorAll<HTMLElement>(sel).forEach(el => {
        el.style.pointerEvents = 'none';
      });
    }
  });
}

export default async function globalSetup(config: FullConfig) {
  const baseURL = 'http://localhost:4200';

  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    // Go to the route that has the login entry point
    await page.goto(`${baseURL}/agents`, { waitUntil: 'domcontentloaded' });

    // If any overlay is present in CI, remove its ability to block clicks
    await neutralizeOverlays(page);

    // Open modal (force in case overlay intercepts normal click)
    await page.getByTestId('nav-login').click({ force: true });

    const modal = page.getByTestId('login-modal');
    await expect(modal).toBeVisible({ timeout: 15000 });

    // Fill credentials
    await modal
      .getByTestId('login-email')
      .fill(process.env['E2E_USER_EMAIL'] ?? 'user1@yopmail.com');

    await modal
      .getByTestId('login-password')
      .fill(process.env['E2E_USER_PASSWORD'] ?? 'Password1234#');

    // Make sure submit is actually clickable
    const submit = modal.getByTestId('login-submit');
    await expect(submit).toBeVisible({ timeout: 15000 });
    await expect(submit).toBeEnabled({ timeout: 15000 });

    // Click submit
    await submit.click({ force: true });

    // Wait for navigation OR modal to disappear (more robust than URL only)
    await Promise.race([
      page.waitForURL(url => !url.toString().endsWith('/agents'), {
        timeout: 20000,
      }),
      expect(modal).toBeHidden({ timeout: 20000 }),
    ]);

    // Save auth state
    await page.context().storageState({ path: 'e2e/.auth/state.json' });
  } catch (err) {
    // Helpful CI artifacts
    await page.screenshot({
      path: 'test-results/global-setup-failed.png',
      fullPage: true,
    });
    fs.writeFileSync(
      'test-results/global-setup-failed.html',
      await page.content()
    );
    throw err;
  } finally {
    await browser.close();
  }
}
