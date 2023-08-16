
import { test as base, expect } from '@playwright/test';
base.use({
    baseURL: process.env.ADMIN_BASEURL || 'https://admin.app4.wclsolution.com',
})
export const admin = base.extend({
    page: async ({ page }, use, scope) => {
        await page.goto('/');
        await page.getByLabel('username').fill(process.env.CLIENT_USER || 'seantsang');
        await page.getByLabel('password').fill(process.env.CLIENT_PASSWORD ||'aaAA1234');
        await page.getByRole('button', {name: 'Submit'}).press('Enter');
        // await expect(page).toHaveURL(/.*acl/);

        await page.locator('.languageSwitchContainer').click();
        await page.getByRole('menuitem', { name: 'ENG' }).click(); 
        // Use signed-in page in the test.
        await use(page);
    },
})
exports.expect = expect;
        