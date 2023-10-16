import { test } from '@playwright/test';
import { client, expect } from '../../../utils/client';

test.describe('Smart Folder', () => {

    client('show list', async({browsePage}) => {
        await expect(browsePage.page).toHaveURL(/.*browse/);
        browsePage.goto('/smartFolder');

        
        const table = ["Name", "Path", "Modified Date", "Document Type"]
        for (const cell of table) {
            await expect(browsePage.page.getByRole('cell', { name: cell, exact:true })).toBeAttached();
            
        }


    });
})