import { test } from '@playwright/test';
import { client, expect } from '../../../utils/client';

test.describe('Internal Share', () => {

    client('start share, remove share', async({browsePage}) => {
        await browsePage.goToFirstLevel();
        const name = 'testShare_' + Date.now();
        await browsePage.addFolder(name);
        
        await browsePage.waitForLoading()

        await browsePage.page.getByPlaceholder('Name').fill(name);
        await browsePage.page.getByRole('cell', { name }).click({
            button: 'right'
          });
        await browsePage.page.getByRole('menuitem', { name: 'Internal Sharing' }).click();

        const tab = await browsePage.page.locator('div:nth-child(2) > .el-form-item > .el-form-item__content > .el-select > .select-trigger > .el-select__tags')
        tab.click();
        tab.locator('input').fill('seantsang');
        await browsePage.page.getByRole('listitem').click();

        await browsePage.page.getByLabel('Right').click();
        await browsePage.page.locator('li').filter({ hasText: /^Manage$/ }).click();

        await browsePage.page.getByRole('button', { name: 'Submit' }).click();
        
        await browsePage.page.locator('#sidebarContainer div').filter({ hasText: 'Share Module' }).click();
        await browsePage.page.getByRole('menuitem', { name: 'Share With Me' }).click();

        await expect(browsePage.page).toHaveURL(/.*shareMe/);
        await browsePage.waitForLoading();

        await expect(browsePage.page.getByRole('cell', { name })).toHaveCount(1);

        await browsePage.page.locator('#sidebarContainer div').filter({ hasText: 'Share Module' }).click();
        
        await browsePage.page.getByRole('menuitem', { name: 'Share With Other' }).click();

        await expect(browsePage.page).toHaveURL(/.*shareOther/);
        await browsePage.waitForLoading();

        await expect(browsePage.page.getByRole('cell', { name })).toHaveCount(1);

        await browsePage.page.getByRole('row', { name: `${name} seantsang` }).getByRole('button').nth(1).click();
        await browsePage.page.getByRole('button', { name: 'OK' }).click();
        await browsePage.waitForLoading();

        await expect(browsePage.page.getByRole('cell', { name })).toHaveCount(0);


    })

});