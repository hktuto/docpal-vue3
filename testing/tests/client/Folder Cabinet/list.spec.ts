import { test } from '@playwright/test';
import { client, expect } from '../../../utils/client';

test.describe('Folder Cabinet', () => {
    
    client('show list', async({browsePage}) => {
        await expect(browsePage.page).toHaveURL(/.*browse/);
        browsePage.goto('/folderCabinet');

        await expect(browsePage.page).toHaveURL(/.*folderCabinet/);

        // 
        await expect(browsePage.page.getByRole('button', { name: 'Create By' })).toBeAttached();
        await expect(browsePage.page.getByRole('button', { name: 'Status' })).toBeAttached();
        await expect(browsePage.page.getByRole('cell', { name: 'Name' })).toBeAttached();
        await expect(browsePage.page.getByRole('cell', { name: 'Modified Date' })).toBeAttached();
        await expect(browsePage.page.getByRole('cell', { name: 'Creator' })).toBeAttached();
        await expect(browsePage.page.getByRole('cell', { name: 'deadline' })).toBeAttached();
        await expect(browsePage.page.getByRole('cell', { name: 'Document Type' })).toBeAttached();
        await expect(browsePage.page.getByRole('cell', { name: 'Actions' })).toBeAttached();

    })
});