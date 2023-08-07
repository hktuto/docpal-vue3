import { test as setup, expect } from '@playwright/test';
import { STORAGE_STATE } from './playwright.config';

setup('do login', async ({page}) => {
    await page.goto('/');
    await page.getByLabel('username').click();
    await page.getByLabel('username').fill('seantsang');
    await page.getByLabel('password').fill('aaAA1234');
    await page.getByRole('button', {name: 'Submit'}).press('Enter');
    await expect(page).toHaveURL(/.*browse/);

    await page.locator('.languageSwitchContainer').click();
    await page.getByRole('menuitem', { name: 'ENG' }).click();
    await page.context().storageState({ path: STORAGE_STATE });
})