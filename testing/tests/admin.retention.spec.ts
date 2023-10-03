import { test } from '@playwright/test';
import { admin, expect as adminExpect } from '../utils/admin';
import { client , expect as clientExpect } from '../utils/client';
import { adminURL } from '../utils/url';

import path from 'path';
const uploadFile = path.join(__dirname, './file.txt');

const testRule = {
    name: 'test rule',
    period: '1',
    delay: '0',
    documentType: 'test2',
}

admin.beforeEach(async ({page}) => {
    await page.goto(adminURL+'/retentionManage');
})

test.describe('Admin Retention ', () => {
    
    admin('list retention rule', async ({page}) => {
        await adminExpect(page.getByText('Retention Policies')).toBeAttached() // page title is displayed
        await adminExpect(page.getByRole('button', { name: 'Document Type' })).toBeAttached() // Document Type dropdown is displayed
        await adminExpect(page.getByRole('button', { name: 'Active' })).toBeAttached() // Active dropdown is displayed
        await adminExpect(page.getByRole('button', { name: 'Approval' })).toBeAttached() // Approval dropdown is displayed
        await adminExpect(page.getByRole('button', { name: 'Add' })).toBeAttached() // Add Button is displayed
    })
    
    admin('check create retention form', async ({page}) => {
        await page.getByRole('button', { name: 'Add' }).click()
        await adminExpect(page.getByText('Create Retention Policy')).toBeAttached() // page title is displayed
        // check all fields are displayed
        const elements = [
            page.getByLabel('Policy Name'),
            page.getByLabel('Period', { exact: true }),
            page.getByLabel('Create Retention Policy').getByText('Actions'),
            page.getByText('ArchiveDelete'),
            page.getByLabel('actionDelayDays'),
            page.getByRole('button', { name: 'Days Delay' }),
            page.getByText('Auto Add Hold'),
            page.getByLabel('Document Type'),
            page.getByLabel('Trigger Meta'),
            page.locator('div').filter({ hasText: /^Trigger MetaDocument Type$/ }).getByTitle('insert new row'),
            page.getByRole('button', { name: 'delete this row' }).first(),
            page.getByLabel('Event Type'),
            page.getByLabel('Label'),
            page.getByLabel('Extend Time'),
        ]
        for (const element of elements) {
            await adminExpect(element).toBeAttached()
        }
        // check if disable auto hold checkbox, approved input is displayed
        await page.locator('div').filter({ hasText: /^Auto Add Hold$/ }).nth(1).click();
        await adminExpect(page.getByLabel('Approved By')).toBeVisible()
    })

    

    admin('create retention rule', async ({page}) => {
        
        await page.getByRole('button', { name: 'Add' }).click()
        await adminExpect(page.getByText('Create Retention Policy')).toBeAttached()
        // fill name
        await page.getByLabel('Policy Name').fill(testRule.name)
        // fill period
        await page.getByLabel('Period', { exact: true }).fill(testRule.period);
        // change period unit to days
        await page.getByLabel('periodUnit').click();
        await page.locator('li').filter({ hasText: 'Days' }).click();
        // fill delay
        await page.getByLabel('actionDelayDays').fill('0');
        // set document type
        await page.getByLabel('Document Type').click();
        await adminExpect(page.locator('li').filter({ hasText: testRule.documentType })).toBeAttached();
        await page.getByLabel('Document Type').fill('test2');
        await page.getByLabel('Document Type').press('Enter');
        // set trigger meta
        await page.getByLabel('Trigger Meta').click();
        await page.locator('li').filter({ hasText: /^expired$/ }).click();

        // add new event
        await page.getByLabel('Event Type').click();
        await page.locator('li').filter({ hasText: 'Retent Now' }).click();
        await page.getByLabel('Label').fill('Retent Now');
        // add event time
        await page.getByRole('button', { name: 'Submit' }).click();

        // check if rule is created
        await adminExpect(page.getByText(testRule.name)).toBeAttached();


    })

    admin('test retention filter', async ({page}) => {
        // get all data from table
        await page.getByPlaceholder('Filter By Name').click();
        await page.getByPlaceholder('Filter By Name').fill(testRule.name);

        await page.getByRole('button', { name: 'Document Type' }).click();
        await page.locator('label').filter({ hasText: 'test2' }).click();

        await page.getByRole('button', { name: 'Active' }).click();
        await page.locator('label').filter({ hasText: 'Deactivated' }).click();
        await page.waitForTimeout(1000);
        await adminExpect(page.getByRole('cell', { name: testRule.name })).toBeAttached();
        
        // clean filter
        await page.getByRole('button', { name: 'Clear Filter' }).click();
        
    })

    client('create new document for retention', async ({browsePage}) => {
        const newItemName = 'testRetention_' + Date.now();
        await browsePage.addFolder(newItemName);
        await browsePage.page.getByRole('cell', { name: newItemName }).dblclick();
        const breadCrumb = await browsePage.page.locator('.breadCrumbContainer');
        await clientExpect(breadCrumb.getByText(newItemName)).toBeAttached();
        await browsePage.page.waitForTimeout(1000);
        const fileChooserPromise = browsePage.page.waitForEvent('filechooser');
        await browsePage.page.locator('#newActionButton').click();
        await browsePage.page.getByRole('menuitem', { name: 'File Upload' }).click();
        const fileChooser = await fileChooserPromise;
        await fileChooser.setFiles(uploadFile);
        await browsePage.page.waitForTimeout(1000);
        await browsePage.page.getByRole('button', { name: 'Confirm' }).click();

        await browsePage.removeAll();
        // await clientExpect()
    })



    admin('delete retention rule', async ({page}) => {
        await page.getByPlaceholder('Filter By Name').click();
        await page.getByPlaceholder('Filter By Name').fill(testRule.name);
        await adminExpect(page.getByRole('cell', { name: testRule.name })).toBeAttached();
        await page.waitForTimeout(1000);
        await page.locator('td:nth-child(7) > .cell').first().click();
        await page.getByRole('button', { name: 'OK' }).click();
    })
    
})

