
import { test as base, expect } from '@playwright/test';
import { adminURL } from '../url';
import { login } from '../pre-test/login';
import { changeLanguage } from '../pre-test/changeLanguage';

export const admin = base.extend({
    page: async ({ page }, use, scope) => {
        await page.goto(adminURL + '/');
        await login(page, process.env.CLIENT_USER || 'Administrator', process.env.CLIENT_PASSWORD ||"2'KMzF}zK2ZmwQe");

        await expect(page).toHaveURL(/.*acl/);                                                  

        await changeLanguage(page, 'ENG'); 
        // Use signed-in page in the test.
        await use(page);
    },
})



export { expect } from '@playwright/test';
        