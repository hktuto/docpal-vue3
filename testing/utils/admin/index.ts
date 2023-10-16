
import { test as base } from '@playwright/test';
import { adminURL } from '../url';

export const admin = base.extend({
    page: async ({ page }, use, scope) => {
        await page.goto(adminURL + '/');
        await page.getByLabel('username').fill(process.env.CLIENT_USER || 'seantsang');
        await page.getByLabel('password').fill(process.env.CLIENT_PASSWORD ||'aaAA1234');
        await page.getByRole('button', {name: 'Sign In'}).press('Enter');
        // await expect(page).toHaveURL(/.*acl/);

        await page.locator('#languageSwitchContainerIcon').click();
        // check ENG button is disabled or not
        const isClickable = await page.getByRole('menuitem', { name: 'ENG' }).getAttribute('aria-disabled');
        if(!isClickable || isClickable === 'false') {
            await page.getByRole('menuitem', {name: 'ENG'}).click();
        }
        // Use signed-in page in the test.
        await use(page);
    },
})



export { expect } from '@playwright/test';
        