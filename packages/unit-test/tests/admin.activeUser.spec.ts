import { test, expect } from '@playwright/test';

test.describe('User CAL Management ', () => {
    test('Set Active Disabled', async ({page}) => {
        await page.goto('https://admin.app4.wclsolution.com/');
        await page.getByLabel('username').fill('Administrator');
        await page.getByLabel('password').fill('2\'KMzF}zK2ZmwQe');
        await page.getByRole('button', { name: 'Submit' }).click();
        await page.goto('https://admin.app4.wclsolution.com/user');
        await page.locator('tr:nth-child(5) > .el-table_1_column_4 > .cell > .el-switch > .el-switch__core').click();
        const text = await page.getByText(/^New.*/).textContent()
    })
})
