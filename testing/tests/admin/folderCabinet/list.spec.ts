import { test } from '@playwright/test';
import { admin, expect } from '../../../utils/admin';
import { adminURL } from '../../../utils/url';

test.describe('Folder Cabinet Setting', () => {

    admin('show list', async({page}) => {
        await page.goto(adminURL + '/folderCabinet');
        await expect(page).toHaveURL(/.*folderCabinet/);   
        await expect(page.locator('#topBarContainer').getByText('Folder Cabinet Setting')).toBeAttached();                                               
    })
})