import { test } from '@playwright/test';
import { client, expect } from '../../../utils/client';


test.describe('External Share', () => {

    client('share file', async({browsePage}) => {
        // step 1 update file
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
          await browsePage.page.getByRole('treeitem').locator('div').filter({ hasText: 'testUpload.txt' }).first().click();
        await browsePage.page.getByRole('button', { name: 'Confirm' }).click();
        

        await browsePage.page.getByPlaceholder('Name').fill('testUpload.txt');

        await browsePage.page.getByRole('cell', { name:'testUpload.txt' }).click({
            button: 'left'
          });
        await browsePage.page.locator('#shareActionButton span').click();
        await browsePage.page.getByRole('button', { name: 'Share' , exact:true }).click({
            button: 'left'
        });
        await browsePage.checkTextExist('External Email Recipients');

        console.log('url : ', browsePage.page.url());

        // await browsePage.page.locator('#mainContainer').getByRole('textbox').first().fill('9394wing@gmail.com');
        // await browsePage.page.locator('#mainContainer').getByRole('textbox').first().press('Enter');
        // await browsePage.page.locator('#mainContainer').getByRole('textbox').first().press('Escape');
        // await browsePage.page.getByLabel('Password').fill('123456');
        // await browsePage.page.getByLabel('Due Date').click();
        // await browsePage.page.getByRole('button', { name: '30 Day' }).click();
        // await browsePage.page.getByRole('button', { name: 'Confirm' }).click();
        // await browsePage.page.getByText('Share infomation has Sent').click();

        // await expect(browsePage.checkTextExist('Share infomation has Sent')).toBeTruthy();

        // await expect(browsePage.page).toHaveURL(/.*browse/);


        // await browsePage.page.locator('#sidebarContainer div').filter({ hasText: 'Share Module' }).click();
        // await browsePage.page.getByText('External Sharing').click();

        // const cell = await browsePage.page.getByRole('cell', { name: '9394wing@gmail.com' })

        // await expect(cell).toBeTruthy();

        // cell.dblclick();

        // const linkInput = await browsePage.page.getByLabel('Share Link');

        // const links = linkInput.inputValue();

        // browsePage.page.goto(`https://${links}`);

        // await browsePage.page.getByLabel('password').fill('123456');

        // await browsePage.page.getByRole('button', { name: 'submit' }).click();
        // await browsePage.page.getByRole('cell', { name: 'testUpload.txt' }).dblclick();

        await browsePage.page.waitForTimeout(10000);


    });
    
});