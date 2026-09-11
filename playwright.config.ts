import { defineConfig, devices } from '@playwright/test';
import { targets } from './src/config/targets.js';
import { networkProxy } from './src/config/network.js';

const inCI = process.env.CI === 'true';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: inCI,
  failOnFlakyTests: inCI,
  retries: inCI ? 1 : 0,
  // Keep traffic to shared public services modest.
  workers: 2,
  timeout: 30_000,
  expect: { timeout: 5_000 },
  outputDir: 'test-results/artifacts',
  reporter: [
    [inCI ? 'github' : 'list'],
    ['html', { open: 'never', outputFolder: 'playwright-report' }],
    ['junit', { outputFile: 'test-results/junit.xml' }],
  ],
  use: {
    ...(networkProxy ? { proxy: networkProxy } : {}),
    baseURL: targets.ui,
    actionTimeout: 10_000,
    navigationTimeout: 20_000,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'off',
    locale: 'en-US',
    timezoneId: 'UTC',
  },
  projects: [
    { name: 'api', testDir: './tests/api', use: { trace: 'off' } },
    { name: 'chromium', testDir: './tests/ui', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', testDir: './tests/ui', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', testDir: './tests/ui', use: { ...devices['Desktop Safari'] } },
  ],
});
