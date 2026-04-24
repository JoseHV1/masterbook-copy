import { test, expect } from '@playwright/test';

test('accounts module smoke: nav + create button exists', async ({ page }) => {
  await page.goto('/portal/dashboard');

  // 1) click Accounts
  await page.getByTestId('nav-accounts').click();

  // 2) prove we actually navigated (adjust regex if your route differs)
  await expect(page).toHaveURL(/accounts/i);

  // 3) check if the button exists by the existing ID (debug anchor)
  const btnById = page.locator('#create-account-tutor');
  await expect(btnById).toBeVisible();

  // 4) now check the data-testid (the thing we want long-term)
  const btnByTestId = page.getByTestId('accounts-add');
  await expect(btnByTestId).toBeVisible();
});
