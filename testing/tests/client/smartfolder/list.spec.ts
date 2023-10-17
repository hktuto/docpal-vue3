import { test } from '@playwright/test';
import { client, expect } from '../../../utils/client';

test.describe('Smart Folder', () => {

    client('show list', async({smartFolderPage}) => {

        
        const table = ["Name", "Document Type"]
        for (const cell of table) {
            await expect(smartFolderPage.page.getByRole('cell', { name: cell, exact:true })).toBeAttached();
            
        }


    });
})