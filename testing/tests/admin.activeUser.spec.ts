import { test } from '@playwright/test';
import { admin, expect} from '../utils/admin';
test.beforeAll(async () => {
    console.log(process.env.BASEURL)
    console.log('Before tests');
});

test.afterAll(async () => {
    console.log(process.env.BASEURL)
    console.log('After tests');
});
test.describe('User CAL Management ', () => {
    admin('Set Active Disabled', async ({page}) => {
        await page.goto('https://admin.app4.wclsolution.com/user');
        await page.locator('tr:nth-child(5) > .el-table_1_column_4 > .cell > .el-switch > .el-switch__core').click();
        const text = await page.getByText(/^New.*/).textContent()
    })
})
