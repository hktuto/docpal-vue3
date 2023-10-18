import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import * as path from "path";
dotenv.config();
export const STORAGE_STATE = path.join(__dirname, 'storage/test.json');

const isCi = Boolean(process.env.CI);
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
  fullyParallel: false,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: true,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: 1,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ['html', { open: 'never' }],
    ['playwright-teamcity-reporter', {'testMetadataArtifacts': 'test-results', logConfig: false}],
  ],// 30 sec
  expect: {
    timeout: 120000,   // <---------
  },

  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      testMatch: '**/**/*.spec.ts',
      use: { 
        ...devices['Desktop Chrome'],
        // Capture screenshot after each test failure.
        screenshot: 'only-on-failure',

        // Record trace only when retrying a test for the first time.
        trace: 'on-first-retry',

        // Record video only when retrying a test for the first time.
        video: 'on-first-retry',
        headless: false,
      },
    },


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
