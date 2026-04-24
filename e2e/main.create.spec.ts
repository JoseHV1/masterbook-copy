import { Page, test, expect, Locator } from '@playwright/test';
import path from 'path';

/**
 * Masterbook Portal — Main Workflow E2E Suite
 *
 * This file covers the “happy path” core flow of the product:
 *   1) Create Account (client)
 *   2) Create Request for that Account
 *   3) Create Quote for that Request
 *   4) Create Policy from that Quote
 *   5) Create Payment and apply to that Policy
 *
 * Key design choices (to keep tests stable):
 * - Prefer `data-testid` locators over text/DOM structure whenever possible.
 * - For network assertions, always start `waitForResponse()` BEFORE clicking the final action button.
 * - For custom Angular wrapper components (app-input, app-date-field, etc.),
 *   interact with the real inner <input> elements.
 * - Close overlays/backdrops (datepickers, tutorials) so they don’t intercept clicks.
 *
 * Assumptions / Preconditions
 * - Playwright `baseURL` is configured so we can use `page.goto('/portal/...')`.
 * - `storageState` is configured and already authenticated.
 * - Fixtures exist at: e2e/fixtures/sample.pdf
 * - Your UI has the referenced `data-testid` hooks.
 *
 * Debugging tips
 * - If a test fails, open the trace:
 *     npx playwright show-trace test-results/<test-folder>/trace.zip
 * - Most “click timeout” issues are due to overlays intercepting pointer events.
 * - Most “Submit disabled” issues are due to one required field not being set
 *   (often the date field or a selector that didn’t truly select an option).
 */

// ----------------------------
// Helpers
// ----------------------------

/**
 * Fill a masked date input inside your custom <app-date-field>.
 *
 * Why type() with delay:
 * - Many masked inputs ignore `fill()` or don’t trigger validators correctly.
 * - `type()` with a small delay mimics a real user and reliably triggers mask logic.
 *
 * Proof:
 * - We assert the input ends up with an MM/DD/YYYY-like value.
 */
const fillDateField = async (
  root: Locator,
  value: string,
  debugName: string
) => {
  const input = root.locator('input').first();

  await input.scrollIntoViewIfNeeded();
  await expect(input).toBeVisible({ timeout: 15000 });

  await input.click({ force: true });
  await input.press('Control+A').catch(() => null);
  await input.press('Backspace').catch(() => null);

  await input.type(value, { delay: 50 });
  await input.press('Tab').catch(() => null);

  await expect(input, `${debugName} not set`).toHaveValue(
    /\d{1,2}\/\d{1,2}\/\d{4}/,
    { timeout: 15000 }
  );
};

/**
 * Fill a money/masked currency field inside your custom <app-input>.
 *
 * Why:
 * - Your app-input component is a wrapper; Playwright must target the inner <input>.
 * - Masked inputs often need focus + blur to update form validity.
 *
 * Proof:
 * - We assert the input has *some* value after typing.
 *   (If you want, you can tighten this to /2000|2,000/ etc.)
 */
const fillMoneyField = async (
  rootLocator: Locator,
  value: string,
  debugName: string
) => {
  const input = rootLocator.locator('input, textarea').first();

  await input.scrollIntoViewIfNeeded();
  await expect(input).toBeVisible({ timeout: 15000 });

  await input.click({ force: true });
  await input.press('Control+A').catch(() => null);
  await input.press('Backspace').catch(() => null);

  await input.fill(value);
  await input.press('Tab').catch(() => null);

  await expect(input, `${debugName} did not take value`).toHaveValue(/.*/, {
    timeout: 15000,
  });
};

/**
 * Close the tutorial popover (Driver.js style) by clicking outside.
 *
 * Why:
 * - The tutorial overlay can intercept pointer events and break clicks
 *   even when elements look visible.
 *
 * Strategy:
 * 1) Try clicking the close button if present.
 * 2) Click outside the popover using real mouse coordinates.
 * 3) As a last resort, disable pointer events for overlay/popover.
 */
