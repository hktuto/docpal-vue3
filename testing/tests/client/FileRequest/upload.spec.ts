import { test } from '@playwright/test';
import { client, expect } from '../../../utils/client';

test.describe('File Upload Request', () => {

    const shareName = 'test-share_' + Date.now();
    const message = 'some message_' + Date.now();

    
    client('create file upload request', async({browsePage}) => {
        await browsePage.goToFirstLevel();

        await browsePage.addFolder(shareName);
        await browsePage.page.getByPlaceholder('Name').fill(shareName);
        const item = await browsePage.page.locator('.nameContainer > .dropzone').first();
        item.dblclick();

        await browsePage.waitForLoading();

        await browsePage.page.locator('#uploadRequestActionButton span').click();
        await browsePage.page.getByLabel('Email').fill('9394wing@gmail.com');
        await browsePage.page.getByLabel('Message').fill(message);
        await browsePage.page.getByLabel('Password').fill('123456');

        await browsePage.page.locator('span').filter({ hasText: '.xls' }).nth(2).click();

        await browsePage.page.locator('li').filter({ hasText: '.xls' }).click();
        await browsePage.page.locator('li').filter({ hasText: '.doc' }).click();
        await browsePage.page.locator('div:nth-child(6) > .el-form-item > .el-form-item__content > .el-select > .select-trigger > .el-select__tags > .el-select__input').press('Tab');
        await browsePage.page.getByRole('button', { name: '30 Day' }).click();
        await browsePage.page.getByRole('button', { name: 'Confirm' }).click();

        await browsePage.checkTextExist("Request email"); 
        
        await browsePage.page.locator('li').filter({ hasText: 'Upload Request' }).click();

        await expect(browsePage.page).toHaveURL(/.*fileRequest/);
        await browsePage.waitForLoading();
        await expect(browsePage.page.getByRole('cell', { name: message })).toHaveCount(1);

    });




});