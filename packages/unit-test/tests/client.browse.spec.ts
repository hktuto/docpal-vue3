import { test, expect } from '@playwright/test';

test.describe('create folder', () => {
  
  test('from top menu', async ({page}) => {
    const newFolderName = 'testFolder_from_top_' + Date.now();
    await page.goto('/browse');
    const firstItemInTable = await page.locator('.nameContainer > .dropzone').first()
    const title = await firstItemInTable.innerText();
    await firstItemInTable.dblclick();
    await expect(page.locator('.breadContainer').filter({ hasText: title })).toHaveCount(1);
    
    // create folder from top menu
    await page.locator('#newActionButton').click();
    await page.getByRole('menuitem', { name: 'New Folder' }).click();
    await page.getByLabel('File Name').fill(newFolderName);
    await page.getByRole('button', { name: 'Submit' }).click();

    await page.getByRole('cell', { name: newFolderName }).click({
      button: 'right'
    });
    await page.getByRole('menuitem', { name: 'Delete' }).click();
    await page.getByRole('button', { name: 'OK' }).click();
    
  })
  
  test('from right click', async ({page}) => {
    const newFolderName = 'testFolder_right_click_' + Date.now();
    const secondFolderName = 'testFolder_' + Date.now() + 1;
    
    await page.goto('/browse');
    const firstItemInTable = await page.locator('.nameContainer > .dropzone').first()
    const title = await firstItemInTable.innerText();
    await firstItemInTable.dblclick();
    await expect(page.locator('.breadContainer').filter({ hasText: title })).toHaveCount(1);

    // create folder from top menu
    await page.locator('#newActionButton').click();
    await page.getByRole('menuitem', { name: 'New Folder' }).click();
    await page.getByLabel('File Name').fill(newFolderName);
    await page.getByRole('button', { name: 'Submit' }).click();
    await page.getByRole('cell', { name: newFolderName }).click({
      button: 'right'
    });

    await page.getByRole('menuitem', { name: 'New Folder' }).click();
    await page.getByLabel('File Name').fill(secondFolderName);
    await page.getByRole('button', { name: 'Submit' }).click();
    
    await page.getByRole('cell', { name: newFolderName }).dblclick();
    // delete folder
    await page.getByRole('cell', { name: secondFolderName }).click({
      button: 'right'
    });
    await page.getByRole('menuitem', { name: 'Delete' }).click();
    await page.getByRole('button', { name: 'OK' }).click();

    await page.getByText('Account Documents').click();
    // delete folder
    await page.getByRole('cell', { name: newFolderName }).click({
      button: 'right'
    });
    await page.getByRole('menuitem', { name: 'Delete' }).click();
    await page.getByRole('button', { name: 'OK' }).click();
    
  })
  
  test('with same name', async ({page}) => {
    // go to sub folder
    const newFolderName = 'testFolder_same_name' + Date.now();
    await page.goto('/browse');
    const firstItemInTable = await page.locator('.nameContainer > .dropzone').first()
    const title = await firstItemInTable.innerText();
    await firstItemInTable.dblclick();
    
    // create first folder
    await page.locator('#newActionButton').click();
    await page.getByRole('menuitem', { name: 'New Folder' }).click();
    await page.getByLabel('File Name').fill(newFolderName);
    await page.getByRole('button', { name: 'Submit' }).click();
    
    // create second folder
    await page.locator('#newActionButton').click();
    await page.getByRole('menuitem', { name: 'New Folder' }).click();
    await page.getByLabel('File Name').fill(newFolderName);
    await page.getByRole('button', { name: 'Submit' }).click();
    
    await expect(page.getByText('The system detected a duplicate file name, please select Rename or Replace for t')).toHaveCount(1);
  })
  
})
