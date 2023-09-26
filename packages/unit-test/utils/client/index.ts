
import { test as base, expect } from '@playwright/test';
import { clientURL } from '../url';
import { BrowsePage } from './browse'


export const client = base.extend<{} & { browsePage: BrowsePage }>({
    page: async ({ page }, use, scope) => {
        
        await page.goto(clientURL + '/');
        await page.getByLabel('username').fill(process.env.CLIENT_USER || 'seantsang');
        await page.getByLabel('password').fill(process.env.CLIENT_PASSWORD ||'aaAA1234');
        await page.getByRole('button', {name: 'Submit'}).press('Enter');
        await expect(page).toHaveURL(/.*browse/);

        await page.locator('.languageSwitchContainer').click();
        await page.getByRole('menuitem', { name: 'ENG' }).click(); 
        // Use signed-in page in the test.
        await use(page);
    },
    browsePage: async ({ page }, use, scope) => {
        const browsePage = new BrowsePage(page);
        await browsePage.goToFirstLevel();
        await use(browsePage);
        // await browsePage.removeAll();
    }
})
client.use({
    baseURL: process.env.BASEURL || 'https://app4.wclsolution.com',
})

export { expect } from '@playwright/test';
        