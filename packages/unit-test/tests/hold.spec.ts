import { test, expect } from '@playwright/test';
import { HoldPolicyManagePage, HoldPolicy, hd_data } from '../utils/admin/hold-policy'
import { SettingsPage } from '../utils/setting-page'
import { BrowseHoldPage } from '../utils/client/browse-hold'
test.describe('hold process', () => {
  test.describe.configure({ mode: 'serial' });
  test('admin-holdPolicy-add', async ({ page }) => {
    const adminPage = new SettingsPage(page, process.env.ADMIN_BASEURL as string)
    await adminPage.login({
      username: process.env.CLIENT_USER as string, 
      password: process.env.CLIENT_PASSWORD as string
    })
    await adminPage.goto('/holdPoliciesManage')
    const holdPolicyManagePage = new HoldPolicyManagePage(page, process.env.ADMIN_BASEURL as string);
    await holdPolicyManagePage.add(hd_data.DD);
    await holdPolicyManagePage.add(hd_data.AA);
    await holdPolicyManagePage.add(hd_data.AD);
    await holdPolicyManagePage.add(hd_data.DA);
  });

  test('client-hold', async ({page}) => {
    const newFolderName = 'testFolder_from_top_' + Date.now();
    const parentPath = '/browse?path=/default-domain'
    const clientPage = new SettingsPage(page, process.env.BASEURL as string)
    await clientPage.login({
      username: process.env.CLIENT_USER as string, 
      password: process.env.CLIENT_PASSWORD as string
    })

    const browseHoldPage = new BrowseHoldPage(page, clientPage)
    await clientPage.goto(parentPath)
    await browseHoldPage.addFolder(newFolderName)
    await clientPage.goto(`${parentPath}/${newFolderName}`)
    await browseHoldPage.docAddHold(hd_data.AA)
    await browseHoldPage.docRemoveHold(hd_data.AA)
    await browseHoldPage.removeAllDoc()
    console.log(newFolderName);
  })

  test('admin-holdPolicy-remove', async ({page}) => {
    const adminPage = new SettingsPage(page, process.env.ADMIN_BASEURL as string)
    await adminPage.login({
      username: process.env.CLIENT_USER as string, 
      password: process.env.CLIENT_PASSWORD as string
    })
    await adminPage.goto('/holdPoliciesManage')
    const holdPolicyManagePage = new HoldPolicyManagePage(page, process.env.ADMIN_BASEURL as string);
    await holdPolicyManagePage.removeAll(['ut_AA','ut_AD','ut_DA','ut_DD']);
  })
})
