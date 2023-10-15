import { test } from '@playwright/test';
import { client, expect } from '../../../utils/client';

test.describe('Retention List', () => {

    client('show list', async({browsePage}) => {
        await expect(browsePage.page).toHaveURL(/.*browse/);
        browsePage.goto('/retention');

        browsePage.page.getByRole('tab', { name: "Retention Done List", exact:true }).click();
        await browsePage.waitForLoading();

        const tabs = ["Retention Done List", "Retention Pending List"];
        for (const cell of tabs) {
            await expect(browsePage.page.getByRole('tab', { name: cell, exact:true })).toBeAttached();
        }
        
        const table = ["Name", "Path", "Policy Name", "Approver", "Confirm At"];
        for (const cell of table) {
            await expect(browsePage.page.getByRole('cell', { name: cell, exact:true })).toBeAttached();
            
        }

        browsePage.page.getByRole('tab', { name: "Retention Pending List", exact:true }).click();
        await browsePage.waitForLoading();

        const table2 = ["Name", "Path", "Policy Name", "Due Date", "Actions"];
        for (const cell of table2) {
            await expect(browsePage.page.getByRole('cell', { name: cell, exact:true })).toBeAttached();
        
        }

    });
})