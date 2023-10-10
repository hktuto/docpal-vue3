import { test } from '@playwright/test';
import { client, expect } from '../../../utils/client';
test.describe('create folder', () => {


  
  client('from top menu', async ({browsePage}) => {
    const newFolderName = 'testFolder_from_top_' + Date.now();
    // create folder from top menu
    await browsePage.page.locator('#newActionButton').click();
    await browsePage.page.getByRole('menuitem', { name: 'New Folder' }).click();
    await browsePage.page.getByLabel('File Name').fill(newFolderName);
    await browsePage.page.getByRole('button', { name: 'Submit' }).click();
    await browsePage.addItemToDelete(newFolderName)
    await expect(browsePage.page.getByRole('cell', { name: newFolderName })).toHaveCount(1);
  })
  
  
  client('with same name', async ({browsePage}) => {    
    const newFolderName = 'testFolder_from_top_' + Date.now();
    // create first folder
    await browsePage.page.locator('#newActionButton').click();
    await browsePage.page.getByRole('menuitem', { name: 'New Folder' }).click();
    await browsePage.page.getByLabel('File Name').fill(newFolderName);
    await browsePage.page.getByRole('button', { name: 'Submit' }).click();
    await expect(browsePage.page.getByRole('cell', { name: newFolderName })).toHaveCount(1);
    await browsePage.addItemToDelete(newFolderName)
    // create second folder
    await browsePage.page.locator('#newActionButton').click();
    await browsePage.page.getByRole('menuitem', { name: 'New Folder' }).click();
    await browsePage.page.getByLabel('File Name').fill(newFolderName);
    await browsePage.page.getByRole('button', { name: 'Submit' }).click();
    
    await expect(browsePage.page.getByText('The system detected a duplicate file name, please select Rename or Replace for t')).toHaveCount(1);
    
  })
  
})
