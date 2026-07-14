import { defineConfig, devices } from 'playwright/test';
import dotenv from 'dotenv';

// Load environment variables from .env (falls back to sensible defaults below).
dotenv.config();

const UI_BASE_URL = process.env.UI_BASE_URL ?? 'https://www.saucedemo.com';
const API_BASE_URL =
  process.env.API_BASE_URL ?? 'https://restful-booker.herokuapp.com';

const isCI = !!process.env.CI;

/**
 * See https://playwright.dev/docs/test-configuration.
 *
 * Two logical suites live side-by-side:
 *   - UI  (tests/ui)  runs against SauceDemo across Chromium, Firefox and WebKit.
 *   - API (tests/api) runs against Restful-Booker on a single lightweight project
 *     (no browser needed — pure request context).
 */
export default defineConfig({
  testDir: './tests',
  // Fail the build on CI if test.only was accidentally left in the source.
  forbidOnly: isCI,
  // Retry flaky tests on CI; never locally so failures surface immediately.
  retries: isCI ? 2 : 0,
  // Opt out of parallelism inside a single file by default; parallelize files.
  fullyParallel: true,
  workers: isCI ? 1 : undefined,
  timeout: 30_000,
  expect: {
    timeout: 7_000,
  },
  reporter: [
    ['list'],
    ['html', { open: 'never', outputFolder: 'playwright-report' }],
    ['json', { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/junit.xml' }],
  ],
  use: {
    actionTimeout: 10_000,
    navigationTimeout: 15_000,
    trace: 'on-first-retry',
    screenshot: 'on',
    video: 'on',
    headless: false,
  },

  projects: [
    // ---------- API suite ----------
    {
      name: 'api',
      testDir: './tests/api',
      use: {
        baseURL: API_BASE_URL,
        extraHTTPHeaders: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      },
    },

    // ---------- UI suite: cross-browser ----------
    {
      name: 'chromium',
      testDir: './tests/ui',
      use: { ...devices['Desktop Chrome'], baseURL: UI_BASE_URL },
    },
    {
      name: 'firefox',
      testDir: './tests/ui',
      use: { ...devices['Desktop Firefox'], baseURL: UI_BASE_URL },
    },
    {
      name: 'webkit',
      testDir: './tests/ui',
      use: { ...devices['Desktop Safari'], baseURL: UI_BASE_URL },
    },

    // ---------- UI suite: mobile emulation (smoke only) ----------
    {
      name: 'mobile-chrome',
      testDir: './tests/ui',
      grep: /@smoke/,
      use: { ...devices['Pixel 7'], baseURL: UI_BASE_URL },
    },
  ],
});