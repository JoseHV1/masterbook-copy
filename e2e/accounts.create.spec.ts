import { Page, test, expect } from '@playwright/test';

/**
 * E2E: Create an Account (Client)
 *
 * Goal
 * - Simulate a real logged-in user creating an Account (client) from the Portal UI.
 * - Reduce “false positives” by:
 *   1) listening for console errors,
 *   2) waiting for the backend POST request that creates the account,
 *   3) asserting the backend returned a 2xx status,
 *   4) asserting we did NOT see the “email already in use” message,
 *   5) asserting we navigated back to the Accounts page.
 *
 * Preconditions
 * - Playwright is configured with:
 *   - baseURL (so page.goto('/portal/dashboard') works)
 *   - storageState already authenticated (via globalSetup or manual state file)
 * - Your UI has stable data-testid hooks:
 *   - nav-accounts
 *   - accounts-add
 *   - account-form
 *   - account-name, account-first-name, account-last-name, account-ssn-last4
 *   - account-email, account-email-confirm
 *   - account-phone, account-zip, account-address2
 *   - account-address-input (inner input of Google Places control)
 *   - account-gender-trigger (mat-select trigger on dropdown)
 *   - account-dob-input (inner input of datepicker)
 *   - account-marital-status-trigger (mat-select trigger on dropdown)
 *   - account-agent-trigger (agent selector input)
 *   - account-save
 *   - account-confirm-modal, account-confirm
 *
 * Notes about tricky widgets
 * - Google Places Autocomplete:
 *   - Suggestions are rendered in `.pac-container` (outside Angular component tree),
 *     so we wait for `.pac-container` and then select the first item via keyboard
 *     to ensure Google’s “place selected” handlers run.
 *
 * - Angular Material dropdowns:
 *   - mat-select options render as <mat-option> in an overlay.
 *   - We select the first option using `page.locator('mat-option').first()`.
 *
 * Backend request assertion
 * - We start `page.waitForResponse(...)` BEFORE we click the final confirm button.
 * - The predicate must match your real “create account” endpoint.
 *   Right now it matches:
 *     - method POST
 *     - URL contains '/account' (note: you had the same string twice; that’s ok but redundant)
 *
 * Potential improvements (optional)
 * - Make the create endpoint match stricter, e.g. /\/accounts?$/
 * - After creation, search accounts list by email and assert the row exists.
 *   This is the best end-to-end proof that the object exists in the system.
 */

export async function closeTutorialByClickingOutside(page: Page) {
  // Wait a bit for the tutorial to appear after navigation
  const popover = page.locator('.driver-popover');
  const overlay = page.locator('.driver-overlay');

  // If it never appears, nothing to do
  const appeared = await popover
    .isVisible({ timeout: 3000 })
    .catch(() => false);
  if (!appeared) return;

  // Try 1: click the X (fast if it exists)
  const closeBtn = popover.locator(
    '.driver-popover-close-btn, .driver-close-btn, [aria-label="Close"]'
  );
  if (
    await closeBtn
      .first()
      .isVisible()
      .catch(() => false)
  ) {
    await closeBtn
      .first()
      .click()
      .catch(() => {});
    if (!(await popover.isVisible().catch(() => false))) return;
  }

  // Try 2: CLICK OUTSIDE the box (real mouse coords)
  const box = await popover.boundingBox();
  if (box) {
    // pick a point outside the popover
    // prefer top-left; if too close to screen edge, go bottom-right
    const x = box.x > 20 ? box.x - 10 : box.x + box.width + 20;
    const y = box.y > 20 ? box.y - 10 : box.y + box.height + 20;

    await page.mouse.click(x, y);
    await page.waitForTimeout(250);

    // if it closed, we’re done
    if (!(await popover.isVisible().catch(() => false))) return;
  }

  // Try 3: if it still refuses to close, neutralize it so it stops blocking clicks
  // (overlay might remain visually, but it won’t intercept pointer events)
  await page.evaluate(() => {
    const overlay = document.querySelector<HTMLElement>('.driver-overlay');
    const pop = document.querySelector<HTMLElement>('.driver-popover');
    if (overlay) overlay.style.pointerEvents = 'none';
    if (pop) pop.style.pointerEvents = 'none';
  });

  // Give the browser a tick to apply styles
  await page.waitForTimeout(50);

  // Sanity check: the button should now be clickable
  await page.getByTestId('accounts-add').click({ trial: true });
}

