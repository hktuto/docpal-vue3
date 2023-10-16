import { test } from '@playwright/test';
import { admin, expect } from '../../../utils/admin';
import { adminURL } from '../../../utils/url';

test.describe('Vocabulary', () => {

    admin('show vocabulary', async({page}) => {
        await page.goto(adminURL + '/vocabulary');
        await expect(page).toHaveURL(/.*vocabulary/);   
        await expect(page.locator('#topBarContainer').getByText('Vocabulary')).toBeAttached();                                               
    })
})