import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  globalSetup: './e2e/global-setup.ts',

  use: {
    baseURL: process.env['E2E_BASE_URL'] ?? 'http://localhost:4200',
    storageState: 'e2e/.auth/state.json',
    trace: 'on', // record trace for every test
    screenshot: 'on', // take screenshots for every test
    video: 'on', // record video for every test
  },

  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
});
