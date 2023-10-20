import { test } from '@playwright/test';
import { client, expect } from '../../../utils/client';

test.describe('Hold Policy', () => {

    client('show list', async({holdPage}) => {

        const filter = ['Policy', 'Apply By', 'Approver']
        for (const cell of filter) {
            await expect(holdPage.page.getByRole('button', { name: cell })).toBeAttached();
        }
        
        const table = ["Name", "Path", "Policy Name", "Apply By", "Approver", "Confirm At", "Actions"]
        for (const cell of table) {
            await expect(holdPage.page.getByRole('cell', { name: cell, exact:true })).toBeAttached();
        }
    });
})