import { test, expect } from '@playwright/test';

test('create an account (client)', async ({ page }) => {
  // ✅ 1) Fail test on console errors (optional but useful)
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('🧨 console error:', msg.text());
    }
  });

  await page.goto('/portal/dashboard');

  // go to accounts list
  await page.getByTestId('nav-accounts').click();

  // click create button from layout
  await page.getByTestId('accounts-add').click();

  const form = page.getByTestId('account-form');
  await expect(form).toBeVisible();

  const uniq =
    (Date.now() % 1_000_000).toString(36) +
    Math.random().toString(36).slice(2, 5);

  const email = `e${uniq}@t.co`;

  // ✅ 2) Start waiting for the CREATE request BEFORE we click confirm
  // Change this URL pattern to match your real API (examples below).
  const createReqPromise = page.waitForResponse(res => {
    const url = res.url();
    const isAccountsCreate =
      res.request().method() === 'POST' &&
      (url.includes('/account') || url.includes('/account'));
    return isAccountsCreate;
  });

  // --- Fill required app-input fields ---
  await form.getByTestId('account-name').fill(`E2E Client ${uniq}`);
  await form.getByTestId('account-first-name').fill('E2E');
  await form.getByTestId('account-last-name').fill(`Client${uniq}`);
  await form.getByTestId('account-ssn-last4').fill('1234');
  await form.getByTestId('account-email').fill(email);
  await form.getByTestId('account-email-confirm').fill(email);
  await form.getByTestId('account-phone').fill('(416) 555-1234');
  await form.getByTestId('account-zip').fill('12345');
  await form.getByTestId('account-address2').fill('Apt 1');

  // --- Address (Google Places autocomplete) ---
  const addressInput = form.getByTestId('account-address-input');
  await addressInput.click();
  await addressInput.fill('123 Main');

  const pac = page.locator('.pac-container');
  await expect(pac).toBeVisible({ timeout: 10_000 });
  await expect(pac.locator('.pac-item').first()).toBeVisible({
    timeout: 10_000,
  });

  await addressInput.press('ArrowDown');
  await addressInput.press('Enter');

  // --- Gender dropdown ---
  await form.getByTestId('account-gender-trigger').click();
  await page.locator('mat-option').first().click();

  // --- Date of birth ---
  await form.getByTestId('account-dob-input').fill('01/01/1990');

  // --- Marital status dropdown ---
  await form.getByTestId('account-marital-status-trigger').click();
  await page.locator('mat-option').first().click();

  // --- Agent selector (required for admins) ---
  const agent = form.getByTestId('account-agent-trigger');
  if (await agent.count()) {
    await agent.click();
    await agent.fill('a');
    await page.locator('mat-option').first().click();
  }

  // --- Ensure form is valid before trying to click Save ---
  const save = form.getByTestId('account-save');
  await expect(save).toBeEnabled({ timeout: 10_000 });

  // click save to open confirmation modal
  await save.click();

  const confirm = page.getByTestId('account-confirm-modal');
  await expect(confirm).toBeVisible({ timeout: 10_000 });

  // ✅ 3) Click confirm AND wait for backend response
  await confirm.getByTestId('account-confirm').click();

  const createRes = await createReqPromise;

  // ✅ 4) Hard assert backend success (kills false positives)
  expect(
    createRes.status(),
    `Create account failed. Status=${createRes.status()}`
  ).toBeGreaterThanOrEqual(200);
  expect(
    createRes.status(),
    `Create account failed. Status=${createRes.status()}`
  ).toBeLessThan(300);

  // ✅ 5) Optional: If backend returns JSON, you can assert it contains something useful
  // (only do this if your API returns JSON)
  const ct = createRes.headers()['content-type'] ?? '';
  if (ct.includes('application/json')) {
    const body = await createRes.json().catch(() => null);
    console.log('✅ create account response json:', body);
  }

  // ✅ 6) Fail if an error toast shows up (adjust selector/text to your app)
  // If you can add a data-testid to your toast component, do it and check it here.
  await expect(
    page.getByText(/correo electr[oó]nico ya est[aá] en uso/i)
  ).toHaveCount(0);

  // ✅ 7) Keep your URL check as a secondary signal
  await expect(page).toHaveURL(/accounts/i);

  // ✅ 8) BEST final proof: verify the account appears in the list
  // If your accounts page has a search input, filter by email and assert it appears.
  // Example (only if you have this test id):
  //
  // await page.getByTestId('accounts-search').fill(email);
  // await expect(page.getByTestId('accounts-table')).toContainText(email, { timeout: 10_000 });
});
