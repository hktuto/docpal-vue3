import { test } from '@playwright/test';
import { client, expect } from '../../../utils/client';

test.describe('Folder Cabinet', () => {
    
    client('show list', async({cabinetPage}) => {
        // 
        await expect(cabinetPage.page.getByRole('button', { name: 'Create By' })).toBeAttached();
        await expect(cabinetPage.page.getByRole('button', { name: 'Status' })).toBeAttached();
        await expect(cabinetPage.page.getByRole('cell', { name: 'Name' })).toBeAttached();
        await expect(cabinetPage.page.getByRole('cell', { name: 'Modified Date' })).toBeAttached();
        await expect(cabinetPage.page.getByRole('cell', { name: 'Creator' })).toBeAttached();
        await expect(cabinetPage.page.getByRole('cell', { name: 'deadline' })).toBeAttached();
        await expect(cabinetPage.page.getByRole('cell', { name: 'Document Type' })).toBeAttached();
        await expect(cabinetPage.page.getByRole('cell', { name: 'Actions' })).toBeAttached();

    })
});