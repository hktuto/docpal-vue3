import { test } from '@playwright/test';
import { admin } from '../utils/admin'
import { HoldPolicyManagePage, HoldPolicy, hd_data } from '../utils/admin/hold-policy'

// admin('holdPolicy[add-remove]', async ({ page }) => {
    // const holdPolicyManagePage = new HoldPolicyManagePage(page, process.env.ADMIN_BASEURL as string);
    // await holdPolicyManagePage.goto();
    // await holdPolicyManagePage.add(hd_data.DD);
    // await holdPolicyManagePage.add(hd_data.AA);
    // await holdPolicyManagePage.add(hd_data.AD);
    // await holdPolicyManagePage.add(hd_data.DA);
    // await holdPolicyManagePage.edit(hd_data.DA.policyName)
    // await holdPolicyManagePage.removeAll();
// });
