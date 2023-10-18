
import { test } from '@playwright/test';
import { client, expect } from '../../../utils/client';

test.describe('Browse Actions', () => {


    client('copy url', async({browsePage}) => {
        browsePage.goToFirstLevel();
        await browsePage.page.locator('#copyPathActionButton').getByRole('img').click();
        await browsePage.checkTextExist('Path copied to clipboard');
    })

    client('subscribe', async({browsePage}) => {
        browsePage.goToFirstLevel();
        const name = 'testFolder_' + Date.now();
        await browsePage.addFolder(name);
        await browsePage.page.getByPlaceholder('Name').fill(name);

        const item = await browsePage.page.locator('.nameContainer > .dropzone').first();
        item.dblclick();
        
        await browsePage.waitForLoading();

        // click subscribe
        await browsePage.page.locator('#subscribeActionButton span').click();

        // click unsubscribe
        await browsePage.page.locator('#subscribeActionButton span').click();
    })
})