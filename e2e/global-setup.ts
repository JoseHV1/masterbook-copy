import { chromium, expect, type FullConfig } from '@playwright/test';

export default async function globalSetup(config: FullConfig) {
  const baseURL = config.projects[0].use.baseURL as string;

  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.goto(`${baseURL}/agents`);

  // open modal
  await page.getByTestId('nav-login').click();

  // ensure modal is visible
  const modal = page.getByTestId('login-modal');
  await expect(modal).toBeVisible();

  // fill credentials
  await modal
    .getByTestId('login-email')
    .fill(process.env['E2E_USER_EMAIL'] ?? 'simonowner@simon.com');

  await modal
    .getByTestId('login-password')
    .fill(process.env['E2E_USER_PASSWORD'] ?? 'Password1234');

  // click submit + wait for "something" that indicates login completed
  // (URL change is okay for now since it already works for you)
  await modal.getByTestId('login-submit').click();
  await expect(page).not.toHaveURL(/\/agents$/);

  // save auth state (cookies + localStorage)
  await page.context().storageState({ path: 'e2e/.auth/state.json' });

  await browser.close();
}
