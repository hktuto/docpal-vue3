import { test } from '@playwright/test';
import { client, expect } from '../../../utils/client';

test.describe('Browse List', () => {
    client('table visibility', async({browsePage}) => {
        const tableTab = await browsePage.page.locator('#tab-table');
        await tableTab.isVisible(); // check if table is visible
        tableTab.click(); // click tableTab
        expect(await tableTab.getAttribute('aria-selected')).toBe('true'); // check tableTab is active
        // check if table is visible
        const table = await browsePage.page.locator('#browseTable');
        await table.isVisible();
    });

    client('table content', async({browsePage}) => {
        // get all table rows
        const allName = await browsePage.page.locator('.nameContainer > .dropzone');
        // get name inside allName
        console.log(allName);

    });

});