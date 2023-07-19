import { test, expect } from '@playwright/test';

test.describe('browse', () => {

  
  test('create folder right click on breadcrumb', async ({page}) => {
    const newFolderName = 'testFolder_' + Date.now();
    await page.goto('/browse');
    const firstItemInTable = await page.locator('.nameContainer > .dropzone').first()
    const title = await firstItemInTable.innerText();
    await firstItemInTable.dblclick();
    await expect(page.locator('.breadContainer').filter({ hasText: title })).toHaveCount(1);
    
    await page.getByText('Account Documents').first().click({
      button: 'right'
    });
    await page.getByRole('menuitem', { name: 'New Folder' }).click();
    await page.getByLabel('File Name').click();
    await page.getByLabel('File Name').fill(newFolderName);
    await page.getByRole('button', { name: 'Submit' }).click();
    await expect(page.getByRole('cell', { name: newFolderName })).toHaveCount(1);

    await page.getByRole('cell', { name: newFolderName }).click({
      button: 'right'
    });
    await page.getByRole('menuitem', { name: 'Delete' }).click();
    await page.getByRole('button', { name: 'OK' }).click();
  })
  
  
})
