
import { test as base, expect } from '@playwright/test';
import { clientURL } from '../url';
import { BrowsePage } from './browse'
import {login} from "../pre-test/login";
import {changeLanguage} from "../pre-test/changeLanguage";


export const client = base.extend<{} & { browsePage: BrowsePage }>({
    page: async ({ page }, use, scope) => {
        
        await page.goto(clientURL + '/');
        await login(page, process.env.CLIENT_USER || 'Administrator', process.env.CLIENT_PASSWORD ||"2'KMzF}zK2ZmwQe");

        await expect(page).toHaveURL(/.*browse/);

        await changeLanguage(page, 'ENG'); 
        // Use signed-in page in the test.
        await use(page);
    },
    browsePage: async ({ page }, use, scope) => {
        const browsePage = new BrowsePage(page);
        await use(browsePage);
        await browsePage.removeAll();
    }
})

export { expect } from '@playwright/test';
        