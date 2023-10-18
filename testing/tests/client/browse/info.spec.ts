import { test } from '@playwright/test';
import { client, expect } from '../../../utils/client';


test.describe('Browse info', () => {


    client('update meta', async({browsePage}) => {
        await browsePage.goToFirstLevel();
        const name = 'testFolder_' + Date.now();
        await browsePage.addFolder(name);

        await browsePage.page.getByPlaceholder('Name').fill(name);
        const item = await browsePage.page.locator('.nameContainer > .dropzone').first();
        item.dblclick();

        await browsePage.waitForLoading();

        // open info panel
        await browsePage.openInfoPanel();

        const descriptionField = await browsePage.page.locator('[id="meta_dc\\:description"]');
        await descriptionField.fill('abc');
        await descriptionField.press('Enter');
        await browsePage.checkTextExist("Successfully modified");
        await browsePage.waitForLoading();

        await expect(browsePage.page.locator('[id="meta_dc\\:description"]')).toHaveValue('abc');

        
    });

    client('update tag', async({browsePage}) => {
        await browsePage.goToFirstLevel();
        const name = 'testFolder_' + Date.now();
        await browsePage.addFolder(name);

        await browsePage.page.getByPlaceholder('Name').fill(name);
        const item = await browsePage.page.locator('.nameContainer > .dropzone').first();
        item.dblclick();

        await browsePage.waitForLoading();

        // open info panel
        await browsePage.openInfoPanel();

        await browsePage.page.locator('.tags-input-wrapper-default').click();
        await browsePage.page.getByPlaceholder('Please enter content').fill('aaa');
        await browsePage.page.getByPlaceholder('Please enter content').press('Enter');
        await browsePage.checkTextExist("Successfully modified");
        await browsePage.waitForLoading();
        expect(browsePage.page.getByLabel('Info').getByText('aaa')).toHaveCount(1);

        // get tag
        await browsePage.page.getByRole('link').click();
        await browsePage.checkTextExist("Successfully modified");
        await browsePage.waitForLoading();
        expect(browsePage.page.getByLabel('Info').getByText('aaa')).toHaveCount(0);


    });

    client('update category', async({browsePage}) => {

        await browsePage.goToFirstLevel();
        const name = 'testFolder_' + Date.now();
        await browsePage.addFolder(name);

        await browsePage.page.getByPlaceholder('Name').fill(name);
        const item = await browsePage.page.locator('.nameContainer > .dropzone').first();
        item.dblclick();

        await browsePage.waitForLoading();

        // open info panel
        await browsePage.openInfoPanel();

        await browsePage.page.getByLabel('Info').locator('path').click();
        await browsePage.page.getByPlaceholder('Please choose').click();
        await browsePage.page.getByPlaceholder('Please choose').fill('test123');
        await browsePage.page.getByPlaceholder('Please choose').press('Enter');
        await expect(browsePage.page.getByText('test123', { exact: true })).toHaveCount(1);

    });

    client('document comment', async({browsePage}) => {
        await browsePage.goToFirstLevel();
        const name = 'testFolder_' + Date.now();
        await browsePage.addFolder(name);

        await browsePage.page.getByPlaceholder('Name').fill(name);
        const item = await browsePage.page.locator('.nameContainer > .dropzone').first();
        item.dblclick();

        await browsePage.waitForLoading();

        // open info panel
        await browsePage.openInfoPanel();

        await browsePage.page.getByRole('tab', { name: 'Comments' }).click();

        await browsePage.waitForLoading();

        const root = browsePage.page.locator('#commentRootInput .el-textarea__inner').first();
        root.fill('test comment');
        
        await browsePage.page.locator('#commentRootInput').getByRole('button', { name: 'Send' }).click();
        
        await browsePage.waitForLoading();

        await expect(browsePage.page.locator('div').filter({ hasText: /^test comment$/ })).toHaveCount(1);

    })

    client('show activity', async({browsePage}) => {
        await browsePage.goToFirstLevel();

        const name = 'testFolder_' + Date.now();
        await browsePage.addFolder(name);

        await browsePage.page.getByPlaceholder('Name').fill(name);
        const item = await browsePage.page.locator('.nameContainer > .dropzone').first();
        item.dblclick();

        await browsePage.waitForLoading();

        // open info panel
        await browsePage.openInfoPanel();
        await browsePage.page.getByRole('tab', { name: 'Activities' }).click();
        await browsePage.waitForLoading();
        await expect(browsePage.page.getByLabel('Activities').getByText('Activities')).toHaveCount(1);
        await expect(browsePage.page.getByText('Modify document')).toHaveCount(1);

        

    })
    
})