import { defineConfig, devices } from '@playwright/test';
import * as path from "path";


export const STORAGE_STATE = path.join(__dirname, 'storage/test.json');
console.log("STORAGE_STATE", STORAGE_STATE);
/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// require('dotenv').config();

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    // baseURL: 'http://127.0.0.1:3000',
    baseURL: process.env.BASEURL || 'https://app4.wclsolutuion.com',
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name:"setup",
      testMatch: /global.setup\.ts/,
    },
    {
      name: 'chromium',
      dependencies: ['setup'],
      testMatch: '**/**/*.spec.ts',
      use: { 
        ...devices['Desktop Chrome'],
        storageState: STORAGE_STATE,
      },
    },

    // {
    //   name: 'firefox',
    //   dependencies: ['setup'],
    //   testMatch: '**/**/*.spec.ts',
    //   use: { ...devices['Desktop Firefox'], storageState: STORAGE_STATE, },
    // },
    //
    // {
    //   name: 'webkit',
    //   dependencies: ['setup'],
    //   testMatch: '**/**/*.spec.ts',
    //   use: { ...devices['Desktop Safari'], storageState: STORAGE_STATE, },
    // },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://127.0.0.1:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});