import { test, expect } from '@playwright/test';
import { HoldPolicyManagePage, HoldPolicy, hd_data } from '../utils/admin/hold-policy'
import { SettingsPage } from '../utils/setting-page'
test.describe('create folder', () => {
  test.describe.configure({ mode: 'serial' });
  // admin('holdPolicy[add]', async ({ page }) => {
  //   const holdPolicyManagePage = new HoldPolicyManagePage(page, process.env.ADMIN_BASEURL as string);
  //   await holdPolicyManagePage.goto();
  //   await holdPolicyManagePage.add(hd_data.DD);
  //   await holdPolicyManagePage.add(hd_data.AA);
  //   await holdPolicyManagePage.add(hd_data.AD);
  //   await holdPolicyManagePage.add(hd_data.DA);
  // });

  // const CLIENT_BASE_URL = process.env.BASEURL
  test('/browse1', async ({page}) => {
    const clientPage = new SettingsPage(page, process.env.BASEURL as string)
    await clientPage.login({
      username: process.env.CLIENT_USER as string, 
      password: process.env.CLIENT_PASSWORD as string
    })
    const newFolderName = 'testFolder_from_top_' + Date.now();
    await clientPage.goto('/browse')
    console.log(newFolderName);
    
    // create folder from top menu
    // await browsePage.page.locator('#newActionButton').click();
    // await browsePage.page.getByRole('menuitem', { name: 'New Folder' }).click();
    // await browsePage.page.getByLabel('File Name').fill(newFolderName);
    // await browsePage.page.getByRole('button', { name: 'Submit' }).click();
    // await browsePage.addItemToDelete(newFolderName)
    // await expect(browsePage.page.getByRole('cell', { name: newFolderName })).toHaveCount(1);
  })
  
  
  // test('with same name', async ({browsePage}) => {    
  //   const newFolderName = 'testFolder_from_top_' + Date.now();
  //   // create first folder
  //   await browsePage.page.locator('#newActionButton').click();
  //   await browsePage.page.getByRole('menuitem', { name: 'New Folder' }).click();
  //   await browsePage.page.getByLabel('File Name').fill(newFolderName);
  //   await browsePage.page.getByRole('button', { name: 'Submit' }).click();
  //   await expect(browsePage.page.getByRole('cell', { name: newFolderName })).toHaveCount(1);
  //   await browsePage.addItemToDelete(newFolderName)
  //   // create second folder
  //   await browsePage.page.locator('#newActionButton').click();
  //   await browsePage.page.getByRole('menuitem', { name: 'New Folder' }).click();
  //   await browsePage.page.getByLabel('File Name').fill(newFolderName);
  //   await browsePage.page.getByRole('button', { name: 'Submit' }).click();
    
  //   await expect(browsePage.page.getByText('The system detected a duplicate file name, please select Rename or Replace for t')).toHaveCount(1);
    
  // })
  // admin('holdPolicy[remove]', async ({ page }) => {
  //   const holdPolicyManagePage = new HoldPolicyManagePage(page, process.env.ADMIN_BASEURL as string);
  //   await holdPolicyManagePage.goto();
  //   await holdPolicyManagePage.removeAll(['ut_AA','ut_AD','ut_DA','ut_DD']);
  // });
  test('holdPolicy[remove]', async ({page}) => {
    const adminPage = new SettingsPage(page, process.env.ADMIN_BASEURL as string)
    await adminPage.login({
      username: process.env.CLIENT_USER as string, 
      password: process.env.CLIENT_PASSWORD as string
    })
    const newFolderName = 'testFolder_from_top_' + Date.now();
    await adminPage.goto('/acl')
    console.log(newFolderName);
    //   const holdPolicyManagePage = new HoldPolicyManagePage(page, process.env.ADMIN_BASEURL as string);
    //   await holdPolicyManagePage.goto();
    //   await holdPolicyManagePage.removeAll(['ut_AA','ut_AD','ut_DA','ut_DD']);
  })
})
