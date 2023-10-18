import { test } from '@playwright/test';
import { admin, expect } from '../../../utils/admin';
import { adminURL } from '../../../utils/url';

test.describe('Watermark', () => {

    const newWaterMarkName = 'w_' + Date.now().toString().substring(5,9);

    admin('create watermark', async({page}) => {
        await page.goto(adminURL + '/watermark');
        await expect(page).toHaveURL(/.*watermark/);                                                  

        await expect(page.locator('#topBarContainer').getByText('Watermark Setting')).toBeAttached();
        await page.locator('.listActionContainer > .flex-x-center > .svg-icon > path').click();
        await page.getByPlaceholder('New Watermark label').click();
        await page.getByPlaceholder('New Watermark label').fill(newWaterMarkName);
        await page.getByPlaceholder('New Watermark label').press('Enter');
        await page.locator('.detail__tools > div:nth-child(2) > div > .svg-icon').first().click();
    })

    admin('remove watermark', async({page}) => {
        await page.goto(adminURL + '/watermark');
        await expect(page).toHaveURL(/.*watermark/);   
        await expect(page.locator('#topBarContainer').getByText('Watermark Setting')).toBeAttached();
        await page.getByText(newWaterMarkName).click();

        await page.locator('.listItem.selected > .listItemDelete').first().click();
        await page.getByRole('button', { name: 'Yes' }).click();
    })
})