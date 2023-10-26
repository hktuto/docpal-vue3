import { test } from '@playwright/test';
import { client, expect } from '../../../utils/client';

test.describe('Workflow', () => {

    client('show list', async({workflowPage}) => {


        const tab = ["Avalible Task", "My Task", "Completed Task", "Active Task", "Adhoc Task"];

        for (const cell of tab) {
            await expect(workflowPage.page.getByRole('tab', { name: cell, exact:true })).toBeAttached();
        }

        const myTaskColumn = ["Name", "Workflow", "Status"];
        
        for (const cell of myTaskColumn) {
            await expect(workflowPage.page.getByRole('cell', { name: cell, exact:true })).toBeAttached();
        }

        workflowPage.page.getByRole('tab', { name: 'Avalible Task', exact:true }).click();
        await workflowPage.waitForLoading();

        const availableTaskColumn = ["Name", "Workflow", "Status", "Assignee", "workflow_startUser", "Create Date", "Task Due Date"];
        for (const cell of availableTaskColumn) {
            await expect(workflowPage.page.getByRole('cell', { name: cell, exact:true })).toBeAttached();
        }

        workflowPage.page.getByRole('tab', { name: 'Completed Task', exact:true }).click();
        await workflowPage.waitForLoading();
        
        const completedTaskColumn = ["Name", "Workflow", "Create Date", "Complete Date", "Total Duration"];
        for (const cell of completedTaskColumn) {
            await expect(workflowPage.page.getByRole('cell', { name: cell, exact:true })).toBeAttached();
        }

        workflowPage.page.getByRole('tab', { name: 'Active Task', exact:true }).click();
        await workflowPage.waitForLoading();

        const activeTaskColumn = ["Name", "Workflow", "Assignee", "Create Date",];
        for (const cell of activeTaskColumn) {
            await expect(workflowPage.page.getByRole('cell', { name: cell, exact:true })).toBeAttached();
        }

    });
})