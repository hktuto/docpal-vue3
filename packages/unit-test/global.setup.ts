import { test as setup, expect } from '@playwright/test';
import { STORAGE_STATE } from './playwright.config';

setup('do login', async ({page}) => {
    await page.goto('/');
    await page.getByLabel('username').click();
    await page.getByLabel('username').fill(process.env.USERNAME || 'seantsang');
    await page.getByLabel('username').press('Tab');
    await page.getByLabel('password').fill(process.env.PASSWORD ||'aaAA1234');
    await page.getByLabel('password').press('Tab');
    await page.getByRole('button', {name: 'Submit'}).press('Enter');
    await expect(page).toHaveURL(/.*browse/);

    await page.context().storageState({ path: STORAGE_STATE });
})