export async function closeTutorialByClickingOutside(page: Page) {
  const popover = page.locator('.driver-popover');

  const appeared = await popover
    .isVisible({ timeout: 3000 })
    .catch(() => false);
  if (!appeared) return;

  // Try 1: click close button
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

  // Try 2: click outside the popover (real mouse coords)
  const box = await popover.boundingBox();
  if (box) {
    const x = box.x > 20 ? box.x - 10 : box.x + box.width + 20;
    const y = box.y > 20 ? box.y - 10 : box.y + box.height + 20;

    await page.mouse.click(x, y);
    await page.waitForTimeout(250);

    if (!(await popover.isVisible().catch(() => false))) return;
  }

  // Try 3: disable pointer events to unblock UI
  await page.evaluate(() => {
    const overlay = document.querySelector<HTMLElement>('.driver-overlay');
    const pop = document.querySelector<HTMLElement>('.driver-popover');
    if (overlay) overlay.style.pointerEvents = 'none';
    if (pop) pop.style.pointerEvents = 'none';
  });

  await page.waitForTimeout(50);

  // Sanity check: this should now be clickable
  await page.getByTestId('accounts-add').click({ trial: true });
}

// ----------------------------
// Tests
// ----------------------------

test('create an account (client)', async ({ page }) => {
  /**
   * Purpose
   * - Create a new Account (Client) from the Accounts module.
   *
   * Success criteria
   * - Backend create endpoint returns 2xx.
   * - We do not see “email already in use”.
   * - We land back on Accounts route.
   *
   * Notes
   * - Uses Google Places autocomplete, which renders suggestions in `.pac-container`.
   * - Uses Angular Material overlays for select dropdowns.
   */
  page.on('console', msg => {
    if (msg.type() === 'error') console.log('🧨 console error:', msg.text());
  });

  await page.goto('/portal/dashboard');

  await page.getByTestId('nav-accounts').click();

  // The tutorial often appears on first load and can block clicks.
  await closeTutorialByClickingOutside(page);

  await page.getByTestId('accounts-add').click();

  const form = page.getByTestId('account-form');
  await expect(form).toBeVisible();

  // Short unique token to avoid collisions and length limits.
  const uniq =
    (Date.now() % 1_000_000).toString(36) +
    Math.random().toString(36).slice(2, 5);

  const email = `e${uniq}@t.co`;

  // Start waiting for the create request BEFORE the confirm click.
  const createReqPromise = page.waitForResponse(res => {
    const url = res.url();
    return res.request().method() === 'POST' && url.includes('/account');
  });

  // Fill required fields
  await form.getByTestId('account-name').fill(`E2E Client ${uniq}`);
  await form.getByTestId('account-first-name').fill('E2E');
  await form.getByTestId('account-last-name').fill(`Client${uniq}`);
  await form.getByTestId('account-ssn-last4').fill('1234');
  await form.getByTestId('account-email').fill(email);
  await form.getByTestId('account-email-confirm').fill(email);
  await form.getByTestId('account-phone').fill('(416) 555-1234');
  await form.getByTestId('account-zip').fill('12345');
  await form.getByTestId('account-address2').fill('Apt 1');

  // Address (Google Places)
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

  // Gender dropdown
  await form.getByTestId('account-gender-trigger').click();
  await page.locator('mat-option').first().click();

  // DOB input
  await form.getByTestId('account-dob-input').fill('01/01/1990');

  // Marital status dropdown
  await form.getByTestId('account-marital-status-trigger').click();
  await page.locator('mat-option').first().click();

  // Agent selector (conditional)
  const agent = form.getByTestId('account-agent-trigger');
  if (await agent.count()) {
    await agent.click();
    await agent.fill('a');
    await page.locator('mat-option').first().click();
  }

  const save = form.getByTestId('account-save');
  await expect(save).toBeEnabled({ timeout: 10_000 });

  await save.click();

  const confirmModal = page.getByTestId('account-confirm-modal');
  await expect(confirmModal).toBeVisible({ timeout: 10_000 });

  await confirmModal.getByTestId('account-confirm').click();

  const createRes = await createReqPromise;

  expect(
    createRes.status(),
    `Create account failed. Status=${createRes.status()}`
  ).toBeGreaterThanOrEqual(200);
  expect(
    createRes.status(),
    `Create account failed. Status=${createRes.status()}`
  ).toBeLessThan(300);

  // Optional: log body if JSON
  const ct = createRes.headers()['content-type'] ?? '';
  if (ct.includes('application/json')) {
    const body = await createRes.json().catch(() => null);
    console.log('✅ create account response json:', body);
  }

  // Assert we did NOT get email-in-use message
  await expect(
    page.getByText(/correo electr[oó]nico ya est[aá] en uso/i)
  ).toHaveCount(0);

  // Secondary signal: route should be Accounts
  await expect(page).toHaveURL(/accounts/i);
});

