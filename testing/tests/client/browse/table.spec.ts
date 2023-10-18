import { test } from '@playwright/test';
import { client, expect } from '../../../utils/client';

test.describe('Browse List', () => {


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
        await browsePage.checkTextExist('The system detected a duplicate file name, please select Rename or Replace for t');
    });

    client('filter table by file name', async({browsePage}) => {
        browsePage.goToFirstLevel();
        // create two folder
        const f1 = 'testFolder_' + Date.now();
        const f2 = 'testFolder2_' + Date.now();
        await browsePage.addFolder(f1);
        
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
        
        await browsePage.waitForLoading()
        

        await expect(browsePage.page.locator('.breadContainer').filter({ hasText: name })).toHaveCount(1);
        // wait for url include name

        await browsePage.page.locator('#editActionButton span').click();
        await browsePage.page.getByLabel('name', { exact: true }).fill(newName);
        await browsePage.page.getByRole('button', { name: 'Save' }).click();
        await browsePage.page.waitForTimeout(2000);
        browsePage.updateNameInItemToDelete(name, newName);
        await browsePage.goRoot();
        await browsePage.page.waitForTimeout(1000);
        await browsePage.goToFirstLevel();
        
        await browsePage.page.getByPlaceholder('Name').fill(newName);
        const count = await browsePage.page.locator('.nameContainer > .label').filter({ hasText: newName }).count();
        expect(count).toBe(1);
    });

    client('edit folder name from right click', async({browsePage}) => {
        await browsePage.goToFirstLevel();
        const name = 'testFolder_' + Date.now();
        const newName = 'testFolder_newname_' + Date.now();
        await browsePage.addFolder(name);
        
        await browsePage.waitForLoading()

        await browsePage.page.getByPlaceholder('Name').fill(name);
        await browsePage.page.getByRole('cell', { name }).click({
            button: 'right'
          });
        await browsePage.page.getByRole('menuitem', { name: 'Rename' }).click();

        await browsePage.page.getByLabel('name', { exact: true }).fill(newName);
        await browsePage.page.getByRole('button', { name: 'Save' }).click();
        await browsePage.page.waitForTimeout(2000);
        await browsePage.waitForLoading()

        await browsePage.page.getByPlaceholder('Name').fill(newName);
        const count = await browsePage.page.locator('.nameContainer > .label').filter({ hasText: newName }).count();
        expect(count).toBe(1);
        browsePage.updateNameInItemToDelete(name, newName);

    });

    client('delete folder from top action bar', async({browsePage}) => {
        // create folder
        await browsePage.goToFirstLevel();
        const name = 'testFolder_' + Date.now();
        await browsePage.addFolder(name, false);
        // delete folder
        await browsePage.page.getByPlaceholder('Name').fill(name);
        const item = await browsePage.page.locator('.nameContainer > .dropzone').first();
        item.dblclick();
        await browsePage.waitForLoading();

        await browsePage.page.locator('#deleteActionButton').getByRole('img').click();
        await browsePage.page.getByRole('button', { name: 'OK' }).click();

        await browsePage.goRoot();
        await browsePage.goToFirstLevel();
        
        await browsePage.waitForLoading();
        await browsePage.page.getByPlaceholder('Name').fill(name);
        const count = await browsePage.page.locator('.nameContainer > .label').filter({ hasText: name }).count();
        expect(count).toBe(0);
    });

    

    client('upload file', async({browsePage}) => {
        await browsePage.goToFirstLevel();
        const name = 'testFolder_' + Date.now();
        await browsePage.addFolder(name);
        await browsePage.page.getByPlaceholder('Name').fill(name);

        const item = await browsePage.page.locator('.nameContainer > .dropzone').first();
        item.dblclick();

        await browsePage.waitForLoading();

        await browsePage.page.locator('#newActionButton').click();
        const [fileChooser] = await Promise.all([
            // It is important to call waitForEvent before click to set up waiting.
            browsePage.page.waitForEvent('filechooser'),
            // Opens the file chooser.
            browsePage.page.getByRole('menuitem', { name: 'File Upload' }).click(),
          ])

          await fileChooser.setFiles([
            'uploads/testUpload.txt',
          ])
          await expect(browsePage.page).toHaveURL(/.*upload/);
          await browsePage.page.getByRole('treeitem').locator('div').filter({ hasText: 'testUpload' }).first().click();
        await browsePage.page.getByRole('button', { name: 'Confirm' }).click();
        

        await browsePage.page.getByPlaceholder('Name').fill('testUpload');

        await expect(browsePage.page.locator('.nameContainer > .label').filter({ hasText: 'testUpload' })).toHaveCount(1);

    });



});