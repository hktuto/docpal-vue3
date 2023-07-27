import { test, expect } from '@playwright/test';
test.describe('folder cabinet', () => {
    test('new item', async ({ page }) => {
        await page.goto('/folderCabinet?tab=974e1a0c-7718-4b22-b4a9-b404f2760be1&time=1690444512226');
        await page.getByRole('button', { name: 'New Item' }).click();
        await page.getByRole('button', { name: 'Next', exact: true }).click();
        await page.getByRole('treeitem', { name: 'folder1' }).nth(1).click();
        await page.locator('div').filter({ hasText: /^folder1 \* car:country$/ }).locator('input').click();
        await page.getByText('Afghanistan').click();
        await page.getByRole('treeitem', { name: 'ttt' }).locator('path').nth(4).click();
        await page.getByRole('treeitem', { name: 'ttt' }).setInputFiles('readme.pdf');
        await page.getByRole('button', { name: 'Submit' }).click();
    });
    test('new duplicate item', async ({ page }) => {
        await page.goto('/folderCabinet?tab=974e1a0c-7718-4b22-b4a9-b404f2760be1&time=1690444512226');
        await page.getByRole('button', { name: 'New Item' }).click();
        await page.getByRole('button', { name: 'Next', exact: true }).click();
        await page.getByRole('treeitem', { name: 'folder1' }).nth(1).click();
        await page.locator('div').filter({ hasText: /^folder1 \* car:country$/ }).locator('input').click();
        await page.getByText('Afghanistan').click();
        await page.getByRole('treeitem', { name: 'ttt' }).locator('path').nth(4).click();
        await page.getByRole('treeitem', { name: 'ttt' }).setInputFiles('readme.pdf');
        await page.getByRole('button', { name: 'Submit' }).click();
    });
})