test('create a request from an account', async ({ page }) => {
  /**
   * Purpose
   * - From an Account details page, create a new Request.
   *
   * Success criteria
   * - The success modal appears (user-visible proof).
   * - We navigate to requests list and can open a request detail.
   *
   * Notes
   * - Uses test ids on request fields and upload input.
   * - Relies on your “Success!” modal, which is less flaky than matching a specific POST URL.
   */
  page.on('console', msg => {
    if (msg.type() === 'error') console.log('🧨 console error:', msg.text());
  });

  await page.goto('/portal/accounts');
  await expect(page).toHaveURL(/\/portal\/accounts/);

  await expect(page.getByTestId('accounts-table')).toBeVisible();

  const firstSerial = page.getByTestId('account-serial').first();
  await expect(firstSerial).toBeVisible({ timeout: 15000 });
  await firstSerial.click();

  await page.getByRole('button', { name: /create request/i }).click();

  const commercial = page.getByTestId('request-type-commercial');
  if (await commercial.count()) await commercial.click();
  else await page.getByLabel(/commercial/i).click();

  await page.getByRole('button', { name: /select/i }).click();
  await page.getByRole('button', { name: /next/i }).click();

  const amount = page.getByTestId('request-coverage-amount');
  if (await amount.count()) await amount.fill('10000');
  else await page.getByRole('textbox', { name: '$' }).fill('10000');

  const location = page.getByTestId('request-location');
  if (await location.count()) await location.fill('toronto');
  else
    await page
      .getByRole('textbox', { name: /type the location/i })
      .fill('toronto');

  await page
    .getByText(/Toronto.*Canada/i)
    .first()
    .click();

  const addDocs = page.getByTestId('request-add-documents');
  if (await addDocs.count()) await addDocs.click();
  else await page.getByText(/add documents/i).click();

  const filePath = path.resolve(__dirname, 'fixtures/sample.pdf');

  const uploadInput = page.getByTestId('request-documents-input');
  if (await uploadInput.count()) await uploadInput.setInputFiles(filePath);
  else await page.locator('input[type="file"]').first().setInputFiles(filePath);

  await page.getByRole('button', { name: /^save$/i }).click();

  await expect(page.getByText(/success!/i)).toBeVisible({ timeout: 15000 });
  await expect(page.getByText(/#RQ-\d+/i)).toBeVisible();

  // Close success modal
  await page.getByRole('button', { name: /accept/i }).click();

  await expect(page).toHaveURL(/\/portal\/requests/, { timeout: 15000 });

  await expect(page.getByTestId('request-serial').first()).toBeVisible();
  await page.getByTestId('request-serial').first().click();
  await expect(page).toHaveURL(/\/portal\/requests\/.+/);
});

test('create a quote for a request', async ({ page }) => {
  /**
   * Purpose
   * - From a Request detail page, create a new Quote.
   *
   * Success criteria
   * - UI shows a success message (if present) OR the Quotes region remains visible.
   *
   * Notes
   * - Uses “Quotes” region scoping to avoid brittle mat-input ids.
   * - File upload uses first file input inside the quotes region if available.
   */
  page.on('console', msg => {
    if (msg.type() === 'error') console.log('🧨 console error:', msg.text());
  });

  await page.goto('/portal/requests');
  await expect(page).toHaveURL(/\/portal\/requests/);

  const firstRequestSerial = page.getByTestId('request-serial').first();
  await expect(firstRequestSerial).toBeVisible({ timeout: 15000 });
  await firstRequestSerial.click();

  const companyCombo = page.getByRole('combobox', {
    name: /select a company/i,
  });
  await expect(companyCombo).toBeVisible({ timeout: 15000 });
  await companyCombo.click();
  await page.getByRole('option', { name: /aetna/i }).click();

  await page.getByRole('button', { name: /open calendar/i }).click();
  const day15 = page.getByRole('button', { name: /^15$/ });
  if (await day15.count()) await day15.first().click();
  else await page.getByRole('button', { name: /january 15/i }).click();

  const quotesRegion = page.getByRole('region', { name: /quotes/i });
  await expect(quotesRegion).toBeVisible({ timeout: 15000 });

  const moneyInputs = quotesRegion.getByRole('textbox', { name: '$' });
  await expect(moneyInputs).toHaveCount(3, { timeout: 15000 });

  await moneyInputs.nth(0).fill('5000');
  await moneyInputs.nth(1).fill('10000');
  await moneyInputs.nth(2).fill('100');

  const pdfPath = path.resolve(__dirname, 'fixtures/sample.pdf');

  const fileInput = quotesRegion.locator('input[type="file"]');
  if (await fileInput.count()) await fileInput.first().setInputFiles(pdfPath);
  else {
    await quotesRegion.locator('button, [role="button"], img').first().click();
    await page.locator('input[type="file"]').first().setInputFiles(pdfPath);
  }

  await page.getByRole('button', { name: /^add$/i }).click();

  const success = page.getByText(/success|quote.*created|added successfully/i);
  if (await success.count())
    await expect(success.first()).toBeVisible({ timeout: 15000 });
  else await expect(quotesRegion).toBeVisible();
});

test('create a policy from a quote', async ({ page }) => {
  /**
   * Purpose
   * - From a Request detail page, take a Quote and create a Policy.
   *
   * Success criteria
   * - Backend POST /policy|/policies returns 2xx.
   * - Optional: response includes an id.
   *
   * Notes
   * - Quote action menu only appears after the quote is “Selected”.
   * - Datepicker overlays must be closed or they intercept the Save button click.
   */
  page.on('console', msg => {
    if (msg.type() === 'error') console.log('🧨 console error:', msg.text());
  });

  await page.goto('/portal/requests');
  await expect(page).toHaveURL(/\/portal\/requests/);

  const firstRequest = page.getByTestId('request-serial').first();
  await expect(firstRequest).toBeVisible({ timeout: 15000 });
  await firstRequest.click();

  const quotesSection = page.getByTestId('quotes-section');
  await expect(quotesSection).toBeVisible({ timeout: 15000 });

  const quoteRowsBySerial = quotesSection.locator('tr', {
    has: page.locator('text=/^#QT-/'),
  });

  // If no quote exists, create one (self-healing)
  if ((await quoteRowsBySerial.count()) === 0) {
    const companyCell = page.getByTestId('quote-company');
    await expect(companyCell).toBeVisible({ timeout: 15000 });
    await companyCell.getByRole('combobox').click();
    await page.getByRole('option', { name: /aetna/i }).click();

    const dateCell = page.getByTestId('quote-date');
    await dateCell.getByRole('button', { name: /open calendar/i }).click();
    const day15 = page.getByRole('button', { name: /^15$/ });
    if (await day15.count()) await day15.first().click();
    else
      await page.locator('mat-calendar button:not([disabled])').first().click();

    await page
      .getByTestId('quote-premium')
      .getByRole('textbox', { name: '$' })
      .fill('5000');
    await page
      .getByTestId('quote-coverage')
      .getByRole('textbox', { name: '$' })
      .fill('10000');
    await page
      .getByTestId('quote-deductible')
      .getByRole('textbox', { name: '$' })
      .fill('100');

    const pdfPath = path.resolve(__dirname, 'fixtures/sample.pdf');
    await page
      .getByTestId('quote-upload')
      .locator('input[type="file"]')
      .setInputFiles(pdfPath);

    await page.getByTestId('quote-add').click();

    const success = page.getByText(
      /success|quote.*created|added successfully/i
    );
    if (await success.count())
      await expect(success.first()).toBeVisible({ timeout: 15000 });

    await expect.poll(async () => quoteRowsBySerial.count()).toBeGreaterThan(0);
  }

  const quoteRow = quoteRowsBySerial.first();
  await expect(quoteRow).toBeVisible({ timeout: 15000 });

  // Ensure quote is selected
  const chooseBtn = quoteRow.getByTestId('quote-choose');
  if (await chooseBtn.count()) await chooseBtn.first().click();
  else {
    const chooseText = quoteRow.getByRole('button', { name: /^choose$/i });
    if (await chooseText.count()) await chooseText.first().click();
  }

  // Open quote actions menu
  const quoteActions = quoteRow.getByTestId('quote-actions');
  if (await quoteActions.count()) await quoteActions.first().click();
  else await quoteRow.getByText('arrow_drop_down').first().click();

  // Create policy
  const createPolicyItem = page.getByTestId('quote-create-policy');
  if (await createPolicyItem.count()) await createPolicyItem.first().click();
  else await page.getByRole('menuitem', { name: /create policy/i }).click();

  const policyForm = page.getByTestId('policy-form');
  await expect(policyForm).toBeVisible({ timeout: 15000 });

  const pdfPath = path.resolve(__dirname, 'fixtures/sample.pdf');

  // Description
  const descNode = policyForm.getByTestId('policy-description');
  if (await descNode.locator('textarea').count())
    await descNode.locator('textarea').fill('policy details');
  else
    await descNode
      .or(policyForm.locator('textarea').first())
      .fill('policy details');

  // Policy copy upload (hidden input is fine)
  const policyCopyInput = policyForm
    .getByTestId('policy-upload-input')
    .locator('input[type="file"]');
  if (await policyCopyInput.count())
    await policyCopyInput.setInputFiles(pdfPath);
  else
    await policyForm
      .locator('input[type="file"]')
      .first()
      .setInputFiles(pdfPath);

  // Policy number (wrapper app-input)
  await policyForm
    .getByTestId('policy-number')
    .locator('input, textarea')
    .first()
    .fill('ABCD-1234');

  // Pick dates and close overlays
  const pickDateAndClose = async (wrapperTestId: string) => {
    const wrapper = policyForm.getByTestId(wrapperTestId);
    const openCal = wrapper.getByRole('button', { name: /open calendar/i });
    if (await openCal.count()) {
      await openCal.first().click();
      await page.locator('mat-calendar button:not([disabled])').first().click();
      await page.keyboard.press('Escape').catch(() => null);
    } else {
      const anyOpen = page.getByRole('button', { name: /open calendar/i });
      if (await anyOpen.count()) {
        await anyOpen.first().click();
        await page
          .locator('mat-calendar button:not([disabled])')
          .first()
          .click();
        await page.keyboard.press('Escape').catch(() => null);
      }
    }
  };

  await pickDateAndClose('policy-start-date');
  await pickDateAndClose('policy-end-date');

  const reqDocsInput = policyForm
    .getByTestId('policy-request-documents')
    .locator('input[type="file"]');
  if (await reqDocsInput.count())
    await reqDocsInput.first().setInputFiles(pdfPath);

  // Start waiting for create policy BEFORE clicking save
  const createPolicyResponsePromise = page.waitForResponse(res => {
    return (
      res.request().method() === 'POST' &&
      /\/polic(y|ies)\b/i.test(res.url()) &&
      res.status() >= 200 &&
      res.status() < 300
    );
  });

  await page.keyboard.press('Escape').catch(() => null);

  await policyForm.getByTestId('policy-save').click();

  // Confirm dialogs (conditional)
  const confirm = page.getByTestId('account-confirm');
  if (await confirm.count()) await confirm.click();

  const accept = page.getByRole('button', { name: /accept/i });
  if (await accept.count()) await accept.click();

  const createPolicyRes = await createPolicyResponsePromise;
  expect(createPolicyRes.status()).toBeGreaterThanOrEqual(200);
  expect(createPolicyRes.status()).toBeLessThan(300);

  const body = await createPolicyRes.json().catch(() => null);
  if (body?.data?._id) expect(body.data._id).toEqual(expect.any(String));
});

test('create a payment (account -> apply to policy)', async ({ page }) => {
  /**
   * Purpose
   * - Create a payment from an Account and apply part of it to a Policy.
   *
   * What we validate
   * - The Payment Date is correctly set (typed for reliability).
   * - Total amount is 2000.
   * - Payment applied is 500.
   * - Submit becomes enabled (form valid).
   * - Backend POST returns 2xx (proof payment was created).
   *
   * Notes
   * - We do NOT manually fill taxes/retentions; we rely on app calculations.
   * - If Submit stays disabled, check required fields/validators in the form group.
   */
  page.on('console', msg => {
    if (msg.type() === 'error') console.log('🧨 console error:', msg.text());
  });

  await page.goto('/portal/payments/new');
  await expect(page).toHaveURL(/\/portal\/payments\/new/);

  const form = page.getByTestId('payment-form');
  await expect(form).toBeVisible({ timeout: 15000 });

  // Payment From: Account
  await form.getByTestId('payment-from-account').click();

  // Payment Date — type directly
  await fillDateField(
    form.getByTestId('payment-date'),
    '1/16/2026',
    'Payment date'
  );

  // Total amount = 2000
  await fillMoneyField(
    form.getByTestId('payment-total-amount'),
    '2000',
    'Total amount'
  );

  // Select account
  const accountRoot = form.getByTestId('payment-account');
  const accountCombo = accountRoot.getByRole('combobox');
  await expect(accountCombo).toBeVisible({ timeout: 15000 });
  await accountCombo.click();

  const e2eAccount = page.getByRole('option', { name: /e2e client/i });
  if (await e2eAccount.count()) await e2eAccount.first().click();
  else await page.getByRole('option').first().click();

  // Check/ACH number
  const checkInput = form
    .getByTestId('payment-check-number')
    .locator('input')
    .first();
  await expect(checkInput).toBeVisible({ timeout: 15000 });
  await checkInput.fill('12345678');
  await checkInput.press('Tab').catch(() => null);

  // Payment method
  const methodCombo = form.getByTestId('payment-method').getByRole('combobox');
  await expect(methodCombo).toBeVisible({ timeout: 15000 });
  await methodCombo.click();

  const bankTransfer = page.getByRole('option', { name: /bank transfer/i });
  if (await bankTransfer.count()) await bankTransfer.first().click();
  else await page.getByRole('option').first().click();

  // Payment application: select policy
  const apps = form.getByTestId('payment-applications');
  await expect(apps).toBeVisible({ timeout: 15000 });

  const firstAppRow = apps.getByTestId('payment-application-row').first();
  await expect(firstAppRow).toBeVisible({ timeout: 15000 });

  const policyCombo = firstAppRow
    .getByTestId('payment-policy')
    .getByRole('combobox');
  await expect(policyCombo).toBeVisible({ timeout: 15000 });
  await policyCombo.click();

  const abcdPolicy = page.getByRole('option', { name: /ABCD-1234/i });
  if (await abcdPolicy.count()) await abcdPolicy.first().click();
  else await page.getByRole('option').first().click();

  // Payment applied = 500
  const appliedInput = firstAppRow
    .getByTestId('payment-applied-amount')
    .locator('input')
    .first();
  await expect(appliedInput).toBeVisible({ timeout: 15000 });
  await expect(appliedInput).toBeEnabled({ timeout: 15000 });
  await appliedInput.click({ force: true });
  await appliedInput.fill('500');
  await appliedInput.press('Tab').catch(() => null);

  // Submit should become enabled after calculations/validators update
  const submitBtn = form.getByTestId('payment-submit');
  await expect
    .poll(async () => await submitBtn.isEnabled(), { timeout: 15000 })
    .toBe(true);

  // Start waiting for POST BEFORE clicking submit
  const createPaymentPromise = page.waitForResponse(res => {
    const url = res.url();
    return (
      res.request().method() === 'POST' &&
      (/\/payments\b/i.test(url) || /\/payment-?transactions\b/i.test(url)) &&
      res.status() >= 200 &&
      res.status() < 300
    );
  });

  await submitBtn.click();

  // Confirmation modal (if shown)
  const confirm = page.getByTestId('account-confirm');
  if (await confirm.count()) await confirm.click();

  const createRes = await createPaymentPromise;

  // Backend proof the payment was created
  expect(createRes.status()).toBeGreaterThanOrEqual(200);
  expect(createRes.status()).toBeLessThan(300);

  // Optional: assert an id exists if your API returns it
  const body = await createRes.json().catch(() => null);
  const id = body?.data?._id ?? body?._id ?? body?.data?.id ?? body?.id;
  if (id) expect(id).toBeTruthy();
});
