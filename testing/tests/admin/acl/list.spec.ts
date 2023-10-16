import { test } from '@playwright/test';
import { admin, expect } from '../../../utils/admin';

test.describe('ACL', () => {

    admin('show acl', async({page}) => {
        await page.getByRole('treeitem', { name: 'Root' }).locator('div').first().click();
        await expect(page.getByPlaceholder('Clearance Level')).toBeAttached();
        await expect(page.locator('.right > .flex-x-center > .svg-icon')).toBeAttached();
        await expect(page.getByRole('heading', { name: 'Local' })).toBeAttached();
    })
})