test('create an account (client)', async ({ page }) => {
  /**
   * 1) Console error logging
   * - Useful during test writing/debugging: if the UI throws errors (e.g. failed API calls),
   *   you’ll see them in the terminal output.
   * - This does NOT fail the test by itself; it just logs.
   *   If you want to fail, you can collect errors and assert at the end.
   */
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('🧨 console error:', msg.text());
    }
  });

  /**
   * Navigate to dashboard (authenticated route).
   * Requires storageState auth already set.
   */
  await page.goto('/portal/dashboard');

  /**
   * Open Accounts module from the left nav.
   */
  await page.getByTestId('nav-accounts').click();

  await closeTutorialByClickingOutside(page);

  /**
   * Click the "Create account" button from the module header layout.
   * This should navigate to the account creation form route.
   */
  await page.getByTestId('accounts-add').click();

  /**
   * Locate the form container and ensure it's visible.
   */
  const form = page.getByTestId('account-form');
  await expect(form).toBeVisible();

  /**
   * Build a short unique token to avoid email collisions and length limits.
   * - Date.now() limited + base36 keeps it short
   * - Math.random() adds extra uniqueness
   */
  const uniq =
    (Date.now() % 1_000_000).toString(36) +
    Math.random().toString(36).slice(2, 5);

  /**
   * Final email used for the account.
   * Keep it short because your backend/UI may have max length constraints.
   */
  const email = `e${uniq}@t.co`;

  /**
   * 2) Start waiting for the backend create request BEFORE clicking confirm.
   * Why: if we start waiting after the click, we can miss the request and hang.
   *
   * ⚠️ IMPORTANT:
   * Update this predicate to match your real API route exactly.
   * Example stricter predicate:
   *   url.includes('/accounts') && !url.includes('/accounts/search')
   */
  const createReqPromise = page.waitForResponse(res => {
    const url = res.url();
    const isAccountsCreate =
      res.request().method() === 'POST' &&
      (url.includes('/account') || url.includes('/account'));
    return isAccountsCreate;
  });

  /**
   * --- Fill required fields (app-input wrappers) ---
   * These are your custom form controls with inner real input having data-testid.
   */
  await form.getByTestId('account-name').fill(`E2E Client ${uniq}`);
  await form.getByTestId('account-first-name').fill('E2E');
  await form.getByTestId('account-last-name').fill(`Client${uniq}`);
  await form.getByTestId('account-ssn-last4').fill('1234');
  await form.getByTestId('account-email').fill(email);
  await form.getByTestId('account-email-confirm').fill(email);
  await form.getByTestId('account-phone').fill('(416) 555-1234');
  await form.getByTestId('account-zip').fill('12345');
  await form.getByTestId('account-address2').fill('Apt 1');

  /**
   * --- Address (Google Places autocomplete) ---
   * - Fill the address input
   * - Wait for `.pac-container` results
   * - Select first suggestion with keyboard to trigger "place selected" hooks
   */
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

  /**
   * --- Gender dropdown (Angular Material mat-select) ---
   * Click the trigger, then select the first available mat-option.
   */
  await form.getByTestId('account-gender-trigger').click();
  await page.locator('mat-option').first().click();

  /**
   * --- Date of birth (Angular Material datepicker input) ---
   * If your datepicker expects a different format (or locale), adjust here.
   */
  await form.getByTestId('account-dob-input').fill('01/01/1990');

  /**
   * --- Marital status dropdown ---
   */
  await form.getByTestId('account-marital-status-trigger').click();
  await page.locator('mat-option').first().click();

  /**
   * --- Agent selector (required for admins only) ---
   * This field is conditional, so we only interact if it exists.
   * - Type 'a' to trigger list
   * - Select first mat-option in the autocomplete overlay
   *
   * ⚠️ If your autocomplete renders options as `.mat-option` in some versions,
   * you may need to switch selector accordingly.
   */
  const agent = form.getByTestId('account-agent-trigger');
  if (await agent.count()) {
    await agent.click();
    await agent.fill('a');
    await page.locator('mat-option').first().click();
  }

  /**
   * Ensure Save button is enabled (meaning form is valid).
   * If this hangs, it usually means:
   * - some required field didn’t get a value
   * - Google Places selection didn’t set address control correctly
   * - agent selection is required but wasn’t selected
   */
  const save = form.getByTestId('account-save');
  await expect(save).toBeEnabled({ timeout: 10_000 });

  /**
   * Click Save to open confirmation modal.
   */
  await save.click();

  /**
   * Confirm modal should appear.
   */
  const confirm = page.getByTestId('account-confirm-modal');
  await expect(confirm).toBeVisible({ timeout: 10_000 });

  /**
   * 3) Click Accept on confirmation modal
   * The create request should fire around here.
   */
  await confirm.getByTestId('account-confirm').click();

  /**
   * Wait for backend create response.
   * If this times out but the account is actually created, the most common reason is:
   * - the predicate didn't match the real endpoint URL
   * - request is made by a different page/frame than expected
   * - POST happens earlier than the click you think triggers it
   */
  const createRes = await createReqPromise;

  /**
   * 4) Hard assert backend success.
   * This prevents "UI navigated but backend failed" false positives.
   */
  expect(
    createRes.status(),
    `Create account failed. Status=${createRes.status()}`
  ).toBeGreaterThanOrEqual(200);
  expect(
    createRes.status(),
    `Create account failed. Status=${createRes.status()}`
  ).toBeLessThan(300);

  /**
   * 5) Optional: log JSON body (only if API responds with JSON).
   */
  const ct = createRes.headers()['content-type'] ?? '';
  if (ct.includes('application/json')) {
    const body = await createRes.json().catch(() => null);
    console.log('✅ create account response json:', body);
  }

  /**
   * 6) Assert we did NOT get the “email already in use” message.
   * Adjust this text/selector to match your real validation UI.
   */
  await expect(
    page.getByText(/correo electr[oó]nico ya est[aá] en uso/i)
  ).toHaveCount(0);

  /**
   * 7) Secondary signal: verify we end up back on Accounts route.
   */
  await expect(page).toHaveURL(/accounts/i);

  /**
   * 8) Best final proof (recommended):
   * Search/filter the accounts list by `email` and assert it appears in the table.
   * (Requires a stable test id on the search input + table)
   */
  // await page.getByTestId('accounts-search').fill(email);
  // await expect(page.getByTestId('accounts-table')).toContainText(email, { timeout: 10_000 });
});
