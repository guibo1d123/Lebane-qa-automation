const { defineConfig, devices } = require('@playwright/test');
require('dotenv').config();

module.exports = defineConfig({
  testDir: './tests',
  timeout: 90000,
  expect: { timeout: 15000 },
  fullyParallel: false,
  workers: 1,
  reporter: [['html', { open: 'never' }], ['list']],

  use: {
    ...devices['Desktop Chrome'],
    baseURL: process.env.BASE_URL || 'https://tst.lebane.app',
    viewport: { width: 1600, height: 900 },
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
  },
});