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

    client('create folder', async({browsePage}) => {
        browsePage.goToFirstLevel();
        const name = 'testFolder_' + Date.now();
        await browsePage.addFolder(name);
    })

    client('create folder with same name', async({browsePage}) => {
        browsePage.goToFirstLevel();
        const name = 'testFolder_' + Date.now();
        await browsePage.addFolder(name);
        await browsePage.addFolder(name);
        await expect(browsePage.page.getByText('The system detected a duplicate file name, please select Rename or Replace for t')).toHaveCount(1);
    });

    client('filter table by file name', async({browsePage}) => {
        browsePage.goToFirstLevel();
        // create two folder
        const f1 = 'testFolder_' + Date.now();
        const f2 = 'testFolder2_' + Date.now();
        await browsePage.addFolder(f1);
        await browsePage.addFolder(f2);
        await browsePage.page.getByPlaceholder('Name').fill(f1);
        // f2 should not be in the table
        const count = await browsePage.page.locator('.nameContainer > .label').filter({ hasText: f2 }).count();
        expect(count).toBe(0);
        // f1 should be in the table
        const count2 = await browsePage.page.locator('.nameContainer > .label').filter({ hasText: f1 }).count();
        expect(count2).toBe(1);
    });

    client('edit folder name on top action', async({browsePage}) => {
        await browsePage.goToFirstLevel();
        const name = 'testFolder_' + Date.now();
        await browsePage.addFolder(name);
        const newName = 'testFolder_newname_' + Date.now();
        await browsePage.page.getByPlaceholder('Name').fill(name);
        const item = await browsePage.page.locator('.nameContainer > .dropzone').first();
        item.dblclick();
        // wait for 2 seconds
        await browsePage.page.waitForTimeout(2000);

        await expect(browsePage.page.locator('.breadContainer').filter({ hasText: name })).toHaveCount(1);
        // wait for url include name

        await browsePage.page.locator('#editActionButton span').click();
        await browsePage.page.getByLabel('name', { exact: true }).fill(newName);
        await browsePage.page.getByRole('button', { name: 'Save' }).click();
        browsePage.updateNameInItemToDelete(name, newName);
        await browsePage.goRoot();
        await browsePage.goToFirstLevel();
        await browsePage.page.waitForTimeout(2000);
        await browsePage.page.getByPlaceholder('Name').fill(newName);
        const count = await browsePage.page.locator('.nameContainer > .label').filter({ hasText: newName }).count();
        expect(count).toBe(1);
    });

    client('edit folder name from right click', async({browsePage}) => {
        await browsePage.goToFirstLevel();
        const name = 'testFolder_' + Date.now();
        const newName = 'testFolder_newname_' + Date.now();
        await browsePage.addFolder(name);
        await browsePage.page.waitForTimeout(2000);
        await browsePage.page.getByPlaceholder('Name').fill(name);
        await browsePage.page.getByRole('cell', { name }).click({
            button: 'right'
          });
        await browsePage.page.getByRole('menuitem', { name: 'Rename' }).click();

        await browsePage.page.getByLabel('name', { exact: true }).fill(newName);
        await browsePage.page.getByRole('button', { name: 'Save' }).click();
        
        await browsePage.page.waitForTimeout(2000);
        await browsePage.page.getByPlaceholder('Name').fill(newName);
        const count = await browsePage.page.locator('.nameContainer > .label').filter({ hasText: newName }).count();
        expect(count).toBe(1);
        browsePage.updateNameInItemToDelete(name, newName);

    });

    client('delete folder from top action bar', async({browsePage}) => {
        // create folder
        await browsePage.goToFirstLevel();
        const name = 'testFolder_' + Date.now();
        await browsePage.addFolder(name);
        // delete folder
        await browsePage.page.getByPlaceholder('Name').fill(name);
        const item = await browsePage.page.locator('.nameContainer > .dropzone').first();
        item.dblclick();
        await browsePage.page.waitForTimeout(2000);
        await expect(browsePage.page.locator('.breadContainer').filter({ hasText: name })).toHaveCount(1);
        await browsePage.page.locator('#deleteActionButton').getByRole('img').click();
        await browsePage.page.getByRole('button', { name: 'OK' }).click();

        await browsePage.goRoot();
        await browsePage.goToFirstLevel();
        
        await browsePage.page.waitForTimeout(2000);
        await browsePage.page.getByPlaceholder('Name').fill(name);
        const count = await browsePage.page.locator('.nameContainer > .label').filter({ hasText: name }).count();
        expect(count).toBe(0);
    });



});