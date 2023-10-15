import { test } from '@playwright/test';
import { client, expect } from '../../../utils/client';

test.describe('Hold Policy', () => {

    client('show list', async({browsePage}) => {
        await expect(browsePage.page).toHaveURL(/.*browse/);
        browsePage.goto('/holdPolicies');

        const filter = ['Policy', 'Apply By', 'Approver']
        for (const cell of filter) {
            await expect(browsePage.page.getByRole('button', { name: cell })).toBeAttached();
        }
        
        const table = ["Name", "Path", "Policy Name", "Apply By", "Approver", "Confirm At", "Actions"]
        for (const cell of table) {
            await expect(browsePage.page.getByRole('cell', { name: cell, exact:true })).toBeAttached();
        }
    });
})